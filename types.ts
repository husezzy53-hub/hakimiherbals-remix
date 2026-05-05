
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  whatsapp: string;
  address: string;
  email: string;
}

export interface OrderData {
  customer: CustomerDetails;
  items: CartItem[];
  total: number;
  date: string;
}
