import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Check,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  Package,
  Camera,
  Trash2,
  ArrowRight,
  RefreshCw,
  Upload,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';
import { CatalogProduct } from '../types';

export const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    catalogProducts,
    addUserProduct,
    deleteUserProduct,
    userProducts,
    formatPrice,
    currency
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'shelf'>('catalog');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [skinTypeFilter, setSkinTypeFilter] = useState('All');
  const [addedIds, setAddedIds] = useState<string[]>([]);

  // My Shelf Scanner state
  const [shelfText, setShelfText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddShelf = async (product: CatalogProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await addUserProduct({
      name: product.name,
      brand: product.brand,
      category: product.category,
      activeIngredients: product.activeIngredients,
      ingredients: product.ingredients,
      usageInstructions: product.usageInstructions,
      frequency: product.frequency
    });
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 2500);
  };

  const handleScanLabel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setIsExtracting(true);
      setExtractError(null);
      try {
        const res = await fetch('/api/gemini/extract-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || 'image/jpeg'
          })
        });
        if (!res.ok) throw new Error('Extraction failed');
        const extracted = await res.json();
        await addUserProduct({
          name: extracted.name || 'Extracted Product',
          brand: extracted.brand || 'Personal Formulation',
          category: extracted.category || 'Treatment',
          activeIngredients: extracted.activeIngredients || [],
          ingredients: extracted.ingredients || [],
          usageInstructions: extracted.usageInstructions || 'Apply to clean skin.',
          frequency: extracted.frequency || 'evening'
        });
      } catch (err: any) {
        console.error(err);
        setExtractError('Could not parse label image. Try manual text entry.');
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddFromText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shelfText.trim()) return;
    setIsExtracting(true);
    setExtractError(null);
    try {
      const res = await fetch('/api/gemini/extract-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textInput: shelfText
        })
      });
      if (!res.ok) throw new Error('Text extraction failed');
      const extracted = await res.json();
      await addUserProduct({
        name: extracted.name || shelfText,
        brand: extracted.brand || 'Personal Formulation',
        category: extracted.category || 'Serum',
        activeIngredients: extracted.activeIngredients || [],
        ingredients: extracted.ingredients || [],
        usageInstructions: extracted.usageInstructions || 'Apply once daily.',
        frequency: extracted.frequency || 'evening'
      });
      setShelfText('');
    } catch (err: any) {
      console.error(err);
      setExtractError('Could not process formulation text.');
    } finally {
      setIsExtracting(false);
    }
  };

  const filtered = catalogProducts.filter((p) => {
    if (!p.isActive) return false;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.activeIngredients.some((a) => a.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesSkin = skinTypeFilter === 'All' || p.skinTypes.includes(skinTypeFilter as any);
    return matchesSearch && matchesCategory && matchesSkin;
  });

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/home" label="Back to Home" />
        <div className="text-xs text-stone-500 font-semibold">
          {activeTab === 'catalog' ? `${filtered.length} products listed` : `${userProducts.length} items on your shelf`}
        </div>
      </div>

      {/* Page Title & Sub-tabs */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Formulation &amp; Shelf Directory
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
            Products
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Browse our dermatologically approved catalog or register products on your personal bathroom shelf.
          </p>
        </div>

        {/* Sub-page Navigation Tabs */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'catalog'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Product Catalog ({catalogProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('shelf')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'shelf'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Shelf ({userProducts.length})
          </button>
        </div>
      </div>

      {/* PRODUCT CATALOG SUB-PAGE */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search products or active ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="All">All Categories</option>
                <option value="Cleanser">Cleanser</option>
                <option value="Toner">Toner</option>
                <option value="Serum">Serum</option>
                <option value="Treatment">Treatment</option>
                <option value="Moisturizer">Moisturizer</option>
                <option value="Sunscreen">Sunscreen</option>
              </select>

              <select
                value={skinTypeFilter}
                onChange={(e) => setSkinTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-800 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="All">All Skin Types</option>
                <option value="Oily">Oily</option>
                <option value="Dry">Dry</option>
                <option value="Combination">Combination</option>
                <option value="Sensitive">Sensitive</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid - CLICKING ANY PRODUCT OPENS /products/:id FULL ROUTE! */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => {
              const isAdded = addedIds.includes(product.id);
              const alreadyOnShelf = userProducts.some(
                (up) => up.name.toLowerCase() === product.name.toLowerCase()
              );

              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-white rounded-[28px] border border-stone-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-stone-400 transition flex flex-col justify-between overflow-hidden cursor-pointer group p-4"
                >
                  <div>
                    {/* Header with Price & 50% Tag */}
                    <div className="flex justify-between items-start mb-2 px-1">
                      <div>
                        <div className="text-xl font-extrabold text-stone-950">
                          {formatPrice(product.priceTZS, product.priceUSD)}
                        </div>
                        <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                          Best Skin care Product
                        </p>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px] border border-stone-200/60">
                        50%
                      </span>
                    </div>

                    {/* Image Container with Soft Botanical Treatment */}
                    <div className="relative aspect-16/11 w-full bg-stone-50 rounded-[20px] overflow-hidden my-2 border border-stone-100">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-stone-800 backdrop-blur shadow-2xs border border-white/60">
                        {product.category}
                      </span>
                    </div>

                    {/* Product Name & Brand */}
                    <div className="px-1 py-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-stone-950 text-sm group-hover:text-teal-700 transition line-clamp-1">
                          {product.name}
                        </h3>
                        <span className="text-[10px] font-semibold text-stone-400">
                          {product.brand}
                        </span>
                      </div>

                      {/* Tags Row matching Attachment 2 (Energy, Skin Health, Essential) */}
                      <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-semibold">
                          Energy
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-semibold">
                          Skin Health
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-semibold">
                          Essential
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buy Now Pill Button matching Attachment 2 */}
                  <div className="pt-3 mt-2 border-t border-stone-100/80 flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product.id}`);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs tracking-wide transition shadow-xs flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <span>Buy now</span>
                    </button>

                    <button
                      onClick={(e) => handleAddShelf(product, e)}
                      className={`p-2.5 rounded-full transition text-xs font-semibold flex items-center justify-center ${
                        isAdded || alreadyOnShelf
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                      title={isAdded || alreadyOnShelf ? 'On Routine Shelf' : 'Add to Shelf'}
                    >
                      {isAdded || alreadyOnShelf ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MY SHELF SUB-PAGE */}
      {activeTab === 'shelf' && (
        <div className="space-y-6">
          {/* Quick Scanner Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <Camera className="w-4 h-4 text-teal-600" />
                  Fast Bottle Label Scanner
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Snap a photo of any bottle label or enter its name to auto-extract active ingredients with Gemini.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Scan Bottle Label</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleScanLabel}
                />
              </div>
            </div>

            {/* Quick Text Input */}
            <form onSubmit={handleAddFromText} className="flex gap-2">
              <input
                type="text"
                placeholder="Or type brand and product name (e.g. La Roche-Posay Effaclar Serum)..."
                value={shelfText}
                onChange={(e) => setShelfText(e.target.value)}
                className="flex-1 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isExtracting || !shelfText.trim()}
                className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {isExtracting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>Add</span>
              </button>
            </form>

            {extractError && (
              <p className="text-xs text-rose-600">{extractError}</p>
            )}
          </div>

          {/* User's Shelf Products List */}
          <div className="space-y-4">
            <h3 className="font-bold text-stone-900 text-base">Your Active Bathroom Shelf</h3>

            {userProducts.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-400 space-y-2">
                <Package className="w-10 h-10 mx-auto text-stone-300" />
                <p className="text-xs">Your shelf is empty. Add products from the catalog above or scan your own bottles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          {p.category}
                        </span>
                        <button
                          onClick={() => deleteUserProduct(p.id)}
                          className="text-stone-300 hover:text-rose-600 transition"
                          title="Remove from shelf"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm">{p.name}</h4>
                      <p className="text-xs text-stone-500">{p.brand}</p>

                      {p.activeIngredients && p.activeIngredients.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.activeIngredients.map((act, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-medium"
                            >
                              {act}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                      <span className="capitalize">{p.frequency} Routine</span>
                      <span>Added {new Date(p.addedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
