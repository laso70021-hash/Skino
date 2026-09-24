import React from 'react';
import {
  Camera,
  Sparkles,
  Clock,
  Droplets,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Bell,
  Mail,
  Zap,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  HeartPulse,
  Package
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface DashboardViewProps {
  onStartScan: () => void;
  onOpenDigestModal: () => void;
  onOpenSubscription: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartScan,
  onOpenDigestModal,
  onOpenSubscription
}) => {
  const {
    user,
    userProfile,
    latestAnalysis,
    morningRoutine,
    eveningRoutine,
    wellnessPlan,
    calendarEvents,
    setActiveTab,
    toggleCalendarEvent,
    notificationPermission,
    requestPushNotifications,
    sendLocalNotification,
    formatPrice,
    setIsDarkMode
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = calendarEvents.filter((e) => e.date === todayStr);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const completedTodayCount = todayEvents.filter((e) => e.completed).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Hero Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-teal-800 to-stone-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/20 to-transparent pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-teal-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Skin &amp; Wellness Operating System</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif-display">
            {greeting()}, {userProfile?.displayName || user?.email?.split('@')[0] || 'Friend'} 👋
          </h1>

          <p className="text-sm text-teal-100/90 leading-relaxed font-normal">
            Your personalized routine is tuned for your {userProfile?.skinType || 'Combination'} skin.
            Follow your structured application intervals today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={onStartScan}
            className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-bold text-xs shadow-lg shadow-teal-500/30 transition flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            <span>+ Start AI Skin Scan</span>
          </button>

          <button
            onClick={onOpenDigestModal}
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email Digest</span>
          </button>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Skin Health Score Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Current Skin Health</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +4% Progress
            </span>
          </div>

          <div className="my-4 flex items-center gap-5">
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" className="text-stone-100" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${((latestAnalysis?.skinHealthScore || 74) / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  className="text-teal-600"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-xl font-extrabold text-stone-900">
                {latestAnalysis?.skinHealthScore || 74}%
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="font-bold text-stone-800">Standardized Cosmetic Index</div>
              <p className="text-stone-500 text-[11px] leading-snug">
                Blemish recovery on schedule; hydration levels improved by 6%.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('progress')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center justify-between pt-3 border-t border-stone-100"
          >
            <span>View Timeline &amp; Before/After</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Today's Schedule Tracker */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Today's Checkpoints</span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
              {completedTodayCount} of {todayEvents.length} Done
            </span>
          </div>

          <div className="my-3 space-y-2 max-h-36 overflow-y-auto pr-1">
            {todayEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => toggleCalendarEvent(evt.id)}
                className={`p-2 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition ${
                  evt.completed
                    ? 'bg-emerald-50/60 border-emerald-200 text-stone-500 line-through'
                    : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                      evt.completed
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300'
                    }`}
                  >
                    {evt.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className="font-medium">{evt.title}</span>
                </div>
                <span className="text-[11px] font-mono text-stone-400">{evt.time}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('calendar')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center justify-between pt-3 border-t border-stone-100"
          >
            <span>Open Full Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Daily Hydration Counter */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Daily Hydration Target</span>
            <Droplets className="w-4 h-4 text-teal-600" />
          </div>

          <div className="my-3 space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-stone-900">1,600</span>
              <span className="text-xs font-semibold text-stone-500">/ 2,500 ml</span>
            </div>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-teal-600 h-full rounded-full" style={{ width: '64%' }} />
            </div>
            <p className="text-[11px] text-stone-500">
              Adequate hydration supports cutaneous microcirculation and reduces trans-epidermal water loss.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('wellness')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center justify-between pt-3 border-t border-stone-100"
          >
            <span>Log Hydration &amp; Nutrition</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Morning & Evening Routine Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Morning Routine Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                ☀️
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Morning Routine</h3>
                <p className="text-[11px] text-stone-500">
                  Target Time: {morningRoutine?.targetTime || '07:00'} · {morningRoutine?.steps.length || 4} steps
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('routine')}
              className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1"
            >
              <span>Run Routine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {(morningRoutine?.steps || []).slice(0, 3).map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[11px]">
                    {step.stepNumber}
                  </span>
                  <div>
                    <span className="font-bold text-stone-900">{step.productName}</span>
                    <span className="text-[11px] text-stone-500 block">{step.brand} · {step.category}</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-stone-500 text-right">
                  Wait: {step.waitIntervalSeconds}s
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            Total estimated application time: ~4 minutes
          </div>
        </div>

        {/* Evening Routine Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => {
                setIsDarkMode(true);
                setActiveTab('routine');
              }}
              title="Click to activate 20:30 Evening Routine (Dark Mode)"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                🌙
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Evening Routine</h3>
                <p className="text-[11px] text-stone-500">
                  Target Time: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{eveningRoutine?.targetTime || '20:30'}</span> · {eveningRoutine?.steps.length || 3} steps
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsDarkMode(true);
                setActiveTab('routine');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <span>Run Routine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {(eveningRoutine?.steps || []).slice(0, 3).map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[11px]">
                    {step.stepNumber}
                  </span>
                  <div>
                    <span className="font-bold text-stone-900">{step.productName}</span>
                    <span className="text-[11px] text-stone-500 block">{step.brand} · {step.category}</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-stone-500 text-right">
                  Wait: {step.waitIntervalSeconds}s
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            Actives buffered with soothing Panthenol balm
          </div>
        </div>
      </div>

      {/* AI Coach Teaser Card */}
      <div className="bg-gradient-to-r from-stone-900 to-teal-950 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-400 text-stone-950 font-bold uppercase tracking-wider">
              Thinking Mode
            </span>
            <span className="text-xs text-teal-300 font-medium">Powered by Gemini Pro</span>
          </div>
          <h3 className="text-xl font-bold font-serif-display">Have a question about your routine or active ingredients?</h3>
          <p className="text-xs text-stone-300 max-w-xl">
            Ask our AI Coach: “Can I use my BHA exfoliant tonight?”, “How do I layer Vitamin C with Niacinamide?”, or “Adjust my schedule for late gym.”
          </p>
        </div>

        <button
          onClick={() => setActiveTab('coach')}
          className="px-6 py-3 rounded-xl bg-teal-400 hover:bg-teal-300 text-stone-950 font-bold text-xs shrink-0 transition shadow-lg shadow-teal-400/20 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Chat with AI Coach</span>
        </button>
      </div>

      {/* Push Notification Bar */}
      {notificationPermission !== 'granted' && (
        <div className="bg-white p-4 rounded-xl border border-stone-200 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold text-stone-900">Enable Smart Push Reminders: </span>
              <span className="text-stone-600">Receive morning/evening application alerts and hydration notifications.</span>
            </div>
          </div>
          <button
            onClick={async () => {
              const granted = await requestPushNotifications();
              if (granted) {
                sendLocalNotification('SkinAI Reminders Active', 'You will receive reminders for morning and evening routines.');
              }
            }}
            className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-white font-bold hover:bg-stone-800 transition shrink-0"
          >
            Enable Reminders
          </button>
        </div>
      )}
    </div>
  );
};
