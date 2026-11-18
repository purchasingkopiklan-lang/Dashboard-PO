import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  AlertTriangle, 
  Plus, 
  ArrowUpDown, 
  Check, 
  Store,
  Layers,
  Sparkles
} from 'lucide-react';
import { InventoryItem, ProductCategory } from '../types';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onUpdateStock: (itemId: string, newStock: number) => void;
  onAddNewItem: (item: InventoryItem) => void;
  onReorderItem: (item: InventoryItem) => void;
  selectedOutlet: string;
  isIndonesian: boolean;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onUpdateStock,
  onAddNewItem,
  onReorderItem,
  selectedOutlet,
  isIndonesian
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockEditValue, setStockEditValue] = useState<number>(0);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ProductCategory>('Coffee Beans');
  const [newItemUnit, setNewItemUnit] = useState('Kg');
  const [newItemStock, setNewItemStock] = useState(10);
  const [newItemThreshold, setNewItemThreshold] = useState(5);
  const [newItemCost, setNewItemCost] = useState(100000);
  const [newItemSupplier, setNewItemSupplier] = useState('PT Gayo Kopi Nusantara');
  const [newItemOutlet, setNewItemOutlet] = useState(
    selectedOutlet === 'All Outlets' ? 'Kopi Klan - Senopati (Jakarta Selatan)' : selectedOutlet
  );

  const categories: ProductCategory[] = [
    'Coffee Beans',
    'Dairy & Milk',
    'Syrups & Flavors',
    'Packaging & Cups',
    'Equipment & Barista Tools',
    'Cleaning & Sanitation'
  ];

  const filteredItems = inventory.filter(item => {
    if (selectedOutlet !== 'All Outlets' && item.outletLocation !== selectedOutlet) {
      return false;
    }
    if (categoryFilter !== 'All' && item.category !== categoryFilter) {
      return false;
    }
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q) ||
        item.preferredSupplier.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSaveStock = (id: string) => {
    onUpdateStock(id, stockEditValue);
    setEditingStockId(null);
  };

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemSku.trim()) return;

    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      sku: newItemSku.toUpperCase(),
      name: newItemName,
      category: newItemCategory,
      unit: newItemUnit,
      currentStock: Number(newItemStock),
      minThreshold: Number(newItemThreshold),
      costPerUnit: Number(newItemCost),
      preferredSupplier: newItemSupplier,
      outletLocation: newItemOutlet,
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    onAddNewItem(item);
    setShowAddModal(false);
    setNewItemName('');
    setNewItemSku('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-900">
              {isIndonesian ? 'Stok Bahan Baku & Logistik Gerai' : 'Raw Materials & Outlet Inventory'}
            </h1>
            <p className="text-stone-500 text-xs mt-0.5">
              {isIndonesian
                ? 'Pantau stok fisik biji kopi, susu, sirup, dan kemasan per outlet dengan sistem peringatan otomatis.'
                : 'Monitor physical stock of beans, dairy, syrups, and packaging per outlet with auto low-stock alerts.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="self-start md:self-auto flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isIndonesian ? '+ Tambah Master Item' : '+ Add Inventory Item'}</span>
          </button>
        </div>

        {/* Filter row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-100">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder={isIndonesian ? "Cari nama barang, kode SKU, atau supplier..." : "Search item name, SKU code, or supplier..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="All">{isIndonesian ? 'Semua Kategori' : 'All Categories'}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">{isIndonesian ? 'SKU & Bahan' : 'SKU & Item'}</th>
                <th className="py-3 px-4">{isIndonesian ? 'Kategori' : 'Category'}</th>
                <th className="py-3 px-4">{isIndonesian ? 'Lokasi Outlet' : 'Outlet'}</th>
                <th className="py-3 px-4 text-center">{isIndonesian ? 'Sisa Stok' : 'Current Stock'}</th>
                <th className="py-3 px-4 text-center">{isIndonesian ? 'Batas Min' : 'Min Limit'}</th>
                <th className="py-3 px-4 text-right">{isIndonesian ? 'Biaya Satuan' : 'Unit Cost'}</th>
                <th className="py-3 px-4 text-center">{isIndonesian ? 'Status Stok' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{isIndonesian ? 'Tindakan' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredItems.map(item => {
                const isLow = item.currentStock <= item.minThreshold;
                const isEditing = editingStockId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{item.name}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{item.sku} • {item.preferredSupplier}</div>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <span className="inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[11px]">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      <div className="flex items-center gap-1">
                        <Store className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{item.outletLocation.replace('Kopi Klan - ', '')}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            value={stockEditValue}
                            onChange={(e) => setStockEditValue(Number(e.target.value))}
                            className="w-16 px-1.5 py-1 text-center border border-amber-500 rounded text-xs"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveStock(item.id)}
                            className="p-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          onClick={() => {
                            setEditingStockId(item.id);
                            setStockEditValue(item.currentStock);
                          }}
                          className="font-bold text-stone-900 cursor-pointer hover:text-amber-700 hover:underline inline-flex items-center gap-1"
                          title="Klik untuk ubah stok cepat"
                        >
                          <span>{item.currentStock} {item.unit}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center text-stone-500 font-medium">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-stone-800">
                      {formatRupiah(item.costPerUnit)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isLow ? (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {isIndonesian ? 'Stok Rendah' : 'Low Stock'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium px-2 py-0.5 rounded-full">
                          <Check className="w-2.5 h-2.5" />
                          {isIndonesian ? 'Aman' : 'In Stock'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onReorderItem(item)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded transition ${
                          isLow 
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs' 
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {isIndonesian ? '+ Reorder PO' : '+ Reorder PO'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <h2 className="text-lg font-bold text-stone-900 mb-1">
              {isIndonesian ? 'Tambah Master Item Bahan Baru' : 'Add New Inventory Master Item'}
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              {isIndonesian
                ? 'Daftarkan SKU produk baru untuk pengadaan outlet Kopi Klan.'
                : 'Register a new SKU for Kopi Klan outlets procurement.'}
            </p>

            <form onSubmit={handleCreateNewItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isIndonesian ? 'Nama Bahan / Barang' : 'Item Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arabica Flores Bajawa (Medium)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Kode SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="KK-BEAN-FLORES"
                    value={newItemSku}
                    onChange={(e) => setNewItemSku(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isIndonesian ? 'Kategori' : 'Category'}
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isIndonesian ? 'Satuan' : 'Unit'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kg, Carton, Bottle"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isIndonesian ? 'Stok Awal' : 'Initial Stock'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isIndonesian ? 'Batas Min' : 'Min Limit'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItemThreshold}
                    onChange={(e) => setNewItemThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isIndonesian ? 'Harga Satuan (IDR)' : 'Cost per Unit (IDR)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isIndonesian ? 'Supplier Utama' : 'Preferred Supplier'}
                  </label>
                  <input
                    type="text"
                    value={newItemSupplier}
                    onChange={(e) => setNewItemSupplier(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
                >
                  {isIndonesian ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg"
                >
                  {isIndonesian ? 'Simpan Item' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
