'use client';

import React from 'react';
import Link from 'next/link';

export const FinalCTA: React.FC = () => {
  return (
    <section className="relative py-20 sm:py-24 bg-[#0A1926] text-white overflow-hidden border-t border-slate-800">
      
      {/* Background Cinematic Landscape Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/assets/bhumitra-hero-backdrop.jpg')" }}
        role="img"
        aria-label="Bhu-Mitra National Land Acquisition Platform"
      />

      {/* Deep Navy to Black Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F33] via-[#0B1F33]/85 to-[#0A1926]/90 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        
        <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/15 border border-amber-400/30 px-3.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          National Land Acquisition Intelligence &amp; Management Platform
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Accelerating National Infrastructure with Statutory Trust
        </h2>

        <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From online proposal indents to encumbrance-free legal possession — Bhu-Mitra brings transparency, real-time telemetry, and fair rehabilitation to every acquisition project in India.
        </p>

        {/* Dual Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
          <a
            href="#dashboard"
            className="inline-flex items-center gap-2 bg-[#138808] hover:bg-[#0D6606] text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <span>Explore National Dashboard</span>
            <span className="text-base leading-none">→</span>
          </a>

          <a
            href="#gis-map"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-full border border-white/20 backdrop-blur-md transition-all"
          >
            <span>View Acquisition GIS</span>
            <span className="text-base leading-none">→</span>
          </a>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold px-6 py-3 rounded-full border border-slate-600 transition-all"
          >
            <span>Officer Console ↗</span>
          </Link>
        </div>

        {/* Viksit Bharat Slogan */}
        <div className="pt-6 text-xs text-slate-400 tracking-widest uppercase font-medium">
          सबका भूमि • सबका विकास • विकसित भारत 2047
        </div>

      </div>
    </section>
  );
};
