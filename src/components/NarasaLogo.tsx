import React, { useState } from 'react';
import { APP_LOGO } from '../constants/branding';

interface NarasaLogoProps {
  className?: string;
  containerClassName?: string;
  imgClassName?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withHoverAnimation?: boolean;
  withGlow?: boolean;
  alt?: string;
  onClick?: () => void;
}

export const NarasaLogo: React.FC<NarasaLogoProps> = ({
  className = '',
  containerClassName = '',
  imgClassName = '',
  size = 'md',
  withHoverAnimation = true,
  withGlow = true,
  alt = 'Logo NARASA AI',
  onClick
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeStyles = {
    xs: 'w-6 h-6 rounded-lg p-0.5',
    sm: 'w-8 h-8 rounded-xl p-0.5',
    md: 'w-10 h-10 sm:w-11 sm:h-11 rounded-2xl p-0.5',
    lg: 'w-12 h-12 rounded-2xl p-1',
    xl: 'w-16 h-16 rounded-3xl p-1.5'
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative group inline-flex items-center justify-center shrink-0 ${
        withHoverAnimation && onClick ? 'cursor-pointer' : ''
      } ${className}`}
      title="NARASA AI — Foto Apa Saja. Bangun Penalaran."
    >
      {/* Animated Glow on Hover */}
      {withGlow && withHoverAnimation && (
        <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-blue-500/35 via-purple-500/35 to-pink-500/35 opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 ease-out group-hover:scale-115 pointer-events-none -z-10" />
      )}

      {/* Logo Container with Smooth Tilt & Elevation */}
      <div
        className={`${sizeStyles} bg-white flex items-center justify-center border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-300 ease-out ${
          withHoverAnimation
            ? 'group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:rotate-2 group-hover:border-indigo-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20 active:scale-95'
            : ''
        } ${containerClassName}`}
      >
        {!hasError ? (
          <img
            src={APP_LOGO}
            alt={alt}
            onError={() => setHasError(true)}
            className={`w-full h-full object-contain rounded-xl transition-transform duration-300 ease-out select-none ${
              withHoverAnimation ? 'group-hover:scale-105' : ''
            } ${imgClassName}`}
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white font-black text-xs">
            N
          </div>
        )}
      </div>
    </div>
  );
};
