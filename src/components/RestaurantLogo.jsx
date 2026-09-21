import React from 'react';
import { RESTAURANT_INFO } from '../data/menuData';
import logoSvg from '../assets/restaurant-logo.svg';

export const RestaurantLogo = ({ size = 'md', showText = true, light = false }) => {
  const sizeMap = {
    sm: { img: 'w-8 h-8', title: 'text-xs', subtitle: 'text-[9px]' },
    md: { img: 'w-11 h-11', title: 'text-sm', subtitle: 'text-[11px]' },
    lg: { img: 'w-16 h-16', title: 'text-lg', subtitle: 'text-xs' },
    xl: { img: 'w-24 h-24', title: 'text-2xl', subtitle: 'text-sm' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center space-x-3">
      {/* Brand Icon SVG */}
      <div className={`relative ${currentSize.img} flex-shrink-0 drop-shadow-md`}>
        <img
          src={logoSvg}
          alt={RESTAURANT_INFO.name}
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <h1 className={`font-black tracking-tight leading-tight truncate ${currentSize.title} ${
              light ? 'text-white' : 'text-neutral-900'
            }`}>
              {RESTAURANT_INFO.name}
            </h1>
          </div>
          <p className={`font-medium truncate ${currentSize.subtitle} ${
            light ? 'text-neutral-300' : 'text-neutral-500'
          }`}>
            {RESTAURANT_INFO.tagline}
          </p>
        </div>
      )}
    </div>
  );
};
