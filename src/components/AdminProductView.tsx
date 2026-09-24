import React, { useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  X,
  Sliders,
  DollarSign,
  ShieldCheck,
  Cpu,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CatalogProduct } from '../types';

export const AdminProductView: React.FC = () => {
  const {
    catalogProducts,
    addCatalogProduct,
    updateCatalogProduct,
    deleteCatalogProduct,
    formatPrice
  } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'prompts' | 'monitoring'>('catalog');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<CatalogProduct['category']>('Cleanser');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [priceTZS, setPriceTZS] = useState(45000);
  const [priceUSD, setPriceUSD] = useState(17);
  const [stock, setStock] = useState(50);
  const [sku, setSku] = useState('');
  const [skinTypes, setSkinTypes] = useState<string[]>(['Combination', 'Oily']);
  const [concerns, setConcerns] = useState<string[]>(['Oiliness', 'Blemishes']);
  const [activeIngredients, setActiveIngredients] = useState('');
  const [waitIntervalSeconds, setWaitIntervalSeconds] = useState(30);
  const [durationSeconds, setDurationSeconds] = useState(45);
  const [frequency, setFrequency] = useState<'morning' | 'evening' | 'both'>('both');
  const [avoidCombiningWith, setAvoidCombiningWith] = useState('');
  const [contraindications, setContraindications] = useState('');

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setBrand('');
    setCategory('Cleanser');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80');
    setPriceTZS(40000);
    setPriceUSD(15);
    setStock(40);
    setSku('SKU-' + Date.now().toString().slice(-4));
    setSkinTypes(['Combination', 'Normal']);
    setConcerns(['Blemishes']);
    setActiveIngredients('Niacinamide, Ceramides');
    setWaitIntervalSeconds(30);
    setDurationSeconds(45);
    setFrequency('both');
    setAvoidCombiningWith('');
    setContraindications('For cosmetic external use.');
    setIsModalOpen(true);
  };

  const openEditModal = (prod: CatalogProduct) => {
    setEditingProduct(prod);
    setName(prod.name);
    setBrand(prod.brand);
    setCategory(prod.category);
    setDescription(prod.description);
    setImageUrl(prod.imageUrl);
    setPriceTZS(prod.priceTZS);
    setPriceUSD(prod.priceUSD);
    setStock(prod.stock);
    setSku(prod.sku);
    setSkinTypes(prod.skinTypes);
    setConcerns(prod.concerns);
    setActiveIngredients(prod.activeIngredients.join(', '));
    setWaitIntervalSeconds(prod.waitIntervalSeconds);
    setDurationSeconds(prod.durationSeconds);
    setFrequency(prod.frequency);
    setAvoidCombiningWith(prod.avoidCombiningWith.join(', '));
    setContraindications(prod.contraindications);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      name: name.trim(),
      brand: brand.trim(),
      category,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      priceTZS: Number(priceTZS),
      priceUSD: Number(priceUSD),
      stock: Number(stock),
      sku: sku.trim(),
      skinTypes: skinTypes as any,
      concerns: concerns as any,
      ingredients: ['Water', ...activeIngredients.split(',').map((s) => s.trim())],
      activeIngredients: activeIngredients.split(',').map((s) => s.trim()).filter(Boolean),
      usageInstructions: description.trim(),
      applicationArea: 'Face and neck',
      frequency,
      waitIntervalSeconds: Number(waitIntervalSeconds),
      durationSeconds: Number(durationSeconds),
      potentialIrritants: [],
      avoidCombiningWith: avoidCombiningWith.split(',').map((s) => s.trim()).filter(Boolean),
      compatibleWith: ['Hyaluronic Acid', 'Ceramides'],
      contraindications: contraindications.trim(),
      isActive: true
    };

    if (editingProduct) {
      await updateCatalogProduct(editingProduct.id, productPayload);
    } else {
      await addCatalogProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const filtered = catalogProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.activeIngredients.some((a) => a.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Admin Control Room</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              Verified Catalog
            </span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
            Cosmetic Catalog &amp; AI Engine Configuration
          </h1>
          <p className="text-xs text-stone-500">
            Products approved here form the strictly grounded candidate pool for all AI recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-stone-100 p-1 rounded-xl flex items-center text-xs font-bold">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'catalog' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Catalog ({catalogProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'prompts' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              AI Prompt Rules
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'monitoring' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500'
              }`}
            >
              Model Monitoring
            </button>
          </div>

          {activeTab === 'catalog' && (
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search products or active ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
              {['All', 'Cleanser', 'Toner', 'Serum', 'Treatment', 'Moisturizer', 'Sunscreen'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Product &amp; Brand</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Actives</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Active Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {filtered.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/80 transition">
                      <td className="p-3.5 font-medium">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.imageUrl}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover bg-stone-100"
                          />
                          <div>
                            <div className="font-bold text-stone-900">{prod.name}</div>
                            <div className="text-[11px] text-stone-500">{prod.brand} · SKU: {prod.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold text-[10px]">
                          {prod.category}
                        </span>
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {prod.activeIngredients.map((act, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-purple-50 text-purple-700 font-medium px-1.5 py-0.2 rounded"
                            >
                              {act}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3.5 font-bold font-mono">
                        {formatPrice(prod.priceTZS, prod.priceUSD)}
                      </td>
                      <td className="p-3.5 font-mono">
                        <span
                          className={`font-bold ${prod.stock < 10 ? 'text-rose-600' : 'text-stone-700'}`}
                        >
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => updateCatalogProduct(prod.id, { isActive: !prod.isActive })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                            prod.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                          }`}
                        >
                          {prod.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCatalogProduct(prod.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'prompts' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            Active AI Recommendation Prompts &amp; Safety Guardrails
          </h3>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 font-mono text-[11px] leading-relaxed text-stone-800 space-y-3">
            <p><strong>GROUNDING RULE #1:</strong> The recommendation engine MUST exclusively suggest items from the Catalog Products collection.</p>
            <p><strong>SAFETY RULE #2:</strong> Disallow concurrent Retinol + High BHA/AHA in the same evening step. Enforce alternating evenings.</p>
            <p><strong>SAFETY RULE #3:</strong> Mandatory daytime broad-spectrum SPF 50 recommendation for all morning routines.</p>
            <p><strong>TRACEABILITY RULE #4:</strong> Every routine step must include "whyRecommended" citing the specific product catalog profile (e.g. "Selected because its catalog profile contains Niacinamide and Ceramides compatible with combination skin with moderate oiliness").</p>
          </div>
        </div>
      )}

      {activeTab === 'monitoring' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            AI Model Telemetry &amp; Request Latency
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-500 font-medium">Vision Engine</span>
              <div className="font-bold text-stone-900 text-sm">gemini-3.5-flash</div>
              <p className="text-[11px] text-stone-500">Average response: 1.2s</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-500 font-medium">High Thinking Coach</span>
              <div className="font-bold text-stone-900 text-sm">gemini-3.1-pro-preview</div>
              <p className="text-[11px] text-stone-500">Thinking Level: HIGH</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="text-stone-500 font-medium">Fast Label OCR</span>
              <div className="font-bold text-stone-900 text-sm">gemini-3.1-flash-lite</div>
              <p className="text-[11px] text-stone-500">Average response: 0.6s</p>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl p-6 my-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="font-bold text-stone-900 text-base">
                {editingProduct ? 'Edit Catalog Product' : 'Add Product to Vetted Catalog'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900 bg-white"
                  >
                    <option value="Cleanser">Cleanser</option>
                    <option value="Toner">Toner</option>
                    <option value="Serum">Serum</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="Sunscreen">Sunscreen</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Price TZS</label>
                  <input
                    type="number"
                    value={priceTZS}
                    onChange={(e) => setPriceTZS(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Active Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={activeIngredients}
                  onChange={(e) => setActiveIngredients(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Wait Interval (Seconds)</label>
                  <input
                    type="number"
                    value={waitIntervalSeconds}
                    onChange={(e) => setWaitIntervalSeconds(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Avoid Combining With</label>
                <input
                  type="text"
                  placeholder="e.g. Pure Vitamin C at same time, Retinoids on same night"
                  value={avoidCombiningWith}
                  onChange={(e) => setAvoidCombiningWith(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description &amp; Usage</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-900"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  {editingProduct ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
