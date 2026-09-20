import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, QrCode, Printer, Copy, Check, ExternalLink } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const QRCodeModal = ({ isOpen, onClose }) => {
  const { tableNumber, setTableNumber } = useApp();
  const [selectedTable, setSelectedTable] = useState(tableNumber);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = `${window.location.origin}${window.location.pathname}?mode=dinein&tableNumber=${selectedTable}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base leading-tight">
                QR Code Meja Restoran
              </h3>
              <p className="text-xs text-neutral-500">
                Pindai untuk langsung memesan di meja
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
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-center">
          {/* Table Selector */}
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs font-bold text-neutral-600">Pilih Nomor Meja:</span>
            <select
              value={selectedTable}
              onChange={(e) => {
                setSelectedTable(e.target.value);
                setTableNumber(e.target.value);
              }}
              className="px-3 py-1 bg-neutral-100 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {[...Array(50)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Meja {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Printable Stand Card */}
          <div className="bg-gradient-to-b from-orange-50 to-white p-6 rounded-3xl border-2 border-orange-200 shadow-sm max-w-xs mx-auto space-y-3">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-extrabold tracking-widest text-primary">
                {RESTAURANT_INFO.name}
              </span>
              <h4 className="text-xl font-black text-neutral-900">
                MEJA {selectedTable}
              </h4>
              <p className="text-[11px] text-neutral-500">
                Pindai QR untuk Pesan & Bayar
              </p>
            </div>

            {/* Simulated QR Code */}
            <div className="bg-white p-3 rounded-2xl border border-neutral-200 inline-block shadow-sm">
              <svg
                className="w-40 h-40 mx-auto"
                viewBox="0 0 120 120"
                fill="currentColor"
              >
                <rect x="10" y="10" width="30" height="30" rx="4" fill="#222" />
                <rect x="15" y="15" width="20" height="20" rx="2" fill="#fff" />
                <rect x="20" y="20" width="10" height="10" rx="1" fill="#222" />

                <rect x="80" y="10" width="30" height="30" rx="4" fill="#222" />
                <rect x="85" y="15" width="20" height="20" rx="2" fill="#fff" />
                <rect x="90" y="20" width="10" height="10" rx="1" fill="#222" />

                <rect x="10" y="80" width="30" height="30" rx="4" fill="#222" />
                <rect x="15" y="85" width="20" height="20" rx="2" fill="#fff" />
                <rect x="20" y="90" width="10" height="10" rx="1" fill="#222" />

                <rect x="48" y="14" width="6" height="6" rx="1" fill="#222" />
                <rect x="62" y="14" width="6" height="6" rx="1" fill="#222" />
                <rect x="48" y="28" width="6" height="6" rx="1" fill="#222" />
                <rect x="62" y="28" width="6" height="6" rx="1" fill="#222" />

                <rect x="14" y="48" width="6" height="6" rx="1" fill="#222" />
                <rect x="28" y="48" width="6" height="6" rx="1" fill="#222" />
                <rect x="14" y="62" width="6" height="6" rx="1" fill="#222" />
                <rect x="28" y="62" width="6" height="6" rx="1" fill="#222" />

                <rect x="48" y="48" width="24" height="24" rx="4" fill="#f05a28" />
                <circle cx="60" cy="60" r="5" fill="#fff" />

                <rect x="80" y="48" width="8" height="8" rx="1" fill="#222" />
                <rect x="96" y="56" width="8" height="8" rx="1" fill="#222" />
                <rect x="80" y="72" width="8" height="8" rx="1" fill="#222" />
                <rect x="96" y="88" width="8" height="8" rx="1" fill="#222" />
                <rect x="48" y="80" width="8" height="8" rx="1" fill="#222" />
                <rect x="64" y="88" width="8" height="8" rx="1" fill="#222" />
              </svg>
            </div>

            <p className="text-[10px] text-neutral-400 font-mono">
              Powered by ESB Order System
            </p>
          </div>

          {/* Copy URL Link */}
          <div className="flex items-center space-x-2 bg-neutral-100 p-2 rounded-xl border border-neutral-200 text-xs">
            <span className="flex-1 truncate text-left text-neutral-600 font-mono text-[11px]">
              {currentUrl}
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-white hover:bg-neutral-50 rounded-lg font-bold text-neutral-800 shadow-2xs flex items-center space-x-1 transition"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-neutral-200 flex gap-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99] text-white font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 text-xs sm:text-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Stand Meja</span>
          </button>
        </div>
      </div>
    </div>
  );
};
