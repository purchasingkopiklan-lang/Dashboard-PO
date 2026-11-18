export type OrderStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'In Delivery' | 'Received' | 'Cancelled';

export type ProductCategory = 
  | 'Coffee Beans' 
  | 'Dairy & Milk' 
  | 'Syrups & Flavors' 
  | 'Packaging & Cups' 
  | 'Equipment & Barista Tools' 
  | 'Cleaning & Sanitation';

export interface OrderItem {
  id: string;
  itemId: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  outlet: string;
  supplierId: string;
  supplierName: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number; // 11% PPN
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  expectedDelivery: string;
  requestedBy: string;
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
  receivedDate?: string;
  receivedNotes?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  unit: string;
  currentStock: number;
  minThreshold: number;
  costPerUnit: number;
  preferredSupplier: string;
  outletLocation: string;
  lastRestocked: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: ProductCategory[];
  paymentTerms: string; // e.g. "Net 14", "Net 30", "Cash on Delivery (COD)"
  address: string;
  rating: number;
  leadTimeDays: number;
  status: 'Active' | 'Under Review' | 'Inactive';
}
