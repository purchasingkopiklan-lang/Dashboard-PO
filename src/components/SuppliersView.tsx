import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CreditCard, 
  Star, 
  CheckCircle2 
} from 'lucide-react';
import { Supplier, ProductCategory } from '../types';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Supplier) => void;
  isIndonesian: boolean;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onAddSupplier,
  isIndonesian
}) => {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [address, setAddress] = useState('');
  const [leadTimeDays, setLeadTimeDays] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Coffee Beans');

  const filteredSuppliers = suppliers.filter(s => {
    if (search.trim() === '') return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.contactPerson.toLowerCase().includes(q) ||
      s.category.some(c => c.toLowerCase().includes(q))
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newSupplier: Supplier = {
      id: `sup-${Date.now()}`,
      name,
      contactPerson,
      email,
      phone,
      category: [selectedCategory],
      paymentTerms,
      address,
      rating: 4.8,
      leadTimeDays: Number(leadTimeDays),
      status: 'Active'
    };

    onAddSupplier(newSupplier);
    setShowModal(false);
    setName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setAddress('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-stone-900">
              {isIndonesian ? 'Direktori Vendor & Supplier' : 'Supplier & Vendor Directory'}
            </h1>
            <p className="text-stone-500 text-xs mt-0.5">
              {isIndonesian
                ? 'Daftar rekanan produsen kopi, distributor susu pasteurisasi, importir sirup, dan pabrik kemasan.'
                : 'List of roasters, dairy distributors, syrup importers, and packaging manufacturers.'}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="self-start md:self-auto flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition shadow-xs active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isIndonesian ? '+ Tambah Supplier' : '+ Add Supplier'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder={isIndonesian ? "Cari nama vendor, narahubung (PIC), atau kategori bahan..." : "Search supplier name, PIC, or categories..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map(supplier => (
          <div 
            key={supplier.id}
            className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-amber-400 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{supplier.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="flex items-center text-amber-500 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="ml-1 text-stone-700">{supplier.rating}</span>
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {supplier.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {supplier.category.map(cat => (
                  <span key={cat} className="text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                    {cat}
                  </span>
                ))}
              </div>

              {/* Details */}
              <div className="space-y-2 mt-4 text-xs text-stone-600 border-t border-stone-100 pt-3">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>PIC: <strong className="text-stone-800">{supplier.contactPerson}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="font-mono">{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{isIndonesian ? 'Termin Pembayaran:' : 'Terms:'} <strong>{supplier.paymentTerms}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Lead Time: <strong>{supplier.leadTimeDays} {isIndonesian ? 'hari kerja' : 'working days'}</strong></span>
                </div>
                <div className="flex items-start gap-2 pt-1 text-stone-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{supplier.address}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
            <h2 className="text-lg font-bold text-stone-900 mb-1">
              {isIndonesian ? 'Tambah Rekanan Vendor Baru' : 'Register New Vendor'}
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              {isIndonesian
                ? 'Masukkan profil vendor baru untuk pengadaan Kopi Klan.'
                : 'Enter new vendor profile details for Kopi Klan purchasing.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isIndonesian ? 'Nama Perusahaan / Vendor' : 'Company / Vendor Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PT Kopi Segar Nusantara"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isIndonesian ? 'Nama Kontak (PIC)' : 'Contact Person'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Budi Gunawan"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">No. WhatsApp / Telepon</label>
                  <input
                    type="text"
                    required
                    placeholder="+62 812-xxxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sales@vendor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isIndonesian ? 'Kategori Produk' : 'Product Category'}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  >
                    <option value="Coffee Beans">Coffee Beans</option>
                    <option value="Dairy & Milk">Dairy & Milk</option>
                    <option value="Syrups & Flavors">Syrups & Flavors</option>
                    <option value="Packaging & Cups">Packaging & Cups</option>
                    <option value="Equipment & Barista Tools">Equipment & Barista Tools</option>
                    <option value="Cleaning & Sanitation">Cleaning & Sanitation</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    {isIndonesian ? 'Termin Pembayaran' : 'Payment Terms'}
                  </label>
                  <select
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  >
                    <option value="Net 14">Net 14 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 45">Net 45 Days</option>
                    <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                    <option value="Advance Payment">Advance Payment (DP 100%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Lead Time (Hari)</label>
                  <input
                    type="number"
                    min="1"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  {isIndonesian ? 'Alamat Kantor / Gudang' : 'Office / Warehouse Address'}
                </label>
                <textarea
                  rows={2}
                  placeholder="Jl. Raya Roasting No. 12, Jakarta"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
                >
                  {isIndonesian ? 'Batal' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg"
                >
                  {isIndonesian ? 'Daftarkan Vendor' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
