import React from 'react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO, MENU_ITEMS } from '../data/menuData';
import { formatIDR } from '../utils/format';
import { RestaurantLogo } from './RestaurantLogo';
import logoSvg from '../assets/restaurant-logo.svg';
import { 
  QrCode, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  Phone, 
  Star, 
  CheckCircle2, 
  Wifi, 
  Car, 
  Sparkles, 
  ArrowRight,
  ChefHat,
  ShieldCheck,
  Utensils
} from 'lucide-react';

export const LandingDashboard = ({ onOpenScanner, onOpenQRCode, onOpenFirebase, onOpenTableInput }) => {
  const { setViewMode, setOrderMode, setTableNumber, isFirebaseOnline } = useApp();

  const signatureItems = MENU_ITEMS.filter((item) => item.isBestSeller).slice(0, 4);

  const handleTakeaway = () => {
    setOrderMode('takeaway');
    setViewMode('customer');
    const url = new URL(window.location);
    url.searchParams.set('mode', 'takeaway');
    url.searchParams.delete('tableNumber');
    window.history.replaceState({}, '', url);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans selection:bg-orange-500/30">
      {/* Top Bar */}
      <header className="bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-40 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-primary px-2 py-0.5 rounded-md font-extrabold uppercase text-[10px] tracking-wider text-white">
              {RESTAURANT_INFO.companyCode} / {RESTAURANT_INFO.branchCode}
            </span>
            <span className="text-xs text-neutral-400 hidden sm:inline">•</span>
            <span className="text-xs text-neutral-300 font-semibold truncate hidden sm:inline">
              {RESTAURANT_INFO.branchName}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setViewMode('kitchen')}
              className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl font-bold transition"
            >
              <ChefHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Layar Dapur</span>
            </button>

            <button
              onClick={onOpenQRCode}
              className="flex items-center space-x-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-medium transition text-xs"
              title="Khusus Admin Resto: Cetak stiker QR meja untuk ditempel di meja fisik"
            >
              <QrCode className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Cetak QR Meja (Admin)</span>
              <span className="sm:hidden">QR Admin</span>
            </button>

            <button
              onClick={onOpenFirebase}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-xl font-bold transition ${
                isFirebaseOnline
                  ? 'bg-emerald-700 text-white'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
            >
              <span>{isFirebaseOnline ? 'Cloud ON' : 'Firebase'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-14 px-4 sm:px-6">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-2xl mx-auto text-center space-y-6">
          {/* Logo Showcase */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 relative p-2 bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-3xl border border-neutral-700/80 shadow-2xl shadow-primary/20">
              <img
                src={logoSvg}
                alt={RESTAURANT_INFO.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistem E-Menu Digital Terintegrasi ESB Order</span>
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              {RESTAURANT_INFO.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
              Kelezatan kuliner tradisional autentik Indonesia. Pesan menu makanan & minuman favorit langsung dari meja Anda tanpa antre.
            </p>
          </div>

          {/* Core Call-to-Action Buttons */}
          <div className="pt-2 space-y-2.5 max-w-md mx-auto">
            {/* Main Primary Button: Scan QR Barcode */}
            <button
              onClick={() => onOpenScanner ? onOpenScanner('camera') : null}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 active:scale-[0.99] text-white font-black rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center space-x-3 text-base sm:text-lg transition-all group"
            >
              <div className="p-1.5 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <span>Pindai Barcode QR Meja</span>
              <ArrowRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Secondary Option: Masukkan No. Meja or Takeaway */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onOpenTableInput ? onOpenTableInput() : onOpenScanner('picker')}
                className="py-3 px-3.5 bg-neutral-800/90 hover:bg-neutral-700/90 border border-neutral-700/80 active:scale-[0.99] rounded-xl text-xs sm:text-sm font-bold text-neutral-200 flex items-center justify-center space-x-2 transition hover:border-primary/50"
              >
                <Utensils className="w-4 h-4 text-primary" />
                <span>Masukkan No. Meja</span>
              </button>

              <button
                onClick={handleTakeaway}
                className="py-3 px-3.5 bg-neutral-800/90 hover:bg-neutral-700/90 border border-neutral-700/80 active:scale-[0.99] rounded-xl text-xs sm:text-sm font-bold text-neutral-200 flex items-center justify-center space-x-2 transition hover:border-amber-400/50"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Pesan Takeaway</span>
              </button>
            </div>
          </div>

          {/* Badges / Resto Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-300">
            <div className="flex items-center space-x-1.5 bg-neutral-800/60 px-3 py-1.5 rounded-full border border-neutral-700/50">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="font-bold">4.9 / 5.0</span>
              <span className="text-neutral-500">(1.250+ Ulasan)</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-neutral-800/60 px-3 py-1.5 rounded-full border border-neutral-700/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold">100% Halal MUI</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-neutral-800/60 px-3 py-1.5 rounded-full border border-neutral-700/50">
              <Wifi className="w-3.5 h-3.5 text-sky-400" />
              <span>Free Wi-Fi</span>
            </div>

            <div className="flex items-center space-x-1.5 bg-neutral-800/60 px-3 py-1.5 rounded-full border border-neutral-700/50">
              <Car className="w-3.5 h-3.5 text-amber-400" />
              <span>Parkir Luas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Easy Steps Section */}
      <section className="py-8 px-4 bg-neutral-950/60 border-y border-neutral-800">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h2 className="font-extrabold text-lg sm:text-xl text-white">
              Cara Pesan Mudah di Meja
            </h2>
            <p className="text-xs text-neutral-400">
              3 langkah praktis menikmati hidangan tanpa menunggu pelayan mencatat
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800/80 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 font-black text-sm flex items-center justify-center mx-auto border border-orange-500/30">
                1
              </div>
              <h3 className="font-bold text-sm text-neutral-200">Scan Barcode QR</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Pindai stiker QR yang tertera di sudut meja Anda dengan kamera HP.
              </p>
            </div>

            <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800/80 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 font-black text-sm flex items-center justify-center mx-auto border border-orange-500/30">
                2
              </div>
              <h3 className="font-bold text-sm text-neutral-200">Pilih Menu Favorit</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Atur level pedas, pilihan topping, dan catatan khusus untuk koki dapur.
              </p>
            </div>

            <div className="bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800/80 space-y-2 text-center">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 font-black text-sm flex items-center justify-center mx-auto border border-orange-500/30">
                3
              </div>
              <h3 className="font-bold text-sm text-neutral-200">Bayar & Santap</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Bayar instan dengan QRIS atau di kasir, makanan akan diantar ke meja Anda!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Dishes Preview */}
      <section className="py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black text-lg sm:text-xl text-white">
                Menu Rekomendasi Koki
              </h2>
              <p className="text-xs text-neutral-400">
                Hidangan best-seller terfavorit para pelanggan
              </p>
            </div>

            <button
              onClick={onOpenScanner}
              className="text-xs font-bold text-primary hover:text-orange-400 flex items-center space-x-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {signatureItems.map((item) => (
              <div
                key={item.id}
                onClick={onOpenScanner}
                className="bg-neutral-800/80 hover:bg-neutral-800 rounded-2xl overflow-hidden border border-neutral-700/60 shadow-lg cursor-pointer group transition-all"
              >
                <div className="relative h-32 sm:h-36 overflow-hidden bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-black">
                    ★ Best Seller
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <h3 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-primary transition">
                    {item.name}
                  </h3>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-extrabold text-primary text-xs sm:text-sm">
                      {formatIDR(item.price)}
                    </span>
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-md font-bold">
                      Pesan
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Outlet Location & Info */}
      <section className="py-8 px-4 bg-neutral-950 border-t border-neutral-800 text-xs text-neutral-400">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{RESTAURANT_INFO.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{RESTAURANT_INFO.openHours}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-neutral-500">
              © 2026 {RESTAURANT_INFO.name}. Powered by ESB Order QR System.
            </p>
            <button
              onClick={() => handleQuickDineIn('38')}
              className="text-primary hover:underline font-bold text-[11px]"
            >
              Langsung ke Meja 38 ➔
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
