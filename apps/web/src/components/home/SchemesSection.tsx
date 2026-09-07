'use client';

import React, { useState } from 'react';

interface SafeguardItem {
  id: string;
  sectionCode: string;
  title: string;
  tagline: string;
  description: string;
  provisions: string[];
  statutoryCategory: string;
}

const STATUTORY_SAFEGUARDS: SafeguardItem[] = [
  {
    id: 'sg-sia',
    sectionCode: 'Section 4 - 8',
    title: 'Social Impact Assessment (SIA)',
    tagline: 'Mandatory public consultation & livelihood impact study before acquisition',
    description: 'Statutory requirement to evaluate whether the proposed project serves public purpose, estimate the exact number of affected and displaced families, and assess impact on agricultural multi-crop lands.',
    provisions: [
      'Mandatory public hearing in every affected Gram Sabha',
      'Evaluation of livelihood losses for landless laborers & artisans',
      'Independent Multi-Disciplinary Expert Group appraisal',
    ],
    statutoryCategory: 'Pre-Notification Safeguard',
  },
  {
    id: 'sg-solatium',
    sectionCode: 'Section 26 - 30',
    title: 'Fair Market Value & 100% Solatium',
    tagline: 'Up to 4x rural multiplier + 100% statutory bonus on total valuation',
    description: 'Guarantees that landowners receive fair market value (highest of circle rate or average sale deeds), scaled by a 1.25x to 2.0x rural multiplier factor, standing asset valuation, plus a mandatory 100% Solatium.',
    provisions: [
      '100% Solatium bonus over and above the assessed market value',
      '12% annual interest from Section 11 notice to final award date',
      'Transparent valuation worksheet accessible on Bhu-Mitra',
    ],
    statutoryCategory: 'Financial Compensation',
  },
  {
    id: 'sg-rr',
    sectionCode: 'Section 31 - 42',
    title: 'Rehabilitation & Resettlement (R&R)',
    tagline: 'Mandatory housing allotment, subsistence grants & livelihood security',
    description: 'Every displaced family is entitled to alternative pucca housing in a planned resettlement colony equipped with roads, potable water, sanitation, schools, and community centers under the Second Schedule.',
    provisions: [
      'Minimum 50 sq. m. constructed house or plot allotment in rural areas',
      'One-time subsistence grant of ₹3,000/month for 12 months',
      'Mandatory job offer or one-time annuity grant of ₹5 Lakhs per family',
    ],
    statutoryCategory: 'Rehabilitation Entitlement',
  },
  {
    id: 'sg-agri',
    sectionCode: 'Section 10',
    title: 'Food Security & Multi-Crop Protection',
    tagline: 'Statutory cap on acquiring irrigated agricultural multi-crop land',
    description: 'Protects national food security by prohibiting acquisition of multi-crop irrigated land except under exceptional circumstances for linear infrastructure (railways, highways), with mandatory compensatory development.',
    provisions: [
      'Strict cumulative district acreage limits on multi-crop land',
      'Mandatory deposit for equivalent fallow land reclamation',
      'Automated GIS spatial verification preventing fertile belt encroachment',
    ],
    statutoryCategory: 'Food Security Protection',
  },
];

export const SchemesSection: React.FC = () => {
  const [selectedSafeguard, setSelectedSafeguard] = useState<SafeguardItem | null>(null);

  return (
    <section id="safeguards" className="py-16 sm:py-20 bg-[#F8FAFC] border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D97706] uppercase tracking-widest bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
            Statutory Safeguards · RFCTLARR Act 2013
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
            Statutory Safeguards &amp; Citizen Rights
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Statutory rights guaranteed under Indian law to protect landowners, tenant cultivators, and livelihood-dependent families during public infrastructure acquisition.
          </p>
        </div>

        {/* 4 Safeguard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATUTORY_SAFEGUARDS.map((sg) => (
            <div
              key={sg.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10.5px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {sg.sectionCode}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {sg.statutoryCategory}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#0B1F33] mb-1.5 leading-snug">
                  {sg.title}
                </h3>

                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                  {sg.tagline}
                </p>

                {/* Key Provisions */}
                <div className="space-y-1.5 mb-4 pt-2 border-t border-slate-100">
                  {sg.provisions.map((p, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                      <span className="text-[#138808] font-bold mt-0.5">✓</span>
                      <span className="leading-tight">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedSafeguard(sg)}
                  className="text-xs font-bold text-[#0C5A37] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Read Statutory Rule</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal / Detail Popover */}
        {selectedSafeguard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                    {selectedSafeguard.sectionCode} · {selectedSafeguard.statutoryCategory}
                  </span>
                  <h3 className="text-base font-extrabold text-[#0B1F33] mt-0.5">
                    {selectedSafeguard.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSafeguard(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedSafeguard.description}
              </p>

              <div className="space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 block">Statutory Mandate:</span>
                <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                  {selectedSafeguard.provisions.map((prov, idx) => (
                    <li key={idx}>{prov}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedSafeguard(null)}
                  className="bg-[#0B2540] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-xs text-slate-500 italic">
          * Modeled as per the statutory provisions of the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013.
        </div>

      </div>
    </section>
  );
};
