import React, { useState, useRef } from 'react';
import {
  Package,
  Plus,
  Camera,
  Trash2,
  Sparkles,
  Upload,
  Check,
  X,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProduct } from '../types';

export const MyProductsView: React.FC = () => {
  const { userProducts, addUserProduct, deleteUserProduct } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Cleanser');
  const [activeIngredients, setActiveIngredients] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [frequency, setFrequency] = useState<'morning' | 'evening' | 'both' | 'as_needed'>('both');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsScanning(true);
      setScanStatus('Reading product label with fast AI model...');

      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        try {
          const res = await fetch('/api/gemini/extract-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64 })
          });

          if (!res.ok) throw new Error('Failed to extract product');
          const data = await res.json();

          setName(data.name || '');
          setBrand(data.brand || '');
          if (data.category) setCategory(data.category);
          if (data.activeIngredients) setActiveIngredients(data.activeIngredients.join(', '));
          if (data.ingredients) setIngredients(data.ingredients.join(', '));
          if (data.usageInstructions) setUsageInstructions(data.usageInstructions);
          if (data.frequency) setFrequency(data.frequency);

          setScanStatus('Successfully extracted product information!');
        } catch (err: any) {
          console.error('Extraction error:', err);
          setScanStatus('Could not read label clearly. Please type details manually.');
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (e) {
      setIsScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addUserProduct({
      name: name.trim(),
      brand: brand.trim() || 'Custom Brand',
      category,
      activeIngredients: activeIngredients.split(',').map((s) => s.trim()).filter(Boolean),
      ingredients: ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      usageInstructions: usageInstructions.trim() || 'Apply as directed on packaging',
      frequency
    });

    // Reset
    setName('');
    setBrand('');
    setActiveIngredients('');
    setIngredients('');
    setUsageInstructions('');
    setIsAddModalOpen(false);
  };

  const filtered = userProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Your Personal Shelf</span>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display">
            My Skincare Products
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Add products you already own so our AI recommendation engine incorporates them without conflict.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-teal-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Filter and stats */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            placeholder="Search your products..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <div className="text-xs text-stone-500 font-medium">
          {userProducts.length} product{userProducts.length === 1 ? '' : 's'} on your shelf
        </div>
      </div>

      {/* Product List */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-stone-300 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-stone-900 text-sm">No products on your shelf yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              You can scan your favorite cleanser, moisturizer, or serum bottle with your camera to auto-fill ingredients.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition"
          >
            Add Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-teal-500/50 transition group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {prod.category}
                  </span>
                  <button
                    onClick={() => deleteUserProduct(prod.id)}
                    className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{prod.name}</h3>
                  <p className="text-xs text-stone-500">{prod.brand}</p>
                </div>

                {prod.activeIngredients && prod.activeIngredients.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-semibold uppercase">Actives:</span>
                    <div className="flex flex-wrap gap-1">
                      {prod.activeIngredients.map((act, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded"
                        >
                          {act}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="capitalize">Frequency: {prod.frequency}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> In Routine
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 my-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-teal-600" />
                <h2 className="font-bold text-stone-900 text-base">Add Product to Your Shelf</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Auto-scan banner */}
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-teal-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Auto-Extract from Photo Label
                </div>
                <p className="text-[11px] text-teal-800">
                  Upload a photo of the product bottle or ingredients list.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" /> Scan Bottle
                  </>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageScan}
                className="hidden"
              />
            </div>

            {scanStatus && (
              <p className="text-xs font-semibold text-teal-800 bg-teal-100/50 p-2 rounded-lg">
                {scanStatus}
              </p>
            )}

            {/* Manual Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Snail 96 Mucin Power Essence"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. COSRX"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900 bg-white"
                  >
                    <option value="Cleanser">Cleanser</option>
                    <option value="Toner">Toner / Essence</option>
                    <option value="Serum">Serum</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="Sunscreen">Sunscreen</option>
                    <option value="Mask">Mask</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Active Ingredients (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hyaluronic Acid, Niacinamide, Salicylic Acid"
                  value={activeIngredients}
                  onChange={(e) => setActiveIngredients(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Application Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-stone-900 bg-white"
                >
                  <option value="morning">Morning Only</option>
                  <option value="evening">Evening Only</option>
                  <option value="both">Both Morning &amp; Evening</option>
                  <option value="as_needed">As Needed / Weekly</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
