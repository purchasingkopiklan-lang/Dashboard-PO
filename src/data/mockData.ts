import { InventoryItem, PurchaseOrder, Supplier } from '../types';

export const OUTLETS = [
  'All Outlets',
  'Kopi Klan - Senopati (Jakarta Selatan)',
  'Kopi Klan - Kemang (Jakarta Selatan)',
  'Kopi Klan - BSD Grand Boulevard (Tangerang)',
  'Kopi Klan - Roastery & Central Warehouse'
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'PT Gayo Kopi Nusantara',
    contactPerson: 'Bambang Irawan',
    email: 'sales@gayokopinusantara.co.id',
    phone: '+62 811-2345-6789',
    category: ['Coffee Beans'],
    paymentTerms: 'Net 30',
    address: 'Kawasan Industri Roasting, Takengon & Jakarta',
    rating: 4.9,
    leadTimeDays: 3,
    status: 'Active'
  },
  {
    id: 'sup-2',
    name: 'PT Greenfields Dairy Indonesia',
    contactPerson: 'Dewi Lestari',
    email: 'orders@greenfields-id.com',
    phone: '+62 812-9876-5432',
    category: ['Dairy & Milk'],
    paymentTerms: 'Net 14',
    address: 'Jl. Rungkut Industri Raya No. 45, Jakarta Office',
    rating: 4.8,
    leadTimeDays: 1,
    status: 'Active'
  },
  {
    id: 'sup-3',
    name: 'CV Prima Kemasan Indonesia',
    contactPerson: 'Hendra Wijaya',
    email: 'info@primakemasan.com',
    phone: '+62 813-4455-6677',
    category: ['Packaging & Cups'],
    paymentTerms: 'Net 30',
    address: 'Kawasan Pergudangan Daan Mogot Km 14, Jakarta Barat',
    rating: 4.7,
    leadTimeDays: 4,
    status: 'Active'
  },
  {
    id: 'sup-4',
    name: 'PT Sukanda Djaya (Monin & Toppings)',
    contactPerson: 'Rian Syahputra',
    email: 'fnb-orders@sukandadjaya.com',
    phone: '+62 815-6677-8899',
    category: ['Syrups & Flavors'],
    paymentTerms: 'Net 30',
    address: 'Cibitung, Bekasi & MM2100',
    rating: 4.9,
    leadTimeDays: 2,
    status: 'Active'
  },
  {
    id: 'sup-5',
    name: 'PT Barista Mitra Sejahtera',
    contactPerson: 'Agus Santoso',
    email: 'service@baristamitra.co.id',
    phone: '+62 818-0912-3344',
    category: ['Equipment & Barista Tools', 'Cleaning & Sanitation'],
    paymentTerms: 'Cash on Delivery (COD)',
    address: 'Gandaria City Office Park, Jakarta Selatan',
    rating: 4.6,
    leadTimeDays: 2,
    status: 'Active'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    sku: 'KK-BEAN-GAYO',
    name: 'Arabica Aceh Gayo - Grade 1 (Medium Roast)',
    category: 'Coffee Beans',
    unit: 'Kg',
    currentStock: 45,
    minThreshold: 30,
    costPerUnit: 145000,
    preferredSupplier: 'PT Gayo Kopi Nusantara',
    outletLocation: 'Kopi Klan - Roastery & Central Warehouse',
    lastRestocked: '2026-10-18'
  },
  {
    id: 'inv-2',
    sku: 'KK-BEAN-ROB-DAMPIT',
    name: 'Robusta Dampit Fine - Espresso Blend (Dark Roast)',
    category: 'Coffee Beans',
    unit: 'Kg',
    currentStock: 18,
    minThreshold: 25,
    costPerUnit: 85000,
    preferredSupplier: 'PT Gayo Kopi Nusantara',
    outletLocation: 'Kopi Klan - Senopati (Jakarta Selatan)',
    lastRestocked: '2026-10-14'
  },
  {
    id: 'inv-3',
    sku: 'KK-DAIRY-GF-FRESH',
    name: 'Greenfields Fresh Milk Pasteurized (1 Liter)',
    category: 'Dairy & Milk',
    unit: 'Carton (12x1L)',
    currentStock: 8,
    minThreshold: 15,
    costPerUnit: 288000,
    preferredSupplier: 'PT Greenfields Dairy Indonesia',
    outletLocation: 'Kopi Klan - Senopati (Jakarta Selatan)',
    lastRestocked: '2026-10-19'
  },
  {
    id: 'inv-4',
    sku: 'KK-DAIRY-OATSIDE',
    name: 'Oatside Barista Blend Oat Milk (1 Liter)',
    category: 'Dairy & Milk',
    unit: 'Carton (6x1L)',
    currentStock: 5,
    minThreshold: 10,
    costPerUnit: 195000,
    preferredSupplier: 'PT Greenfields Dairy Indonesia',
    outletLocation: 'Kopi Klan - Kemang (Jakarta Selatan)',
    lastRestocked: '2026-10-17'
  },
  {
    id: 'inv-5',
    sku: 'KK-SYR-MONIN-VAN',
    name: 'Monin Vanilla Syrup (700ml)',
    category: 'Syrups & Flavors',
    unit: 'Bottle',
    currentStock: 14,
    minThreshold: 8,
    costPerUnit: 165000,
    preferredSupplier: 'PT Sukanda Djaya (Monin & Toppings)',
    outletLocation: 'Kopi Klan - Senopati (Jakarta Selatan)',
    lastRestocked: '2026-10-12'
  },
  {
    id: 'inv-6',
    sku: 'KK-SYR-MONIN-CAR',
    name: 'Monin Caramel Syrup (700ml)',
    category: 'Syrups & Flavors',
    unit: 'Bottle',
    currentStock: 4,
    minThreshold: 6,
    costPerUnit: 165000,
    preferredSupplier: 'PT Sukanda Djaya (Monin & Toppings)',
    outletLocation: 'Kopi Klan - BSD Grand Boulevard (Tangerang)',
    lastRestocked: '2026-10-10'
  },
  {
    id: 'inv-7',
    sku: 'KK-PKG-CUP-16OZ',
    name: 'Custom Kopi Klan Cold Cup PET 16oz + Strawless Lid',
    category: 'Packaging & Cups',
    unit: 'Box (1000 pcs)',
    currentStock: 2,
    minThreshold: 4,
    costPerUnit: 680000,
    preferredSupplier: 'CV Prima Kemasan Indonesia',
    outletLocation: 'Kopi Klan - Roastery & Central Warehouse',
    lastRestocked: '2026-10-05'
  },
  {
    id: 'inv-8',
    sku: 'KK-PKG-HOT-8OZ',
    name: 'Custom Kopi Klan Double-Wall Hot Cup 8oz with Lid',
    category: 'Packaging & Cups',
    unit: 'Box (500 pcs)',
    currentStock: 7,
    minThreshold: 5,
    costPerUnit: 420000,
    preferredSupplier: 'CV Prima Kemasan Indonesia',
    outletLocation: 'Kopi Klan - Kemang (Jakarta Selatan)',
    lastRestocked: '2026-10-15'
  },
  {
    id: 'inv-9',
    sku: 'KK-CLN-CAFIZA',
    name: 'Urnex Cafiza Espresso Machine Cleaning Powder 900g',
    category: 'Cleaning & Sanitation',
    unit: 'Bottle',
    currentStock: 3,
    minThreshold: 2,
    costPerUnit: 295000,
    preferredSupplier: 'PT Barista Mitra Sejahtera',
    outletLocation: 'Kopi Klan - Senopati (Jakarta Selatan)',
    lastRestocked: '2026-09-28'
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-101',
    poNumber: 'PO-KK-2026-0042',
    outlet: 'Kopi Klan - Senopati (Jakarta Selatan)',
    supplierId: 'sup-2',
    supplierName: 'PT Greenfields Dairy Indonesia',
    items: [
      {
        id: 'item-1',
        itemId: 'inv-3',
        name: 'Greenfields Fresh Milk Pasteurized (1 Liter)',
        category: 'Dairy & Milk',
        quantity: 15,
        unit: 'Carton (12x1L)',
        unitPrice: 288000,
        totalPrice: 4320000
      },
      {
        id: 'item-2',
        itemId: 'inv-4',
        name: 'Oatside Barista Blend Oat Milk (1 Liter)',
        category: 'Dairy & Milk',
        quantity: 8,
        unit: 'Carton (6x1L)',
        unitPrice: 195000,
        totalPrice: 1560000
      }
    ],
    subtotal: 5880000,
    taxAmount: 646800,
    totalAmount: 6526800,
    status: 'In Delivery',
    orderDate: '2026-10-19',
    expectedDelivery: '2026-10-21',
    requestedBy: 'Fahmi (Store Manager Senopati)',
    approvedBy: 'Dimas (Purchasing Head)',
    approvalDate: '2026-10-19',
    notes: 'Prioritas pagi sebelum jam operasional 07:00 WIB'
  },
  {
    id: 'po-102',
    poNumber: 'PO-KK-2026-0043',
    outlet: 'Kopi Klan - Roastery & Central Warehouse',
    supplierId: 'sup-1',
    supplierName: 'PT Gayo Kopi Nusantara',
    items: [
      {
        id: 'item-3',
        itemId: 'inv-1',
        name: 'Arabica Aceh Gayo - Grade 1 (Medium Roast)',
        category: 'Coffee Beans',
        quantity: 100,
        unit: 'Kg',
        unitPrice: 145000,
        totalPrice: 14500000
      },
      {
        id: 'item-4',
        itemId: 'inv-2',
        name: 'Robusta Dampit Fine - Espresso Blend (Dark Roast)',
        category: 'Coffee Beans',
        quantity: 80,
        unit: 'Kg',
        unitPrice: 85000,
        totalPrice: 6800000
      }
    ],
    subtotal: 21300000,
    taxAmount: 2343000,
    totalAmount: 23643000,
    status: 'Pending Approval',
    orderDate: '2026-10-20',
    expectedDelivery: '2026-10-23',
    requestedBy: 'Kevin (Head Roaster)',
    notes: 'Restock batch bulanan roastery pusat untuk persiapan event weekend'
  },
  {
    id: 'po-103',
    poNumber: 'PO-KK-2026-0040',
    outlet: 'Kopi Klan - Kemang (Jakarta Selatan)',
    supplierId: 'sup-3',
    supplierName: 'CV Prima Kemasan Indonesia',
    items: [
      {
        id: 'item-5',
        itemId: 'inv-7',
        name: 'Custom Kopi Klan Cold Cup PET 16oz + Strawless Lid',
        category: 'Packaging & Cups',
        quantity: 5,
        unit: 'Box (1000 pcs)',
        unitPrice: 680000,
        totalPrice: 3400000
      }
    ],
    subtotal: 3400000,
    taxAmount: 374000,
    totalAmount: 3774000,
    status: 'Received',
    orderDate: '2026-10-15',
    expectedDelivery: '2026-10-18',
    requestedBy: 'Siti (Supervisor Kemang)',
    approvedBy: 'Dimas (Purchasing Head)',
    approvalDate: '2026-10-15',
    receivedDate: '2026-10-18',
    receivedNotes: 'Kondisi 5 box tersegel rapi, isi lengkap 5000 pcs cup dan lid.',
    notes: 'Kemasan cetak logo Kopi Klan edisi 2026'
  },
  {
    id: 'po-104',
    poNumber: 'PO-KK-2026-0041',
    outlet: 'Kopi Klan - BSD Grand Boulevard (Tangerang)',
    supplierId: 'sup-4',
    supplierName: 'PT Sukanda Djaya (Monin & Toppings)',
    items: [
      {
        id: 'item-6',
        itemId: 'inv-5',
        name: 'Monin Vanilla Syrup (700ml)',
        category: 'Syrups & Flavors',
        quantity: 6,
        unit: 'Bottle',
        unitPrice: 165000,
        totalPrice: 990000
      },
      {
        id: 'item-7',
        itemId: 'inv-6',
        name: 'Monin Caramel Syrup (700ml)',
        category: 'Syrups & Flavors',
        quantity: 6,
        unit: 'Bottle',
        unitPrice: 165000,
        totalPrice: 990000
      }
    ],
    subtotal: 1980000,
    taxAmount: 217800,
    totalAmount: 2197800,
    status: 'Approved',
    orderDate: '2026-10-18',
    expectedDelivery: '2026-10-22',
    requestedBy: 'Andi (Store Supervisor BSD)',
    approvedBy: 'Dimas (Purchasing Head)',
    approvalDate: '2026-10-19',
    notes: 'Pengiriman via armada logistik mitra'
  }
];
