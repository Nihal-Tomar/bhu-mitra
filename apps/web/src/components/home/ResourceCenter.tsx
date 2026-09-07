'use client';

import React, { useState } from 'react';
import { FAQ_LIST } from '../../data/homepageData';

export const ResourceCenter: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const downloads = [
    { title: 'Form A — Acquisition Proposal Indent Format', size: '280 KB PDF', code: 'RFCTLARR-FORM-A' },
    { title: 'Section 15 Written Objection Filing Template', size: '190 KB PDF', code: 'RFCTLARR-SEC15' },
    { title: 'Form C — R&R Scheme Entitlement Claim Format', size: '340 KB PDF', code: 'RFCTLARR-FORM-C' },
    { title: 'Statutory Valuation & Solatium Calculation Guide', size: '1.2 MB PDF', code: 'DOLR-AWD-GUIDE' },
  ];

  const handleDownload = (code: string) => {
    setDownloadSuccess(code);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <section id="help" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
            Citizen Assistance &amp; Statutory Guidance
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
            Land Acquisition Transparency &amp; Help Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Review frequently asked questions regarding statutory acquisition under the RFCTLARR Act 2013, download standard notice forms, and access citizen guidance manuals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Left Column: Interactive FAQ Accordion (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-sm font-extrabold text-[#0B1F33] mb-3 flex items-center justify-between">
              <span>Frequently Asked Statutory Questions</span>
              <span className="text-[11px] font-semibold text-emerald-800">● RFCTLARR Act 2013</span>
            </h3>

            {FAQ_LIST.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs sm:text-[13px] font-extrabold text-slate-900 focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="flex-1 leading-snug">{faq.question}</span>
                    <span className="text-slate-400 font-bold text-base shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Downloadable Statutory Forms & Support (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Downloadable Forms Box */}
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
                <span>Standard Acquisition Forms</span>
                <span className="text-[10px] text-emerald-700 font-semibold">● Free PDF Download</span>
              </h3>

              <div className="space-y-2">
                {downloads.map((item, i) => (
                  <div
                    key={i}
                    onClick={() => handleDownload(item.code)}
                    className="p-3 bg-white border border-slate-200/90 rounded-xl flex items-center justify-between gap-3 hover:border-[#138808] transition-colors group cursor-pointer shadow-2xs"
                  >
                    <div>
                      <span className="text-[9px] font-mono font-bold text-emerald-800 block">
                        {item.code}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#0C5A37] transition-colors leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">{item.size}</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#0C5A37] group-hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition-colors">
                      {downloadSuccess === item.code ? (
                        <span className="text-xs font-bold text-emerald-600 group-hover:text-white">✓</span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpline / CSC Kiosk Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-xs font-bold text-emerald-950">
                  Citizen Assistance &amp; CSC Kiosk Network
                </span>
              </div>
              <p className="text-[11.5px] text-emerald-900 leading-relaxed">
                Affected landowners can visit any nearest Common Service Centre (CSC) for free biometric assistance, hearing status printouts, and digital objection filing.
              </p>
              <div className="text-[11px] font-bold text-emerald-800 pt-1">
                Toll-Free Support (DoLR): 1800-11-DOLR (09:00 - 18:00 IST)
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
