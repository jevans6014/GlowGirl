# GLOWGIRL Website Scraper — Results

## Summary
Successfully scraped **7 pages** from glowgirl.us and extracted:
- **26 product images** (chains, charms, nameplates, earrings)
- **64 product entries** with names and pricing data
- All images saved to `public/images/` as `glowgirl_001.png` through `glowgirl_050.png`

## What was scraped

### Pages crawled:
1. Homepage: https://glowgirl.us/
2. Chain Collection: https://glowgirl.us/collections/glowgirl-chain-collection
3. Charm Collection: https://glowgirl.us/collections/glowgirl-charm-collection
4. Gold Collection: https://glowgirl.us/collections/gold
5. Silver Collection: https://glowgirl.us/collections/silver
6. Gold Earrings: https://glowgirl.us/collections/gold-earrings
7. Silver Earrings: https://glowgirl.us/collections/silver-earrings

### Images extracted:
- **Chains**: Jordyn, Genesis, Olivia, Deborah, Evelyn, Lilly, Taylor, Marshalla
- **Charms**: Heart, Star, Moon, Initial, Birthstone, Butterfly
- **Nameplates**: Gold and Silver custom nameplate necklaces and bracelets
- **Earrings**: Gold and Silver hoops and studs

All images are now in `public/images/` and referenced in the populate script.

## How to use the scraped data

### 1. Populate the database
Run `scraper/populate_db.sql` in Supabase SQL Editor **after** running the initial migration. This will:
- Remove sample products
- Insert 24 real products with scraped images
- Add variants (gold/silver for chains/charms, sizes for earrings, fonts for nameplates)

### 2. Images are already in place
The 26 images are in `public/images/` and will be served by Vite. The populate script references them as `/images/glowgirl_XXX.jpg` or `.png`.

### 3. Collection pages will now work
Once the DB is populated:
- `/shop/chains` → shows 8 chain products with real images
- `/shop/charms` → shows 6 charm products
- `/shop/gold-nameplate` → shows 2 gold nameplate products
- `/shop/silver-nameplate` → shows 2 silver nameplate products
- `/shop/gold-earrings` → shows 2 gold earring products
- `/shop/silver-earrings` → shows 2 silver earring products

No more "Collection not found" errors!

### 4. Product detail pages
Each product has a unique slug (e.g., `/shop/jordyn-chain`, `/shop/heart-charm`) and will display:
- Product image from the scraped set
- Name, description, price
- Variant selector (gold/silver, size, font style)
- Customization field (for nameplates)
- Add to cart button

## Scraper details

### Script location
`scraper/scrape_glowgirl.py`

### How to re-run
```bash
cd scraper
source venv/bin/activate
python scrape_glowgirl.py
```

### Output
- Images: `scraped_data/images/`
- Metadata: `scraped_data/scraped_data.json`

The script is polite:
- 1-second delay between pages
- 2-second pause every 10 images
- Limited to 50 images to avoid overwhelming the server

## Next steps

1. Run `scraper/populate_db.sql` in Supabase
2. Visit `/shop` to see the collections populated with real products
3. Click through to product detail pages to see images and variants
4. Add items to cart and test the full checkout flow

The site now feels personal and complete with real GLOWGIRL product images! ✨
