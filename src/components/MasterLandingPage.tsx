import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/images/hero.jpeg.jpg';
import {
  Sparkles,
  Camera,
  CheckCircle2,
  Lock,
  ArrowRight,
  Check,
  Droplets,
  AlertCircle,
  Bot,
  Scan,
  Search,
  Plus,
  Info,
  Calendar,
  Layers,
  HeartPulse,
  Sun,
  Moon,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MasterLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    formatPrice,
    currency,
    setCurrency,
    catalogProducts,
    addUserProduct,
    loginDemoUser,
    isDarkMode,
    setIsDarkMode
  } = useApp();

  // Hero AI scan animation phase
  const [scanStep, setScanStep] = useState<number>(1);
  const [scanLineY, setScanLineY] = useState<number>(20);
  const [scanDirection, setScanDirection] = useState<'down' | 'up'>('down');

  // Interactive states
  const [routineTab, setRoutineTab] = useState<'morning' | 'evening'>(() => isDarkMode ? 'evening' : 'morning');

  useEffect(() => {
    setRoutineTab(isDarkMode ? 'evening' : 'morning');
  }, [isDarkMode]);
  const [photoStorageChoice, setPhotoStorageChoice] = useState<'keep' | 'discard'>('keep');
  const [progressToggle, setProgressToggle] = useState<boolean>(true);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [selectedAngle, setSelectedAngle] = useState<'front' | 'left' | 'right'>('front');

  // Gentle looping scan animation
  useEffect(() => {
    const timer1 = setTimeout(() => setScanStep(2), 600);
    const timer2 = setTimeout(() => setScanStep(3), 1300);
    const timer3 = setTimeout(() => setScanStep(4), 2000);
    const timer4 = setTimeout(() => setScanStep(5), 3600);
    const timer5 = setTimeout(() => setScanStep(6), 5200);

    const resetTimer = setTimeout(() => {
      setScanStep(1);
    }, 9000);

    const interval = setInterval(() => {
      setScanStep((curr) => {
        if (curr === 4 || curr === 5) {
          setScanLineY((prev) => {
            if (prev >= 80) {
              setScanDirection('up');
              return 79;
            }
            if (prev <= 20) {
              setScanDirection('down');
              return 21;
            }
            return scanDirection === 'down' ? prev + 2.5 : prev - 2.5;
          });
        }
        return curr;
      });
    }, 60);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(resetTimer);
      clearInterval(interval);
    };
  }, [scanDirection, scanStep === 1]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (product: typeof catalogProducts[0]) => {
    addUserProduct({
      name: product.name,
      category: product.category,
      brand: product.brand,
      frequency: product.frequency || 'morning',
      ingredients: product.ingredients || [],
      activeIngredients: product.activeIngredients || [],
      usageInstructions: product.usageInstructions || 'Apply gently onto clean skin',
      imageUrl: product.imageUrl
    });
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 2000);
  };

  return (
    <div className="w-full bg-[#faf8f5] text-stone-900 selection:bg-stone-200 selection:text-stone-900 font-sans pb-16 overflow-x-hidden">
      
      {/* =========================================================================================
          SECTION 1: HERO
          Full background photo matching mobile & desktop editorial reference:
          - Background photo fills section#hero
          - Minimal top bar: SKINO (left) and Skip (right)
          - Face scan line animation across background
          - Prominent center-bottom message: "Understand your skin."
          - Main CTA: [ Get Started ]
          - Microcopy: "Your skin data stays under your control."
          - 3 Bottom Pillars underneath hero section
         ========================================================================================= */}
      <section id="hero" className="relative w-full min-h-[88vh] sm:min-h-[92vh] flex flex-col justify-end overflow-hidden bg-stone-950 text-white">
        
        {/* Full-Bleed Editorial Background Photo */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/media/hero.jpeg.jpg';
            }}
            alt="Skincare Hero Editorial Background"
            className="w-full h-full object-cover object-top sm:object-center brightness-[0.92]"
          />
          {/* Subtle multi-stop gradient overlays ensuring high contrast without washing out the portrait */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/20 to-stone-950/45 pointer-events-none" />
          <div className="absolute inset-0 bg-stone-950/15 pointer-events-none" />
        </div>

        {/* Glowing Facial Scan Line across her face in background */}
        {(scanStep === 4 || scanStep === 5) && (
          <div
            className="absolute left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_16px_#6ee7b7] pointer-events-none z-20 transition-all duration-75"
            style={{ top: `${scanLineY}%` }}
          />
        )}

        {/* Desktop Left-side Overlay Tags */}
        <div className="hidden lg:block absolute top-[28%] left-8 xl:left-14 z-20 space-y-2.5 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="px-3.5 py-1.5 rounded-full bg-stone-950/65 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Texture: Good</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-stone-950/65 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Dark Spots: Moderate</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-stone-950/65 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Redness: Low</span>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-stone-950/65 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Oiliness: High</span>
          </div>
        </div>

        {/* Desktop Right-side Floating AI Skin Analysis Card */}
        <div className="hidden lg:block absolute top-[22%] right-8 xl:right-14 z-20 w-64 bg-stone-950/75 backdrop-blur-md rounded-3xl p-5 border border-white/15 shadow-2xl text-white animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold text-white">AI Skin Analysis</span>
            <span className="text-[10px] text-teal-300 font-mono tracking-wider">LIVE CV</span>
          </div>

          <div className="py-3 flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border-2 border-emerald-400">
              <span className="text-lg font-bold text-white font-serif-display">72%</span>
            </div>
            <div>
              <p className="text-xs font-bold text-white">Skin Health Score</p>
              <p className="text-[10px] text-stone-300">Barrier balanced · Oil high</p>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] pt-1">
            <div className="flex items-center justify-between">
              <span className="text-stone-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Blemishes
              </span>
              <span className="font-semibold text-white">Moderate</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Redness
              </span>
              <span className="font-semibold text-white">Low</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Oiliness
              </span>
              <span className="font-semibold text-white">High</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Dark Spots
              </span>
              <span className="font-semibold text-white">Moderate</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Texture
              </span>
              <span className="font-semibold text-white">Good</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Hydration
              </span>
              <span className="font-semibold text-white">Good</span>
            </div>
          </div>
        </div>

        {/* Hero Bottom Center Message & CTA (matching reference mockup) */}
        <div className="relative z-30 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 text-center flex flex-col items-center space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-white font-serif-display drop-shadow-[0_2px_18px_rgba(0,0,0,0.7)] tracking-tight">
            Understand your skin.
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/scan')}
              className="w-full sm:w-auto min-w-[220px] h-14 px-10 rounded-full bg-stone-950 hover:bg-stone-900 text-white font-medium text-sm tracking-wide shadow-2xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4 text-stone-300" />
            </button>

            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hidden sm:flex h-14 px-8 rounded-full bg-white/90 hover:bg-white text-stone-900 font-medium text-sm backdrop-blur-md transition items-center justify-center cursor-pointer shadow-lg"
            >
              How It Works
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-stone-200 drop-shadow pt-1">
            <Lock className="w-3.5 h-3.5 text-stone-300" />
            <span>Your skin data stays under your control.</span>
          </div>
        </div>

      </section>

      {/* 3 Bottom Pillar Cards directly underneath the hero */}
      <section className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-md space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-900" />
              <h3 className="font-bold text-stone-950 text-sm">AI-Powered</h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Computer vision analyzes visible skin characteristics with objective precision.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-md space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-900" />
              <h3 className="font-bold text-stone-950 text-sm">Personalized</h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Recommendations consider your unique profile, current products and wellness goals.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-md space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-900" />
              <h3 className="font-bold text-stone-950 text-sm">Privacy First</h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              You control whether your skin photos are retained or instantly purged.
            </p>
          </div>
        </div>

        <div className="text-center pt-4 hidden lg:block">
          <p className="text-[11px] text-stone-400">
            Cosmetic &amp; wellness guidance — not medical diagnosis.
          </p>
        </div>
      </section>

      {/* =========================================================================================
          SECTION 2: HOW IT WORKS ("Your Skin Journey in 5 Simple Steps.")
          - 01 Scan: Capture your face from multiple angles.
          - 02 Analyze: AI detects skin features & concerns.
          - 03 Personalize: Get tailored products, routines and nutrition.
          - 04 Follow: Receive reminders and guidance.
          - 05 Track: See your progress and results.
          - Right card: Facial scanner card with Analyzing... and percentage breakdown.
         ========================================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
            How It Works
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 font-serif-display">
            Your Skin Journey in 5 Simple Steps.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            From a quick scan to a personalized routine, wellness plan and ongoing support.
          </p>
        </div>

        {/* 5 Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Scan', desc: 'Capture your face from multiple angles.' },
            { step: '02', title: 'Analyze', desc: 'AI detects skin features & concerns.' },
            { step: '03', title: 'Personalize', desc: 'Get tailored products, routines and nutrition.' },
            { step: '04', title: 'Follow', desc: 'Receive reminders and guidance.' },
            { step: '05', title: 'Track', desc: 'See your progress and results.' }
          ].map((item) => (
            <div
              key={item.step}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-stone-400 transition"
            >
              <span className="text-3xl font-light text-stone-900 font-serif-display">
                {item.step}
              </span>
              <div>
                <h4 className="font-bold text-stone-950 text-sm">{item.title}</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Supporting Live Scanner Preview Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-[36px] p-6 sm:p-10 border border-stone-200/80 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-6">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src="/media/hero.jpg"
              alt="Facial Scanner Capture"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-950/20" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-950/80 backdrop-blur text-white text-[10px] font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Analyzing...</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Analysis Breakdown</span>
              <h3 className="text-xl font-bold text-stone-950 font-serif-display mt-0.5">Observable Characteristics</h3>
              <p className="text-xs text-stone-500">Calculated across 468 facial landmark coordinates.</p>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Blemishes', score: '64%', desc: 'Moderate surface clarity' },
                { label: 'Redness', score: '62%', desc: 'Minimal vascular erythema' },
                { label: 'Oiliness', score: '68%', desc: 'Elevated T-zone sebum' },
                { label: 'Dark Spots', score: '59%', desc: 'Needs daily sunscreen shield' },
                { label: 'Texture', score: '76%', desc: 'Smooth epidermal barrier' },
                { label: 'Hydration', score: '71%', desc: 'Well-maintained moisture level' }
              ].map((m) => (
                <div key={m.label} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                  <div>
                    <span className="font-semibold text-stone-900">{m.label}</span>
                    <span className="text-[10px] text-stone-400 ml-2">{m.desc}</span>
                  </div>
                  <span className="font-bold text-stone-950">{m.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================================
          SECTION 3: AI SKIN ANALYSIS ("See Your Skin More Clearly.")
          - Multi-angle capture preview: Front | Left | Right
          - Scan Guidelines card:
            Remove glasses, Use natural lighting, No beauty filter, Keep skin clean, Look directly at camera, 30-50 cm from camera
          - CTA: Start AI Scan →
         ========================================================================================= */}
      <section id="ai-analysis" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
            AI Skin Analysis
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 font-serif-display">
            See Your Skin More Clearly.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Take or upload photos and let our AI analyze visible skin characteristics in seconds.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-[36px] p-6 sm:p-10 border border-stone-200/80 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Multi-angle preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 p-1 bg-stone-100 rounded-full text-xs font-semibold max-w-xs mx-auto">
              <button
                onClick={() => setSelectedAngle('front')}
                className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                  selectedAngle === 'front' ? 'bg-white text-stone-950 shadow-2xs font-bold' : 'text-stone-600'
                }`}
              >
                Front Angle
              </button>
              <button
                onClick={() => setSelectedAngle('left')}
                className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                  selectedAngle === 'left' ? 'bg-white text-stone-950 shadow-2xs font-bold' : 'text-stone-600'
                }`}
              >
                Left Profile
              </button>
              <button
                onClick={() => setSelectedAngle('right')}
                className={`px-4 py-1.5 rounded-full transition cursor-pointer ${
                  selectedAngle === 'right' ? 'bg-white text-stone-950 shadow-2xs font-bold' : 'text-stone-600'
                }`}
              >
                Right Profile
              </button>
            </div>

            <div className="relative aspect-3/4 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src="/media/hero.jpg"
                alt="Multi-angle preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-stone-950/20 rounded-3xl m-4 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="px-3.5 py-1.5 rounded-full bg-stone-950/70 backdrop-blur-md text-white text-[11px] font-medium">
                  {selectedAngle.toUpperCase()} CAPTURE ALIGNED
                </span>
              </div>
            </div>
          </div>

          {/* Scan Guidelines & Action */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-950 font-serif-display">Scan Guidelines</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                For the most accurate visual assessment, prepare with optimal conditions:
              </p>
            </div>

            <div className="space-y-2.5 text-xs text-stone-700">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <Check className="w-4 h-4 text-stone-900 shrink-0" />
                <span>Remove glasses or hats to clear facial perimeter</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <Check className="w-4 h-4 text-stone-900 shrink-0" />
                <span>Use even, natural lighting (avoid harsh directional shadows)</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <Check className="w-4 h-4 text-stone-900 shrink-0" />
                <span>No beauty filters or digital smoothing</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <Check className="w-4 h-4 text-stone-900 shrink-0" />
                <span>Keep skin clean or lightly cleansed</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                <Check className="w-4 h-4 text-stone-900 shrink-0" />
                <span>Look directly at camera lens from 30–50 cm away</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/scan')}
              className="w-full h-13 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm tracking-wide shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>Start AI Scan</span>
              <ArrowRight className="w-4 h-4 text-stone-300" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================================
          SECTION 4: PERSONALIZED ROUTINE ("Not Just Recommendations. A Routine You Can Actually Follow.")
          - Morning (07:00) vs Evening (20:30)
          - Morning: Cleanser (30-60s), Treatment (Thin layer, wait 1-2m), Moisturizer (Wait 1m), Sunscreen
          - Evening: Cleanse, Treatment, Moisturize with Routine Complete check
         ========================================================================================= */}
      <section id="routine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Personalized Routine
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 font-serif-display">
            Not Just Recommendations. <br />
            A Routine You Can Actually Follow.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Get exact order, application times and personalized frequency for your skin and lifestyle.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-[36px] p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-6">
          
          {/* Morning / Evening Switcher */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-1 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center shadow-inner">
              <button
                onClick={() => {
                  setRoutineTab('morning');
                  setIsDarkMode(false);
                }}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  routineTab === 'morning' && !isDarkMode
                    ? 'bg-stone-950 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                }`}
                title="Switch to Morning 07:00 Routine (Light Mode)"
              >
                <Sun className={`w-3.5 h-3.5 ${routineTab === 'morning' && !isDarkMode ? 'text-amber-300' : 'text-amber-500'}`} />
                <span>07:00 Morning Routine</span>
              </button>

              <button
                onClick={() => {
                  setRoutineTab('evening');
                  setIsDarkMode(true);
                }}
                className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  routineTab === 'evening' || isDarkMode
                    ? 'bg-stone-950 text-white dark:bg-teal-400 dark:text-stone-950 shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                }`}
                title="Switch to Evening 20:30 Routine (Turns Entire Website to Dark Mode)"
              >
                <Moon className={`w-3.5 h-3.5 ${routineTab === 'evening' || isDarkMode ? 'text-indigo-300 dark:text-stone-950' : 'text-indigo-400'}`} />
                <span>20:30 Evening Routine</span>
              </button>
            </div>

            {isDarkMode && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-400 animate-in fade-in duration-300">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                <span>Evening Mode Engaged · Scheduled 20:30 Skincare Sequence</span>
              </div>
            )}
          </div>

          {/* Routine Steps List */}
          <div className="space-y-3">
            {routineTab === 'morning' ? (
              <>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Step 01: Gentle Cleanser</span>
                    <span className="text-stone-500">Duration: 30–60 seconds contact on damp skin · Wait 30 sec</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-700 bg-white px-3 py-1 rounded-full border border-stone-200">
                    Step 1
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Step 02: Treatment (Hydrating Serum)</span>
                    <span className="text-stone-500">Apply 3 drops evenly · Wait 1–2 minutes for active penetration</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-700 bg-white px-3 py-1 rounded-full border border-stone-200">
                    Step 2
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Step 03: Barrier Moisturizer</span>
                    <span className="text-stone-500">Hydrating ceramide emulsion · Wait 1 minute</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-700 bg-white px-3 py-1 rounded-full border border-stone-200">
                    Step 3
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Step 04: Broad Spectrum Sunscreen SPF 50+</span>
                    <span className="text-stone-500">Two finger-lengths for comprehensive UV shield</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-700 bg-white px-3 py-1 rounded-full border border-stone-200">
                    Step 4
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Step 01: Double Cleanse</span>
                    <span className="text-stone-500">Dissolves sunscreen and environmental pollutants · Wait 60 sec</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-700 bg-white px-3 py-1 rounded-full border border-stone-200">
                    Step 1
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Step 02: Active Treatment (Azelaic Acid / Serum)</span>
                    <span className="text-stone-500">Calms erythema and regulates follicular keratin · Wait 2 min</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-700 bg-white px-3 py-1 rounded-full border border-stone-200">
                    Step 2
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block text-sm">Step 03: Recovery Night Balm</span>
                    <span className="text-stone-500">Panthenol &amp; lipid complex seal barrier before sleep</span>
                  </div>
                  <span className="text-[11px] font-semibold text-stone-700 bg-white px-3 py-1 rounded-full border border-stone-200">
                    Step 3
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Routine Complete Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => navigate('/routine')}
              className="w-full sm:flex-1 h-13 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm tracking-wide transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Routine Complete ✓</span>
            </button>

            <button
              onClick={() => navigate('/calendar')}
              className="w-full sm:w-auto h-13 px-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs transition cursor-pointer"
            >
              View Skincare Calendar
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================================
          SECTION 5: PRODUCT RECOMMENDATIONS ("Recommendations Built From Real Product Data.")
          - Product bottle: Hydrating Serum
          - Compatibility 91%
          - Why This Product? checklist & warning
          - CTA: Explore Products →
         ========================================================================================= */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Product Intelligence
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 font-serif-display">
            Recommendations Built From Real Product Data.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Our AI uses a curated product catalog, your profile, current routine and compatibility rules to suggest the best options for your skin.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-[36px] p-6 sm:p-10 border border-stone-200/80 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Product Bottle & Compatibility */}
          <div className="space-y-4">
            <div className="aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src="/media/serum.jpg"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=85';
                }}
                alt="Hydrating Serum Product"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Treatment · All Skin Types</span>
              <h3 className="font-bold text-stone-950 text-lg">Hydrating Serum</h3>
              <p className="text-xs text-stone-500">Hyaluronic Acid · Niacinamide · Vitamin B5</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-stone-700">Compatibility</span>
                <span className="text-emerald-700 font-extrabold">91%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                <div className="h-full bg-stone-950 rounded-full w-[91%]" />
              </div>
            </div>
          </div>

          {/* Why This Product? */}
          <div className="space-y-4 text-xs">
            <h4 className="text-base font-bold text-stone-950 font-serif-display">Why This Product?</h4>

            <div className="space-y-2.5 text-stone-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-stone-900 shrink-0" />
                <span>Matches your skin type (combination)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-stone-900 shrink-0" />
                <span>Targets hydration &amp; texture</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-stone-900 shrink-0" />
                <span>Compatible with your routine</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-stone-900 shrink-0" />
                <span>No known conflicts</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-amber-900 text-[11px] flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Caution:</strong> Not recommended with Product X (may increase irritation).
              </span>
            </div>

            <button
              onClick={() => navigate('/products')}
              className="w-full h-13 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm tracking-wide transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 text-stone-300" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================================
          SECTION 6: WELLNESS ("Your Skin Doesn't Exist in Isolation.")
          - Today's Meal Plan timeline:
            07:30 Breakfast, 10:30 Hydration, 13:00 Lunch, 16:00 Snack, 19:30 Dinner, 21:30 Hydration
          - Daily Goals: Water 2.5L, Sleep 7-8h, Activity 30m
          - Image /media/wellness.jpg
          - CTA: View Wellness Plan →
         ========================================================================================= */}
      <section id="wellness" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Wellness Plan
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 font-serif-display">
            Your Skin Doesn't Exist in Isolation.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Nutrition, hydration, sleep and movement work together for healthy, glowing skin.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-[36px] p-6 sm:p-10 border border-stone-200/80 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Today's Meal Plan */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-stone-950 uppercase tracking-wider">
              Today's Meal &amp; Hydration Plan
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { time: '07:30', title: 'Breakfast', desc: 'Oats, berries, walnuts & green tea' },
                { time: '10:30', title: 'Hydration', desc: '500ml pure water + lemon' },
                { time: '13:00', title: 'Lunch', desc: 'Grilled chicken, quinoa & steamed vegetables' },
                { time: '16:00', title: 'Snack', desc: 'Fresh avocado & raw almonds' },
                { time: '19:30', title: 'Dinner', desc: 'Salmon, sweet potato & green salad' },
                { time: '21:30', title: 'Hydration Check', desc: 'Herbal chamomile & night water reminder' }
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-stone-900">{item.title}</span>
                    <p className="text-[11px] text-stone-500">{item.desc}</p>
                  </div>
                  <span className="font-mono text-stone-700 font-bold text-[11px]">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Goals & Wellness Imagery */}
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src="/media/wellness.jpg"
                alt="Fresh Wellness Nutrition"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-stone-950 uppercase tracking-wider">Daily Goals</h4>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] text-stone-400 block uppercase">Water</span>
                  <span className="font-extrabold text-stone-900 text-sm">2.5 L</span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] text-stone-400 block uppercase">Sleep</span>
                  <span className="font-extrabold text-stone-900 text-sm">7–8 h</span>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] text-stone-400 block uppercase">Activity</span>
                  <span className="font-extrabold text-stone-900 text-sm">30 min</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/wellness')}
              className="w-full h-13 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm tracking-wide transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Wellness Plan</span>
              <ArrowRight className="w-4 h-4 text-stone-300" />
            </button>
          </div>

        </div>
      </section>

      {/* =========================================================================================
          SECTION 7: PROGRESS ("Watch Your Journey, Not Just a Number.")
          - Week 1 to Week 8 progression
          - CTA: Start With Journey →
         ========================================================================================= */}
      <section id="progress" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Progress Tracking
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 font-serif-display">
            Watch Your Journey, Not Just a Number.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Track your skin score, see improvements and discover what works for you.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-[36px] p-6 sm:p-10 border border-stone-200/80 shadow-xs space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-stone-50 border border-stone-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Week 1</span>
              <p className="text-3xl font-light text-stone-900 font-serif-display">68%</p>
              <span className="text-[11px] text-stone-500">Baseline scan</span>
            </div>

            <div className="p-5 rounded-3xl bg-stone-50 border border-stone-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Week 2</span>
              <p className="text-3xl font-light text-stone-900 font-serif-display">72%</p>
              <span className="text-[11px] text-emerald-700 font-semibold">+4% Barrier healing</span>
            </div>

            <div className="p-5 rounded-3xl bg-stone-50 border border-stone-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Week 4</span>
              <p className="text-3xl font-light text-stone-900 font-serif-display">76%</p>
              <span className="text-[11px] text-emerald-700 font-semibold">+8% Hydration pace</span>
            </div>

            <div className="p-5 rounded-3xl bg-stone-950 text-white border border-stone-900 text-center space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Week 8</span>
              <p className="text-3xl font-light text-white font-serif-display">82%</p>
              <span className="text-[11px] text-emerald-400 font-semibold">Healthy radiance</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => navigate('/progress')}
              className="h-13 px-8 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm tracking-wide transition shadow-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Start With Journey</span>
              <ArrowRight className="w-4 h-4 text-stone-300" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================================
          SECTION 8: AI SKIN COACH ("Your Personal Skin Coach.")
          - Chat conversation bubble:
            User: "Can I use my serum tonight?"
            Coach: "Based on your current routine and today's schedule, your serum is scheduled for tonight..."
          - AI Uses checklist: User Profile, Current Routine, Existing Products, Product Database, Today's Schedule
          - CTA: Chat with AI Coach →
         ========================================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
            AI Skin Coach
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 font-serif-display">
            Your Personal Skin Coach.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Ask questions about your skin, products and routine.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-[36px] p-6 sm:p-10 border border-stone-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Chat Bubble Interface */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex justify-end">
              <div className="p-4 rounded-3xl bg-stone-950 text-white text-xs max-w-sm rounded-br-none leading-relaxed">
                Can I use my serum tonight?
              </div>
            </div>

            <div className="flex justify-start">
              <div className="p-4 sm:p-5 rounded-3xl bg-stone-100 text-stone-900 text-xs max-w-md rounded-bl-none space-y-2">
                <div className="font-bold text-stone-950 flex items-center gap-1.5 text-xs">
                  <Bot className="w-3.5 h-3.5" /> Skin Coach
                </div>
                <p className="leading-relaxed text-stone-700">
                  Based on your current routine and today's schedule, your serum is scheduled for tonight. Follow the recommended application order shown in your routine.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/coach')}
                className="w-full h-13 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm tracking-wide transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Chat with AI Coach</span>
                <ArrowRight className="w-4 h-4 text-stone-300" />
              </button>
            </div>
          </div>

          {/* AI Uses Context card */}
          <div className="md:col-span-5 p-6 rounded-3xl bg-stone-50 border border-stone-100 space-y-3 text-xs">
            <h4 className="font-bold text-stone-950 uppercase tracking-wider text-[11px]">AI Uses</h4>
            <ul className="space-y-2 text-stone-600">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900" /> User Profile
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900" /> Current Routine
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900" /> Existing Products
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900" /> Product Database
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-stone-900" /> Today's Schedule
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* =========================================================================================
          SECTION 9: PRIVACY ("Your Face Is Yours.")
          - Photo storage: Keep previous scans / Don't retain scans
          - Delete Data controls
          - Image /media/calm.jpg
          - CTA: Manage Privacy →
         ========================================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Privacy &amp; Security
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 font-serif-display">
            Your Face Is Yours.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Your photos and personal information remain under your control.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-[36px] p-6 sm:p-10 border border-stone-200/80 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-5">
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-stone-950 uppercase tracking-wider text-xs">Photo Storage</h4>
              
              <div
                onClick={() => setPhotoStorageChoice('keep')}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  photoStorageChoice === 'keep' ? 'border-stone-950 bg-stone-50' : 'border-stone-200'
                }`}
              >
                <div>
                  <span className="font-semibold text-stone-900 block">Keep previous scans</span>
                  <span className="text-stone-500">Enables week-over-week journey comparisons</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  photoStorageChoice === 'keep' ? 'border-stone-950 bg-stone-950' : 'border-stone-300'
                }`}>
                  {photoStorageChoice === 'keep' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>

              <div
                onClick={() => setPhotoStorageChoice('discard')}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  photoStorageChoice === 'discard' ? 'border-stone-950 bg-stone-50' : 'border-stone-200'
                }`}
              >
                <div>
                  <span className="font-semibold text-stone-900 block">Don't retain scans</span>
                  <span className="text-stone-500">Purges photos immediately after analysis calculation</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  photoStorageChoice === 'discard' ? 'border-stone-950 bg-stone-950' : 'border-stone-300'
                }`}>
                  {photoStorageChoice === 'discard' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/profile/settings')}
                className="w-full h-13 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm tracking-wide transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Manage Privacy</span>
                <ArrowRight className="w-4 h-4 text-stone-300" />
              </button>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200">
            <img
              src="/media/calm.jpg"
              alt="Calm Skincare Privacy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-950/20" />
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <span className="px-4 py-1.5 rounded-full bg-stone-950/70 backdrop-blur-md text-white text-[11px] font-medium">
                Encrypted · Never Sold · User Owned
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================================
          SECTION 10: PRICING ("Choose Your Level of Personalization.")
          - START: TZS 20,000 / month
          - HIGH: TZS 45,000 / month
         ========================================================================================= */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Pricing Plans
          </span>
          <h2 className="text-2xl sm:text-4xl font-normal text-stone-950 font-serif-display">
            Choose Your Level of Personalization.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Start with the plan that fits your goals. Upgrade anytime.
          </p>

          {/* Currency Toggle */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <div className="flex items-center bg-stone-200/70 p-0.5 rounded-full text-xs font-bold text-stone-700">
              <button
                onClick={() => setCurrency('TZS')}
                className={`px-3 py-1 rounded-full transition ${
                  currency === 'TZS' ? 'bg-white text-stone-950 shadow-2xs' : 'text-stone-500'
                }`}
              >
                TZS
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-full transition ${
                  currency === 'USD' ? 'bg-white text-stone-950 shadow-2xs' : 'text-stone-500'
                }`}
              >
                USD
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* START PLAN */}
          <div className="bg-white rounded-[36px] p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">Basic</span>
                <h3 className="text-2xl font-light text-stone-950 font-serif-display mt-0.5">START</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-stone-950">{formatPrice(20000, 8)}</span>
                  <span className="text-xs text-stone-500"> / month</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-center gap-2">✓ AI skin health analysis</li>
                <li className="flex items-center gap-2">✓ Curated product recommendations</li>
                <li className="flex items-center gap-2">✓ Morning &amp; Evening routine order</li>
                <li className="flex items-center gap-2">✓ Basic wellness nutrition plan</li>
                <li className="flex items-center gap-2">✓ Calendar reminders</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/profile/subscription')}
              className="w-full h-13 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm tracking-wide transition shadow-xs cursor-pointer"
            >
              Start with START
            </button>
          </div>

          {/* HIGH PLAN */}
          <div className="bg-white rounded-[36px] p-6 sm:p-8 border border-stone-950 shadow-lg flex flex-col justify-between space-y-6 relative">
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-stone-950 text-white text-[10px] font-bold uppercase tracking-wider">
              Popular
            </span>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400">Full Intelligence</span>
                <h3 className="text-2xl font-light text-stone-950 font-serif-display mt-0.5">HIGH</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-stone-950">{formatPrice(45000, 18)}</span>
                  <span className="text-xs text-stone-500"> / month</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-center gap-2 font-medium text-stone-900">✓ Everything in START tier</li>
                <li className="flex items-center gap-2 font-medium text-stone-900">✓ Unlimited multi-angle scans</li>
                <li className="flex items-center gap-2 font-medium text-stone-900">✓ Ingredient chemistry conflict check</li>
                <li className="flex items-center gap-2 font-medium text-stone-900">✓ Real-time AI Skin Coach</li>
                <li className="flex items-center gap-2 font-medium text-stone-900">✓ Circadian schedule adaptation</li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/profile/subscription')}
              className="w-full h-13 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm tracking-wide transition shadow-xs cursor-pointer"
            >
              Choose HIGH
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================================
          SECTION 11: BOTTOM CTA BANNER ("Your Skin Journey Starts With Understanding.")
          - Start My Skin Journey →
          - Explore How It Works
         ========================================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="relative rounded-[40px] sm:rounded-[48px] p-8 sm:p-14 text-center space-y-6 bg-stone-200/50 border border-stone-200/80 shadow-xs overflow-hidden">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-950 font-serif-display max-w-2xl mx-auto leading-tight">
            Your Skin Journey Starts With Understanding.
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Discover a routine built around your skin, your products, your lifestyle and your goals.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/scan')}
              className="h-13 px-8 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-medium text-sm tracking-wide shadow-md transition cursor-pointer"
            >
              Start My Skin Journey
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="h-13 px-7 rounded-full bg-white hover:bg-stone-50 text-stone-900 font-medium text-sm border border-stone-200 transition cursor-pointer"
            >
              Explore How It Works
            </button>
          </div>

          <p className="text-[11px] text-stone-400 font-medium">
            Your data. Your photos. Your control.
          </p>
        </div>
      </section>

      {/* =========================================================================================
          FOOTER
         ========================================================================================= */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 border-t border-stone-200 text-xs text-stone-500 space-y-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-stone-950 text-white flex items-center justify-center">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="font-bold text-stone-950 font-serif-display text-sm">Skin &amp; Wellness</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Understand your skin. Build your routine. Improve your wellness.
            </p>
          </div>

          <div>
            <strong className="font-bold text-stone-900 block mb-3 uppercase tracking-wider text-[11px]">Product</strong>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-stone-900">How It Works</button></li>
              <li><button onClick={() => navigate('/scan')} className="hover:text-stone-900">AI Skin Analysis</button></li>
              <li><button onClick={() => navigate('/routine')} className="hover:text-stone-900">Personalized Routine</button></li>
              <li><button onClick={() => navigate('/wellness')} className="hover:text-stone-900">Wellness</button></li>
              <li><button onClick={() => navigate('/progress')} className="hover:text-stone-900">Progress</button></li>
            </ul>
          </div>

          <div>
            <strong className="font-bold text-stone-900 block mb-3 uppercase tracking-wider text-[11px]">Quick Demos</strong>
            <ul className="space-y-2">
              <li><button onClick={() => { loginDemoUser('user'); navigate('/dashboard'); }} className="hover:text-stone-900 font-medium text-left cursor-pointer">Login as Amina (User)</button></li>
              <li><button onClick={() => { loginDemoUser('admin'); navigate('/admin'); }} className="hover:text-stone-900 font-medium text-left cursor-pointer">Login as Dr. Grace (Admin)</button></li>
              <li><button onClick={() => navigate('/profile/subscription')} className="hover:text-stone-900">Pricing &amp; Plans</button></li>
              <li><button onClick={() => navigate('/profile/settings')} className="hover:text-stone-900">Privacy &amp; Data</button></li>
            </ul>
          </div>

          <div>
            <strong className="font-bold text-stone-900 block mb-3 uppercase tracking-wider text-[11px]">Transparency</strong>
            <p className="text-[11px] text-stone-500 leading-relaxed mb-2">
              Non-medical cosmetic and wellness guidance. We prioritize data encryption and user consent.
            </p>
            <span className="text-[10px] text-stone-400">All facial photos remain under user ownership.</span>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} Skin &amp; Wellness. All rights reserved.</p>
          <p className="text-stone-400 hidden lg:block">Cosmetic &amp; wellness guidance — not medical diagnosis.</p>
        </div>
      </footer>

    </div>
  );
};
