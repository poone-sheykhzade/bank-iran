import React from 'react';

interface IranBankLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

export const IranBankLogo: React.FC<IranBankLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Exact Logo Shield Icon matching Iran Bank visual branding */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-[#0C1E30] flex items-center justify-center p-1.5 shadow-sm border border-[#162F4A] flex-shrink-0 transition-transform duration-200 hover:scale-105`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Contour */}
          <path
            d="M50 12 L78 24 C78 52 64 74 50 86 C36 74 22 52 22 24 Z"
            stroke="#00A3FF"
            strokeWidth="6"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Top Beam */}
          <rect x="34" y="38" width="32" height="4" rx="2" fill="#FFFFFF" />
          {/* 3 Bank Pillars */}
          <rect x="36" y="44" width="6" height="20" rx="1.5" fill="#FFFFFF" />
          <rect x="47" y="42" width="6" height="22" rx="1.5" fill="#FFFFFF" />
          <rect x="58" y="44" width="6" height="20" rx="1.5" fill="#FFFFFF" />
          {/* Base Beam */}
          <rect x="32" y="66" width="36" height="4" rx="2" fill="#FFFFFF" />
        </svg>
      </div>

      {variant !== 'icon' && (
        <div className="flex flex-col text-right">
          <span
            className={`font-black tracking-tight leading-none ${
              size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl'
            } ${isWhite ? 'text-white' : 'text-[#0C1E30]'}`}
          >
            ایران بانک
          </span>
          <span
            className={`font-bold tracking-widest text-[#0084C7] uppercase ${
              size === 'lg' ? 'text-[11px] mt-1.5' : size === 'sm' ? 'text-[8px] mt-0.5' : 'text-[9px] mt-1'
            }`}
            style={{ letterSpacing: '0.14em', direction: 'ltr' }}
          >
            IRAN BANK • FINTECH
          </span>
        </div>
      )}
    </div>
  );
};
