import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Cloud, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Smartphone,
  Laptop
} from 'lucide-react';
import { getSavedFirebaseConfig, saveFirebaseConfig, isFirebaseActive } from '../services/firebase';

export const FirebaseModal = ({ isOpen, onClose }) => {
  const currentConfig = getSavedFirebaseConfig() || {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  };

  const [config, setConfig] = useState(currentConfig);
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleJsonPaste = (e) => {
    const val = e.target.value;
    setJsonInput(val);
    try {
      // Clean up common JS object or JSON format
      const cleaned = val
        .replace(/const firebaseConfig =/g, '')
        .replace(/;/g, '')
        .trim();
      const parsed = JSON.parse(cleaned);
      setConfig(parsed);
      setError('');
    } catch (err) {
      // Try regex extraction
      const apiKey = val.match(/apiKey:\s*["']([^"']+)["']/)?.[1];
      const projectId = val.match(/projectId:\s*["']([^"']+)["']/)?.[1];
      const authDomain = val.match(/authDomain:\s*["']([^"']+)["']/)?.[1];
      const appId = val.match(/appId:\s*["']([^"']+)["']/)?.[1];

      if (projectId && apiKey) {
        setConfig({
          apiKey,
          projectId,
          authDomain: authDomain || `${projectId}.firebaseapp.com`,
          appId: appId || '',
        });
        setError('');
      } else {
        setError('Format JSON atau konfigurasi Firebase tidak valid.');
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!config.projectId || !config.apiKey) {
      setError('Project ID dan API Key wajib diisi.');
      return;
    }
    saveFirebaseConfig(config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-xs">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-neutral-900 text-base leading-tight">
                Hubungkan Firebase Firestore
              </h3>
              <p className="text-xs text-neutral-500">
                Cloud Database real-time gratis untuk HP & Laptop
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
          {/* Status Card */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isFirebaseActive() 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 flex-shrink-0" />
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider block">
                  Status Database
                </span>
                <p className="text-xs font-medium">
                  {isFirebaseActive()
                    ? 'Terhubung ke Firebase Firestore (Cloud Sync Aktif)'
                    : 'Mode Offline / Lokal (Hanya Browser Ini)'}
                </p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
              isFirebaseActive() ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
            }`}>
              {isFirebaseActive() ? 'ONLINE' : 'LOKAL'}
            </span>
          </div>

          {/* Explanation */}
          <div className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 space-y-2 text-xs text-neutral-600">
            <h4 className="font-bold text-neutral-800 flex items-center space-x-1.5">
              <span>Mengapa butuh Firebase Firestore?</span>
            </h4>
            <div className="flex items-center justify-around py-2 border-y border-neutral-200/80">
              <div className="flex items-center space-x-1.5 font-semibold text-neutral-800">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>HP Pelanggan</span>
              </div>
              <span className="text-primary font-bold">➔ Cloud ➔</span>
              <div className="flex items-center space-x-1.5 font-semibold text-neutral-800">
                <Laptop className="w-4 h-4 text-primary" />
                <span>Laptop Kasir</span>
              </div>
            </div>
            <p className="leading-relaxed">
              Dengan Firebase Firestore, saat pelanggan memesan dari HP, tiket pesanan langsung muncul detik itu juga di Layar Dapur laptop kasir tanpa perlu berada di jaringan yang sama!
            </p>
          </div>

          {/* Quick Paste JSON / Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-neutral-800">
                  Tempel Konfigurasi Firebase (firebaseConfig)
                </label>
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-primary hover:underline flex items-center space-x-0.5 font-semibold"
                >
                  <span>Firebase Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <textarea
                value={jsonInput}
                onChange={handleJsonPaste}
                placeholder={`Contoh tempel di sini:\nconst firebaseConfig = {\n  apiKey: "AIzaSy...",\n  projectId: "resto-order",\n  ...\n};`}
                rows={4}
                className="w-full p-2.5 text-xs font-mono bg-neutral-50 rounded-xl border border-neutral-200 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition resize-none"
              />
              {error && (
                <p className="text-xs text-rose-600 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Project ID</label>
                <input
                  type="text"
                  value={config.projectId || ''}
                  onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                  placeholder="contoh: resto-order"
                  className="w-full p-2 bg-neutral-50 rounded-lg border border-neutral-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">API Key</label>
                <input
                  type="text"
                  value={config.apiKey || ''}
                  onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full p-2 bg-neutral-50 rounded-lg border border-neutral-200 text-xs font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-bold rounded-xl shadow-md shadow-primary/20 flex items-center justify-center space-x-2 text-xs sm:text-sm transition mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan & Aktifkan Cloud Sync</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
