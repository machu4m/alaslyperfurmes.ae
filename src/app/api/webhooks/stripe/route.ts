import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            stripe_payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id,
          })
          .eq("id", orderId);
      }
      break;
    }

    case "checkout.session.expired": {
      // Stock was reserved at checkout creation — release it since the
      // customer never completed payment.
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        const { data: items } = await supabase
          .from("order_items")
          .select("variant_id, quantity")
          .eq("order_id", orderId);

        await Promise.all(
          (items ?? [])
            .filter((i) => i.variant_id)
            .map((i) =>
              supabase.rpc("restock_variant", {
                variant_id: i.variant_id,
                amount: i.quantity,
              })
            )
        );

        await supabase
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("id", orderId);
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
