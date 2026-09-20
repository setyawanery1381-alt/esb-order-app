import React from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR } from '../utils/format';
import { ShoppingBag, ChevronRight } from 'lucide-react';

export const FloatingCartBar = ({ onOpenCart }) => {
  const { totalCartCount, grandTotal } = useApp();

  if (totalCartCount === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 px-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          onClick={onOpenCart}
          className="w-full bg-primary hover:bg-primary-hover active:scale-[0.99] text-white p-3.5 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-between transition-all duration-200"
        >
          {/* Left: Bag icon & count */}
          <div className="flex items-center space-x-3">
            <div className="relative w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-primary rounded-full text-[11px] font-black flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] text-white/80 block uppercase font-semibold">
                Total Pesanan
              </span>
              <span className="text-base font-extrabold text-white">
                {formatIDR(grandTotal)}
              </span>
            </div>
          </div>

          {/* Right: Action CTA */}
          <div className="flex items-center space-x-1 text-xs font-bold bg-white/20 px-3 py-2 rounded-xl">
            <span>Lihat Keranjang</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
