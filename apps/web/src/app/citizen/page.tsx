'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { LandRecordsPreview } from '../../components/home/LandRecordsPreview';
import { SchemesSection } from '../../components/home/SchemesSection';

export default function CitizenPage() {
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
              {isHindi ? 'नागरिक पारदर्शिता एवं भूस्वामी अधिकार' : 'Citizen Transparency & Landowner Rights'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#0C5A37] font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#138808]" />
              <span>{isHindi ? 'सीएससी नागरिक सहायता एवं आपत्ति प्रणाली सक्रिय' : 'Common Service Centre (CSC) Help Active'}</span>
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 space-y-8 pb-12">
        {/* Interactive Survey Tracking & Upstream RoR Inspector */}
        <LandRecordsPreview />

        {/* Statutory Safeguards & Citizen Rights under RFCTLARR 2013 */}
        <SchemesSection />
      </main>

      <InstitutionalFooter />
    </div>
  );
}
