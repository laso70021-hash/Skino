import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Sparkles,
  Check,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBSCRIPTION_PLANS } from '../data/subscriptionPlans';
import { SubscriptionTier } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose
}) => {
  const { userProfile, setSubscriptionTier, formatPrice } = useApp();

  if (!isOpen) return null;

  const rawTier = userProfile?.subscriptionTier || 'silver';
  const currentTier: SubscriptionTier =
    rawTier === 'start' ? 'bronze' : rawTier === 'high' ? 'gold' : rawTier;

  const handleSelectTier = async (tier: SubscriptionTier) => {
    await setSubscriptionTier(tier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-stone-200 shadow-2xl p-6 sm:p-8 my-6 space-y-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Intelligence Tiers
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-950 font-serif-display mt-0.5">
              Choose Your Skina Intelligence Tier
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 6 Plans Grid in Modal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = currentTier === plan.id;
            const price = formatPrice(plan.priceTZS, plan.priceUSD);

            return (
              <div
                key={plan.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-stone-950 text-white border-stone-950 shadow-md ring-2 ring-teal-500/40'
                    : plan.highlighted
                    ? 'bg-white text-stone-900 border-teal-500 shadow-xs'
                    : 'bg-[#faf8f5] text-stone-900 border-stone-200'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-base font-serif-display ${isCurrent ? 'text-white' : 'text-stone-950'}`}>
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isCurrent ? 'bg-teal-400 text-stone-950' : 'bg-teal-50 text-teal-800 border border-teal-200'
                      }`}>
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-bold font-serif-display ${isCurrent ? 'text-white' : 'text-stone-900'}`}>
                      {plan.priceUSD === 0 ? 'Free' : price}
                    </span>
                    {plan.priceUSD > 0 && (
                      <span className={`text-[10px] ${isCurrent ? 'text-stone-400' : 'text-stone-500'}`}>
                        /mo
                      </span>
                    )}
                  </div>

                  <p className={`text-[11px] leading-relaxed line-clamp-2 ${isCurrent ? 'text-stone-300' : 'text-stone-600'}`}>
                    {plan.tagline}
                  </p>

                  <ul className="space-y-1.5 pt-2 border-t border-stone-200/40 text-[11px]">
                    {plan.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className={`w-3 h-3 shrink-0 mt-0.5 ${isCurrent ? 'text-teal-300' : 'text-teal-600'}`} />
                        <span className={isCurrent ? 'text-stone-200' : 'text-stone-700'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-200/40">
                  <button
                    disabled={isCurrent}
                    onClick={() => handleSelectTier(plan.id)}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                      isCurrent
                        ? 'bg-white/10 text-white cursor-default'
                        : plan.highlighted
                        ? 'bg-teal-600 hover:bg-teal-500 text-white'
                        : 'bg-white hover:bg-stone-100 text-stone-900 border border-stone-300'
                    }`}
                  >
                    {isCurrent ? 'Active Plan' : `Switch to ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
