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
    sku_prefix, is_featured
  ) values (
    'oud-al-malaki',
    'Oud Al Malaki', 'عود الملكي',
    'A royal oud for evenings that demand presence.', 'عود ملكي للأمسيات التي تستحق الحضور.',
    'Oud Al Malaki opens with a dramatic blend of Cambodian oud and saffron, settling into a warm heart of rose and amber before a smoky, resinous base that lingers for hours.',
    'يفتح عود الملكي بمزيج درامي من العود الكمبودي والزعفران، لينتقل إلى قلب دافئ من الورد والعنبر، وقاعدة دخانية راتنجية تدوم لساعات.',
    'Evening wear, formal occasions, cool weather.', 'للسهرات والمناسبات الرسمية وأجواء الطقس البارد.',
    'unisex', 'Eau de Parfum', 'أو دو بارفان',
    'ALM', true
  ) returning id
)
insert into product_notes (product_id, position, name_en, name_ar, sort_order)
select id, 'top'::note_position, 'Saffron', 'زعفران', 1 from new_product
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

insert into product_variants (product_id, sku, size_ml, price, compare_at_price, stock_quantity, is_default)
select id, 'ALM-50', 50, 480.00, null, 40, false from products where slug = 'oud-al-malaki'
union all
select id, 'ALM-100', 100, 780.00, 850.00, 25, true from products where slug = 'oud-al-malaki';

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
select id, 'top'::note_position, 'Bergamot', 'برغموت', 1 from new_product
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

insert into product_variants (product_id, sku, size_ml, price, stock_quantity, is_default)
select id, 'ZAF-30', 30, 220.00, 60, false from products where slug = 'zahrat-al-fajr'
union all
select id, 'ZAF-50', 50, 340.00, 45, true from products where slug = 'zahrat-al-fajr'
union all
select id, 'ZAF-100', 100, 520.00, 20, false from products where slug = 'zahrat-al-fajr';

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
select id, 'top'::note_position, 'Grapefruit', 'جريب فروت', 1 from new_product
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
-- One journal post
-- ---------------------------------------------------------------------
insert into journal_posts (slug, title_en, title_ar, excerpt_en, excerpt_ar, content_en, content_ar, is_published, published_at) values (
  'how-to-pick-your-signature-scent',
  'How to Pick Your Signature Scent', 'كيف تختار عطرك المميز',
  'A short guide to finding the fragrance that becomes unmistakably yours.', 'دليل مختصر لإيجاد العطر الذي يصبح بصمتك الخاصة.',
  'Full article content goes here...', 'محتوى المقال الكامل هنا...',
  true, now()
);
