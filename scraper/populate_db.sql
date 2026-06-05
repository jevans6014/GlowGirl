-- ============================================
-- GLOWGIRL — Populate DB with scraped product data
-- Run this AFTER the initial migration to add real products
-- ============================================

-- Clear existing seed data
DELETE FROM product_variants WHERE product_id IN (SELECT id FROM products WHERE slug LIKE 'sample-%');
DELETE FROM products WHERE slug LIKE 'sample-%';

-- Insert real chain products from scrape
INSERT INTO products (name, slug, description, category, base_price, image_url, in_stock, featured) VALUES
('Jordyn Chain', 'jordyn-chain', 'Classic chain style perfect for permanent jewelry', 'chains', 40.00, '/images/glowgirl_004.jpg', true, true),
('Genesis Chain', 'genesis-chain', 'Delicate and timeless chain design', 'chains', 40.00, '/images/glowgirl_006.jpg', true, true),
('Olivia Chain', 'olivia-chain', 'Elegant chain with refined links', 'chains', 40.00, '/images/glowgirl_008.jpg', true, false),
('Deborah Chain', 'deborah-chain', 'Bold and beautiful chain style', 'chains', 40.00, '/images/glowgirl_010.jpg', true, false),
('Evelyn Chain', 'evelyn-chain', 'Sophisticated chain perfect for layering', 'chains', 40.00, '/images/glowgirl_012.jpg', true, false),
('Lilly Chain', 'lilly-chain', 'Dainty chain with delicate links', 'chains', 40.00, '/images/glowgirl_014.jpg', true, false),
('Taylor Chain', 'taylor-chain', 'Modern chain design with clean lines', 'chains', 40.00, '/images/glowgirl_016.jpg', true, false),
('Marshalla Chain', 'marshalla-chain', 'Statement chain with unique character', 'chains', 40.00, '/images/glowgirl_018.jpg', true, false);

-- Insert charm products
INSERT INTO products (name, slug, description, category, base_price, image_url, in_stock, featured) VALUES
('Heart Charm', 'heart-charm', 'Classic heart charm in gold or silver', 'charms', 20.00, '/images/glowgirl_020.png', true, true),
('Star Charm', 'star-charm', 'Celestial star charm', 'charms', 20.00, '/images/glowgirl_022.png', true, true),
('Moon Charm', 'moon-charm', 'Crescent moon charm', 'charms', 20.00, '/images/glowgirl_024.png', true, false),
('Initial Charm', 'initial-charm', 'Personalized initial charm', 'charms', 25.00, '/images/glowgirl_026.png', true, true),
('Birthstone Charm', 'birthstone-charm', 'Your birthstone charm', 'charms', 30.00, '/images/glowgirl_028.png', true, false),
('Butterfly Charm', 'butterfly-charm', 'Delicate butterfly charm', 'charms', 22.00, '/images/glowgirl_030.png', true, false);

-- Insert nameplate products
INSERT INTO products (name, slug, description, category, base_price, image_url, in_stock, featured, customizable) VALUES
('Gold Nameplate Necklace', 'gold-nameplate', 'Custom gold nameplate necklace', 'gold-nameplate', 85.00, '/images/glowgirl_032.png', true, true, true),
('Silver Nameplate Necklace', 'silver-nameplate', 'Custom silver nameplate necklace', 'silver-nameplate', 85.00, '/images/glowgirl_034.png', true, true, true),
('Gold Nameplate Bracelet', 'gold-nameplate-bracelet', 'Custom gold nameplate bracelet', 'gold-nameplate', 95.00, '/images/glowgirl_036.png', true, false, true),
('Silver Nameplate Bracelet', 'silver-nameplate-bracelet', 'Custom silver nameplate bracelet', 'silver-nameplate', 95.00, '/images/glowgirl_038.png', true, false, true);

-- Insert earring products
INSERT INTO products (name, slug, description, category, base_price, image_url, in_stock, featured) VALUES
('Gold Hoop Earrings', 'gold-hoop-earrings', 'Classic gold hoop earrings', 'gold-earrings', 35.00, '/images/glowgirl_040.png', true, true),
('Gold Stud Earrings', 'gold-stud-earrings', 'Simple gold stud earrings', 'gold-earrings', 35.00, '/images/glowgirl_042.png', true, false),
('Gold Huggie Earrings', 'gold-huggie-earrings', 'Delicate gold huggie hoops', 'gold-earrings', 38.00, '/images/glowgirl_048.jpg', true, false),
('Silver Hoop Earrings', 'silver-hoop-earrings', 'Classic silver hoop earrings', 'silver-earrings', 35.00, '/images/glowgirl_044.png', true, true),
('Silver Stud Earrings', 'silver-stud-earrings', 'Simple silver stud earrings', 'silver-earrings', 35.00, '/images/glowgirl_046.jpg', true, false),
('Silver Huggie Earrings', 'silver-huggie-earrings', 'Delicate silver huggie hoops', 'silver-earrings', 38.00, '/images/glowgirl_050.png', true, false);

-- Add variants for chains (gold/silver options)
INSERT INTO product_variants (product_id, label, price_modifier, in_stock)
SELECT id, 'Gold', 0, true FROM products WHERE category = 'chains'
UNION ALL
SELECT id, 'Silver', 0, true FROM products WHERE category = 'chains';

-- Add variants for charms
INSERT INTO product_variants (product_id, label, price_modifier, in_stock)
SELECT id, 'Gold', 0, true FROM products WHERE category = 'charms'
UNION ALL
SELECT id, 'Silver', 0, true FROM products WHERE category = 'charms';

-- Add size variants for earrings
INSERT INTO product_variants (product_id, label, price_modifier, in_stock)
SELECT id, 'Small', 0, true FROM products WHERE category IN ('gold-earrings', 'silver-earrings')
UNION ALL
SELECT id, 'Medium', 5, true FROM products WHERE category IN ('gold-earrings', 'silver-earrings')
UNION ALL
SELECT id, 'Large', 10, true FROM products WHERE category IN ('gold-earrings', 'silver-earrings');

-- Add font variants for nameplates
INSERT INTO product_variants (product_id, label, price_modifier, in_stock)
SELECT id, 'Script', 0, true FROM products WHERE category IN ('gold-nameplate', 'silver-nameplate')
UNION ALL
SELECT id, 'Block', 0, true FROM products WHERE category IN ('gold-nameplate', 'silver-nameplate')
UNION ALL
SELECT id, 'Cursive', 5, true FROM products WHERE category IN ('gold-nameplate', 'silver-nameplate');
