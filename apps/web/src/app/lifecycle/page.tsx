'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import {
  PROJECT_LIFECYCLE_PROFILES,
  getProjectLifecycle,
  type ProjectLifecycleProfile,
  type ProjectLifecycleStage,
  type ParcelDossier,
} from '../../data/projectLifecycleData';

function AcquisitionLifecycleContent() {
  const { isHindi } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial project ID from query param or default to NH-48
  const initialProjectId = searchParams.get('project') || 'DOLR-2026-0084';
  const initialStageStep = searchParams.get('stage') || '05';

  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId);
  const [selectedStageStep, setSelectedStageStep] = useState<string>(initialStageStep);
  const [parcelFilter, setParcelFilter] = useState<string>('all'); // 'all' | 'stage' | 'high-risk'

  const currentProfile: ProjectLifecycleProfile = useMemo(() => {
    return getProjectLifecycle(selectedProjectId);
  }, [selectedProjectId]);

  const activeStage: ProjectLifecycleStage = useMemo(() => {
    return (
      currentProfile.stages.find((s) => s.step === selectedStageStep) ||
      currentProfile.stages.find((s) => s.step === currentProfile.currentStageStep) ||
      currentProfile.stages[0]
    );
  }, [currentProfile, selectedStageStep]);

  // Sync state if URL query params change
  useEffect(() => {
    const pParam = searchParams.get('project');
    const sParam = searchParams.get('stage');
    if (pParam && PROJECT_LIFECYCLE_PROFILES[pParam]) {
      setSelectedProjectId(pParam);
    }
    if (sParam) {
      setSelectedStageStep(sParam);
    }
  }, [searchParams]);

  const handleSelectProject = (projId: string) => {
    setSelectedProjectId(projId);
    const newProfile = getProjectLifecycle(projId);
    setSelectedStageStep(newProfile.currentStageStep);
    router.push(`/lifecycle?project=${projId}&stage=${newProfile.currentStageStep}`);
  };

  const handleSelectStage = (step: string) => {
    setSelectedStageStep(step);
    router.push(`/lifecycle?project=${selectedProjectId}&stage=${step}`);
  };

  // Filtered parcels for this project
  const displayParcels = useMemo(() => {
    if (!currentProfile.parcels || currentProfile.parcels.length === 0) return [];
    if (parcelFilter === 'stage') {
      return currentProfile.parcels.filter((p) => p.stageStep === activeStage.step);
    }
    if (parcelFilter === 'high-risk') {
      return currentProfile.parcels.filter((p) => p.riskLevel === 'High' || p.riskLevel === 'Medium');
    }
    return currentProfile.parcels;
  }, [currentProfile.parcels, parcelFilter, activeStage.step]);

  const getStageBadgeStyle = (status: ProjectLifecycleStage['status'], isActive: boolean) => {
    if (isActive) {
      return 'bg-[#0C5A37] text-white border-[#0C5A37] shadow-sm ring-2 ring-[#0C5A37]/30';
    }
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100/70';
      case 'In Progress':
        return 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100/70';
      case 'Delayed':
        return 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100/70';
      case 'Pending':
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      {/* Top Institutional Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition-colors">
              {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
            </Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-slate-800 transition-colors">
              {isHindi ? 'परियोजनाएं' : 'Projects'}
            </Link>
            <span>/</span>
            <span className="text-[#0C5A37] font-bold">
              {isHindi ? 'वैधानिक अधिग्रहण जीवनचक्र' : 'Acquisition Lifecycle'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#0C5A37] font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#138808] animate-pulse" />
              <span>RFCTLARR Act 2013 Statutory State Machine Active</span>
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Page Heading & Statutory Subheading */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
              {isHindi ? 'परियोजना-विशिष्ट वैधानिक ट्रैकिंग' : 'Project-Specific Statutory Tracking'}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B2540] tracking-tight">
              {isHindi ? 'भूमि अधिग्रहण जीवनचक्र' : 'Acquisition Lifecycle'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
              {isHindi
                ? 'भूमि अधिग्रहण की शुरू से अंत तक वैधानिक एवं परिचालन निगरानी: प्रस्ताव, सामाजिक प्रभाव मूल्यांकन (SIA), धारा 11 अधिसूचना, आपत्तियां, धारा 19 घोषणा, प्रतिकर अधिनिर्णय, R&R एवं भौतिक कब्जा।'
                : 'End-to-end statutory and operational monitoring of land acquisition.'}
            </p>
          </div>

          {/* Quick Deep Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href={`/gis?project=${currentProfile.projectId}&stage=${activeStage.step}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] shadow-xs transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span>{isHindi ? 'जीआईएस मैप पर देखें' : 'View Project on GIS'} →</span>
            </Link>
            <Link
              href="/command"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <span>{isHindi ? 'राष्ट्रीय कमान' : 'Command Center'}</span>
            </Link>
          </div>
        </div>

        {/* ── PROJECT SELECTOR & TELEMETRY CARD ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Project Selection Dropdown & Location Info */}
            <div className="space-y-1 flex-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {isHindi ? 'सक्रिय परियोजना का चयन करें' : 'Select Monitored Project'}
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleSelectProject(e.target.value)}
                  className="w-full sm:max-w-md text-sm font-bold p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-[#0B2540] focus:ring-2 focus:ring-[#0C5A37] focus:outline-none"
                >
                  {Object.values(PROJECT_LIFECYCLE_PROFILES).map((p) => (
                    <option key={p.projectId} value={p.projectId}>
                      {p.projectName} ({p.state} • {p.projectId})
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold text-slate-700">
                    State: <strong>{currentProfile.state}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 font-semibold text-slate-700">
                    District: <strong>{currentProfile.district}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Current Stage Highlight Pill */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 shrink-0 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <div>
                <span className="text-[10.5px] font-bold text-amber-800 uppercase tracking-wider block">
                  {isHindi ? 'वर्तमान सक्रिय चरण' : 'Current Active Statutory Stage'}
                </span>
                <span className="text-xs sm:text-sm font-extrabold text-[#0B2540]">
                  Stage {currentProfile.currentStageStep}: {currentProfile.currentStageName.split('&')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Project High-Level Telemetry Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[10.5px] block">{isHindi ? 'कुल भू-आवश्यकता' : 'Land Required'}</span>
              <span className="text-sm font-extrabold text-slate-900">{currentProfile.landRequiredHa} Ha</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{currentProfile.landNotifiedHa} Ha Notified</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[10.5px] block">{isHindi ? 'भौतिक कब्जा पूर्ण' : 'Possession Taken'}</span>
              <span className="text-sm font-extrabold text-emerald-800">{currentProfile.landPossessedHa} Ha</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">{((currentProfile.landPossessedHa / currentProfile.landRequiredHa) * 100).toFixed(0)}% encumbrance-free</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[10.5px] block">{isHindi ? 'प्रतिकर संवितरण' : 'Compensation Disbursed'}</span>
              <span className="text-sm font-extrabold text-[#0C5A37]">₹{currentProfile.compensationDisbursedCr} Cr</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Assessed: ₹{currentProfile.compensationAssessedCr} Cr</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[10.5px] block">{isHindi ? 'लंबित प्रतिकर' : 'Compensation Pending'}</span>
              <span className="text-sm font-extrabold text-amber-700">₹{currentProfile.pendingCompensationCr} Cr</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">In Escrow / Verification</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[10.5px] block">{isHindi ? 'R&R प्रगति' : 'R&R Safeguards'}</span>
              <span className="text-sm font-extrabold text-[#0B2540]">{currentProfile.rrCompletionPct}%</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">{currentProfile.rehabilitatedFamilies} / {currentProfile.displacedFamilies} Families</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-500 text-[10.5px] block">{isHindi ? 'उच्च-जोखिम पार्सल' : 'High-Risk Parcels'}</span>
              <span className={`text-sm font-extrabold ${currentProfile.highRiskParcels > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                {currentProfile.highRiskParcels} Parcels
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Under Sec. 15 Review</span>
            </div>
          </div>
        </div>

        {/* ── 9-STAGE CONNECTED INTERACTIVE TIMELINE ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold text-[#0B2540] uppercase tracking-wider">
              {isHindi ? '9-चरणीय वैधानिक अनुक्रम' : '9-Stage Statutory Sequence'}
            </h2>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Click any stage to inspect statutory evidence, affected parcels &amp; financials
            </span>
          </div>

          <div className="overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex items-stretch gap-2 min-w-max xl:min-w-0 xl:w-full">
              {currentProfile.stages.map((stage) => {
                const isSelected = activeStage.step === stage.step;
                const isCurrent = currentProfile.currentStageStep === stage.step;
                const isCompleted = stage.status === 'Completed';
                const isInProgress = stage.status === 'In Progress';
                const isDelayed = stage.status === 'Delayed';

                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => handleSelectStage(stage.step)}
                    className={`shrink-0 w-36 sm:w-40 xl:w-auto xl:flex-1 p-3 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer group focus:outline-none ${
                      getStageBadgeStyle(stage.status, isSelected)
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-white text-[#0C5A37]'
                              : isCompleted
                              ? 'bg-emerald-200 text-emerald-900'
                              : isInProgress
                              ? 'bg-amber-200 text-amber-900'
                              : isDelayed
                              ? 'bg-red-200 text-red-900'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {isCompleted && !isSelected ? '✓' : stage.step}
                        </span>

                        {isCurrent && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-500 text-white'
                          }`}>
                            Active
                          </span>
                        )}
                      </div>

                      <span className={`text-[10px] font-mono font-bold block ${
                        isSelected ? 'text-emerald-100' : 'text-slate-500'
                      }`}>
                        {stage.code}
                      </span>

                      <div className={`text-xs font-bold leading-tight mt-1 line-clamp-2 ${
                        isSelected ? 'text-white' : 'text-[#0B2540]'
                      }`}>
                        {stage.title}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-current/15 flex items-center justify-between text-[9.5px]">
                      <span className="font-semibold uppercase tracking-wider">
                        {stage.status === 'Completed' ? '✓ Done' : stage.status === 'In Progress' ? '● In Progress' : '○ Pending'}
                      </span>
                      {stage.slaDaysRemaining > 0 && isInProgress && (
                        <span className="font-mono font-bold">{stage.slaDaysRemaining}d SLA</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 font-medium text-center sm:hidden">
            ← Scroll horizontally to view all 9 stages →
          </div>
        </div>

        {/* ── SELECTED STAGE DOSSIER PANEL ── */}
        <div className="bg-[#0B1F33] text-white rounded-3xl p-5 sm:p-8 shadow-xl border border-slate-800 space-y-6">
          
          {/* Header Row: Stage Title, Legal Section & SLA Clock */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-700/80">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Stage {activeStage.step} of 09 · {activeStage.code}
                </span>

                <span
                  className={`text-xs font-black px-3 py-1 rounded-full border uppercase tracking-wider ${
                    activeStage.status === 'Completed'
                      ? 'bg-emerald-900/80 text-emerald-200 border-emerald-500'
                      : activeStage.status === 'In Progress'
                      ? 'bg-amber-900/80 text-amber-200 border-amber-500'
                      : activeStage.status === 'Delayed'
                      ? 'bg-red-900/80 text-red-200 border-red-500'
                      : 'bg-slate-800 text-slate-300 border-slate-600'
                  }`}
                >
                  {activeStage.status}
                </span>

                <span className="text-xs text-slate-400 font-medium">
                  {activeStage.startDate} {activeStage.completionDate ? `→ ${activeStage.completionDate}` : `(Exp: ${activeStage.expectedDate})`}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeStage.title}
              </h2>

              <div className="text-xs sm:text-sm text-emerald-300 font-mono font-semibold flex items-center gap-2">
                <span>Statutory Authority:</span>
                <span className="text-white font-sans">{activeStage.legalSection}</span>
              </div>
            </div>

            {/* Statutory SLA Clock Block */}
            <div className="bg-slate-900/90 border border-slate-700/90 rounded-2xl p-4 sm:p-5 shrink-0 text-left lg:text-right shadow-inner">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-widest mb-0.5">
                Statutory SLA Timeline
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {activeStage.statutorySLA}
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">
                {activeStage.slaDaysRemaining > 0
                  ? `${activeStage.slaDaysRemaining} Days Remaining before Escalation`
                  : activeStage.status === 'Completed'
                  ? 'Stage Successfully Concluded'
                  : 'SLA Milestone Under Review'}
              </div>
            </div>
          </div>

          {/* Metrics Grid: 4 Core Columns (Parcels, Families, Financials, Possession/R&R) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-700/70 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Affected Land Parcels</span>
              <div className="text-2xl font-black text-white">{activeStage.clearedParcels} / {activeStage.affectedParcels}</div>
              <p className="text-xs text-slate-300">
                {activeStage.affectedParcels - activeStage.clearedParcels} parcels under active stage processing
              </p>
            </div>

            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-700/70 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Affected Families</span>
              <div className="text-2xl font-black text-white">{activeStage.affectedFamilies}</div>
              <p className="text-xs text-slate-300">
                R&R Safeguards Progress: <strong className="text-emerald-300">{activeStage.rrCompletionPct}%</strong>
              </p>
            </div>

            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-700/70 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stage Financials (PFMS)</span>
              <div className="text-2xl font-black text-emerald-400">
                ₹{activeStage.compensationDisbursedCr} Cr
              </div>
              <p className="text-xs text-slate-300">
                Assessed: ₹{activeStage.compensationAssessedCr} Cr (Pending: ₹{activeStage.pendingCompensationCr} Cr)
              </p>
            </div>

            <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-700/70 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Possession / Handover</span>
              <div className="text-2xl font-black text-white">
                {activeStage.possessionHa > 0 ? `${activeStage.possessionHa} Ha` : 'Awaiting Award'}
              </div>
              <p className="text-xs text-slate-300">
                Sec. 38 restricted until 100% award deposit
              </p>
            </div>

          </div>

          {/* Middle 2-Column: Authority & Mandatory Documents Checklist */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            
            {/* Responsible Authority */}
            <div className="bg-slate-900/70 rounded-2xl border border-slate-700/80 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300 uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Responsible Statutory Authority</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white leading-snug">
                {activeStage.authority}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Holds legal accountability for procedural compliance, objection disposal summaries, gazette publications, and disbursal validation under RFCTLARR Central &amp; State Rules.
              </p>
            </div>

            {/* Mandatory Statutory Documents Checklist */}
            <div className="bg-slate-900/70 rounded-2xl border border-slate-700/80 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Mandatory Statutory Documents &amp; Evidence</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {activeStage.documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 font-semibold">
                    <span className="text-emerald-400 font-black">✓</span>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Risk & Delay Alert Warning */}
          <div className="p-4 sm:p-5 bg-slate-900/90 rounded-2xl border border-amber-500/40 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  activeStage.riskLevel === 'Critical'
                    ? 'bg-red-500 text-white'
                    : activeStage.riskLevel === 'High'
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {activeStage.riskLevel} Risk
                </span>
                <span className="text-sm font-extrabold text-white">
                  {isHindi ? 'पूर्वानुमानित विलंब एवं महत्वपूर्ण कार्रवाई' : 'Predictive Risk & Critical Statutory Action'}
                </span>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                Predicted Delay: <strong>{activeStage.delayPredictedDays} Days</strong>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-amber-200 leading-relaxed font-medium">
              {activeStage.criticalPendingAction}
            </p>
            {activeStage.delayReason && (
              <p className="text-xs text-slate-400">
                <strong>Root Cause:</strong> {activeStage.delayReason}
              </p>
            )}
          </div>

          {/* Audit History Strip */}
          {activeStage.auditTrail && activeStage.auditTrail.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Statutory Audit Trail (Tamper-Evident History)
              </span>
              <div className="space-y-1.5">
                {activeStage.auditTrail.map((log, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold">{log.date}</span>
                      <span>{log.action}</span>
                    </div>
                    <span className="text-slate-400 font-medium text-[11px] mt-0.5 sm:mt-0">Actor: {log.actor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Dossier Action Toolbar */}
          <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">
              * Governed under Central RFCTLARR Rules 2014 &amp; State Revenue Gazettes.
            </span>
            <div className="flex items-center gap-3">
              <Link
                href={`/gis?project=${currentProfile.projectId}&stage=${activeStage.step}`}
                className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
              >
                <span>View Stage {activeStage.step} Parcels on National GIS</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>

        {/* ── STAGE LAND PARCELS & BENEFICIARIES DOSSIER ── */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-[#0B2540]">
                {isHindi ? 'संबंधित भू-पार्सल एवं हितग्राही सूची' : 'Acquisition Parcels & Landowner Dossiers'}
              </h3>
              <p className="text-xs text-slate-500">
                Cadastral khasra numbers linked to project alignment, valuation status, R&amp;R Passbook, and physical possession.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setParcelFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  parcelFilter === 'all'
                    ? 'bg-[#0C5A37] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Parcels ({currentProfile.parcels.length})
              </button>
              <button
                type="button"
                onClick={() => setParcelFilter('stage')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  parcelFilter === 'stage'
                    ? 'bg-[#0C5A37] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Stage {activeStage.step} Parcels
              </button>
              <button
                type="button"
                onClick={() => setParcelFilter('high-risk')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  parcelFilter === 'high-risk'
                    ? 'bg-red-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Under Review ({currentProfile.highRiskParcels})
              </button>
            </div>
          </div>

          {displayParcels.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-3">Survey / Khasra</th>
                    <th className="p-3">Village / Location</th>
                    <th className="p-3">Affected Khatedar</th>
                    <th className="p-3">Acquired / Total Area</th>
                    <th className="p-3">Current Stage</th>
                    <th className="p-3">Compensation Status</th>
                    <th className="p-3">R&amp;R Entitlement</th>
                    <th className="p-3">Possession (Sec 38)</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayParcels.map((parcel) => (
                    <tr key={parcel.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-mono font-extrabold text-[#0B2540]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: parcel.color }} />
                          <span>#{parcel.surveyNo}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{parcel.village}</div>
                        <div className="text-[10px] text-slate-500">{parcel.district}, {parcel.state}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{parcel.owner}</div>
                        <div className="text-[10px] text-slate-500">{parcel.ownerPhone}</div>
                      </td>
                      <td className="p-3 font-medium text-slate-800">
                        {parcel.acquiredAreaHa} Ha / {parcel.totalAreaHa} Ha
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          {parcel.currentStage.split('-')[1]?.trim() || parcel.currentStage}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-emerald-900">{parcel.award.disbursalStatus}</div>
                        <div className="text-[10px] text-slate-500 font-mono">₹{(parcel.award.totalCompensation / 100000).toFixed(2)} Lakhs</div>
                      </td>
                      <td className="p-3 max-w-[180px]">
                        <div className="truncate text-slate-800 font-medium" title={parcel.rr.eligibility}>
                          {parcel.rr.eligibility}
                        </div>
                        <div className="text-[10px] text-slate-500">{parcel.rr.subsistenceGrantStatus}</div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          parcel.possession.status === 'Possession Taken'
                            ? 'bg-emerald-100 text-emerald-800'
                            : parcel.possession.status === 'Handover Scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {parcel.possession.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/gis?project=${currentProfile.projectId}&parcel=${parcel.id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0C5A37] hover:underline"
                        >
                          <span>View on GIS</span>
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <span className="text-xs font-bold text-slate-500">
                Detailed cadastral parcels for this stage are archived in the state district revenue register.
              </span>
              <div className="mt-2">
                <Link
                  href={`/gis?project=${currentProfile.projectId}`}
                  className="text-xs font-bold text-[#0C5A37] hover:underline"
                >
                  Open Corridor Spatial Alignment on GIS →
                </Link>
              </div>
            </div>
          )}
        </div>

      </main>

      <InstitutionalFooter />
    </div>
  );
}

export default function AcquisitionLifecyclePage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#07131D] text-white flex items-center justify-center text-sm font-semibold">
          Loading Lifecycle Monitor...
        </div>
      }
    >
      <AcquisitionLifecycleContent />
    </React.Suspense>
  );
}
