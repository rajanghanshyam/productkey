export interface ProductKey {
  id: string;
  key: string;
  categoryId: string;
  subcategoryId?: string;
  status: 'available' | 'allocated' | 'expired';
  createdAt: string;
  expiresAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  parentId: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface Allocation {
  id: string;
  productKeyId: string;
  customerId: string;
  allocatedAt: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  description?: string;
  categoryId: string;
  subcategoryId?: string;
  price: number;
  stockLevel: number;
  reorderPoint: number;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: string;
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  purchaseDate: string;
  notes?: string;
}

export interface Usage {
  id: string;
  inventoryItemId: string;
  quantity: number;
  usageDate: string;
  notes?: string;
}