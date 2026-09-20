import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR } from '../utils/format';
import { 
  X, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  Receipt
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PaymentModal = ({ isOpen, onClose, onOrderSuccess }) => {
  const { currentTableOrder, tableNumber, orderMode, updateOrderStatus } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('QRIS'); // 'QRIS' | 'CASHIER'
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);

  // Timer countdown for QRIS
  useEffect(() => {
    if (!isOpen || paymentMethod !== 'QRIS') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, paymentMethod]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const grandTotal = currentTableOrder ? currentTableOrder.grandTotal : 0;
  const orderId = currentTableOrder ? currentTableOrder.orderId : '';

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (paymentMethod === 'QRIS') {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          console.warn('Confetti error', e);
        }
      }

      onClose();
      if (onOrderSuccess) onOrderSuccess(currentTableOrder);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with order confirmation banner */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/80">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pesanan #{orderId} Terkirim ke Dapur!</span>
              </div>
              <h3 className="font-bold text-neutral-900 text-base leading-tight">
                Pilih Pembayaran
              </h3>
              <p className="text-xs text-neutral-500">
                {orderMode === 'dinein' ? `Meja ${tableNumber}` : 'Takeaway'} • Total {formatIDR(grandTotal)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition"
              title="Tutup (Pesanan tetap berjalan)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Payment Method Selector */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentMethod('QRIS')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                paymentMethod === 'QRIS'
                  ? 'border-primary bg-orange-50/60 text-primary font-bold shadow-xs'
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
              }`}
            >
              <QrCode className="w-6 h-6" />
              <span className="text-xs">QRIS Digital</span>
            </button>

            <button
              onClick={() => setPaymentMethod('CASHIER')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                paymentMethod === 'CASHIER'
                  ? 'border-primary bg-orange-50/60 text-primary font-bold shadow-xs'
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
              }`}
            >
              <Building2 className="w-6 h-6" />
              <span className="text-xs">Bayar di Kasir</span>
            </button>
          </div>

          {/* QRIS View */}
          {paymentMethod === 'QRIS' && (
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-center space-y-3">
              {/* QRIS Header Badges */}
              <div className="flex items-center justify-between px-2">
                <span className="font-extrabold text-sm tracking-tight text-neutral-800">
                  QRIS <span className="text-primary">PAY</span>
                </span>
                <div className="flex items-center space-x-1 text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formattedTime}</span>
                </div>
              </div>

              {/* Dynamic QR Code Canvas/SVG */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200/80 inline-block shadow-inner">
                <svg
                  className="w-44 h-44 mx-auto"
                  viewBox="0 0 120 120"
                  fill="currentColor"
                >
                  {/* Outer corner squares */}
                  <rect x="10" y="10" width="30" height="30" rx="4" fill="#222" />
                  <rect x="15" y="15" width="20" height="20" rx="2" fill="#fff" />
                  <rect x="20" y="20" width="10" height="10" rx="1" fill="#222" />

                  <rect x="80" y="10" width="30" height="30" rx="4" fill="#222" />
                  <rect x="85" y="15" width="20" height="20" rx="2" fill="#fff" />
                  <rect x="90" y="20" width="10" height="10" rx="1" fill="#222" />

                  <rect x="10" y="80" width="30" height="30" rx="4" fill="#222" />
                  <rect x="15" y="85" width="20" height="20" rx="2" fill="#fff" />
                  <rect x="20" y="90" width="10" height="10" rx="1" fill="#222" />

                  {/* QR dots matrix */}
                  <rect x="48" y="14" width="6" height="6" rx="1" fill="#222" />
                  <rect x="62" y="14" width="6" height="6" rx="1" fill="#222" />
                  <rect x="48" y="28" width="6" height="6" rx="1" fill="#222" />
                  <rect x="62" y="28" width="6" height="6" rx="1" fill="#222" />

                  <rect x="14" y="48" width="6" height="6" rx="1" fill="#222" />
                  <rect x="28" y="48" width="6" height="6" rx="1" fill="#222" />
                  <rect x="14" y="62" width="6" height="6" rx="1" fill="#222" />
                  <rect x="28" y="62" width="6" height="6" rx="1" fill="#222" />

                  <rect x="48" y="48" width="24" height="24" rx="4" fill="#f05a28" />
                  <circle cx="60" cy="60" r="5" fill="#fff" />

                  <rect x="80" y="48" width="8" height="8" rx="1" fill="#222" />
                  <rect x="96" y="56" width="8" height="8" rx="1" fill="#222" />
                  <rect x="80" y="72" width="8" height="8" rx="1" fill="#222" />
                  <rect x="96" y="88" width="8" height="8" rx="1" fill="#222" />
                  <rect x="48" y="80" width="8" height="8" rx="1" fill="#222" />
                  <rect x="64" y="88" width="8" height="8" rx="1" fill="#222" />
                </svg>
              </div>

              {/* Supported Wallets / Banks */}
              <div className="text-[11px] text-neutral-500 font-medium space-y-1">
                <p>Mendukung semua aplikasi e-wallet & mobile banking:</p>
                <div className="flex items-center justify-center flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 bg-neutral-200 rounded text-[10px] font-bold text-neutral-700">GoPay</span>
                  <span className="px-2 py-0.5 bg-neutral-200 rounded text-[10px] font-bold text-neutral-700">OVO</span>
                  <span className="px-2 py-0.5 bg-neutral-200 rounded text-[10px] font-bold text-neutral-700">DANA</span>
                  <span className="px-2 py-0.5 bg-neutral-200 rounded text-[10px] font-bold text-neutral-700">ShopeePay</span>
                  <span className="px-2 py-0.5 bg-neutral-200 rounded text-[10px] font-bold text-neutral-700">BCA</span>
                  <span className="px-2 py-0.5 bg-neutral-200 rounded text-[10px] font-bold text-neutral-700">Mandiri</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-1 text-[11px] text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pembayaran otomatis terverifikasi secara instan</span>
              </div>
            </div>
          )}

          {/* Cashier View */}
          {paymentMethod === 'CASHIER' && (
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-center space-y-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-neutral-900">
                Bayar di Meja Kasir
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-xs mx-auto">
                Pesanan Anda telah masuk ke antrean dapur. Anda dapat melakukan pembayaran dengan uang tunai atau kartu debit/kredit di kasir setelah selesai makan.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-neutral-200 space-y-2">
          <button
            disabled={isProcessing}
            onClick={handleConfirmPayment}
            className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 text-sm transition"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {paymentMethod === 'QRIS'
                    ? 'Saya Sudah Bayar via QRIS'
                    : 'Oke, Saya Bayar di Kasir Nanti'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
