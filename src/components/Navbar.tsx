import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Menu,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CloseButton } from './common/CloseButton';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    userProfile,
    isAdmin,
    logout,
    isDarkMode,
    toggleDarkMode
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigation items matching the reference design (Public website navigation)
  const navItems = [
    { label: 'Home', sectionId: 'hero', route: '/home' },
    { label: 'How It Works', sectionId: 'how-it-works', route: '/home#how-it-works' },
    { label: 'AI Analysis', sectionId: 'ai-analysis', route: '/scan' },
    { label: 'Routine', sectionId: 'routine', route: '/routine' },
    { label: 'Wellness', sectionId: 'wellness', route: '/wellness' },
    { label: 'Pricing', sectionId: 'pricing', route: '/profile/subscription' },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    setMobileMenuOpen(false);

    // If on home/landing page and clicked a section
    if (location.pathname === '/' || location.pathname === '/home') {
      const el = document.getElementById(item.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Otherwise navigate to route or home with hash
    if (item.sectionId === 'hero') {
      navigate('/home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If direct route requested, or scroll to section on home
      navigate(item.route);
    }
  };

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand (Skin & Wellness with diamond icon) */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
            onClick={() => {
              navigate('/home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-8 h-8 rounded-full bg-stone-950 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-stone-200" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-stone-900 flex items-center gap-1.5 font-serif-display">
                Skin &amp; Wellness
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-stone-600">
            {navItems.map((item) => {
              const isCurrent =
                (item.sectionId === 'hero' && (location.pathname === '/' || location.pathname === '/home') && !location.hash) ||
                (item.route !== '/home' && location.pathname === item.route);

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-stone-200/70 text-stone-950 font-bold'
                      : 'hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dark Mode / Light Mode Quick Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1.5 sm:p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition cursor-pointer flex items-center justify-center"
              title={isDarkMode ? 'Switch to 07:00 Morning (Light Mode)' : 'Switch to 20:30 Evening (Dark Mode)'}
              aria-label="Toggle dark mode theme"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600 hover:text-stone-900 transition" />
              )}
            </button>

            {/* Auth / Profile Link */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-stone-50 hover:bg-stone-100 border border-stone-200 transition cursor-pointer"
                  title="Go to Dashboard"
                >
                  <div className="w-6 h-6 rounded-full bg-stone-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {(userProfile?.displayName || user.email || 'A').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-stone-800 hidden md:block max-w-[90px] truncate">
                    {userProfile?.displayName || user.email?.split('@')[0]}
                  </span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="p-1.5 rounded-full bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 text-xs transition cursor-pointer"
                    title="Open Admin Dashboard"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition cursor-pointer"
              >
                Sign In
              </button>
            )}

            {/* Primary CTA: Start My Skin Journey (Black Pill button) */}
            <button
              onClick={() => navigate('/scan')}
              className="px-4 py-2 rounded-full bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer"
            >
              <span>Start My Skin Journey</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-300 hidden sm:inline" />
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-full text-stone-600 hover:bg-stone-100 focus:outline-none cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Compact Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xs sm:max-w-sm h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-stone-950 text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-teal-300" />
                  </div>
                  <span className="font-bold text-stone-900 font-serif-display text-base">SkinAI</span>
                </div>
                <CloseButton onClick={() => setMobileMenuOpen(false)} ariaLabel="Close navigation menu" />
              </div>

              {/* Navigation items */}
              <div className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/scan');
                }}
                className="w-full py-3 rounded-full bg-stone-950 text-white text-xs font-bold text-center block shadow-md hover:bg-stone-800 transition"
              >
                Start My Skin Journey
              </button>

              {user && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(isAdmin ? '/admin' : '/dashboard');
                  }}
                  className="w-full py-2.5 rounded-full bg-stone-900 text-white text-xs font-bold text-center block shadow-sm hover:bg-stone-800 transition cursor-pointer"
                >
                  Go to {isAdmin ? 'Admin Dashboard' : 'My Dashboard'}
                </button>
              )}

              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition"
                >
                  Sign Out ({userProfile?.displayName || user.email?.split('@')[0]})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2 rounded-full border border-stone-300 text-stone-800 text-xs font-bold hover:bg-stone-50 transition"
                >
                  Sign In / Create Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
