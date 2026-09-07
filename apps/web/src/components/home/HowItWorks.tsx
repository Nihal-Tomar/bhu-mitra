'use client';

import React, { useState } from 'react';
import { LIFECYCLE_STAGES, LifecycleStage } from '../../data/homepageData';

export const HowItWorks: React.FC = () => {
  const [activeStage, setActiveStage] = useState<LifecycleStage>(LIFECYCLE_STAGES[3]); // Default Section 11 Notification

  const getStatusColor = (status: LifecycleStage['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'In Progress':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'Pending':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Critical':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section id="lifecycle" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
            Central Workflow · Statutory Lifecycle
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
            End-to-End Land Acquisition Lifecycle
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Governing infrastructure acquisition under the RFCTLARR Act 2013: from online proposal submission and cadastral survey to fair compensation disbursement, R&R execution, and legal possession.
          </p>
        </div>

        {/* 9-Stage Connected Stepper Bar — Enterprise Workflow Presentation */}
        <div className="mb-8">
          <div className="overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-stretch gap-2.5 sm:gap-3 min-w-max xl:min-w-0 xl:w-full">
              {LIFECYCLE_STAGES.map((stage) => {
                const isActive = activeStage.step === stage.step;
                const isCompleted = stage.status === 'Completed';
                const isInProgress = stage.status === 'In Progress';

                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => setActiveStage(stage)}
                    className={`shrink-0 w-44 sm:w-48 xl:w-auto xl:flex-1 flex flex-col items-center justify-between text-center p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer group focus:outline-none ${
                      isActive
                        ? 'bg-[#0C5A37] border-[#0C5A37] text-white shadow-md ring-2 ring-[#0C5A37]/25 scale-[1.02]'
                        : isCompleted
                        ? 'bg-emerald-50/50 hover:bg-emerald-50/80 border-emerald-200/90 text-slate-800'
                        : isInProgress
                        ? 'bg-sky-50/60 hover:bg-sky-50 border-sky-200/90 text-slate-800'
                        : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-600'
                    }`}
                    aria-label={`Select Stage ${stage.step}: ${stage.title}`}
                  >
                    {/* Step Number & Code */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <span
                        className={`w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                          isActive
                            ? 'bg-white text-[#0C5A37] shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isInProgress
                            ? 'bg-sky-100 text-sky-800 border border-sky-300'
                            : 'bg-white border border-slate-300 text-slate-500'
                        }`}
                      >
                        {isCompleted && !isActive ? '✓' : stage.step}
                      </span>
                      <span className={`text-[10px] sm:text-[10.5px] font-mono font-bold ${
                        isActive ? 'text-emerald-100' : 'text-slate-500'
                      }`}>
                        {stage.code}
                      </span>
                    </div>

                    {/* FULL Untruncated Stage Title */}
                    <div className={`text-xs sm:text-[12.5px] font-extrabold leading-snug whitespace-normal px-1 my-auto ${
                      isActive ? 'text-white' : 'text-[#0B1F33]'
                    }`}>
                      {stage.title}
                    </div>

                    {/* Status Pill */}
                    <span
                      className={`text-[9px] sm:text-[9.5px] font-bold px-2 py-0.5 rounded-full border mt-2.5 uppercase tracking-wider ${
                        isActive
                          ? 'bg-emerald-900/60 text-emerald-100 border-emerald-600'
                          : getStatusColor(stage.status)
                      }`}
                    >
                      {stage.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium text-center mt-1 sm:hidden">
            ← Scroll horizontally to inspect all 9 statutory stages →
          </div>
        </div>

        {/* Selected Stage Interactive Inspector Dossier — High Contrast WCAG Design */}
        <div className="bg-[#0B1F33] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-slate-700/80">
          
          {/* Header Row: Stage Label, Full Dominant Title & SLA Clock */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 sm:pb-8 border-b border-slate-700/80">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs sm:text-[13px] font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Stage {activeStage.step} of 09 · {activeStage.code}
                </span>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
                    activeStage.status === 'Completed'
                      ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
                      : activeStage.status === 'In Progress'
                      ? 'bg-sky-900/80 text-sky-200 border-sky-500'
                      : 'bg-slate-800 text-slate-200 border-slate-600'
                  }`}
                >
                  {activeStage.status}
                </span>
              </div>

              {/* Visually Dominant Stage Title */}
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {activeStage.title}
              </h3>

              {/* Clear Readable Description */}
              <p className="text-sm sm:text-base text-slate-200 font-medium max-w-3xl leading-relaxed">
                {activeStage.description}
              </p>
            </div>

            {/* SLA Clock Block */}
            <div className="bg-slate-900/90 border border-slate-700/90 rounded-2xl p-4 sm:p-5 shrink-0 text-left lg:text-right shadow-inner">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-1">
                Statutory SLA Clock
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {activeStage.statutorySLA}
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">
                Mandatory under RFCTLARR Act 2013
              </div>
            </div>
          </div>

          {/* Stage Details Grid: Authority, Key Action, Statutory Documents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 pt-6 sm:pt-8">
            
            {/* Responsible Authority */}
            <div className="bg-slate-900/70 rounded-2xl border border-slate-700/80 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300 uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Responsible Authority</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white leading-snug">
                {activeStage.authority}
              </div>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-medium">
                Holds statutory accountability for procedural compliance, gazette publication, and claim adjudication.
              </p>
            </div>

            {/* Key Action & Legal Mandate */}
            <div className="bg-slate-900/70 rounded-2xl border border-slate-700/80 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-sky-300 uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>Key Statutory Action</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white leading-snug">
                {activeStage.keyAction}
              </div>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-medium">
                Automated escalation trigger activates if statutory milestone slips by more than 7 days.
              </p>
            </div>

            {/* Statutory Documents */}
            <div className="bg-slate-900/70 rounded-2xl border border-slate-700/80 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>Statutory Documents</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {activeStage.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-[13px] text-slate-100 font-semibold">
                    <span className="text-emerald-400 font-black">✓</span>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Bar */}
          <div className="mt-6 sm:mt-8 pt-5 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-300">
            <span>* Illustrative Workflow Model under RFCTLARR Act 2013 (Central Rules).</span>
            <a
              href="#dashboard"
              className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
            >
              <span>Track Active Projects in Stage {activeStage.step}</span>
              <span>→</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
