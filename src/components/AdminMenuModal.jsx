import React from 'react';
import { MENU_ITEMS } from '../data/menuData';
import { useApp } from '../context/AppContext';
import { formatIDR } from '../utils/format';
import { X, SlidersHorizontal, Check, Ban } from 'lucide-react';

export const AdminMenuModal = ({ isOpen, onClose }) => {
  const { outOfStockIds, toggleItemStock } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 text-white flex items-center justify-center shadow-xs">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base leading-tight">
                Kelola Ketersediaan Menu (86 Stock)
              </h3>
              <p className="text-xs text-neutral-500">
                Atur menu yang habis atau tersedia secara real-time
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

        {/* List of items */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2 divide-y divide-neutral-100">
          {MENU_ITEMS.map((item) => {
            const isOutOfStock = outOfStockIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="pt-2 flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-neutral-100"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      {formatIDR(item.price)} • <span className="capitalize">{item.category}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleItemStock(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition flex-shrink-0 ${
                    isOutOfStock
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  }`}
                >
                  {isOutOfStock ? (
                    <>
                      <Ban className="w-3.5 h-3.5" />
                      <span>Habis</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersedia</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-neutral-200">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs sm:text-sm transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
