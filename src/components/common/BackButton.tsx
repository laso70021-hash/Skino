import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  fallback?: string;
  label?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  fallback = '/home',
  label = 'Back',
  className = ''
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // If browser has history entries, go back; otherwise use fallback route
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-xl transition shadow-2xs group focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer ${className}`}
      aria-label={`Go back: ${label}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-stone-500 group-hover:text-stone-900" />
      <span>{label}</span>
    </button>
  );
};
