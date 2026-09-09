'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { SustainabilitySection } from '../../components/home/SustainabilitySection';

export default function RiskPage() {
  const { isHindi } = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      {/* Top Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition-colors">
              {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
            </Link>
            <span>/</span>
            <span className="text-[#0C5A37] font-bold">
              {isHindi ? 'जोखिम एवं विलंब आसूचना' : 'Risk & Delay Intelligence'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-bold border border-red-200">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{isHindi ? 'पूर्वानुमानिक प्रारंभिक चेतावनी प्रणाली' : 'Predictive Early Warning System Active'}</span>
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <SustainabilitySection />
      </main>

      <InstitutionalFooter />
    </div>
  );
}
