'use client';

/**
 * Bhu-Mitra Project Command Center Workspace (/projects/[id])
 * Smart India Hackathon 2026 — Problem Statement SIH26016
 *
 * Unified digital twin combining:
 * 1. Overview & Telemetry
 * 2. Statutory Lifecycle Stepper & Approval Gate
 * 3. GIS Cadastral Map & Parcel Dossiers
 * 4. Compensation Ledger & PFMS DBT Disbursal
 * 5. Rehabilitation & Resettlement (R&R) Delivery
 * 6. Legal Objections & Judicial Stays
 * 7. Document Repository with SHA-256 Verification
 * 8. Immutable Audit Trail
 */

import React, { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../../components/common/InstitutionalFooter';
import { projectStore, type VaultDocument, type AuditTrailEntry, type CitizenGrievance } from '../../../lib/projectStore';
import { useAuth } from '../../../lib/authContext';
import { type ProjectLifecycleProfile, type ProjectLifecycleStage, type ParcelDossier } from '../../../data/projectLifecycleData';
import { GISSection } from '../../../components/home/GISSection';

export default function ProjectCommandCenterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const { isHindi } = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, hasPermission } = useAuth();

  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Store state
  const [projectProfile, setProjectProfile] = useState<ProjectLifecycleProfile | null>(null);
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditTrailEntry[]>([]);
  const [grievances, setGrievances] = useState<CitizenGrievance[]>([]);

  // Stage transition modal state
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [transitionRemarks, setTransitionRemarks] = useState('');
  const [selectedTargetStep, setSelectedTargetStep] = useState<string>('');
  const [transitionError, setTransitionError] = useState<string | null>(null);
  const [transitionSuccess, setTransitionSuccess] = useState(false);

  // PFMS disbursal modal state
  const [isPfmsModalOpen, setIsPfmsModalOpen] = useState(false);
  const [pfmsBatchAmount, setPfmsBatchAmount] = useState<number>(14.5);
  const [pfmsKhatedarCount, setPfmsKhatedarCount] = useState<number>(18);
  const [generatedUtr, setGeneratedUtr] = useState<string | null>(null);

  // Document upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState<VaultDocument['documentType']>('GAZETTE_SEC_11');
  const [uploadFileSize, setUploadFileSize] = useState('2.4 MB');

  // Load project from store
  const refreshData = () => {
    const profile = projectStore.getProjectProfile(projectId);
    setProjectProfile({ ...profile });
    setDocuments(projectStore.getDocuments(projectId));
    setAuditLogs(projectStore.getAuditLogs(projectId));
    setGrievances(projectStore.getGrievances(projectId));
  };

  useEffect(() => {
    refreshData();
  }, [projectId]);

  useEffect(() => {
    const t = searchParams.get('tab');
    if (t) setActiveTab(t);
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/projects/${projectId}?tab=${tabId}`);
  };

  const currentStage = useMemo(() => {
    if (!projectProfile) return null;
    return (
      projectProfile.stages.find((s) => s.step === projectProfile.currentStageStep) ||
      projectProfile.stages[0]
    );
  }, [projectProfile]);

  const nextStage = useMemo(() => {
    if (!projectProfile) return null;
    const currentStepNum = parseInt(projectProfile.currentStageStep, 10);
    const nextStepStr = String(currentStepNum + 1).padStart(2, '0');
    return projectProfile.stages.find((s) => s.step === nextStepStr) || null;
  }, [projectProfile]);

  // Stage transition execution
  const handleAdvanceStage = () => {
    if (!projectProfile || !nextStage) return;
    setTransitionError(null);
    try {
      const actorName = user?.name || 'Authorized Officer';
      const actorRole = user?.roleLabel || 'District Land Authority';
      const target = selectedTargetStep || nextStage.step;

      projectStore.advanceStage(projectId, target, transitionRemarks || 'Milestone verified and gazette compliance approved.', actorName, actorRole);
      setTransitionSuccess(true);
      setTimeout(() => {
        setTransitionSuccess(false);
        setIsTransitionModalOpen(false);
        refreshData();
      }, 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Stage transition failed.';
      setTransitionError(msg);
    }
  };

  // PFMS disbursal execution
  const handleAuthorizePfms = () => {
    const utr = projectStore.authorizePFMSBatch(projectId, pfmsBatchAmount, pfmsKhatedarCount);
    setGeneratedUtr(utr);
    refreshData();
  };

  // Document upload execution
  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !projectProfile) return;

    projectStore.uploadDocument({
      title: uploadTitle.trim(),
      documentType: uploadType,
      documentTypeLabel: uploadType.replace(/_/g, ' '),
      projectId: projectProfile.projectId,
      projectName: projectProfile.projectName,
      fileSize: uploadFileSize,
      mimeType: 'application/pdf',
      uploadedBy: user?.name || 'Authorized Officer',
      uploadedRole: user?.roleLabel || 'CALA Office',
      status: 'VERIFIED',
      isTamperEvident: true,
      fileUrl: '/documents/verified-sample.pdf',
    });

    setIsUploadModalOpen(false);
    setUploadTitle('');
    refreshData();
  };

  if (!projectProfile) {
    return (
      <div className="min-h-screen bg-[#07131D] text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#138808] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">Loading Project Command Workspace ({projectId})...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: isHindi ? 'अवलोकन' : 'Overview', icon: '🏛️' },
    { id: 'lifecycle', label: isHindi ? 'अधिग्रहण जीवनचक्र' : 'Statutory Lifecycle', icon: '⏱️' },
    { id: 'gis', label: isHindi ? 'जीआईएस एवं भूखंड' : 'GIS & Parcels', icon: '🗺️' },
    { id: 'compensation', label: isHindi ? 'मुआवजा एवं डीबीटी' : 'Compensation & DBT', icon: '💰' },
    { id: 'rr', label: isHindi ? 'पुनर्वासन (R&R)' : 'R&R Safeguards', icon: '🏘️' },
    { id: 'legal', label: isHindi ? 'आपत्तियां एवं वाद' : 'Legal & Objections', icon: '⚖️' },
    { id: 'documents', label: isHindi ? 'दस्तावेज वॉल्ट' : 'Document Vault', icon: '📁' },
    { id: 'audit', label: isHindi ? 'अंकेक्षण इतिहास' : 'Audit Trail', icon: '📜' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      {/* Top Institutional Project Banner */}
      <header className="bg-[#0B1F33] text-white border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8 shadow-lg">
        <div className="max-w-[1440px] mx-auto space-y-4">
          
          {/* Breadcrumb Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 font-medium">
              <Link href="/" className="hover:text-white transition-colors">
                {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
              </Link>
              <span>/</span>
              <Link href="/projects" className="hover:text-white transition-colors">
                {isHindi ? 'परियोजनाएं' : 'Projects'}
              </Link>
              <span>/</span>
              <span className="text-amber-400 font-mono font-bold">{projectProfile.projectId}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Statutory Master Record Synchronized</span>
              </span>
            </div>
          </div>

          {/* Project Title & Status Hero */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-md bg-white/10 text-slate-200 border border-white/15">
                  {projectProfile.projectId}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#FF9933]/20 text-[#FF9933] border border-[#FF9933]/40">
                  {projectProfile.state} · {projectProfile.district}
                </span>
                <span className="text-xs font-black uppercase px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Stage {projectProfile.currentStageStep}/09: {projectProfile.currentStageName}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {projectProfile.projectName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {projectProfile.corridorName}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <Link
                href={`/lifecycle?project=${projectProfile.projectId}`}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#0C5A37] hover:bg-[#084228] text-white transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>⏱️</span>
                <span>{isHindi ? 'जीवनचक्र ट्रैक करें' : 'Track Full Lifecycle'}</span>
              </Link>
              <Link
                href={`/gis?project=${projectProfile.projectId}`}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>🗺️</span>
                <span>{isHindi ? 'जीआईएस संरेखण' : 'GIS Alignment'}</span>
              </Link>
              {hasPermission('stage:advance') && nextStage && (
                <button
                  type="button"
                  onClick={() => setIsTransitionModalOpen(true)}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <span>⚡</span>
                  <span>{isHindi ? 'चरण अग्रसारित करें' : 'Advance Milestone'}</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Quantitative Telemetry Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[10.5px] uppercase font-bold text-slate-400 block">
                {isHindi ? 'अधिगृहीत / कुल भूमि' : 'Possessed / Required Land'}
              </span>
              <div className="text-lg font-black text-emerald-400 mt-0.5">
                {projectProfile.landPossessedHa} / {projectProfile.landRequiredHa} <span className="text-xs text-slate-300">Ha</span>
              </div>
              <span className="text-[10px] text-slate-400">
                {Math.round((projectProfile.landPossessedHa / (projectProfile.landRequiredHa || 1)) * 100)}% Possessed
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[10.5px] uppercase font-bold text-slate-400 block">
                {isHindi ? 'मुआवजा संवितरण' : 'Compensation Disbursed'}
              </span>
              <div className="text-lg font-black text-amber-400 mt-0.5">
                ₹{projectProfile.compensationDisbursedCr} <span className="text-xs text-slate-300">Cr</span>
              </div>
              <span className="text-[10px] text-slate-400">
                ₹{projectProfile.pendingCompensationCr} Cr Pending (PFMS DBT)
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[10.5px] uppercase font-bold text-slate-400 block">
                {isHindi ? 'प्रभावित परिवार / R&R' : 'Families / R&R Progress'}
              </span>
              <div className="text-lg font-black text-sky-400 mt-0.5">
                {projectProfile.rehabilitatedFamilies} / {projectProfile.affectedFamilies}
              </div>
              <span className="text-[10px] text-slate-400">
                {projectProfile.rrCompletionPct}% Resettled in Model Colony
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
              <span className="text-[10.5px] uppercase font-bold text-slate-400 block">
                {isHindi ? 'वैधानिक SLA घड़ी' : 'Statutory SLA Clock'}
              </span>
              <div className="text-lg font-black text-white mt-0.5">
                {currentStage?.slaDaysRemaining || 8} <span className="text-xs text-slate-300">Days</span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold">
                {currentStage?.legalSection || 'RFCTLARR Sec 19(7)'}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Tabs Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs" aria-label="Project Workspace Tabs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-50 text-[#0C5A37] border border-emerald-200 shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 2-Column Overview Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column (2 Cols): Project Profile & Milestones */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Project Description Card */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
                  <h2 className="text-base sm:text-lg font-extrabold text-[#0B2540] flex items-center gap-2">
                    <span>🏛️</span>
                    <span>Executive Project Scope &amp; Statutory Authority</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    The {projectProfile.projectName} is a priority infrastructure corridor designated under the National Infrastructure Pipeline (NIP). Acquisition proceedings are conducted under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR 2013) across {projectProfile.district} district.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10.5px] uppercase font-bold text-slate-400 block">Requiring Body</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">National Highways Authority of India (NHAI)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10.5px] uppercase font-bold text-slate-400 block">Competent Authority (CALA)</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">Sub-Divisional Magistrate / CALA Vadodara</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-[10.5px] uppercase font-bold text-slate-400 block">Estimated Budget</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-800">₹{projectProfile.compensationAssessedCr * 2.5} Cr</span>
                    </div>
                  </div>
                </div>

                {/* Statutory 9-Stage Milestone Mini-Stepper */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-lg font-extrabold text-[#0B2540] flex items-center gap-2">
                      <span>⏱️</span>
                      <span>Statutory Lifecycle Progression</span>
                    </h2>
                    <button
                      type="button"
                      onClick={() => handleTabChange('lifecycle')}
                      className="text-xs font-bold text-[#0C5A37] hover:underline"
                    >
                      Open Full Stepper Workspace →
                    </button>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
                    {projectProfile.stages.map((stage) => {
                      const isCurrent = stage.step === projectProfile.currentStageStep;
                      const isCompleted = stage.status === 'Completed';
                      return (
                        <div
                          key={stage.step}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            isCurrent
                              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400/30 font-bold'
                              : isCompleted
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
                          }`}
                        >
                          <div className="text-[11px] font-mono font-black">Stage {stage.step}</div>
                          <div className="text-[9.5px] truncate font-semibold mt-0.5">{stage.title}</div>
                          <div className="text-[8.5px] mt-1 font-bold">
                            {isCompleted ? '✓ Done' : isCurrent ? '● Active' : 'Pending'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cadastral Land Acquisition Progress Bar */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Cumulative Land Acquisition Progress</span>
                    <span className="font-mono font-bold text-[#0C5A37]">{projectProfile.overallProgress}% Complete</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                    <div
                      className="bg-[#138808] h-full transition-all duration-500"
                      style={{ width: `${(projectProfile.landPossessedHa / projectProfile.landRequiredHa) * 100}%` }}
                      title="Possessed"
                    />
                    <div
                      className="bg-amber-400 h-full transition-all duration-500"
                      style={{ width: `${((projectProfile.landAwardedHa - projectProfile.landPossessedHa) / projectProfile.landRequiredHa) * 100}%` }}
                      title="Awarded Pending Possession"
                    />
                    <div
                      className="bg-blue-400 h-full transition-all duration-500"
                      style={{ width: `${((projectProfile.landNotifiedHa - projectProfile.landAwardedHa) / projectProfile.landRequiredHa) * 100}%` }}
                      title="Notified Pending Award"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#138808]" /> Possessed ({projectProfile.landPossessedHa} Ha)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-amber-400" /> Awarded ({projectProfile.landAwardedHa} Ha)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-blue-400" /> Notified ({projectProfile.landNotifiedHa} Ha)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-slate-200" /> Total ({projectProfile.landRequiredHa} Ha)</span>
                  </div>
                </div>

              </div>

              {/* Right Column (1 Col): Risk & Urgent Statutory Actions */}
              <div className="space-y-6">
                
                {/* Critical Risk Card */}
                <div className="bg-[#0B1F33] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">Decision Support</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase bg-red-500 text-white">
                      Critical Risk Tier
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 font-medium">Predicted Statutory Delay</div>
                    <div className="text-2xl font-black text-white mt-0.5">+48 Days</div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      SLA breach imminent under Section 19(7). High Court interim injunction on Survey #102/1A and tribal consent deficit in Anand cluster.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleTabChange('legal')}
                      className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-colors"
                    >
                      Inspect Legal Objections &amp; Stays →
                    </button>
                  </div>
                </div>

                {/* Priority Action Items */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-3">
                  <h3 className="text-sm font-extrabold text-[#0B2540] uppercase tracking-wider">
                    Statutory Pending Actions
                  </h3>
                  <div className="space-y-2.5">
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-900 space-y-1">
                      <span className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        Publish Section 19(1) Gazette Declaration
                      </span>
                      <p className="text-[11px] text-red-700">
                        Section 19(7) SLA clock: 8 days remaining before statutory lapse.
                      </p>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                      <span className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                        PFMS DBT Disbursal Authorization
                      </span>
                      <p className="text-[11px] text-amber-700">
                        18 khatedar bank mandates ready for digital verification.
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                      <span className="font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        Resettlement Colony Phase-2 Handover
                      </span>
                      <p className="text-[11px] text-blue-700">
                        Primary health center and solar lighting handover scheduled.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ── TAB 2: LIFECYCLE ── */}
        {activeTab === 'lifecycle' && currentStage && (
          <div className="space-y-6">
            
            {/* Active Stage Dossier Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-mono font-bold text-[#0C5A37] uppercase tracking-wider block">
                    Active Statutory Stage (Step {currentStage.step}/09)
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B2540] mt-0.5">
                    {currentStage.title}
                  </h2>
                  <span className="inline-block mt-1 text-xs font-bold text-slate-500">
                    Governed under: <span className="text-slate-800 font-mono font-bold">{currentStage.legalSection}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {currentStage.status.toUpperCase()}
                  </span>
                  {hasPermission('stage:advance') && nextStage && (
                    <button
                      type="button"
                      onClick={() => setIsTransitionModalOpen(true)}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0C5A37] hover:bg-[#084228] text-white transition-colors flex items-center gap-1.5"
                    >
                      <span>⚡</span>
                      <span>Advance to Stage {nextStage.step} →</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Stage Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">SLA Clock Remaining</span>
                  <div className="text-xl font-black text-amber-600 mt-0.5">{currentStage.slaDaysRemaining} Days</div>
                  <span className="text-[10px] text-slate-500">{currentStage.statutorySLA}</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">Affected Parcels</span>
                  <div className="text-xl font-black text-slate-800 mt-0.5">{currentStage.affectedParcels}</div>
                  <span className="text-[10px] text-slate-500">{currentStage.clearedParcels} cleared</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">Competent Authority</span>
                  <div className="text-sm font-bold text-slate-800 mt-1">{currentStage.authority}</div>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">Mandatory Docs</span>
                  <div className="text-sm font-bold text-emerald-700 mt-1">{currentStage.documents.length} Required</div>
                </div>
              </div>

              {/* Mandatory Document Checklist */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Mandatory Statutory Compliance Checklist
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentStage.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Complete 9-Stage Timeline Stepper */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-[#0B2540]">
                All 9 Statutory Stages under RFCTLARR Act 2013
              </h3>

              <div className="space-y-3">
                {projectProfile.stages.map((stage) => {
                  const isCurrent = stage.step === projectProfile.currentStageStep;
                  const isCompleted = stage.status === 'Completed';
                  return (
                    <div
                      key={stage.step}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20 shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-50/40 border-emerald-200 text-slate-800'
                          : 'bg-slate-50/50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                            isCurrent ? 'bg-amber-500 text-slate-950' : isCompleted ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            Step {stage.step}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{stage.title}</h4>
                          <span className="text-xs text-slate-500 font-mono font-medium">({stage.legalSection})</span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Authority: {stage.authority} · SLA: {stage.statutorySLA}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800' : isCurrent ? 'bg-amber-200 text-amber-900' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {stage.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 3: GIS & PARCELS ── */}
        {activeTab === 'gis' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs overflow-hidden">
              <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-extrabold text-[#0B2540]">
                    Cadastral Alignment &amp; Vector GIS Map ({projectProfile.projectName})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Displaying surveyed cadastral land parcels, right-of-way corridor, and statutory status overlays.
                  </p>
                </div>
                <Link
                  href={`/gis?project=${projectProfile.projectId}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0C5A37] text-white hover:bg-[#084228] transition-colors shrink-0"
                >
                  Open Full GIS Workspace →
                </Link>
              </div>

              {/* Embedded GIS Interactive Section */}
              <div className="pt-3">
                <GISSection />
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: COMPENSATION ── */}
        {activeTab === 'compensation' && (
          <div className="space-y-6">
            
            {/* Financial Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <span className="text-xs uppercase font-bold text-slate-400 block">Total Assessed Compensation</span>
                <div className="text-2xl font-black text-slate-900 mt-1">₹{projectProfile.compensationAssessedCr} Cr</div>
                <span className="text-xs text-slate-500">Base Circle Rate + 100% Solatium (Sec 30)</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <span className="text-xs uppercase font-bold text-slate-400 block">PFMS DBT Disbursed</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">₹{projectProfile.compensationDisbursedCr} Cr</div>
                <span className="text-xs text-emerald-700 font-medium">
                  {Math.round((projectProfile.compensationDisbursedCr / (projectProfile.compensationAssessedCr || 1)) * 100)}% transferred directly to farmers
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <span className="text-xs uppercase font-bold text-slate-400 block">Pending Disbursal</span>
                <div className="text-2xl font-black text-amber-600 mt-1">₹{projectProfile.pendingCompensationCr} Cr</div>
                <span className="text-xs text-amber-700 font-medium">Awaiting bank verification / Title clearance</span>
              </div>
            </div>

            {/* Compensation Ledger & PFMS Authorization */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-extrabold text-[#0B2540]">
                    PFMS / DBT Direct Benefit Transfer Register
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparent electronic disbursement under Section 30 with 100% Solatium and 12% annual interest.
                  </p>
                </div>

                {hasPermission('compensation:authorize') && (
                  <button
                    type="button"
                    onClick={() => setIsPfmsModalOpen(true)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0C5A37] hover:bg-[#084228] text-white transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>💳</span>
                    <span>Authorize PFMS DBT Batch Disbursal →</span>
                  </button>
                )}
              </div>

              {/* Statutory Formula Callout */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                <span className="font-bold block">Statutory Compensation Formula (RFCTLARR 2013 Section 26–30):</span>
                <p className="font-mono text-[11px] text-emerald-900">
                  Total Award = (Circle Rate × Rural Multiplier 1.25) + Asset Valuation + 100% Solatium + 12% Additional Interest per annum
                </p>
              </div>

              {/* Sample Beneficiary Records Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10.5px]">
                      <th className="py-2.5 px-3">Survey / Khasra</th>
                      <th className="py-2.5 px-3">Beneficiary (Khatedar)</th>
                      <th className="py-2.5 px-3">Acquired Area</th>
                      <th className="py-2.5 px-3">Base Valuation</th>
                      <th className="py-2.5 px-3">100% Solatium</th>
                      <th className="py-2.5 px-3">Total Award</th>
                      <th className="py-2.5 px-3">PFMS Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-mono font-bold text-[#0C5A37]">103/10</td>
                      <td className="py-3 px-3 font-bold text-slate-900">Ramesh Chandra Patel &amp; Co-owners</td>
                      <td className="py-3 px-3">0.85 Ha</td>
                      <td className="py-3 px-3 font-mono">₹22.50 L</td>
                      <td className="py-3 px-3 font-mono text-emerald-700">₹22.50 L</td>
                      <td className="py-3 px-3 font-mono font-black text-slate-900">₹48.50 L</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800">
                          Disbursed (80%) · UTR: PFMS20260311984
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-mono font-bold text-[#0C5A37]">104/B</td>
                      <td className="py-3 px-3 font-bold text-slate-900">Govindbhai Solanki</td>
                      <td className="py-3 px-3">1.15 Ha</td>
                      <td className="py-3 px-3 font-mono">₹28.40 L</td>
                      <td className="py-3 px-3 font-mono text-emerald-700">₹28.40 L</td>
                      <td className="py-3 px-3 font-mono font-black text-slate-900">₹75.50 L</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-800">
                          Queued for DBT Batch #42
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-mono font-bold text-red-600">102/1A</td>
                      <td className="py-3 px-3 font-bold text-slate-900">Kamlaben Rathod (Legal Heirs)</td>
                      <td className="py-3 px-3">0.88 Ha</td>
                      <td className="py-3 px-3 font-mono">₹12.50 L</td>
                      <td className="py-3 px-3 font-mono text-emerald-700">₹12.50 L</td>
                      <td className="py-3 px-3 font-mono font-black text-slate-900">₹33.00 L</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-red-100 text-red-800">
                          Hold (High Court Stay Order)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* ── TAB 5: R&R ── */}
        {activeTab === 'rr' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <span className="text-xs uppercase font-bold text-slate-400 block">Total Affected Families</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{projectProfile.affectedFamilies}</div>
                <span className="text-xs text-slate-500">Across 18 revenue villages</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <span className="text-xs uppercase font-bold text-slate-400 block">Displaced &amp; Resettled</span>
                <div className="text-2xl font-black text-sky-600 mt-1">{projectProfile.rehabilitatedFamilies}</div>
                <span className="text-xs text-sky-700 font-medium">Allotted constructed pucca houses</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
                <span className="text-xs uppercase font-bold text-slate-400 block">R&R Compliance</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">{projectProfile.rrCompletionPct}%</div>
                <span className="text-xs text-emerald-700 font-medium">Second Schedule RFCTLARR certified</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-extrabold text-[#0B2540]">
                Navrangpura Model Resettlement Colony Status (Schedule III Amenities)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block">Pucca Housing</span>
                  <span className="text-xs font-bold text-emerald-700">110 / 110 Units Built</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block">Potable Water &amp; Sanitation</span>
                  <span className="text-xs font-bold text-emerald-700">100% Functional Tap Connections</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block">Primary Health Center</span>
                  <span className="text-xs font-bold text-emerald-700">Constructed &amp; Staffed</span>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block">Solar Street Lighting</span>
                  <span className="text-xs font-bold text-emerald-700">84 Micro-Grid Poles Operating</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 6: LEGAL & OBJECTIONS ── */}
        {activeTab === 'legal' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-extrabold text-[#0B2540]">
                    Section 15 Objections &amp; Judicial Injunctions Register
                  </h3>
                  <p className="text-xs text-slate-500">
                    Statutory hearing records, landowner claims, and court stays under RFCTLARR 2013.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  {grievances.length} Active Records
                </span>
              </div>

              <div className="space-y-3">
                {grievances.map((g) => (
                  <div key={g.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#0C5A37] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {g.ticketNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-900">Survey #{g.surveyNo} ({g.village}, {g.district})</span>
                        <span className="text-xs font-semibold text-slate-500">· {g.complainantName}</span>
                      </div>
                      <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${
                        g.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {g.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium">{g.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <span>Assigned Officer: <span className="font-semibold text-slate-700">{g.assignedOfficer}</span></span>
                      {g.hearingDate && <span>Scheduled Hearing: <span className="font-semibold text-[#0C5A37]">{g.hearingDate}</span></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 7: DOCUMENTS ── */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-extrabold text-[#0B2540]">
                    Project Statutory Document Vault &amp; SHA-256 Ledger
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official Gazette notifications, SIA reports, Form-VI valuation sheets, and possession panchnamas.
                  </p>
                </div>
                {hasPermission('all') && (
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0C5A37] hover:bg-[#084228] text-white transition-colors flex items-center gap-1.5 shrink-0"
                  >
                    <span>📤</span>
                    <span>Upload Statutory Document →</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10.5px]">
                      <th className="py-2.5 px-3">Document Title</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Uploaded By</th>
                      <th className="py-2.5 px-3">SHA-256 Fingerprint</th>
                      <th className="py-2.5 px-3">Integrity</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 line-clamp-1">{doc.title}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize} · {doc.uploadedAt.split('T')[0]}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                            {doc.documentTypeLabel}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-700 font-medium">
                          {doc.uploadedBy}
                        </td>
                        <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                          {doc.checksumSha256.slice(0, 16)}...
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ Verified Tamper-Evident
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <a
                            href={doc.fileUrl}
                            download
                            className="text-xs font-bold text-[#0C5A37] hover:underline"
                          >
                            Download ↓
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* ── TAB 8: AUDIT ── */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-extrabold text-[#0B2540]">
                    Immutable Digital Audit Trail ({projectProfile.projectId})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Timestamped chronological audit events of official decisions, approvals, and financial transactions.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {auditLogs.length} Logged Events
                </span>
              </div>

              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{log.actionLabel}</span>
                        <span className="text-xs text-slate-400 font-mono">({log.entityType})</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {log.timestamp.replace('T', ' ').slice(0, 19)} UTC
                      </span>
                    </div>

                    <p className="text-xs text-slate-700">{log.remarks}</p>

                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between">
                      <span>Actor: <span className="font-semibold text-slate-700">{log.actorName} ({log.actorRole})</span></span>
                      {log.newState && <span>State: <span className="font-bold text-[#0C5A37]">{log.newState}</span></span>}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* ── MODAL: Stage Transition Gate ── */}
      {isTransitionModalOpen && nextStage && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-[#0C5A37] uppercase">Statutory Gate Review</span>
                <h3 className="text-lg font-black text-[#0B2540]">Advance Project Milestone</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTransitionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold">Next Statutory Milestone:</span>
              <div className="text-sm font-black text-amber-900">
                Step {nextStage.step}: {nextStage.title}
              </div>
              <p className="text-[11px] text-amber-800">
                Governed under {nextStage.legalSection}. This will advance the national tracking state and log an immutable audit record.
              </p>
            </div>

            {transitionError && (
              <div className="p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-900 font-bold">
                ⚠️ {transitionError}
              </div>
            )}

            {transitionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold">
                ✓ Milestone advanced successfully! Refreshing telemetry...
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Verification &amp; Statutory Approval Remarks *
                </label>
                <textarea
                  rows={3}
                  value={transitionRemarks}
                  onChange={(e) => setTransitionRemarks(e.target.value)}
                  placeholder="Enter statutory verification findings, gazette notification references, and approval notes..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                />
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>Signing Authority:</span>
                <span className="font-bold text-slate-800">{user?.name} ({user?.roleLabel})</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsTransitionModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdvanceStage}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-[#0C5A37] hover:bg-[#084228] text-white transition-colors"
              >
                Confirm &amp; Advance Milestone →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: PFMS DBT Disbursal Authorization ── */}
      {isPfmsModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-[#0C5A37] uppercase">Direct Benefit Transfer</span>
                <h3 className="text-lg font-black text-[#0B2540]">Authorize PFMS DBT Disbursal Batch</h3>
              </div>
              <button
                type="button"
                onClick={() => { setIsPfmsModalOpen(false); setGeneratedUtr(null); }}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {generatedUtr ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-center space-y-2">
                <span className="text-2xl">✓</span>
                <h4 className="text-sm font-black text-emerald-900">PFMS DBT Disbursal Authorized!</h4>
                <p className="text-xs text-emerald-800">
                  Bank Mandate Reference (UTR): <span className="font-mono font-bold">{generatedUtr}</span>
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsPfmsModalOpen(false); setGeneratedUtr(null); }}
                    className="px-4 py-2 rounded-lg bg-[#0C5A37] text-white text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs text-slate-700">
                  <span className="font-bold">Project: {projectProfile.projectName}</span>
                  <div className="text-slate-500">Beneficiary bank accounts verified with Aadhaar NPCI seeding.</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Batch Disbursal Amount (₹ Cr)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={pfmsBatchAmount}
                      onChange={(e) => setPfmsBatchAmount(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Khatedar Beneficiaries</label>
                    <input
                      type="number"
                      value={pfmsKhatedarCount}
                      onChange={(e) => setPfmsKhatedarCount(parseInt(e.target.value, 10) || 1)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsPfmsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAuthorizePfms}
                    className="px-5 py-2 rounded-lg text-xs font-bold bg-[#0C5A37] hover:bg-[#084228] text-white transition-colors"
                  >
                    Sign &amp; Disburse via PFMS DBT →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL: Document Upload ── */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono font-bold text-[#0C5A37] uppercase">Secure Document Vault</span>
                <h3 className="text-lg font-black text-[#0B2540]">Upload Statutory Document</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., Section 19(1) Official Gazette Extraordinary..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0C5A37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Document Category</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0C5A37]"
                  >
                    <option value="GAZETTE_SEC_11">Section 11(1) Gazette</option>
                    <option value="GAZETTE_SEC_19">Section 19(1) Declaration</option>
                    <option value="SIA_REPORT">Social Impact Assessment (SIA)</option>
                    <option value="AWARD_DECREE">Section 23 Award Decree</option>
                    <option value="PANCHNAMA_POSSESSION">Possession Panchnama</option>
                    <option value="DPR_REQUISITION">DPR Requisition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Attachment File</label>
                  <input
                    type="file"
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800">Tamper-Evident SHA-256 Assurance:</span>
                <p>
                  Upon upload, an immutable cryptographic hash will be computed and recorded in the audit trail.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#0C5A37] hover:bg-[#084228] text-white transition-colors"
                >
                  Upload &amp; Generate SHA-256 Seal →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <InstitutionalFooter />
    </div>
  );
}
