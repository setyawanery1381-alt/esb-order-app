import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { useApp } from '../context/AppContext';
import { 
  X, 
  QrCode, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  ArrowRight,
  ShoppingBag,
  Utensils,
  Hash
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/menuData';

export const QRScannerModal = ({ isOpen, onClose, onScanSuccess, initialTab = 'picker' }) => {
  const { tableNumber, setTableNumber, setOrderMode, setViewMode } = useApp();
  
  const [activeTab, setActiveTab] = useState(initialTab); // 'picker' | 'camera'
  const [inputTable, setInputTable] = useState(tableNumber || '38');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedTable, setDetectedTable] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);

  // Sync initialTab and tableNumber when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setInputTable(tableNumber || '38');
    }
  }, [isOpen, initialTab, tableNumber]);

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
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.play().catch((e) => console.warn('Video play error:', e));
          animFrameRef.current = requestAnimationFrame(scanVideoFrame);
        }
      } else {
        setCameraError('Kamera tidak didukung pada browser ini. Silakan gunakan input nomor meja di tab sebelah!');
      }
    } catch (err) {
      console.warn('Camera access error or permission denied', err);
      setCameraError('Izin kamera belum diberikan atau perangkat tidak memiliki webcam. Anda dapat memasukkan nomor meja langsung!');
    }
  };

  const scanVideoFrame = () => {
    if (!videoRef.current || !streamRef.current) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && !isScanning) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code && code.data) {
          console.log('Detected QR code data:', code.data);
          let targetTable = null;
          try {
            const parsed = new URL(code.data);
            const tbl = parsed.searchParams.get('tableNumber');
            if (tbl) targetTable = parseInt(tbl, 10);
          } catch {
            const match = code.data.match(/(?:TBL|MEJA|TABLE)[-_ ]?(\d+)/i) || code.data.match(/(\d+)/);
            if (match) targetTable = parseInt(match[1], 10);
          }

          if (targetTable && targetTable > 0 && targetTable <= 50) {
            handleSelectTable(targetTable);
            return;
          } else if (code.data.toLowerCase().includes('takeaway')) {
            handleTakeaway();
            return;
          }
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(scanVideoFrame);
  };

  const stopCamera = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  if (!isOpen) return null;

  // Process selected or confirmed table and jump to food menu
  const handleSelectTable = (tblNum) => {
    const finalTable = String(tblNum || '38').trim();
    setIsScanning(true);
    setDetectedTable(finalTable);

    setTimeout(() => {
      setTableNumber(finalTable);
      setOrderMode('dinein');
      setViewMode('customer');

      // Update URL query parameters
      const url = new URL(window.location);
      url.searchParams.set('mode', 'dinein');
      url.searchParams.set('tableNumber', finalTable);
      window.history.replaceState({}, '', url);

      setIsScanning(false);
      setDetectedTable(null);
      stopCamera();
      onClose();

      if (onScanSuccess) {
        onScanSuccess(finalTable);
      }
    }, 600);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-neutral-900 text-white w-full max-w-md rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shadow-xs">
              {activeTab === 'picker' ? <Utensils className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                {activeTab === 'picker' ? 'Masukkan Nomor Meja' : 'Pindai Barcode QR Meja'}
              </h3>
              <p className="text-xs text-neutral-400">
                {RESTAURANT_INFO.name} ({RESTAURANT_INFO.branchName})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Masukkan No. Meja vs Pindai Barcode */}
        <div className="flex p-2 bg-neutral-950/90 border-b border-neutral-800 gap-1 text-xs">
          <button
            onClick={() => setActiveTab('picker')}
            className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'picker'
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>Masukkan No. Meja</span>
          </button>

          <button
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'camera'
                ? 'bg-primary text-white shadow-md shadow-primary/30'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Pindai Barcode QR</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: INPUT NOMOR MEJA (SANGAT JELAS) */}
          {activeTab === 'picker' && (
            <div className="space-y-4 text-left">
              <div className="space-y-1 text-center">
                <h4 className="text-lg font-black text-white tracking-tight">
                  Berapa Nomor Meja Anda?
                </h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Ketik nomor meja atau pilih langsung dari daftar meja di bawah.
                </p>
              </div>

              {/* Big Interactive Number Box */}
              <div className="bg-neutral-950 p-4 rounded-2xl border-2 border-neutral-800 space-y-2">
                <span className="block text-[11px] font-extrabold uppercase tracking-wider text-orange-400 text-center">
                  Nomor Meja Terpilih
                </span>

                <div className="flex items-center justify-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setInputTable((prev) => String(Math.max(1, (parseInt(prev, 10) || 1) - 1)))}
                    className="w-12 h-12 bg-neutral-800 hover:bg-neutral-700 active:scale-95 rounded-xl text-2xl font-black text-white flex items-center justify-center transition"
                  >
                    -
                  </button>

                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={inputTable}
                      onChange={(e) => setInputTable(e.target.value)}
                      placeholder="38"
                      className="w-28 h-12 text-center text-3xl font-black bg-neutral-900 border-2 border-primary/60 rounded-xl text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/40 shadow-inner"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setInputTable((prev) => String(Math.min(99, (parseInt(prev, 10) || 0) + 1)))}
                    className="w-12 h-12 bg-neutral-800 hover:bg-neutral-700 active:scale-95 rounded-xl text-2xl font-black text-white flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quick Select Table Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-300">Pilih Cepat Meja:</span>
                  <span className="text-[11px] text-neutral-500">Tersedia Meja 1 - 30</span>
                </div>

                <div className="grid grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1 border border-neutral-800 rounded-2xl bg-neutral-950/60">
                  {[...Array(30)].map((_, i) => {
                    const num = i + 1;
                    const isSelected = String(inputTable) === String(num);

                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setInputTable(String(num))}
                        className={`py-2 rounded-xl text-center font-extrabold text-xs transition ${
                          isSelected
                            ? 'bg-primary text-white shadow-md shadow-primary/40 ring-2 ring-orange-300 scale-105'
                            : 'bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Big Action Button to enter food menu */}
              <button
                onClick={() => handleSelectTable(inputTable || '38')}
                disabled={isScanning}
                className="w-full py-4 px-6 bg-gradient-to-r from-primary to-orange-500 hover:from-primary-hover hover:to-orange-600 active:scale-[0.99] text-white font-black text-base rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center space-x-2 transition-all mt-2"
              >
                <span>Masuk ke Menu Makanan (Meja {inputTable || '...'})</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* TAB 2: PINDAI BARCODE QR CAMERA */}
          {activeTab === 'camera' && (
            <div className="space-y-4 text-center">
              <div className="space-y-1">
                <h4 className="text-base font-black text-white">
                  Arahkan Kamera ke Barcode QR Meja
                </h4>
                <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                  Arahkan lensa kamera ke stiker barcode yang tertempel di meja Anda.
                </p>
              </div>

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
                      {cameraError}
                    </p>
                  </div>
                )}

                {/* Processing Overlay */}
                {isScanning && (
                  <div className="absolute inset-0 bg-neutral-950/95 flex flex-col items-center justify-center p-4 space-y-3 z-20 animate-in fade-in">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center animate-bounce">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-white">
                        Meja {detectedTable} Terverifikasi!
                      </h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        Membuka menu makanan...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulated Quick Scans */}
              <div className="space-y-2">
                <p className="text-xs text-neutral-400">
                  Simulasi cepat (klik meja di bawah untuk uji coba langsung):
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {[38, 12, 5, 21].map((tbl) => (
                    <button
                      key={tbl}
                      disabled={isScanning}
                      onClick={() => handleSelectTable(tbl)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center space-x-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700"
                    >
                      <Sparkles className="w-3 h-3 text-orange-400" />
                      <span>Meja {tbl}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Alternative button: switch to table input */}
              <button
                type="button"
                onClick={() => setActiveTab('picker')}
                className="text-xs text-orange-400 hover:text-orange-300 font-bold underline"
              >
                Kamera tidak aktif? Masukkan nomor meja secara manual
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer: Takeaway Alternative */}
        <div className="p-3.5 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs">
          <span className="text-neutral-400">Pesan dibungkus?</span>
          <button
            onClick={handleTakeaway}
            className="text-primary hover:text-orange-400 font-bold flex items-center space-x-1 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pesan Takeaway</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
