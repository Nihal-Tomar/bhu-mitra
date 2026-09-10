'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

export const AcquisitionJourneySection: React.FC = () => {
  const { isHindi, t } = useLocale();

  const journeySteps = [
    { step: '01', titleEn: 'Online Proposal', titleHi: 'ऑनलाइन प्रस्ताव', code: 'PRP-01' },
    { step: '02', titleEn: 'Scrutiny & SIA', titleHi: 'संवीक्षा एवं SIA', code: 'SIA-02' },
    { step: '03', titleEn: 'Sec 11 Notification', titleHi: 'धारा 11 अधिसूचना', code: 'NOT-03' },
    { step: '04', titleEn: 'Sec 15 Hearing', titleHi: 'धारा 15 सुनवाई', code: 'OBJ-04' },
    { step: '05', titleEn: 'Sec 19 Declaration', titleHi: 'धारा 19 घोषणा', code: 'DEC-05' },
    { step: '06', titleEn: 'Sec 23 Award & DBT', titleHi: 'धारा 23 अधिनिर्णय', code: 'AWD-06' },
    { step: '07', titleEn: 'R&R Execution', titleHi: 'पुनर्वासन एवं कॉलोनी', code: 'R&R-07' },
    { step: '08', titleEn: 'Sec 38 Possession', titleHi: 'धारा 38 भौतिक कब्जा', code: 'POS-08' },
    { step: '09', titleEn: 'Revenue Mutation', titleHi: 'राजस्व नामान्तरण', code: 'MUT-09' },
  ];

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
              <span>{isHindi ? 'वैधानिक जीवनचक्र' : 'Statutory Lifecycle'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {t('home.lifecycleTitle', 'The Acquisition Journey')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('home.lifecycleSubtitle', 'Every project moves through a traceable, tamper-evident 9-stage statutory lifecycle under RFCTLARR Act 2013.')}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/lifecycle?project=DOLR-2026-0084"
              className="inline-flex items-center gap-2 bg-[#0B2540] hover:bg-[#071726] text-white text-xs sm:text-sm font-bold px-5 py-2.5 sm:py-3 rounded-xl shadow-xs hover:shadow-md transition-all group"
            >
              <span>{t('home.trackProject', 'Track a Project →')}</span>
              <span className="text-xs text-slate-300">→</span>
            </Link>
          </div>
        </div>

        {/* 9 Steps Visual Progression Bar */}
        <div className="bg-[#F8FAFC] rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5 sm:gap-3">
            {journeySteps.map((s, idx) => (
              <div
                key={s.step}
                className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-center flex flex-col items-center justify-between space-y-2 relative"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-[#0C5A37] border border-emerald-200 font-mono font-bold text-[10px] flex items-center justify-center">
                    {s.step}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 font-bold">{s.code}</span>
                </div>

                <div className="text-xs font-bold text-[#0B2540] leading-snug">
                  {isHindi ? s.titleHi : s.titleEn}
                </div>

                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#138808]"
                    style={{ width: `${Math.min(100, (idx + 1) * 12)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="text-slate-600 font-medium">
              <span className="font-bold text-[#0C5A37]">{isHindi ? 'वैधानिक एसएलए बाध्यता:' : 'Statutory SLA Mandate:'}</span>{' '}
              {isHindi
                ? 'धारा 11(1) से धारा 19(1) घोषणा हेतु 12 माह (धारा 19(7)) एवं धारा 19 से धारा 23/25 अधिनिर्णय हेतु 12 माह (धारा 25) की वैधानिक सीमा निर्धारित है। धारा 38 कब्जा पूर्ण प्रतिकर उपरांत ही अनुमत है।'
                : 'Section 19 declaration must be published within 12 months of Section 11(1) notice (Sec. 19(7)); Section 23 award within 12 months of Section 19 publication (Sec. 25). Encumbrance-free possession under Section 38 follows full compensation & R&R disbursal.'}
            </div>
            <Link
              href="/lifecycle?project=DOLR-2026-0084"
              className="text-[#0C5A37] font-bold hover:underline shrink-0"
            >
              {isHindi ? 'सम्पूर्ण 9-चरणीय विवरण देखें →' : 'Inspect Detailed 9-Stage Dossier →'}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};
