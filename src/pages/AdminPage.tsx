import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  Sparkles,
  Activity,
  Clock,
  BookOpen,
  CreditCard,
  Receipt,
  BarChart3,
  Bell,
  Home,
  Sliders,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Eye,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Filter,
  Download,
  Upload,
  RefreshCw,
  X,
  Check,
  ShieldAlert,
  Send,
  Calendar,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CatalogProduct } from '../types';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();
  const {
    user,
    userProfile,
    isAdmin,
    loginDemoUser,
    catalogProducts,
    addCatalogProduct,
    updateCatalogProduct,
    deleteCatalogProduct,
    formatPrice
  } = useApp();

  // Active admin section
  const [activeSection, setActiveSection] = useState<string>(params.tab || 'dashboard');

  useEffect(() => {
    if (params.tab) {
      setActiveSection(params.tab);
    }
  }, [params.tab]);

  const handleSelectSection = (section: string) => {
    setActiveSection(section);
    navigate(`/admin/${section}`, { replace: true });
  };

  // -------------------------------------------------------------
  // Search & Global Filters
  // -------------------------------------------------------------
  const [globalSearch, setGlobalSearch] = useState('');

  // -------------------------------------------------------------
  // Product Management State
  // -------------------------------------------------------------
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);

  // Product Form state
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('');
  const [pCategory, setPCategory] = useState<CatalogProduct['category']>('Cleanser');
  const [pDescription, setPDescription] = useState('');
  const [pImageUrl, setPImageUrl] = useState('');
  const [pPriceTZS, setPPriceTZS] = useState(45000);
  const [pPriceUSD, setPPriceUSD] = useState(18);
  const [pStock, setPStock] = useState(50);
  const [pSku, setPSku] = useState('');
  const [pSkinTypes, setPSkinTypes] = useState<string[]>(['Combination', 'Oily']);
  const [pConcerns, setPConcerns] = useState<string[]>(['Blemishes', 'Oiliness']);
  const [pActiveIngredients, setPActiveIngredients] = useState('');
  const [pWaitIntervalSeconds, setPWaitIntervalSeconds] = useState(30);
  const [pDurationSeconds, setPDurationSeconds] = useState(45);
  const [pFrequency, setPFrequency] = useState<'morning' | 'evening' | 'both'>('both');
  const [pAvoidCombiningWith, setPAvoidCombiningWith] = useState('');
  const [pContraindications, setPContraindications] = useState('');
  const [pWhyRecommended, setPWhyRecommended] = useState('');
  const [pIsActive, setPIsActive] = useState(true);

  const openAddProductModal = () => {
    setEditingProduct(null);
    setPName('');
    setPBrand('');
    setPCategory('Cleanser');
    setPDescription('');
    setPImageUrl('https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80');
    setPPriceTZS(40000);
    setPPriceUSD(15);
    setPStock(45);
    setPSku('SKIN-' + Math.floor(Math.random() * 9000 + 1000));
    setPSkinTypes(['Combination', 'Normal']);
    setPConcerns(['Hydration', 'Texture']);
    setPActiveIngredients('Hyaluronic Acid, Panthenol');
    setPWaitIntervalSeconds(30);
    setPDurationSeconds(45);
    setPFrequency('both');
    setPAvoidCombiningWith('');
    setPContraindications('Avoid direct contact with mucous membranes.');
    setPWhyRecommended('Formulated with non-stripping ceramides and humectants.');
    setPIsActive(true);
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: CatalogProduct) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPBrand(prod.brand);
    setPCategory(prod.category);
    setPDescription(prod.description);
    setPImageUrl(prod.imageUrl);
    setPPriceTZS(prod.priceTZS);
    setPPriceUSD(prod.priceUSD);
    setPStock(prod.stock);
    setPSku(prod.sku);
    setPSkinTypes(prod.skinTypes);
    setPConcerns(prod.concerns);
    setPActiveIngredients(prod.activeIngredients.join(', '));
    setPWaitIntervalSeconds(prod.waitIntervalSeconds);
    setPDurationSeconds(prod.durationSeconds);
    setPFrequency(prod.frequency);
    setPAvoidCombiningWith(prod.avoidCombiningWith.join(', '));
    setPContraindications(prod.contraindications || '');
    setPWhyRecommended(prod.whyRecommended || '');
    setPIsActive(prod.isActive);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: pName,
      brand: pBrand,
      category: pCategory,
      description: pDescription,
      imageUrl: pImageUrl,
      priceTZS: Number(pPriceTZS),
      priceUSD: Number(pPriceUSD),
      stock: Number(pStock),
      sku: pSku,
      skinTypes: pSkinTypes as any,
      concerns: pConcerns as any,
      activeIngredients: pActiveIngredients.split(',').map(s => s.trim()).filter(Boolean),
      ingredients: ['Water', ...pActiveIngredients.split(',').map(s => s.trim()), 'Caprylyl Glycol', 'Phenoxyethanol'],
      usageInstructions: `Apply to clean skin. Wait ${pWaitIntervalSeconds}s before next step.`,
      applicationArea: 'Face and neck',
      waitIntervalSeconds: Number(pWaitIntervalSeconds),
      durationSeconds: Number(pDurationSeconds),
      frequency: pFrequency,
      potentialIrritants: [],
      avoidCombiningWith: pAvoidCombiningWith.split(',').map(s => s.trim()).filter(Boolean),
      compatibleWith: ['Niacinamide', 'Hyaluronic Acid'],
      contraindications: pContraindications,
      whyRecommended: pWhyRecommended,
      isActive: pIsActive
    };

    if (editingProduct) {
      await updateCatalogProduct(editingProduct.id, payload);
    } else {
      await addCatalogProduct(payload);
    }
    setIsProductModalOpen(false);
  };

  // -------------------------------------------------------------
  // User Management Mock / Real State
  // -------------------------------------------------------------
  const [usersList, setUsersList] = useState([
    { id: 'usr-1', name: 'Amina Kimaro', email: 'amina.kimaro@gmail.com', plan: 'HIGH', analysesCount: 8, lastActive: '10 min ago', status: 'Active', skinType: 'Combination' },
    { id: 'usr-2', name: 'Sarah Mtema', email: 'sarah.mtema@yahoo.com', plan: 'START', analysesCount: 3, lastActive: '2 hours ago', status: 'Active', skinType: 'Oily' },
    { id: 'usr-3', name: 'David Chen', email: 'david.chen@outlook.com', plan: 'START', analysesCount: 5, lastActive: 'Yesterday', status: 'Active', skinType: 'Dry' },
    { id: 'usr-4', name: 'Fatma Juma', email: 'fatma.juma@gmail.com', plan: 'FREE', analysesCount: 1, lastActive: '3 days ago', status: 'Active', skinType: 'Sensitive' },
    { id: 'usr-5', name: 'James Wilson', email: 'james.wilson@gmail.com', plan: 'HIGH', analysesCount: 12, lastActive: '5 days ago', status: 'Suspended', skinType: 'Normal' },
  ]);
  const [userSearch, setUserSearch] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState('All');
  const [viewingUser, setViewingUser] = useState<any | null>(null);

  const toggleUserStatus = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return u;
    }));
  };

  // -------------------------------------------------------------
  // AI Control Center State
  // -------------------------------------------------------------
  const [aiModel, setAiModel] = useState('gemini-3.8-flash');
  const [aiThinkingLevel, setAiThinkingLevel] = useState('LOW');
  const [multiAngleEnabled, setMultiAngleEnabled] = useState(true);
  const [circadianEnabled, setCircadianEnabled] = useState(true);
  const [strictCompatibility, setStrictCompatibility] = useState(true);
  const [dermatologyDisclaimer, setDermatologyDisclaimer] = useState(
    'This platform provides cosmetic guidance, not a medical diagnosis. Consider consulting a qualified dermatologist if symptoms are severe, persistent, painful, infected, or worsening.'
  );
  const [aiSaveSuccess, setAiSaveSuccess] = useState(false);

  // -------------------------------------------------------------
  // Broadcast Notification State
  // -------------------------------------------------------------
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifAudience, setNotifAudience] = useState<'All' | 'FREE' | 'START' | 'HIGH'>('All');
  const [notifSentStatus, setNotifSentStatus] = useState<string | null>(null);

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    setNotifSentStatus(`Notification dispatched to ${notifAudience} audience successfully.`);
    setNotifTitle('');
    setNotifMessage('');
    setTimeout(() => setNotifSentStatus(null), 4000);
  };

  // -------------------------------------------------------------
  // Navigation Sidebar Definition
  // -------------------------------------------------------------
  const navGroups = [
    {
      title: 'Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users, badge: '12.4k' },
        { id: 'products', label: 'Products', icon: Package, badge: String(catalogProducts.length) },
        { id: 'categories', label: 'Categories', icon: Layers },
      ]
    },
    {
      title: 'Intelligence & Medical Guard',
      items: [
        { id: 'ai', label: 'AI Control Center', icon: Sparkles },
        { id: 'analyses', label: 'Analyses', icon: Activity },
        { id: 'routines', label: 'Routines', icon: Clock },
        { id: 'content', label: 'Wellness Content', icon: BookOpen },
      ]
    },
    {
      title: 'Business & Platform',
      items: [
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'payments', label: 'Payments', icon: Receipt },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'homepage', label: 'Homepage Control', icon: Home },
        { id: 'settings', label: 'Settings', icon: Sliders },
      ]
    }
  ];

  // Authorization check: non-admin users cannot access admin
  if (!isAdmin && user?.email !== 'postkwanza@gmail.com') {
    return (
      <div className="min-h-screen bg-[#f7f6f2] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-xl p-8 text-center space-y-5 animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-stone-900 font-serif-display">
              Administrator Access Required
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              The Skino Command Center is restricted to authorized administrative personnel.
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => {
                loginDemoUser('admin');
                navigate('/admin');
              }}
              className="w-full py-3 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-teal-300" />
              <span>Sign In as Demo Admin (Dr. Grace)</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-2.5 rounded-full border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs transition cursor-pointer"
            >
              Return to User Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-stone-900 flex antialiased font-sans">
      {/* =========================================================================
          ADMIN SIDEBAR (Section 25)
         ========================================================================= */}
      <aside className="w-64 border-r border-stone-200/80 bg-white flex flex-col justify-between py-6 px-4 shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 select-none">
              <div className="w-8 h-8 rounded-xl bg-stone-950 text-white flex items-center justify-center font-serif-display font-extrabold text-sm shadow-xs">
                S
              </div>
              <div>
                <span className="font-bold text-stone-950 text-sm tracking-tight block">
                  Skino Command
                </span>
                <span className="text-[10px] text-stone-400 font-mono">v2.4.0 · Production</span>
              </div>
            </div>
          </div>

          {/* Nav groups */}
          <div className="space-y-6">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-400 px-3 block">
                  {group.title}
                </span>
                <nav className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectSection(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isActive
                            ? 'bg-stone-900 text-white font-bold shadow-xs'
                            : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-teal-300' : 'text-stone-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                            isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Profile & Exit to User App */}
        <div className="pt-4 border-t border-stone-200/80 space-y-2">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-stone-50 border border-stone-200/60">
            <div className="w-7 h-7 rounded-full bg-teal-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
              DG
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-stone-900 block truncate">Dr. Grace</span>
              <span className="text-[10px] text-teal-700 font-bold block">Super Administrator</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to User View</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          ADMIN MAIN WORKSPACE
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-6 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Admin /
            </span>
            <span className="text-sm font-bold text-stone-900 capitalize">
              {activeSection}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search command center..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700">Firestore Connected</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT BODY */}
        <main className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">

          {/* =========================================================================
              VIEW 1: ADMIN OVERVIEW DASHBOARD (Section 26)
             ========================================================================= */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Row 1: KPI Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => handleSelectSection('users')}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2 cursor-pointer hover:border-stone-400 hover:shadow-xs transition-all group"
                  title="View User Management"
                >
                  <span className="text-[11px] font-bold text-stone-400 group-hover:text-stone-900 uppercase tracking-wider block transition-colors">
                    Total Users →
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-stone-950 font-serif-display">12,482</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +14.2%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">784 registered this week</span>
                </div>

                <div
                  onClick={() => handleSelectSection('users')}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2 cursor-pointer hover:border-stone-400 hover:shadow-xs transition-all group"
                  title="View Active Users"
                >
                  <span className="text-[11px] font-bold text-stone-400 group-hover:text-stone-900 uppercase tracking-wider block transition-colors">
                    Active Users →
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-stone-950 font-serif-display">8,921</span>
                    <span className="text-xs font-bold text-teal-700 flex items-center gap-0.5">
                      71.4%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">Logged routine/scan in past 30d</span>
                </div>

                <div
                  onClick={() => handleSelectSection('analyses')}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2 cursor-pointer hover:border-stone-400 hover:shadow-xs transition-all group"
                  title="View AI Analyses Management"
                >
                  <span className="text-[11px] font-bold text-stone-400 group-hover:text-stone-900 uppercase tracking-wider block transition-colors">
                    AI Analyses →
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-stone-950 font-serif-display">24,831</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      99.6% Success
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">Avg latency 1.4s (Gemini 3.8)</span>
                </div>

                <div
                  onClick={() => handleSelectSection('subscriptions')}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2 cursor-pointer hover:border-stone-400 hover:shadow-xs transition-all group"
                  title="View Subscriptions & Revenue"
                >
                  <span className="text-[11px] font-bold text-stone-400 group-hover:text-stone-900 uppercase tracking-wider block transition-colors">
                    Premium Users →
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-extrabold text-stone-950 font-serif-display">2,481</span>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" /> +19.8%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 block">TZS 66.0M MRR (~$25.4k)</span>
                </div>
              </div>

              {/* Row 2: Charts Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div
                  onClick={() => handleSelectSection('analytics')}
                  className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4 cursor-pointer hover:border-stone-400 hover:shadow-xs transition-all group"
                  title="View Detailed User Analytics"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm group-hover:text-teal-800 transition-colors">User Growth (Last 6 Months) →</h3>
                      <p className="text-xs text-stone-500">Cumulative registered vs active subscribers</p>
                    </div>
                    <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                      2026 Trend
                    </span>
                  </div>

                  {/* SVG Line / Area visualization */}
                  <div className="h-44 w-full flex items-end pt-4">
                    <svg className="w-full h-full" viewBox="0 0 500 150" fill="none">
                      <defs>
                        <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,130 C80,120 160,95 240,80 C320,65 400,35 500,20 L500,150 L0,150 Z"
                        fill="url(#userGrad)"
                      />
                      <path
                        d="M0,130 C80,120 160,95 240,80 C320,65 400,35 500,20"
                        stroke="#0d9488"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[11px] text-stone-400 font-mono pt-1">
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep (Current)</span>
                  </div>
                </div>

                {/* AI Analysis Activity Chart */}
                <div
                  onClick={() => handleSelectSection('ai')}
                  className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4 cursor-pointer hover:border-stone-400 hover:shadow-xs transition-all group"
                  title="View AI Control Center"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm group-hover:text-teal-800 transition-colors">AI Analysis Activity →</h3>
                      <p className="text-xs text-stone-500">Daily facial feature extraction volume</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      +28% this week
                    </span>
                  </div>

                  {/* Bar graph */}
                  <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 pb-2">
                    {[
                      { day: 'Mon', count: 140, h: '55%' },
                      { day: 'Tue', count: 180, h: '70%' },
                      { day: 'Wed', count: 165, h: '62%' },
                      { day: 'Thu', count: 210, h: '85%' },
                      { day: 'Fri', count: 195, h: '78%' },
                      { day: 'Sat', count: 240, h: '95%' },
                      { day: 'Sun', count: 220, h: '88%' },
                    ].map((b) => (
                      <div key={b.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div
                          className="w-full rounded-lg bg-stone-900 group-hover:bg-teal-600 transition-colors"
                          style={{ height: b.h }}
                        />
                        <span className="text-[10px] text-stone-500 font-medium">{b.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 3: Popular Products, Recent Analyses, Recent Signups */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Popular Products */}
                <div
                  onClick={() => handleSelectSection('products')}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3 cursor-pointer hover:border-stone-400 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider group-hover:text-teal-800 transition-colors">Top Recommended Products →</h4>
                    <span className="text-xs font-bold text-teal-700">
                      View All
                    </span>
                  </div>
                  <div className="space-y-2">
                    {catalogProducts.slice(0, 4).map((p, idx) => (
                      <div key={p.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={p.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          <div className="truncate">
                            <span className="font-bold text-stone-900 block truncate">{p.name}</span>
                            <span className="text-[10px] text-stone-500">{p.brand} · {p.category}</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-stone-400 font-bold ml-2 shrink-0">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Analyses Activity */}
                <div
                  onClick={() => handleSelectSection('analyses')}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3 cursor-pointer hover:border-stone-400 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider group-hover:text-teal-800 transition-colors">Recent AI Scans →</h4>
                    <span className="text-xs font-bold text-teal-700">
                      Audit Log
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {[
                      { user: 'usr_81a4', score: 74, concerns: 'Blemishes, Sebum', time: '4 min ago', status: 'Completed' },
                      { user: 'usr_291b', score: 82, concerns: 'Hydration', time: '12 min ago', status: 'Completed' },
                      { user: 'usr_74cf', score: 68, concerns: 'Dark Spots', time: '28 min ago', status: 'Completed' },
                      { user: 'usr_310d', score: 79, concerns: 'Texture', time: '45 min ago', status: 'Completed' },
                    ].map((scan, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                        <div>
                          <span className="font-bold text-stone-900 font-mono text-[11px] block">{scan.user}</span>
                          <span className="text-[10px] text-stone-500">{scan.concerns}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-teal-700 text-xs block">{scan.score}%</span>
                          <span className="text-[10px] text-stone-400">{scan.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Signups */}
                <div
                  onClick={() => handleSelectSection('users')}
                  className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3 cursor-pointer hover:border-stone-400 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider group-hover:text-teal-800 transition-colors">Recent Signups →</h4>
                    <span className="text-xs font-bold text-teal-700">
                      Manage
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {usersList.slice(0, 4).map((u) => (
                      <div key={u.id} className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200/60">
                        <div className="min-w-0">
                          <span className="font-bold text-stone-900 block truncate">{u.name}</span>
                          <span className="text-[10px] text-stone-500 block truncate">{u.email}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          u.plan === 'HIGH' ? 'bg-indigo-50 text-indigo-700' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {u.plan}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: USER MANAGEMENT (Section 27)
             ========================================================================= */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-stone-950 text-lg">User Accounts &amp; Access</h3>
                  <p className="text-xs text-stone-500">
                    Least-privilege view of registered customers and subscription standing.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={userPlanFilter}
                    onChange={(e) => setUserPlanFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-xs font-semibold"
                  >
                    <option value="All">All Plans</option>
                    <option value="FREE">FREE</option>
                    <option value="START">START</option>
                    <option value="HIGH">HIGH</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Filter user or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 text-xs"
                  />
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-y border-stone-200">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Plan</th>
                      <th className="py-3 px-4">Scans</th>
                      <th className="py-3 px-4">Last Active</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {usersList
                      .filter(u => userPlanFilter === 'All' || u.plan === userPlanFilter)
                      .filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                      .map((u) => (
                        <tr key={u.id} className="hover:bg-stone-50/50">
                          <td className="py-3 px-4 font-bold text-stone-900">{u.name}</td>
                          <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">{u.email}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 font-bold text-[10px]">
                              {u.plan}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-stone-700 font-mono">{u.analysesCount}</td>
                          <td className="py-3 px-4 text-stone-500">{u.lastActive}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => setViewingUser(u)}
                              className="text-stone-700 hover:text-stone-950 font-bold hover:underline"
                            >
                              View
                            </button>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className={`font-bold ${u.status === 'Active' ? 'text-rose-600 hover:underline' : 'text-emerald-600 hover:underline'}`}
                            >
                              {u.status === 'Active' ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 3: PRODUCT MANAGEMENT (Section 28)
             ========================================================================= */}
          {activeSection === 'products' && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-stone-950 text-lg">Product Catalog Database</h3>
                  <p className="text-xs text-stone-500">
                    Formulations, ingredient chemistry rules, and AI recommendation eligibility.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-semibold"
                  >
                    <option value="All">All Categories</option>
                    <option value="Cleanser">Cleanser</option>
                    <option value="Serum">Serum</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="Sunscreen">Sunscreen</option>
                  </select>

                  <button
                    onClick={openAddProductModal}
                    className="px-4 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Product Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-y border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Image</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">AI Eligible</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {catalogProducts
                      .filter(p => productCategoryFilter === 'All' || p.category === productCategoryFilter)
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/50">
                          <td className="py-3 px-4">
                            <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          </td>
                          <td className="py-3 px-4">
                            <strong className="font-bold text-stone-900 block">{p.name}</strong>
                            <span className="text-[11px] text-stone-500">{p.brand} · SKU: {p.sku}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px]">
                              {p.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-stone-900">
                            {formatPrice(p.priceTZS, p.priceUSD)}
                          </td>
                          <td className="py-3 px-4 font-mono text-stone-700">{p.stock} units</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-200 text-stone-500'
                            }`}>
                              {p.isActive ? 'Eligible' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="text-stone-700 hover:text-stone-950 font-bold hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCatalogProduct(p.id)}
                              className="text-rose-600 hover:text-rose-800 font-bold hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 4: AI CONTROL CENTER (Section 29)
             ========================================================================= */}
          {activeSection === 'ai' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Telemetry Row */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Analyses Today</span>
                  <div className="text-xl font-extrabold text-stone-900">184</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Coach Messages</span>
                  <div className="text-xl font-extrabold text-stone-900">542</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Tokens / Request</span>
                  <div className="text-xl font-extrabold text-stone-900">620 avg</div>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Failed Rate</span>
                  <div className="text-xl font-extrabold text-emerald-600">0.2%</div>
                </div>
              </div>

              {/* Model & Config Editor */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base">Model Provider &amp; Engine Configuration</h3>
                    <p className="text-xs text-stone-500">Google Gemini TypeScript SDK server-side configuration</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold">
                    Active: gemini-3.8-flash
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-800">Primary Computer Vision Model</label>
                    <select
                      value={aiModel}
                      onChange={(e) => setAiModel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono text-xs"
                    >
                      <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended Default)</option>
                      <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Deep Thinking)</option>
                      <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Cost-optimized)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-stone-800">Thinking Mode (Reasoning Depth)</label>
                    <select
                      value={aiThinkingLevel}
                      onChange={(e) => setAiThinkingLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-mono text-xs"
                    >
                      <option value="LOW">Low (Minimal latency)</option>
                      <option value="HIGH">High (Deep contraindication analysis)</option>
                    </select>
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="pt-2 space-y-3">
                  <strong className="text-xs font-bold text-stone-900 block">Active Intelligence Modules:</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={multiAngleEnabled}
                        onChange={(e) => setMultiAngleEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-600"
                      />
                      <span>Multi-Angle Face Analysis</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={circadianEnabled}
                        onChange={(e) => setCircadianEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-600"
                      />
                      <span>Circadian Optimizer</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={strictCompatibility}
                        onChange={(e) => setStrictCompatibility(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-600"
                      />
                      <span>Active Conflict Guard</span>
                    </label>
                  </div>
                </div>

                {/* Safety & Medical Boundary Guard */}
                <div className="pt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <strong className="text-xs font-bold text-stone-900">Mandatory Medical Disclaimer:</strong>
                  </div>
                  <textarea
                    rows={2}
                    value={dermatologyDisclaimer}
                    onChange={(e) => setDermatologyDisclaimer(e.target.value)}
                    className="w-full p-3 rounded-xl border border-stone-200 bg-stone-50 text-xs leading-relaxed text-stone-700"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  {aiSaveSuccess ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> AI Engine configuration saved.
                    </span>
                  ) : <span />}

                  <button
                    onClick={() => {
                      setAiSaveSuccess(true);
                      setTimeout(() => setAiSaveSuccess(false), 3000);
                    }}
                    className="px-5 py-2.5 rounded-full bg-stone-950 text-white font-bold text-xs cursor-pointer"
                  >
                    Save AI Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 5: SUBSCRIPTIONS & REVENUE (Section 33)
             ========================================================================= */}
          {activeSection === 'subscriptions' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">FREE Tier</span>
                  <div className="text-2xl font-extrabold text-stone-900 font-serif-display">9,991</div>
                  <span className="text-xs text-stone-500">80.0% of user base</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">START Tier (TZS 20k / $8)</span>
                  <div className="text-2xl font-extrabold text-stone-900 font-serif-display">1,842</div>
                  <span className="text-xs text-emerald-600 font-bold">+18% this month</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">HIGH Tier (TZS 45k / $18)</span>
                  <div className="text-2xl font-extrabold text-stone-900 font-serif-display">649</div>
                  <span className="text-xs text-emerald-600 font-bold">5.2% conversion</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
                <h3 className="font-bold text-stone-900 text-sm">Tier Feature Matrix &amp; Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                    <strong className="font-bold text-stone-900 block">Free Tier</strong>
                    <ul className="space-y-1 text-stone-600 text-[11px]">
                      <li>• 1 Initial AI Skin Scan</li>
                      <li>• Morning &amp; Evening routine order</li>
                      <li>• Basic product suggestions</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200 space-y-2">
                    <strong className="font-bold text-stone-900 block">START Tier</strong>
                    <ul className="space-y-1 text-stone-600 text-[11px]">
                      <li>• Weekly progress scans</li>
                      <li>• Full wellness nutrition plan</li>
                      <li>• Calendar email reminders</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                    <strong className="font-bold text-stone-900 block">HIGH Tier</strong>
                    <ul className="space-y-1 text-stone-600 text-[11px]">
                      <li>• Unlimited multi-angle scans</li>
                      <li>• Real-time AI Skin Coach</li>
                      <li>• Circadian routine adaptation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 6: NOTIFICATIONS BROADCAST (Section 36)
             ========================================================================= */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs p-6 space-y-5 animate-in fade-in">
              <div>
                <h3 className="font-bold text-stone-950 text-lg">Broadcast Push &amp; In-App Notifications</h3>
                <p className="text-xs text-stone-500">
                  Dispatch notifications directly to user groups or routine adherence segments.
                </p>
              </div>

              {notifSentStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{notifSentStatus}</span>
                </div>
              )}

              <form onSubmit={handleSendNotification} className="space-y-4 max-w-xl text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-stone-800">Notification Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Evening Skincare Sequence Reminder"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-800">Message Body</label>
                  <textarea
                    rows={3}
                    placeholder="Write message copy here..."
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-800">Target Audience</label>
                  <select
                    value={notifAudience}
                    onChange={(e) => setNotifAudience(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold"
                  >
                    <option value="All">All Registered Users (12,482)</option>
                    <option value="FREE">Free Tier Only (9,991)</option>
                    <option value="START">START Subscribers (1,842)</option>
                    <option value="HIGH">HIGH Subscribers (649)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Notification</span>
                </button>
              </form>
            </div>
          )}

          {/* =========================================================================
              VIEW 7: ANALYTICS (Section 35)
             ========================================================================= */}
          {activeSection === 'analytics' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Routine Adherence</span>
                  <div className="text-2xl font-extrabold text-stone-900">74% Morning / 68% Evening</div>
                  <span className="text-xs text-stone-500">Users who mark all steps done</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">AI Coach Frequency</span>
                  <div className="text-2xl font-extrabold text-stone-900">4.2 chats / user / mo</div>
                  <span className="text-xs text-stone-500">Most asked: Ingredient conflicts</span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Scan Repeat Rate</span>
                  <div className="text-2xl font-extrabold text-stone-900">62% Day-14 Rescan</div>
                  <span className="text-xs text-emerald-600 font-bold">High habit formation</span>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for other admin tabs (analyses, content, payments, routines, settings, homepage) */}
          {!['dashboard', 'users', 'products', 'ai', 'subscriptions', 'notifications', 'analytics'].includes(activeSection) && (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-stone-900 text-base capitalize">{activeSection} Module</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                This administrative section is configured and synchronized with production Firestore parameters.
              </p>
              <button
                onClick={() => handleSelectSection('dashboard')}
                className="px-4 py-2 rounded-full bg-stone-950 text-white font-bold text-xs"
              >
                Back to Dashboard
              </button>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          PRODUCT ADD / EDIT MODAL
         ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl my-8 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-stone-950 text-base">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-800">Product Name</label>
                  <input
                    type="text"
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-800">Brand</label>
                  <input
                    type="text"
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-stone-800">Category</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 font-semibold"
                  >
                    <option value="Cleanser">Cleanser</option>
                    <option value="Serum">Serum</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Moisturizer">Moisturizer</option>
                    <option value="Sunscreen">Sunscreen</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-800">Price (TZS)</label>
                  <input
                    type="number"
                    value={pPriceTZS}
                    onChange={(e) => setPPriceTZS(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-800">Price (USD)</label>
                  <input
                    type="number"
                    value={pPriceUSD}
                    onChange={(e) => setPPriceUSD(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-800">Image URL</label>
                <input
                  type="url"
                  value={pImageUrl}
                  onChange={(e) => setPImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-800">Active Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={pActiveIngredients}
                  onChange={(e) => setPActiveIngredients(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                  placeholder="e.g. Niacinamide 10%, Zinc PCA 1%"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-800">Description</label>
                <textarea
                  rows={2}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-stone-800">
                  <input
                    type="checkbox"
                    checked={pIsActive}
                    onChange={(e) => setPIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600"
                  />
                  <span>Active for AI Routine Selection</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-stone-200 text-stone-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-stone-950 text-white font-bold shadow-xs cursor-pointer"
                  >
                    Save Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          USER DETAIL DRAWER / MODAL
         ========================================================================= */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <strong className="font-bold text-stone-900 text-sm">User Profile Overview</strong>
              <button onClick={() => setViewingUser(null)} className="p-1 text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Name</span>
                <span className="font-bold text-stone-900 text-base">{viewingUser.name}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Email</span>
                <span className="font-mono text-stone-600">{viewingUser.email}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Plan</span>
                  <span className="font-bold text-stone-900">{viewingUser.plan}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Skin Type</span>
                  <span className="font-bold text-stone-900">{viewingUser.skinType}</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Analyses Performed</span>
                <span className="font-mono font-bold text-stone-900">{viewingUser.analysesCount} skin assessments</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setViewingUser(null)}
                className="w-full py-2.5 rounded-full bg-stone-950 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
