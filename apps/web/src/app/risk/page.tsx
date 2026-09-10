'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { projectStore } from '../../lib/projectStore';
import { AcquisitionProject } from '../../data/homepageData';

export default function RiskIntelligencePage() {
  const { isHindi } = useLocale();

  const [projects, setProjects] = useState<AcquisitionProject[]>([]);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'STATUTORY_RULES' | 'BOTTLENECK_HEATMAP'>('ALERTS');
  const [remedyActionNotice, setRemedyActionNotice] = useState<string | null>(null);

  useEffect(() => {
    setProjects(projectStore.getProjects());
  }, []);

  const criticalProjects = projects.filter((p) => p.riskLevel === 'Critical');
  const highRiskProjects = projects.filter((p) => p.riskLevel === 'High');

  const filteredProjects = projects.filter((p) => {
    if (selectedRiskFilter === 'ALL') return true;
    return p.riskLevel.toUpperCase() === selectedRiskFilter.toUpperCase();
  });

  const handleDispatchAction = (projectName: string, actionName: string) => {
    setRemedyActionNotice(`Statutory directive dispatched for "${projectName}": ${actionName}. Notification logged.`);
    projectStore.addNotification({
      title: `Urgent Risk Intervention: ${projectName}`,
      message: `Directive issued: ${actionName}`,
      type: 'SLA_WARNING',
      priority: 'critical',
      targetRole: 'CALA',
      linkUrl: `/projects?search=${encodeURIComponent(projectName)}`,
    });
    setTimeout(() => {
      setRemedyActionNotice(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/" className="hover:text-slate-800 transition-colors">
                {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#0C5A37] font-bold">
                {isHindi ? 'जोखिम एवं प्रारंभिक चेतावनी केंद्र' : 'National Risk & Early Warning Console'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {isHindi ? 'राष्ट्रीय भूमि अधिग्रहण जोखिम एवं संविधि अनुपालन चेतावनी' : 'Statutory Risk Intelligence & Delay Early Warning System'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {isHindi
                ? 'आरएफसीटीएलएआरआर अधिनियम 2013 के तहत धारा 19(7) और धारा 25 की वैधानिक व्यपगत सीमाओं की स्वचालित निगरानी'
                : 'Automated monitoring of statutory RFCTLARR Act 2013 lapse deadlines (Sec 19(7) & Sec 25), PFMS DBT disbursement bottlenecks, and pending high court stays.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-bold text-red-700">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{criticalProjects.length} Critical Bottlenecks Flagged</span>
            </span>
            <Link
              href="/command"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors shadow-xs"
            >
              Command Center →
            </Link>
          </div>
        </div>

        {/* Remedy Action Notification Banner */}
        {remedyActionNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span>{remedyActionNotice}</span>
            </div>
            <button type="button" onClick={() => setRemedyActionNotice(null)} className="text-emerald-700 hover:text-emerald-950">
              ✕
            </button>
          </div>
        )}

        {/* Critical KPI Summary Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-1">
            <div className="text-[11px] font-bold text-red-800 uppercase tracking-wider">
              Statutory Lapsing Risk (Sec 19/25)
            </div>
            <div className="text-2xl font-black text-red-700">2 Projects</div>
            <div className="text-[10px] text-red-800 font-medium">Over 300 days elapsed since Sec 11</div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              High Litigation & Stays
            </div>
            <div className="text-2xl font-black text-amber-700">3 Projects</div>
            <div className="text-[10px] text-amber-800 font-medium">18 Parcels injuncted in High Courts</div>
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-1">
            <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">
              Compensation DBT Bottlenecks
            </div>
            <div className="text-2xl font-black text-blue-700">₹84.2 Cr</div>
            <div className="text-[10px] text-blue-800 font-medium">Pending PFMS bank validation / RoR sync</div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
            <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              Low Risk / On-Track
            </div>
            <div className="text-2xl font-black text-[#0C5A37]">
              {projects.filter((p) => p.riskLevel === 'Low').length} Projects
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">Within statutory SLA timeline</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-2xs">
          {[
            { id: 'ALERTS' as const, label: isHindi ? '१. सक्रिय जोखिम एवं सुधारात्मक आदेश' : '1. Critical Risk Alerts & Interventions' },
            { id: 'STATUTORY_RULES' as const, label: isHindi ? '२. आरएफसीटीएलएआरआर संविधि अनुपालन मैट्रिक्स' : '2. Statutory Lapse Rules Engine' },
            { id: 'BOTTLENECK_HEATMAP' as const, label: isHindi ? '३. राष्ट्रीय गतिरोध विश्लेषण' : '3. National Bottleneck Heatmap' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: ALERTS & REMEDIAL ACTIONS */}
        {activeTab === 'ALERTS' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <span className="font-bold text-slate-700">Filter by Risk Rating:</span>
              <div className="flex items-center gap-2">
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedRiskFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedRiskFilter === lvl
                        ? 'bg-[#0B2540] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Projects with Specific Risk Breakdowns */}
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    project.riskLevel === 'Critical'
                      ? 'bg-red-50/40 border-red-200 shadow-sm'
                      : project.riskLevel === 'High'
                      ? 'bg-amber-50/40 border-amber-200 shadow-sm'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase ${
                            project.riskLevel === 'Critical'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : project.riskLevel === 'High'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {project.riskLevel} Risk
                        </span>
                        <span className="font-mono text-xs text-slate-500 font-semibold">{project.id}</span>
                        <span className="text-xs text-slate-400">• {project.district}, {project.state}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0B2540] mt-1">{project.name}</h3>
                      <div className="text-xs text-slate-600">
                        Current Statutory Milestone: <strong>{project.stage}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/projects/${project.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0B2540] hover:bg-[#1E3A5F] transition-colors text-center"
                      >
                        Open Workspace →
                      </Link>
                      <Link
                        href={`/lifecycle?project=${project.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0C5A37] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      >
                        Lifecycle Timeline
                      </Link>
                    </div>
                  </div>

                  {/* Why this is High Risk (Decision Support Explainability) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                        Identified Delay Drivers
                      </span>
                      <ul className="space-y-1 text-slate-800 font-medium list-disc list-inside">
                        {project.riskFactors && project.riskFactors.length > 0 ? (
                          project.riskFactors.map((rf, idx) => <li key={idx}>{rf}</li>)
                        ) : (
                          <li>Standard statutory review in progress.</li>
                        )}
                        <li>SLA Days Remaining: {project.slaDaysRemaining} Days</li>
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10.5px]">
                        Quantified Acquisition Impact
                      </span>
                      <div className="space-y-0.5 text-slate-700">
                        <div>Notified Area: <strong>{project.landNotifiedHa} Ha</strong></div>
                        <div>Possessed: <strong>{project.landAcquiredHa} Ha</strong></div>
                        <div>Affected Families: <strong>{project.affectedFamilies}</strong></div>
                        <div>Compensation Pending: <strong>₹{(project.compensationAssessedCr - project.compensationDisbursedCr).toFixed(1)} Cr</strong></div>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-[#0C5A37] flex items-center gap-1 text-[11px]">
                          <span>🛡️</span>
                          <span>Statutory Recommendation</span>
                        </span>
                        <p className="text-slate-700 text-[11px] mt-1 leading-snug">
                          {project.recommendedAction}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDispatchAction(
                            project.name,
                            'Notice to CALA for urgent Section 15 disposal / Section 19 notification issuance'
                          )
                        }
                        className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-2xs text-center"
                      >
                        Dispatch Remedial Directive ⚡
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: STATUTORY LAPSE RULES ENGINE */}
        {activeTab === 'STATUTORY_RULES' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-[#0B2540]">
                RFCTLARR Act 2013 Deterministic Compliance Guardrails
              </h3>
              <p className="text-xs text-slate-500">
                Statutory lapse timelines enforced by the Bhu-Mitra algorithmic state engine to prevent illegal delays and acquisition expiration.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-2">
                <div className="text-[10.5px] font-bold text-red-800 uppercase">Statutory Rule 1</div>
                <div className="font-bold text-slate-900 text-sm">Section 19(7) Declaration Window</div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Final acquisition declaration under Section 19(1) must be published within exactly <strong>12 months</strong> of the Section 11 preliminary notification date. If not gazetted, the entire acquisition lapses automatically.
                </p>
                <div className="pt-2 border-t border-red-200 text-red-700 font-bold">
                  Rule Trigger: SLA Day &lt; 30 → Alerts CALA & DoLR
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <div className="text-[10.5px] font-bold text-amber-800 uppercase">Statutory Rule 2</div>
                <div className="font-bold text-slate-900 text-sm">Section 25 Award Deadline</div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Collector must pass the official compensation award within <strong>12 months</strong> of the date of publication of the Section 19 declaration. Failure terminates proceedings unless extended by State Government.
                </p>
                <div className="pt-2 border-t border-amber-200 text-amber-700 font-bold">
                  Rule Trigger: Month 10 → Mandatory Collectorate Hearing
                </div>
              </div>

              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="text-[10.5px] font-bold text-emerald-800 uppercase">Statutory Rule 3</div>
                <div className="font-bold text-slate-900 text-sm">Section 38 Possession Inviolability</div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Collector shall take physical possession of land <strong>only after</strong> full compensation has been paid or deposited, and rehabilitation monetary entitlements disbursed to affected families.
                </p>
                <div className="pt-2 border-t border-emerald-200 text-emerald-700 font-bold">
                  Rule Trigger: Disbursed &lt; 80% → Locks Possession Stage
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NATIONAL BOTTLENECK HEATMAP */}
        {activeTab === 'BOTTLENECK_HEATMAP' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-bold text-[#0B2540]">
                National Land Acquisition Bottleneck Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Aggregated distribution of stalled parcels across legal objections, title disputes, and PFMS banking mismatches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-semibold">Title Disputes & Injunctions</span>
                <div className="text-2xl font-black text-slate-900">42 Parcels</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-2/3" />
                </div>
                <div className="text-[10.5px] text-slate-500">High Court SCA & Civil Suits</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-semibold">Horticulture Tree Re-evaluation</span>
                <div className="text-2xl font-black text-slate-900">28 Parcels</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-1/2" />
                </div>
                <div className="text-[10.5px] text-slate-500">Section 15 hearings pending</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-semibold">Aadhaar Bank Seed Mismatch</span>
                <div className="text-2xl font-black text-slate-900">19 Beneficiaries</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-1/3" />
                </div>
                <div className="text-[10.5px] text-slate-500">PFMS rejection code E-04</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-slate-500 font-semibold">Forest Clearance (Stage-II)</span>
                <div className="text-2xl font-black text-slate-900">6 Projects</div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-1/4" />
                </div>
                <div className="text-[10.5px] text-slate-500">PARIVESH Portal Inter-link</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <InstitutionalFooter />
    </div>
  );
}
