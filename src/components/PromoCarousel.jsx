import React, { useState, useEffect } from 'react';
import { PROMO_BANNERS } from '../data/menuData';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const PromoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PROMO_BANNERS.length) % PROMO_BANNERS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 my-3 shadow-sm">
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {PROMO_BANNERS.map((banner) => (
          <div
            key={banner.id}
            className={`w-full flex-shrink-0 p-4 sm:p-5 text-white bg-gradient-to-r ${banner.bgGradient} flex flex-col justify-between min-h-[110px] relative`}
          >
            <div className="flex items-start justify-between">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-sm text-white">
                <Sparkles className="w-3 h-3" />
                <span>{banner.badge}</span>
              </span>
            </div>
            
            <div className="mt-2">
              <h3 className="font-bold text-base sm:text-lg leading-snug drop-shadow-sm">
                {banner.title}
              </h3>
              <p className="text-xs text-white/90 mt-0.5 drop-shadow-sm">
                {banner.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-xs transition"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-xs transition"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
        {PROMO_BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
