import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  SlidersHorizontal,
  Bell,
  ArrowLeft,
  Info,
  Scan,
  Plus,
  Check,
  ChevronRight,
  Heart,
  Home,
  MessageCircle,
  User,
  Shield,
  Clock,
  Play,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SmartphoneExperienceProps {
  onStartRealScan?: () => void;
  onExploreProducts?: () => void;
  initialScreen?: 1 | 2 | 3;
}

export const SmartphoneExperience: React.FC<SmartphoneExperienceProps> = ({
  onStartRealScan,
  onExploreProducts,
  initialScreen = 1
}) => {
  const navigate = useNavigate();
  const { userProfile, catalogProducts, formatPrice, currency, setCurrency } = useApp();

  const [activeScreen, setActiveScreen] = useState<1 | 2 | 3>(initialScreen);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'chat' | 'profile'>('home');

  // Trigger interactive scan animation for Screen 3
  const triggerScanAnimation = () => {
    setIsScanning(true);
    setScanProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
        }, 1200);
      }
    }, 150);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Screen Selector Controls (allows toggling or testing all 3 reference screens) */}
      <div className="mb-4 flex items-center gap-1.5 p-1.5 bg-stone-200/80 backdrop-blur rounded-full border border-stone-300/80 shadow-inner max-w-sm w-full justify-between">
        <button
          onClick={() => setActiveScreen(1)}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all text-center ${
            activeScreen === 1
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          Screen 1: Intro
        </button>
        <button
          onClick={() => setActiveScreen(2)}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all text-center ${
            activeScreen === 2
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          Screen 2: Products
        </button>
        <button
          onClick={() => setActiveScreen(3)}
          className={`flex-1 py-1.5 px-3 rounded-full text-xs font-bold transition-all text-center ${
            activeScreen === 3
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          Screen 3: AI Scan
        </button>
      </div>

      {/* Smartphone Frame Container */}
      <div className="relative w-full max-w-[390px] h-[780px] sm:h-[810px] bg-stone-900 rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.15)] border-4 border-stone-800 flex flex-col overflow-hidden select-none">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-stone-950 rounded-full z-50 flex items-center justify-end px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-stone-800/80 mr-1" />
          <div className="w-2 h-2 rounded-full bg-teal-900/60" />
        </div>

        {/* Screen Content Window */}
        <div className="relative w-full h-full bg-[#f6f6f8] rounded-[38px] overflow-hidden flex flex-col">
          
          {/* iOS Status Bar (9:41 PM) */}
          <div className="h-10 pt-2 px-6 flex items-center justify-between text-[11px] font-semibold text-stone-900 z-40">
            <span>9:41 PM</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/>
              </svg>
              <div className="w-4 h-2 border border-current rounded-xs p-0.5 flex items-center">
                <div className="w-full h-full bg-current rounded-2xs" />
              </div>
            </div>
          </div>

          {/* =========================================================================================
              SCREEN 1: Personalized Skincare Introduction (Attachment 2 Screen 1)
             ========================================================================================= */}
          {activeScreen === 1 && (
            <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
              {/* Full-bleed Portrait of Woman touching cheek */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=85"
                  alt="Personalized Skincare Care"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
              </div>

              {/* Top Navigation: Skina logo + Skip */}
              <div className="relative z-10 px-5 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-stone-950 text-white flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-stone-950 tracking-tight text-base font-serif-display drop-shadow-xs">
                    Skina
                  </span>
                </div>

                <button
                  onClick={() => setActiveScreen(2)}
                  className="px-3.5 py-1 rounded-full bg-white/80 hover:bg-white text-stone-900 text-[11px] font-semibold backdrop-blur-md shadow-xs transition"
                >
                  Skip
                </button>
              </div>

              {/* Bottom Warm Peach Frosted Glass Panel */}
              <div className="relative z-10 mx-3 mb-4 p-6 rounded-[32px] bg-gradient-to-t from-[#fceee7]/95 via-[#f9e2d6]/90 to-[#fae6db]/80 backdrop-blur-xl border border-white/60 shadow-[0_15px_35px_rgba(0,0,0,0.15)] text-center space-y-3">
                <h1 className="text-2xl sm:text-[26px] font-extrabold text-stone-950 leading-[1.18] font-serif-display">
                  Personalized Care, <br />
                  Perfect Product
                </h1>

                <p className="text-xs text-stone-700 leading-relaxed font-normal px-2">
                  Set things up in seconds and enjoy a smarter, smoother, more intuitive experience right away.
                </p>

                {/* Jet-black pill-shaped CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => setActiveScreen(2)}
                    className="w-full py-4 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs tracking-wide shadow-lg shadow-stone-950/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>Get Started</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================================
              SCREEN 2: Skincare Product Dashboard (Attachment 2 Screen 2)
             ========================================================================================= */}
          {activeScreen === 2 && (
            <div className="relative flex-1 flex flex-col overflow-y-auto pb-24 px-5 pt-1 space-y-4">
              {/* Header Bar */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveScreen(1)}
                  className="w-9 h-9 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-stone-800 shadow-2xs hover:bg-stone-50"
                  aria-label="Menu"
                >
                  <span className="text-base font-bold">☰</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrency(currency === 'TZS' ? 'USD' : 'TZS')}
                    className="px-2.5 py-1 rounded-full bg-white border border-stone-200 text-[10px] font-bold text-stone-700 shadow-2xs"
                  >
                    {currency}
                  </button>

                  <button
                    className="relative w-9 h-9 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-stone-700 shadow-2xs"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-rose-500" />
                  </button>

                  <div className="w-9 h-9 rounded-full overflow-hidden border border-stone-300 shadow-2xs">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Big Bold Headline */}
              <div className="pt-1">
                <h2 className="text-[26px] font-extrabold text-stone-950 tracking-tight leading-[1.18] font-serif-display">
                  Skincare That <br />
                  Understands You.
                </h2>
              </div>

              {/* Action Pill Controls */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => navigate('/products')}
                  className="w-10 h-10 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50 shrink-0"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/products')}
                  className="w-10 h-10 rounded-full bg-white border border-stone-200/80 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-50 shrink-0"
                  aria-label="Filter"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>

                {/* Order Now Product button */}
                <button
                  onClick={() => navigate('/products')}
                  className="flex-1 py-2.5 px-4 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-1.5 transition"
                >
                  <span>Order Now Product</span>
                </button>
              </div>

              {/* Popular Product Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-stone-950">Popular Product</h3>
                  <button
                    onClick={() => navigate('/products')}
                    className="text-xs font-semibold text-stone-500 hover:text-stone-900"
                  >
                    See all
                  </button>
                </div>

                {/* Product Card 1 ($60.00 / TZS 45,000) */}
                <div className="relative bg-white rounded-[26px] p-4 border border-stone-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xl font-extrabold text-stone-950">
                        {formatPrice(45000, 60)}
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5 font-medium">Best Skin care Product</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px] border border-stone-200/60">
                      50%
                    </span>
                  </div>

                  {/* Product Botanical Image with Fern & Cream Splash */}
                  <div className="relative w-full h-36 my-2 rounded-2xl overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1608248597359-548455823136?w=600&auto=format&fit=crop&q=85"
                      alt="Skin Care Bottle"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Tags row */}
                  <div className="flex items-center gap-1.5 my-2">
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

                  {/* Buy Now Button */}
                  <button
                    onClick={() => navigate('/products')}
                    className="w-full py-2.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs tracking-wide transition shadow-xs"
                  >
                    Buy now
                  </button>
                </div>

                {/* Product Card 2 ($45.00 / TZS 35,000) */}
                <div className="relative bg-white rounded-[26px] p-4 border border-stone-200/70 shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden flex items-center justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[9px]">
                      50%
                    </span>
                    <div className="text-lg font-extrabold text-stone-950 mt-1">
                      {formatPrice(35000, 45)}
                    </div>
                    <p className="text-[10px] text-stone-400 font-medium">Best Skin care Product</p>
                  </div>

                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                    <img
                      src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&auto=format&fit=crop&q=80"
                      alt="Cream"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Floating Frosted Bottom Navigation Bar Capsule */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] bg-white/80 backdrop-blur-xl rounded-full p-1.5 border border-white/80 shadow-[0_10px_25px_rgba(0,0,0,0.08)] flex items-center justify-around z-30">
                <button
                  onClick={() => {
                    setActiveBottomNav('home');
                    setActiveScreen(2);
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    activeBottomNav === 'home'
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setActiveBottomNav('chat');
                    navigate('/coach');
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    activeBottomNav === 'chat'
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  aria-label="Coach"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setActiveBottomNav('profile');
                    navigate('/profile');
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                    activeBottomNav === 'profile'
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                  aria-label="Profile"
                >
                  <User className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================================
              SCREEN 3: AI Skin Analysis (Attachment 2 Screen 3)
             ========================================================================================= */}
          {activeScreen === 3 && (
            <div className="relative flex-1 flex flex-col justify-between overflow-hidden">
              {/* Full-screen Portrait of Girl with natural skin */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=85"
                  alt="AI Skin Analysis"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900/30 via-transparent to-stone-950/60" />
              </div>

              {/* Scanning line animation if active */}
              {isScanning && (
                <div
                  className="absolute left-0 right-0 h-1 bg-teal-300 shadow-[0_0_15px_#2dd4bf] z-30 transition-all duration-150 pointer-events-none"
                  style={{ top: `${scanProgress}%` }}
                />
              )}

              {/* Top Navigation Bar: Back & Info */}
              <div className="relative z-20 px-5 pt-2 flex items-center justify-between">
                <button
                  onClick={() => setActiveScreen(2)}
                  className="w-9 h-9 rounded-full bg-white/70 hover:bg-white text-stone-900 flex items-center justify-center backdrop-blur-md shadow-xs transition"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/scan')}
                  className="w-9 h-9 rounded-full bg-white/70 hover:bg-white text-stone-900 flex items-center justify-center backdrop-blur-md shadow-xs transition"
                  aria-label="Information"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>

              {/* Floating Translucent Insight Labels connected to Facial Points */}
              <div className="relative z-10 flex-1 px-4 py-4 flex flex-col justify-around pointer-events-none">
                {/* Insight 1: Forehead / Temples */}
                <div className="self-end mr-2 flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-stone-900 text-[11px] font-semibold border border-white/80 shadow-md flex items-center gap-1.5 pointer-events-auto">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Extra fatigue showing up</span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white] animate-ping" />
                </div>

                {/* Insight 2: Cheeks / Mouth */}
                <div className="self-end mr-4 flex items-center gap-2">
                  <div className="px-3.5 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md text-stone-900 text-[11px] font-semibold border border-white/80 shadow-md flex items-center gap-1.5 pointer-events-auto max-w-[210px] leading-tight">
                    <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
                    <span>A bit more tired than usual. take a vitamin D</span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white] animate-pulse" />
                </div>

                {/* Insight 3: Neck / Jaw */}
                <div className="self-end mr-6 flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-stone-900 text-[11px] font-semibold border border-white/80 shadow-md flex items-center gap-1.5 pointer-events-auto">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>Low energy lately</span>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_white]" />
                </div>

                {/* Center "Scan Now" Button */}
                <div className="self-center mt-2 pointer-events-auto">
                  <button
                    onClick={triggerScanAnimation}
                    disabled={isScanning}
                    className="px-6 py-2.5 rounded-full bg-white/85 hover:bg-white text-stone-950 font-bold text-xs tracking-wide backdrop-blur-md shadow-lg border border-white/90 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                  >
                    <Scan className="w-4 h-4 text-stone-900" />
                    <span>{isScanning ? `Analyzing ${scanProgress}%` : 'Scan Now'}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Drawer: Suggest Product Carousel */}
              <div className="relative z-20 mx-3 mb-3 p-4 rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_15px_35px_rgba(0,0,0,0.2)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-stone-950">Suggest Product</span>
                  <button
                    onClick={() => navigate('/products')}
                    className="text-[11px] font-semibold text-stone-500 hover:text-stone-900"
                  >
                    See all
                  </button>
                </div>

                {/* Thumbnails row */}
                <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
                  {/* Item 1 */}
                  <div className="relative w-16 h-16 rounded-2xl bg-stone-100 p-1 border border-white/60 shrink-0 overflow-hidden group cursor-pointer" onClick={() => navigate('/products')}>
                    <img
                      src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&auto=format&fit=crop&q=80"
                      alt="Cleanser"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-stone-950/70 text-white flex items-center justify-center text-[10px]">
                      +
                    </div>
                  </div>

                  {/* Item 2 (Selected with Checkmark) */}
                  <div className="relative w-16 h-16 rounded-2xl bg-teal-50 p-1 border-2 border-teal-500 shrink-0 overflow-hidden group cursor-pointer" onClick={() => navigate('/routine')}>
                    <img
                      src="https://images.unsplash.com/photo-1608248597359-548455823136?w=150&auto=format&fit=crop&q=80"
                      alt="Serum"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-stone-950 text-white flex items-center justify-center text-[9px] shadow-xs">
                      ✓
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="relative w-16 h-16 rounded-2xl bg-stone-100 p-1 border border-white/60 shrink-0 overflow-hidden group cursor-pointer" onClick={() => navigate('/products')}>
                    <img
                      src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=150&auto=format&fit=crop&q=80"
                      alt="Moisturizer"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-stone-950/70 text-white flex items-center justify-center text-[10px]">
                      +
                    </div>
                  </div>
                </div>

                {/* Direct Scan Link */}
                <button
                  onClick={() => navigate('/scan')}
                  className="w-full py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-[11px] font-bold tracking-wide transition shadow-xs flex items-center justify-center gap-1.5"
                >
                  <span>Open Full Camera Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
