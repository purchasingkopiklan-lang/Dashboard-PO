import React from 'react';
import { 
  Coffee, 
  LayoutDashboard, 
  FileText, 
  Package, 
  Users, 
  Truck, 
  PlusCircle, 
  Store
} from 'lucide-react';
import { OUTLETS } from '../data/mockData';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedOutlet: string;
  setSelectedOutlet: (outlet: string) => void;
  onOpenNewOrder: () => void;
  isIndonesian: boolean;
  setIsIndonesian: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedOutlet,
  setSelectedOutlet,
  onOpenNewOrder,
  isIndonesian,
  setIsIndonesian
}) => {
  const navItems = [
    { 
      id: 'dashboard', 
      label: isIndonesian ? 'Ringkasan' : 'Dashboard', 
      icon: LayoutDashboard 
    },
    { 
      id: 'orders', 
      label: isIndonesian ? 'Pesanan Pembelian (PO)' : 'Purchase Orders', 
      icon: FileText 
    },
    { 
      id: 'inventory', 
      label: isIndonesian ? 'Stok & Logistik' : 'Inventory & Stock', 
      icon: Package 
    },
    { 
      id: 'receiving', 
      label: isIndonesian ? 'Penerimaan Barang' : 'Goods Receipt', 
      icon: Truck 
    },
    { 
      id: 'suppliers', 
      label: isIndonesian ? 'Vendor & Supplier' : 'Suppliers', 
      icon: Users 
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 text-stone-100 shadow-lg">
      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white shadow-md shadow-amber-900/30">
              <Coffee className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-amber-100">KOPI KLAN</span>
                <span className="bg-amber-900/70 text-amber-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-700/50">
                  Purchasing
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium">Sistem Pengadaan & Logistik Terpadu</p>
            </div>
          </div>

          {/* Center: Outlet Selector */}
          <div className="hidden md:flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-lg border border-stone-700">
            <Store className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-stone-400">{isIndonesian ? 'Lokasi Outlet:' : 'Outlet Filter:'}</span>
            <select
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value)}
              className="bg-transparent text-xs font-medium text-amber-200 focus:outline-none cursor-pointer"
            >
              {OUTLETS.map(outlet => (
                <option key={outlet} value={outlet} className="bg-stone-900 text-stone-100">
                  {outlet}
                </option>
              ))}
            </select>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={() => setIsIndonesian(prev => !prev)}
              className="text-xs px-2.5 py-1 rounded bg-stone-800 border border-stone-700 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Ganti Bahasa / Toggle Language"
            >
              {isIndonesian ? '🇮🇩 ID' : '🇬🇧 EN'}
            </button>

            {/* Quick Action Button */}
            <button
              onClick={onOpenNewOrder}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-sm transition-colors active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isIndonesian ? '+ Buat PO Baru' : '+ Create PO'}</span>
            </button>

            {/* User Profile */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-stone-800">
              <div className="w-8 h-8 rounded-full bg-stone-700 text-amber-300 flex items-center justify-center font-bold text-xs border border-stone-600">
                FM
              </div>
              <div className="text-left text-xs">
                <div className="text-stone-200 font-semibold leading-tight">Fahmi M.</div>
                <div className="text-stone-400 text-[10px]">Purchasing Lead</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-stone-950/60 border-t border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-600/40 shadow-sm'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
