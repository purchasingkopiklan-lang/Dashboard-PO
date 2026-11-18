import React from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Truck, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp, 
  PlusCircle, 
  Clock, 
  Store,
  ChevronRight
} from 'lucide-react';
import { PurchaseOrder, InventoryItem } from '../types';

interface DashboardViewProps {
  orders: PurchaseOrder[];
  inventory: InventoryItem[];
  selectedOutlet: string;
  onNavigateTab: (tab: string) => void;
  onViewOrderSlip: (order: PurchaseOrder) => void;
  onOpenNewOrderWithItem: (item?: InventoryItem) => void;
  isIndonesian: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  inventory,
  selectedOutlet,
  onNavigateTab,
  onViewOrderSlip,
  onOpenNewOrderWithItem,
  isIndonesian
}) => {
  // Filter by selected outlet
  const filteredOrders = selectedOutlet === 'All Outlets' 
    ? orders 
    : orders.filter(o => o.outlet === selectedOutlet);

  const filteredInventory = selectedOutlet === 'All Outlets'
    ? inventory
    : inventory.filter(i => i.outletLocation === selectedOutlet);

  const pendingCount = filteredOrders.filter(o => o.status === 'Pending Approval').length;
  const inDeliveryCount = filteredOrders.filter(o => o.status === 'In Delivery').length;
  const completedCount = filteredOrders.filter(o => o.status === 'Received').length;

  const lowStockItems = filteredInventory.filter(item => item.currentStock <= item.minThreshold);

  const totalSpent = filteredOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 rounded-2xl p-6 border border-amber-900/40 text-stone-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
              <Store className="w-3.5 h-3.5" />
              {selectedOutlet}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {isIndonesian ? 'Selamat Datang di Purchasing Kopi Klan' : 'Welcome to Kopi Klan Purchasing Portal'}
            </h1>
            <p className="text-stone-300 text-sm mt-1 max-w-2xl">
              {isIndonesian
                ? 'Kelola pengadaan biji kopi pilihan (Gayo & Dampit), produk susu, sirup, cup packaging, dan pantau status pengiriman vendor secara real-time.'
                : 'Manage procurement of specialty coffee beans, dairy supplies, packaging cups, and track supplier fulfillment in real-time.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenNewOrderWithItem()}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm px-4 py-2.5 rounded-xl transition shadow-sm active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isIndonesian ? 'Buat PO Baru' : 'New Purchase Order'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Spend */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">
              {isIndonesian ? 'Total Belanja Pengadaan' : 'Total Procurement Value'}
            </span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
            {formatRupiah(totalSpent)}
          </div>
          <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>{filteredOrders.length} {isIndonesian ? 'pesanan tercatat' : 'recorded orders'}</span>
          </p>
        </div>

        {/* Pending Approval */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">
              {isIndonesian ? 'Menunggu Persetujuan' : 'Pending Approval'}
            </span>
            <div className="p-2 bg-yellow-50 rounded-lg text-yellow-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-yellow-700 mt-2">
            {pendingCount} {isIndonesian ? 'PO' : 'POs'}
          </div>
          <button 
            onClick={() => onNavigateTab('orders')}
            className="text-[11px] text-yellow-800 hover:underline mt-1 font-medium flex items-center gap-1"
          >
            {isIndonesian ? 'Tinjau & Setujui' : 'Review & Approve'} <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* In Delivery */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">
              {isIndonesian ? 'Dalam Pengiriman' : 'In Transit / Delivery'}
            </span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-700 mt-2">
            {inDeliveryCount} {isIndonesian ? 'PO' : 'POs'}
          </div>
          <button 
            onClick={() => onNavigateTab('receiving')}
            className="text-[11px] text-blue-800 hover:underline mt-1 font-medium flex items-center gap-1"
          >
            {isIndonesian ? 'Cek Penerimaan Barang' : 'Inspect Goods Receipt'} <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">
              {isIndonesian ? 'Peringatan Stok Menipis' : 'Low Stock Alert'}
            </span>
            <div className={`p-2 rounded-lg ${lowStockItems.length > 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-xl sm:text-2xl font-bold mt-2 ${lowStockItems.length > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {lowStockItems.length} {isIndonesian ? 'Item Bahan' : 'Items'}
          </div>
          <button 
            onClick={() => onNavigateTab('inventory')}
            className="text-[11px] text-stone-500 hover:text-stone-800 mt-1 font-medium flex items-center gap-1"
          >
            {isIndonesian ? 'Lihat status gudang' : 'View stock levels'} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Two Column Layout: Low Stock Action Items & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Low Stock Items needing Reorder (1 col) */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="font-semibold text-stone-900 text-sm">
                  {isIndonesian ? 'Perlu Restock Segera' : 'Urgent Reorder Required'}
                </h2>
              </div>
              <span className="text-xs bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-medium">
                {lowStockItems.length} {isIndonesian ? 'kritis' : 'critical'}
              </span>
            </div>

            <div className="divide-y divide-stone-100 mt-2 space-y-2">
              {lowStockItems.length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                  {isIndonesian ? 'Semua bahan baku dalam kondisi aman.' : 'All inventory levels are optimal.'}
                </div>
              ) : (
                lowStockItems.map(item => (
                  <div key={item.id} className="pt-2 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-stone-800">{item.name}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          {isIndonesian ? 'Sisa:' : 'Current:'} <span className="font-bold text-rose-600">{item.currentStock} {item.unit}</span> (Min: {item.minThreshold})
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenNewOrderWithItem(item)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-semibold px-2 py-1 rounded transition whitespace-nowrap"
                      >
                        + PO
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('inventory')}
            className="mt-4 w-full text-center text-xs text-amber-700 hover:text-amber-800 font-medium py-2 bg-amber-50/60 rounded-lg hover:bg-amber-100 transition"
          >
            {isIndonesian ? 'Kelola Semua Inventaris →' : 'Manage All Inventory →'}
          </button>
        </div>

        {/* Right Column: Recent Purchase Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-700" />
              <h2 className="font-semibold text-stone-900 text-sm">
                {isIndonesian ? 'Pesanan Pembelian Terbaru' : 'Recent Purchase Orders'}
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
            >
              {isIndonesian ? 'Lihat Semua' : 'View All'} ({filteredOrders.length}) →
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-stone-400 border-b border-stone-100 font-medium">
                  <th className="pb-2">{isIndonesian ? 'Nomor PO' : 'PO Number'}</th>
                  <th className="pb-2">{isIndonesian ? 'Supplier / Vendor' : 'Supplier'}</th>
                  <th className="pb-2">{isIndonesian ? 'Outlet' : 'Outlet'}</th>
                  <th className="pb-2 text-right">{isIndonesian ? 'Total (IDR)' : 'Total (IDR)'}</th>
                  <th className="pb-2 text-center">{isIndonesian ? 'Status' : 'Status'}</th>
                  <th className="pb-2 text-right">{isIndonesian ? 'Aksi' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOrders.slice(0, 5).map(po => {
                  let statusBadgeClass = 'bg-stone-100 text-stone-700';
                  if (po.status === 'Pending Approval') statusBadgeClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                  if (po.status === 'Approved') statusBadgeClass = 'bg-indigo-100 text-indigo-800 border-indigo-200';
                  if (po.status === 'In Delivery') statusBadgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
                  if (po.status === 'Received') statusBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
                  if (po.status === 'Cancelled') statusBadgeClass = 'bg-rose-100 text-rose-800 border-rose-200';

                  return (
                    <tr key={po.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-2.5 font-semibold text-stone-900">
                        {po.poNumber}
                        <div className="text-[10px] text-stone-400 font-normal">{po.orderDate}</div>
                      </td>
                      <td className="py-2.5 text-stone-700 font-medium">{po.supplierName}</td>
                      <td className="py-2.5 text-stone-500 max-w-[150px] truncate" title={po.outlet}>
                        {po.outlet.replace('Kopi Klan - ', '')}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-stone-900">
                        {formatRupiah(po.totalAmount)}
                      </td>
                      <td className="py-2.5 text-center">
                        <span className={`inline-block px-2 py-0.5 text-[10px] rounded-full font-medium border ${statusBadgeClass}`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onViewOrderSlip(po)}
                          className="text-[11px] text-amber-700 hover:text-amber-900 font-medium hover:underline"
                        >
                          {isIndonesian ? 'Cetak PO' : 'View Slip'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
