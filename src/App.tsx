import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { OrdersView } from './components/OrdersView';
import { InventoryView } from './components/InventoryView';
import { SuppliersView } from './components/SuppliersView';
import { ReceivingView } from './components/ReceivingView';
import { NewOrderModal } from './components/NewOrderModal';
import { OrderSlipModal } from './components/OrderSlipModal';
import { 
  INITIAL_INVENTORY, 
  INITIAL_PURCHASE_ORDERS, 
  INITIAL_SUPPLIERS, 
  OUTLETS 
} from './data/mockData';
import { 
  InventoryItem, 
  OrderStatus, 
  PurchaseOrder, 
  Supplier 
} from './types';

export const App: React.FC = () => {
  // Navigation & filter states
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedOutlet, setSelectedOutlet] = useState<string>('All Outlets');
  const [isIndonesian, setIsIndonesian] = useState<boolean>(true);

  // App data state with localStorage persistence
  const [orders, setOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('kopi_klan_pos');
    return saved ? JSON.parse(saved) : INITIAL_PURCHASE_ORDERS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('kopi_klan_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('kopi_klan_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  // Modals state
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [preselectedItem, setPreselectedItem] = useState<InventoryItem | null>(null);
  const [viewingSlipOrder, setViewingSlipOrder] = useState<PurchaseOrder | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('kopi_klan_pos', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kopi_klan_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('kopi_klan_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  // Order status actions
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus, notes?: string) => {
    setOrders(prev => prev.map(po => {
      if (po.id !== orderId) return po;
      return {
        ...po,
        status: newStatus,
        approvedBy: newStatus === 'Approved' ? 'Dimas (Purchasing Head)' : po.approvedBy,
        approvalDate: newStatus === 'Approved' ? new Date().toISOString().split('T')[0] : po.approvalDate,
        receivedDate: newStatus === 'Received' ? new Date().toISOString().split('T')[0] : po.receivedDate,
        receivedNotes: notes || po.receivedNotes
      };
    }));

    // If marked received, automatically increment inventory
    if (newStatus === 'Received') {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setInventory(prevInv => {
          return prevInv.map(invItem => {
            const matchedOrderItem = order.items.find(i => i.name === invItem.name || i.itemId === invItem.id);
            if (matchedOrderItem) {
              return {
                ...invItem,
                currentStock: invItem.currentStock + matchedOrderItem.quantity,
                lastRestocked: new Date().toISOString().split('T')[0]
              };
            }
            return invItem;
          });
        });
      }
    }
  };

  const handleCreateOrder = (newPO: PurchaseOrder) => {
    setOrders(prev => [newPO, ...prev]);
    setCurrentTab('orders');
  };

  const handleOpenNewOrderWithItem = (item?: InventoryItem) => {
    setPreselectedItem(item || null);
    setIsNewOrderOpen(true);
  };

  const handleUpdateStock = (itemId: string, newStock: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          currentStock: Math.max(0, newStock),
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return item;
    }));
  };

  const handleAddNewInventoryItem = (item: InventoryItem) => {
    setInventory(prev => [item, ...prev]);
  };

  const handleAddSupplier = (supplier: Supplier) => {
    setSuppliers(prev => [supplier, ...prev]);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedOutlet={selectedOutlet}
        setSelectedOutlet={setSelectedOutlet}
        onOpenNewOrder={() => handleOpenNewOrderWithItem()}
        isIndonesian={isIndonesian}
        setIsIndonesian={setIsIndonesian}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'dashboard' && (
          <DashboardView
            orders={orders}
            inventory={inventory}
            selectedOutlet={selectedOutlet}
            onNavigateTab={setCurrentTab}
            onViewOrderSlip={setViewingSlipOrder}
            onOpenNewOrderWithItem={handleOpenNewOrderWithItem}
            isIndonesian={isIndonesian}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersView
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onViewSlip={setViewingSlipOrder}
            onOpenNewOrder={() => handleOpenNewOrderWithItem()}
            selectedOutlet={selectedOutlet}
            isIndonesian={isIndonesian}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryView
            inventory={inventory}
            onUpdateStock={handleUpdateStock}
            onAddNewItem={handleAddNewInventoryItem}
            onReorderItem={handleOpenNewOrderWithItem}
            selectedOutlet={selectedOutlet}
            isIndonesian={isIndonesian}
          />
        )}

        {currentTab === 'receiving' && (
          <ReceivingView
            orders={orders}
            onConfirmReceipt={(id, notes) => handleUpdateOrderStatus(id, 'Received', notes)}
            selectedOutlet={selectedOutlet}
            isIndonesian={isIndonesian}
          />
        )}

        {currentTab === 'suppliers' && (
          <SuppliersView
            suppliers={suppliers}
            onAddSupplier={handleAddSupplier}
            isIndonesian={isIndonesian}
          />
        )}
      </main>

      {/* Modals */}
      <NewOrderModal
        isOpen={isNewOrderOpen}
        onClose={() => {
          setIsNewOrderOpen(false);
          setPreselectedItem(null);
        }}
        onSubmit={handleCreateOrder}
        suppliers={suppliers}
        inventory={inventory}
        preselectedItem={preselectedItem}
        defaultOutlet={selectedOutlet}
        isIndonesian={isIndonesian}
      />

      <OrderSlipModal
        order={viewingSlipOrder}
        onClose={() => setViewingSlipOrder(null)}
        isIndonesian={isIndonesian}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} <strong>Kopi Klan</strong> • Sistem Logistik & Pengadaan Bahan Baku Terpadu
          </div>
          <div className="text-[11px] text-stone-400">
            Outlet: Senopati • Kemang • BSD Grand Boulevard • Roastery Pusat
          </div>
        </div>
      </footer>
    </div>
  );
};
