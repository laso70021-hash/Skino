import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Sparkles,
  Clock,
  Droplets,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Mail,
  Zap,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  HeartPulse,
  Package,
  Layers,
  Activity,
  Bot,
  Smartphone,
  LayoutDashboard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SendDigestModal } from '../components/SendDigestModal';
import { MasterLandingPage } from '../components/MasterLandingPage';
import { SmartphoneExperience } from '../components/SmartphoneExperience';
import { UserDashboardView } from '../components/UserDashboardView';

interface HomePageProps {
  initialView?: 'landing' | 'phone' | 'dashboard';
}

export const HomePage: React.FC<HomePageProps> = ({ initialView = 'landing' }) => {
  const navigate = useNavigate();
  const {
    user,
    userProfile,
    latestAnalysis,
    morningRoutine,
    eveningRoutine,
    wellnessPlan,
    calendarEvents,
    toggleCalendarEvent,
    catalogProducts,
    formatPrice
  } = useApp();

  const [viewMode] = useState<'landing' | 'phone' | 'dashboard'>(initialView);
  const [isDigestOpen, setIsDigestOpen] = useState(false);

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
    <div className="w-full">
      {/* =========================================================================================
          VIEW MODE 1: MASTER LANDING PAGE (Attachment 1 Master UI)
         ========================================================================================= */}
      {viewMode === 'landing' && <MasterLandingPage />}

      {/* =========================================================================================
          VIEW MODE 2: SMARTPHONE RESPONSIVENESS (Attachment 2 reference)
         ========================================================================================= */}
      {viewMode === 'phone' && (
        <div className="bg-stone-100/70 p-4 sm:p-10 rounded-[36px] border border-stone-200/80 shadow-inner flex flex-col items-center justify-center space-y-6">
          <div className="text-center max-w-xl space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Attachment 2 Prototype
            </span>
            <h2 className="text-2xl font-extrabold text-stone-950 font-serif-display">
              Smartphone Responsiveness &amp; Interactive Screens
            </h2>
            <p className="text-xs text-stone-500">
              Direct implementation of the 3 reference mobile screens: Welcome Intro, Skincare Product Dashboard, and AI Skin Analysis.
            </p>
          </div>

          <SmartphoneExperience />
        </div>
      )}

      {/* =========================================================================================
          VIEW MODE 3: ACTIVE USER OS DASHBOARD
         ========================================================================================= */}
      {viewMode === 'dashboard' && (
        <UserDashboardView onOpenDigestModal={() => setIsDigestOpen(true)} />
      )}

      {/* Gmail Digest Action Modal */}
      <SendDigestModal isOpen={isDigestOpen} onClose={() => setIsDigestOpen(false)} />
    </div>
  );
};
