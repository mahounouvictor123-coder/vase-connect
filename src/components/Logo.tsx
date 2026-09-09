import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'compact';
  theme?: 'light' | 'dark';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'light',
  className = '',
  size = 'md',
}) => {
  const isDark = theme === 'dark';
  const primaryTextColor = isDark ? 'text-white' : 'text-[#0A3D36]';
  const secondaryTextColor = isDark ? 'text-emerald-200' : 'text-[#0F4C44]';

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Emblem SVG mimicking the uploaded VH logo */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none">
          {/* Circular badge background */}
          <rect width="120" height="120" rx="28" fill={isDark ? '#062722' : '#FFFFFF'} stroke="#C59A27" strokeWidth="2" />
          
          {/* Droplet flame inside V loop */}
          <path
            d="M 43 32 C 43 24, 49 14, 49 14 C 49 14, 55 24, 55 32 C 55 36, 52 40, 49 40 C 46 40, 43 36, 43 32 Z"
            fill="#C59A27"
            stroke="#FFFFFF"
            strokeWidth="1.5"
          />
          <circle cx="49" cy="32" r="1.5" fill="#FFFFFF" />

          {/* Stylized calligraphic V in gold */}
          <path
            d="M 24 45 C 20 28, 28 18, 34 18 C 40 18, 42 28, 40 45 C 36 78, 58 92, 70 72 C 74 65, 76 52, 74 45 C 70 28, 80 22, 85 26 C 90 30, 88 42, 80 60 C 72 78, 64 96, 50 96 C 30 96, 18 70, 24 45 Z"
            fill="#C59A27"
          />

          {/* Stylized calligraphic H in light gold */}
          <path
            d="M 75 32 C 80 22, 89 22, 91 30 C 93 42, 86 60, 82 76 C 79 88, 87 93, 94 85 C 101 77, 107 56, 105 38 C 103 26, 110 22, 115 25 C 120 28, 117 42, 112 60 C 107 78, 110 91, 120 91 C 121 91, 122 90, 122 89 C 122 88, 124 93, 120 96 C 108 98, 100 87, 101 76 C 95 84, 86 91, 77 89 C 69 88, 69 79, 72 65 Z"
            fill="#E5B22F"
          />

          {/* Underline crimson accent bar */}
          <rect x="75" y="102" width="22" height="4" rx="2" fill="#A31D24" />
        </svg>
      </div>

      {variant !== 'icon' && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-wider text-base sm:text-lg ${primaryTextColor}`}>
              VASES
            </span>
            <span className="font-extrabold tracking-wide text-xs sm:text-sm text-[#C59A27] uppercase">
              CONNECT
            </span>
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            <div className="h-0.5 w-6 bg-[#C59A27]" />
            <span className={`text-[9px] font-semibold tracking-widest uppercase ${secondaryTextColor}`}>
              D'HONNEUR
            </span>
            <div className="h-1 w-2.5 bg-[#A31D24] rounded-xs" />
          </div>

          {variant === 'full' && (
            <span className="text-[7.5px] font-medium tracking-tight text-slate-500 mt-0.5">
              Assemblée Porte des Cieux
            </span>
          )}
        </div>
      )}
    </div>
  );
};
