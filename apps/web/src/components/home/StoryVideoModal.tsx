'use client';

import React from 'react';

interface StoryVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryVideoModal: React.FC<StoryVideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0B1F33] text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#061626]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
              BHU-MITRA DOCUMENTARY · 2 MIN
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close documentary video"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Canvas / Documentary Presentation */}
        <div className="relative aspect-video bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {/* Subtle background landscape image */}
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/bhumitra-hero-reference.png')" }}
          />

          <div className="relative z-10 max-w-lg space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#138808]/90 text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-white/20 animate-pulse">
              <svg className="w-8 h-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Your Land. Our Commitment.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Watch how the Department of Land Resources (DoLR) and the Ministry of Rural Development are
                transforming land governance, eliminating dispute backlogs, and securing citizen rights through
                satellite GIS &amp; digital public infrastructure.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="text-[11px] font-semibold bg-white/10 px-3 py-1 rounded-full text-slate-300">
                Resolution: 4K UHD
              </span>
              <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                Audio: English &amp; हिन्दी
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#061626] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Digital India · Ministry of Rural Development, Government of India</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs transition-colors"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
};
