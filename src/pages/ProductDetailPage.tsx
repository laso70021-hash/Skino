import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  Plus,
  ArrowRight,
  ShieldCheck,
  Droplets,
  Layers,
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackButton } from '../components/common/BackButton';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    catalogProducts,
    addUserProduct,
    userProducts,
    formatPrice,
    currency
  } = useApp();

  const [isAdded, setIsAdded] = useState(false);
  const [orderNotice, setOrderNotice] = useState(false);

  const product = catalogProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-4">
        <BackButton fallback="/products" label="Back to Products" />
        <div className="p-8 bg-white rounded-2xl border border-stone-200 shadow-sm mt-4">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-stone-900">Product Not Found</h2>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            The requested cosmetic formulation could not be located in the catalog.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="mt-5 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
          >
            Browse All Products
          </button>
        </div>
      </div>
    );
  }

  const alreadyOnShelf = userProducts.some(
    (up) => up.name.toLowerCase() === product.name.toLowerCase()
  );

  const handleAddToShelf = async () => {
    await addUserProduct({
      name: product.name,
      brand: product.brand,
      category: product.category,
      activeIngredients: product.activeIngredients,
      ingredients: product.ingredients,
      usageInstructions: product.usageInstructions,
      frequency: product.frequency
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  const handleOrder = () => {
    setOrderNotice(true);
    setTimeout(() => setOrderNotice(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <BackButton fallback="/products" label="Back to Products" />
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <span>Products</span>
          <span>/</span>
          <span className="text-stone-700 font-medium capitalize">{product.category}</span>
        </div>
      </div>

      {/* Main Product Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Product Photo */}
        <div className="md:col-span-5 bg-stone-50 p-6 sm:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-stone-200">
          <div className="relative w-full aspect-square max-w-[280px] rounded-xl overflow-hidden shadow-sm bg-white border border-stone-100">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-600 text-white shadow-xs">
              {product.category}
            </span>
          </div>

          <div className="mt-4 text-center">
            <span className="text-xs uppercase font-bold tracking-widest text-stone-400">
              {product.brand}
            </span>
            <div className="mt-1 text-lg font-extrabold text-stone-900">
              {formatPrice(product.priceTZS, product.priceUSD)}
            </div>
            <span className="text-[10px] text-stone-400">Available in {currency}</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-teal-600 uppercase tracking-wide">
                Dermatologically Approved
              </span>
              <h1 className="text-2xl font-bold text-stone-900 font-serif-display mt-0.5">
                {product.name}
              </h1>
              <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* AI Recommendation Reason */}
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-800">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>AI Recommendation Rationale</span>
              </div>
              <p className="text-[11px] text-teal-900 leading-relaxed">
                {product.whyRecommended}
              </p>
            </div>

            {/* Timing & Intervals */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Application Duration</span>
                <span className="font-mono font-bold text-stone-800 text-sm">{product.durationSeconds}s</span>
                <p className="text-[10px] text-stone-500">Gentle massage or pat</p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Wait Interval</span>
                <span className="font-mono font-bold text-teal-700 text-sm">{product.waitIntervalSeconds}s</span>
                <p className="text-[10px] text-stone-500">Before layering next step</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleAddToShelf}
                className={`w-full sm:flex-1 py-3.5 px-6 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                  isAdded || alreadyOnShelf
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-stone-950 hover:bg-stone-800 text-white shadow-stone-950/20 active:scale-98'
                }`}
              >
                {isAdded || alreadyOnShelf ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Added to Routine Shelf</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>+ Add to Routine Shelf</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOrder}
                className="w-full sm:w-auto py-3.5 px-6 rounded-full border border-stone-200 bg-white hover:bg-stone-100 text-stone-900 font-bold text-xs transition shadow-2xs cursor-pointer"
              >
                Order / Buy Now
              </button>
            </div>

            {orderNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Formulation added to your delivery queue. We will confirm delivery in Tanzania & East Africa.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Formulation Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingredients & Compatibility */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-600" />
            Active Ingredients &amp; Formulation
          </h2>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">Key Actives:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.activeIngredients.map((act, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200"
                >
                  {act}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">Full INCI Breakdown:</span>
            <p className="text-xs text-stone-600 leading-relaxed font-mono">
              {product.ingredients.join(', ')}
            </p>
          </div>

          {product.avoidCombiningWith && product.avoidCombiningWith.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Active Contraindications</span>
              </div>
              <p className="text-[11px] text-amber-800">
                Do not pair in the same evening step with: <strong>{product.avoidCombiningWith.join(', ')}</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Suitable Skin Types & Concerns */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            Compatibility &amp; Application Guidelines
          </h2>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">Target Skin Types:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.skinTypes.map((st, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200"
                >
                  {st}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">Target Skin Concerns:</span>
            <div className="flex flex-wrap gap-1.5">
              {product.concerns.map((c, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wide">Usage Instructions:</span>
            <p className="text-xs text-stone-600 leading-relaxed">
              {product.usageInstructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
