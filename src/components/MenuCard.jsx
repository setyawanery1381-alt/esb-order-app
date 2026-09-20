import React from 'react';
import { formatIDR } from '../utils/format';
import { Star, Plus, Flame, Sliders } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MenuCard = ({ item, onOpenModal }) => {
  const { outOfStockIds, cart } = useApp();
  const isOutOfStock = outOfStockIds.includes(item.id);

  // Check how many of this item are currently in cart
  const inCartCount = cart
    .filter((c) => c.item.id === item.id)
    .reduce((sum, c) => sum + c.quantity, 0);

  return (
    <div 
      onClick={() => !isOutOfStock && onOpenModal(item)}
      className={`bg-white rounded-2xl p-3 border border-neutral-200/80 shadow-xs hover:shadow-md transition-all flex gap-3.5 relative cursor-pointer group ${
        isOutOfStock ? 'opacity-60 grayscale-[40%]' : ''
      }`}
    >
      {/* Food Image & Badges */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Status Badges */}
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
          {item.isBestSeller && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white shadow-xs">
              ★ Favorit
            </span>
          )}
          {item.isPromo && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-rose-500 text-white shadow-xs">
              Promo
            </span>
          )}
          {isOutOfStock && (
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-neutral-800 text-white shadow-xs">
              Habis
            </span>
          )}
        </div>

        {/* In-cart badge indicator */}
        {inCartCount > 0 && (
          <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-primary text-white font-bold text-xs flex items-center justify-center shadow-md">
            {inCartCount}
          </div>
        )}
      </div>

      {/* Info & Pricing */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div>
          <div className="flex items-center space-x-1 text-xs text-amber-500 font-semibold mb-0.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{item.rating || '4.8'}</span>
            <span className="text-neutral-400 font-normal">
              ({item.reviewCount || '100+'})
            </span>
          </div>

          <h4 className="font-bold text-neutral-900 text-sm sm:text-base leading-tight group-hover:text-primary transition line-clamp-1">
            {item.name}
          </h4>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Price and Add Button */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
          <div className="flex items-baseline space-x-1.5">
            <span className="font-extrabold text-primary text-sm sm:text-base">
              {formatIDR(item.price)}
            </span>
            {item.originalPrice && (
              <span className="text-[11px] text-neutral-400 line-through">
                {formatIDR(item.originalPrice)}
              </span>
            )}
          </div>

          <button
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onOpenModal(item);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition shadow-xs ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                : 'bg-orange-50 hover:bg-primary text-primary hover:text-white border border-primary/30'
            }`}
          >
            {item.modifierGroups && item.modifierGroups.length > 0 ? (
              <>
                <Sliders className="w-3.5 h-3.5" />
                <span>Pilih</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
