import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  Calendar,
  Layers,
  Droplets,
  Heart,
  Search,
  Bell,
  CheckCircle2,
  Circle,
  ArrowRight,
  TrendingUp,
  Moon,
  Sun,
  ShieldCheck,
  Package,
  Activity,
  ChevronRight,
  Info,
  Clock,
  Send,
  Sliders,
  Check,
  X,
  Compass,
  Zap,
  Bookmark
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CatalogProduct, RoutineStep } from '../types';

interface UserDashboardViewProps {
  onOpenDigestModal?: () => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  onOpenDigestModal
}) => {
  const navigate = useNavigate();
  const {
    user,
    userProfile,
    latestAnalysis,
    morningRoutine,
    eveningRoutine,
    catalogProducts,
    favorites,
    toggleFavorite,
    formatPrice,
    isDarkMode,
    toggleDarkMode
  } = useApp();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [seeWhyProduct, setSeeWhyProduct] = useState<CatalogProduct | null>(null);
  const [coachInput, setCoachInput] = useState('');
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  // Local routine completion state for real-time interactive satisfaction
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'morning-0': true,
    'morning-1': true,
    'morning-2': true,
  });

  const toggleStep = (key: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Amina';

  // Calculate morning and evening completion
  const morningSteps = morningRoutine?.steps || [
    { stepNumber: 1, category: 'Cleanser', productName: 'Gentle Hydrating Cleanser', brand: 'CeraVe', instructions: 'Massage for 45s with lukewarm water', durationSeconds: 45, waitIntervalSeconds: 30, whyRecommended: 'Hydrates without disrupting stratum corneum.' },
    { stepNumber: 2, category: 'Serum', productName: 'Niacinamide 10% + Zinc 1%', brand: 'The Ordinary', instructions: 'Pat 3 drops gently across face', durationSeconds: 30, waitIntervalSeconds: 60, whyRecommended: 'Regulates daytime sebum and calms pores.' },
    { stepNumber: 3, category: 'Moisturizer', productName: 'Hydro Boost Water Gel', brand: 'Neutrogena', instructions: 'Smooth over face and neck', durationSeconds: 30, waitIntervalSeconds: 60, whyRecommended: 'Lightweight hyaluronic hydration.' },
    { stepNumber: 4, category: 'SPF', productName: 'Anthelios UVmune 400 SPF 50+', brand: 'La Roche-Posay', instructions: 'Apply two finger lengths evenly', durationSeconds: 45, waitIntervalSeconds: 0, whyRecommended: 'Protects against UV hyperpigmentation.' }
  ];

  const eveningSteps = eveningRoutine?.steps || [
    { stepNumber: 1, category: 'Cleanser', productName: 'Gentle Foaming Cleanser', brand: 'CeraVe', instructions: 'Double cleanse to dissolve daily sunscreen', durationSeconds: 60, waitIntervalSeconds: 30, whyRecommended: 'Purifies skin without barrier stripping.' },
    { stepNumber: 2, category: 'Treatment', productName: 'Azelaic Acid Suspension 10%', brand: 'The Ordinary', instructions: 'Apply pea-sized amount to areas of concern', durationSeconds: 30, waitIntervalSeconds: 90, whyRecommended: 'Fades post-blemish redness and refines texture.' },
    { stepNumber: 3, category: 'Moisturizer', productName: 'Cicaplast Baume B5+', brand: 'La Roche-Posay', instructions: 'Warm between fingers and press onto skin', durationSeconds: 45, waitIntervalSeconds: 0, whyRecommended: 'Nocturnal panthenol moisture seal.' }
  ];

  const morningCompletedCount = morningSteps.filter((_, idx) => completedSteps[`morning-${idx}`]).length;
  const eveningCompletedCount = eveningSteps.filter((_, idx) => completedSteps[`evening-${idx}`]).length;

  const currentHour = new Date().getHours();
  const isEveningTime = currentHour >= 18;

  // AI Recommendation pick based on skin profile
  const recommendedProduct = catalogProducts.find(p => p.category === 'Serum') || catalogProducts[0];

  // Curated products for display
  const displayProducts = catalogProducts.slice(0, 4);

  // Suggested prompts
  const suggestedPrompts = [
    'What should I use tonight?',
    'Explain my routine',
    'How do I use this product?',
    'Build me a simpler routine',
    'What should I do after sun exposure?'
  ];

  const handleAskCoach = (promptText?: string) => {
    const q = promptText || coachInput;
    if (!q.trim()) return;
    navigate('/coach', { state: { initialPrompt: q } });
  };

  // Nav links for desktop sidebar
  const sidebarLinks = [
    { label: 'Dashboard', icon: Compass, route: '/dashboard', active: true },
    { label: 'My Skin', icon: Activity, route: '/skin', active: false },
    { label: 'AI Analysis', icon: Camera, route: '/scan', active: false },
    { label: 'My Routine', icon: Clock, route: '/routine', active: false },
    { label: 'Products', icon: Package, route: '/products', active: false },
    { label: 'Progress', icon: TrendingUp, route: '/progress', active: false },
    { label: 'Wellness', icon: Droplets, route: '/wellness', active: false },
    { label: 'AI Coach', icon: Sparkles, route: '/coach', active: false },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col antialiased">
      {/* =========================================================================
          DESKTOP SHELL: Persistent narrow elegant sidebar + Top Header + Main Content
         ========================================================================= */}
      <div className="flex-1 flex w-full">
        {/* SIDEBAR (Desktop >= lg) */}
        <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-stone-200/80 bg-white/70 backdrop-blur-md px-5 py-6 shrink-0 sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-7">
            {/* Logo */}
            <div
              onClick={() => navigate('/home')}
              className="flex items-center gap-2.5 cursor-pointer px-2 select-none group"
            >
              <div className="w-8 h-8 rounded-full bg-stone-950 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              </div>
              <span className="text-lg font-serif-display font-bold tracking-tight text-stone-900">
                Skina
              </span>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {sidebarLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.route)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      item.active
                        ? 'bg-stone-900 text-white shadow-xs font-bold'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${item.active ? 'text-teal-300' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="pt-3 pb-1">
                <div className="h-px bg-stone-200/60 mx-2" />
              </div>

              {/* Secondary links */}
              <button
                onClick={() => navigate('/products?tab=favorites')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-stone-600 hover:text-stone-950 hover:bg-stone-100/80 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-stone-400" />
                  <span>Favorites</span>
                </div>
                {favorites.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => navigate('/profile/settings')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-stone-600 hover:text-stone-950 hover:bg-stone-100/80 transition cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-stone-400" />
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* Bottom Sidebar Card: Skin Score & Tier */}
          <div className="p-4 rounded-3xl bg-[#f5f2eb] border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-500">
                Skin Health
              </span>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-full">
                {latestAnalysis?.skinHealthScore || 74}%
              </span>
            </div>
            <p className="text-[11px] text-stone-600 leading-snug">
              Epidermal barrier is balanced. Next scan recommended in 5 days.
            </p>
            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="font-bold text-stone-700 uppercase text-[10px] tracking-wider">
                {userProfile?.subscriptionTier || 'START'} Tier
              </span>
              <button
                onClick={() => navigate('/profile/subscription')}
                className="text-stone-900 font-bold hover:underline"
              >
                Manage
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* HEADER (Section 6) */}
          <header className="sticky top-0 z-30 bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200/70 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
            {/* Left: Contextual Greeting */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger shortcut */}
              <div
                onClick={() => navigate('/home')}
                className="lg:hidden w-8 h-8 rounded-full bg-stone-950 text-white flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-stone-950 font-serif-display leading-tight">
                  {greeting()}, {displayName}
                </h1>
                <p className="text-[11px] text-stone-500 hidden sm:block">
                  Your personalized cosmetic skincare overview
                </p>
              </div>
            </div>

            {/* Center: Global Search */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products, routines, or ask AI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                  className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-stone-200/80 text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-900 transition"
                />
              </div>
            </div>

            {/* Right: AI shortcut + Notifications + Profile Avatar */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                onClick={() => navigate('/coach')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Ask AI</span>
              </button>

              <button
                onClick={() => setShowNotificationToast(!showNotificationToast)}
                className="relative p-2 rounded-full hover:bg-stone-100 text-stone-600 transition cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-teal-600 absolute top-1.5 right-1.5 ring-2 ring-[#faf8f5]" />
              </button>

              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-white border border-stone-200 hover:border-stone-300 transition cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-stone-800 hidden md:block max-w-[80px] truncate">
                  {displayName}
                </span>
              </button>
            </div>
          </header>

          {/* NOTIFICATION POPUP TRAY */}
          {showNotificationToast && (
            <div className="mx-4 sm:mx-8 mt-3 p-4 bg-white border border-stone-200 rounded-2xl shadow-lg flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="font-bold text-stone-900 block">Evening Skincare Routine Reminder</strong>
                  <span className="text-stone-500">Scheduled for 20:30 · Active Azelaic Acid treatment evening</span>
                </div>
              </div>
              <button
                onClick={() => setShowNotificationToast(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* MAIN SCROLLABLE DASHBOARD CONTENT */}
          <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto space-y-8 pb-24">

            {/* 7. HERO / TODAY CARD */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>Today's Skincare Schedule</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif-display font-normal text-stone-950">
                    {greeting()}, {displayName}.
                  </h2>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    Ready for your skincare routine? Consistent application intervals support epidermal moisture and barrier health.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <div className="px-3.5 py-1.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs">
                      <span className="text-stone-500">Morning routine: </span>
                      <strong className="font-bold text-stone-900 font-mono ml-1">{morningCompletedCount}/{morningSteps.length}</strong>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs">
                      <span className="text-stone-500">Evening routine: </span>
                      <strong className="font-bold text-stone-900 font-mono ml-1">{eveningCompletedCount}/{eveningSteps.length}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                  <button
                    onClick={() => navigate('/routine')}
                    className="px-6 py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isEveningTime ? 'Start Evening Routine' : 'Start Morning Routine'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-300" />
                  </button>

                  <button
                    onClick={() => navigate('/coach')}
                    className="px-5 py-3.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs border border-stone-300 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ask AI</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 8. YOUR SKIN SNAPSHOT */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-950 font-serif-display">
                    Your Skin Snapshot
                  </h3>
                  <p className="text-xs text-stone-500">
                    Calculated from latest visual multi-angle scan
                  </p>
                </div>
                <button
                  onClick={() => navigate('/skin')}
                  className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {[
                  { label: 'Hydration', state: 'Good', value: `${latestAnalysis?.metrics.hydration || 71}%`, note: 'Moisture intact' },
                  { label: 'Oil Balance', state: 'Balanced', value: `${latestAnalysis?.metrics.oilBalance || 68}%`, note: 'T-zone controlled' },
                  { label: 'Texture', state: 'Smooth', value: `${latestAnalysis?.metrics.texture || 76}%`, note: 'Clear barrier' },
                  { label: 'Evenness', state: 'Good', value: `${latestAnalysis?.metrics.pigmentation || 65}%`, note: 'Daily SPF advised' },
                  { label: 'Redness', state: 'Low', value: `${latestAnalysis?.metrics.redness || 82}%`, note: 'Vascularly calm' },
                ].map((item) => (
                  <div
                    key={item.label}
                    onClick={() => navigate('/skin')}
                    className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-1.5 cursor-pointer hover:border-stone-400 hover:shadow-xs transition-all group"
                    title={`View ${item.label} analysis`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-400 group-hover:text-stone-900 uppercase tracking-wider block transition-colors">
                        {item.label}
                      </span>
                      <ChevronRight className="w-3 h-3 text-stone-300 group-hover:text-stone-700 transition-colors" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-extrabold text-stone-900">{item.state}</span>
                      <span className="text-xs font-mono text-stone-400">{item.value}</span>
                    </div>
                    <span className="text-[11px] text-stone-500 block">{item.note}</span>
                  </div>
                ))}
              </div>

              <div className="text-right hidden lg:block">
                <span className="text-[10px] text-stone-400">
                  Cosmetic &amp; wellness guidance — not medical diagnosis.
                </span>
              </div>
            </section>

            {/* 9. LATEST AI ANALYSIS & RECOMMENDATIONS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Latest AI Analysis (2 columns) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs flex flex-col justify-between space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Your Latest Analysis
                    </span>
                  </div>
                  <span className="text-xs font-medium text-stone-400">
                    {latestAnalysis?.createdAt ? new Date(latestAnalysis.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '24 September 2026'}
                  </span>
                </div>

                {latestAnalysis ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/60">
                      <div>
                        <div className="text-xs text-stone-500">Overall Skin Health Index</div>
                        <div className="text-3xl font-extrabold text-stone-900 font-serif-display mt-0.5">
                          {latestAnalysis.skinHealthScore}%
                        </div>
                      </div>
                      <div className="text-xs text-stone-600 max-w-sm">
                        "Your skin barrier appears well-maintained, with balanced hydration and opportunities to soothe superficial erythema."
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-stone-700 block">Primary Visual Findings:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {latestAnalysis.findings.slice(0, 2).map((f, i) => (
                          <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                            <span className="font-bold text-stone-900 block">{f.concern}</span>
                            <span className="text-stone-500 text-[11px] block mt-0.5">{f.visibleIndicators}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <h4 className="text-base font-bold text-stone-900 font-serif-display">Understand Your Skin</h4>
                    <p className="text-xs text-stone-500 max-w-md mx-auto">
                      Take your first AI skin analysis to create your personalized profile and routine.
                    </p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <span className="text-xs text-stone-500">
                    {latestAnalysis ? 'Observations ready for review' : 'No prior scans stored'}
                  </span>
                  <button
                    onClick={() => navigate(latestAnalysis ? '/scan/results' : '/scan')}
                    className="px-4 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{latestAnalysis ? 'View Results' : 'Analyze My Skin'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card 2: AI Personalization Recommendation */}
              <div className="bg-[#f7f5ef] rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-2xs flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-800 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    <span>Recommended For You</span>
                  </div>
                  <h4 className="text-lg font-bold text-stone-950 font-serif-display">
                    Targeted Hydration Focus
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Your recent analysis suggests focusing on hydration and epidermal lipid reinforcement before introducing higher retinol concentrations.
                  </p>
                </div>

                {recommendedProduct && (
                  <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 flex items-center gap-3">
                    <img
                      src={recommendedProduct.imageUrl}
                      alt={recommendedProduct.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                        91% Compatibility
                      </span>
                      <strong className="font-bold text-stone-900 block truncate">
                        {recommendedProduct.name}
                      </strong>
                      <span className="text-stone-500 text-[11px] block">
                        {recommendedProduct.brand} · {formatPrice(recommendedProduct.priceTZS, recommendedProduct.priceUSD)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (recommendedProduct) setSeeWhyProduct(recommendedProduct);
                    }}
                    className="w-full py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>See Why</span>
                    <Info className="w-3.5 h-3.5 text-stone-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* 10 & 11. TODAY'S ROUTINE (Interactive checklist with completion animation) */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-xl font-bold text-stone-950 font-serif-display">
                    Today's Routine
                  </h3>
                  <p className="text-xs text-stone-500">
                    Step-by-step active sequence with wait intervals
                  </p>
                </div>

                <button
                  onClick={() => navigate('/routine')}
                  className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                >
                  <span>Open Skincare Calendar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Morning Sequence */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <strong className="text-sm font-bold text-stone-900">07:00 Morning Routine</strong>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-500">
                      {morningCompletedCount}/{morningSteps.length} Done
                    </span>
                  </div>

                  <div className="space-y-2">
                    {morningSteps.map((step, idx) => {
                      const key = `morning-${idx}`;
                      const isDone = completedSteps[key];

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                            isDone
                              ? 'bg-emerald-50/50 border-emerald-200/80'
                              : 'bg-[#faf8f5] border-stone-200/70 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Interactive completion toggle */}
                            <button
                              onClick={() => toggleStep(key)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'border-2 border-stone-300 hover:border-stone-500 text-transparent'
                              }`}
                              aria-label={`Mark step ${step.stepNumber} complete`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>

                            <div
                              onClick={() => {
                                const prod = catalogProducts.find(p => p.name === step.productName) || catalogProducts[0];
                                setSelectedProduct(prod);
                              }}
                              className="cursor-pointer min-w-0"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`font-bold truncate ${isDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                                  {step.productName}
                                </span>
                                <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-md">
                                  {step.category}
                                </span>
                              </div>
                              <span className="text-[11px] text-stone-500 block truncate mt-0.5">
                                {step.instructions}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono text-stone-400 block">
                              Wait {step.waitIntervalSeconds}s
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Evening Sequence */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-500" />
                      <strong className="text-sm font-bold text-stone-900">20:30 Evening Routine</strong>
                    </div>
                    <span className="text-xs font-mono font-bold text-stone-500">
                      {eveningCompletedCount}/{eveningSteps.length} Done
                    </span>
                  </div>

                  <div className="space-y-2">
                    {eveningSteps.map((step, idx) => {
                      const key = `evening-${idx}`;
                      const isDone = completedSteps[key];

                      return (
                        <div
                          key={idx}
                          className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                            isDone
                              ? 'bg-emerald-50/50 border-emerald-200/80'
                              : 'bg-[#faf8f5] border-stone-200/70 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              onClick={() => toggleStep(key)}
                              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'border-2 border-stone-300 hover:border-stone-500 text-transparent'
                              }`}
                              aria-label={`Mark step ${step.stepNumber} complete`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>

                            <div
                              onClick={() => {
                                const prod = catalogProducts.find(p => p.name === step.productName) || catalogProducts[0];
                                setSelectedProduct(prod);
                              }}
                              className="cursor-pointer min-w-0"
                            >
                              <div className="flex items-center gap-2">
                                <span className={`font-bold truncate ${isDone ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                                  {step.productName}
                                </span>
                                <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-md">
                                  {step.category}
                                </span>
                              </div>
                              <span className="text-[11px] text-stone-500 block truncate mt-0.5">
                                {step.instructions}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-[10px] font-mono text-stone-400 block">
                              Wait {step.waitIntervalSeconds}s
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* 13. PRODUCTS FOR YOUR SKIN */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-stone-950 font-serif-display">
                    Products For Your Skin
                  </h3>
                  <p className="text-xs text-stone-500">
                    Filtered for your combination profile and barrier needs
                  </p>
                </div>

                <button
                  onClick={() => navigate('/products')}
                  className="text-xs font-bold text-stone-900 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore All Products →</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayProducts.map((product) => {
                  const isFav = favorites.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-2xs flex flex-col justify-between group hover:shadow-md hover:border-stone-400 transition-all space-y-3 cursor-pointer"
                      title="View product details"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition cursor-pointer z-10 ${
                            isFav
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-white/80 hover:bg-white text-stone-600'
                          }`}
                          aria-label="Toggle favorite"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-600' : ''}`} />
                        </button>

                        <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-stone-950/80 text-white text-[9px] font-bold backdrop-blur-xs">
                          AI Recommended
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                          {product.brand} · {product.category}
                        </span>
                        <h4 className="font-bold text-stone-950 text-xs mt-0.5 line-clamp-1 group-hover:text-teal-700 transition">
                          {product.name}
                        </h4>
                        <div className="text-xs font-bold text-stone-900 pt-0.5">
                          {formatPrice(product.priceTZS, product.priceUSD)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProduct(product);
                          }}
                          className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition cursor-pointer"
                        >
                          Quick View
                        </button>
                        <span className="p-2 rounded-xl bg-stone-950 text-white text-xs font-bold group-hover:bg-stone-800 transition">
                          →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 14. PROGRESS / YOUR SKIN JOURNEY */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                <div>
                  <h3 className="text-xl font-bold text-stone-950 font-serif-display">
                    Your Skin Journey
                  </h3>
                  <p className="text-xs text-stone-500">
                    Continuous tracking of facial observations and barrier recovery
                  </p>
                </div>

                <button
                  onClick={() => navigate('/progress')}
                  className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Timeline &amp; Before/After</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Timeline graphic */}
              <div className="relative py-4 px-2">
                <div className="h-0.5 bg-stone-200 absolute left-6 right-6 top-1/2 -translate-y-1/2" />
                <div className="relative z-10 flex justify-between items-center">
                  {[
                    { date: 'Sep 01', type: 'Baseline Scan', score: '68%' },
                    { date: 'Sep 15', type: 'Routine Adjust', score: '72%' },
                    { date: 'Sep 24', type: 'Latest Analysis', score: '74%', current: true },
                  ].map((node, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-xs ${
                        node.current
                          ? 'bg-stone-950 border-stone-950 text-white'
                          : 'bg-white border-stone-300 text-stone-600'
                      }`}>
                        ●
                      </div>
                      <span className="text-[11px] font-bold text-stone-900 mt-2">{node.date}</span>
                      <span className="text-[10px] text-stone-500">{node.type}</span>
                      <span className="text-[10px] font-mono font-bold text-teal-700">{node.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trend cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div
                  onClick={() => navigate('/progress')}
                  className="p-3.5 rounded-2xl bg-[#faf8f5] border border-stone-200/70 text-xs cursor-pointer hover:border-stone-400 hover:shadow-2xs transition"
                  title="View Hydration trend in Progress"
                >
                  <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Hydration</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-stone-900 text-sm">
                    <span className="text-emerald-600">↑</span>
                    <span>+6% Pace</span>
                  </div>
                </div>

                <div
                  onClick={() => navigate('/progress')}
                  className="p-3.5 rounded-2xl bg-[#faf8f5] border border-stone-200/70 text-xs cursor-pointer hover:border-stone-400 hover:shadow-2xs transition"
                  title="View Texture trend in Progress"
                >
                  <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Texture</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-stone-900 text-sm">
                    <span className="text-teal-600">→</span>
                    <span>Smooth</span>
                  </div>
                </div>

                <div
                  onClick={() => navigate('/progress')}
                  className="p-3.5 rounded-2xl bg-[#faf8f5] border border-stone-200/70 text-xs cursor-pointer hover:border-stone-400 hover:shadow-2xs transition"
                  title="View Oil Balance trend in Progress"
                >
                  <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Oil Balance</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-stone-900 text-sm">
                    <span className="text-emerald-600">↑</span>
                    <span>Regulating</span>
                  </div>
                </div>

                <div
                  onClick={() => navigate('/progress')}
                  className="p-3.5 rounded-2xl bg-[#faf8f5] border border-stone-200/70 text-xs cursor-pointer hover:border-stone-400 hover:shadow-2xs transition"
                  title="View Routine Adherence in Progress"
                >
                  <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Routine Adherence</span>
                  <div className="flex items-center gap-1.5 mt-1 font-bold text-stone-900 text-sm">
                    <span className="text-teal-700">82%</span>
                    <span className="text-stone-400 text-xs">Goal</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 15. YOUR WELLNESS */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-stone-950 font-serif-display">
                    Your Wellness
                  </h3>
                  <p className="text-xs text-stone-500">
                    Nutrition and lifestyle habits that support radiant epidermal vitality
                  </p>
                </div>
                <button
                  onClick={() => navigate('/wellness')}
                  className="text-xs font-bold text-teal-800 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Wellness →</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => navigate('/wellness')}
                  className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/70 space-y-2 cursor-pointer hover:border-stone-400 hover:shadow-2xs transition"
                  title="Open Hydration tracking"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-stone-900">Hydration</strong>
                    <Droplets className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="text-lg font-bold text-stone-900 font-mono">1,600 / 2,500 ml</div>
                  <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '64%' }} />
                  </div>
                  <p className="text-[11px] text-stone-500">Keep daily hydration checkpoints consistent.</p>
                </div>

                <div
                  onClick={() => navigate('/wellness')}
                  className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/70 space-y-2 cursor-pointer hover:border-stone-400 hover:shadow-2xs transition"
                  title="Open Sleep schedule"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-stone-900">Sleep</strong>
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="text-lg font-bold text-stone-900 font-mono">7–8 hours</div>
                  <p className="text-[11px] text-stone-500">Nocturnal cellular repair occurs primarily during deep sleep stages.</p>
                </div>

                <div
                  onClick={() => navigate('/wellness')}
                  className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/70 space-y-2 cursor-pointer hover:border-stone-400 hover:shadow-2xs transition"
                  title="Open Sun Protection guidelines"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-stone-900">Sun Protection</strong>
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div className="text-lg font-bold text-stone-900 font-mono">SPF 50 Daily</div>
                  <p className="text-[11px] text-stone-500">Broad-spectrum shield against collagen degradation.</p>
                </div>

                <div
                  onClick={() => navigate('/wellness')}
                  className="p-4 rounded-2xl bg-[#faf8f5] border border-stone-200/70 space-y-2 cursor-pointer hover:border-stone-400 hover:shadow-2xs transition"
                  title="Open Lifestyle & Nutrition plan"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-xs font-bold text-stone-900">Lifestyle</strong>
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                  </div>
                  <div className="text-lg font-bold text-stone-900 font-mono">Anti-Inflammatory</div>
                  <p className="text-[11px] text-stone-500">Antioxidant-rich fresh fruits, seeds, and leafy greens.</p>
                </div>
              </div>
            </section>

            {/* 16. AI COACH ENTRY CARD */}
            <section className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-5">
              <div className="space-y-1.5 relative z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✦ Ask Skina AI</span>
                </div>
                <h3 className="text-2xl font-serif-display font-normal">
                  What would you like help with today?
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Personalized guidance connected directly to your skin scans, routine products, and active ingredients.
                </p>
              </div>

              {/* Prompt chips */}
              <div className="flex flex-wrap gap-2 relative z-10">
                {suggestedPrompts.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleAskCoach(chip)}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-medium border border-white/15 transition cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input box */}
              <div className="relative z-10 max-w-2xl flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask anything about your routine or active ingredients..."
                  value={coachInput}
                  onChange={(e) => setCoachInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAskCoach();
                  }}
                  className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-stone-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-400 transition"
                />
                <button
                  onClick={() => handleAskCoach()}
                  className="px-6 py-3 rounded-full bg-teal-400 hover:bg-teal-300 text-stone-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
                >
                  <span>Ask AI →</span>
                </button>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* QUICK PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800">
                {selectedProduct.brand}
              </span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-stone-950 text-base font-serif-display">
                {selectedProduct.name}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs space-y-1">
              <strong className="font-bold text-stone-900 block">How to use:</strong>
              <p className="text-stone-600">{selectedProduct.usageInstructions}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-stone-900">
                {formatPrice(selectedProduct.priceTZS, selectedProduct.priceUSD)}
              </span>
              <button
                onClick={() => {
                  toggleFavorite(selectedProduct.id);
                  setSelectedProduct(null);
                }}
                className="px-4 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold cursor-pointer"
              >
                {favorites.includes(selectedProduct.id) ? 'Saved in Favorites' : 'Save to Favorites'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEE WHY MODAL */}
      {seeWhyProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h4 className="font-bold text-stone-950 text-sm">Why Skina Recommends This</h4>
              </div>
              <button
                onClick={() => setSeeWhyProduct(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-teal-900">
                <strong className="block font-bold mb-1">Dermatological Logic:</strong>
                <p className="leading-relaxed">
                  "Selected for your Combination profile. Its catalog formulation contains non-comedogenic humectants that elevate hydration without increasing T-zone sebum sheen."
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <span className="font-bold text-stone-800 block">Active Ingredients:</span>
                <p className="text-stone-600">{seeWhyProduct.activeIngredients.join(', ')}</p>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-stone-800 block">Compatibility:</span>
                <p className="text-stone-600">No conflicts with current morning or evening routine sequence.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSeeWhyProduct(null)}
                className="w-full py-2.5 rounded-full bg-stone-950 text-white text-xs font-bold cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
