
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
  area: string;
}

export interface OrderData {
  customer: CustomerDetails;
  items: CartItem[];
  total: number;
  date: string;
}

export interface Review {
  id?: string;
  userName: string;
  rating: number;
  comment: string;
  audioUrl?: string;
  imageUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any; // Firestore Timestamp
}
