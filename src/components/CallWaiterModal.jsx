import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  BellRing, 
  Utensils, 
  Droplet, 
  FileText, 
  Receipt, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';

export const CallWaiterModal = ({ isOpen, onClose }) => {
  const { tableNumber, callWaiter } = useApp();
  const [selectedReason, setSelectedReason] = useState('Minta Alat Makan (Sendok / Garpu)');
  const [customNote, setCustomNote] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const presets = [
    { label: 'Minta Alat Makan (Sendok / Garpu)', icon: Utensils },
    { label: 'Minta Tambah Air Minum / Es Batu', icon: Droplet },
    { label: 'Minta Tissue Tambahan', icon: FileText },
    { label: 'Minta Bill Pembayaran', icon: Receipt },
    { label: 'Bantuan Lainnya / Pelayan ke Meja', icon: HelpCircle },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = customNote.trim() 
      ? `${selectedReason}: ${customNote.trim()}` 
      : selectedReason;

    callWaiter(finalReason);
    setIsSent(true);

    setTimeout(() => {
      setIsSent(false);
      setCustomNote('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-amber-50/70">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base leading-tight">
                Panggil Pelayan
              </h3>
              <p className="text-xs text-neutral-500">
                Pemberitahuan ke staf untuk <b>Meja {tableNumber}</b>
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

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {isSent ? (
            <div className="py-8 text-center space-y-3 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-neutral-900">
                Panggilan Terkirim!
              </h4>
              <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                Pelayan kami telah menerima notifikasi dan segera menuju ke <b>Meja {tableNumber}</b>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                  Pilih Kebutuhan Anda
                </label>
                <div className="space-y-1.5">
                  {presets.map((preset, idx) => {
                    const Icon = preset.icon;
                    const isSelected = selectedReason === preset.label;

                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedReason(preset.label)}
                        className={`flex items-center space-x-3 p-3 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 text-neutral-900 font-semibold'
                            : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? 'bg-amber-500 text-white'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs sm:text-sm">{preset.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional notes */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-neutral-700">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Misal: sendok 2 buah, es batu 1 mangkuk..."
                  className="w-full p-2.5 text-xs bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-neutral-900 font-bold rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center space-x-2 text-sm transition"
              >
                <BellRing className="w-4 h-4" />
                <span>Panggil Sekarang</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
