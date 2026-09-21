import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/menuData';
import { RestaurantLogo } from './RestaurantLogo';
import { 
  X, 
  QrCode, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Wifi, 
  Smartphone, 
  Globe, 
  Barcode,
  Layers,
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const QRCodeModal = ({ isOpen, onClose }) => {
  const { tableNumber, setTableNumber, setOrderMode, setViewMode } = useApp();
  
  const [selectedTable, setSelectedTable] = useState(tableNumber || '38');
  const [mode, setMode] = useState('dinein'); // 'dinein' | 'takeaway'
  const [activeTab, setActiveTab] = useState('tentcard'); // 'tentcard' | 'qr' | 'barcode'
  
  // Default to live Vercel domain so physical table stickers open live app
  const defaultHost = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? window.location.origin
    : 'https://esb-order-app.vercel.app';
  const [vercelDomain, setVercelDomain] = useState(defaultHost);
  const [isEditingDomain, setIsEditingDomain] = useState(false);

  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  
  const barcodeSvgRef = useRef(null);

  // Build target URL (Vercel Live)
  const targetUrl = mode === 'dinein'
    ? `${vercelDomain.replace(/\/+$/, '')}/?mode=dinein&tableNumber=${selectedTable}`
    : `${vercelDomain.replace(/\/+$/, '')}/?mode=takeaway`;

  // Generate real QR code whenever targetUrl or activeTab changes
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#171717',
        light: '#FFFFFF'
      }
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
        }
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [targetUrl, isOpen]);

  // Generate 1D Barcode whenever selectedTable, mode, or activeTab changes
  useEffect(() => {
    if (!isOpen || !barcodeSvgRef.current) return;

    try {
      const codeVal = mode === 'dinein' ? `RST-TBL-${String(selectedTable).padStart(3, '0')}` : 'RST-TAKEAWAY';
      JsBarcode(barcodeSvgRef.current, codeVal, {
        format: 'CODE128',
        lineColor: '#171717',
        width: 2.2,
        height: 60,
        displayValue: true,
        font: 'Inter, sans-serif',
        fontSize: 14,
        fontOptions: 'bold',
        textMargin: 6
      });
    } catch (err) {
      console.error('Error generating 1D barcode:', err);
    }
  }, [selectedTable, mode, activeTab, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qrcode-meja-${selectedTable}-resto-rasa-nusantara.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApplyAndOpen = () => {
    setTableNumber(String(selectedTable));
    setOrderMode(mode);
    setViewMode('customer');
    
    const url = new URL(window.location);
    url.searchParams.set('mode', mode);
    if (mode === 'dinein') {
      url.searchParams.set('tableNumber', String(selectedTable));
    } else {
      url.searchParams.delete('tableNumber');
    }
    window.history.replaceState({}, '', url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white text-neutral-900 w-full max-w-xl rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-5 py-4 border-b border-neutral-200 bg-neutral-50/90 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-primary flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-neutral-900 text-base leading-tight">
                Cetak Barcode & QR Meja (Admin Resto)
              </h3>
              <p className="text-xs text-neutral-500">
                Pilih nomor meja lalu cetak stiker untuk ditempel di meja fisik restoran
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 text-center">
          
          {/* Controls Bar (Meja & Format) */}
          <div className="bg-neutral-100 p-3 rounded-2xl border border-neutral-200/80 space-y-3 no-print text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              {/* Order Mode & Table Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-neutral-600">Nomor Meja:</span>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {[...Array(50)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Meja {i + 1}
                    </option>
                  ))}
                </select>

                <div className="flex bg-neutral-200 p-0.5 rounded-lg text-[11px] font-bold">
                  <button
                    onClick={() => setMode('dinein')}
                    className={`px-2 py-1 rounded-md transition ${mode === 'dinein' ? 'bg-white text-primary shadow-xs' : 'text-neutral-600'}`}
                  >
                    Dine In
                  </button>
                  <button
                    onClick={() => setMode('takeaway')}
                    className={`px-2 py-1 rounded-md transition ${mode === 'takeaway' ? 'bg-white text-primary shadow-xs' : 'text-neutral-600'}`}
                  >
                    Takeaway
                  </button>
                </div>
              </div>

              {/* View Tabs: Stand Meja | QR Saja | Barcode 1D */}
              <div className="flex bg-neutral-200 p-0.5 rounded-lg text-xs font-bold">
                <button
                  onClick={() => setActiveTab('tentcard')}
                  className={`px-3 py-1 rounded-md transition flex items-center space-x-1 ${
                    activeTab === 'tentcard' ? 'bg-white text-primary shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Stand Meja</span>
                </button>
                <button
                  onClick={() => setActiveTab('qr')}
                  className={`px-3 py-1 rounded-md transition flex items-center space-x-1 ${
                    activeTab === 'qr' ? 'bg-white text-primary shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Saja</span>
                </button>
                <button
                  onClick={() => setActiveTab('barcode')}
                  className={`px-3 py-1 rounded-md transition flex items-center space-x-1 ${
                    activeTab === 'barcode' ? 'bg-white text-primary shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Barcode className="w-3.5 h-3.5" />
                  <span>1D Barcode</span>
                </button>
              </div>
            </div>

            {/* Target URL Selector for Vercel Live */}
            <div className="border-t border-neutral-200/80 pt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-1.5 text-neutral-600">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-[11px]">Domain Vercel Live:</span>
                <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                  {vercelDomain}
                </span>
              </div>
              <button
                onClick={() => setIsEditingDomain(!isEditingDomain)}
                className="text-[11px] text-primary hover:underline font-bold"
              >
                {isEditingDomain ? 'Selesai' : 'Ganti URL Vercel'}
              </button>
            </div>

            {isEditingDomain && (
              <div className="pt-1">
                <input
                  type="text"
                  value={vercelDomain}
                  onChange={(e) => setVercelDomain(e.target.value)}
                  placeholder="https://esb-order-app.vercel.app"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-300 rounded-xl focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                />
              </div>
            )}
          </div>

          {/* MAIN PREVIEW: TENT CARD STAND MEJA (AKRILIK CETAK) */}
          {activeTab === 'tentcard' && (
            <div className="printable-card bg-gradient-to-b from-orange-50 via-white to-white p-6 sm:p-7 rounded-3xl border-2 border-orange-300 shadow-lg max-w-sm mx-auto space-y-4 text-center transition-all">
              {/* Card Header with Restaurant Identity */}
              <div className="flex flex-col items-center space-y-2">
                <RestaurantLogo size="sm" showText={true} />
                <div className="bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full border border-primary/20">
                  {mode === 'dinein' ? `MEJA ${selectedTable}` : 'ORDER TAKEAWAY'}
                </div>
              </div>

              {/* Real High-Resolution Scannable QR Code */}
              <div className="bg-white p-3.5 rounded-2xl border-2 border-neutral-900/10 shadow-sm inline-block">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code Meja ${selectedTable}`}
                    className="w-44 h-44 sm:w-48 sm:h-48 mx-auto rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-neutral-400">
                    Membuat QR Code...
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="space-y-1">
                <h4 className="text-sm font-black text-neutral-900 tracking-tight">
                  Pindai QR Untuk Pesan & Bayar
                </h4>
                <p className="text-[11px] text-neutral-500 leading-relaxed max-w-[240px] mx-auto">
                  Buka kamera HP atau Google Lens, arahkan ke kode QR di atas untuk langsung membuka menu dan memesan.
                </p>
              </div>

              {/* 1D Barcode Line at bottom of stand card */}
              <div className="pt-2 border-t border-dashed border-neutral-200">
                <svg ref={barcodeSvgRef} className="mx-auto max-w-[220px]" />
              </div>

              <div className="pt-1 flex items-center justify-center space-x-1.5 text-[9px] text-neutral-400 uppercase tracking-wider font-semibold">
                <Sparkles className="w-3 h-3 text-orange-500" />
                <span>Resto Rasa Nusantara • ESB Order System</span>
              </div>
            </div>
          )}

          {/* PREVIEW: QR CODE ONLY */}
          {activeTab === 'qr' && (
            <div className="py-4 space-y-4">
              <div className="bg-white p-5 rounded-3xl border-2 border-neutral-200 shadow-md inline-block">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code Meja ${selectedTable}`}
                    className="w-56 h-56 mx-auto rounded-xl object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-neutral-400">
                    Membuat QR Code...
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-neutral-900">
                  QR Code Menu {mode === 'dinein' ? `Meja ${selectedTable}` : 'Takeaway'}
                </p>
                <p className="text-xs text-neutral-500">
                  Standar ISO/IEC 18004. Langsung membuka menu saat dipindai kamera smartphone.
                </p>
              </div>
            </div>
          )}

          {/* PREVIEW: 1D BARCODE ONLY */}
          {activeTab === 'barcode' && (
            <div className="py-6 space-y-4">
              <div className="bg-white p-6 rounded-3xl border-2 border-neutral-200 shadow-md inline-block max-w-full overflow-x-auto">
                <svg ref={barcodeSvgRef} className="mx-auto" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-neutral-900">
                  1D Barcode (Code 128) {mode === 'dinein' ? `Meja ${selectedTable}` : 'Takeaway'}
                </p>
                <p className="text-xs text-neutral-500">
                  Dapat dibaca oleh scanner barcode laser kasir / POS konvensional.
                </p>
              </div>
            </div>
          )}

          {/* Real Target URL Bar & Copy */}
          <div className="flex items-center space-x-2 bg-neutral-100 p-2.5 rounded-2xl border border-neutral-200 text-xs no-print">
            <span className="text-neutral-400 font-bold text-[10px] uppercase pl-1">URL:</span>
            <span className="flex-1 truncate text-left text-neutral-700 font-mono text-[11px]">
              {targetUrl}
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-white hover:bg-neutral-50 rounded-xl font-bold text-neutral-800 shadow-2xs flex items-center space-x-1 transition"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
              <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>

          {/* Information for Admin */}
          <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-2xl text-left flex items-start space-x-2.5 text-xs text-emerald-950 no-print">
            <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Informasi Stiker Meja untuk Admin Resto:</p>
              <p className="text-[11px] text-emerald-800">
                Barcode ini mengarah langsung ke <b>Vercel Live</b>. Unduh gambar PNG atau cetak stand meja ini lalu tempelkan di masing-masing meja. Ketika pelanggan memindai stiker dengan kamera HP, menu makanan meja tersebut akan langsung terbuka secara online!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap sm:flex-nowrap gap-2 no-print">
          <button
            onClick={handleDownloadQR}
            className="flex-1 py-2.5 px-3 bg-white hover:bg-neutral-100 border border-neutral-300 text-neutral-800 font-bold rounded-xl shadow-2xs flex items-center justify-center space-x-1.5 text-xs transition active:scale-[0.98]"
            title="Unduh file gambar QR Code PNG"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Unduh PNG</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl shadow-sm flex items-center justify-center space-x-1.5 text-xs transition active:scale-[0.98]"
            title="Cetak Stand Meja Akrilik"
          >
            <Printer className="w-4 h-4 text-orange-400" />
            <span>Cetak Stand Meja</span>
          </button>

          <button
            onClick={handleApplyAndOpen}
            className="flex-1 py-2.5 px-3 bg-primary hover:bg-orange-600 text-white font-bold rounded-xl shadow-sm flex items-center justify-center space-x-1.5 text-xs transition active:scale-[0.98]"
            title="Buka menu meja ini langsung di aplikasi"
          >
            <span>Buka Menu Meja Ini</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
