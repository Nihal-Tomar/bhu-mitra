'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

export const InstitutionalFooter: React.FC = () => {
  const { isHindi } = useLocale();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1F33] text-white border-t border-slate-800 relative z-10">
      {/* Upper Main Footer Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1: Platform Brand & Ministry Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg text-amber-400 border border-white/20">
                भू
              </div>
              <div>
                <div className="text-xl font-extrabold tracking-tight">
                  <span className="text-white">Bhu-</span>
                  <span className="text-[#138808]">Mitra</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {isHindi
                    ? 'राष्ट्रीय भूमि अधिग्रहण निगरानी, आसूचना एवं निर्णय-समर्थन मंच'
                    : 'National Land Acquisition Monitoring & Decision-Support Platform'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {isHindi
                ? 'भूमि संसाधन विभाग (DoLR), ग्रामीण विकास मंत्रालय, भारत सरकार हेतु विकसित एकीकृत राष्ट्रीय सार्वजनिक डिजिटल अवसंरचना।'
                : 'Unified national digital public infrastructure engineered for the Department of Land Resources (DoLR), Ministry of Rural Development, Government of India, implementing the RFCTLARR Act 2013 statutory lifecycle.'}
            </p>

            <div className="text-[11px] text-slate-400 space-y-1">
              <div>
                <span className="text-slate-500 font-semibold">{isHindi ? 'वैधानिक ढांचा:' : 'Statutory Framework:'}</span> RFCTLARR Act 2013 &amp; DILRMP Guidelines
              </div>
              <div>
                <span className="text-slate-500 font-semibold">{isHindi ? 'नोडल प्राधिकारी:' : 'Nodal Authority:'}</span> {isHindi ? 'भूमि संसाधन विभाग · ग्रामीण विकास मंत्रालय' : 'Department of Land Resources · MoRD'}
              </div>
              <div>
                <span className="text-slate-500 font-semibold">{isHindi ? 'प्लेटफ़ॉर्म स्थिति:' : 'Platform Status:'}</span> {isHindi ? 'राष्ट्रीय परिचालन विनिर्देश' : 'National Command Operational Specification'}
              </div>
            </div>
          </div>

          {/* Col 2: Acquisition Platform Modules */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3.5">
              {isHindi ? 'अधिग्रहण मॉड्यूल' : 'Acquisition Modules'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/command" className="hover:text-emerald-400 transition-colors">{isHindi ? 'राष्ट्रीय कमान केंद्र' : 'National Command Center'}</Link></li>
              <li><Link href="/infrastructure" className="hover:text-emerald-400 transition-colors">{isHindi ? 'बुनियादी ढांचा क्षेत्र' : 'Infrastructure Sectors'}</Link></li>
              <li><Link href="/projects" className="hover:text-emerald-400 transition-colors">{isHindi ? 'परियोजना निर्देशिका' : 'Acquisition Projects'}</Link></li>
              <li><Link href="/gis" className="hover:text-emerald-400 transition-colors">{isHindi ? 'कैडस्ट्रल जीआईएस मैप' : 'Cadastral GIS Intelligence'}</Link></li>
              <li><Link href="/lifecycle" className="hover:text-emerald-400 transition-colors">{isHindi ? '9-चरणीय वैधानिक जीवनचक्र' : '9-Stage RFCTLARR Lifecycle'}</Link></li>
              <li><Link href="/risk" className="hover:text-emerald-400 transition-colors">{isHindi ? 'जोखिम एवं विलंब आसूचना' : 'Risk & Delay AI Early Warning'}</Link></li>
            </ul>
          </div>

          {/* Col 3: Statutory Safeguards & Compensation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3.5">
              {isHindi ? 'वैधानिक सुरक्षा एवं प्रतिकर' : 'Statutory & Compensation'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/compensation" className="hover:text-emerald-400 transition-colors">{isHindi ? 'सर्किल रेट एवं 100% तोषाण' : 'Circle Rate & 100% Solatium'}</Link></li>
              <li><Link href="/rr" className="hover:text-emerald-400 transition-colors">{isHindi ? 'पुनर्वासन एवं पुनर्व्यवस्थापन' : 'R&R Resettlement Colony Standards'}</Link></li>
              <li><Link href="/documents" className="hover:text-emerald-400 transition-colors">{isHindi ? 'राजपत्र धारा 11/19 सूचनाएं' : 'Gazette Notifications & Awards'}</Link></li>
              <li><Link href="/documents" className="hover:text-emerald-400 transition-colors">{isHindi ? 'SHA-256 अखंडता सत्यापन' : 'SHA-256 Tamper-Evident Records'}</Link></li>
              <li><Link href="/citizen" className="hover:text-emerald-400 transition-colors">{isHindi ? 'भूस्वामी अधिकार एवं परामर्श' : 'Social Impact Assessment (SIA)'}</Link></li>
            </ul>
          </div>

          {/* Col 4: Public Transparency & Login */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3.5">
              {isHindi ? 'नागरिक सेवा एवं लॉगिन' : 'Citizen & Authority Portals'}
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link href="/citizen" className="hover:text-emerald-400 transition-colors">{isHindi ? 'नागरिक पारदर्शिता पोर्टल' : 'Citizen Transparency Portal'}</Link></li>
              <li><Link href="/citizen" className="hover:text-emerald-400 transition-colors">{isHindi ? 'जन आपत्ति एवं सुनवाई प्रक्रिया' : 'Section 15 Hearing Guide'}</Link></li>
              <li><Link href="/citizen" className="hover:text-emerald-400 transition-colors">{isHindi ? 'सीएससी नागरिक सहायता केंद्र' : 'Common Service Centre (CSC) Help'}</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 text-emerald-400 font-bold transition-colors">{isHindi ? 'अधिकारी लॉगिन (CALA / MoRD) →' : 'Nodal Officer Login →'}</Link></li>
              <li><Link href="/design-system" className="hover:text-amber-300 text-slate-400 text-[11px] transition-colors">{isHindi ? 'डिज़ाइन सिस्टम विनिर्देश →' : 'Design System Spec →'}</Link></li>
            </ul>
          </div>

        </div>

        {/* Platform Information Banner */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 bg-slate-900/40 rounded-xl p-4 text-[11px] text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
              {isHindi ? 'राष्ट्रीय कमान' : 'NATIONAL COMMAND'}
            </span>
            <span>
              {isHindi
                ? 'राष्ट्रीय भूमि अधिग्रहण आसूचना मंच — सभी प्रदर्शित गलियारे, सूचनाएं एवं प्रतिकर सांकेतिक टेलीमेट्री मॉडल हैं।'
                : 'National Land Acquisition Intelligence Platform — All project corridors, gazette notices, and compensation telemetry represent model telemetry data.'}
            </span>
          </div>
          <div className="text-[10px] text-slate-500 shrink-0 font-mono">
            BUILD v2.5-PRODUCTION
          </div>
        </div>
      </div>

      {/* Skyline & National Motto Strip */}
      <div className="border-t border-slate-800 bg-[#061626] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-200">
              पारदर्शी भूमि अधिग्रहण &nbsp;•&nbsp; न्यायसंगत मुआवजा &nbsp;•&nbsp; विकसित भारत
            </span>
            <div className="text-[9.5px] text-slate-500 tracking-[0.2em] uppercase font-mono mt-0.5">
              TRANSPARENT ACQUISITION &nbsp;•&nbsp; JUST COMPENSATION &nbsp;•&nbsp; VIKSIT BHARAT
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <div className="text-right leading-tight">
              <div className="text-[10px] font-bold tracking-wider text-slate-300 uppercase">{isHindi ? 'राष्ट्रीय अवसंरचना स्टैक' : 'National Infrastructure Stack'}</div>
              <div className="text-[9px] text-emerald-400 tracking-wider uppercase font-semibold">DoLR · {isHindi ? 'ग्रामीण विकास मंत्रालय' : 'Ministry of Rural Development'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-slate-300 shadow-xl flex items-center justify-center transition-all hover:scale-110"
        title="Scroll to Top"
        aria-label="Scroll to top"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};
