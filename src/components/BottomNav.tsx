import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Compass, Sparkles, Clock, Package, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: '/dashboard', label: 'Home', icon: Compass, matchPaths: ['/dashboard'] },
    { path: '/coach', label: 'AI', icon: Sparkles, matchPaths: ['/coach', '/scan', '/scan/results'] },
    { path: '/routine', label: 'Routine', icon: Clock, matchPaths: ['/routine', '/skin', '/wellness'] },
    { path: '/products', label: 'Products', icon: Package, matchPaths: ['/products'] },
    { path: '/profile', label: 'Profile', icon: User, matchPaths: ['/profile', '/profile/subscription', '/profile/settings'] },
  ];

  const isCurrentActive = (item: typeof items[0]) => {
    return item.matchPaths.some(p => location.pathname === p || (p !== '/' && location.pathname.startsWith(p)));
  };

  // Do not show bottom nav on mobile landing page to avoid obstructing the hero
  if (location.pathname === '/' || location.pathname === '/home') {
    return null;
  }

  return (
    <nav className="xl:hidden fixed bottom-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-auto bg-white/90 backdrop-blur-xl border border-white/80 rounded-full px-3 py-1.5 shadow-[0_12px_35px_rgba(0,0,0,0.15)] z-40 max-w-md mx-auto">
      <div className="flex items-center justify-around gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = isCurrentActive(item);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-full transition cursor-pointer ${
                isActive
                  ? 'bg-stone-950 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
