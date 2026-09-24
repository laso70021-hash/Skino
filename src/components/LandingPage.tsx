import React from 'react';
import {
  Sparkles,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HeartPulse,
  Mail,
  Calendar,
  Lock,
  ArrowRight,
  Database,
  Layers,
  Check,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LandingPageProps {
  onStartJourney?: () => void;
  onOpenAuth?: () => void;
  onStartScan?: () => void;
  onLearnMore?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartJourney,
  onOpenAuth,
  onStartScan,
  onLearnMore
}) => {
  const { setActiveTab, formatPrice } = useApp();

  const handleStart = () => {
    if (onStartScan) onStartScan();
    else if (onStartJourney) onStartJourney();
    else setActiveTab('dashboard');
  };

  const scrollToHowItWorks = () => {
    if (onLearnMore) {
      onLearnMore();
    } else {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-100/60 via-stone-50/20 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold tracking-wide shadow-sm animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Next-Gen Computer Vision &amp; Wellness Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight font-serif-display leading-[1.15]">
              Your Skin. Your Data. <br />
              <span className="bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Your Personalized Routine.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-2xl mx-auto">
              AI-powered skin analysis and personalized skincare &amp; wellness plans designed around your skin, products, lifestyle, and goals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Start My Skin Journey</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 font-semibold text-sm border border-stone-200 shadow-sm transition"
              >
                How It Works
              </button>
            </div>

            {/* Trust and privacy badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Vetted Cosmetic Ingredients
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-teal-600" /> Privacy-First Facial Scans
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-600" /> Gmail Routine Reminders
              </span>
            </div>
          </div>

          {/* Interactive Preview Card Mockup */}
          <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-white border border-stone-200/80 shadow-2xl overflow-hidden p-6 sm:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Left: Scan Preview */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-inner bg-stone-900 aspect-4/3 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80"
                    alt="Facial scan visualization"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 border-2 border-teal-400/40 rounded-xl pointer-events-none" />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-mono text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    CV Feature Extraction
                  </div>
                  <div className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] text-white font-bold border border-white/10">
                    Skin Health Score: 74%
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/60">
                    <div className="text-[10px] text-stone-500 uppercase font-semibold">Blemishes</div>
                    <div className="text-sm font-bold text-stone-800">Moderate</div>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/60">
                    <div className="text-[10px] text-stone-500 uppercase font-semibold">Hydration</div>
                    <div className="text-sm font-bold text-teal-600">71%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-stone-50 border border-stone-200/60">
                    <div className="text-[10px] text-stone-500 uppercase font-semibold">Oil Balance</div>
                    <div className="text-sm font-bold text-stone-800">68%</div>
                  </div>
                </div>
              </div>

              {/* Right: Exact Routine with Intervals */}
              <div className="w-full md:w-1/2 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Your Morning Schedule</span>
                    <h3 className="text-base font-bold text-stone-900">Exact Layering &amp; Interval Order</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    07:00 AM
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">CeraVe Foaming Cleanser</span>
                        <span className="text-[11px] text-stone-500">Duration: 45s</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">Gentle circular motion with lukewarm water</p>
                      <div className="mt-1 text-[10px] font-semibold text-teal-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Wait: 30 seconds before next step
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">The Ordinary Niacinamide 10% + Zinc 1%</span>
                        <span className="text-[11px] text-stone-500">Duration: 30s</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">Apply thin layer to regulate sebum &amp; calm redness</p>
                      <div className="mt-1 text-[10px] font-semibold text-teal-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Wait: 1 minute before moisturizer
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200/60 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900">EltaMD UV Clear SPF 46</span>
                        <span className="text-[11px] text-stone-500">Duration: 45s</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">Essential daytime broad-spectrum defense</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onStartJourney}
                  className="w-full py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition"
                >
                  Generate My Custom Routine →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Process Section */}
      <section id="how-it-works" className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">The Science &amp; Flow</span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight font-serif-display mt-1">
              How Your Skin Journey Works
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              From high-precision visual feature extraction to structured product database reasoning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3 relative group hover:border-teal-500 transition">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center text-sm">
                1
              </div>
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-teal-600" /> 1. Scan
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Take or upload natural photos (Front, Left, Right). We guide you with optimal lighting, no filters, and camera distance.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3 relative group hover:border-teal-500 transition">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center text-sm">
                2
              </div>
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" /> 2. Analyze
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Computer vision estimates visible characteristics: blemishes, redness, dark spots, sebum balance, and texture with confidence scores.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3 relative group hover:border-teal-500 transition">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center text-sm">
                3
              </div>
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                <Database className="w-4 h-4 text-teal-600" /> 3. Personalize
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                AI cross-references the admin product database with your sensitivities and existing routine, calculating safety &amp; compatibility.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3 relative group hover:border-teal-500 transition">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center text-sm">
                4
              </div>
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" /> 4. Follow
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Interactive routine runner with step timers and wait intervals, integrated with calendar events and push reminders.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3 relative group hover:border-teal-500 transition">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 font-extrabold flex items-center justify-center text-sm">
                5
              </div>
              <h3 className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" /> 5. Track
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Observe quantifiable score progression over time, compare Before/Now scans, and receive weekly email digests via Gmail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Product Database & Safety Rule Spotlight */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">Database Grounding</span>
              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight font-serif-display">
                No Hallucinated Products. <br />
                Strict Ingredient Compatibility.
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Unlike generic chatbots that recommend random products from the internet, SkinAI queries an approved catalog curated by administrators. Every product contains structured active ingredients, wait interval requirements, and contraindication flags.
              </p>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">Safety-Aware Scheduling:</span> If two products contain potentially irritating actives (like Retinol and 2% BHA), the recommendation engine separates them across alternating nights.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">Respects Your Own Shelf:</span> Add your existing cleanser or moisturizer; the AI integrates them into your routine instead of forcing replacement.
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">Traceable Justifications:</span> See exactly why each product was chosen based on your observed sebum, redness, or blemish scores.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onStartJourney}
                  className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition shadow-md shadow-teal-600/20"
                >
                  Analyze My Skin Now →
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-700">Safety &amp; Compatibility Engine Check</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                  PASSED
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  Compatibility Notice Detected
                </div>
                <p className="text-[11px] text-amber-800">
                  "Azelaic Acid 10% and Retinol 0.3% are active in your routine. To prevent barrier irritation, Azelaic Acid is scheduled for morning/evening buffers, and Retinoid is limited to 3 nights/week."
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <span className="font-bold text-stone-800">Important Cosmetic Boundary:</span>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  "This platform provides cosmetic guidance, not a medical diagnosis. Consider consulting a qualified dermatologist if symptoms are severe, persistent, painful, infected, or worsening."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Subscription Tiers */}
      <section className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Subscriptions</span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight font-serif-display mt-1">
              Choose Your Wellness Plan
            </h2>
            <p className="text-stone-600 text-sm mt-2">
              Transparent plans with real personalization, push notifications, and high-thinking AI coaching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* START PLAN */}
            <div className="p-7 rounded-2xl bg-stone-50 border-2 border-stone-200 flex flex-col justify-between hover:border-stone-300 transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                    START PLAN
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-stone-900">{formatPrice(20000, 8)}</span>
                    <span className="text-xs text-stone-500"> / month</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600">
                  Ideal foundation for routine consistency, cosmetic skin scans, and daily reminders.
                </p>

                <ul className="space-y-2.5 text-xs text-stone-700 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Personal Account &amp; Profile Setup
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    AI Computer-Vision Skin Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Personalized Product Recommendations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Morning &amp; Evening Routine with Intervals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Basic Nutrition &amp; Hydration Schedule
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Calendar &amp; Push Reminders
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Skin Health Score Progress Tracking
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleStart}
                  className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition"
                >
                  Start with START Plan
                </button>
              </div>
            </div>

            {/* HIGH PLAN */}
            <div className="p-7 rounded-2xl bg-gradient-to-b from-teal-50/70 to-white border-2 border-teal-500 flex flex-col justify-between relative shadow-xl shadow-teal-500/10">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm">
                Most Comprehensive
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-600 text-white">
                    HIGH PLAN
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-stone-900">{formatPrice(45000, 18)}</span>
                    <span className="text-xs text-stone-500"> / month</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600">
                  Full deep personalization: Multi-angle ML scans, High-Thinking AI Coach, and Custom Schedule Reorganization.
                </p>

                <ul className="space-y-2.5 text-xs text-stone-700 pt-2">
                  <li className="flex items-center gap-2 font-semibold text-stone-900">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Everything in START Plan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Multi-Angle Scan (Front, Left, Right)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    High-Thinking AI Coach (Gemini Pro)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Daily Schedule Reorganizer (Work, Gym, Sleep)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    AI Review of User's Existing Products
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Deep Active Ingredient Compatibility Engine
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    Gmail Routine &amp; Progress Digest Sync
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleStart}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/25 transition"
                >
                  Start with HIGH Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Guarantee Banner */}
      <section className="py-12 bg-stone-100 border-t border-stone-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Your Facial Photos Belong To You</h3>
          <p className="text-xs text-stone-600 max-w-xl mx-auto leading-relaxed">
            “Your photos are used to generate your personalized analysis. You control whether previous scans are retained.”
            You can delete individual scans, wipe all historical photos, or disable progress-photo storage at any time with a single tap.
          </p>
        </div>
      </section>
    </div>
  );
};
