import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Building, 
  Calendar, 
  FileText,
  Calculator
} from 'lucide-react';
import { OUTLETS } from '../data/mockData';
import { InventoryItem, OrderItem, PurchaseOrder, Supplier } from '../types';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (po: PurchaseOrder) => void;
  suppliers: Supplier[];
  inventory: InventoryItem[];
  preselectedItem?: InventoryItem | null;
  defaultOutlet: string;
  isIndonesian: boolean;
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  suppliers,
  inventory,
  preselectedItem,
  defaultOutlet,
  isIndonesian
}) => {
  const [outlet, setOutlet] = useState(
    defaultOutlet !== 'All Outlets' ? defaultOutlet : 'Kopi Klan - Senopati (Jakarta Selatan)'
  );
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [notes, setNotes] = useState('');
  const [requestedBy, setRequestedBy] = useState('Fahmi (Purchasing Lead)');
  
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    // Set default delivery date 3 days ahead
    const date = new Date();
    date.setDate(date.getDate() + 3);
    setExpectedDelivery(date.toISOString().split('T')[0]);

    if (preselectedItem) {
      // Find supplier matching preselectedItem
      const sup = suppliers.find(s => s.name === preselectedItem.preferredSupplier) || suppliers[0];
      if (sup) setSupplierId(sup.id);

      setOrderItems([
        {
          id: `item-${Date.now()}`,
          itemId: preselectedItem.id,
          name: preselectedItem.name,
          category: preselectedItem.category,
          quantity: Math.max(preselectedItem.minThreshold * 2 - preselectedItem.currentStock, 5),
          unit: preselectedItem.unit,
          unitPrice: preselectedItem.costPerUnit,
          totalPrice: Math.max(preselectedItem.minThreshold * 2 - preselectedItem.currentStock, 5) * preselectedItem.costPerUnit
        }
      ]);
    } else {
      // Initialize with one blank/default item
      const firstInv = inventory[0];
      if (firstInv) {
        setOrderItems([
          {
            id: `item-${Date.now()}`,
            itemId: firstInv.id,
            name: firstInv.name,
            category: firstInv.category,
            quantity: 10,
            unit: firstInv.unit,
            unitPrice: firstInv.costPerUnit,
            totalPrice: 10 * firstInv.costPerUnit
          }
        ]);
      }
    }
  }, [preselectedItem, isOpen]);

  if (!isOpen) return null;

  const currentSupplier = suppliers.find(s => s.id === supplierId) || suppliers[0];

  const handleAddItemRow = () => {
    const defaultItem = inventory.find(i => i.preferredSupplier === currentSupplier?.name) || inventory[0];
    if (!defaultItem) return;

    setOrderItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        itemId: defaultItem.id,
        name: defaultItem.name,
        category: defaultItem.category,
        quantity: 5,
        unit: defaultItem.unit,
        unitPrice: defaultItem.costPerUnit,
        totalPrice: 5 * defaultItem.costPerUnit
      }
    ]);
  };

  const handleItemSelect = (index: number, invId: string) => {
    const inv = inventory.find(i => i.id === invId);
    if (!inv) return;

    setOrderItems(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        itemId: inv.id,
        name: inv.name,
        category: inv.category,
        unit: inv.unit,
        unitPrice: inv.costPerUnit,
        totalPrice: copy[index].quantity * inv.costPerUnit
      };
      return copy;
    });
  };

  const handleQuantityChange = (index: number, qty: number) => {
    const safeQty = Math.max(1, qty);
    setOrderItems(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        quantity: safeQty,
        totalPrice: safeQty * copy[index].unitPrice
      };
      return copy;
    });
  };

  const handlePriceChange = (index: number, price: number) => {
    const safePrice = Math.max(0, price);
    setOrderItems(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        unitPrice: safePrice,
        totalPrice: copy[index].quantity * safePrice
      };
      return copy;
    });
  };

  const handleRemoveRow = (index: number) => {
    if (orderItems.length <= 1) return;
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = orderItems.reduce((acc, curr) => acc + curr.totalPrice, 0);
  const taxAmount = Math.round(subtotal * 0.11); // PPN 11%
  const totalAmount = subtotal + taxAmount;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderItems.length === 0) return;

    const poSeq = Math.floor(1000 + Math.random() * 9000);
    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO-KK-2026-${poSeq}`,
      outlet,
      supplierId,
      supplierName: currentSupplier?.name || 'PT Vendor Kopi',
      items: orderItems,
      subtotal,
      taxAmount,
      totalAmount,
      status: 'Pending Approval',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery,
      requestedBy,
      notes
    };

    onSubmit(newPO);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl border border-stone-200 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              <span>{isIndonesian ? 'Buat Pesanan Pembelian Baru (Purchase Order)' : 'Create New Purchase Order'}</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {isIndonesian
                ? 'Lengkapi rincian pesanan bahan baku untuk dikirim ke supplier resmi Kopi Klan.'
                : 'Fill in order details to procure ingredients from authorized suppliers.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Outlet & Supplier Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {isIndonesian ? 'Tujuan Outlet / Gerai' : 'Target Outlet'}
              </label>
              <select
                value={outlet}
                onChange={(e) => setOutlet(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {OUTLETS.filter(o => o !== 'All Outlets').map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {isIndonesian ? 'Pilih Vendor / Supplier' : 'Select Supplier'}
              </label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.paymentTerms})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {isIndonesian ? 'Target Tanggal Pengiriman' : 'Expected Delivery Date'}
              </label>
              <input
                type="date"
                required
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {isIndonesian ? 'Diajukan Oleh (PIC)' : 'Requested By'}
              </label>
              <input
                type="text"
                required
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Line items section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-stone-800">
                {isIndonesian ? 'Daftar Barang yang Dipesan' : 'Line Items'}
              </span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1 hover:underline text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                {isIndonesian ? 'Tambah Baris Item' : 'Add Item Row'}
              </button>
            </div>

            <div className="border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100 max-h-60 overflow-y-auto">
              {orderItems.map((item, index) => (
                <div key={item.id} className="p-3 bg-stone-50/50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex-1 w-full sm:w-auto">
                    <select
                      value={item.itemId}
                      onChange={(e) => handleItemSelect(index, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-md"
                    >
                      {inventory.map(inv => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} ({inv.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center gap-1">
                      <span className="text-stone-400 text-[10px]">Qty:</span>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs bg-white border border-stone-200 rounded-md text-center"
                      />
                      <span className="text-stone-500 text-[11px] min-w-[40px]">{item.unit}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-stone-400 text-[10px]">@Rp:</span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.unitPrice}
                        onChange={(e) => handlePriceChange(index, Number(e.target.value))}
                        className="w-24 px-2 py-1 text-xs bg-white border border-stone-200 rounded-md text-right font-mono"
                      />
                    </div>

                    <div className="text-right min-w-[90px] font-semibold text-stone-900 font-mono text-xs">
                      {formatRupiah(item.totalPrice)}
                    </div>

                    <button
                      type="button"
                      disabled={orderItems.length <= 1}
                      onClick={() => handleRemoveRow(index)}
                      className="p-1 text-stone-400 hover:text-rose-600 disabled:opacity-30 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes & Summary Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-stone-700 font-semibold mb-1">
                {isIndonesian ? 'Instruksi Pengiriman / Catatan' : 'Delivery Instructions / Notes'}
              </label>
              <textarea
                rows={3}
                placeholder={isIndonesian ? "Catatan untuk driver atau packing khusus..." : "Notes for vendor driver or packaging..."}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg"
              />
            </div>

            <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/70 space-y-2">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-600">
                <span>PPN (11%):</span>
                <span className="font-mono">{formatRupiah(taxAmount)}</span>
              </div>
              <div className="border-t border-amber-200 pt-2 flex justify-between text-sm font-bold text-amber-950">
                <span>Total Pesanan (PO):</span>
                <span className="font-mono">{formatRupiah(totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 font-medium"
            >
              {isIndonesian ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg shadow-xs active:scale-95"
            >
              {isIndonesian ? 'Ajukan PO (Kirim Persetujuan)' : 'Submit Purchase Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
