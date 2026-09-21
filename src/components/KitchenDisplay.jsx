import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatTime } from '../utils/format';
import { 
  ChefHat, 
  BellRing, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Utensils, 
  ArrowLeft,
  Filter,
  Volume2
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const KitchenDisplay = () => {
  const { 
    kitchenOrders, 
    updateOrderStatus, 
    waiterCalls, 
    resolveWaiterCall, 
    setViewMode 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeCalls = waiterCalls.filter((c) => !c.resolved);

  const filteredOrders = kitchenOrders.filter((ord) => {
    if (filterStatus === 'ALL') return ord.orderStatus !== 'COMPLETED';
    return ord.orderStatus === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'RECEIVED':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Diterima (Antrean)</span>;
      case 'COOKING':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 animate-pulse">Sedang Dimasak 🍳</span>;
      case 'READY':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Siap Disajikan 🍽️</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-600">Selesai</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans">
      {/* KDS Top Bar */}
      <header className="bg-neutral-950 border-b border-neutral-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode('customer')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Menu Pelanggan</span>
          </button>
          <div className="h-5 w-px bg-neutral-800" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm leading-tight text-white flex items-center space-x-1.5">
                <span>KDS & Kasir Display</span>
                <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
                  {RESTAURANT_INFO.branchName}
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">
                Sistem Manajemen Pesanan Real-Time
              </p>
            </div>
          </div>
        </div>

        {/* Live Clock & Pending Badges */}
        <div className="flex items-center space-x-3">
          {activeCalls.length > 0 && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold animate-pulse">
              <BellRing className="w-4 h-4" />
              <span>{activeCalls.length} Panggilan Meja</span>
            </div>
          )}

          <div className="flex items-center space-x-1.5 bg-neutral-800 px-3 py-1.5 rounded-xl text-xs text-neutral-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>{currentTime.toLocaleTimeString('id-ID')} WIB</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full space-y-6">
        {/* Active Waiter Calls Banner */}
        {activeCalls.length > 0 && (
          <div className="bg-amber-950/40 border border-amber-600/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
              <BellRing className="w-4 h-4" />
              <span>Panggilan Pelayan Aktif</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeCalls.map((call) => (
                <div
                  key={call.id}
                  className="bg-neutral-800/90 border border-amber-500/30 p-3 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <span className="font-extrabold text-amber-400 text-sm block">
                      Meja {call.tableNumber}
                    </span>
                    <p className="text-xs text-neutral-300 mt-0.5">{call.reason}</p>
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      {formatTime(call.createdAt)} WIB
                    </span>
                  </div>
                  <button
                    onClick={() => resolveWaiterCall(call.id)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold rounded-lg text-xs transition flex-shrink-0"
                  >
                    Selesai Ditangani
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-1.5 bg-neutral-800 p-1 rounded-xl text-xs">
            {[
              { id: 'ALL', label: 'Semua Aktif' },
              { id: 'RECEIVED', label: 'Antrean Diterima' },
              { id: 'COOKING', label: 'Sedang Dimasak' },
              { id: 'READY', label: 'Siap Disajikan' },
              { id: 'COMPLETED', label: 'Riwayat Selesai' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  filterStatus === tab.id
                    ? 'bg-primary text-white font-bold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-neutral-400 font-medium">
            Menampilkan <b>{filteredOrders.length}</b> pesanan
          </span>
        </div>

        {/* Order Tickets Grid */}
        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 space-y-2">
            <Utensils className="w-12 h-12 mx-auto text-neutral-700 stroke-[1.5]" />
            <p className="text-sm">Tidak ada pesanan aktif pada status ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="bg-neutral-800/90 rounded-2xl border border-neutral-700/80 p-4 flex flex-col justify-between shadow-lg relative overflow-hidden"
              >
                {/* Card Top Row */}
                <div>
                  <div className="flex items-start justify-between pb-3 border-b border-neutral-700">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-white px-2.5 py-0.5 bg-primary rounded-lg">
                          Meja {order.tableNumber}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          #{order.orderId}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 mt-1.5">
                        Pemesan: <b>{order.customerName}</b> ({order.orderMode === 'dinein' ? 'Dine In' : 'Takeaway'})
                      </p>
                      <div className="mt-1.5 flex items-center">
                        {order.paymentMethod === 'QRIS' ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-950/70 border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>✓ Lunas QRIS (SANGCREATOR DIGITAL)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-amber-950/70 border border-amber-500/40 text-[10px] font-bold text-amber-300">
                            <span>⏳ Bayar di Kasir (Belum Lunas)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      {getStatusBadge(order.orderStatus)}
                      <span className="text-[10px] text-neutral-400 block mt-1">
                        {formatTime(order.createdAt)} WIB
                      </span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="py-3 space-y-2.5">
                    {order.items.map((item, idx) => {
                      const modStrings = [];
                      Object.values(item.selectedModifiers || {}).forEach((val) => {
                        if (Array.isArray(val)) {
                          val.forEach((opt) => modStrings.push(opt.name));
                        } else if (val && val.name) {
                          modStrings.push(val.name);
                        }
                      });

                      return (
                        <div key={idx} className="text-xs space-y-0.5">
                          <div className="flex justify-between items-baseline font-bold text-neutral-200">
                            <span>
                              {item.quantity}x {item.item.name}
                            </span>
                            <span className="text-neutral-400 font-normal">
                              {formatIDR(item.totalPrice)}
                            </span>
                          </div>
                          {modStrings.length > 0 && (
                            <p className="text-[11px] text-neutral-400 pl-4">
                              {modStrings.join(', ')}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-[11px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded mt-0.5 border border-amber-500/20 inline-block font-sans">
                              ⚠️ {item.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Card Bottom / Action Buttons */}
                <div className="pt-3 border-t border-neutral-700 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-neutral-400 block text-[10px]">Total</span>
                    <span className="font-extrabold text-white">
                      {formatIDR(order.grandTotal)}
                    </span>
                    <span className={`block text-[10px] font-semibold ${order.paymentMethod === 'QRIS' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {order.paymentMethod === 'QRIS' ? '✓ Lunas QRIS' : '⏳ Belum Bayar'}
                    </span>
                  </div>

                  {/* Stepper Buttons for Staff */}
                  <div className="flex items-center space-x-1.5">
                    {order.orderStatus === 'RECEIVED' && (
                      <button
                        onClick={() => updateOrderStatus(order.orderId, 'COOKING')}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Mulai Masak</span>
                      </button>
                    )}

                    {order.orderStatus === 'COOKING' && (
                      <button
                        onClick={() => updateOrderStatus(order.orderId, 'READY')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
                      >
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Siap Disajikan</span>
                      </button>
                    )}

                    {order.orderStatus === 'READY' && (
                      <button
                        onClick={() => updateOrderStatus(order.orderId, 'COMPLETED')}
                        className="px-3 py-1.5 bg-neutral-600 hover:bg-neutral-500 text-white font-bold text-xs rounded-xl transition flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Selesaikan</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
