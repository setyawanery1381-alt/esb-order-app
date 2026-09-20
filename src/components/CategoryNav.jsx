import React from 'react';
import { CATEGORIES } from '../data/menuData';
import { 
  LayoutGrid, 
  Sparkles, 
  Tag, 
  UtensilsCrossed, 
  Soup, 
  Cookie, 
  Coffee, 
  IceCream 
} from 'lucide-react';

const iconMap = {
  LayoutGrid,
  Sparkles,
  Tag,
  UtensilsCrossed,
  Soup,
  Cookie,
  Coffee,
  IceCream,
};

export const CategoryNav = ({ activeCategory, onSelectCategory }) => {
  return (
    <div className="sticky top-[105px] z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 py-2.5 px-4 shadow-xs">
      <div className="max-w-3xl mx-auto flex items-center space-x-2 overflow-x-auto no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || LayoutGrid;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/30 scale-[1.02]'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
