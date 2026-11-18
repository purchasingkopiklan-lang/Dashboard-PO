import React from 'react';
import { X, Printer, Coffee, CheckCircle, Download } from 'lucide-react';
import { PurchaseOrder } from '../types';

interface OrderSlipModalProps {
  order: PurchaseOrder | null;
  onClose: () => void;
  isIndonesian: boolean;
}

export const OrderSlipModal: React.FC<OrderSlipModalProps> = ({
  order,
  onClose,
  isIndonesian
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-auto text-stone-900">
        {/* Modal actions */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 print:hidden">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            {isIndonesian ? 'Pratinjau Surat Pesanan Resmi' : 'Official Purchase Order Slip Preview'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isIndonesian ? 'Cetak / Simpan PDF' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable PO Sheet */}
        <div className="mt-4 print:mt-0 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-stone-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-900 text-white flex items-center justify-center">
                <Coffee className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-stone-900 leading-tight">KOPI KLAN</h1>
                <p className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
                  Divisi Pengadaan & Logistik Ritel
                </p>
                <p className="text-[10px] text-stone-500">
                  Headquarters: Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan 12190
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-stone-900 text-amber-300 font-mono font-bold text-xs px-3 py-1 rounded">
                PURCHASE ORDER
              </span>
              <div className="text-sm font-extrabold text-stone-900 mt-1 font-mono">{order.poNumber}</div>
              <div className="text-[10px] text-stone-500">{order.orderDate}</div>
            </div>
          </div>

          {/* Info section (Vendor & Delivery) */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                {isIndonesian ? 'Kepada Vendor / Rekanan:' : 'Vendor / Supplier:'}
              </span>
              <div className="font-bold text-stone-900 text-sm">{order.supplierName}</div>
              <div className="text-stone-600 mt-0.5">Status: Rekanan Resmi Terverifikasi</div>
              <div className="text-stone-500 text-[11px] mt-1">Termin Pembayaran: Sesuai Kontrak Rekanan</div>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                {isIndonesian ? 'Tujuan Pengiriman Outlet:' : 'Ship To Outlet:'}
              </span>
              <div className="font-bold text-stone-900 text-sm">{order.outlet}</div>
              <div className="text-stone-600 mt-0.5">
                {isIndonesian ? 'Target Kedatangan:' : 'Target Delivery:'} <strong>{order.expectedDelivery}</strong>
              </div>
              <div className="text-stone-500 text-[11px] mt-1">
                {isIndonesian ? 'Pemohon:' : 'Requested By:'} {order.requestedBy}
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-stone-300 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-300">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">No</th>
                  <th className="py-2.5 px-3">{isIndonesian ? 'Deskripsi Bahan Baku' : 'Item Description'}</th>
                  <th className="py-2.5 px-3">{isIndonesian ? 'Kategori' : 'Category'}</th>
                  <th className="py-2.5 px-3 text-center">{isIndonesian ? 'Kuantitas' : 'Qty'}</th>
                  <th className="py-2.5 px-3 text-right">{isIndonesian ? 'Harga Satuan' : 'Unit Price'}</th>
                  <th className="py-2.5 px-3 text-right">{isIndonesian ? 'Jumlah Total' : 'Amount'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 text-center text-stone-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{item.name}</td>
                    <td className="py-2.5 px-3 text-stone-500">{item.category}</td>
                    <td className="py-2.5 px-3 text-center font-bold">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-stone-700">
                      {formatRupiah(item.unitPrice)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                      {formatRupiah(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals and notes */}
          <div className="flex justify-between items-start gap-6 text-xs">
            <div className="flex-1 p-3 bg-stone-50 rounded-lg border border-stone-200">
              <span className="font-bold text-stone-700 block mb-0.5">
                {isIndonesian ? 'Catatan & Syarat Pengiriman:' : 'Notes & Delivery Terms:'}
              </span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                {order.notes || (isIndonesian ? 'Barang wajib disertai faktur asli dan surat jalan resmi. Mohon pastikan suhu transit bahan dingin tetap terjaga.' : 'Items must be accompanied by original invoice & waybill.')}
              </p>
            </div>

            <div className="w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold">{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>PPN (11%):</span>
                <span className="font-mono">{formatRupiah(order.taxAmount)}</span>
              </div>
              <div className="border-t-2 border-stone-900 pt-2 flex justify-between font-bold text-sm text-stone-900">
                <span>Total PO:</span>
                <span className="font-mono text-amber-900">{formatRupiah(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-200 text-center text-[11px]">
            <div>
              <p className="text-stone-400 mb-12">{isIndonesian ? 'Dibuat Oleh (Purchasing)' : 'Prepared By'}</p>
              <p className="font-bold text-stone-800 underline">{order.requestedBy}</p>
              <p className="text-stone-400 text-[10px]">Purchasing Specialist</p>
            </div>
            <div>
              <p className="text-stone-400 mb-12">{isIndonesian ? 'Disetujui Oleh (Finance/Lead)' : 'Approved By'}</p>
              <p className="font-bold text-stone-800 underline">{order.approvedBy || 'Dimas Wicaksono'}</p>
              <p className="text-stone-400 text-[10px]">Head of Procurement</p>
            </div>
            <div>
              <p className="text-stone-400 mb-12">{isIndonesian ? 'Konfirmasi Supplier / Vendor' : 'Vendor Acceptance'}</p>
              <p className="font-bold text-stone-800 underline">({order.supplierName})</p>
              <p className="text-stone-400 text-[10px]">Tanda Tangan & Cap Resmi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
