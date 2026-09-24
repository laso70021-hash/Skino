/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { AuthModal } from './components/AuthModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ScanPage } from './pages/ScanPage';
import { ScanResultsPage } from './pages/ScanResultsPage';
import { MySkinPage } from './pages/MySkinPage';
import { RoutinePage } from './pages/RoutinePage';
import { WellnessPage } from './pages/WellnessPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CalendarPage } from './pages/CalendarPage';
import { ProgressPage } from './pages/ProgressPage';
import { AICoachPage } from './pages/AICoachPage';
import { ProfilePage } from './pages/ProfilePage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function MainLayout() {
  const { isDarkMode } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isDashboardPage = location.pathname === '/dashboard';
  const isLandingPage = location.pathname === '/' || location.pathname === '/home';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0c0a09] text-stone-100' : 'bg-[#faf8f5] text-stone-900'} flex flex-col font-sans transition-colors duration-300`}>
      <ScrollToTop />

      {/* Top Main Navigation (only on consumer screens) */}
      {!isAdminPage && <Navbar onOpenAuth={() => setIsAuthOpen(true)} />}

      {/* Main Full-Page Route Outlet */}
      <main className="flex-1 w-full">
        <Routes>
          {/* 1. Home / Dashboard */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<HomePage initialView="dashboard" />} />

          {/* 2. AI Skin Scan */}
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/scan/results" element={<ScanResultsPage />} />
          <Route path="/scan/results/:id" element={<ScanResultsPage />} />

          {/* 3. My Skin */}
          <Route path="/skin" element={<MySkinPage />} />

          {/* 4. My Routine */}
          <Route path="/routine" element={<RoutinePage />} />

          {/* 5. Wellness */}
          <Route path="/wellness" element={<WellnessPage />} />

          {/* 6. Products */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* 7. Calendar */}
          <Route path="/calendar" element={<CalendarPage />} />

          {/* 8. Progress */}
          <Route path="/progress" element={<ProgressPage />} />

          {/* 9. AI Coach */}
          <Route path="/coach" element={<AICoachPage />} />

          {/* 10. Profile & Sub-routes */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/subscription" element={<SubscriptionPage />} />
          <Route path="/profile/settings" element={<SettingsPage />} />

          {/* 11. Admin Operations */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/:tab" element={<AdminPage />} />

          {/* Specification Aliases */}
          <Route path="/app/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/app/skin" element={<Navigate to="/skin" replace />} />
          <Route path="/app/routine" element={<Navigate to="/routine" replace />} />
          <Route path="/app/products" element={<Navigate to="/products" replace />} />
          <Route path="/app/coach" element={<Navigate to="/coach" replace />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>

      {/* Footer for non-landing pages (Landing page has its own master footer, and admin/dashboard have dedicated shells) */}
      {!isLandingPage && !isAdminPage && !isDashboardPage && (
        <footer className="bg-white border-t border-stone-200 py-8 px-4 text-center text-xs text-stone-500 mb-16 xl:mb-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-900" />
              <span className="font-bold text-stone-800">Skin &amp; Wellness</span>
              <span>· Understand Your Skin. Build Your Routine. Improve Your Wellness.</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <a href="/profile/settings" className="hover:text-stone-900 transition">
                Privacy &amp; Data Control
              </a>
              <a href="/profile/subscription" className="hover:text-stone-900 transition">
                Subscription Plans
              </a>
              <span className="text-stone-400 hidden lg:inline">Cosmetic guidance only. Not medical diagnosis.</span>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation (only on consumer app, not admin) */}
      {!isAdminPage && <BottomNav />}

      {/* Small Action Modal: Sign-in / Create Profile */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
