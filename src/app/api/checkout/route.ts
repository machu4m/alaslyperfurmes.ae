import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { generateOrderNumber } from "@/lib/utils";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  locale: z.enum(["en", "ar"]),
  paymentMethod: z.enum(["card", "cod"]),
  customer: z.object({
    fullName: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(5),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional().or(z.literal("")),
    city: z.string().min(1),
    country: z.string().min(2),
    notes: z.string().optional().or(z.literal("")),
  }),
  items: z
    .array(
      z.object({
        variantId: z.string().uuid(),
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1),
});

// Flat GCC shipping fee for the scaffold — replace with a real rate table
// (by country / weight) or a shipping-rate API once that's decided.
const SHIPPING_FEE = 25;

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { locale, paymentMethod, customer, items } = parsed.data;
  const supabase = createAdminClient();

  // Re-fetch price/stock/name server-side — never trust client-submitted prices.
  const variantIds = items.map((i) => i.variantId);
  const { data: variants, error: variantsError } = await supabase
    .from("product_variants")
    .select(
      "id, sku, size_ml, price, stock_quantity, batch_code, product_id, products(name_en, name_ar)"
    )
    .in("id", variantIds);

  if (variantsError || !variants) {
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }

  const lineItems = items.map((item) => {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant) throw new Error(`variant_not_found:${item.variantId}`);
    if (variant.stock_quantity < item.quantity) {
      throw new Error(`insufficient_stock:${item.variantId}`);
    }
    const product = variant.products as unknown as {
      name_en: string;
      name_ar: string;
    };
    return {
      variantId: variant.id,
      productId: variant.product_id,
      sku: variant.sku,
      sizeMl: variant.size_ml,
      unitPrice: variant.price,
      quantity: item.quantity,
      lineTotal: variant.price * item.quantity,
      nameEn: product.name_en,
      nameAr: product.name_ar,
      // Snapshotted onto order_items below so the order confirmation always
      // shows the batch actually shipped, even if the variant's current
      // batch_code changes later (new stock in, different batch).
      batchCode: variant.batch_code as string | null,
    };
  });

  const subtotal = lineItems.reduce((sum, i) => sum + i.lineTotal, 0);
  const total = subtotal + SHIPPING_FEE;
  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: customer.fullName,
      email: customer.email || null,
      phone: customer.phone,
      shipping_address_line1: customer.addressLine1,
      shipping_address_line2: customer.addressLine2 || null,
      city: customer.city,
      country: customer.country,
      locale,
      payment_method: paymentMethod,
      payment_status: "pending",
      fulfillment_status: "pending",
      subtotal,
      shipping_fee: SHIPPING_FEE,
      total,
      currency: "AED",
      customer_notes: customer.notes || null,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "order_create_failed" }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    lineItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId,
      product_name_en: item.nameEn,
      product_name_ar: item.nameAr,
      size_ml: item.sizeMl,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      line_total: item.lineTotal,
      batch_code: item.batchCode,
    }))
  );

  if (itemsError) {
    return NextResponse.json({ error: "order_items_failed" }, { status: 500 });
  }

  // Reserve stock immediately for both payment methods; a Stripe session that
  // expires unclaimed restores it (see /api/webhooks/stripe).
  await Promise.all(
    lineItems.map((item) =>
      supabase.rpc("decrement_variant_stock", {
        variant_id: item.variantId,
        amount: item.quantity,
      })
    )
  );

  if (paymentMethod === "cod") {
    return NextResponse.json({ orderNumber: order.order_number });
  }

  const stripe = getStripe();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "aed",
        unit_amount: Math.round(item.unitPrice * 100),
        product_data: {
          name: `${locale === "ar" ? item.nameAr : item.nameEn} (${item.sizeMl}ml)`,
        },
      },
    })),
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: SHIPPING_FEE * 100, currency: "aed" },
          display_name: "Standard Shipping",
        },
      },
    ],
    customer_email: customer.email || undefined,
    metadata: { orderId: order.id, orderNumber: order.order_number },
    success_url: `${siteUrl}/${locale}/checkout/success?order=${order.order_number}`,
    cancel_url: `${siteUrl}/${locale}/checkout`,
  });

  await supabase
    .from("orders")
    .update({ stripe_checkout_session_id: session.id })
    .eq("id", order.id);

  return NextResponse.json({ redirectUrl: session.url });
}
