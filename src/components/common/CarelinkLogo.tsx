import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light';
  showText?: boolean;
}

export const CarelinkLogo: React.FC<LogoProps> = ({
  size = 'md',
  theme = 'light',
  showText = true,
}) => {
  const iconSize = size === 'sm' ? 34 : size === 'md' ? 44 : 56;

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Carelink Iconic Connected Cross Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0 rounded-2xl shadow-sm transition-transform hover:scale-105"
        style={{
          width: iconSize,
          height: iconSize,
          background: 'linear-gradient(135deg, #0d5c4b 0%, #064e3b 100%)',
        }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          className="w-4/5 h-4/5"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Medical Cross Base */}
          <path
            d="M20 6C20 4.89543 20.8954 4 22 4H26C27.1046 4 28 4.89543 28 6V18H40C41.1046 18 42 18.8954 42 20V24C42 25.1046 41.1046 26 40 26H28V38C28 39.1046 27.1046 40 26 40H22C20.8954 40 20 39.1046 20 38V26H8C6.89543 26 6 25.1046 6 24V20C6 18.8954 6.89543 18 8 18H20V6Z"
            fill="#34d399"
            fillOpacity="0.9"
          />
          {/* Care Interconnection Network Link */}
          <path
            d="M14 24C14 18.4772 18.4772 14 24 14C29.5228 14 34 18.4772 34 24C34 29.5228 29.5228 34 24 34"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="24" cy="24" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          <circle cx="34" cy="24" r="2.5" fill="#38bdf8" />
          <circle cx="24" cy="34" r="2.5" fill="#38bdf8" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5 tracking-wider">
            <span
              className={`font-extrabold text-base tracking-widest ${
                theme === 'dark' ? 'text-white' : 'text-emerald-950'
              }`}
              style={{ letterSpacing: '0.12em' }}
            >
              CARELINK
            </span>
          </div>
          <div className="flex items-center gap-1.5 -mt-0.5">
            <span className="h-[1px] w-2.5 bg-emerald-500/60" />
            <span
              className={`text-[9px] font-bold tracking-[0.2em] uppercase ${
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
              }`}
            >
              Rural Health Network
            </span>
            <span className="h-[1px] w-2.5 bg-emerald-500/60" />
          </div>
        </div>
      )}
    </div>
  );
};
