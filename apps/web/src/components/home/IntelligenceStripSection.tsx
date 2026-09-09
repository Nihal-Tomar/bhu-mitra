'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

export const IntelligenceStripSection: React.FC = () => {
  const { isHindi, t } = useLocale();

  return (
    <section className="py-14 sm:py-16 bg-[#F8FAFC]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
            <span>{isHindi ? 'राष्ट्रीय आसूचना' : 'Operational Intelligence'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
            {t('home.intelTitle', 'National Acquisition Intelligence Capabilities')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('home.intelSubtitle', 'Comprehensive operational intelligence engineered for rapid decisions and legal defensibility.')}
          </p>
        </div>

        {/* 3 High-Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 1. GIS Intelligence */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-[#0C5A37] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-black text-lg">
                🗺️
              </div>
              <h3 className="text-base font-extrabold text-[#0B2540]">
                {t('home.gisTitle', 'Cadastral GIS Intelligence')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'सटीक रूप से जानें कि प्रस्तावित गलियारे (RoW) के बफर क्षेत्र में कौन से भूखंड, खसरा और खातेदार प्रभावित हैं।'
                  : 'Know exactly which parcels, khasras, and landowners fall within the alignment corridor buffer.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/gis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0C5A37] hover:underline flex items-center gap-1"
              >
                <span>{isHindi ? 'जीआईएस मैप खोलें' : 'Open Acquisition GIS'}</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

          {/* 2. Risk & Delay Early Warning */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-[#0C5A37] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center font-black text-lg">
                ⚠️
              </div>
              <h3 className="text-base font-extrabold text-[#0B2540]">
                {t('home.riskTitle', 'Risk & Delay Early Warning')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'जानें कि कौन सी परियोजनाएं वैधानिक समय-सीमा (SLA) चूकने की संभावना रखती हैं, ताकि समय रहते सुधारात्मक कदम उठाए जा सकें।'
                  : 'Know which projects are likely to miss statutory milestones, forest clearances, or objection hearing limits.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/risk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0C5A37] hover:underline flex items-center gap-1"
              >
                <span>{isHindi ? 'जोखिम आसूचना देखें' : 'View Risk Intelligence'}</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

          {/* 3. Compensation & R&R */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md hover:border-[#0C5A37] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0C5A37] flex items-center justify-center font-black text-lg">
                💰
              </div>
              <h3 className="text-base font-extrabold text-[#0B2540]">
                {t('home.compTitle', 'Compensation & R&R Traceability')}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isHindi
                  ? 'जानें कि क्या मूल्यांकन किया गया, क्या अधिनिर्णय दिया गया और पीएफएमएस बैंक खाते में क्या संवितरित हुआ।'
                  : 'Know what was assessed, awarded, and directly disbursed to beneficiary accounts under Section 26 to 30.'}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <Link
                href="/compensation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#0C5A37] hover:underline flex items-center gap-1"
              >
                <span>{isHindi ? 'प्रतिकर एवं R&R बहीखाता' : 'Compensation & R&R Ledger'}</span>
                <span>↗</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Central National Command Call to Action */}
        <div className="pt-4 text-center">
          <Link
            href="/command"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#0C5A37] hover:bg-[#084228] text-white text-sm font-bold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('home.openCommand', 'Open National Command →')}</span>
            <span className="text-xs text-emerald-200 font-normal">↗</span>
          </Link>
        </div>

      </div>
    </section>
  );
};
