import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/menuData';
import { 
  UtensilsCrossed, 
  BellRing, 
  Search, 
  X, 
  QrCode, 
  ChefHat, 
  SlidersHorizontal,
  MapPin,
  Clock,
  ChevronDown,
  Cloud
} from 'lucide-react';

export const Header = ({ 
  searchQuery, 
  setSearchQuery, 
  onOpenCallWaiter, 
  onOpenQRCode,
  onOpenStockAdmin,
  onOpenFirebase
}) => {
  const { 
    companyCode,
    branchCode,
    orderMode, 
    setOrderMode, 
    tableNumber, 
    setTableNumber,
    viewMode,
    setViewMode,
    waiterCalls,
    currentTableOrder,
    isFirebaseOnline
  } = useApp();

  const [isEditingTable, setIsEditingTable] = useState(false);
  const [tempTable, setTempTable] = useState(tableNumber);
  const [showOutletInfo, setShowOutletInfo] = useState(false);

  const handleTableSave = (e) => {
    e.preventDefault();
    if (tempTable.trim()) {
      setTableNumber(tempTable.trim());
      // Update URL query param without full reload
      const url = new URL(window.location);
      url.searchParams.set('tableNumber', tempTable.trim());
      window.history.replaceState({}, '', url);
    }
    setIsEditingTable(false);
  };

  const handleModeToggle = (mode) => {
    setOrderMode(mode);
    const url = new URL(window.location);
    url.searchParams.set('mode', mode);
    window.history.replaceState({}, '', url);
  };

  // Count pending waiter calls for this table
  const pendingCalls = waiterCalls.filter(c => c.tableNumber === tableNumber && !c.resolved).length;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-neutral-200">
      {/* Top Banner: Company & Branch info + View Mode Switcher */}
      <div className="bg-neutral-900 text-white px-4 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="bg-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
            {companyCode || RESTAURANT_INFO.companyCode} / {branchCode || RESTAURANT_INFO.branchCode}
          </span>
          <span className="text-neutral-300 hidden sm:inline">•</span>
          <span className="text-neutral-300 font-medium truncate max-w-[180px] sm:max-w-none">
            {RESTAURANT_INFO.name} ({RESTAURANT_INFO.branchName})
          </span>
        </div>

        {/* View Switchers for Demo & Staff */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'customer' ? 'kitchen' : 'customer')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded transition ${
              viewMode === 'kitchen' 
                ? 'bg-amber-500 text-neutral-900 font-bold' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
            title="Buka Layar Dapur (KDS / POS)"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{viewMode === 'kitchen' ? 'Mode Dapur' : 'Layar Dapur'}</span>
          </button>

          <button
            onClick={onOpenQRCode}
            className="flex items-center space-x-1 px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition"
            title="Cetak & Tampilkan QR Meja"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">QR Meja</span>
          </button>

          <button
            onClick={onOpenStockAdmin}
            className="flex items-center space-x-1 px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition"
            title="Kelola Ketersediaan Stok Menu"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Stok</span>
          </button>

          <button
            onClick={onOpenFirebase}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded transition ${
              isFirebaseOnline 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
            }`}
            title="Pengaturan Firebase Firestore (Cloud Sync)"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{isFirebaseOnline ? 'Cloud ON' : 'Firebase'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand & Outlet Dropdown */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <button 
              onClick={() => setShowOutletInfo(!showOutletInfo)}
              className="flex items-center space-x-1 text-left group"
            >
              <h1 className="font-bold text-neutral-900 text-base leading-tight truncate group-hover:text-primary transition">
                {RESTAURANT_INFO.name}
              </h1>
              <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-primary transition flex-shrink-0" />
            </button>
            <p className="text-xs text-neutral-500 truncate">
              {RESTAURANT_INFO.branchName}
            </p>
          </div>
        </div>

        {/* Right Action Badges: Dine-in / Table Number & Call Waiter */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Mode & Table Selector */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
            <button
              onClick={() => handleModeToggle('dinein')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                orderMode === 'dinein'
                  ? 'bg-white text-primary shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Dine In
            </button>
            <button
              onClick={() => handleModeToggle('takeaway')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                orderMode === 'takeaway'
                  ? 'bg-white text-primary shadow-sm font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Takeaway
            </button>
          </div>

          {/* Table Number Badge */}
          {orderMode === 'dinein' && (
            <div>
              {isEditingTable ? (
                <form onSubmit={handleTableSave} className="flex items-center">
                  <input
                    type="text"
                    value={tempTable}
                    onChange={(e) => setTempTable(e.target.value)}
                    className="w-14 px-2 py-1 text-xs font-bold border border-primary rounded-lg focus:outline-none focus:ring-1 focus:ring-primary text-center"
                    autoFocus
                    placeholder="No"
                    onBlur={handleTableSave}
                  />
                </form>
              ) : (
                <button
                  onClick={() => {
                    setTempTable(tableNumber);
                    setIsEditingTable(true);
                  }}
                  className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-xs font-bold text-primary flex items-center space-x-1 transition"
                  title="Klik untuk ubah nomor meja"
                >
                  <span>Meja {tableNumber}</span>
                </button>
              )}
            </div>
          )}

          {/* Call Waiter Button */}
          {orderMode === 'dinein' && (
            <button
              onClick={onOpenCallWaiter}
              className={`relative p-2 rounded-xl border transition flex items-center justify-center ${
                pendingCalls > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-600 animate-pulse'
                  : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
              }`}
              title="Panggil Pelayan / Bantuan"
            >
              <BellRing className="w-4 h-4" />
              {pendingCalls > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {pendingCalls}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Outlet Details Dropdown Modal/Banner */}
      {showOutletInfo && (
        <div className="bg-orange-50/70 border-t border-b border-orange-100 px-4 py-2.5 text-xs text-neutral-700">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span>{RESTAURANT_INFO.address}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-neutral-500">
              <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
              <span>Buka: {RESTAURANT_INFO.openHours}</span>
            </div>
          </div>
        </div>
      )}

      {/* Live Order Notice Banner if active order exists */}
      {currentTableOrder && (
        <div className="bg-emerald-600 text-white text-xs px-4 py-1.5">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
              </span>
              <span>
                Pesanan <b>#{currentTableOrder.orderId}</b>: {
                  currentTableOrder.orderStatus === 'RECEIVED' ? 'Pesanan Diterima di Kasir' :
                  currentTableOrder.orderStatus === 'COOKING' ? 'Sedang Dimasak di Dapur 🍳' :
                  currentTableOrder.orderStatus === 'READY' ? 'Siap Disajikan ke Meja 🍽️' : 'Selesai'
                }
              </span>
            </div>
            <span className="font-semibold underline cursor-pointer">Lihat Detail</span>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari makanan favorit, minuman, cemilan..."
            className="w-full pl-9 pr-9 py-2 bg-neutral-100 hover:bg-neutral-150 focus:bg-white text-neutral-900 placeholder-neutral-400 text-xs sm:text-sm rounded-xl border border-neutral-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
