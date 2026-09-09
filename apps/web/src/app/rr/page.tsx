'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { DEMO_DATA_DISCLAIMER } from '../../data/homepageData';

const RR_PROJECT_DATA = [
  {
    project: 'NH-48 Bharatmala Six-Laning Corridor',
    location: 'Vadodara & Bharuch, Gujarat',
    affectedFamilies: 1420,
    displacedFamilies: 340,
    housingAllocated: 340,
    subsistenceDisbursedCr: '₹5.11 Cr',
    annuityOpted: 620,
    colonyName: 'Vikas Nagar Resettlement Colony, Padra',
    infraStatus: 'Roads, Water, Electricity & Primary Health Center 100% Ready',
    compliancePct: 96,
  },
  {
    project: 'Eastern Dedicated Freight Corridor (DFC)',
    location: 'Jaipur & Alwar, Rajasthan',
    affectedFamilies: 2850,
    displacedFamilies: 610,
    housingAllocated: 580,
    subsistenceDisbursedCr: '₹9.80 Cr',
    annuityOpted: 1140,
    colonyName: 'Kalyan Nagar Resettlement Colony, Kotputli',
    infraStatus: 'Paved Roads 100%, Solar Streetlights 100%, School Handover Complete',
    compliancePct: 91,
  },
  {
    project: 'Pune–Nashik Semi-High Speed Rail',
    location: 'Pune & Ahmednagar, Maharashtra',
    affectedFamilies: 980,
    displacedFamilies: 180,
    housingAllocated: 180,
    subsistenceDisbursedCr: '₹3.24 Cr',
    annuityOpted: 410,
    colonyName: 'Shri Samarth Resettlement Enclave, Chakan',
    infraStatus: 'Potable Tap Water & Underground Drainage Functional',
    compliancePct: 98,
  },
  {
    project: 'Rewa Ultra-Mega Solar Power Corridor',
    location: 'Rewa & Sidhi, Madhya Pradesh',
    affectedFamilies: 640,
    displacedFamilies: 95,
    housingAllocated: 95,
    subsistenceDisbursedCr: '₹1.85 Cr',
    annuityOpted: 290,
    colonyName: 'Surya Nagar Township, Gurh',
    infraStatus: 'Community Hall, Anganwadi Center & Solar Micro-grid Operating',
    compliancePct: 95,
  },
];

export default function RRPage() {
  const { isHindi } = useLocale();

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
                {isHindi ? 'पुनर्वासन एवं पुनर्व्यवस्थापन' : 'Rehabilitation & Resettlement'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {isHindi ? 'पुनर्वासन एवं पुनर्व्यवस्थापन (R&R) निगरानी' : 'Rehabilitation & Resettlement (R&R) Portal'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {isHindi
                ? 'RFCTLARR अधिनियम 2013 की द्वितीय एवं तृतीय अनुसूची के तहत प्रभावित परिवारों हेतु आवास, आजीविका और पुनर्वास सुरक्षा'
                : 'Mandatory family safeguards under Schedules II & III of RFCTLARR Act 2013: housing allotment, subsistence, and community amenities.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-[#0C5A37] text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#138808]" />
              <span>{isHindi ? 'R&R प्रशासक सत्यापन सक्रिय' : 'R&R Administrator Certified'}</span>
            </span>
          </div>
        </div>

        {/* 4 Quantitative Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'कुल प्रभावित परिवार' : 'Total Affected Families'}
            </div>
            <div className="text-2xl font-black text-[#0B2540]">84,200</div>
            <div className="text-xs text-slate-500 font-medium">
              {isHindi ? 'सामाजिक प्रभाव आकलन (SIA) द्वारा प्रमाणित' : 'Census-verified in Social Impact Assessment'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'विस्थापित परिवार' : 'Displaced Families'}
            </div>
            <div className="text-2xl font-black text-[#0B2540]">16,400</div>
            <div className="text-xs text-slate-500 font-medium">
              {isHindi ? 'आवास अधिकार हेतु पात्र' : 'Eligible for mandatory pucca resettlement'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'निर्मित पुनर्वास आवास' : 'Housing Units Handed Over'}
            </div>
            <div className="text-2xl font-black text-[#138808]">14,100</div>
            <div className="text-xs text-[#138808] font-bold">
              {isHindi ? '85.9% परिवारों को आवास आबंटित' : '85.9% families housed in model colonies'}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isHindi ? 'निर्वाह एवं आजीविका अनुदान' : 'Subsistence Disbursed'}
            </div>
            <div className="text-2xl font-black text-[#0B2540]">₹420 Cr</div>
            <div className="text-xs text-slate-500 font-medium">
              {isHindi ? '₹3,000/माह प्रति परिवार (12 माह)' : '₹3,000/mo family grant + Shifting allowance'}
            </div>
          </div>
        </div>

        {/* 4 Statutory Schedule II Entitlement Pillars */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {isHindi ? 'RFCTLARR अधिनियम 2013 — अनिवार्य पुनर्वास अधिकार' : 'Schedule II Mandatory Entitlements for Affected Families'}
            </h2>
            <span className="text-xs font-bold text-[#0C5A37] bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Statutory Guarantees
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-[#0C5A37] flex items-center justify-center font-bold text-sm">
                🏠
              </div>
              <h3 className="font-bold text-[#0B2540] text-sm">
                {isHindi ? 'पुनर्वास आवास अधिकार' : 'Pucca Resettlement House'}
              </h3>
              <p className="text-slate-600 leading-relaxed text-[11.5px]">
                {isHindi
                  ? 'ग्रामीण क्षेत्र में न्यूनतम 50 वर्ग मीटर निर्मित मकान (आईएवाई/पीएमएवाई मानकों के अनुरूप) अथवा शहरी क्षेत्र में न्यूनतम 50 वर्ग मीटर कारपेट एरिया।'
                  : 'Constructed pucca house of minimum 50 sq.m carpet area in urban areas or free house site of minimum 50 sq.m plinth area in rural areas.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                💵
              </div>
              <h3 className="font-bold text-[#0B2540] text-sm">
                {isHindi ? 'मासिक निर्वाह अनुदान' : 'Subsistence Grant'}
              </h3>
              <p className="text-slate-600 leading-relaxed text-[11.5px]">
                {isHindi
                  ? 'प्रत्येक विस्थापित परिवार को विस्थापन की तारीख से 1 वर्ष की अवधि के लिए ₹3,000 प्रति माह का निर्वाह अनुदान। अनुसूचित जाति/जनजाति परिवारों को अतिरिक्त ₹50,000।'
                  : '₹3,000 per month per family for 1 year from the date of displacement. Additional ₹50,000 lump sum for scheduled castes and scheduled tribes.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                🚚
              </div>
              <h3 className="font-bold text-[#0B2540] text-sm">
                {isHindi ? 'स्थानांतरण एवं पशु शेड अनुदान' : 'Transportation Allowance'}
              </h3>
              <p className="text-slate-600 leading-relaxed text-[11.5px]">
                {isHindi
                  ? 'सामान, मवेशी एवं निर्माण सामग्री के परिवहन हेतु ₹50,000 एकमुश्त स्थानांतरण भत्ता तथा कारीगरों/छोटे व्यापारियों हेतु ₹25,000 से ₹50,000 का अनुदान।'
                  : '₹50,000 one-time shifting grant for belongings and cattle, plus ₹25,000 to ₹50,000 grant for rural artisans, small shopkeepers, and self-employed.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                📈
              </div>
              <h3 className="font-bold text-[#0B2540] text-sm">
                {isHindi ? 'रोजगार अथवा ₹5 लाख वार्षिकी' : 'Annuity or Employment'}
              </h3>
              <p className="text-slate-600 leading-relaxed text-[11.5px]">
                {isHindi
                  ? 'परियोजना में रोजगार, अथवा 20 वर्षों हेतु ₹2,000 प्रतिमाह वार्षिकी (उपभोक्ता मूल्य सूचकांक से समायोजित), अथवा एकमुश्त ₹5,00,000 का भुगतान।'
                  : 'Mandatory job in the project for one family member, or ₹2,000/month annuity for 20 years (CPI indexed), or one-time payment of ₹5,00,000.'}
              </p>
            </div>
          </div>
        </div>

        {/* Resettlement Colony Implementation Progress Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {isHindi ? 'पुनर्वास कॉलोनियों की भौतिक प्रगति' : 'Model Resettlement Colonies Implementation Progress'}
              </h2>
              <p className="text-xs text-slate-500">
                {isHindi ? '25 नागरिक सुविधाओं (सड़क, जल, विद्युत, स्कूल, स्वास्थ्य केंद्र) की वैधानिक उपलब्धता' : 'Audit of 25 mandatory infrastructural amenities under Schedule III.'}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Schedule III Civic Compliance
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-y border-slate-200 text-[10.5px]">
                <tr>
                  <th className="py-2.5 px-3">Project / Location</th>
                  <th className="py-2.5 px-3">Affected / Displaced</th>
                  <th className="py-2.5 px-3">Houses Allocated</th>
                  <th className="py-2.5 px-3">Subsistence Paid</th>
                  <th className="py-2.5 px-3">Resettlement Colony &amp; Civic Infrastructure</th>
                  <th className="py-2.5 px-3 text-right">R&amp;R Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {RR_PROJECT_DATA.map((row) => (
                  <tr key={row.project} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#0B2540]">{row.project}</div>
                      <div className="text-[10px] text-slate-500">{row.location}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{row.affectedFamilies} families</div>
                      <div className="text-[10px] text-slate-500">{row.displacedFamilies} displaced</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-[#138808]">
                      {row.housingAllocated} units (100%)
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {row.subsistenceDisbursedCr}
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-bold text-[#0B2540]">{row.colonyName}</div>
                      <div className="text-[10.5px] text-slate-500 leading-tight mt-0.5">{row.infraStatus}</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {row.compliancePct}% {isHindi ? 'अनुपालन' : 'Compliant'}
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
