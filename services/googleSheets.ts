
import { OrderData, Product } from '../types';
import { GOOGLE_SHEET_SCRIPT_URL, GOOGLE_SHEET_ID } from '../constants';

const CACHE_KEY = 'hakimi_cached_products';

const DEFAULT_CATALOG: Product[] = [
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

export const submitOrderToSheet = async (orderData: OrderData): Promise<boolean> => {
  try {
    if (GOOGLE_SHEET_SCRIPT_URL) {
      await fetch(GOOGLE_SHEET_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    }
    return true;
  } catch (error) {
    console.error("Failed to save order to Google Sheets:", error);
    return false;
  }
};

function parsePrice(val: any): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseImages(val: any): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map(String).filter(url => url.startsWith('http'));
  }
  return String(val)
    .split(/[,;|\n]+/)
    .map(u => u.trim())
    .filter(u => u.toLowerCase().startsWith('http'));
}

function parseObjectsToProducts(items: any[]): Product[] {
  return items.map((item, idx) => {
    const keys = Object.keys(item);
    
    // Find image key
    const imageKey = keys.find(k =>
      ['image', 'images', 'url', 'urls', 'img', 'pics', 'picture', 'pictures', 'gallery', 'photo', 'photos', 'link'].includes(k.toLowerCase())
    );
    const rawImages = imageKey ? item[imageKey] : '';
    const images = parseImages(rawImages);

    // Find Name
    const nameKey = keys.find(k => ['name', 'product', 'title', 'item', 'product_name', 'item_name'].includes(k.toLowerCase()));
    const name = String(nameKey ? item[nameKey] : (item.name || item.title || `Hakimi Product ${idx + 1}`));

    // Find Price
    const priceKey = keys.find(k => ['price', 'rate', 'cost', 'amount', 'pkr', 'rs'].includes(k.toLowerCase()));
    const price = parsePrice(priceKey ? item[priceKey] : item.price);

    // Find Description
    const descKey = keys.find(k => ['description', 'desc', 'details', 'detail', 'benefit', 'benefits'].includes(k.toLowerCase()));
    const description = String(descKey ? item[descKey] : (item.description || ''));

    // Find Category
    const catKey = keys.find(k => ['category', 'cat', 'type', 'group', 'tag'].includes(k.toLowerCase()));
    const category = String(catKey ? item[catKey] : (item.category || 'General'));

    // Find ID
    const idKey = keys.find(k => ['id', 'item_id', 'product_id', 'code', 'sku'].includes(k.toLowerCase()));
    const id = Number(idKey && !isNaN(Number(item[idKey])) ? item[idKey] : idx + 1);

    return {
      id,
      name,
      price,
      description,
      images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'],
      category: category || 'General'
    };
  }).filter(p => p.name && p.name.trim().length > 0);
}

// Parse Google Visualization Table format
function parseGvizResponse(rawText: string): Product[] {
  const match = rawText.match(/google\.visualization\.Query\.setResponse\((.*)\);/s);
  if (!match || !match[1]) return [];
  const parsed = JSON.parse(match[1]);
  const table = parsed?.table;
  if (!table || !table.cols || !table.rows) return [];

  const headers: string[] = table.cols.map((col: any) => (col?.label || col?.id || '').toLowerCase().trim());
  
  const items: any[] = [];
  table.rows.forEach((row: any) => {
    if (!row?.c) return;
    const item: Record<string, any> = {};
    row.c.forEach((cell: any, colIdx: number) => {
      const headerName = headers[colIdx] || `col_${colIdx}`;
      item[headerName] = cell?.f ?? cell?.v ?? '';
    });
    if (Object.values(item).some(v => v !== '')) {
      items.push(item);
    }
  });

  return parseObjectsToProducts(items);
}

// Parse standard CSV text
function parseCsvResponse(csvText: string): Product[] {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const parseRow = (rowStr: string): string[] => {
    const cells: string[] = [];
    let inQuotes = false;
    let currCell = '';
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"' && (i === 0 || rowStr[i - 1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cells.push(currCell.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
        currCell = '';
      } else {
        currCell += char;
      }
    }
    cells.push(currCell.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
    return cells;
  };

  const headers = parseRow(lines[0]).map(h => h.toLowerCase());
  const items: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    const item: Record<string, any> = {};
    headers.forEach((h, idx) => {
      item[h] = values[idx] || '';
    });
    if (Object.values(item).some(v => v !== '')) {
      items.push(item);
    }
  }

  return parseObjectsToProducts(items);
}

export const fetchProductsFromSheet = async (): Promise<Product[]> => {
  // Strategy 1: Apps Script URL (JSON)
  if (GOOGLE_SHEET_SCRIPT_URL) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(GOOGLE_SHEET_SCRIPT_URL, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const text = await res.text();
        if (text.startsWith('[') || text.startsWith('{')) {
          const data = JSON.parse(text);
          if (Array.isArray(data) && data.length > 0) {
            const products = parseObjectsToProducts(data);
            if (products.length > 0) {
              saveCache(products);
              console.log("🌿 Hakimi Herbals - Synchronized via Apps Script endpoint");
              return products;
            }
          }
        }
      }
    } catch (e) {
      console.warn("Apps Script fetch attempt failed, trying direct Google Sheet sync...", e);
    }
  }

  // Strategy 2: Google Visualization Query on Spreadsheet ID
  if (GOOGLE_SHEET_ID) {
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json`;
      const res = await fetch(gvizUrl);
      if (res.ok) {
        const text = await res.text();
        const products = parseGvizResponse(text);
        if (products.length > 0) {
          saveCache(products);
          console.log("🌿 Hakimi Herbals - Synchronized directly via Google Sheet Visualization API");
          return products;
        }
      }
    } catch (e) {
      console.warn("Direct GViz fetch attempt failed, trying CSV export...", e);
    }

    // Strategy 3: CSV Export on Spreadsheet ID
    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`;
      const res = await fetch(csvUrl);
      if (res.ok) {
        const text = await res.text();
        const products = parseCsvResponse(text);
        if (products.length > 0) {
          saveCache(products);
          console.log("🌿 Hakimi Herbals - Synchronized directly via Google Sheet CSV Export");
          return products;
        }
      }
    } catch (e) {
      console.warn("CSV export fetch attempt failed", e);
    }
  }

  // Strategy 4: Local Storage Cache
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log("🌿 Hakimi Herbals - Loaded inventory from persistent local cache");
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Cache read failed", e);
  }

  // Strategy 5: Default Herbal Catalog
  console.log("🌿 Hakimi Herbals - Using default apothecary catalog");
  return DEFAULT_CATALOG;
};

function saveCache(products: Product[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn("Failed saving products to cache", e);
  }
}



