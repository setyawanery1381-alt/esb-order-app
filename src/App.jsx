import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PromoCarousel } from './components/PromoCarousel';
import { CategoryNav } from './components/CategoryNav';
import { MenuCard } from './components/MenuCard';
import { ItemModal } from './components/ItemModal';
import { FloatingCartBar } from './components/FloatingCartBar';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { CallWaiterModal } from './components/CallWaiterModal';
import { KitchenDisplay } from './components/KitchenDisplay';
import { QRCodeModal } from './components/QRCodeModal';
import { AdminMenuModal } from './components/AdminMenuModal';
import { FirebaseModal } from './components/FirebaseModal';
import { MENU_ITEMS, CATEGORIES } from './data/menuData';
import { Sparkles, Utensils } from 'lucide-react';

export const App = () => {
  const { viewMode, currentTableOrder, totalCartCount, submitOrder } = useApp();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals state
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const [isCallWaiterOpen, setIsCallWaiterOpen] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isStockAdminOpen, setIsStockAdminOpen] = useState(false);
  const [isFirebaseOpen, setIsFirebaseOpen] = useState(false);

  // If in Kitchen / POS view mode, render KitchenDisplay
  if (viewMode === 'kitchen') {
    return <KitchenDisplay />;
  }

  // Filter menu items based on category and search query
  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'promo') return item.isPromo;
    if (activeCategory === 'rekomendasi') return item.isBestSeller;
    return item.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center text-neutral-800 selection:bg-orange-200">
      {/* Mobile-First Responsive Container */}
      <div className="w-full max-w-2xl bg-white min-h-screen shadow-xl flex flex-col relative border-x border-neutral-200/60 pb-24">
        
        {/* Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCallWaiter={() => setIsCallWaiterOpen(true)}
          onOpenQRCode={() => setIsQRCodeOpen(true)}
          onOpenStockAdmin={() => setIsStockAdminOpen(true)}
          onOpenFirebase={() => setIsFirebaseOpen(true)}
        />

        {/* Promo Carousel (only when not searching) */}
        {!searchQuery && <PromoCarousel />}

        {/* Sticky Category Tabs (only when not searching) */}
        {!searchQuery && (
          <CategoryNav
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />
        )}

        {/* Menu Items Section */}
        <main className="flex-1 px-4 py-4 space-y-4">
          {/* Section Title */}
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base sm:text-lg text-neutral-900 flex items-center space-x-1.5">
              <span>
                {searchQuery
                  ? `Hasil Pencarian "${searchQuery}"`
                  : CATEGORIES.find((c) => c.id === activeCategory)?.name || 'Daftar Menu'}
              </span>
            </h2>
            <span className="text-xs text-neutral-500 font-medium">
              {filteredItems.length} menu tersedia
            </span>
          </div>

          {/* Menu Grid / List */}
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-neutral-400 space-y-2">
              <Utensils className="w-10 h-10 mx-auto text-neutral-300 stroke-[1.5]" />
              <p className="text-xs sm:text-sm font-medium">
                Tidak ada menu yang sesuai dengan pencarian.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onOpenModal={setSelectedMenuItem}
                />
              ))}
            </div>
          )}
        </main>

        {/* Floating Cart Bar */}
        <FloatingCartBar onOpenCart={() => setIsCartOpen(true)} />

        {/* Active Order Pill (if order exists & cart is empty) */}
        {currentTableOrder && totalCartCount === 0 && (
          <div className="fixed bottom-4 inset-x-0 z-30 px-4 pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
              <button
                onClick={() => setIsOrderStatusOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white p-3.5 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-2 text-left">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping" />
                  <div>
                    <span className="text-xs font-bold block">
                      Pesanan #{currentTableOrder.orderId} Sedang Diproses
                    </span>
                    <span className="text-[11px] text-emerald-100">
                      Klik untuk melihat status & struk digital
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-xl">
                  Status
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Item Customization Modal */}
        <ItemModal
          item={selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
        />

        {/* Cart Review Drawer */}
        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onProceedToPayment={() => {
            submitOrder('QRIS');
            setIsCartOpen(false);
            setIsPaymentOpen(true);
          }}
        />

        {/* Digital Payment Modal */}
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          onOrderSuccess={(order) => {
            setIsOrderStatusOpen(true);
          }}
        />

        {/* Order Status & Receipt Modal */}
        <OrderStatusModal
          order={currentTableOrder}
          isOpen={isOrderStatusOpen}
          onClose={() => setIsOrderStatusOpen(false)}
          onOrderMore={() => {
            setIsOrderStatusOpen(false);
          }}
        />

        {/* Call Waiter Modal */}
        <CallWaiterModal
          isOpen={isCallWaiterOpen}
          onClose={() => setIsCallWaiterOpen(false)}
        />

        {/* Table QR Code Generator Modal */}
        <QRCodeModal
          isOpen={isQRCodeOpen}
          onClose={() => setIsQRCodeOpen(false)}
        />

        {/* Admin Menu Stock Modal */}
        <AdminMenuModal
          isOpen={isStockAdminOpen}
          onClose={() => setIsStockAdminOpen(false)}
        />

        {/* Firebase Firestore Cloud Modal */}
        <FirebaseModal
          isOpen={isFirebaseOpen}
          onClose={() => setIsFirebaseOpen(false)}
        />
      </div>
    </div>
  );
};
