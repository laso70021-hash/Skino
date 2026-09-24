import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Check,
  Clock,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CatalogProduct } from '../types';

export const CatalogShopView: React.FC = () => {
  const {
    catalogProducts,
    addUserProduct,
    userProducts,
    formatPrice
  } = useApp();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [skinTypeFilter, setSkinTypeFilter] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const handleAddShelf = async (product: CatalogProduct) => {
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
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Vetted Formulations</span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display">
            Approved Product Catalog
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Dermatologically curated cosmetic catalog grounded with exact active concentrations and wait intervals.
          </p>
        </div>

        <div className="text-xs text-stone-500 font-semibold">
          {filtered.length} products available
        </div>
      </div>

      {/* Filter Bar */}
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
            <option value="Combination">Combination</option>
            <option value="Oily">Oily</option>
            <option value="Dry">Dry</option>
            <option value="Sensitive">Sensitive</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((product) => {
          const isAdded = addedIds.includes(product.id);
          const alreadyOnShelf = userProducts.some(
            (up) => up.name.toLowerCase() === product.name.toLowerCase()
          );

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div
                  className="aspect-square bg-stone-100 overflow-hidden relative cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-stone-900/80 backdrop-blur text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {product.category}
                  </div>
                  {product.waitIntervalSeconds > 0 && (
                    <div className="absolute top-2.5 right-2.5 bg-teal-600 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {product.waitIntervalSeconds}s wait
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="text-[11px] font-bold uppercase text-stone-400">
                    {product.brand}
                  </div>
                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-stone-900 text-sm hover:text-teal-700 cursor-pointer line-clamp-1"
                  >
                    {product.name}
                  </h3>

                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {product.activeIngredients.slice(0, 2).map((act, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 font-medium"
                      >
                        {act}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between gap-2 mt-2">
                <div className="font-extrabold text-stone-900 text-xs font-mono">
                  {formatPrice(product.priceTZS, product.priceUSD)}
                </div>

                <button
                  onClick={() => handleAddShelf(product)}
                  disabled={alreadyOnShelf || isAdded}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    alreadyOnShelf || isAdded
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-stone-900 hover:bg-stone-800 text-white'
                  }`}
                >
                  {alreadyOnShelf || isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Added
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Shelf
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 sm:p-7 my-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedProduct.imageUrl}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase text-teal-600 tracking-wider">
                    {selectedProduct.brand} · {selectedProduct.category}
                  </span>
                  <h2 className="text-base font-bold text-stone-900">{selectedProduct.name}</h2>
                  <div className="text-xs font-mono font-bold text-stone-700">
                    {formatPrice(selectedProduct.priceTZS, selectedProduct.priceUSD)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
                <strong className="text-stone-800 block">Active Ingredients:</strong>
                <p className="text-stone-600">{selectedProduct.activeIngredients.join(', ')}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700">
                  <span className="font-semibold block">Application Duration:</span>
                  <span className="font-mono">{selectedProduct.durationSeconds} seconds</span>
                </div>
                <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-700">
                  <span className="font-semibold block">Absorption Interval:</span>
                  <span className="font-mono">{selectedProduct.waitIntervalSeconds} seconds</span>
                </div>
              </div>

              {selectedProduct.avoidCombiningWith.length > 0 && (
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  <strong>Contraindication / Avoid mixing with:</strong>{' '}
                  {selectedProduct.avoidCombiningWith.join(', ')}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-lg text-stone-600 font-semibold text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAddShelf(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
              >
                + Add to My Shelf
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
