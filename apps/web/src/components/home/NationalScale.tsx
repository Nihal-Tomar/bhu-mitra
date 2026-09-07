'use client';

import React from 'react';

export const NationalScale: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#0B1F33] text-white overflow-hidden relative">
      
      {/* Background Indian Map Geometry Accent */}
      <div
        className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain pointer-events-none"
        style={{ backgroundImage: "url('/assets/bhumitra-hero-backdrop.jpg')" }}
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            National Infrastructure Project Scale
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Built for National Acquisition Scale
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Supporting critical infrastructure corridors across all 28 States and 8 Union Territories with automated cross-state cadastral revenue nomenclature reconciliation.
          </p>
        </div>

        {/* Big Acquisition Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          {[
            { value: '1,284', label: 'Projects Monitored', sub: 'Highways, Rail, Energy & Metro' },
            { value: '48,500 Ha', label: 'Land Notified', sub: 'Geo-referenced corridor alignment' },
            { value: '₹14,850 Cr', label: 'Compensation Paid', sub: 'Direct bank escrow transfer' },
            { value: '91.4%', label: 'Statutory SLA Adherence', sub: 'RFCTLARR statutory milestones' },
          ].map((metric, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-md hover:bg-white/10 transition-colors"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
                {metric.value}
              </div>
              <div className="text-xs sm:text-sm font-bold text-amber-400 mt-1.5">{metric.label}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{metric.sub}</div>
            </div>
          ))}
        </div>

        {/* State Cadastral Harmonization Strip */}
        <div className="mt-8 sm:mt-10 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center md:text-left">
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Inter-State Cadastral Revenue Harmonization
              </h3>
              <p className="text-[11px] text-slate-300">
                Automated cross-mapping of diverse state terminology into unified Section 11/19 gazette notifications.
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
              {[
                'Form 7/12 (MH & GJ)',
                'Khasra-Khatauni (UP & MP)',
                'Jamabandi (PB & HR)',
                'Patta & Chitta (TN & AP)',
                'RoR (Odisha & WB)',
              ].map((term, i) => (
                <span
                  key={i}
                  className="text-[10.5px] font-semibold bg-white/10 border border-white/15 px-2.5 py-1 rounded-full text-slate-200"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-[10.5px] text-slate-400">
          * National Scale Metrics · Illustrative Telemetry Data
        </div>

      </div>
    </section>
  );
};
