'use client';

import React from 'react';
import Link from 'next/link';

export const HomeFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1F33] text-white border-t border-slate-800 relative">
      
      {/* Upper Main Footer Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Platform Brand & Ministry Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg text-amber-400 border border-white/20">
                भू
              </div>
              <div>
                <div className="text-xl font-extrabold tracking-tight">
                  <span className="text-white">Bhu-</span>
                  <span className="text-[#138808]">Mitra</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  National Land Acquisition Monitoring &amp; Decision-Support Platform
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Unified digital public infrastructure conceptualized for the Department of Land Resources (DoLR),
              Ministry of Rural Development, Government of India, implementing the RFCTLARR Act 2013 lifecycle.
            </p>

            <div className="text-[11px] text-slate-400 space-y-1">
              <div>
                <span className="text-slate-500">Statutory Framework:</span> RFCTLARR Act 2013 &amp; DILRMP Guidelines
              </div>
              <div>
                <span className="text-slate-500">Nodal Authority:</span> Department of Land Resources · MoRD
              </div>
              <div>
                <span className="text-slate-500">Platform Status:</span> Production Operational Specification
              </div>
            </div>
          </div>

          {/* Col 2: Acquisition Lifecycle */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Acquisition Platform
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#dashboard" className="hover:text-white transition-colors">National Overview Dashboard</a></li>
              <li><a href="#lifecycle" className="hover:text-white transition-colors">9-Stage RFCTLARR Lifecycle</a></li>
              <li><a href="#gis-map" className="hover:text-white transition-colors">Linear Alignment GIS &amp; RoW</a></li>
              <li><a href="#intelligence" className="hover:text-white transition-colors">Risk &amp; Delay AI Predictor</a></li>
              <li><a href="#documents" className="hover:text-white transition-colors">Statutory Document Repository</a></li>
              <li><a href="#transparency" className="hover:text-white transition-colors">Citizen Transparency &amp; RoR Verification</a></li>
            </ul>
          </div>

          {/* Col 3: Statutory Protections & Safeguards */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Statutory Safeguards
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#safeguards" className="hover:text-white transition-colors">Social Impact Assessment (SIA)</a></li>
              <li><a href="#safeguards" className="hover:text-white transition-colors">100% Solatium &amp; Multipliers</a></li>
              <li><a href="#safeguards" className="hover:text-white transition-colors">R&amp;R Resettlement Colony Standards</a></li>
              <li><a href="#safeguards" className="hover:text-white transition-colors">Agricultural &amp; Multi-Crop Protections</a></li>
              <li><a href="#notices" className="hover:text-white transition-colors">Gazette Notifications &amp; Awards</a></li>
              <li><Link href="/design-system" className="hover:text-white transition-colors text-amber-300 font-semibold">Design System Spec →</Link></li>
            </ul>
          </div>

          {/* Col 4: Workspaces & Command Center */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Workspaces &amp; Support
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li><a href="#stakeholders" className="hover:text-white transition-colors">Central Ministry Oversight</a></li>
              <li><a href="#stakeholders" className="hover:text-white transition-colors">CALA &amp; Collectorate Portal</a></li>
              <li><a href="#stakeholders" className="hover:text-white transition-colors">Requiring Body Desk</a></li>
              <li><a href="#help" className="hover:text-white transition-colors">Help Centre &amp; FAQs</a></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors text-emerald-400 font-bold">National Command Centre →</Link></li>
            </ul>
          </div>

        </div>

        {/* Platform Information Banner */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 bg-slate-900/40 rounded-xl p-4 text-[11px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
              NATIONAL PLATFORM
            </span>
            <span>National Land Acquisition Intelligence Platform — All project corridors, gazette notices, and compensation telemetry are illustrative model data.</span>
          </div>
          <div className="text-[10px] text-slate-500 shrink-0 font-mono">
            BUILD v2.4-PRODUCTION
          </div>
        </div>
      </div>

      {/* Skyline & National Motto Strip matching reference image */}
      <div className="border-t border-slate-800 bg-[#061626] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Central Slogan */}
          <div className="text-center md:text-left">
            <span className="text-sm font-bold tracking-widest text-slate-200">
              पारदर्शी भूमि अधिग्रहण &nbsp;•&nbsp; न्यायसंगत मुआवजा &nbsp;•&nbsp; विकसित भारत
            </span>
            <div className="text-[10px] text-slate-500 tracking-[0.25em] uppercase font-mono mt-0.5">
              T R A N S P A R E N T &nbsp; A C Q U I S I T I O N &nbsp; • &nbsp; J U S T &nbsp; C O M P E N S A T I O N &nbsp; • &nbsp; V I K S I T &nbsp; B H A R A T
            </div>
          </div>

          {/* Right Motto */}
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <div className="text-right leading-tight">
              <div className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">National Infrastructure Stack</div>
              <div className="text-[9px] text-emerald-400 tracking-wider uppercase font-semibold">DoLR · Ministry of Rural Development</div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-slate-300 shadow-xl flex items-center justify-center transition-all hover:scale-110"
        title="Scroll to Top"
        aria-label="Scroll to top"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

    </footer>
  );
};
