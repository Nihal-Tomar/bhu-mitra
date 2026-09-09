'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { ACQUISITION_PROJECTS, ACQUISITION_ALERTS, DEMO_DATA_DISCLAIMER } from '../../data/homepageData';
import { apiGetDashboard, type DashboardMetrics } from '../../lib/api';

export default function CommandPage() {
  const { isHindi, t } = useLocale();
  const [sectorFilter, setSectorFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [selectedProject, setSelectedProject] = useState<typeof ACQUISITION_PROJECTS[0] | null>(null);

  useEffect(() => {
    let active = true;
    apiGetDashboard()
      .then((data) => {
        if (active) setMetrics(data);
      })
      .catch(() => {
        // Fallback to model data
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredProjects = ACQUISITION_PROJECTS.filter((p) => {
    const matchesSector = sectorFilter === 'All' || p.type.toLowerCase().includes(sectorFilter.toLowerCase());
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term) ||
      p.state.toLowerCase().includes(term) ||
      p.district.toLowerCase().includes(term) ||
      p.ministry.toLowerCase().includes(term) ||
      (p.implementingAgency && p.implementingAgency.toLowerCase().includes(term)) ||
      (p.projectLocation && p.projectLocation.toLowerCase().includes(term));
    return matchesSector && matchesSearch;
  });

  const fallbackTotalProjects = ACQUISITION_PROJECTS.length;
  const fallbackTotalNotifiedHa = Math.round(ACQUISITION_PROJECTS.reduce((s, p) => s + p.landNotifiedHa, 0));
  const fallbackTotalAcquiredHa = Math.round(ACQUISITION_PROJECTS.reduce((s, p) => s + p.landAcquiredHa, 0));
  const fallbackCompensationPaidCr = Math.round(ACQUISITION_PROJECTS.reduce((s, p) => s + p.compensationDisbursedCr, 0));
  const fallbackSlaComplianceRate = Number(((ACQUISITION_PROJECTS.filter((p) => p.slaDaysRemaining >= 0).length / ACQUISITION_PROJECTS.length) * 100).toFixed(1));
  const fallbackAlertsCount = ACQUISITION_PROJECTS.filter((p) => p.riskLevel === 'Critical' || p.slaDaysRemaining < 5).length;
  const fallbackPossessionPct = fallbackTotalNotifiedHa > 0 ? ((fallbackTotalAcquiredHa / fallbackTotalNotifiedHa) * 100).toFixed(1) : '58.0';

  const stateDistribution = [
    { state: isHindi ? 'गुजरात' : 'Gujarat', projects: 148, areaHa: 820, sla: 94, risk: 'Low', color: '#138808' },
    { state: isHindi ? 'महाराष्ट्र' : 'Maharashtra', projects: 195, areaHa: 1240, sla: 91, risk: 'Medium', color: '#155EEF' },
    { state: isHindi ? 'उत्तर प्रदेश' : 'Uttar Pradesh', projects: 241, areaHa: 1580, sla: 82, risk: 'Critical', color: '#B42318' },
    { state: isHindi ? 'राजस्थान' : 'Rajasthan', projects: 112, areaHa: 640, sla: 87, risk: 'High', color: '#B45309' },
    { state: isHindi ? 'मध्य प्रदेश' : 'Madhya Pradesh', projects: 98, areaHa: 520, sla: 96, risk: 'Low', color: '#138808' },
    { state: isHindi ? 'ओडिशा' : 'Odisha', projects: 76, areaHa: 380, sla: 88, risk: 'Medium', color: '#7C3AED' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      {/* Main Command Workspace */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Breadcrumbs & Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/" className="hover:text-slate-800 transition-colors">
                {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#0C5A37] font-bold">
                {isHindi ? 'राष्ट्रीय कमान केंद्र' : 'National Command'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {isHindi ? 'राष्ट्रीय भूमि अधिग्रहण कमान केंद्र' : 'National Land Acquisition Command Center'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {isHindi
                ? 'केंद्रीय मंत्रालयों, सक्षम प्राधिकारियों (CALA) एवं क्षेत्रीय टीमों हेतु समन्वित निर्णय प्रणाली'
                : 'Executive oversight & statutory decision support for Central Ministries, CALA Collectors & State Nodal Desks.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#0C5A37] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isHindi ? 'सक्रिय निगरानी' : 'Live Telemetry Active'}</span>
            </span>
            <Link
              href="/gis"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0C5A37] hover:bg-[#084228] text-white text-xs font-bold shadow-xs transition-colors"
            >
              <span>{isHindi ? 'जीआईएस मैप खोलें' : 'Open Acquisition GIS'}</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* 6 Executive Telemetry KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'कुल परियोजनाएं' : 'Total Projects'}
            </div>
            <div className="text-2xl font-black text-[#0B2540]">
              {metrics?.kpis?.totalProjects ? metrics.kpis.totalProjects.toLocaleString() : fallbackTotalProjects.toLocaleString()}
            </div>
            <div className="text-[10.5px] text-[#138808] font-semibold flex items-center gap-1">
              <span>↑ +42</span>
              <span className="text-slate-400 font-normal">{isHindi ? 'इस माह' : 'this month'}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'अधिसूचित भूमि' : 'Land Notified'}
            </div>
            <div className="text-2xl font-black text-[#0B2540]">
              {metrics?.kpis?.totalAreaHa ? `${metrics.kpis.totalAreaHa.toLocaleString()} Ha` : `${fallbackTotalNotifiedHa.toLocaleString()} Ha`}
            </div>
            <div className="text-[10.5px] text-slate-500 font-medium">
              {isHindi ? '86% जीआईएस कैडस्ट्रल' : '86% geo-referenced'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'कब्जा प्राप्त भूमि' : 'Land Possessed'}
            </div>
            <div className="text-2xl font-black text-[#138808]">
              {metrics?.kpis?.totalAreaAcquiredHa ? `${metrics.kpis.totalAreaAcquiredHa.toLocaleString()} Ha` : `${fallbackTotalAcquiredHa.toLocaleString()} Ha`}
            </div>
            <div className="text-[10.5px] text-[#138808] font-semibold">
              {fallbackPossessionPct}% {isHindi ? 'अधिग्रहण पूर्ण' : 'Possession complete'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'संवितरित प्रतिकर' : 'Compensation Paid'}
            </div>
            <div className="text-2xl font-black text-[#0B2540]">
              {metrics?.kpis?.compensationPaidCr ? `₹${metrics.kpis.compensationPaidCr.toLocaleString()} Cr` : `₹${fallbackCompensationPaidCr.toLocaleString()} Cr`}
            </div>
            <div className="text-[10.5px] text-slate-500 font-medium">
              {isHindi ? 'प्रत्यक्ष PFMS बैंक DBT' : 'PFMS Direct DBT (Demo)'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'वैधानिक SLA दर' : 'SLA Compliance'}
            </div>
            <div className="text-2xl font-black text-[#138808]">
              {metrics?.kpis?.slaComplianceRate ? `${metrics.kpis.slaComplianceRate}%` : `${fallbackSlaComplianceRate}%`}
            </div>
            <div className="text-[10.5px] text-slate-500 font-medium">
              {isHindi ? 'धारा 11 से 23 समयसीमा' : 'Sec 11 to 23 timelines'}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'प्राथमिकता अलर्ट' : 'Priority Alerts'}
            </div>
            <div className="text-2xl font-black text-[#B42318]">
              {metrics?.kpis?.slaAlertsCount ?? fallbackAlertsCount}
            </div>
            <div className="text-[10.5px] text-[#B42318] font-semibold">
              {isHindi ? 'शीघ्र कार्रवाई अपेक्षित' : 'Action required'}
            </div>
          </div>
        </div>

        {/* Middle Row: Priority Alerts Strip & State Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Priority Alerts (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  {isHindi ? 'सक्रिय प्राथमिकता अलर्ट एवं एसएलए जोखिम' : 'Active SLA Alerts & Critical Bottlenecks'}
                </h2>
              </div>
              <Link href="/risk" className="text-xs text-[#0C5A37] font-bold hover:underline">
                {isHindi ? 'सभी देखें →' : 'View All →'}
              </Link>
            </div>

            <div className="space-y-3">
              {ACQUISITION_ALERTS.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    alert.severity === 'Critical'
                      ? 'border-red-200 bg-red-50/60 text-red-950'
                      : 'border-amber-200 bg-amber-50/60 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          alert.severity === 'Critical' ? 'bg-red-600' : 'bg-amber-600'
                        }`}
                      />
                      <span>{alert.title}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-mono opacity-80">
                      {alert.category}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 leading-relaxed">{alert.description}</p>
                  <div className="pt-1 flex items-center justify-between text-[10.5px] font-semibold">
                    <span className="text-slate-600">{alert.projectName}</span>
                    <span className="text-[#0C5A37]">{alert.actionRequired}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* State-Wise Progress Distribution (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'राज्यवार अधिग्रहण प्रगति एवं एसएलए अनुपालन' : 'State Acquisition Volume & SLA Compliance'}
              </h2>
              <span className="text-xs text-slate-500 font-semibold font-mono">
                {isHindi ? 'शीर्ष 6 राज्य क्लस्टर' : 'Top 6 State Clusters'}
              </span>
            </div>

            <div className="space-y-3.5">
              {stateDistribution.map((item) => (
                <div key={item.state} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.state}</span>
                    </span>
                    <div className="flex items-center gap-4 text-slate-600 font-normal">
                      <span>{item.projects} {isHindi ? 'परियोजनाएं' : 'projects'}</span>
                      <span className="font-semibold text-slate-900">{item.areaHa} Ha</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.sla >= 90 ? 'bg-emerald-100 text-emerald-800' : item.sla >= 85 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.sla}% SLA
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.sla}%`,
                        backgroundColor: item.sla >= 90 ? '#138808' : item.sla >= 85 ? '#D97706' : '#DC2626',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Project Registry & Sector Filter Bar */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-[#0B2540]">
                {isHindi ? 'राष्ट्रीय अधिग्रहण परियोजना पाइपलाइन' : 'National Acquisition Project Pipeline'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi
                  ? 'धारा 11 अधिसूचना से कब्जा हस्तांतरण तक वैधानिक स्थिति'
                  : 'Track statutory milestones from Section 11 notice to physical legal possession.'}
              </p>
            </div>

            {/* Sector filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['All', 'Highways', 'Railways', 'Renewable', 'Urban', 'Industrial'].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSectorFilter(sec)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    sectorFilter === sec
                      ? 'bg-[#0C5A37] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sec === 'All' ? (isHindi ? 'सभी' : 'All Sectors') : sec}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={isHindi ? 'परियोजना नाम, आईडी अथवा राज्य खोजें...' : 'Search project by name, ID, or state...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs font-medium px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-y border-slate-200 text-[10.5px]">
                <tr>
                  <th className="py-2.5 px-3">{isHindi ? 'परियोजना / आईडी' : 'Project / ID'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'क्षेत्र / मंत्रालय' : 'Sector / Ministry'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'राज्य / जिला' : 'State / District'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'वैधानिक चरण' : 'Statutory Stage'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'क्षेत्रफल (Ha)' : 'Area (Ha)'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'प्रतिकर (Cr)' : 'Compensation'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'SLA स्थिति' : 'SLA Status'}</th>
                  <th className="py-2.5 px-3 text-right">{isHindi ? 'कार्रवाई' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#0B2540]">
                      <div>{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div>{p.type}</div>
                      <div className="text-[10.5px] text-slate-500">{p.ministry}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div>{p.district}, {p.state}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        {p.stage}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {p.landNotifiedHa} / {p.landProposedHa} Ha
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">₹{p.compensationDisbursedCr} Cr</div>
                      <div className="text-[10px] text-slate-400">of ₹{p.compensationAssessedCr} Cr</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.slaDaysRemaining > 15
                          ? 'bg-emerald-100 text-emerald-800'
                          : p.slaDaysRemaining > 0
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {p.slaDaysRemaining > 0 ? `${p.slaDaysRemaining} days left` : `${Math.abs(p.slaDaysRemaining)} days overdue`}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedProject(p)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-emerald-50 hover:text-[#0C5A37] text-slate-700 font-bold transition-colors"
                      >
                        {isHindi ? 'विवरण' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-right">
            <span className="text-[11px] text-slate-500 font-mono">
              * {DEMO_DATA_DISCLAIMER}
            </span>
          </div>
        </div>

      </main>

      {/* Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#0C5A37] uppercase tracking-wider">{selectedProject.type}</span>
                <h3 className="text-lg font-bold text-[#0B2540]">{selectedProject.name}</h3>
                <span className="text-xs font-mono text-slate-400">{selectedProject.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-0.5">
                <div className="text-slate-500 font-semibold">{isHindi ? 'स्थान' : 'Location'}</div>
                <div className="font-bold text-slate-800">{selectedProject.district}, {selectedProject.state}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg space-y-0.5">
                <div className="text-slate-500 font-semibold">{isHindi ? 'नोडल मंत्रालय' : 'Nodal Ministry'}</div>
                <div className="font-bold text-slate-800">{selectedProject.ministry}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg space-y-0.5">
                <div className="text-slate-500 font-semibold">{isHindi ? 'भूमि क्षेत्रफल' : 'Land Area'}</div>
                <div className="font-bold text-slate-800">{selectedProject.landNotifiedHa} Ha Notified / {selectedProject.landProposedHa} Ha</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg space-y-0.5">
                <div className="text-slate-500 font-semibold">{isHindi ? 'प्रतिकर संवितरण' : 'Compensation'}</div>
                <div className="font-bold text-slate-800">₹{selectedProject.compensationDisbursedCr} Cr / ₹{selectedProject.compensationAssessedCr} Cr</div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-xs space-y-1">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <span>⚠️ {isHindi ? 'जोखिम एवं सिफारिश' : 'Risk Factor & Recommended Action'}</span>
              </div>
              <p className="text-amber-900 leading-relaxed">{selectedProject.recommendedAction}</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
              <Link
                href="/gis"
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors"
              >
                {isHindi ? 'जीआईएस पर भूखंड देखें →' : 'Inspect on GIS →'}
              </Link>
            </div>
          </div>
        </div>
      )}

      <InstitutionalFooter />
    </div>
  );
}
