'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

export const CommandPreviewSection: React.FC = () => {
  const { isHindi, t } = useLocale();

  const previewMetrics = [
    { labelEn: 'Projects Monitored', labelHi: 'निगरानीधीन परियोजनाएं', val: '1,284', subEn: 'Across 28 States & 8 UTs', subHi: '28 राज्यों एवं 8 केंद्रशासित प्रदेशों में', color: '#0B2540' },
    { labelEn: 'Land Notified', labelHi: 'अधिसूचित भूमि', val: '48,500 Ha', subEn: 'Section 11 Gazette', subHi: 'धारा 11 राजपत्र', color: '#0C5A37' },
    { labelEn: 'Land Acquired', labelHi: 'कब्जा प्राप्त भूमि', val: '28,140 Ha', subEn: '58.0% Handed Over', subHi: '58.0% हस्तांतरित', color: '#138808' },
    { labelEn: 'Compensation Paid', labelHi: 'संवितरित प्रतिकर', val: '₹14,850 Cr', subEn: 'Direct PFMS DBT', subHi: 'प्रत्यक्ष PFMS बैंक अंतरण', color: '#0B2540' },
    { labelEn: 'Families Protected', labelHi: 'संरक्षित परिवार', val: '84,200', subEn: 'Mandatory R&R colony', subHi: 'अनिवार्य पुनर्वास कॉलोनी', color: '#0C5A37' },
    { labelEn: 'SLA Adherence', labelHi: 'SLA अनुपालन दर', val: '91.4%', subEn: 'Statutory milestone SLA', subHi: 'वैधानिक समयसीमा अनुपालन', color: '#138808' },
  ];

  const recentAlerts = [
    { titleEn: 'NH-48 Six Laning: Section 19 SLA Critical', titleHi: 'एनएच-48: धारा 19 वैधानिक एसएलए गंभीर', category: 'Statutory SLA', severity: 'Critical', days: '+22 days slippage' },
    { titleEn: 'Western DFC: Beneficiary Bank Validation Hold', titleHi: 'पश्चिमी डीएफसी: लाभार्थी बैंक सत्यापन लंबित', category: 'Compensation DBT', severity: 'High', days: '12 accounts pending' },
    { titleEn: 'Pune-Nashik Rail: Section 15 Hearing Scheduled', titleHi: 'पुणे-नाशिक रेल: धारा 15 आपत्ति सुनवाई निर्धारित', category: 'Objection Hearing', severity: 'Normal', days: 'Scheduled today' },
  ];

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header with Title & CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#138808] animate-pulse" />
              <span>{isHindi ? 'राष्ट्रीय कमान पूर्वावलोकन' : 'National Command Preview'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {t('home.commandTitle', "One Command View for India's Land Acquisition")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('home.commandSubtitle', 'Live monitoring and decision-support layer connecting Central Ministries, CALA Collectors, and Field Authorities.')}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/command"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#0C5A37] hover:bg-[#084228] text-white text-xs sm:text-sm font-bold px-5 py-2.5 sm:py-3 rounded-xl shadow-xs hover:shadow-md transition-all group"
            >
              <span>{t('home.openCommand', 'Open National Command →')}</span>
              <span className="text-xs text-emerald-200 font-normal">↗</span>
            </Link>
          </div>
        </div>

        {/* Compact Command Preview Dashboard Card */}
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 lg:p-7 space-y-6">
          
          {/* Upper Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {previewMetrics.map((m) => (
              <div key={m.labelEn} className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {isHindi ? m.labelHi : m.labelEn}
                </div>
                <div className="text-xl sm:text-2xl font-black text-[#0B2540]" style={{ color: m.color }}>
                  {m.val}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {isHindi ? m.subHi : m.subEn}
                </div>
              </div>
            ))}
          </div>

          {/* Lower Row: Mini Alerts & State Progress Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
            
            {/* 3 Active Alerts Preview (6 cols) */}
            <div className="lg:col-span-6 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>{isHindi ? 'सक्रिय प्राथमिकता अलर्ट' : 'Active Acquisition Alerts'}</span>
                </span>
                <Link href="/risk" target="_blank" rel="noopener noreferrer" className="text-[#0C5A37] font-semibold hover:underline">
                  {isHindi ? 'विस्तार से देखें ↗' : 'Risk Intel ↗'}
                </Link>
              </div>

              <div className="space-y-2">
                {recentAlerts.map((a) => (
                  <div key={a.titleEn} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-[#0B2540] line-clamp-1">{isHindi ? a.titleHi : a.titleEn}</div>
                      <div className="text-[10.5px] text-slate-500 font-medium">{a.category} • {a.days}</div>
                    </div>
                    <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                      a.severity === 'Critical' ? 'bg-red-100 text-red-800' : a.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {a.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick State Pipeline Comparison (6 cols) */}
            <div className="lg:col-span-6 bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>{isHindi ? 'शीर्ष राज्य अधिग्रहण SLA दर' : 'Top State Acquisition SLA Adherence'}</span>
                <span className="text-[11px] text-slate-400 font-mono">Top Clusters</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { name: isHindi ? 'गुजरात' : 'Gujarat', projects: 148, pct: 94, color: '#138808' },
                  { name: isHindi ? 'महाराष्ट्र' : 'Maharashtra', projects: 195, pct: 91, color: '#155EEF' },
                  { name: isHindi ? 'मध्य प्रदेश' : 'Madhya Pradesh', projects: 98, pct: 96, color: '#138808' },
                ].map((st) => (
                  <div key={st.name} className="space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-700 text-[11.5px]">
                      <span>{st.name} ({st.projects} {isHindi ? 'परियोजनाएं' : 'projects'})</span>
                      <span className="text-[#138808]">{st.pct}% SLA</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${st.pct}%`, backgroundColor: st.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-right">
                <Link
                  href="/command"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#0C5A37] font-bold hover:underline"
                >
                  {isHindi ? 'सम्पूर्ण 28 राज्यों का डेटा कमान केंद्र में देखें →' : 'Explore full 28-State data in Command Center →'}
                </Link>
              </div>
            </div>

          </div>

          <div className="text-[10.5px] text-slate-500 text-right font-mono">
            * {isHindi ? 'राष्ट्रीय अधिग्रहण मॉडल · सांकेतिक टेलीमेट्री डेटा' : 'National Acquisition Model · Illustrative Telemetry'}
          </div>

        </div>

      </div>
    </section>
  );
};
