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
  Copy, 
  Check, 
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import qrisSampleImg from '../assets/qris-sangcreator.jpg';

export const PaymentModal = ({ isOpen, onClose, onOrderSuccess }) => {
  const { 
    cart, 
    grandTotal: cartGrandTotal, 
    tableNumber, 
    orderMode, 
    submitOrder, 
    currentTableOrder 
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState('QRIS'); // 'QRIS' | 'CASHIER'
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const payableAmount = cart.length > 0 ? cartGrandTotal : (currentTableOrder?.grandTotal || 0);

  const handleCopyAmount = () => {
    try {
      navigator.clipboard.writeText(String(payableAmount));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Clipboard failed', e);
    }
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      // Submit order only after payment confirmation
      let createdOrder = null;
      if (cart.length > 0) {
        createdOrder = submitOrder(paymentMethod);
      } else {
        createdOrder = currentTableOrder;
      }

      setIsProcessing(false);

      if (paymentMethod === 'QRIS') {
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        } catch (e) {
          console.warn('Confetti error', e);
        }
      }

      onClose();
      if (onOrderSuccess) onOrderSuccess(createdOrder);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/90">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Pembayaran Pesanan</span>
              </div>
              <h3 className="font-extrabold text-neutral-900 text-lg leading-tight">
                Pilih Pembayaran
              </h3>
              <p className="text-xs text-neutral-500">
                {orderMode === 'dinein' ? (tableNumber ? `Meja ${tableNumber}` : 'Dine In') : 'Takeaway'} • Total Tagihan: <b className="text-neutral-800">{formatIDR(payableAmount)}</b>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition"
              title="Kembali ke Menu"
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
              type="button"
              onClick={() => setPaymentMethod('QRIS')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                paymentMethod === 'QRIS'
                  ? 'border-primary bg-orange-50/70 text-primary font-bold shadow-xs'
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-primary">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="text-xs block font-bold">QRIS Digital</span>
                <span className="text-[10px] text-neutral-500 font-normal">Semua Bank & E-Wallet</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('CASHIER')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                paymentMethod === 'CASHIER'
                  ? 'border-primary bg-orange-50/70 text-primary font-bold shadow-xs'
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-center">
                <span className="text-xs block font-bold">Bayar di Kasir</span>
                <span className="text-[10px] text-neutral-500 font-normal">Tunai / Kartu EDC</span>
              </div>
            </button>
          </div>

          {/* QRIS View */}
          {paymentMethod === 'QRIS' && (
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-center space-y-3.5">
              {/* QRIS Header */}
              <div className="flex items-center justify-between px-1">
                <div className="text-left">
                  <span className="font-extrabold text-sm tracking-tight text-neutral-900 block">
                    QRIS <span className="text-primary">SANGCREATOR DIGITAL</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 block">
                    NMID: ID1026536961000 • A01
                  </span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-amber-700 font-bold bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>{formattedTime}</span>
                </div>
              </div>

              {/* Total Payable Box with Copy Button */}
              <div className="bg-white rounded-xl p-3 border border-neutral-200 shadow-2xs flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[11px] text-neutral-500 block">Total Pembayaran:</span>
                  <span className="text-lg font-black text-primary">
                    {formatIDR(payableAmount)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAmount}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition active:scale-95"
                  title="Salin nominal untuk m-Banking"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Salin Nominal</span>
                    </>
                  )}
                </button>
              </div>

              {/* Official QRIS Stand Image */}
              <div className="bg-white p-2.5 rounded-2xl border border-neutral-200 shadow-inner flex flex-col items-center">
                <img
                  src={qrisSampleImg}
                  alt="QRIS Stand SANGCREATOR DIGITAL"
                  className="w-full max-w-[310px] h-auto rounded-xl object-contain shadow-sm border border-neutral-100"
                />
                <span className="text-[10px] text-neutral-400 mt-2 font-mono">
                  Scan kode QRIS di atas dengan m-Banking / e-Wallet Anda
                </span>
              </div>

              {/* Supported Wallets / Banks Badges */}
              <div className="text-[11px] text-neutral-500 font-medium space-y-1">
                <p>Mendukung seluruh m-Banking & E-Wallet di Indonesia:</p>
                <div className="flex items-center justify-center flex-wrap gap-1.5 pt-0.5">
                  <span className="px-2 py-0.5 bg-neutral-200/80 rounded text-[10px] font-bold text-neutral-700">BCA</span>
                  <span className="px-2 py-0.5 bg-neutral-200/80 rounded text-[10px] font-bold text-neutral-700">Mandiri</span>
                  <span className="px-2 py-0.5 bg-neutral-200/80 rounded text-[10px] font-bold text-neutral-700">BRI</span>
                  <span className="px-2 py-0.5 bg-neutral-200/80 rounded text-[10px] font-bold text-neutral-700">BNI</span>
                  <span className="px-2 py-0.5 bg-neutral-200/80 rounded text-[10px] font-bold text-neutral-700">GoPay</span>
                  <span className="px-2 py-0.5 bg-neutral-200/80 rounded text-[10px] font-bold text-neutral-700">OVO</span>
                  <span className="px-2 py-0.5 bg-neutral-200/80 rounded text-[10px] font-bold text-neutral-700">DANA</span>
                  <span className="px-2 py-0.5 bg-neutral-200/80 rounded text-[10px] font-bold text-neutral-700">ShopeePay</span>
                </div>
              </div>

              {/* Step by Step instructions */}
              <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200/80 text-left space-y-1.5 text-xs text-neutral-700">
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <p>Buka m-Banking atau E-Wallet Anda lalu scan QRIS di atas.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <p>Masukkan nominal sesuai total tagihan (<b>{formatIDR(payableAmount)}</b>).</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <p>Setelah pembayaran berhasil, klik tombol <b>"Saya Sudah Bayar via QRIS"</b> di bawah.</p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <p className="text-emerald-800 font-medium">Pesanan Anda akan <b>langsung masuk ke dapur dan kasir</b> untuk segera disiapkan!</p>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-1.5 text-[11px] text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Standar Pembayaran Nasional QRIS Resmi BI & ASPI</span>
              </div>
            </div>
          )}

          {/* Cashier View */}
          {paymentMethod === 'CASHIER' && (
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 text-center space-y-3.5">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Building2 className="w-7 h-7" />
              </div>
              <h4 className="font-extrabold text-base text-neutral-900">
                Bayar di Meja Kasir
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                Pesanan Anda akan dikirim ke dapur dan kasir dengan status <b>Menunggu Pembayaran Kasir</b>. Anda dapat melakukan pembayaran dengan uang tunai atau kartu debit/kredit di meja kasir setelah selesai bersantap.
              </p>
              <div className="bg-white rounded-xl p-3 border border-neutral-200 max-w-xs mx-auto text-left space-y-1">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Nomor Meja:</span>
                  <span className="font-bold text-neutral-800">{tableNumber ? `Meja ${tableNumber}` : (orderMode === 'takeaway' ? 'Takeaway' : '-')}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Total Tagihan:</span>
                  <span className="font-black text-primary">{formatIDR(payableAmount)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-neutral-200 space-y-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirmPayment}
            className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] disabled:opacity-60 text-white font-bold rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center space-x-2 text-sm transition"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memverifikasi & Mengirim ke Dapur...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {paymentMethod === 'QRIS'
                    ? 'Saya Sudah Bayar via QRIS (Kirim ke Dapur)'
                    : 'Kirim Pesanan (Bayar di Kasir Nanti)'}
                </span>
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-neutral-400">
            {paymentMethod === 'QRIS' 
              ? 'Pesanan otomatis tercatat lunas dan langsung dimasak di dapur.' 
              : 'Pesanan akan masuk ke antrean dapur dan kasir.'}
          </p>
        </div>
      </div>
    </div>
  );
};
