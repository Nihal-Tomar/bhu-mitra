'use client';

import React, { useState } from 'react';

export const LandRecordsPreview: React.FC = () => {
  const [searchSurvey, setSearchSurvey] = useState('103/10');
  const [downloaded, setDownloaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'entitlement' | 'ror' | 'hearing'>('entitlement');

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <section id="transparency" className="py-16 sm:py-20 bg-[#F5F7FA] border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
            Citizen Transparency · Upstream Land Record Integration
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
            Affected Landowner &amp; Family Transparency Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Integrating upstream revenue records (RoR / Khasra) with statutory acquisition tracking: search your survey number, verify gazette notifications, calculate statutory compensation, and monitor R&amp;R entitlements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Interactive Citizen Dossier Query (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search Input Box */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Track Acquisition by Survey / Khasra Number
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchSurvey}
                  onChange={(e) => setSearchSurvey(e.target.value)}
                  placeholder="Enter Survey No. (e.g. 103/10)"
                  className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#138808]"
                />
                <button
                  type="button"
                  className="bg-[#0C5A37] hover:bg-[#084228] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1 text-[10.5px] text-slate-500">
                <span>Try Demo Parcels:</span>
                <button
                  type="button"
                  onClick={() => setSearchSurvey('103/10')}
                  className="text-emerald-800 font-bold hover:underline"
                >
                  #103/10 (Sec 11)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSearchSurvey('104/B')}
                  className="text-blue-800 font-bold hover:underline"
                >
                  #104/B (Paid)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSearchSurvey('105/C')}
                  className="text-emerald-800 font-bold hover:underline"
                >
                  #105/C (Possession)
                </button>
              </div>
            </div>

            {/* Found Parcel Summary Dossier */}
            <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Parcel #{searchSurvey}
                  </span>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    NH-48 Bharatmala Six-Laning (Vadodara Pkg 4)
                  </div>
                </div>
                <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                  Sec. 11 Notified
                </span>
              </div>

              {/* Navigation Tabs inside Dossier */}
              <div className="flex border-b border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('entitlement')}
                  className={`flex-1 py-1.5 font-bold text-center border-b-2 transition-all cursor-pointer ${
                    activeTab === 'entitlement'
                      ? 'border-[#0C5A37] text-[#0C5A37]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Compensation
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ror')}
                  className={`flex-1 py-1.5 font-bold text-center border-b-2 transition-all cursor-pointer ${
                    activeTab === 'ror'
                      ? 'border-[#0C5A37] text-[#0C5A37]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Revenue RoR
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('hearing')}
                  className={`flex-1 py-1.5 font-bold text-center border-b-2 transition-all cursor-pointer ${
                    activeTab === 'hearing'
                      ? 'border-[#0C5A37] text-[#0C5A37]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  R&amp;R &amp; Hearing
                </button>
              </div>

              {/* Tab 1: Statutory Compensation Breakdown */}
              {activeTab === 'entitlement' && (
                <div className="space-y-2 text-xs text-slate-700 animate-fadeIn">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Base Circle Market Value:</span>
                      <span className="font-bold text-slate-800">₹16,16,666</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rural Multiplier Factor (1.5x):</span>
                      <span className="font-bold text-slate-800">₹24,25,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assets (Crops, 18 Trees, Borewell):</span>
                      <span className="font-bold text-slate-800">₹4,00,000</span>
                    </div>
                    <div className="flex justify-between text-emerald-800 font-bold border-t border-slate-200 pt-1">
                      <span>100% Solatium Bonus (Sec. 30):</span>
                      <span>+ ₹24,25,000</span>
                    </div>
                    <div className="flex justify-between text-xs font-black text-slate-900 border-t border-slate-300 pt-1 text-[12px]">
                      <span>Total Statutory Award:</span>
                      <span className="text-[#0C5A37]">₹48,50,000</span>
                    </div>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-[11px] text-emerald-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">PFMS Escrow Disbursement:</span>
                      <span>₹38,80,000 Credited (Tranche 1 - 80%)</span>
                    </div>
                    <span className="bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded text-[9.5px]">
                      Verified DBT
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Upstream Revenue RoR Record */}
              {activeTab === 'ror' && (
                <div className="space-y-2 text-xs text-slate-700 animate-fadeIn">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Titleholder (Khatedar):</span>
                      <span className="font-bold text-slate-900">Shri Ramchandra Patil &amp; 2 Others</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Land Classification:</span>
                      <span className="font-semibold text-slate-800">Irrigated Multi-Crop Agricultural (Survey #103/10)</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Village &amp; Tehsil:</span>
                      <span className="font-semibold text-slate-800">Alkapuri Rural (042), Karjan, Vadodara</span>
                    </div>
                    <div className="pt-1 border-t border-slate-200 text-emerald-800 font-medium">
                      ✓ Upstream RoR cross-referenced with Section 11 Gazette to prevent duplicate claims.
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: R&R & Hearing Status */}
              {activeTab === 'hearing' && (
                <div className="space-y-2 text-xs text-slate-700 animate-fadeIn">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Section 15 Objection Hearing:</span>
                      <span className="font-semibold text-slate-800">Hearing conducted on 28 Apr 2026. Objection disposed by CALA.</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">R&amp;R Entitlement Scheme:</span>
                      <span className="font-semibold text-slate-800">Allotted Resettlement Plot #24 (250 sq. m.) in Model Colony.</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Possession Status under Section 38:</span>
                      <span className="font-semibold text-amber-900">Handover pending final 20% compensation release.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 bg-[#0B2540] hover:bg-[#07192b] text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors shadow-2xs text-center"
                >
                  {downloaded ? 'Notice Downloaded ✓' : 'Download Section 11 Notice (PDF)'}
                </button>
                <a
                  href="#how-it-works"
                  className="text-center py-2 px-3 border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 rounded-xl transition-colors"
                >
                  File Section 15 Hearing Query
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: High-Fidelity Statutory Notice & Award Certificate (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-xl p-5 sm:p-7 relative overflow-hidden font-sans">
              
              {/* Official Watermark Background Motif */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <svg viewBox="0 0 100 100" className="w-96 h-96" fill="currentColor">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="1" />
                </svg>
              </div>

              {/* Document Header */}
              <div className="border-b-2 border-slate-800 pb-3.5 mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 font-extrabold text-[11px]">
                    DoLR
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      भारत सरकार • GOVERNMENT OF INDIA
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#0B1F33]">
                      भूमि अधिग्रहण एवं उचित मुआवजा प्रपत्र · STATUTORY AWARD STATEMENT
                    </div>
                    <div className="text-[9.5px] text-slate-500">
                      Under Section 11(1), 23 &amp; 30 of the RFCTLARR Act 2013 (Illustrative Model)
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 px-2 py-1 rounded">
                  GAZ-2026-512
                </span>
              </div>

              {/* Two-Column Metadata Table */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
                <div>
                  <span className="text-[10px] text-slate-500 block">Project Alignment:</span>
                  <strong className="text-slate-900">NH-48 Bharatmala Six-Laning Pkg 4</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Acquiring Authority (CALA):</span>
                  <strong className="text-slate-900">Competent Authority &amp; SDM, Vadodara</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Cadastral Survey Number:</span>
                  <strong className="text-emerald-900 font-mono">103/10 (Khatauni #248)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Acquired Area / Total:</span>
                  <strong className="text-slate-900">0.95 Ha / 1.42 Ha (2.35 Acres)</strong>
                </div>
              </div>

              {/* Calculation Breakdown Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-4 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 text-[10.5px] font-bold uppercase">
                      <th className="p-2 border-b border-slate-200">Statutory Head</th>
                      <th className="p-2 border-b border-slate-200">Formula / Provision</th>
                      <th className="p-2 border-b border-slate-200 text-right">Assessed Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    <tr>
                      <td className="p-2 font-medium">Base Market Rate</td>
                      <td className="p-2 text-slate-600">Circle rate / average sales deed</td>
                      <td className="p-2 text-right font-mono">₹16,16,666</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Rural Factor Multiplier</td>
                      <td className="p-2 text-slate-600">1.5x Multiplier for rural district</td>
                      <td className="p-2 text-right font-mono">₹24,25,000</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Standing Assets Valuation</td>
                      <td className="p-2 text-slate-600">Horticulture + 1 borewell structure</td>
                      <td className="p-2 text-right font-mono">₹4,00,000</td>
                    </tr>
                    <tr className="bg-emerald-50/60 font-bold text-emerald-900">
                      <td className="p-2">100% Solatium (Bonus)</td>
                      <td className="p-2">Mandatory 100% under Section 30(1)</td>
                      <td className="p-2 text-right font-mono">₹24,25,000</td>
                    </tr>
                    <tr className="bg-slate-100/90 font-extrabold text-slate-900">
                      <td className="p-2">Total Sanctioned Award</td>
                      <td className="p-2 text-[10px] text-slate-600">Direct PFMS Escrow Mandate</td>
                      <td className="p-2 text-right font-mono text-emerald-800 text-xs sm:text-sm">
                        ₹48,50,000
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Statutory Signature Block & Legal Stamp */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-200">
                <div className="space-y-0.5 text-[10.5px]">
                  <div>Authority: Competent Authority for Land Acquisition</div>
                  <div className="text-slate-400 font-mono">Verification Checksum: #SHA256-e3b0c442...</div>
                </div>
                <div className="text-right">
                  <span className="inline-block border border-emerald-600 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider bg-emerald-50">
                    Officially Gazetted
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
