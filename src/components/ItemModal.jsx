import React, { useState, useEffect } from 'react';
import { formatIDR } from '../utils/format';
import { X, Plus, Minus, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ItemModal = ({ item, onClose }) => {
  const { addToCart } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedModifiers, setSelectedModifiers] = useState({});
  const [validationError, setValidationError] = useState('');

  // Initialize default selections for required radio groups
  useEffect(() => {
    if (!item) return;

    const initial = {};
    if (item.modifierGroups) {
      item.modifierGroups.forEach((group) => {
        if (group.type === 'radio' && group.options.length > 0) {
          // Select the first option by default
          initial[group.id] = group.options[0];
        } else if (group.type === 'checkbox') {
          initial[group.id] = [];
        }
      });
    }
    setSelectedModifiers(initial);
    setQuantity(1);
    setNotes('');
    setValidationError('');
  }, [item]);

  if (!item) return null;

  // Handle radio selection
  const handleRadioChange = (groupId, option) => {
    setSelectedModifiers((prev) => ({
      ...prev,
      [groupId]: option,
    }));
  };

  // Handle checkbox toggle
  const handleCheckboxToggle = (groupId, option) => {
    setSelectedModifiers((prev) => {
      const currentList = prev[groupId] || [];
      const exists = currentList.some((o) => o.id === option.id);
      const updated = exists
        ? currentList.filter((o) => o.id !== option.id)
        : [...currentList, option];

      return {
        ...prev,
        [groupId]: updated,
      };
    });
  };

  // Calculate unit price with modifiers
  let unitPrice = item.price;
  Object.values(selectedModifiers).forEach((val) => {
    if (Array.isArray(val)) {
      val.forEach((opt) => {
        unitPrice += opt.price || 0;
      });
    } else if (val && val.price) {
      unitPrice += val.price;
    }
  });

  const totalPrice = unitPrice * quantity;

  // Submit to cart
  const handleAddToCart = () => {
    // Validate required groups
    if (item.modifierGroups) {
      for (const group of item.modifierGroups) {
        if (group.required && !selectedModifiers[group.id]) {
          setValidationError(`Harap pilih salah satu ${group.name}`);
          return;
        }
      }
    }

    addToCart(item, selectedModifiers, notes.trim(), quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Hero Image */}
        <div className="relative h-48 sm:h-56 w-full bg-neutral-100 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <div className="text-white">
              <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                {item.category.toUpperCase()}
              </span>
              <h3 className="font-bold text-lg leading-tight drop-shadow-sm">
                {item.name}
              </h3>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-5 divide-y divide-neutral-100">
          {/* Description & Base Price */}
          <div className="pt-1">
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-xl font-black text-primary">
                {formatIDR(item.price)}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatIDR(item.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Validation Error Notice */}
          {validationError && (
            <div className="pt-3 flex items-center space-x-2 text-rose-600 text-xs bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Dynamic Modifier Groups */}
          {item.modifierGroups &&
            item.modifierGroups.map((group) => {
              const isRadio = group.type === 'radio';
              const currentVal = selectedModifiers[group.id];

              return (
                <div key={group.id} className="pt-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-neutral-900 text-sm">
                      {group.name}
                    </h4>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        group.required
                          ? 'bg-orange-100 text-primary'
                          : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {group.required ? 'Wajib Pilih 1' : 'Opsional'}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {group.options.map((option) => {
                      const isSelected = isRadio
                        ? currentVal?.id === option.id
                        : (currentVal || []).some((o) => o.id === option.id);

                      return (
                        <div
                          key={option.id}
                          onClick={() => {
                            if (isRadio) handleRadioChange(group.id, option);
                            else handleCheckboxToggle(group.id, option);
                          }}
                          className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-orange-50/60 text-neutral-900 font-medium'
                              : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                                isSelected
                                  ? 'border-primary bg-primary text-white'
                                  : 'border-neutral-300 bg-white'
                              } ${!isRadio ? 'rounded-md' : ''}`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs sm:text-sm">{option.name}</span>
                          </div>

                          <span className="text-xs font-semibold text-neutral-600">
                            {option.price > 0 ? `+${formatIDR(option.price)}` : ''}
                            {option.price < 0 ? `${formatIDR(option.price)}` : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {/* Kitchen Notes */}
          <div className="pt-4 space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              Catatan Khusus untuk Dapur
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: jangan pakai daun bawang, es batu dipisah, kuah dipisah..."
              rows={2}
              className="w-full p-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition resize-none"
            />
          </div>
        </div>

        {/* Modal Footer: Stepper & Add Button */}
        <div className="p-4 bg-white border-t border-neutral-200 flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="flex items-center bg-neutral-100 rounded-xl border border-neutral-200 p-1 flex-shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:hover:bg-white flex items-center justify-center text-neutral-800 shadow-xs transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-neutral-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-800 shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 py-3 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-primary/20 flex items-center justify-between text-xs sm:text-sm transition"
          >
            <span>Tambah ke Pesanan</span>
            <span>{formatIDR(totalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
