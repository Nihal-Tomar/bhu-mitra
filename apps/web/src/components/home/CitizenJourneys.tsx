'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { STAKEHOLDER_ROLES, StakeholderWorkspace } from '../../data/homepageData';

export const CitizenJourneys: React.FC = () => {
  const [activeRole, setActiveRole] = useState<StakeholderWorkspace>(STAKEHOLDER_ROLES[1]); // Default District Collector

  return (
    <section id="stakeholders" className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
            Multi-Stakeholder Operational Ecosystem
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
            Role-Based Acquisition Workspaces
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Tailored digital interfaces built for the distinct operational mandates of each stakeholder in the statutory acquisition process under RFCTLARR Act 2013.
          </p>
        </div>

        {/* Stakeholder Tabs */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap mb-8">
          {STAKEHOLDER_ROLES.map((role) => {
            const isActive = activeRole.id === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRole(role)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0B2540] text-white shadow-sm'
                    : 'bg-white hover:bg-slate-200/70 text-slate-700 border border-slate-200'
                }`}
              >
                {role.role.split('(')[0]}
              </button>
            );
          })}
        </div>

        {/* Active Role Showcase Card */}
        <div className="bg-white border border-slate-300 rounded-2xl p-5 sm:p-8 lg:p-9 shadow-sm max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Role Identity & Live KPIs (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0C5A37] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  {activeRole.badge}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2">
                  {activeRole.role}
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1">
                  {activeRole.description}
                </p>
              </div>

              {/* Primary KPIs for this role */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Role Telemetry KPIs (Illustrative Prototype Data)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {activeRole.primaryKPIs.map((kpi, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                      <div className="text-[13px] sm:text-[15px] font-extrabold text-[#0B1F33]">
                        {kpi.value}
                      </div>
                      <div className="text-[9.5px] font-medium text-slate-500 line-clamp-1">
                        {kpi.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Action Button */}
              <div>
                {activeRole.actionHref.startsWith('/') ? (
                  <Link
                    href={activeRole.actionHref}
                    className="inline-flex items-center gap-2 bg-[#0C5A37] hover:bg-[#084228] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                  >
                    <span>{activeRole.actionLabel}</span>
                    <span>→</span>
                  </Link>
                ) : (
                  <a
                    href={activeRole.actionHref}
                    className="inline-flex items-center gap-2 bg-[#0C5A37] hover:bg-[#084228] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
                  >
                    <span>{activeRole.actionLabel}</span>
                    <span>→</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Key Capabilities & Statutory Workflows (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 sm:p-6 space-y-4">
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#0B1F33]">
                  {activeRole.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated statutory compliance and verification mechanisms enabled in Bhu-Mitra.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                  Core Operational Capabilities:
                </span>
                <ul className="space-y-2">
                  {activeRole.keyCapabilities.map((cap, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200/90 shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#138808] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        ✓
                      </span>
                      <span className="font-medium leading-relaxed">{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-[10.5px] text-slate-500 italic">
                * Configured with Role-Based Access Control (RBAC) and cryptographic action audit logging.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
