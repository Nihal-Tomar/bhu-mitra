'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { DEMO_DATA_DISCLAIMER, AcquisitionProject } from '../../data/homepageData';
import { projectStore } from '../../lib/projectStore';

export default function ProjectsPage() {
  const { isHindi } = useLocale();
  const [allProjects, setAllProjects] = useState<AcquisitionProject[]>([]);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [activeProject, setActiveProject] = useState<AcquisitionProject | null>(null);

  useEffect(() => {
    setAllProjects(projectStore.getProjects());
  }, []);

  const states = ['All', ...Array.from(new Set(allProjects.map((p) => p.state))).sort()];
  const sectors = ['All', 'Highways', 'Railways', 'Renewable Energy', 'Urban Infra', 'Industrial Corridor'];
  const stages = ['All', 'Proposal', 'Administrative Scrutiny', 'Section 11 Notification', 'Section 15 Hearing', 'Section 19 Declaration', 'Section 23 Award', 'Compensation Disbursement', 'R&R Implementation', 'Possession Complete'];
  const risks = ['All', 'Low', 'Medium', 'High', 'Critical'];

  const filtered = allProjects.filter((p) => {
    const term = search.toLowerCase();
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.district.toLowerCase().includes(term) ||
      p.state.toLowerCase().includes(term) ||
      p.ministry.toLowerCase().includes(term) ||
      (p.implementingAgency && p.implementingAgency.toLowerCase().includes(term)) ||
      (p.projectLocation && p.projectLocation.toLowerCase().includes(term));
    const matchesState = stateFilter === 'All' || p.state === stateFilter;
    const matchesSector = sectorFilter === 'All' || p.type === sectorFilter;
    const matchesStage = stageFilter === 'All' || p.stage.toLowerCase().includes(stageFilter.toLowerCase());
    const matchesRisk = riskFilter === 'All' || p.riskLevel === riskFilter;
    return matchesSearch && matchesState && matchesSector && matchesStage && matchesRisk;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Title & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/" className="hover:text-slate-800 transition-colors">
                {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#0C5A37] font-bold">
                {isHindi ? 'परियोजना निर्देशिका' : 'Acquisition Projects'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {isHindi ? 'राष्ट्रीय भूमि अधिग्रहण परियोजना निर्देशिका' : 'National Land Acquisition Projects Directory'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {isHindi
                ? 'सभी 28 राज्यों में सक्रिय अवसंरचना परियोजनाओं की चरणबद्ध एवं वैधानिक स्थिति'
                : 'Comprehensive registry of linear and site-based infrastructure acquisitions under RFCTLARR Act 2013.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
              {filtered.length} / {allProjects.length} {isHindi ? 'परियोजनाएं' : 'Projects'}
            </span>
            <Link
              href="/projects/new"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#D97706] hover:bg-[#B45309] transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>+</span>
              <span>{isHindi ? 'नया प्रस्ताव जमा करें' : 'Submit New Proposal'}</span>
            </Link>
            <Link
              href="/command"
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors"
            >
              {isHindi ? 'कमान केंद्र →' : 'Command Center →'}
            </Link>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-1">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {isHindi ? 'खोजें' : 'Search'}
              </label>
              <input
                type="text"
                placeholder={isHindi ? 'परियोजना, कोड, जिला...' : 'Name, ID, District...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
              />
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {isHindi ? 'राज्य' : 'State'}
              </label>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
              >
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st === 'All' ? (isHindi ? 'सभी राज्य' : 'All States') : st}
                  </option>
                ))}
              </select>
            </div>

            {/* Sector Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {isHindi ? 'क्षेत्र' : 'Sector'}
              </label>
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec === 'All' ? (isHindi ? 'सभी क्षेत्र' : 'All Sectors') : sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {isHindi ? 'वैधानिक चरण' : 'Stage'}
              </label>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
              >
                {stages.map((stg) => (
                  <option key={stg} value={stg}>
                    {stg === 'All' ? (isHindi ? 'सभी चरण' : 'All Stages') : stg}
                  </option>
                ))}
              </select>
            </div>

            {/* Risk Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {isHindi ? 'जोखिम रेटिंग' : 'Risk Level'}
              </label>
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
              >
                {risks.map((rk) => (
                  <option key={rk} value={rk}>
                    {rk === 'All' ? (isHindi ? 'सभी रेटिंग' : 'All Risk Levels') : rk}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#0C5A37] border border-emerald-200 uppercase tracking-wide">
                    {project.type}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      project.riskLevel === 'Low'
                        ? 'bg-emerald-100 text-emerald-800'
                        : project.riskLevel === 'Medium'
                        ? 'bg-blue-100 text-blue-800'
                        : project.riskLevel === 'High'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {project.riskLevel} {isHindi ? 'जोखिम' : 'Risk'}
                  </span>
                </div>

                <div>
                  <Link href={`/projects/${project.id}`} className="hover:text-[#0C5A37] transition-colors">
                    <h3 className="text-base font-bold text-[#0B2540] line-clamp-1">{project.name}</h3>
                  </Link>
                  <div className="text-xs text-slate-500 font-medium">
                    {project.district}, {project.state} • <span className="font-mono text-[11px] font-semibold text-[#0C5A37]">{project.id}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold">{isHindi ? 'वैधानिक चरण' : 'Stage'}:</span>
                    <span className="font-bold text-[#0C5A37]">{project.stage}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#138808] h-full rounded-full" style={{ width: `${project.stageProgress}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[10.5px] text-slate-500">
                    <span>{project.stageProgress}% {isHindi ? 'पूर्ण' : 'progress'}</span>
                    <span>
                      {project.slaDaysRemaining > 0
                        ? `${project.slaDaysRemaining} ${isHindi ? 'दिन शेष' : 'days SLA'}`
                        : `${Math.abs(project.slaDaysRemaining)} ${isHindi ? 'दिन विलंबित' : 'days overdue'}`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10.5px]">{isHindi ? 'भूमि (हेक्टेयर)' : 'Land Area'}</div>
                    <div className="font-bold text-slate-800">{project.landNotifiedHa} Ha</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10.5px]">{isHindi ? 'संवितरित प्रतिकर' : 'Disbursed'}</div>
                    <div className="font-bold text-slate-800">₹{project.compensationDisbursedCr} Cr</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
                <Link
                  href={`/projects/${project.id}`}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0B2540] hover:bg-[#1E3A5F] transition-colors text-center"
                >
                  {isHindi ? 'कमांड सेंटर →' : 'Workspace →'}
                </Link>
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                  <Link
                    href={`/lifecycle?project=${project.id}`}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0C5A37] bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    {isHindi ? 'जीवनचक्र' : 'Lifecycle'}
                  </Link>
                  <Link
                    href={`/gis?project=${project.id}`}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0C5A37] hover:bg-[#084228] text-white transition-colors"
                  >
                    {isHindi ? 'जीआईएस' : 'GIS'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-right">
          <span className="text-[11px] text-slate-500 font-mono">
            * {DEMO_DATA_DISCLAIMER}
          </span>
        </div>
      </main>

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#0C5A37] uppercase tracking-wider">{activeProject.type}</span>
                <h2 className="text-xl font-black text-[#0B2540]">{activeProject.name}</h2>
                <span className="text-xs font-mono text-slate-400">{activeProject.id} • {activeProject.ministry}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Acquisition Progress Telemetry Header */}
            <div className="p-3 bg-[#0B2540] text-white rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 uppercase tracking-wider">Acquisition Progress</span>
                <span className="font-mono text-emerald-300 font-bold">{activeProject.stageProgress}% Complete</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-[#138808] h-full rounded-full" style={{ width: `${activeProject.stageProgress}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                <span>Stage: <strong>{activeProject.stage}</strong></span>
                <span>{activeProject.slaDaysRemaining > 0 ? `${activeProject.slaDaysRemaining} Days SLA` : `${Math.abs(activeProject.slaDaysRemaining)} Days Delayed`}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-slate-500 font-semibold">{isHindi ? 'स्थान' : 'Jurisdiction'}</div>
                <div className="font-bold text-slate-900 mt-0.5">{activeProject.district}, {activeProject.state}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-slate-500 font-semibold">{isHindi ? 'अधिसूचित क्षेत्र' : 'Notified Area'}</div>
                <div className="font-bold text-slate-900 mt-0.5">{activeProject.landNotifiedHa} Ha / {activeProject.landProposedHa} Ha</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{activeProject.landAcquiredHa} Ha Possessed</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-slate-500 font-semibold">{isHindi ? 'प्रभावित परिवार' : 'Affected Families'}</div>
                <div className="font-bold text-slate-900 mt-0.5">{activeProject.affectedFamilies} families</div>
                <div className="text-[10px] text-slate-500">{activeProject.displacedFamilies} displaced</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-slate-500 font-semibold">{isHindi ? 'मूल्यांकन एवं प्रतिकर' : 'Valuation & Compensation'}</div>
                <div className="font-bold text-slate-900 mt-0.5">Assessed: ₹{activeProject.compensationAssessedCr} Cr</div>
                <div className="text-[#138808] font-bold">Disbursed: ₹{activeProject.compensationDisbursedCr} Cr</div>
                <div className="text-slate-500 text-[10px]">Pending: ₹{(activeProject.compensationAssessedCr - activeProject.compensationDisbursedCr).toFixed(1)} Cr</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-slate-500 font-semibold">{isHindi ? 'वैधानिक अनुपालन' : 'Statutory Milestones'}</div>
                <div className="font-bold text-slate-900 mt-0.5">{activeProject.stage}</div>
                <div className="text-slate-600 font-medium text-[11px] mt-0.5">
                  RFCTLARR Act 2013 Statutory Compliance Active
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 rounded-lg border border-amber-200 text-xs space-y-1">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <span>⚠️ {isHindi ? 'जोखिम कारक एवं अनुशंसित कार्रवाई' : 'Identified Risk & Statutory Recommendation'}</span>
              </div>
              <p className="text-amber-900 leading-relaxed">{activeProject.recommendedAction}</p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
              <Link
                href={`/projects/${activeProject.id}`}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-[#0B2540] hover:bg-[#1E3A5F] transition-colors"
              >
                {isHindi ? 'परियोजना कमान केंद्र खोलें →' : 'Open Command Center →'}
              </Link>
              <Link
                href={`/lifecycle?project=${activeProject.id}`}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-[#0C5A37] bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                {isHindi ? 'अधिग्रहण जीवनचक्र देखें →' : 'View Acquisition Journey →'}
              </Link>
              <Link
                href={`/gis?project=${activeProject.id}`}
                className="px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors"
              >
                {isHindi ? 'जीआईएस पार्सल मैप देखें →' : 'View Parcels on GIS →'}
              </Link>
            </div>
          </div>
        </div>
      )}

      <InstitutionalFooter />
    </div>
  );
}
