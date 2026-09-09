'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SAMPLE_PROJECTS, AcquisitionProject } from '../../data/homepageData';

interface ServicesGridProps {
  onSelectProject?: (project: AcquisitionProject) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onSelectProject }) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<AcquisitionProject>(SAMPLE_PROJECTS[0]);

  const filteredProjects = selectedType === 'All'
    ? SAMPLE_PROJECTS
    : SAMPLE_PROJECTS.filter((p) => p.type === selectedType);

  const getRiskBadge = (risk: AcquisitionProject['riskLevel']) => {
    switch (risk) {
      case 'Critical':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'High':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section id="dashboard" className="py-14 sm:py-16 bg-[#F8FAFC] border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-pulse" />
            National Command Center · Executive Overview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#0B1F33] tracking-tight leading-tight">
            National Land Acquisition Overview &amp; Live Telemetry
          </h2>
          <p className="text-sm sm:text-base lg:text-[16px] text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Consolidated monitoring of infrastructure acquisition pipelines, statutory milestones under RFCTLARR Act 2013, fair compensation payouts, and R&amp;R resettlement across India.
          </p>
          <div className="inline-block text-xs font-semibold text-slate-500 bg-slate-100/90 border border-slate-200 px-3.5 py-1 rounded-md">
            * Consolidated Telemetry · 1,284 Projects Monitored Across 28 States &amp; 8 UTs
          </div>
        </div>

        {/* 6 Executive KPI Cards — Coordinated Data System */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {[
            {
              id: 'kpi-dash-1',
              title: 'Projects Monitored',
              value: '1,284',
              subtext: '540 Highways · 312 Rail',
              bg: 'bg-[#0B2540]',
            },
            {
              id: 'kpi-dash-2',
              title: 'Land Notified',
              value: '48,500 Ha',
              subtext: '78.2% of proposed 62K Ha',
              bg: 'bg-[#0369A1]',
            },
            {
              id: 'kpi-dash-3',
              title: 'Land Acquired',
              value: '31,200 Ha',
              subtext: '64.3% physical possession',
              bg: 'bg-[#0C5A37]',
            },
            {
              id: 'kpi-dash-4',
              title: 'Compensation Paid',
              value: '₹14,850 Cr',
              subtext: '80.6% of ₹18,420 Cr award',
              bg: 'bg-[#B45309]',
            },
            {
              id: 'kpi-dash-5',
              title: 'Families Protected',
              value: '84,200',
              subtext: '12,400 R&R displaced units',
              bg: 'bg-[#5B21B6]',
            },
            {
              id: 'kpi-dash-6',
              title: 'SLA Adherence',
              value: '91.4%',
              subtext: '52 critical timeline alerts',
              bg: 'bg-[#991B1B]',
            },
          ].map((kpi) => (
            <div
              key={kpi.id}
              className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className={`${kpi.bg} text-white px-3.5 py-2.5 sm:px-4 sm:py-3`}>
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider opacity-90 block">
                  {kpi.title}
                </span>
                <span className="text-xl sm:text-2xl font-black tracking-tight leading-tight block mt-1">
                  {kpi.value}
                </span>
              </div>
              <div className="p-3 sm:p-3.5 bg-white">
                <span className="text-xs font-semibold text-slate-500 leading-snug block">
                  {kpi.subtext}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Project Pipeline & Interactive Dossier */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-5 sm:p-7 lg:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B1F33]">
                  Active Acquisition Project Pipeline
                </h3>
                <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Live Telemetry
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Filter by infrastructure sector or select a project to inspect statutory milestones, compensation status, and risk analysis.
              </p>
            </div>

            {/* Sector Filters */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
              {['All', 'Highways', 'Railways', 'Renewable Energy', 'Urban Infra', 'Industrial Corridor'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-white text-[#0B1F33] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Project Cards Grid / Selected Project Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-6">
            
            {/* Left: Project List (5 Cols) */}
            <div className="lg:col-span-5 space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project);
                    if (onSelectProject) onSelectProject(project);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    selectedProject.id === project.id
                      ? 'bg-emerald-50/70 border-2 border-[#138808] shadow-md'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {project.id}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getRiskBadge(
                        project.riskLevel
                      )}`}
                    >
                      {project.riskLevel} Risk
                    </span>
                  </div>

                  {/* Fully Visible Project Name */}
                  <h4 className="text-sm sm:text-base font-extrabold text-[#0B1F33] leading-snug">
                    {project.name}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-slate-600 mt-2.5 pt-2 border-t border-slate-100">
                    <span className="font-medium">{project.state} • {project.district}</span>
                    <span className="font-extrabold text-slate-800">{project.landAcquiredHa} / {project.landNotifiedHa} Ha</span>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="mt-2.5">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                      <span className="font-bold text-[#0B2540]">{project.stage}</span>
                      <span className="font-bold">{project.stageProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#138808] rounded-full transition-all duration-500"
                        style={{ width: `${project.stageProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Selected Project Detail Dossier (7 Cols) — Dominant Dossier */}
            <div className="lg:col-span-7 bg-slate-50/90 rounded-2xl border border-slate-200/90 p-5 sm:p-7 space-y-5">
              
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded">
                      {selectedProject.id}
                    </span>
                    <span className="text-xs font-bold text-slate-600">
                      {selectedProject.ministry}
                    </span>
                  </div>
                  <h4 className="text-xl sm:text-2xl lg:text-[26px] font-black text-[#0B1F33] mt-2 leading-tight">
                    {selectedProject.name}
                  </h4>
                  <div className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                    {selectedProject.district}, {selectedProject.state} · Current Milestone: <span className="text-[#138808] font-bold">{selectedProject.stage}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span
                    className={`inline-block text-xs font-black px-3.5 py-1 rounded-full border uppercase tracking-wider ${getRiskBadge(
                      selectedProject.riskLevel
                    )}`}
                  >
                    {selectedProject.riskLevel} Delay Risk
                  </span>
                  <div className="text-xs font-semibold text-slate-600 mt-1.5">
                    {selectedProject.slaDaysRemaining > 0
                      ? `${selectedProject.slaDaysRemaining} Days remaining in SLA`
                      : `SLA Overdue by ${Math.abs(selectedProject.slaDaysRemaining)} Days`}
                  </div>
                </div>
              </div>

              {/* Metric Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Land Proposed</div>
                  <div className="text-base sm:text-lg font-black text-[#0B1F33] mt-0.5">
                    {selectedProject.landProposedHa} Ha
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Land Notified</div>
                  <div className="text-base sm:text-lg font-black text-[#0284C7] mt-0.5">
                    {selectedProject.landNotifiedHa} Ha
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Land Acquired</div>
                  <div className="text-base sm:text-lg font-black text-[#0D6606] mt-0.5">
                    {selectedProject.landAcquiredHa} Ha
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                  <div className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">Compensation</div>
                  <div className="text-base sm:text-lg font-black text-[#D97706] mt-0.5">
                    ₹{selectedProject.compensationDisbursedCr} / ₹{selectedProject.compensationAssessedCr} Cr
                  </div>
                </div>
              </div>

              {/* Families Affected & Displaced */}
              <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                  <span className="font-semibold text-slate-700">Total Affected Families:</span>
                  <span className="font-black text-[#0B1F33]">{selectedProject.affectedFamilies}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0" />
                  <span className="font-semibold text-slate-700">Displaced Families (R&amp;R Colony):</span>
                  <span className="font-black text-[#0B1F33]">{selectedProject.displacedFamilies}</span>
                </div>
              </div>

              {/* AI Risk & Delay Assessment Box */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 sm:p-5 space-y-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm font-black text-amber-950">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Bottleneck &amp; Delay Forecast: ~{selectedProject.delayPredictedDays} Days</span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-200/80 px-2.5 py-0.5 rounded text-amber-950 uppercase tracking-wider">
                    Prototype Decision Support
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs sm:text-[13px] text-amber-950 font-medium pl-5 list-disc">
                  {selectedProject.riskFactors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-amber-200/90 text-xs sm:text-[13px] text-amber-950">
                  <span className="font-black">Recommended Action: </span>
                  <span className="font-medium">{selectedProject.recommendedAction}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <a
                    href="#gis-map"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0C5A37] hover:underline"
                  >
                    <span>Inspect Linear Corridor Alignment on GIS</span>
                    <span>→</span>
                  </a>
                </div>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 bg-[#0B2540] hover:bg-[#07192b] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  <span>Open Full Command Workspace</span>
                  <span>↗</span>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
