import React, { useState } from 'react';
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  CheckSquare, 
  FileCheck, 
  AlertCircle, 
  PackageCheck,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { PurchaseOrder } from '../types';

interface ReceivingViewProps {
  orders: PurchaseOrder[];
  onConfirmReceipt: (orderId: string, notes: string) => void;
  selectedOutlet: string;
  isIndonesian: boolean;
}

export const ReceivingView: React.FC<ReceivingViewProps> = ({
  orders,
  onConfirmReceipt,
  selectedOutlet,
  isIndonesian
}) => {
  const [selectedPoId, setSelectedPoId] = useState<string | null>(null);
  const [qcNotes, setQcNotes] = useState('');
  const [sealCheck, setSealCheck] = useState(true);
  const [tempCheck, setTempCheck] = useState(true);
  const [dateCheck, setDateCheck] = useState(true);

  // Incoming and delivered orders
  const receivingOrders = orders.filter(po => {
    if (selectedOutlet !== 'All Outlets' && po.outlet !== selectedOutlet) return false;
    return po.status === 'In Delivery' || po.status === 'Received';
  });

  const activePo = receivingOrders.find(po => po.id === selectedPoId) || receivingOrders.find(po => po.status === 'In Delivery') || receivingOrders[0];

  const handleReceive = (po: PurchaseOrder) => {
    const finalNote = qcNotes.trim() 
      ? qcNotes 
      : isIndonesian ? 'Diterima lengkap sesuai PO. Segel utuh & QC lolos.' : 'All items received intact. QC passed.';
    onConfirmReceipt(po.id, finalNote);
    setQcNotes('');
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
        <h1 className="text-xl font-bold text-stone-900">
          {isIndonesian ? 'Penerimaan Barang & Quality Control (QC)' : 'Goods Receipt & Quality Control'}
        </h1>
        <p className="text-stone-500 text-xs mt-0.5">
          {isIndonesian
            ? 'Inspeksi fisik kedatangan bahan baku kopi, susu, dan perlengkapan bar. Konfirmasi penerimaan otomatis memperbarui jumlah stok di outlet terkait.'
            : 'Inspect incoming coffee beans, dairy, and bar supplies. Confirming receipt automatically increments outlet stock.'}
        </p>
      </div>

      {receivingOrders.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500">
          <Truck className="w-10 h-10 mx-auto text-stone-300 mb-2" />
          <p className="font-medium text-sm text-stone-700">
            {isIndonesian ? 'Tidak ada kiriman PO yang sedang aktif di outlet ini.' : 'No active shipments for this outlet.'}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            {isIndonesian ? 'Buat PO baru atau setujui PO untuk memulai pengiriman supplier.' : 'Create a new PO or approve an existing order to start vendor delivery.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Selector List (1 col) */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {isIndonesian ? 'Daftar Pengiriman' : 'Incoming Shipments'}
            </h2>
            <div className="space-y-2">
              {receivingOrders.map(po => {
                const isSelected = activePo && activePo.id === po.id;
                const isInDelivery = po.status === 'In Delivery';

                return (
                  <button
                    key={po.id}
                    onClick={() => setSelectedPoId(po.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-500 shadow-xs ring-1 ring-amber-500/30'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-xs">{po.poNumber}</span>
                        {isInDelivery ? (
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.2 rounded-full border border-blue-200 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> In Delivery
                          </span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.2 rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Received
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-700 font-medium mt-1">{po.supplierName}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5">{po.outlet.replace('Kopi Klan - ', '')}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-stone-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inspection and Receiving Form (2 cols) */}
          {activePo && (
            <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-stone-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-900 text-base">{activePo.poNumber}</h3>
                    <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium">
                      {activePo.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {activePo.supplierName} • {activePo.outlet}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-stone-400">{isIndonesian ? 'Nilai Faktur' : 'Invoice Total'}</div>
                  <div className="text-sm font-bold text-amber-900">{formatRupiah(activePo.totalAmount)}</div>
                </div>
              </div>

              {/* Items to verify */}
              <div>
                <h4 className="text-xs font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-amber-600" />
                  {isIndonesian ? 'Daftar Item yang Diterima (Checklist)' : 'Delivered Items Checklist'}
                </h4>
                <div className="border border-stone-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="py-2 px-3">{isIndonesian ? 'Nama Item' : 'Item Name'}</th>
                        <th className="py-2 px-3">{isIndonesian ? 'Kategori' : 'Category'}</th>
                        <th className="py-2 px-3 text-center">{isIndonesian ? 'Jumlah PO' : 'PO Qty'}</th>
                        <th className="py-2 px-3 text-center">{isIndonesian ? 'Status Fisik' : 'Physical QC'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {activePo.items.map(item => (
                        <tr key={item.id} className="text-stone-700">
                          <td className="py-2.5 px-3 font-medium text-stone-900">{item.name}</td>
                          <td className="py-2.5 px-3 text-stone-500">{item.category}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-stone-800">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              {activePo.status === 'Received' ? 'Verified' : 'Match Expected'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QC Protocols */}
              {activePo.status === 'In Delivery' ? (
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                    <span>{isIndonesian ? 'Protokol Standar Kualitas Kopi Klan' : 'Kopi Klan QC Protocol'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-700">
                    <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={sealCheck} 
                        onChange={(e) => setSealCheck(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500" 
                      />
                      <span>{isIndonesian ? 'Segel kemasan utuh' : 'Seals intact'}</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={tempCheck} 
                        onChange={(e) => setTempCheck(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500" 
                      />
                      <span>{isIndonesian ? 'Suhu susu dingin (< 4°C)' : 'Chilled cold chain'}</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={dateCheck} 
                        onChange={(e) => setDateCheck(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500" 
                      />
                      <span>{isIndonesian ? 'Roast / Exp date valid' : 'Dates compliant'}</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {isIndonesian ? 'Catatan Penerimaan / No. Surat Jalan Driver:' : 'Receiving Notes / Delivery Waybill #:'}
                    </label>
                    <input
                      type="text"
                      placeholder={isIndonesian ? "Contoh: Surat Jalan SJ-29831 diterima oleh Barista Dimas" : "e.g. Delivery Waybill SJ-29831 received by Barista"}
                      value={qcNotes}
                      onChange={(e) => setQcNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    onClick={() => handleReceive(activePo)}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-xl shadow-xs transition active:scale-98"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isIndonesian ? 'Konfirmasi Terima Barang & Update Stok' : 'Confirm Goods Receipt & Update Stock'}</span>
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{isIndonesian ? 'Barang Sudah Diterima Lengkap' : 'Goods Successfully Received'}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    {isIndonesian ? 'Tanggal Penerimaan:' : 'Receipt Date:'} {activePo.receivedDate || activePo.expectedDelivery}
                  </p>
                  {activePo.receivedNotes && (
                    <p className="text-[11px] text-emerald-900 bg-white/70 p-2 rounded border border-emerald-200 mt-1">
                      "{activePo.receivedNotes}"
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
