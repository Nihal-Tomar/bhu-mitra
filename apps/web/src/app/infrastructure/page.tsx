'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { ACQUISITION_PROJECTS, DEMO_DATA_DISCLAIMER } from '../../data/homepageData';

const SECTOR_METADATA = [
  {
    id: 'highways',
    key: 'Highways',
    titleEn: 'Highways & Expressways',
    titleHi: 'राजमार्ग एवं एक्सप्रेसवे',
    icon: '🛣️',
    color: '#155EEF',
    bg: '#EFF6FF',
    projectsCount: 540,
    landHa: '24,600 Ha',
    compensationCr: '₹8,420 Cr',
    possessionPct: 64,
    descriptionEn: 'Bharatmala Pariyojana, economic corridor expansion, ring bypasses, and access-controlled greenfield expressways.',
    descriptionHi: 'भारतमाला परियोजना, आर्थिक गलियारा चौड़ीकरण, रिंग बाईपास एवं नियंत्रित-पहुंच ग्रीनफील्ड एक्सप्रेसवे।',
    nodalMinistryEn: 'Ministry of Road Transport and Highways (MoRTH) / NHAI',
    nodalMinistryHi: 'सड़क परिवहन एवं राजमार्ग मंत्रालय (MoRTH) / NHAI',
  },
  {
    id: 'railways',
    key: 'Railways',
    titleEn: 'Railways & Freight Corridors',
    titleHi: 'रेलवे एवं फ्रेट कॉरिडोर',
    icon: '🚆',
    color: '#0D6606',
    bg: '#EDFDF0',
    projectsCount: 312,
    landHa: '12,400 Ha',
    compensationCr: '₹3,950 Cr',
    possessionPct: 71,
    descriptionEn: 'Dedicated Freight Corridors (Eastern & Western DFC), Mumbai-Ahmedabad High Speed Rail, and multi-tracking bottleneck elimination.',
    descriptionHi: 'डेडिकेटेड फ्रेट कॉरिडोर (पूर्वी एवं पश्चिमी डीएफसी), मुंबई-अहमदाबाद बुलेट ट्रेन, तथा दोहरीकरण एवं तीहरीकरण गलियारे।',
    nodalMinistryEn: 'Ministry of Railways / DFCCIL / NHSRCL',
    nodalMinistryHi: 'रेल मंत्रालय / DFCCIL / NHSRCL',
  },
  {
    id: 'renewable',
    key: 'Renewable Energy',
    titleEn: 'Renewable Energy & Power Corridors',
    titleHi: 'नवीकरणीय ऊर्जा एवं पारेषण',
    icon: '⚡',
    color: '#D97706',
    bg: '#FFFBEB',
    projectsCount: 185,
    landHa: '7,800 Ha',
    compensationCr: '₹1,480 Cr',
    possessionPct: 82,
    descriptionEn: 'Ultra Mega Solar Power Parks, offshore wind landing zones, and Green Energy Corridor (GEC) interstate transmission systems.',
    descriptionHi: 'अल्ट्रा मेगा सौर ऊर्जा पार्क, पवन ऊर्जा लैंडिंग क्षेत्र तथा ग्रीन एनर्जी कॉरिडोर अंतर्राज्यीय उच्च-वोल्टेज पारेषण ग्रिड।',
    nodalMinistryEn: 'Ministry of New & Renewable Energy (MNRE) / POWERGRID',
    nodalMinistryHi: 'नवीन और नवीकरणीय ऊर्जा मंत्रालय (MNRE) / पावरग्रिड',
  },
  {
    id: 'urban',
    key: 'Urban Infra',
    titleEn: 'Urban Infrastructure & Metro Corridors',
    titleHi: 'शहरी अवसंरचना एवं मेट्रो नेटवर्क',
    icon: '🏙️',
    color: '#7C3AED',
    bg: '#F5F3FF',
    projectsCount: 142,
    landHa: '2,350 Ha',
    compensationCr: '₹850 Cr',
    possessionPct: 53,
    descriptionEn: 'Metro rail expansions in Tier-1 & Tier-2 cities, regional rapid transit systems (RRTS), multi-modal mobility hubs, and arterial ring roads.',
    descriptionHi: 'टियर-1 एवं टियर-2 शहरों में मेट्रो रेल, क्षेत्रीय रैपिड ट्रांजिट सिस्टम (आरआरटीएस) एवं मल्टी-मॉडल लॉजिस्टिक बस टर्मिनल।',
    nodalMinistryEn: 'Ministry of Housing and Urban Affairs (MoHUA)',
    nodalMinistryHi: 'आवासन और शहरी कार्य मंत्रालय (MoHUA)',
  },
  {
    id: 'industrial',
    key: 'Industrial Corridor',
    titleEn: 'Industrial & Strategic Infrastructure',
    titleHi: 'औद्योगिक एवं रणनीतिक कॉरिडोर',
    icon: '🏭',
    color: '#B42318',
    bg: '#FEF2F2',
    projectsCount: 105,
    landHa: '1,350 Ha',
    compensationCr: '₹150 Cr',
    possessionPct: 46,
    descriptionEn: 'National Industrial Corridors (DMIC, AKIC, BMIC), multi-modal logistics parks, defense production nodes, and port connectivity corridors.',
    descriptionHi: 'राष्ट्रीय औद्योगिक कॉरिडोर (DMIC, AKIC), मल्टी-मॉडल लॉजिस्टिक्स पार्क, रक्षा उत्पादन गलियारे तथा सागरमाला बंदरगाह कनेक्टिविटी।',
    nodalMinistryEn: 'DPIIT, Ministry of Commerce and Industry / MoPSW',
    nodalMinistryHi: 'डीपीआईआईटी, वाणिज्य एवं उद्योग मंत्रालय / पत्तन व पोत मंत्रालय',
  },
];

function InfrastructureContent() {
  const { isHindi } = useLocale();
  const searchParams = useSearchParams();
  const initialSector = searchParams.get('sector')?.toLowerCase() || 'highways';
  const [activeSectorId, setActiveSectorId] = useState<string>(initialSector);

  useEffect(() => {
    const s = searchParams.get('sector')?.toLowerCase();
    if (s && SECTOR_METADATA.some((item) => item.id === s)) {
      setActiveSectorId(s);
    }
  }, [searchParams]);

  const sectorList = SECTOR_METADATA.map((s) => {
    const matching = ACQUISITION_PROJECTS.filter((p) =>
      p.type.toLowerCase().includes(s.key.toLowerCase())
    );
    const count = matching.length;
    const proposed = matching.reduce((sum, p) => sum + p.landProposedHa, 0);
    const acquired = matching.reduce((sum, p) => sum + p.landAcquiredHa, 0);
    const comp = matching.reduce((sum, p) => sum + p.compensationDisbursedCr, 0);
    const possessionPct = proposed > 0 ? Math.round((acquired / proposed) * 100) : s.possessionPct;
    return {
      ...s,
      projectsCount: count > 0 ? count : s.projectsCount,
      landHa: proposed > 0 ? `${Math.round(proposed).toLocaleString()} Ha` : s.landHa,
      compensationCr: comp > 0 ? `₹${Math.round(comp).toLocaleString()} Cr` : s.compensationCr,
      possessionPct,
    };
  });

  const activeSector =
    sectorList.find((s) => s.id === activeSectorId) || sectorList[0];

  const sectorProjects = ACQUISITION_PROJECTS.filter((p) =>
    p.type.toLowerCase().includes(activeSector.key.toLowerCase())
  );

  return (
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
              {isHindi ? 'बुनियादी ढांचा क्षेत्र आसूचना' : 'Infrastructure Intelligence'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
            {isHindi ? 'राष्ट्रीय बुनियादी ढांचा क्षेत्र अधिग्रहण' : 'National Infrastructure Sector Intelligence'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {isHindi
              ? 'राष्ट्रीय प्राथमिकताओं के अनुरूप गलियारा संरेखण, भूखंड एवं वैधानिक स्थिति का व्यापक पर्यवेक्षण'
              : 'Corridor alignment, notified cadastral parcels, and statutory progress across national infrastructure sectors.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/gis"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0C5A37] hover:bg-[#084228] text-white text-xs font-bold shadow-xs transition-colors"
          >
            <span>{isHindi ? 'जीआईएस मैप पर देखें' : 'View Alignment on GIS'}</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* 5 Sector Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {sectorList.map((s) => {
          const isSelected = s.id === activeSectorId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSectorId(s.id)}
              className={`text-left p-4 rounded-xl border transition-all relative ${
                isSelected
                  ? 'border-[#0C5A37] bg-white shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{s.icon}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {s.projectsCount} {isHindi ? 'परियोजनाएं' : 'Projects'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#0B2540] line-clamp-1">
                {isHindi ? s.titleHi : s.titleEn}
              </h3>
              <div className="text-xs text-slate-500 mt-1 font-semibold">
                {s.landHa}
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{isHindi ? 'कब्जा' : 'Possession'}</span>
                <span className="font-bold text-[#138808]">{s.possessionPct}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Sector Intelligence Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Banner */}
        <div className="p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-white/10 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <span>{activeSector.icon}</span>
              <span>{isHindi ? activeSector.titleHi : activeSector.titleEn}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {isHindi ? `${activeSector.titleHi} अधिग्रहण कमान` : `${activeSector.titleEn} Acquisition Command`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isHindi ? activeSector.descriptionHi : activeSector.descriptionEn}
            </p>
            <div className="text-xs text-slate-400 pt-1 font-medium">
              <span className="text-slate-500">{isHindi ? 'नोडल मंत्रालय:' : 'Nodal Authority:'}</span>{' '}
              {isHindi ? activeSector.nodalMinistryHi : activeSector.nodalMinistryEn}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 bg-white/5 p-4 rounded-xl border border-white/10 text-center text-xs">
            <div>
              <div className="text-slate-400 text-[10.5px] uppercase font-bold">{isHindi ? 'कुल परियोजनाएं' : 'Projects'}</div>
              <div className="text-lg font-black text-white mt-0.5">{activeSector.projectsCount}</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10.5px] uppercase font-bold">{isHindi ? 'अधिगृहीत भूमि' : 'Land Area'}</div>
              <div className="text-lg font-black text-emerald-400 mt-0.5">{activeSector.landHa}</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="text-slate-400 text-[10.5px] uppercase font-bold">{isHindi ? 'प्रतिकर' : 'Compensation'}</div>
              <div className="text-lg font-black text-amber-400 mt-0.5">{activeSector.compensationCr}</div>
            </div>
          </div>
        </div>

        {/* Sector Projects Table */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#0B2540] uppercase tracking-wider">
              {isHindi ? 'सक्रिय गलियारे एवं परियोजनाएं' : 'Monitored Corridors & Priority Projects'}
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {sectorProjects.length} {isHindi ? 'परियोजनाएं प्रदर्शित' : 'active projects found'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-y border-slate-200 text-[10.5px]">
                <tr>
                  <th className="py-2.5 px-3">{isHindi ? 'परियोजना / कोड' : 'Project / Code'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'राज्य / जिला' : 'State / District'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'वर्तमान चरण' : 'Statutory Stage'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'अधिसूचित क्षेत्र' : 'Notified Area'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'संवितरित राशि' : 'Compensation'}</th>
                  <th className="py-2.5 px-3">{isHindi ? 'जोखिम रेटिंग' : 'Risk Rating'}</th>
                  <th className="py-2.5 px-3 text-right">{isHindi ? 'जीआईएस मैप' : 'GIS Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {sectorProjects.length > 0 ? (
                  sectorProjects.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#0B2540]">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{p.id}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div>{p.district}, {p.state}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          {p.stage}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {p.landNotifiedHa} Ha
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900">₹{p.compensationDisbursedCr} Cr</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.riskLevel === 'Low'
                              ? 'bg-emerald-100 text-emerald-800'
                              : p.riskLevel === 'Medium'
                              ? 'bg-blue-100 text-blue-800'
                              : p.riskLevel === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {p.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <Link
                          href="/gis"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0C5A37] text-white hover:bg-[#084228] text-[11px] font-bold transition-colors"
                        >
                          <span>{isHindi ? 'भूखंड' : 'View Parcels'}</span>
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-500 text-xs">
                      {isHindi ? 'इस क्षेत्र में कोई परियोजना नहीं मिली' : 'No active projects found under this sector filter.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-right">
            <span className="text-[11px] text-slate-500 font-mono">
              * {DEMO_DATA_DISCLAIMER}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function InfrastructurePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />
      <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading infrastructure data...</div>}>
        <InfrastructureContent />
      </Suspense>
      <InstitutionalFooter />
    </div>
  );
}
