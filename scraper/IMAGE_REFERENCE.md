# Image Reference — Scraped GLOWGIRL Products

All images are in `public/images/` and ready to use.

## Chains (8 products)
- `glowgirl_004.jpg` → **Jordyn Chain** ($40)
- `glowgirl_006.jpg` → **Genesis Chain** ($40)
- `glowgirl_008.jpg` → **Olivia Chain** ($40)
- `glowgirl_010.jpg` → **Deborah Chain** ($40)
- `glowgirl_012.jpg` → **Evelyn Chain** ($40)
- `glowgirl_014.jpg` → **Lilly Chain** ($40)
- `glowgirl_016.jpg` → **Taylor Chain** ($40)
- `glowgirl_018.jpg` → **Marshalla Chain** ($40)

## Charms (6 products)
- `glowgirl_020.png` → **Heart Charm** ($20)
- `glowgirl_022.png` → **Star Charm** ($20)
- `glowgirl_024.png` → **Moon Charm** ($20)
- `glowgirl_026.png` → **Initial Charm** ($25)
- `glowgirl_028.png` → **Birthstone Charm** ($30)
- `glowgirl_030.png` → **Butterfly Charm** ($22)

## Nameplates (4 products)
- `glowgirl_032.png` → **Gold Nameplate Necklace** ($85, customizable)
- `glowgirl_034.png` → **Silver Nameplate Necklace** ($85, customizable)
- `glowgirl_036.png` → **Gold Nameplate Bracelet** ($95, customizable)
- `glowgirl_038.png` → **Silver Nameplate Bracelet** ($95, customizable)

## Earrings (6 products)
- `glowgirl_040.png` → **Gold Hoop Earrings** ($35)
- `glowgirl_042.png` → **Gold Stud Earrings** ($35)
- `glowgirl_048.jpg` → **Gold Huggie Earrings** ($38)
- `glowgirl_044.png` → **Silver Hoop Earrings** ($35)
- `glowgirl_046.jpg` → **Silver Stud Earrings** ($35)
- `glowgirl_050.png` → **Silver Huggie Earrings** ($38)

## Additional Images (used for team/branding)
- `glowgirl_001.png` → GLOWGIRL logo / Team member placeholder
- `glowgirl_002.png` → GLOWGIRL logo (small) / Team member placeholder

## Usage in code
These images are referenced in `scraper/populate_db.sql` with paths like:
```sql
image_url = '/images/glowgirl_004.jpg'
```

Vite serves files from `public/` at the root, so `/images/glowgirl_004.jpg` resolves to `public/images/glowgirl_004.jpg`.

## Adding more products
If you want to add more products:
1. Use the unused images (glowgirl_048.jpg, glowgirl_050.png, etc.)
2. Or re-run the scraper to get more images from other collection pages
3. Update `populate_db.sql` with new INSERT statements
