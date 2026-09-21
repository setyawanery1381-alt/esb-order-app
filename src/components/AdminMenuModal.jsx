import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR } from '../utils/format';
import { CATEGORIES } from '../data/menuData';
import { 
  X, 
  UtensilsCrossed, 
  Plus, 
  Pencil, 
  Trash2, 
  Check, 
  Ban, 
  Search, 
  Sparkles, 
  Tag, 
  RotateCcw, 
  Image as ImageIcon,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';

const FOOD_PRESETS = [
  { label: 'Nasi Goreng', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Ayam Bakar', url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sate Ayam', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80' },
  { label: 'Mie Goreng', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80' },
  { label: 'Bakso Sapi', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cemilan / Dimsum', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Es Teh Manis', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80' },
  { label: 'Kopi Susu', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80' },
  { label: 'Jus Segar', url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80' },
];

export const AdminMenuModal = ({ isOpen, onClose }) => {
  const { 
    menuItems, 
    addMenuItem, 
    updateMenuItem, 
    deleteMenuItem, 
    resetMenuToDefault,
    outOfStockIds, 
    toggleItemStock 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null); // null means creating new
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('makanan');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formIsBestSeller, setFormIsBestSeller] = useState(false);
  const [formIsPromo, setFormIsPromo] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleOpenCreateForm = () => {
    setEditingId(null);
    setFormName('');
    setFormCategory('makanan');
    setFormPrice('');
    setFormOriginalPrice('');
    setFormDescription('');
    setFormImage(FOOD_PRESETS[0].url);
    setFormIsBestSeller(false);
    setFormIsPromo(false);
    setFormError('');
    setIsEditing(true);
  };

  const handleOpenEditForm = (item) => {
    setEditingId(item.id);
    setFormName(item.name || '');
    setFormCategory(item.category || 'makanan');
    setFormPrice(String(item.price || 0));
    setFormOriginalPrice(item.originalPrice ? String(item.originalPrice) : '');
    setFormDescription(item.description || '');
    setFormImage(item.image || FOOD_PRESETS[0].url);
    setFormIsBestSeller(Boolean(item.isBestSeller));
    setFormIsPromo(Boolean(item.isPromo));
    setFormError('');
    setIsEditing(true);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Nama menu tidak boleh kosong');
      return;
    }
    const priceNum = parseInt(formPrice, 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('Harga harus berupa angka lebih dari 0');
      return;
    }

    const payload = {
      name: formName.trim(),
      category: formCategory,
      price: priceNum,
      originalPrice: formOriginalPrice ? parseInt(formOriginalPrice, 10) : null,
      description: formDescription.trim(),
      image: formImage.trim() || FOOD_PRESETS[0].url,
      isBestSeller: formIsBestSeller,
      isPromo: formIsPromo,
    };

    if (editingId) {
      updateMenuItem(editingId, payload);
    } else {
      addMenuItem(payload);
    }

    setIsEditing(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    deleteMenuItem(id);
    setConfirmDeleteId(null);
  };

  const handleReset = () => {
    if (window.confirm('Kembalikan semua menu ke daftar bawaan restoran? Menu custom yang dibuat akan direset.')) {
      resetMenuToDefault();
    }
  };

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCategory === 'all') return true;
    if (activeCategory === 'promo') return item.isPromo;
    if (activeCategory === 'rekomendasi') return item.isBestSeller;
    if (activeCategory === 'outofstock') return outOfStockIds.includes(item.id);
    return item.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-3xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-200 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {isEditing 
                  ? (editingId ? 'Edit Menu Makanan' : 'Tambah Menu Baru') 
                  : 'Kelola & Edit Menu Makanan'}
              </h3>
              <p className="text-xs text-neutral-400">
                {isEditing 
                  ? 'Atur nama, harga, kategori, foto, dan status menu' 
                  : `Total ${menuItems.length} menu makanan & minuman`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {!isEditing && (
              <button
                type="button"
                onClick={handleOpenCreateForm}
                className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Menu</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* VIEW 1: FORM CREATE / EDIT */}
        {isEditing ? (
          <form onSubmit={handleSaveForm} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs sm:text-sm">
            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Nama Menu */}
            <div className="space-y-1">
              <label className="font-bold text-neutral-800 block">Nama Menu Makanan / Minuman *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contoh: Nasi Goreng Spesial Nusantara"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-primary focus:ring-1 focus:ring-primary text-neutral-900 bg-neutral-50 focus:bg-white transition"
              />
            </div>

            {/* Kategori & Harga Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-neutral-800 block">Kategori Menu *</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-primary focus:ring-1 focus:ring-primary text-neutral-900 bg-neutral-50 focus:bg-white transition font-medium"
                >
                  <option value="makanan">🍛 Makanan Utama</option>
                  <option value="mie">🍜 Mie & Bakso</option>
                  <option value="snack">🥟 Cemilan & Snack</option>
                  <option value="minuman">🥤 Minuman Segar</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-800 block">Harga Jual (Rp) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="38000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-primary focus:ring-1 focus:ring-primary text-neutral-900 bg-neutral-50 focus:bg-white transition font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-neutral-800 block">
                  Harga Coret / Promo (Rp)
                  <span className="text-[10px] text-neutral-400 font-normal ml-1">(Opsional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formOriginalPrice}
                  onChange={(e) => setFormOriginalPrice(e.target.value)}
                  placeholder="45000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-primary focus:ring-1 focus:ring-primary text-neutral-900 bg-neutral-50 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-1">
              <label className="font-bold text-neutral-800 block">Deskripsi Menu</label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Tuliskan komposisi, rasa khas, atau pelengkap menu ini..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-primary focus:ring-1 focus:ring-primary text-neutral-900 bg-neutral-50 focus:bg-white transition"
              />
            </div>

            {/* Foto Menu & Presets */}
            <div className="space-y-2">
              <label className="font-bold text-neutral-800 block flex items-center justify-between">
                <span>URL Foto Menu Makanan</span>
                <span className="text-[11px] text-primary font-normal">Pilih salah satu foto di bawah atau masukkan URL</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl border border-neutral-200 overflow-hidden bg-neutral-100 flex-shrink-0 shadow-inner">
                  {formImage ? (
                    <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:border-primary focus:ring-1 focus:ring-primary text-neutral-900 bg-neutral-50 focus:bg-white transition text-xs font-mono"
                />
              </div>

              {/* Photo Presets */}
              <div className="pt-1">
                <span className="text-[11px] text-neutral-500 font-bold block mb-1.5">
                  Foto Cepat Siap Pakai (Klik untuk memilih):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {FOOD_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormImage(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition flex items-center space-x-1.5 ${
                        formImage === preset.url
                          ? 'bg-orange-100 border-primary text-primary font-bold shadow-2xs'
                          : 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-4 h-4 rounded-full object-cover" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Badges Toggle */}
            <div className="pt-2 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center space-x-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={formIsBestSeller}
                  onChange={(e) => setFormIsBestSeller(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <div>
                  <span className="font-bold text-neutral-900 block flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Menu Rekomendasi (Best Seller)</span>
                  </span>
                  <span className="text-[11px] text-neutral-500">Tampil di tab Rekomendasi & bintang atas</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={formIsPromo}
                  onChange={(e) => setFormIsPromo(e.target.checked)}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <div>
                  <span className="font-bold text-neutral-900 block flex items-center space-x-1">
                    <Tag className="w-3.5 h-3.5 text-rose-500" />
                    <span>Tandai Promo Diskon</span>
                  </span>
                  <span className="text-[11px] text-neutral-500">Tampil dengan badge Promo spesial</span>
                </div>
              </label>
            </div>

            {/* Form Action Buttons */}
            <div className="pt-4 border-t border-neutral-200 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-neutral-300 font-bold text-neutral-700 hover:bg-neutral-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold shadow-lg shadow-primary/25 transition"
              >
                {editingId ? 'Simpan Perubahan' : 'Tambah ke Menu'}
              </button>
            </div>
          </form>
        ) : (
          /* VIEW 2: MENU CATALOG LIST & STOCK MANAGEMENT */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Search & Category Filter Toolbar */}
            <div className="p-3 border-b border-neutral-200 bg-neutral-50 space-y-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama menu atau deskripsi..."
                  className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Category pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {[
                  { id: 'all', label: `Semua (${menuItems.length})` },
                  { id: 'makanan', label: '🍛 Makanan Utama' },
                  { id: 'mie', label: '🍜 Mie & Bakso' },
                  { id: 'snack', label: '🥟 Cemilan' },
                  { id: 'minuman', label: '🥤 Minuman' },
                  { id: 'rekomendasi', label: '🌟 Best Seller' },
                  { id: 'promo', label: '🏷️ Promo' },
                  { id: 'outofstock', label: `🚫 Habis (${outOfStockIds.length})` },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition text-[11px] ${
                      activeCategory === cat.id
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-white hover:bg-neutral-200/70 text-neutral-600 border border-neutral-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Item List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2.5 divide-y divide-neutral-100">
              {filteredItems.length === 0 ? (
                <div className="py-16 text-center text-neutral-400 space-y-2">
                  <UtensilsCrossed className="w-10 h-10 mx-auto text-neutral-300 stroke-[1.5]" />
                  <p className="text-sm font-medium">Tidak ada menu yang sesuai dengan filter.</p>
                  <button
                    type="button"
                    onClick={handleOpenCreateForm}
                    className="px-4 py-2 bg-primary text-white font-bold text-xs rounded-xl inline-flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Menu Ini</span>
                  </button>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const isOutOfStock = outOfStockIds.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      className="pt-2.5 flex items-center justify-between gap-3 group"
                    >
                      {/* Left: Thumbnail & Info */}
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-neutral-100 border border-neutral-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <h4 className="font-extrabold text-xs sm:text-sm text-neutral-900 truncate">
                              {item.name}
                            </h4>
                            {item.isBestSeller && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded text-[9px] font-bold">
                                🌟 Best Seller
                              </span>
                            )}
                            {item.isPromo && (
                              <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded text-[9px] font-bold">
                                🏷️ Promo
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-xs mt-0.5">
                            <span className="font-bold text-primary">
                              {formatIDR(item.price)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-neutral-400 line-through text-[10px]">
                                {formatIDR(item.originalPrice)}
                              </span>
                            )}
                            <span className="text-neutral-400">•</span>
                            <span className="capitalize text-neutral-500 text-[11px]">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        {/* Stock Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleItemStock(item.id)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition ${
                            isOutOfStock
                              ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                          title="Klik untuk mengubah status stok menu"
                        >
                          {isOutOfStock ? (
                            <>
                              <Ban className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Habis</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Tersedia</span>
                            </>
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditForm(item)}
                          className="p-1.5 rounded-xl bg-neutral-100 hover:bg-orange-100 text-neutral-700 hover:text-primary transition"
                          title="Edit nama, harga, atau foto menu"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete Button with inline confirmation */}
                        {confirmDeleteId === item.id ? (
                          <div className="flex items-center space-x-1 bg-rose-50 p-1 rounded-xl border border-rose-200">
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded-lg text-[10px] font-bold"
                            >
                              Hapus
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-0.5 text-neutral-500 hover:text-neutral-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-1.5 rounded-xl bg-neutral-100 hover:bg-rose-100 text-neutral-500 hover:text-rose-600 transition"
                            title="Hapus menu dari katalog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Footer Actions */}
            <div className="p-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleReset}
                className="text-neutral-500 hover:text-neutral-800 flex items-center space-x-1.5 transition"
                title="Reset kembali ke menu bawaan restoran asli"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke Menu Default</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
