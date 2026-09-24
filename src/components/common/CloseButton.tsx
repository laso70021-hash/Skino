import React from 'react';
import { X } from 'lucide-react';

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  ariaLabel?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  onClick,
  className = '',
  ariaLabel = 'Close modal'
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer ${className}`}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <X className="w-5 h-5 stroke-[2.25]" />
    </button>
  );
};
