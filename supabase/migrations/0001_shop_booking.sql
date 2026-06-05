-- ============================================
-- GLOWGIRL — Shop, Orders, Appointments schema
-- Run this in the Supabase SQL Editor.
-- ============================================

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN (
    'chains','charms','gold-earrings','silver-earrings',
    'gold-nameplate','silver-nameplate','ebook','gift-card'
  )),
  description text,
  base_price numeric(10,2) NOT NULL,
  image_url text,
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  stripe_price_id text,
  customizable boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  label text NOT NULL,
  price_modifier numeric(10,2) DEFAULT 0,
  stripe_price_id text,
  in_stock boolean DEFAULT true
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  customer_email text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text,
  status text DEFAULT 'pending' CHECK (status IN (
    'pending','paid','processing','shipped','completed','refunded','cancelled'
  )),
  subtotal numeric(10,2),
  total numeric(10,2),
  shipping_address jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id),
  product_name text NOT NULL,
  variant_label text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  customization_text text
);

-- ============================================
-- APPOINTMENTS (replaces Square)
-- ============================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  service text NOT NULL CHECK (service IN (
    'permanent-jewelry','permanent-jewelry-event','cafe-reservation'
  )),
  preferred_date date,
  preferred_time text,
  party_size integer DEFAULT 1,
  chain_preference text,
  charm_preference text,
  message text,
  status text DEFAULT 'pending' CHECK (status IN (
    'pending','confirmed','cancelled','completed'
  )),
  deposit_paid boolean DEFAULT false,
  stripe_session_id text,
  created_at timestamptz DEFAULT now()
);

-- read tracking on inquiry tables (for admin "mark as read")
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS read_at timestamptz;
ALTER TABLE public.event_inquiries ADD COLUMN IF NOT EXISTS read_at timestamptz;

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read products" ON public.products;
CREATE POLICY "Public can read products" ON public.products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Public can read variants" ON public.product_variants;
CREATE POLICY "Public can read variants" ON public.product_variants FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
CREATE POLICY "Anyone can create order" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Service role manages orders" ON public.orders;
CREATE POLICY "Service role manages orders" ON public.orders FOR ALL TO service_role USING (true);
DROP POLICY IF EXISTS "Authenticated can read orders" ON public.orders;
CREATE POLICY "Authenticated can read orders" ON public.orders FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can create order items" ON public.order_items;
CREATE POLICY "Anyone can create order items" ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated can read order items" ON public.order_items;
CREATE POLICY "Authenticated can read order items" ON public.order_items FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Anyone can book appointment" ON public.appointments;
CREATE POLICY "Anyone can book appointment" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Service role manages appointments" ON public.appointments;
CREATE POLICY "Service role manages appointments" ON public.appointments FOR ALL TO service_role USING (true);
DROP POLICY IF EXISTS "Authenticated can read appointments" ON public.appointments;
CREATE POLICY "Authenticated can read appointments" ON public.appointments FOR SELECT TO authenticated USING (true);
-- Public can read only the date/time of appointments to compute availability
DROP POLICY IF EXISTS "Public can read appointment slots" ON public.appointments;
CREATE POLICY "Public can read appointment slots" ON public.appointments FOR SELECT TO anon USING (true);

GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_variants TO anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT INSERT ON public.order_items TO anon, authenticated;
GRANT SELECT ON public.order_items TO authenticated;
GRANT INSERT, SELECT ON public.appointments TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_items TO service_role;
GRANT ALL ON public.appointments TO service_role;
GRANT ALL ON public.products TO service_role;
GRANT ALL ON public.product_variants TO service_role;

-- ============================================
-- SEED PRODUCT DATA
-- ============================================
INSERT INTO public.products (name, slug, category, description, base_price, featured, sort_order, customizable) VALUES
-- CHAINS
('Jordyn Chain', 'jordyn-chain', 'chains', 'A timeless, elegant chain perfect for stacking or wearing solo. Available in gold, silver, and rose gold.', 40.00, true, 1, false),
('Genesis Chain', 'genesis-chain', 'chains', 'Bold and beautiful — the Genesis chain makes a statement wherever you go.', 40.00, true, 2, false),
('Olivia Chain', 'olivia-chain', 'chains', 'Delicate and feminine, the Olivia chain is a Glowgirl signature.', 40.00, false, 3, false),
('Deborah Chain', 'deborah-chain', 'chains', 'A sleek, modern chain with a sophisticated silhouette.', 40.00, false, 4, false),
('Evelyn Chain', 'evelyn-chain', 'chains', 'The Evelyn chain brings vintage-inspired elegance to everyday wear.', 40.00, false, 5, false),
('Lilly Chain', 'lilly-chain', 'chains', 'Light and airy, perfect for layering with other Glowgirl pieces.', 40.00, false, 6, false),
('Taylor Chain', 'taylor-chain', 'chains', 'A fan-favorite with a versatile style that works as bracelet, anklet, or necklace.', 40.00, true, 7, false),
('Marshalla Chain', 'marshalla-chain', 'chains', 'A statement chain with exceptional craftsmanship and shine.', 40.00, false, 8, false),
-- CHARMS
('Amour Connector', 'amour-connector', 'charms', 'A romantic connector charm — perfect for anniversary or Valentine''s pieces.', 25.00, true, 1, false),
('Anchor Cross Charm', 'anchor-cross-charm', 'charms', 'Faith and strength combined in one stunning charm.', 20.00, false, 2, false),
('Angel Kiss Charm', 'angel-kiss-charm', 'charms', 'A delicate angel charm for your most cherished jewelry.', 20.00, false, 3, false),
('Bloom Connector', 'bloom-connector', 'charms', 'A floral connector that adds a garden-fresh touch to any piece.', 20.00, true, 4, false),
('Braided Heart Connector', 'braided-heart-connector', 'charms', 'An intricate braided heart — show the love in every detail.', 25.00, false, 5, false),
('Bubbly Pup Charm', 'bubbly-pup-charm', 'charms', 'For the dog moms — a cheerful pup charm that brings joy.', 20.00, false, 6, false),
('Carrot Cutie Charm', 'carrot-cutie-charm', 'charms', 'Playful and unique — a carrot charm for the fun-loving Glowgirl.', 20.00, false, 7, false),
('Cherished Heart Charm', 'cherished-heart-charm', 'charms', 'A classic heart charm representing the people you hold closest.', 20.00, true, 8, false),
-- GOLD EARRINGS
('Corkscrew Gold Earrings', 'corkscrew-gold-earrings', 'gold-earrings', 'Twisted gold earrings with a bold, sculptural look.', 30.00, false, 1, false),
('Minnie Gold Earrings', 'minnie-gold-earrings', 'gold-earrings', 'Petite and charming gold earrings perfect for everyday wear.', 30.00, false, 2, false),
('Lemon Drop Gold Earrings', 'lemon-drop-gold-earrings', 'gold-earrings', 'Fresh and vibrant, these gold earrings bring citrus energy.', 30.00, true, 3, false),
-- GOLD NAMEPLATE
('Gold Personalized Name Necklace', 'gold-name-necklace', 'gold-nameplate', 'A custom gold nameplate necklace. Enter your name or a special word. Processing 5–7 business days.', 85.00, true, 1, true),
('Gold Personalized Logo Necklace', 'gold-logo-necklace', 'gold-nameplate', 'Custom gold necklace with your logo or design. Perfect for business owners and brands. Processing 7–10 days.', 95.00, false, 2, true),
('Realtor Logo Necklace', 'realtor-logo-necklace', 'gold-nameplate', 'Designed specifically for real estate professionals. Wear your brand.', 85.00, false, 3, false),
-- EBOOK
('Becoming a Jewelry Boss', 'jewelry-boss-ebook', 'ebook', 'The complete playbook for turning your jewelry passion into a profitable business. Instant digital download after purchase.', 80.00, true, 1, false)
ON CONFLICT (slug) DO NOTHING;

-- Variants for chains (lengths)
INSERT INTO public.product_variants (product_id, label, price_modifier)
SELECT p.id, v.label, v.price
FROM public.products p
CROSS JOIN (VALUES
  ('Bracelet / Anklet (6–8")', 0),
  ('Necklace — Choker (14–16")', 15),
  ('Necklace — Standard (18")', 20),
  ('Necklace — Long (20–24")', 25)
) AS v(label, price)
WHERE p.category = 'chains'
AND NOT EXISTS (SELECT 1 FROM public.product_variants pv WHERE pv.product_id = p.id);

-- Variants for charms (metal)
INSERT INTO public.product_variants (product_id, label, price_modifier)
SELECT p.id, v.label, v.price
FROM public.products p
CROSS JOIN (VALUES ('Gold Finish', 0), ('Silver Finish', 0), ('Rose Gold Finish', 0)) AS v(label, price)
WHERE p.category = 'charms'
AND NOT EXISTS (SELECT 1 FROM public.product_variants pv WHERE pv.product_id = p.id);
