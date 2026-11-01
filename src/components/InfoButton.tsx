import React from 'react';
import { Info } from 'lucide-react';

interface InfoButtonProps {
  onClick: (e: React.MouseEvent) => void;
  title?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

export const InfoButton: React.FC<InfoButtonProps> = ({
  onClick,
  title = 'Learn about this feature',
  className = '',
  size = 'sm',
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4 p-0.5 text-[9px]',
    sm: 'w-5 h-5 p-1 text-[10px]',
    md: 'w-6 h-6 p-1.5 text-xs',
  }[size];

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  }[size];

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      title={title}
      aria-label={title}
      className={`rounded-full bg-white/10 hover:bg-purple-600/50 hover:text-white text-white/50 border border-white/15 transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-sm ${sizeClasses} ${className}`}
    >
      <Info className={iconSizes} />
    </button>
  );
};
