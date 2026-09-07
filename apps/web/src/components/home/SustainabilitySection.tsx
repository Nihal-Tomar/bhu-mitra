'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ACQUISITION_ALERTS, AcquisitionAlert, RISK_ANALYSIS_SUMMARY } from '../../data/homepageData';

export const SustainabilitySection: React.FC = () => {
  const [alertFilter, setAlertFilter] = useState<'All' | 'Critical' | 'Warning' | 'Normal'>('All');

  const filteredAlerts = alertFilter === 'All'
    ? ACQUISITION_ALERTS
    : ACQUISITION_ALERTS.filter((a) => a.severity === alertFilter);

  const getSeverityBadge = (severity: AcquisitionAlert['severity']) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500 text-white';
      case 'Warning':
        return 'bg-amber-500 text-white';
      case 'Normal':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <section id="intelligence" className="py-16 sm:py-20 bg-white border-t border-slate-200 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
            Intelligent Automation · Decision Support System
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
            Acquisition Risk &amp; Delay Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Predictive delay risk scoring, statutory bottleneck identification, and automated early warning alerts helping District Collectors and Central Ministries prevent costly project slippages.
          </p>
        </div>

        {/* 2-Column Split: AI Risk Engine on Left (6 Cols) & Alerts Center on Right (6 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Column: Predictive Risk Analysis Console (6 Cols) */}
          <div className="lg:col-span-6 bg-[#0B1F33] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  Statutory Decision Support
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Predictive Delay Assessment
                </h3>
              </div>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Illustrative Risk Model
              </span>
            </div>

            {/* In-depth Predictive Case: NH-48 Six-Laning — Risk Most Prominent Element */}
            <div className="bg-slate-900/90 rounded-2xl border border-slate-700/90 p-5 sm:p-6 space-y-4 shadow-inner">
              
              {/* 1. DOMINANT RISK BANNER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-950/40 border border-red-500/40 rounded-xl p-3.5">
                <div>
                  <div className="text-xs font-mono text-slate-400 font-bold">DOLR-2026-0084</div>
                  <div className="text-sm sm:text-base font-extrabold text-white">NH-48 Bharatmala Six-Laning Corridor</div>
                </div>
                <div className="text-left sm:text-right">
                  <span className="inline-block bg-red-500 text-white font-black text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-xs tracking-wider">
                    CRITICAL DELAY RISK (78/100)
                  </span>
                </div>
              </div>

              {/* 2. PREDICTED DELAY & BOTTLENECK METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">Predicted Delay</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-0.5 block">+22 Days Slippage</span>
                  <span className="text-[11px] text-slate-400">Beyond statutory Section 19 limit</span>
                </div>
                <div className="bg-slate-800/90 p-3.5 rounded-xl border border-slate-700">
                  <span className="text-xs text-sky-300 font-bold uppercase tracking-wider block">Root Statutory Bottleneck</span>
                  <span className="text-base sm:text-lg font-bold text-white mt-0.5 block">Section 15 Objections</span>
                  <span className="text-[11px] text-slate-400">23 parcels pending CALA hearing</span>
                </div>
              </div>

              {/* 3. WHY (Root Reasons) */}
              <div className="space-y-2 pt-1">
                <span className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider block">
                  Root Bottleneck Diagnostics:
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  <li className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-amber-400 font-bold text-base leading-none">•</span>
                    <span>23 agricultural parcels in Karjan cluster have pending Section 15 land-loser objection hearings.</span>
                  </li>
                  <li className="flex items-start gap-2 bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                    <span className="text-amber-400 font-bold text-base leading-none">•</span>
                    <span>Mandatory 12-month statutory ceiling between Section 11 notice and Section 19 declaration expires in 48 days.</span>
                  </li>
                </ul>
              </div>

              {/* 4. RECOMMENDED ACTION HIERARCHY */}
              <div className="bg-emerald-950/70 border border-emerald-600/70 rounded-xl p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider">
                  <span>✓ Recommended Action for CALA:</span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                  Convene special fast-track hearing bench for Karjan cluster by 12 September to dispose Section 15 objections and gazette Section 19 declaration ahead of statutory lapse.
                </p>
              </div>
            </div>

            {/* National Risk Distribution Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-slate-200">National Corridor Risk Portfolio:</span>
                <span className="text-xs text-slate-400 font-semibold">1,284 Projects Monitored</span>
              </div>

              {/* Segmented Progress Bar */}
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-red-500 h-full" style={{ width: '4%' }} title="Critical Risk (14 projects)" />
                <div className="bg-amber-500 h-full" style={{ width: '8%' }} title="High/Medium Risk (38 projects)" />
                <div className="bg-emerald-500 h-full" style={{ width: '88%' }} title="Low Risk / On Track (1,232 projects)" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold pt-1 text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>14 Critical Risk</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>38 Medium Risk</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>1,232 On Track</span>
                </span>
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
              <span>* Prototype Decision Support engine for evaluation.</span>
              <Link href="/dashboard" className="text-emerald-400 font-bold hover:underline flex items-center gap-1">
                <span>View Command Analytics</span>
                <span>→</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Early Warning & SLA Alerts Center (6 Cols) */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-[#0C5A37] uppercase tracking-wider block">
                  Statutory Monitoring
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0B1F33] mt-0.5">
                  Acquisition Alerts Center
                </h3>
              </div>

              {/* Severity Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs">
                {(['All', 'Critical', 'Warning', 'Normal'] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setAlertFilter(sev)}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      alertFilter === sev
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-4.5 shadow-2xs space-y-2 hover:border-slate-300 transition-all text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${getSeverityBadge(
                        alert.severity
                      )}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {alert.timestamp}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-mono font-bold text-slate-500">
                      {alert.projectName} ({alert.projectId})
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#0B1F33] mt-1 leading-snug">
                      {alert.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed font-medium">
                      {alert.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-700 font-medium">
                      <span className="font-bold text-[#0B1F33]">Required Action:</span> {alert.actionRequired}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-xs text-slate-500 italic">
              * Automated early warnings dispatched to District Collector and Requiring Body portals.
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
