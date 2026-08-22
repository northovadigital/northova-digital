PRAGMA foreign_keys = ON;

INSERT INTO products (
  id,
  slug,
  name,
  description,
  category,
  base_price,
  status,
  featured,
  created_at
) VALUES
(
  'fk-fashion-001',
  'embroidered-lawn-ensemble',
  'Embroidered Lawn Ensemble',
  'A graceful unstitched lawn set designed for polished everyday wear.',
  'fashion',
  4850,
  'active',
  1,
  '2026-08-13T00:00:00+05:00'
),
(
  'fk-fragrance-001',
  'velvet-oud',
  'Velvet Oud',
  'A warm woody fragrance with a rich, confident evening character.',
  'fragrances',
  3950,
  'active',
  1,
  '2026-08-13T00:00:00+05:00'
),
(
  'fk-home-001',
  'signature-cotton-bedsheet',
  'Signature Cotton Bedsheet',
  'A comfortable cotton bedsheet set in a calm, versatile palette.',
  'home',
  3250,
  'active',
  1,
  '2026-08-13T00:00:00+05:00'
),
(
  'fk-fashion-002',
  'classic-three-piece-suit',
  'Classic Three-Piece Suit',
  'An elegant three-piece look suited to gatherings and occasion dressing.',
  'fashion',
  7850,
  'active',
  1,
  '2026-08-13T00:00:00+05:00'
),
(
  'fk-fragrance-002',
  'white-musk',
  'White Musk',
  'A clean, soft fragrance created for effortless everyday wear.',
  'fragrances',
  2950,
  'active',
  1,
  '2026-08-13T00:00:00+05:00'
),
(
  'fk-home-002',
  'hotel-stripe-bedding-set',
  'Hotel Stripe Bedding Set',
  'A refined bedding set inspired by crisp, understated hotel styling.',
  'home',
  5650,
  'active',
  1,
  '2026-08-13T00:00:00+05:00'
);

INSERT INTO product_variants (
  id,
  product_id,
  size,
  color,
  volume_ml,
  price,
  stock
) VALUES
(
  'fk-fashion-001-default',
  'fk-fashion-001',
  NULL,
  NULL,
  NULL,
  4850,
  3
),
(
  'fk-fragrance-001-50ml',
  'fk-fragrance-001',
  NULL,
  NULL,
  50,
  3950,
  5
),
(
  'fk-fragrance-001-100ml',
  'fk-fragrance-001',
  NULL,
  NULL,
  100,
  6750,
  3
),
(
  'fk-home-001-default',
  'fk-home-001',
  NULL,
  NULL,
  NULL,
  3250,
  4
),
(
  'fk-fashion-002-small',
  'fk-fashion-002',
  'S',
  NULL,
  NULL,
  7850,
  1
),
(
  'fk-fashion-002-medium',
  'fk-fashion-002',
  'M',
  NULL,
  NULL,
  7850,
  2
),
(
  'fk-fashion-002-large',
  'fk-fashion-002',
  'L',
  NULL,
  NULL,
  7850,
  1
),
(
  'fk-fragrance-002-50ml',
  'fk-fragrance-002',
  NULL,
  NULL,
  50,
  2950,
  6
),
(
  'fk-fragrance-002-100ml',
  'fk-fragrance-002',
  NULL,
  NULL,
  100,
  4950,
  4
),
(
  'fk-home-002-default',
  'fk-home-002',
  NULL,
  NULL,
  NULL,
  5650,
  3
);
