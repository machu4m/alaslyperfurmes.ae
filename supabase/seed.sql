-- =====================================================================
-- Sample seed data for local development / preview environments.
-- Run after schema.sql. Safe to re-run against an empty database only
-- (slugs/SKUs are unique, so re-running twice will fail on conflict).
-- =====================================================================

insert into scent_families (slug, name_en, name_ar, sort_order) values
  ('oud', 'Oud', 'عود', 1),
  ('floral', 'Floral', 'زهري', 2),
  ('fresh', 'Fresh', 'منعش', 3),
  ('oriental', 'Oriental', 'شرقي', 4),
  ('woody', 'Woody', 'خشبي', 5),
  ('citrus', 'Citrus', 'حمضي', 6);

insert into collections (slug, name_en, name_ar, description_en, description_ar, is_featured, sort_order) values
  ('bestsellers', 'Bestsellers', 'الأكثر مبيعاً', 'Our most loved fragrances.', 'أكثر عطورنا محبة لدى عملائنا.', true, 1),
  ('signature-collection', 'Signature Collection', 'مجموعة التوقيع', 'Where the Alasly story began.', 'من هنا بدأت حكاية الأصلي.', true, 2),
  ('limited-edition', 'Limited Edition', 'إصدار محدود', 'Rare blends, produced in small batches.', 'مزيج نادر يُصنع بكميات محدودة.', false, 3);

-- ---------------------------------------------------------------------
-- Product 1: Oud Al Malaki
-- ---------------------------------------------------------------------
with new_product as (
  insert into products (
    slug, name_en, name_ar,
    short_description_en, short_description_ar,
    description_en, description_ar,
    mood_en, mood_ar,
    gender, concentration_en, concentration_ar,
    sku_prefix, is_featured,
    meta_title_en, meta_title_ar,
    meta_description_en, meta_description_ar
  ) values (
    'oud-al-malaki',
    'Oud Al Malaki', 'عود الملكي',
    'A royal oud for evenings that demand presence.', 'عود ملكي للأمسيات التي تستحق الحضور.',
    'Oud Al Malaki opens with a dramatic blend of Cambodian oud and saffron, settling into a warm heart of rose and amber before a smoky, resinous base that lingers for hours.',
    'يفتح عود الملكي بمزيج درامي من العود الكمبودي والزعفران، لينتقل إلى قلب دافئ من الورد والعنبر، وقاعدة دخانية راتنجية تدوم لساعات.',
    'Evening wear, formal occasions, cool weather.', 'للسهرات والمناسبات الرسمية وأجواء الطقس البارد.',
    'unisex', 'Eau de Parfum', 'أو دو بارفان',
    'ALM', true,
    -- Manual SEO override, to show the override path works — every other
    -- seed product falls through to the generated title/description
    -- template instead (see src/lib/seo.ts).
    'Oud Al Malaki Price in Dubai | Authentic Al Asly UAE',
    'سعر عود الملكي في دبي | الأصلي عطور أصلية الإمارات',
    'Oud Al Malaki (EDP) — 100% authentic Al Asly oud, sourced directly from authorized dealers in Dubai, UAE. Cambodian oud, saffron, rose and amber for evening wear.',
    'عود الملكي (EDP) — عطر عود أصلي ١٠٠٪ من الأصلي، مصدره مباشر من موزعين معتمدين في دبي، الإمارات. عود كمبودي وزعفران وورد وعنبر، مثالي للسهرات.'
  ) returning id
)
insert into product_notes (product_id, position, name_en, name_ar, sort_order)
select id, 'top', 'Saffron', 'زعفران', 1 from new_product
union all select id, 'top', 'Cardamom', 'هيل', 2 from new_product
union all select id, 'middle', 'Rose', 'ورد', 1 from new_product
union all select id, 'middle', 'Amber', 'عنبر', 2 from new_product
union all select id, 'base', 'Cambodian Oud', 'عود كمبودي', 1 from new_product
union all select id, 'base', 'Musk', 'مسك', 2 from new_product;

insert into product_scent_families (product_id, scent_family_id, is_primary)
select p.id, sf.id, true from products p, scent_families sf
where p.slug = 'oud-al-malaki' and sf.slug = 'oud';
insert into product_scent_families (product_id, scent_family_id, is_primary)
select p.id, sf.id, false from products p, scent_families sf
where p.slug = 'oud-al-malaki' and sf.slug = 'oriental';

insert into product_collections (product_id, collection_id)
select p.id, c.id from products p, collections c
where p.slug = 'oud-al-malaki' and c.slug in ('bestsellers', 'signature-collection');

insert into product_variants (product_id, sku, size_ml, price, retail_price, stock_quantity, is_default, batch_code)
select id, 'ALM-50', 50, 480.00, 560.00, 40, false, 'DXB-ALM50-2408' from products where slug = 'oud-al-malaki'
union all
select id, 'ALM-100', 100, 780.00, 950.00, 25, true, 'DXB-ALM100-2408' from products where slug = 'oud-al-malaki';

insert into product_images (product_id, url, alt_en, alt_ar, is_primary, sort_order)
select id, '/images/products/oud-al-malaki-1.jpg', 'Oud Al Malaki bottle', 'زجاجة عود الملكي', true, 1 from products where slug = 'oud-al-malaki'
union all
select id, '/images/products/oud-al-malaki-2.jpg', 'Oud Al Malaki lifestyle', 'عود الملكي أسلوب حياة', false, 2 from products where slug = 'oud-al-malaki';

-- ---------------------------------------------------------------------
-- Product 2: Zahrat Al Fajr (floral, women)
-- ---------------------------------------------------------------------
with new_product as (
  insert into products (
    slug, name_en, name_ar,
    short_description_en, short_description_ar,
    description_en, description_ar,
    mood_en, mood_ar,
    gender, concentration_en, concentration_ar,
    sku_prefix, is_featured
  ) values (
    'zahrat-al-fajr',
    'Zahrat Al Fajr', 'زهرة الفجر',
    'A luminous bouquet inspired by the first light of dawn.', 'باقة مضيئة مستوحاة من ضوء الفجر الأول.',
    'Zahrat Al Fajr blends white florals with a soft citrus opening and a creamy sandalwood base, designed for daylight elegance.',
    'تمزج زهرة الفجر بين الزهور البيضاء وافتتاحية حمضية ناعمة وقاعدة خشب الصندل الكريمية، لتمنحك أناقة النهار.',
    'Daytime wear, spring and summer, office to brunch.', 'للنهار، وأجواء الربيع والصيف، ومن العمل إلى النزهات.',
    'women', 'Eau de Parfum', 'أو دو بارفان',
    'ZAF', true
  ) returning id
)
insert into product_notes (product_id, position, name_en, name_ar, sort_order)
select id, 'top', 'Bergamot', 'برغموت', 1 from new_product
union all select id, 'top', 'Mandarin', 'يوسفي', 2 from new_product
union all select id, 'middle', 'Jasmine', 'ياسمين', 1 from new_product
union all select id, 'middle', 'Lily of the Valley', 'زنبق الوادي', 2 from new_product
union all select id, 'base', 'Sandalwood', 'خشب الصندل', 1 from new_product
union all select id, 'base', 'White Musk', 'مسك أبيض', 2 from new_product;

insert into product_scent_families (product_id, scent_family_id, is_primary)
select p.id, sf.id, true from products p, scent_families sf
where p.slug = 'zahrat-al-fajr' and sf.slug = 'floral';

insert into product_collections (product_id, collection_id)
select p.id, c.id from products p, collections c
where p.slug = 'zahrat-al-fajr' and c.slug = 'bestsellers';

insert into product_variants (product_id, sku, size_ml, price, retail_price, stock_quantity, is_default)
select id, 'ZAF-30', 30, 220.00, 260.00, 60, false from products where slug = 'zahrat-al-fajr'
union all
select id, 'ZAF-50', 50, 340.00, 400.00, 45, true from products where slug = 'zahrat-al-fajr'
union all
select id, 'ZAF-100', 100, 520.00, null, 20, false from products where slug = 'zahrat-al-fajr';

insert into product_images (product_id, url, alt_en, alt_ar, is_primary, sort_order)
select id, '/images/products/zahrat-al-fajr-1.jpg', 'Zahrat Al Fajr bottle', 'زجاجة زهرة الفجر', true, 1 from products where slug = 'zahrat-al-fajr';

-- ---------------------------------------------------------------------
-- Product 3: Nasim Al Sahra (fresh, men)
-- ---------------------------------------------------------------------
with new_product as (
  insert into products (
    slug, name_en, name_ar,
    short_description_en, short_description_ar,
    description_en, description_ar,
    mood_en, mood_ar,
    gender, concentration_en, concentration_ar,
    sku_prefix, is_featured
  ) values (
    'nasim-al-sahra',
    'Nasim Al Sahra', 'نسيم الصحراء',
    'A crisp desert breeze in a bottle.', 'نسيم صحراوي منعش في زجاجة واحدة.',
    'Nasim Al Sahra opens with sparkling citrus and marine notes over a dry, ambery woods base — built for everyday wear in the heat.',
    'يفتح نسيم الصحراء بحمضيات لامعة ونفحات بحرية فوق قاعدة خشبية عنبرية جافة، مصمم للاستخدام اليومي في الأجواء الحارة.',
    'Daily wear, hot climates, office and casual.', 'للاستخدام اليومي، الأجواء الحارة، العمل والإطلالات غير الرسمية.',
    'men', 'Eau de Toilette', 'أو دو تواليت',
    'NAS', false
  ) returning id
)
insert into product_notes (product_id, position, name_en, name_ar, sort_order)
select id, 'top', 'Grapefruit', 'جريب فروت', 1 from new_product
union all select id, 'top', 'Sea Notes', 'نفحات بحرية', 2 from new_product
union all select id, 'middle', 'Lavender', 'خزامى', 1 from new_product
union all select id, 'base', 'Ambergris', 'كهرمان', 1 from new_product
union all select id, 'base', 'Cedarwood', 'خشب الأرز', 2 from new_product;

insert into product_scent_families (product_id, scent_family_id, is_primary)
select p.id, sf.id, true from products p, scent_families sf
where p.slug = 'nasim-al-sahra' and sf.slug = 'fresh';
insert into product_scent_families (product_id, scent_family_id, is_primary)
select p.id, sf.id, false from products p, scent_families sf
where p.slug = 'nasim-al-sahra' and sf.slug = 'citrus';

insert into product_variants (product_id, sku, size_ml, price, stock_quantity, is_default)
select id, 'NAS-100', 100, 260.00, 70, true from products where slug = 'nasim-al-sahra';

insert into product_images (product_id, url, alt_en, alt_ar, is_primary, sort_order)
select id, '/images/products/nasim-al-sahra-1.jpg', 'Nasim Al Sahra bottle', 'زجاجة نسيم الصحراء', true, 1 from products where slug = 'nasim-al-sahra';

-- ---------------------------------------------------------------------
-- ---------------------------------------------------------------------
-- Journal: long-form SEO content — scent guides and comparison guides.
-- content_en/content_ar are Markdown (rendered by
-- src/components/journal/markdown-content.tsx); relative links like
-- /product/oud-al-malaki or /shop?scentFamily=oud are written without a
-- locale prefix and get one added automatically at render time.
-- ---------------------------------------------------------------------

-- Post 1: general guide, not tied to a scent family
insert into journal_posts (
  slug, title_en, title_ar,
  excerpt_en, excerpt_ar,
  content_en, content_ar,
  cover_image_url, cover_image_alt_en, cover_image_alt_ar,
  is_published, published_at
) values (
  'how-to-pick-your-signature-scent',
  'How to Pick Your Signature Scent', 'كيف تختار عطرك المميز',
  'A short guide to finding the fragrance that becomes unmistakably yours.', 'دليل مختصر لإيجاد العطر الذي يصبح بصمتك الخاصة.',
  '## Start With the Notes Pyramid

Every fragrance is built in three layers: top notes (the first 15 minutes), middle notes (the heart, once it settles), and base notes (what lingers on your skin hours later). Judge a perfume on the base, not the spray you smell in the store — that''s the part you''ll actually wear all day.

## Match the Scent to the Occasion

- **Oud and oriental** — evenings, formal occasions, cooler weather
- **Fresh and citrus** — daily wear, hot climates, office
- **Floral** — daytime, spring/summer, lighter settings

## Test It on Skin, Not Paper

A fragrance reads differently on your skin than on a card — body chemistry changes how top and base notes develop. If you can, wear a sample for a full day before committing to a full bottle.

Ready to start testing? Browse our [current picks](/shop).',
  '## ابدأ بهرم مكونات العطر

يُبنى كل عطر على ثلاث طبقات: مقدمة (أول ١٥ دقيقة)، قلب (بعد أن يستقر العطر)، وقاعدة (ما يبقى على بشرتك بعد ساعات). احكم على العطر من خلال قاعدته وليس من الرشة الأولى التي تشمها في المتجر — فتلك هي الطبقة التي سترتديها فعلياً طوال اليوم.

## اختر العطر المناسب للمناسبة

- **العود والشرقي** — للسهرات والمناسبات الرسمية وأجواء الطقس البارد
- **المنعش والحمضي** — للاستخدام اليومي والأجواء الحارة والعمل
- **الزهري** — للنهار وأجواء الربيع والصيف والإطلالات الأخف

## جربه على بشرتك، لا على الورق

يظهر العطر بشكل مختلف على بشرتك عنه على بطاقة الاختبار — فكيمياء الجسم تُغيّر من تطور المقدمة والقاعدة. إن استطعت، جرّب العينة ليوم كامل قبل شراء الزجاجة الكاملة.

مستعد للبدء؟ تصفح [اختياراتنا الحالية](/shop).',
  '/images/journal/signature-scent-guide.jpg', 'Perfume notes pyramid illustration', 'رسم توضيحي لهرم مكونات العطر',
  true, now() - interval '14 days'
);

-- Post 2: "Best Oud Perfumes in Dubai 2026" — tagged 'oud', links to a
-- specific product and to the Authenticity page.
with new_post as (
  insert into journal_posts (
    slug, title_en, title_ar,
    excerpt_en, excerpt_ar,
    content_en, content_ar,
    cover_image_url, cover_image_alt_en, cover_image_alt_ar,
    meta_title_en, meta_title_ar,
    meta_description_en, meta_description_ar,
    is_published, published_at
  ) values (
    'best-oud-perfumes-in-dubai-2026',
    'Best Oud Perfumes in Dubai 2026', 'أفضل عطور العود في دبي ٢٠٢٦',
    'Our current picks for authentic oud, from everyday wear to statement evening scents.', 'اختياراتنا الحالية من عطور العود الأصلية، من الاستخدام اليومي إلى عطور السهرات المميزة.',
    '## Why Oud, and Why Now

Oud remains the fragrance most associated with the UAE — but it''s also the most counterfeited. Before you buy, read our [authenticity page](/authenticity) on how we source directly from authorized Dubai dealers.

## Our Current Pick

**[Oud Al Malaki](/product/oud-al-malaki)** opens with Cambodian oud and saffron, settling into rose and amber over a smoky, resinous base — built for evenings and formal occasions in cooler weather. Every bottle ships with its batch code on the order confirmation.

## How to Wear Oud

Oud is concentrated — two sprays on pulse points (wrists, neck) is enough for most evenings. It develops over hours, so judge it after 30 minutes on skin, not straight out of the bottle.

Browse every oud fragrance we currently carry below.',
    '## لماذا العود، ولماذا الآن

يبقى العود العطر الأكثر ارتباطاً بالإمارات — لكنه أيضاً الأكثر عرضة للتقليد. قبل الشراء، اطّلع على [صفحة الأصالة](/authenticity) لتعرف كيف نستورد مباشرة من موزعين معتمدين في دبي.

## اختيارنا الحالي

يفتح **[عود الملكي](/product/oud-al-malaki)** بالعود الكمبودي والزعفران، لينتقل إلى الورد والعنبر فوق قاعدة دخانية راتنجية — مثالي للسهرات والمناسبات الرسمية في الطقس البارد. كل زجاجة تصل مع رمز دفعتها مذكوراً في تأكيد الطلب.

## كيف ترتدي العود

العود مركّز — رشتان على نقاط النبض (المعصمين والرقبة) تكفيان لمعظم السهرات. يتطور العطر خلال ساعات، لذا احكم عليه بعد ٣٠ دقيقة على البشرة، لا مباشرة من الزجاجة.

تصفح كل عطور العود المتوفرة لدينا حالياً أدناه.',
    '/images/journal/best-oud-dubai-2026.jpg', 'Oud perfume bottles on display', 'زجاجات عطور العود معروضة',
    'Best Oud Perfumes in Dubai 2026 | Authentic Al Asly UAE',
    'أفضل عطور العود في دبي ٢٠٢٦ | الأصلي عطور أصلية الإمارات',
    'Our current picks for authentic oud perfumes in Dubai, 2026 — sourced directly from authorized dealers, with batch codes you can verify.',
    'اختياراتنا الحالية من عطور العود الأصلية في دبي لعام ٢٠٢٦ — مصدرها مباشر من موزعين معتمدين، مع أرقام دفعات يمكنك التحقق منها.',
    true, now() - interval '5 days'
  ) returning id
)
insert into journal_post_scent_families (journal_post_id, scent_family_id)
select np.id, sf.id from new_post np, scent_families sf where sf.slug = 'oud';

-- Post 3: comparison guide — tagged 'oud' + 'floral', includes a Markdown
-- table to exercise the GFM table styling.
with new_post as (
  insert into journal_posts (
    slug, title_en, title_ar,
    excerpt_en, excerpt_ar,
    content_en, content_ar,
    cover_image_url, cover_image_alt_en, cover_image_alt_ar,
    is_published, published_at
  ) values (
    'oud-vs-floral-how-to-choose',
    'Oud vs. Floral: How to Choose Your Signature Scent', 'العود أم الزهري: كيف تختار عطرك المميز',
    'Two very different scent families — here''s how to tell which one actually fits how you live.', 'عائلتان مختلفتان تماماً — إليك كيف تعرف أيهما يناسب أسلوب حياتك فعلاً.',
    '## The Short Version

| | Oud | Floral |
|---|---|---|
| Best for | Evenings, formal occasions | Daytime, spring/summer |
| Character | Deep, smoky, long-lasting | Light, fresh, romantic |
| Try | [Oud Al Malaki](/product/oud-al-malaki) | [Zahrat Al Fajr](/product/zahrat-al-fajr) |

## Oud, in More Depth

Oud is resinous and smoky, built to last — a couple of sprays carries through a whole evening. It reads formal by default, which is why it''s the default choice for occasions rather than the office.

## Floral, in More Depth

Floral fragrances lean lighter and brighter, layering white flowers over soft citrus or musk. They read appropriate for daylight hours and warmer months, where an oud can feel heavy.

## Can''t Decide?

Most people end up owning both — oud for evenings, floral for daytime — rather than picking one forever. See our full [oud](/shop?scentFamily=oud) and [floral](/shop?scentFamily=floral) collections.',
    '## الخلاصة السريعة

| | العود | الزهري |
|---|---|---|
| الأنسب لـ | السهرات والمناسبات الرسمية | النهار وفصلي الربيع والصيف |
| الطابع | عميق ودخاني وثابت لفترة طويلة | خفيف ومنعش ورومانسي |
| جرّب | [عود الملكي](/product/oud-al-malaki) | [زهرة الفجر](/product/zahrat-al-fajr) |

## العود، بتفصيل أكثر

العود راتنجي ودخاني، مصمم ليدوم — رشتان تكفيان لتغطية سهرة كاملة. يُعتبر رسمياً بطبيعته، لذا فهو الخيار الافتراضي للمناسبات لا للعمل.

## الزهري، بتفصيل أكثر

تميل العطور الزهرية إلى الخفة والانتعاش، بطبقات من الزهور البيضاء فوق حمضيات أو مسك ناعم. تناسب ساعات النهار والأشهر الأكثر دفئاً، حيث قد يبدو العود ثقيلاً.

## لا تستطيع الاختيار؟

معظم الناس ينتهي بهم الأمر بامتلاك الاثنين — العود للسهرات والزهري للنهار — بدلاً من اختيار واحد للأبد. شاهد مجموعتنا الكاملة من [العود](/shop?scentFamily=oud) و[الزهري](/shop?scentFamily=floral).',
    '/images/journal/oud-vs-floral.jpg', 'Oud and floral perfume bottles side by side', 'زجاجات عطر العود والزهري جنباً إلى جنب',
    true, now() - interval '2 days'
  ) returning id
)
insert into journal_post_scent_families (journal_post_id, scent_family_id)
select np.id, sf.id from new_post np, scent_families sf where sf.slug in ('oud', 'floral');
