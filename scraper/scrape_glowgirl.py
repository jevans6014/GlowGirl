#!/usr/bin/env python3
"""
GLOWGIRL Website Scraper
Extracts product data and images from glowgirl.us (Square site)
"""
import requests
from bs4 import BeautifulSoup
import json
import os
from urllib.parse import urljoin, urlparse
import time

BASE_URL = "https://glowgirl.us"
OUTPUT_DIR = "scraped_data"
IMAGES_DIR = os.path.join(OUTPUT_DIR, "images")

# Pages to scrape
PAGES = [
    "/",
    "/collections/glowgirl-chain-collection",
    "/collections/glowgirl-charm-collection",
    "/collections/gold",
    "/collections/silver",
    "/collections/gold-earrings",
    "/collections/silver-earrings",
    "/pages/about",
    "/pages/team",
    "/pages/our-story",
]

os.makedirs(IMAGES_DIR, exist_ok=True)

def download_image(url, filename):
    """Download an image and save it locally"""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            filepath = os.path.join(IMAGES_DIR, filename)
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"✓ Downloaded: {filename}")
            return filepath
        return None
    except Exception as e:
        print(f"✗ Failed to download {url}: {e}")
        return None

def scrape_page(path):
    """Scrape a single page"""
    url = urljoin(BASE_URL, path)
    print(f"\n🔍 Scraping: {url}")
    
    try:
        response = requests.get(url, timeout=15)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        data = {
            "url": url,
            "path": path,
            "title": soup.find('title').text if soup.find('title') else "",
            "images": [],
            "products": [],
        }
        
        # Extract all images
        for img in soup.find_all('img'):
            src = img.get('src') or img.get('data-src')
            if src:
                # Make absolute URL
                if src.startswith('//'):
                    src = 'https:' + src
                elif not src.startswith('http'):
                    src = urljoin(url, src)
                
                # Skip tiny icons/logos
                if any(x in src.lower() for x in ['logo', 'icon', 'favicon', 'sprite']):
                    continue
                
                alt = img.get('alt', '')
                data['images'].append({
                    'src': src,
                    'alt': alt,
                    'title': img.get('title', ''),
                })
        
        # Try to extract product info (Square uses various structures)
        # Look for product cards, titles, prices
        product_cards = soup.find_all(['div', 'article'], class_=lambda x: x and ('product' in x.lower() or 'item' in x.lower()))
        
        for card in product_cards[:20]:  # Limit to avoid noise
            title_elem = card.find(['h2', 'h3', 'h4', 'a'], class_=lambda x: x and 'title' in x.lower() if x else False)
            price_elem = card.find(class_=lambda x: x and 'price' in x.lower() if x else False)
            img_elem = card.find('img')
            
            if title_elem or img_elem:
                product = {}
                if title_elem:
                    product['name'] = title_elem.get_text(strip=True)
                if price_elem:
                    product['price'] = price_elem.get_text(strip=True)
                if img_elem:
                    img_src = img_elem.get('src') or img_elem.get('data-src')
                    if img_src:
                        if img_src.startswith('//'):
                            img_src = 'https:' + img_src
                        elif not img_src.startswith('http'):
                            img_src = urljoin(url, img_src)
                        product['image'] = img_src
                
                if product:
                    data['products'].append(product)
        
        print(f"  Found {len(data['images'])} images, {len(data['products'])} products")
        return data
        
    except Exception as e:
        print(f"✗ Error scraping {url}: {e}")
        return None

def main():
    all_data = []
    all_images = {}
    
    for page_path in PAGES:
        data = scrape_page(page_path)
        if data:
            all_data.append(data)
            time.sleep(1)  # Be polite
    
    # Collect unique images
    image_counter = 1
    for page_data in all_data:
        for img in page_data['images']:
            src = img['src']
            if src not in all_images:
                # Generate filename
                ext = os.path.splitext(urlparse(src).path)[1] or '.jpg'
                if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
                    ext = '.jpg'
                
                filename = f"glowgirl_{image_counter:03d}{ext}"
                all_images[src] = {
                    'filename': filename,
                    'alt': img['alt'],
                    'url': src,
                }
                image_counter += 1
    
    # Download images (limit to first 50 to avoid overwhelming)
    print(f"\n📥 Downloading {min(len(all_images), 50)} images...")
    for i, (src, info) in enumerate(list(all_images.items())[:50]):
        download_image(src, info['filename'])
        if (i + 1) % 10 == 0:
            time.sleep(2)  # Pause every 10 images
    
    # Save metadata
    output = {
        'pages': all_data,
        'images': all_images,
        'summary': {
            'total_pages': len(all_data),
            'total_images': len(all_images),
            'total_products': sum(len(p.get('products', [])) for p in all_data),
        }
    }
    
    with open(os.path.join(OUTPUT_DIR, 'scraped_data.json'), 'w') as f:
        json.dump(output, f, indent=2)
    
    print(f"\n✅ Done! Scraped {output['summary']['total_pages']} pages")
    print(f"   Images: {output['summary']['total_images']}")
    print(f"   Products: {output['summary']['total_products']}")
    print(f"   Data saved to: {OUTPUT_DIR}/scraped_data.json")

if __name__ == "__main__":
    main()
