import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  Smartphone, 
  Layers,
  ArrowRight,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const { setTableNumber, setOrderMode, setViewMode } = useApp();
  
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' | 'picker'
  const [isScanning, setIsScanning] = useState(false);
  const [detectedTable, setDetectedTable] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera when camera tab is active
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError('Kamera tidak didukung pada browser ini. Silakan gunakan simulasi scan atau pilih meja.');
      }
    } catch (err) {
      console.warn('Camera access error or permission denied', err);
      setCameraError('Izin kamera belum diberikan atau perangkat tidak memiliki webcam. Anda dapat mencoba simulasi scan di bawah!');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  if (!isOpen) return null;

  // Process selected or scanned table
  const handleSelectTable = (tblNum) => {
    setIsScanning(true);
    setDetectedTable(tblNum);

    // Simulate scanning delay with verification
    setTimeout(() => {
      setTableNumber(String(tblNum));
      setOrderMode('dinein');
      setViewMode('customer');

      // Update URL query parameters
      const url = new URL(window.location);
      url.searchParams.set('mode', 'dinein');
      url.searchParams.set('tableNumber', String(tblNum));
      window.history.replaceState({}, '', url);

      setIsScanning(false);
      setDetectedTable(null);
      stopCamera();
      onClose();

      if (onScanSuccess) {
        onScanSuccess(tblNum);
      }
    }, 1200);
  };

  const handleTakeaway = () => {
    setOrderMode('takeaway');
    setViewMode('customer');
    const url = new URL(window.location);
    url.searchParams.set('mode', 'takeaway');
    url.searchParams.delete('tableNumber');
    window.history.replaceState({}, '', url);
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-neutral-900 text-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-800 animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center border border-primary/30">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                Pindai Barcode QR Meja
              </h3>
              <p className="text-[11px] text-neutral-400">
                {RESTAURANT_INFO.name} ({RESTAURANT_INFO.branchName})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Scan Kamera vs Pilih Meja Manual */}
        <div className="flex p-2 bg-neutral-950 border-b border-neutral-800 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'camera'
                ? 'bg-primary text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Pindai Kamera QR</span>
          </button>
          <button
            onClick={() => setActiveTab('picker')}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'picker'
                ? 'bg-primary text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Daftar Nomor Meja</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'camera' ? (
            <div className="space-y-4 text-center">
              {/* Camera Scanner Viewfinder Box */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto rounded-3xl overflow-hidden bg-neutral-950 border-2 border-neutral-800 flex items-center justify-center shadow-inner">
                {/* Real Video Stream */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />

                {/* Animated Laser Scanning Line */}
                <div className="absolute inset-x-4 top-4 bottom-4 pointer-events-none">
                  {/* Outer corner target brackets */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

                  {/* Laser Beam */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-lg shadow-orange-500/80 animate-pulse-ring top-1/2 -translate-y-1/2" />
                </div>

                {/* Center QR Watermark icon if camera off */}
                {cameraError && (
                  <div className="relative z-10 p-4 text-center space-y-2">
                    <QrCode className="w-16 h-16 mx-auto text-primary/40 animate-pulse" />
                    <p className="text-[11px] text-neutral-400 max-w-[200px] leading-relaxed">
                      Arahkan barcode QR meja ke dalam bingkai ini.
                    </p>
                  </div>
                )}

                {/* Processing Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-neutral-950/90 flex flex-col items-center justify-center p-4 space-y-3 z-20 animate-in fade-in">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center animate-bounce">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-white">
                        QR Meja {detectedTable} Terdeteksi!
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Membuka menu pemesanan digital...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Instructions & Simulated Quick Scans */}
              <div className="space-y-2.5">
                <p className="text-xs text-neutral-400">
                  Klik simulasi scan meja di bawah untuk mencoba instan:
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[38, 12, 5, 21].map((tbl) => (
                    <button
                      key={tbl}
                      disabled={isScanning}
                      onClick={() => handleSelectTable(tbl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center space-x-1.5 ${
                        tbl === 38
                          ? 'bg-primary hover:bg-primary-hover text-white border-primary shadow-md shadow-primary/30'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Scan Meja {tbl}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Table Grid Selector */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-400">
                  Pilih nomor meja yang Anda tempati:
                </span>
                <span className="text-[11px] text-primary font-bold">
                  Tersedia 30 Meja
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1">
                {[...Array(30)].map((_, i) => {
                  const num = i + 1;
                  const isCurrent = num === 38;

                  return (
                    <button
                      key={num}
                      disabled={isScanning}
                      onClick={() => handleSelectTable(num)}
                      className={`p-2.5 rounded-xl text-center font-bold text-xs border transition ${
                        isCurrent
                          ? 'bg-primary text-white border-primary shadow-md shadow-primary/30 ring-2 ring-orange-300'
                          : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                      }`}
                    >
                      <span>{num}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer: Takeaway Alternative */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs">
          <span className="text-neutral-400">Tidak makan di tempat?</span>
          <button
            onClick={handleTakeaway}
            className="text-primary hover:text-orange-400 font-bold flex items-center space-x-1 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pesan Takeaway (Bawa Pulang)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
