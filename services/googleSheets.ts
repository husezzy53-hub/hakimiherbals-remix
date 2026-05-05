
import { OrderData, Product } from '../types';
import { GOOGLE_SHEET_SCRIPT_URL } from '../constants';

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
    const response = await fetch(GOOGLE_SHEET_SCRIPT_URL);
    if (!response.ok) throw new Error(`Server status: ${response.status}`);
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    if (!Array.isArray(data)) return [];

    const parsedProducts = data.map((item: any) => {
      // Expanded detection for image columns
      const imageKey = Object.keys(item).find(k => 
        ['image', 'images', 'url', 'urls', 'img', 'pics', 'pictures', 'gallery', 'photo', 'photos'].includes(k.toLowerCase())
      );
      const rawImageValue = imageKey ? item[imageKey] : '';
      
      // Splits by commas, semicolons, pipes, or newlines
      const images = rawImageValue
        ? String(rawImageValue)
            .split(/[,;||\n]/)
            .map((url: string) => url.trim())
            .filter(url => url.toLowerCase().startsWith('http'))
        : [];

      return {
        id: Number(item.id || item.ID || Math.random()),
        name: String(item.name || item.Name || 'Unnamed Product'),
        price: Number(item.price || item.Price || 0),
        description: String(item.description || item.Description || ''),
        images: images,
        category: String(item.category || item.Category || 'General')
      };
    });

    console.log("🌿 Hakimi Herbals - Inventory Synchronized");
    return parsedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
