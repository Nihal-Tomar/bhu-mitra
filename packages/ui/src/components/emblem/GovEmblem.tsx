import React from 'react';

export interface GovEmblemProps {
  /** Optional image source for authorized official emblem asset */
  src?: string;
  /** Accessible alt text */
  alt?: string;
  /** Size dimension in pixels */
  size?: number;
  /** Visual theme for dark or light backgrounds */
  variant?: 'light' | 'dark';
  /** Custom CSS classes */
  className?: string;
}

/**
 * GovEmblem — Accessible Government of India Identity Slot
 * 
 * In accordance with legal and technical guidelines, this component provides
 * an accessible slot for authorized national emblem assets. When no verified official
 * asset is supplied, it displays an authorized-placeholder civic insignia without
 * attempting to fabricate or counterfeit the protected State Emblem of India.
 */
export const GovEmblem: React.FC<GovEmblemProps> = ({
  src,
  alt = 'Government of India Civic Emblem Placeholder',
  size = 48,
  variant = 'light',
  className = '',
}) => {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`object-contain ${className}`}
      />
    );
  }

  const isDark = variant === 'dark' || className.includes('bg-white/5') || className.includes('text-white');

  const containerStyles = isDark
    ? 'border-amber-400/40 bg-slate-900/60 text-amber-300'
    : 'border-slate-300 bg-slate-50 text-[#0A2540]';

  const strokePrimary = isDark ? '#F59E0B' : '#0A2540';
  const strokeSecondary = isDark ? '#FBBF24' : '#06038D';

  // Accessible civic emblem slot / neutral insignia placeholder
  return (
    <div
      role="img"
      aria-label={alt}
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center rounded-md border shadow-2xs ${containerStyles} ${className}`}
      title="Government of India Authorized Asset Slot"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4/5 h-4/5"
        aria-hidden="true"
      >
        {/* Civic Pillar / Chakra Architectural Silhouette (Non-counterfeit stylized motif) */}
        <circle cx="24" cy="24" r="20" stroke={strokePrimary} strokeWidth="2" strokeDasharray="3 2" />
        <circle cx="24" cy="24" r="14" stroke={strokeSecondary} strokeWidth="1.5" />
        {/* 24-spoke representation of Dharma Chakra motif */}
        <circle cx="24" cy="24" r="3" fill={strokeSecondary} />
        <path d="M24 10V38M10 24H38M14 14L34 34M14 34L34 14" stroke={strokeSecondary} strokeWidth="1" />
        {/* Civic Base */}
        <path d="M12 40H36" stroke={strokePrimary} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <span className="sr-only">State Emblem of India Official Asset Slot</span>
    </div>
  );
};
