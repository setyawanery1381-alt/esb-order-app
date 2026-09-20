import React from 'react';
import { formatIDR, formatTime } from '../utils/format';
import { 
  X, 
  CheckCircle2, 
  Flame, 
  Utensils, 
  Printer, 
  PlusCircle, 
  Clock, 
  Receipt,
  Check
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const OrderStatusModal = ({ order, isOpen, onClose, onOrderMore }) => {
  if (!isOpen || !order) return null;

  const steps = [
    { id: 'RECEIVED', label: 'Pesanan Diterima', desc: 'Kasir & dapur menerima pesanan' },
    { id: 'COOKING', label: 'Sedang Dimasak', desc: 'Koki sedang mengolah pesanan Anda' },
    { id: 'READY', label: 'Siap Disajikan', desc: 'Pelayan mengantar pesanan ke meja' },
    { id: 'COMPLETED', label: 'Selesai', desc: 'Pesanan telah selesai dinikmati' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === order.orderStatus);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base leading-tight">
                Status Pesanan
              </h3>
              <p className="text-xs text-neutral-500">
                Order ID: <b className="text-neutral-800">#{order.orderId}</b>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-5">
          {/* Stepper Status Progress */}
          <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
            <div className="space-y-4">
              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step.id} className="flex items-start space-x-3 relative">
                    {/* Connecting vertical line */}
                    {idx < steps.length - 1 && (
                      <div
                        className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-4 transition-colors ${
                          idx < currentStepIndex ? 'bg-primary' : 'bg-neutral-200'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${
                        isCurrent
                          ? 'bg-primary text-white ring-4 ring-orange-200'
                          : isPassed
                          ? 'bg-primary text-white'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className={`text-xs sm:text-sm font-bold leading-tight ${
                          isCurrent
                            ? 'text-primary'
                            : isPassed
                            ? 'text-neutral-900'
                            : 'text-neutral-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Struk Digital Card */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 font-mono text-xs">
            <div className="text-center pb-2 border-b border-dashed border-neutral-300">
              <h4 className="font-bold text-neutral-900 text-sm">{RESTAURANT_INFO.name}</h4>
              <p className="text-[11px] text-neutral-500">{RESTAURANT_INFO.branchName}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Meja {order.tableNumber} • {formatTime(order.createdAt)} WIB
              </p>
            </div>

            {/* Items */}
            <div className="space-y-1.5 pt-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div className="flex-1 pr-2">
                    <span className="font-semibold">{item.quantity}x {item.item.name}</span>
                    {item.notes && (
                      <p className="text-[10px] text-neutral-500 pl-4 font-sans">
                        Catatan: {item.notes}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold">{formatIDR(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-2 border-t border-dashed border-neutral-300 space-y-1">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatIDR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Service Charge ({RESTAURANT_INFO.serviceChargePercent}%)</span>
                <span>{formatIDR(order.serviceCharge)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>PB1 ({RESTAURANT_INFO.taxPercent}%)</span>
                <span>{formatIDR(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 text-sm pt-1 border-t border-neutral-300">
                <span>TOTAL</span>
                <span className="text-primary">{formatIDR(order.grandTotal)}</span>
              </div>
            </div>

            {/* Payment status badge */}
            <div className="text-center pt-2">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-sans font-bold text-[11px]">
                {order.paymentMethod === 'QRIS' ? 'LUNAS (QRIS DIGITAL)' : 'BAYAR DI KASIR'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-neutral-200 flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-3 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-neutral-700 flex items-center justify-center transition shadow-2xs"
            title="Cetak Struk"
          >
            <Printer className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOrderMore();
            }}
            className="flex-1 py-3 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center space-x-2 text-xs sm:text-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Pesan Menu Tambahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
