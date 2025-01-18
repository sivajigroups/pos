export interface Product {
  id: string;
  name: string;
  description: string;
  brandId: string;
  brand_id?: string;
  modelNumber: string;
  model_number?: string;
  supplierId: string;
  supplier_id?: string;
  categoryId: string;
  category_id?: string;
  buyingPrice: number;
  buying_price?: string;
  sellingPrice: number;
  selling_price?: string;
  stock: number;
  createdAt: Date;
  created_at?: string;
  updatedAt: Date;
  updated_at?: string;
  brands?: {
    id: string;
    name: string;
  };
  suppliers?: {
    id: string;
    name: string;
  };
  categories?: {
    id: string;
    name: string;
  };
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
}

export interface Transaction {
  id: string;
  items: CartItem[];
  subtotalAmount: number;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  timestamp: Date;
}

export type View = 'pos' | 'inventory' | 'categories' | 'brands' | 'suppliers' | 'orders';