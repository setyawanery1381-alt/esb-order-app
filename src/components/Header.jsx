import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/menuData';
import logoSvg from '../assets/restaurant-logo.svg';
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
  Cloud,
  Home,
  Camera
} from 'lucide-react';

export const Header = ({ 
  searchQuery, 
  setSearchQuery, 
  onOpenCallWaiter, 
  onOpenQRCode,
  onOpenStockAdmin,
  onOpenFirebase,
  onOpenScanner
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
        <div className="flex items-center space-x-1.5 min-w-0">
          <span className="bg-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-[10px]">
            {companyCode || RESTAURANT_INFO.companyCode} / {branchCode || RESTAURANT_INFO.branchCode}
          </span>
          <span className="text-neutral-400 font-medium truncate text-[11px] hidden sm:inline">
            • {RESTAURANT_INFO.name} ({RESTAURANT_INFO.branchName})
          </span>
        </div>

        {/* View Switchers for Demo & Staff */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setViewMode('landing')}
            className="flex items-center space-x-1 px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition"
            title="Kembali ke Dashboard Beranda Restoran"
          >
            <Home className="w-3.5 h-3.5 text-primary" />
            <span className="hidden xs:inline">Beranda</span>
          </button>

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
            title="Khusus Admin: Cetak QR Meja Vercel untuk ditempel di meja fisik"
          >
            <QrCode className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden xs:inline">Cetak QR Meja</span>
          </button>

          <button
            onClick={onOpenStockAdmin}
            className="flex items-center space-x-1 px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded transition font-medium"
            title="Kelola & Edit Menu Makanan"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden xs:inline">Edit Menu</span>
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

      {/* Main Header Brand Row */}
      <div className="max-w-3xl mx-auto px-4 pt-3 pb-2 flex items-center justify-between gap-3">
        {/* Brand & Outlet Name - Full and prominent, NEVER truncated! */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <button 
            onClick={() => setViewMode('landing')}
            className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 hover:scale-105 transition-transform shadow-xs bg-orange-50/60 p-1 border border-neutral-200"
            title="Kembali ke Beranda Restoran"
          >
            <img 
              src={logoSvg} 
              alt={RESTAURANT_INFO.name} 
              className="w-full h-full object-contain"
            />
          </button>
          <div className="min-w-0 flex-1">
            <button 
              onClick={() => setShowOutletInfo(!showOutletInfo)}
              className="flex items-center space-x-1 text-left group"
            >
              <h1 className="font-extrabold text-neutral-900 text-base sm:text-lg leading-tight group-hover:text-primary transition">
                {RESTAURANT_INFO.name}
              </h1>
              <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-primary transition flex-shrink-0" />
            </button>
            <p className="text-xs text-neutral-500 flex items-center space-x-1.5 mt-0.5">
              <span>{RESTAURANT_INFO.branchName}</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Buka</span>
            </p>
          </div>
        </div>

        {/* Quick Top Actions: Scanner & Waiter Call */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={onOpenScanner}
            className="p-2 bg-neutral-100 hover:bg-orange-50 hover:text-primary border border-neutral-200 rounded-xl text-neutral-700 transition flex items-center space-x-1"
            title="Pindai QR / Masukkan Nomor Meja"
          >
            <Camera className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold hidden sm:inline">Pindai Meja</span>
          </button>

          {orderMode === 'dinein' && (
            <button
              onClick={onOpenCallWaiter}
              className={`relative p-2 rounded-xl border transition flex items-center space-x-1 ${
                pendingCalls > 0
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
              }`}
              title="Panggil Pelayan ke Meja"
            >
              <BellRing className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">Panggil</span>
              {pendingCalls > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {pendingCalls}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mode & Table Selector Row (Dedicated full-width row so it never squishes) */}
      <div className="max-w-3xl mx-auto px-4 pb-2.5 flex items-center justify-between gap-2">
        {/* Dine In / Takeaway Toggle */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs">
          <button
            type="button"
            onClick={() => handleModeToggle('dinein')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
              orderMode === 'dinein'
                ? 'bg-white text-primary shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>🍽️ Dine In</span>
          </button>
          <button
            type="button"
            onClick={() => handleModeToggle('takeaway')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
              orderMode === 'takeaway'
                ? 'bg-white text-primary shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>🛍️ Takeaway</span>
          </button>
        </div>

        {/* Table Number Selector Button */}
        <div>
          {orderMode === 'dinein' ? (
            tableNumber ? (
              <button
                type="button"
                onClick={onOpenScanner}
                className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-xl text-xs font-extrabold text-primary flex items-center space-x-1.5 transition shadow-2xs"
                title="Nomor meja aktif. Klik untuk ganti."
              >
                <span>🪑 Meja {tableNumber}</span>
                <span className="text-[10px] text-orange-400 font-medium underline">Ganti</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenScanner}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-sm animate-pulse transition"
                title="Klik untuk memilih nomor meja Anda"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Pilih No. Meja</span>
              </button>
            )
          ) : (
            <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200">
              🛍️ Pesan Bawa Pulang
            </span>
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
