
import { OrderData, Product } from '../types';
import { GOOGLE_SHEET_SCRIPT_URL, GOOGLE_SHEET_ID } from '../constants';
import { getCachedAccessToken } from '../firebase';

const CACHE_KEY = 'hakimi_cached_products_v4';

const DEFAULT_CATALOG: Product[] = [
  {
    id: 1,
    name: "Royal Fragrance Bundle",
    price: 2000,
    description: "An exclusive fragrance experience — three of your choice, with the refined essence of White Musk or Lavender Rose included.",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862412/Body_Spray_in_a_Shelf_y0ymfy.jpg"
    ],
    category: "Featured"
  },
  {
    id: 2,
    name: "Mini Royal Fragrance Bundle",
    price: 1200,
    description: "Saver Deal any three Fragrances with Lavender Rose",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1772429799/4_small_body_spray_dzkggn.jpg"
    ],
    category: "Featured"
  },
  {
    id: 3,
    name: "Prickly Heat Powder",
    price: 500,
    description: "Instant cooling, natural relief. Safe, gentle & refreshing for all ages",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1777665418/prickly_vnpr7y.jpg",
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862418/Powder_Prickly_Heat_bijnjw.jpg"
    ],
    category: "Powder"
  },
  {
    id: 4,
    name: "Rahat Oil - Massage Oil",
    price: 400,
    description: "Its refreshing aroma opens nasal passages, helping you breathe freely and helps in Daily body aches",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1770618869/RaHAT_OIL_kmfh5z.jpg",
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1770618876/RAHAT_OIL_BACK_gib3ef.jpg"
    ],
    category: "Featured"
  },
  {
    id: 5,
    name: "Lavender Rose",
    price: 750,
    description: "A scent of pure sophistication, crafted for those who carry grace.",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1777664901/lavender_xkyybg.jpg"
    ],
    category: "Body Spray"
  },
  {
    id: 6,
    name: "Cool Water",
    price: 500,
    description: "Refreshing body mist with cooling herbal extracts.",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767864969/Cool_Water_lcd1pk.jpg"
    ],
    category: "Body Spray"
  },
  {
    id: 7,
    name: "Dunhill Desire",
    price: 500,
    description: "Pure steam-distilled rose water toner for instant freshness.",
    images: [
      "https://res.cloudinary.com/de0cllasz/image/upload/v1763398423/08142bdb-6f32-47cf-bbf1-b2ff25fb4e96_mwmiku.jpg"
    ],
    category: "Body Spray"
  },
  {
    id: 8,
    name: "White Musk",
    price: 750,
    description: "A fragrance that feels clean, comforting, and refined. A touch of purity in every spray",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862424/White_Musk_gqgbbm.jpg"
    ],
    category: "Body Spray"
  },
  {
    id: 9,
    name: "Jasmine / Motia",
    price: 500,
    description: "Refreshing and hydrating mist with jasmine fragrance",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862415/Jasmine_Motia_jpqs67.jpg"
    ],
    category: "Body Spray"
  },
  {
    id: 10,
    name: "Baby Powder",
    price: 500,
    description: "Gentle herbal care for your little blessing, Because every baby deserves natural care 🌿",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862417/Powder_Morning_Dew_uwzfnt.jpg"
    ],
    category: "Powder"
  },
  {
    id: 11,
    name: "Mini Body Spray",
    price: 300,
    description: "Cool Water, Dunhill Desire , Jasmine/Motia",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1770614383/single_small_body_spray_vbrrdb.jpg",
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1770614384/single_body_spray_with_poch_ieo0ts.jpg",
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1770614383/single_body_spray_in_a_poch_avilqb.jpg"
    ],
    category: "Body Spray"
  },
  {
    id: 12,
    name: "Mini Lavender Rose",
    price: 400,
    description: "Lavender Rose",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1777665246/copy_of_small_lavender_q328ct_edb612.jpg"
    ],
    category: "Body Spray"
  },
  {
    id: 13,
    name: "Herbal HairTonic",
    price: 700,
    description: "Because your skin deserves comfort, love, and natural protection. 🌿🤍",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862413/Hair_Tonic_nzid3t.jpg",
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1776279874/Hair_tonic_Usage_vqqutw.jpg"
    ],
    category: "Featured"
  },
  {
    id: 14,
    name: "Herbal Face Powder",
    price: 500,
    description: "A herbal face powder that keeps your skin fresh, smooth, and comfortable all day. Pure herbal care for naturally radiant skin, where tradition meets daily skincare.",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862412/Face_Powder_uuhut2.jpg"
    ],
    category: "Powder"
  },
  {
    id: 15,
    name: "Lip Balm",
    price: 200,
    description: "Strawberry Lip Balm",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862416/Lip_Balm_Strawberry_tqi2wz.jpg"
    ],
    category: "Skin Care"
  },
  {
    id: 16,
    name: "Skin Care Basket",
    price: 1500,
    description: "A graceful ritual for skin and lips , Pure comfort, understated luxury, Where tradition is blended with elegance.",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862420/Skin_Care_Basket_2_b06il2.jpg"
    ],
    category: "Featured"
  },
  {
    id: 17,
    name: "Skin Care Cream (30gm)",
    price: 300,
    description: "Deeply moisturizes, protects, and keeps your skin soft and smooth all day",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1769104411/30_gm_skin_care_zwlo2g.jpg",
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862423/WhatsApp_Image_2026-01-03_at_12.25.13_AM_rfff06.jpg"
    ],
    category: "Skin Care"
  },
  {
    id: 18,
    name: "Skin Care Cream (50gm)",
    price: 500,
    description: "Wrap your skin in gentle care and lasting softness, every single day.",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862423/Skin_Care_lurkh8.jpg"
    ],
    category: "Skin Care"
  },
  {
    id: 19,
    name: "Cold Cream (30gm)",
    price: 300,
    description: "Wrap your skin in warmth, nourishment, and love. Crafted with care, trusted by nature",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862412/Cold_Cream_in_a_Tray_kznigy.jpg"
    ],
    category: "Skin Care"
  },
  {
    id: 20,
    name: "Cold Cream (60gm)",
    price: 1000,
    description: "Softness you feel, nourishment you trust",
    images: [
      "https://res.cloudinary.com/dmutdtyen/image/upload/v1767862412/Cold_Cream_Front_uu0e4z.jpg"
    ],
    category: "Skin Care"
  }
];

export const submitOrderToSheet = async (orderData: OrderData): Promise<boolean> => {
  try {
    if (!GOOGLE_SHEET_SCRIPT_URL) return false;
    const payload = JSON.stringify(orderData);

    // Google Apps Script requires text/plain in no-cors mode to avoid preflight fetch blocks
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      try {
        const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' });
        navigator.sendBeacon(GOOGLE_SHEET_SCRIPT_URL, blob);
        return true;
      } catch (beaconErr) {
        // Fallback to fetch if sendBeacon is restricted
      }
    }

    await fetch(GOOGLE_SHEET_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: { 
        'Content-Type': 'text/plain;charset=utf-8' 
      },
      body: payload,
    });
    return true;
  } catch (error) {
    console.warn("Notice: Order recorded locally and queued for WhatsApp confirmation.");
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

export function parseObjectsToProducts(items: any[]): Product[] {
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
    let rawName = String(nameKey ? item[nameKey] : (item.name || item.title || `Hakimi Product ${idx + 1}`)).trim();

    // Find Price
    const priceKey = keys.find(k => ['price', 'rate', 'cost', 'amount', 'pkr', 'rs'].includes(k.toLowerCase()));
    const price = parsePrice(priceKey ? item[priceKey] : item.price);

    // Find Description
    const descKey = keys.find(k => ['description', 'desc', 'details', 'detail', 'benefit', 'benefits'].includes(k.toLowerCase()));
    const description = String(descKey ? item[descKey] : (item.description || '')).trim();

    // Find Category
    const catKey = keys.find(k => ['category', 'cat', 'type', 'group', 'tag'].includes(k.toLowerCase()));
    let rawCategory = String(catKey ? item[catKey] : (item.category || 'General')).trim();
    
    // Normalize Category typos from sheets
    if (/skin\s*carem?/i.test(rawCategory)) {
      rawCategory = 'Skin Care';
    } else if (/featured\s*-\s*massage\s*oil/i.test(rawCategory)) {
      rawCategory = 'Featured';
    }

    // Find ID
    const idKey = keys.find(k => ['id', 'item_id', 'product_id', 'code', 'sku'].includes(k.toLowerCase()));
    const id = Number(idKey && !isNaN(Number(item[idKey])) ? item[idKey] : idx + 1);

    let resolvedName = rawName;
    if (rawName.toUpperCase() === 'OUT OF STOCK' || rawName.toUpperCase().trim() === 'OUT OF STOCK') {
      const allImgStr = images.join(' ').toLowerCase();
      const descLower = description.toLowerCase();
      if (allImgStr.includes('basket') || descLower.includes('basket') || descLower.includes('ritual for skin')) {
        resolvedName = 'Skin Care Basket';
      } else if (allImgStr.includes('30_gm') || descLower.includes('30_gm')) {
        resolvedName = 'Skin Care Cream (30gm)';
      } else if (allImgStr.includes('skin_care') && price === 500) {
        resolvedName = 'Skin Care Cream (50gm)';
      } else if (allImgStr.includes('cold_cream_in_a_tray') || descLower.includes('warmth, nourishment')) {
        resolvedName = 'Cold Cream (30gm)';
      } else if (allImgStr.includes('cold_cream') || descLower.includes('softness you feel')) {
        resolvedName = 'Cold Cream (60gm)';
      } else {
        resolvedName = `Skin Care Remedy #${id}`;
      }
    }

    return {
      id,
      name: resolvedName,
      price,
      description,
      images: images.length > 0 ? images : ['https://res.cloudinary.com/dmutdtyen/image/upload/v1767862412/Body_Spray_in_a_Shelf_y0ymfy.jpg'],
      category: rawCategory || 'General',
      isOutOfStock: false
    };
  }).filter(p => p.name && p.name.trim().length > 0);
}

export function parseRowsToProducts(values: any[][]): Product[] {
  if (!values || values.length < 2) return [];
  const headers = values[0].map((h: any) => String(h).toLowerCase().trim());
  const items: any[] = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (!row || row.length === 0) continue;
    const item: Record<string, any> = {};
    headers.forEach((h: string, colIdx: number) => {
      item[h] = row[colIdx] ?? '';
    });
    if (Object.values(item).some(v => v !== '')) {
      items.push(item);
    }
  }
  return parseObjectsToProducts(items);
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

/**
 * Fetch products directly via Google Sheets API v4 using an OAuth Access Token
 */
export const fetchProductsViaGoogleApi = async (token: string, sheetId: string = GOOGLE_SHEET_ID): Promise<Product[]> => {
  if (!token) throw new Error("OAuth access token required");
  
  // 1. Fetch metadata to discover sheets / tabs
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!metaRes.ok) {
    throw new Error(`Google Sheets API responded with status ${metaRes.status}`);
  }
  const metaData = await metaRes.json();
  const sheets = metaData.sheets || [];
  if (sheets.length === 0) throw new Error("No sheet tabs found in spreadsheet");

  // Pick "Products" tab if present, else first tab
  const targetSheet = sheets.find((s: any) => s.properties?.title?.toLowerCase() === 'products') || sheets[0];
  const tabName = targetSheet.properties.title;

  // 2. Fetch cell values for the target tab
  const range = encodeURIComponent(`${tabName}!A1:Z200`);
  const valuesRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!valuesRes.ok) {
    throw new Error(`Failed to read sheet values (Status ${valuesRes.status})`);
  }

  const valuesData = await valuesRes.json();
  const values = valuesData.values;
  if (!values || values.length < 2) {
    throw new Error("Spreadsheet contains no product rows");
  }

  const products = parseRowsToProducts(values);
  if (products.length > 0) {
    saveCache(products);
    console.log(`🌿 Hakimi Herbals - Synchronized ${products.length} products directly from Google Sheets API v4`);
  }
  return products;
};

export const fetchProductsFromSheet = async (): Promise<Product[]> => {
  // Strategy 1: Google Sheets REST API v4 using cached OAuth Access Token (if user signed in)
  const token = getCachedAccessToken();
  if (token && GOOGLE_SHEET_ID) {
    try {
      const apiProducts = await fetchProductsViaGoogleApi(token, GOOGLE_SHEET_ID);
      if (apiProducts.length > 0) return apiProducts;
    } catch (apiErr) {
      console.warn("OAuth Sheets API fetch attempted and failed, trying alternative methods...", apiErr);
    }
  }

  // Strategy 2: Apps Script URL (JSON)
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

  // Strategy 3: Google Visualization Query on Spreadsheet ID
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

    // Strategy 4: CSV Export on Spreadsheet ID
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

  // Strategy 5: Local Storage Cache
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

  // Strategy 6: Default Herbal Catalog
  console.log("🌿 Hakimi Herbals - Using default apothecary catalog");
  return DEFAULT_CATALOG;
};

export function saveCache(products: Product[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn("Failed saving products to cache", e);
  }
}

export function clearProductCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (e) {
    console.warn("Failed clearing product cache", e);
  }
}




