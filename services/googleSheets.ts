
import { OrderData, Product } from '../types';
import { GOOGLE_SHEET_SCRIPT_URL } from '../constants';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Pure Himalayan Shilajit Resin",
    price: 3500,
    description: "100% pure, lab-tested organic Himalayan Shilajit rich in fulvic acid and over 84 trace minerals to revitalize vitality and natural endurance.",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Featured"
  },
  {
    id: 2,
    name: "Herbal Hair Growth Elixir",
    price: 1850,
    description: "Traditional herbal infusion of Amla, Reetha, Sikakai, Bhringraj, and pure cold-pressed oils to nourish roots, stop hair fall, and restore shine.",
    images: [
      "https://images.unsplash.com/photo-1608248597359-577717f93ee9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Hair Care"
  },
  {
    id: 3,
    name: "Wild Mountain Organic Honey",
    price: 2200,
    description: "Raw, unpasteurized monofloral forest honey gathered by native bees from wild blossom valleys, packed with active enzymes and antioxidants.",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Featured"
  },
  {
    id: 4,
    name: "Pure Kashmiri Mongra Saffron",
    price: 4800,
    description: "Handpicked Grade A++ whole red stigmas of Kashmiri Zafran, boasting deep crimson color, potent aroma, and authentic therapeutic potency.",
    images: [
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Wellness"
  },
  {
    id: 5,
    name: "Botanical Ubtan & Radiance Powder",
    price: 1400,
    description: "A centuries-old Ayurvedic bridal recipe blending wild turmeric (Kasturi Manjal), sandalwood, gram flour, and crushed rose petals for radiant skin.",
    images: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Skin Care"
  },
  {
    id: 6,
    name: "Herbal Detox Kahwa Blend",
    price: 1250,
    description: "An artisanal infusion of green tea leaves, green cardamom, cinnamon quills, cloves, and whole saffron filaments for digestive calm and immunity.",
    images: [
      "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
    ],
    category: "Wellness"
  }
];

const CACHE_KEY = 'hakimi_cached_products';

export const submitOrderToSheet = async (orderData: OrderData): Promise<boolean> => {
  try {
    await fetch(GOOGLE_SHEET_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return true;
  } catch (error) {
    console.error("Failed to save to Google Sheets:", error);
    return false;
  }
};

export const fetchProductsFromSheet = async (): Promise<Product[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(GOOGLE_SHEET_SCRIPT_URL, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Server status: ${response.status}`);
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!Array.isArray(data)) throw new Error("Invalid response format");

    const parsedProducts: Product[] = data.map((item: any) => {
      const imageKey = Object.keys(item).find(k => 
        ['image', 'images', 'url', 'urls', 'img', 'pics', 'pictures', 'gallery', 'photo', 'photos'].includes(k.toLowerCase())
      );
      const rawImageValue = imageKey ? item[imageKey] : '';
      
      const images = rawImageValue
        ? String(rawImageValue)
            .split(/[,;||\n]/)
            .map((url: string) => url.trim())
            .filter(url => url.toLowerCase().startsWith('http'))
        : [];

      return {
        id: Number(item.id || item.ID || Math.floor(Math.random() * 100000)),
        name: String(item.name || item.Name || 'Unnamed Herbal Product'),
        price: Number(item.price || item.Price || 0),
        description: String(item.description || item.Description || ''),
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'],
        category: String(item.category || item.Category || 'General')
      };
    });

    if (parsedProducts.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(parsedProducts));
      } catch (e) {
        console.warn("Could not cache products to localStorage", e);
      }
      console.log("🌿 Hakimi Herbals - Inventory Synchronized");
      return parsedProducts;
    }

    throw new Error("No products found in sheet");
  } catch (error) {
    console.warn("Unable to fetch fresh products from Google Sheets, checking cache...", error);
    
    // Check cached data
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log("🌿 Loaded products from local cache");
          return parsed;
        }
      }
    } catch (cacheErr) {
      console.warn("Failed reading from product cache:", cacheErr);
    }

    // Return fallback catalog
    console.log("🌿 Using Hakimi Herbal default catalog");
    return FALLBACK_PRODUCTS;
  }
};

