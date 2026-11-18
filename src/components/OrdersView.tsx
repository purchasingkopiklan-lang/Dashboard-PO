import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  Truck, 
  Printer, 
  XCircle, 
  Clock, 
  ChevronDown,
  Building,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PurchaseOrder, OrderStatus } from '../types';

interface OrdersViewProps {
  orders: PurchaseOrder[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus, notes?: string) => void;
  onViewSlip: (order: PurchaseOrder) => void;
  onOpenNewOrder: () => void;
  selectedOutlet: string;
  isIndonesian: boolean;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onUpdateStatus,
  onViewSlip,
  onOpenNewOrder,
  selectedOutlet,
  isIndonesian
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredOrders = orders.filter(po => {
    // Outlet filter
    if (selectedOutlet !== 'All Outlets' && po.outlet !== selectedOutlet) {
      return false;
    }
    // Status filter
    if (statusFilter !== 'All' && po.status !== statusFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchPoNumber = po.poNumber.toLowerCase().includes(q);
      const matchSupplier = po.supplierName.toLowerCase().includes(q);
      const matchItem = po.items.some(i => i.name.toLowerCase().includes(q));
      return matchPoNumber || matchSupplier || matchItem;
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

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending Approval':
        return <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"><Clock className="w-3 h-3" /> {status}</span>;
      case 'Approved':
        return <span className="bg-indigo-100 text-indigo-800 border border-indigo-300 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {status}</span>;
      case 'In Delivery':
        return <span className="bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"><Truck className="w-3 h-3" /> {status}</span>;
      case 'Received':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" /> {status}</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1"><XCircle className="w-3 h-3" /> {status}</span>;
      default:
        return <span className="bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-900">
              {isIndonesian ? 'Daftar Pesanan Pembelian (PO)' : 'Purchase Orders List'}
            </h1>
            <p className="text-stone-500 text-xs mt-0.5">
              {isIndonesian
                ? 'Kelola alur persetujuan, cetak surat pesanan (PO slip), dan pantau pengiriman bahan baku ke gerai.'
                : 'Manage approval workflows, print official PO slips, and track raw material shipments to outlets.'}
            </p>
          </div>

          <button
            onClick={onOpenNewOrder}
            className="self-start md:self-auto bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs active:scale-95"
          >
            {isIndonesian ? '+ Buat Purchase Order' : '+ Create Purchase Order'}
          </button>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-100">
          {/* Search box */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder={isIndonesian ? "Cari nomor PO, nama vendor, atau item bahan..." : "Search PO #, supplier, or items..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
            >
              <option value="All">{isIndonesian ? 'Semua Status' : 'All Statuses'}</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="In Delivery">In Delivery</option>
              <option value="Received">Received</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
            <AlertCircle className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="font-medium text-sm text-stone-700">
              {isIndonesian ? 'Tidak ada pesanan pembelian yang sesuai filter.' : 'No purchase orders matching criteria.'}
            </p>
            <p className="text-xs text-stone-400 mt-1">
              {isIndonesian ? 'Coba ubah kata kunci pencarian atau status filter.' : 'Try adjusting your search query or status filter.'}
            </p>
          </div>
        ) : (
          filteredOrders.map(po => (
            <div 
              key={po.id} 
              className="bg-white rounded-xl border border-stone-200 shadow-xs hover:border-amber-300 transition overflow-hidden"
            >
              {/* Header card */}
              <div className="p-4 sm:p-5 bg-stone-50/50 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-100/70 text-amber-900 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm sm:text-base">{po.poNumber}</span>
                      {getStatusBadge(po.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-stone-400" />
                        {po.outlet}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {po.orderDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewSlip(po)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg border border-stone-300 transition"
                    title="Pratinjau & Cetak Surat Pesanan"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isIndonesian ? 'Cetak PO' : 'Print PO'}</span>
                  </button>

                  {/* Quick Action buttons based on status */}
                  {po.status === 'Pending Approval' && (
                    <button
                      onClick={() => onUpdateStatus(po.id, 'Approved')}
                      className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition active:scale-95"
                    >
                      {isIndonesian ? 'Setujui PO' : 'Approve PO'}
                    </button>
                  )}

                  {po.status === 'Approved' && (
                    <button
                      onClick={() => onUpdateStatus(po.id, 'In Delivery')}
                      className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition active:scale-95 flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{isIndonesian ? 'Kirim ke Vendor' : 'Mark In Delivery'}</span>
                    </button>
                  )}

                  {po.status === 'In Delivery' && (
                    <button
                      onClick={() => onUpdateStatus(po.id, 'Received')}
                      className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition active:scale-95 flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{isIndonesian ? 'Terima Barang' : 'Receive Goods'}</span>
                    </button>
                  )}

                  {po.status !== 'Received' && po.status !== 'Cancelled' && (
                    <button
                      onClick={() => {
                        if (confirm(isIndonesian ? 'Batalkan pesanan pembelian ini?' : 'Cancel this purchase order?')) {
                          onUpdateStatus(po.id, 'Cancelled');
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition"
                      title="Batalkan PO"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Items Table inside Card */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row justify-between text-xs text-stone-600 mb-2 gap-1">
                  <div>
                    <span className="text-stone-400">{isIndonesian ? 'Supplier Vendor:' : 'Supplier:'} </span>
                    <span className="font-semibold text-stone-800">{po.supplierName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400">{isIndonesian ? 'Est. Pengiriman:' : 'Est. Delivery:'} </span>
                    <span className="font-medium text-stone-700">{po.expectedDelivery}</span>
                  </div>
                </div>

                <div className="border border-stone-100 rounded-lg overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
                      <tr>
                        <th className="py-2 px-3">{isIndonesian ? 'Item Bahan Baku' : 'Item Name'}</th>
                        <th className="py-2 px-3">{isIndonesian ? 'Kategori' : 'Category'}</th>
                        <th className="py-2 px-3 text-center">{isIndonesian ? 'Jumlah' : 'Qty'}</th>
                        <th className="py-2 px-3 text-right">{isIndonesian ? 'Harga Satuan' : 'Unit Price'}</th>
                        <th className="py-2 px-3 text-right">{isIndonesian ? 'Total' : 'Total'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {po.items.map(item => (
                        <tr key={item.id} className="text-stone-700">
                          <td className="py-2 px-3 font-medium text-stone-900">{item.name}</td>
                          <td className="py-2 px-3 text-stone-500">{item.category}</td>
                          <td className="py-2 px-3 text-center font-semibold">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-2 px-3 text-right text-stone-600">
                            {formatRupiah(item.unitPrice)}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-stone-900">
                            {formatRupiah(item.totalPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer totals & note */}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-2 border-t border-stone-100">
                  <div className="text-stone-500">
                    <span className="text-stone-400">{isIndonesian ? 'Catatan:' : 'Notes:'} </span>
                    <span className="italic">{po.notes || (isIndonesian ? 'Tidak ada catatan' : 'No notes')}</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-stone-400 mr-2">PPN 11%:</span>
                      <span className="text-stone-600">{formatRupiah(po.taxAmount)}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 mr-2 font-semibold">Total PO:</span>
                      <span className="text-sm font-bold text-amber-800">{formatRupiah(po.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
