'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { DEMO_DATA_DISCLAIMER } from '../../data/homepageData';

const SAMPLE_BENEFICIARIES = [
  {
    khasra: '103/10',
    village: 'Padra',
    district: 'Vadodara',
    state: 'Gujarat',
    project: 'NH-48 Bharatmala Six-Laning',
    beneficiary: 'Shri Ramchandra Patil',
    areaAcquired: '0.95 Ha',
    baseRate: '₹14.20 L',
    multiplier: '1.25x (Rural)',
    solatium: '₹17.75 L (100%)',
    interest: '₹2.35 L (12% Sec. 30)',
    totalAward: '₹37.85 L',
    utr: 'PFMS-2026-98124501',
    status: 'Disbursed (100%)',
  },
  {
    khasra: '104/B',
    village: 'Padra',
    district: 'Vadodara',
    state: 'Gujarat',
    project: 'NH-48 Bharatmala Six-Laning',
    beneficiary: 'Shri Govindbhai Solanki',
    areaAcquired: '1.15 Ha',
    baseRate: '₹28.40 L',
    multiplier: '1.25x (Rural)',
    solatium: '₹35.50 L (100%)',
    interest: '₹4.60 L (12% Sec. 30)',
    totalAward: '₹75.50 L',
    utr: 'PFMS-2026-98124502',
    status: 'Disbursed (100%)',
  },
  {
    khasra: '218/4',
    village: 'Kotputli',
    district: 'Jaipur',
    state: 'Rajasthan',
    project: 'Eastern Dedicated Freight Corridor',
    beneficiary: 'Smt. Sharda Devi Meena',
    areaAcquired: '1.80 Ha',
    baseRate: '₹32.00 L',
    multiplier: '1.50x (Rural Interior)',
    solatium: '₹48.00 L (100%)',
    interest: '₹6.20 L (12% Sec. 30)',
    totalAward: '₹102.20 L',
    utr: 'PFMS-2026-98124503',
    status: 'Disbursed (100%)',
  },
  {
    khasra: '102/1A',
    village: 'Padra',
    district: 'Vadodara',
    state: 'Gujarat',
    project: 'NH-48 Bharatmala Six-Laning',
    beneficiary: 'Smt. Kamlaben Rathod',
    areaAcquired: '0.88 Ha',
    baseRate: '₹12.50 L',
    multiplier: '1.25x (Rural)',
    solatium: '₹15.62 L (100%)',
    interest: '₹1.88 L (12% Sec. 30)',
    totalAward: '₹33.00 L',
    utr: 'PFMS-HOLD-SEC15',
    status: 'Escrow Pending Hearing',
  },
  {
    khasra: '88/2',
    village: 'Chakan',
    district: 'Pune',
    state: 'Maharashtra',
    project: 'Pune–Nashik High Speed Rail',
    beneficiary: 'Shri Dattatray Shinde',
    areaAcquired: '0.45 Ha',
    baseRate: '₹22.50 L',
    multiplier: '1.10x (Semi-Urban)',
    solatium: '₹24.75 L (100%)',
    interest: '₹2.90 L (12% Sec. 30)',
    totalAward: '₹52.40 L',
    utr: 'PFMS-2026-98124505',
    status: 'Disbursed (100%)',
  },
];

export default function CompensationPage() {
  const { isHindi } = useLocale();

  // Simple interactive compensation calculator
  const [calcArea, setCalcArea] = useState<number>(1.0);
  const [calcRate, setCalcRate] = useState<number>(2500000); // 25 Lakhs / Ha
  const [calcRuralMultiplier, setCalcRuralMultiplier] = useState<number>(1.5);

  const baseMarketVal = calcArea * calcRate;
  const multipliedVal = baseMarketVal * calcRuralMultiplier;
  const solatium100 = multipliedVal * 1.0;
  const interest12 = multipliedVal * 0.12;
  const totalCalculatedAward = multipliedVal + solatium100 + interest12;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/" className="hover:text-slate-800 transition-colors">
                {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#0C5A37] font-bold">
                {isHindi ? 'प्रतिकर एवं प्रत्यक्ष लाभ अंतरण' : 'Compensation & DBT Traceability'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {isHindi ? 'वैधानिक प्रतिकर एवं प्रत्यक्ष अंतरण ट्रैकिंग' : 'Statutory Compensation & Valuation Traceability'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {isHindi
                ? 'RFCTLARR अधिनियम 2013 की धारा 26 से 30 के अंतर्गत सर्किल दर, 100% तोषाण एवं प्रत्यक्ष बैंक भुगतान की पारदर्शी निगरानी'
                : 'Auditable tracking under Sections 26–30 of RFCTLARR Act 2013: Circle rates, rural multipliers, 100% mandatory solatium, and PFMS DBT disbursals.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#0C5A37] text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#138808]" />
              <span>{isHindi ? 'PFMS / DBT गेटवे सक्रिय' : 'PFMS Direct DBT Verified'}</span>
            </span>
          </div>
        </div>

        {/* 4 Quantitative Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'कुल अधिनिर्णीत प्रतिकर' : 'Total Assessed Award'}
            </div>
            <div className="text-2xl font-black text-[#0B2540]">₹24,800 Cr</div>
            <div className="text-xs text-slate-500 font-medium">
              {isHindi ? '1,284 परियोजनाओं में 100% तोषाण सहित' : 'Across 1,284 monitored corridors'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'प्रत्यक्ष संवितरित (DBT)' : 'Disbursed (Direct Benefit)'}
            </div>
            <div className="text-2xl font-black text-[#138808]">₹14,850 Cr</div>
            <div className="text-xs text-[#138808] font-bold">
              {isHindi ? '59.8% संवितरण पूर्ण' : '59.8% disbursed directly to Khatedars'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'वैधानिक 100% तोषाण (Solatium)' : '100% Solatium Amount'}
            </div>
            <div className="text-2xl font-black text-[#0B2540]">₹7,425 Cr</div>
            <div className="text-xs text-slate-500 font-medium">
              {isHindi ? 'धारा 30(1) वैधानिक सुरक्षा' : 'Mandatory under Sec. 30(1)'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'लाभार्थी खातेदार' : 'Credited Beneficiaries'}
            </div>
            <div className="text-2xl font-black text-[#0B2540]">84,200</div>
            <div className="text-xs text-slate-500 font-medium">
              {isHindi ? 'आधार-लिंक्ड बैंक खाते (PFMS)' : 'Aadhaar-seeded bank mandates'}
            </div>
          </div>
        </div>

        {/* 2-Column: Formula / Interactive Simulator & Safeguard Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Statutory Calculator Simulator (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'RFCTLARR प्रतिकर कैलकुलेटर' : 'Statutory Compensation Simulator'}
              </h2>
              <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#0C5A37]">
                Sec. 26 to 30
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  {isHindi ? 'अधिगृहीत क्षेत्रफल (हेक्टेयर)' : 'Acquired Area (Hectares)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={calcArea}
                  onChange={(e) => setCalcArea(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  {isHindi ? 'सर्किल दर / बाजार मूल्य (₹ प्रति हेक्टेयर)' : 'Circle Rate / Market Rate (₹/Ha)'}
                </label>
                <input
                  type="number"
                  step="100000"
                  value={calcRate}
                  onChange={(e) => setCalcRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">
                  {isHindi ? 'ग्रामीण गुणक (दूरी के आधार पर 1.0x से 2.0x)' : 'Rural Multiplier Factor (1.0x to 2.0x)'}
                </label>
                <select
                  value={calcRuralMultiplier}
                  onChange={(e) => setCalcRuralMultiplier(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                >
                  <option value={1.0}>1.0x — Urban Limits (0 km)</option>
                  <option value={1.25}>1.25x — Semi-Urban (0–10 km)</option>
                  <option value={1.5}>1.50x — Rural (10–20 km)</option>
                  <option value={1.75}>1.75x — Remote Rural (20–30 km)</option>
                  <option value={2.0}>2.00x — Deep Rural Interior (&gt;30 km)</option>
                </select>
              </div>

              {/* Calculated Breakdown Box */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 mt-4">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Base Market Value (Area × Rate):</span>
                  <span className="font-mono text-slate-200">₹{(baseMarketVal / 100000).toFixed(2)} Lakhs</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Multiplied Land Value ({calcRuralMultiplier}x):</span>
                  <span className="font-mono text-slate-200">₹{(multipliedVal / 100000).toFixed(2)} Lakhs</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                  <span>+ 100% Solatium (Sec. 30):</span>
                  <span className="font-mono">₹{(solatium100 / 100000).toFixed(2)} Lakhs</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-amber-300">
                  <span>+ 12% Market Interest (Sec. 30):</span>
                  <span className="font-mono">₹{(interest12 / 100000).toFixed(2)} Lakhs</span>
                </div>
                <div className="pt-2 border-t border-slate-700 flex items-center justify-between font-black text-sm">
                  <span>Total Statutory Award:</span>
                  <span className="text-emerald-400 text-base font-mono">₹{(totalCalculatedAward / 100000).toFixed(2)} Lakhs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Valuation Principles (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'RFCTLARR 2013 वैधानिक सुरक्षा सिद्धांत' : 'Statutory Compensation Safeguards under RFCTLARR 2013'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="font-bold text-[#0B2540] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#138808]" />
                  <span>Section 26 — Market Value Determination</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  Market value determined by the highest of circle rate, average registered sale deeds in the vicinity during previous 3 years, or agreed amount.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="font-bold text-[#0B2540] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#138808]" />
                  <span>Section 30(1) — 100% Mandatory Solatium</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  An equivalent 100% of total multiplied market value must be awarded as solatium in every compulsory acquisition case without deduction.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="font-bold text-[#0B2540] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#138808]" />
                  <span>Section 30(3) — 12% Per Annum Interest</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  Additional interest computed at 12% per annum on market value from the date of Section 11 preliminary publication to date of Collector Award.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
                <div className="font-bold text-[#0B2540] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#138808]" />
                  <span>Section 77 — DBT Direct Beneficiary Payment</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11.5px]">
                  Compensation directly credited to Aadhaar-verified bank accounts through PFMS treasury interface, eliminating cash or intermediary leakages.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficiary Compensation Disbursal Ledger Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'संवितरित प्रतिकर बहीखाता (PFMS DBT Ledger)' : 'Beneficiary Disbursal Ledger (PFMS Direct Benefit Transfer)'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi ? 'प्रत्येक खसरा एवं लाभार्थी का पारदर्शी बैंक भुगतान विवरण' : 'Verified bank mandates, solatium breakdown, and transaction status per parcel.'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0C5A37] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              {SAMPLE_BENEFICIARIES.length} Model Mandates Audited
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-y border-slate-200 text-[10.5px]">
                <tr>
                  <th className="py-2.5 px-3">Khasra / Village</th>
                  <th className="py-2.5 px-3">Beneficiary (Khatedar)</th>
                  <th className="py-2.5 px-3">Project Corridor</th>
                  <th className="py-2.5 px-3">Area Acquired</th>
                  <th className="py-2.5 px-3">Multiplier</th>
                  <th className="py-2.5 px-3">100% Solatium</th>
                  <th className="py-2.5 px-3">Total Award</th>
                  <th className="py-2.5 px-3">PFMS UTR / Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {SAMPLE_BENEFICIARIES.map((row) => (
                  <tr key={row.khasra} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#0B2540]">{row.khasra}</div>
                      <div className="text-[10px] text-slate-500">{row.village}, {row.district}</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {row.beneficiary}
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-600">
                      {row.project}
                    </td>
                    <td className="py-3 px-3 font-medium">
                      {row.areaAcquired}
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      {row.multiplier}
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#138808]">
                      {row.solatium}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#0B2540]">
                      {row.totalAward}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-[10.5px] text-slate-500">{row.utr}</div>
                      <span className={`inline-block text-[9.5px] font-bold px-2 py-0.5 rounded mt-0.5 ${
                        row.status.includes('Disbursed')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-right">
            <span className="text-[11px] text-slate-500 font-mono">
              * {DEMO_DATA_DISCLAIMER}
            </span>
          </div>
        </div>

      </main>

      <InstitutionalFooter />
    </div>
  );
}
