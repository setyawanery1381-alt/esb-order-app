import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR } from '../utils/format';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  User, 
  Phone, 
  ReceiptText, 
  Utensils, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const CartDrawer = ({ isOpen, onClose, onProceedToPayment }) => {
  const {
    cart,
    updateCartItemQty,
    removeFromCart,
    clearCart,
    subtotal,
    serviceCharge,
    tax,
    grandTotal,
    tableNumber,
    orderMode,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
  } = useApp();

  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleCheckoutClick = () => {
    if (!customerName.trim()) {
      setFormError('Silakan masukkan nama Anda untuk pemesanan');
      return;
    }
    setFormError('');
    onProceedToPayment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-primary flex items-center justify-center">
              <ReceiptText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base leading-tight">
                Ringkasan Pesanan
              </h3>
              <p className="text-xs text-neutral-500">
                {orderMode === 'dinein' ? `Dine In • Meja ${tableNumber}` : 'Takeaway (Bawa Pulang)'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="p-2 text-neutral-400 hover:text-rose-500 rounded-lg hover:bg-neutral-100 transition text-xs font-semibold"
                title="Kosongkan Keranjang"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-5 divide-y divide-neutral-100">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 space-y-3">
              <Utensils className="w-12 h-12 mx-auto text-neutral-300 stroke-[1.5]" />
              <p className="text-sm font-medium">Keranjang belanja Anda masih kosong</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl"
              >
                Pilih Menu Sekarang
              </button>
            </div>
          ) : (
            <>
              {/* Item List */}
              <div className="space-y-3 pt-1">
                {cart.map((cartItem) => {
                  // Format selected modifiers string
                  const modStrings = [];
                  Object.values(cartItem.selectedModifiers || {}).forEach((val) => {
                    if (Array.isArray(val)) {
                      val.forEach((opt) => modStrings.push(opt.name));
                    } else if (val && val.name) {
                      modStrings.push(val.name);
                    }
                  });

                  return (
                    <div
                      key={cartItem.cartItemId}
                      className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/70 flex flex-col space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-neutral-900 text-sm">
                            {cartItem.item.name}
                          </h4>
                          {modStrings.length > 0 && (
                            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                              {modStrings.join(' • ')}
                            </p>
                          )}
                          {cartItem.notes && (
                            <p className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block border border-amber-200/50">
                              Catatan: {cartItem.notes}
                            </p>
                          )}
                        </div>

                        <span className="font-bold text-neutral-900 text-sm">
                          {formatIDR(cartItem.totalPrice)}
                        </span>
                      </div>

                      {/* Bottom row: Stepper & Remove */}
                      <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60">
                        <span className="text-xs text-neutral-400">
                          {formatIDR(cartItem.unitPrice)} / porsi
                        </span>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center bg-white rounded-lg border border-neutral-200 p-0.5 shadow-2xs">
                            <button
                              onClick={() =>
                                updateCartItemQty(cartItem.cartItemId, cartItem.quantity - 1)
                              }
                              className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-neutral-900">
                              {cartItem.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateCartItemQty(cartItem.cartItemId, cartItem.quantity + 1)
                              }
                              className="w-6 h-6 rounded bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(cartItem.cartItemId)}
                            className="p-1 text-neutral-400 hover:text-rose-500 transition"
                            title="Hapus item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer Info Form */}
              <div className="pt-4 space-y-3">
                <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider">
                  Informasi Pemesan
                </h4>

                {formError && (
                  <div className="flex items-center space-x-2 text-rose-600 text-xs bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nama Anda (Wajib)"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="No. WhatsApp (Opsional)"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 space-y-2 text-xs">
                <h4 className="font-bold text-neutral-900 text-xs uppercase tracking-wider mb-2">
                  Rincian Pembayaran
                </h4>
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal Pesanan</span>
                  <span>{formatIDR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Service Charge ({RESTAURANT_INFO.serviceChargePercent}%)</span>
                  <span>{formatIDR(serviceCharge)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>PB1 / Pajak Resto ({RESTAURANT_INFO.taxPercent}%)</span>
                  <span>{formatIDR(tax)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Pembayaran</span>
                  <span className="text-primary">{formatIDR(grandTotal)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Button */}
        {cart.length > 0 && (
          <div className="p-4 bg-white border-t border-neutral-200">
            <button
              onClick={handleCheckoutClick}
              className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-between text-sm transition"
            >
              <span>Kirim Pesanan ke Dapur & Bayar</span>
              <div className="flex items-center space-x-1.5">
                <span>{formatIDR(grandTotal)}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
