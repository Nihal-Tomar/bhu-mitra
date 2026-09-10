'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { projectStore, CitizenGrievance } from '../../lib/projectStore';
import { useAuth, DEFAULT_DEMO_USER } from '../../lib/authContext';

export default function CitizenPortalPage() {
  const { isHindi } = useLocale();
  const { user } = useAuth();
  const currentUser = user || DEFAULT_DEMO_USER;

  // Search filter states
  const [selectedState, setSelectedState] = useState('Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState('Vadodara');
  const [selectedTehsil, setSelectedTehsil] = useState('Padra');
  const [selectedVillage, setSelectedVillage] = useState('Padra');
  const [surveyQuery, setSurveyQuery] = useState('103/10');
  const [activeTab, setActiveTab] = useState<'STATUS' | 'COMPENSATION' | 'RR' | 'DOCS' | 'GRIEVANCE'>('STATUS');

  // Grievance filing form state
  const [grievanceName, setGrievanceName] = useState(currentUser.role === 'CITIZEN' ? currentUser.name : 'Ramesh Chandra Patel');
  const [grievancePhone, setGrievancePhone] = useState('+91 98250 14821');
  const [grievanceCategory, setGrievanceCategory] = useState<'COMPENSATION_DISPUTE' | 'MEASUREMENT_ERROR' | 'TITLE_DISPUTE' | 'RR_BENEFIT' | 'PROCEDURAL'>('COMPENSATION_DISPUTE');
  const [grievanceDescription, setGrievanceDescription] = useState('');
  const [isSubmittingGrievance, setIsSubmittingGrievance] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Local list of grievances
  const [grievances, setGrievances] = useState<CitizenGrievance[]>([]);

  useEffect(() => {
    setGrievances(projectStore.getGrievances('DOLR-2026-0084'));
  }, []);

  // Demo parcel details
  const parcelData = {
    surveyNo: '103/10',
    khataNo: 'KH-842',
    village: 'Padra',
    tehsil: 'Padra',
    district: 'Vadodara',
    state: 'Gujarat',
    projectId: 'DOLR-2026-0084',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    requiringBody: 'National Highways Authority of India (NHAI)',
    landowner: 'Ramesh Chandra Patel & 2 Co-sharers',
    aadhaarMasked: 'XXXX-XXXX-8812',
    bankAccountMasked: 'State Bank of India — A/C ****4821 (IFSC: SBIN0001042)',
    totalAreaHa: 1.45,
    acquiredAreaHa: 1.12,
    landType: 'Irrigated Multi-Crop Agricultural (Bhadarva Pat)',
    status: 'Acquisition Award Approved (Section 23)',
    currentStage: 'Stage 06: Section 23 Award & Compensation Disbursement',
    possessionStatus: 'Notice Issued under Section 38(1) — 60 Days Notice Active',
    compensation: {
      baseMarketValue: 1940000,
      multiplierFactor: 1.25,
      adjustedValue: 2425000,
      assetsValue: 480000, // Wells, pipeline, trees
      totalBase: 2905000,
      solatium100Pct: 2905000,
      interest12Pct: 348600,
      grandTotalAward: 6158600,
      disbursedAmount: 4926880, // 80%
      pendingAmount: 1231720,
      utrNumber: 'PFMS202603119842103',
      paymentDate: '2026-02-18',
      dbtStatus: 'CREDITED_TO_BENEFICIARY_AADHAAR_SEED',
    },
    rrEntitlements: {
      affectedFamilyCardNo: 'RR-GJ-VAD-2026-042',
      category: 'Agricultural Land Loser (Displaced from primary livelihood)',
      oneTimeLumpSumSubsidy: 500000,
      subsidyStatus: 'Disbursed via DBT',
      monthlyAnnuity: 3000,
      annuityTenureMonths: 12,
      resettlementHousingSite: 'Plot No. 14, R&R Township Vadodara South',
      housingGrant: 150000,
    },
    notices: [
      {
        id: 'NOT-01',
        title: 'Section 11(1) Preliminary Gazette Notification',
        gazetteNo: 'GoG Extra No. 248/2025',
        date: '12-Oct-2025',
        type: 'Gazette Extraordinary',
        url: '#',
      },
      {
        id: 'NOT-02',
        title: 'Section 15 Hearing Notice to Landowners',
        gazetteNo: 'CALA/VAD/NH48/Sec15/842',
        date: '15-Dec-2025',
        type: 'Public Notice',
        url: '#',
      },
      {
        id: 'NOT-03',
        title: 'Section 19(1) Declaration of Resettlement & Acquisition',
        gazetteNo: 'GoI Extraordinary No. 512/2026',
        date: '28-Jan-2026',
        type: 'Gazette Notification',
        url: '#',
      },
      {
        id: 'NOT-04',
        title: 'Section 23 Award Declaration & Form-H Intimation',
        gazetteNo: 'CALA/VAD/AWD/2026/103',
        date: '10-Feb-2026',
        type: 'Statutory Award',
        url: '#',
      },
    ],
  };

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceDescription) {
      alert('Please describe your objection or grievance.');
      return;
    }

    setIsSubmittingGrievance(true);
    setTimeout(() => {
      const categoryLabels: Record<string, string> = {
        COMPENSATION_DISPUTE: 'Compensation & Valuation Objection (Sec 15/64)',
        MEASUREMENT_ERROR: 'Cadastral Area / Boundary Demarcation Error',
        TITLE_DISPUTE: 'Ownership Share / Mutation Discrepancy',
        RR_BENEFIT: 'R&R Scheme Entitlement Omission',
        PROCEDURAL: 'Statutory Notice Non-Service',
      };

      const newGrv = projectStore.submitGrievance({
        projectId: parcelData.projectId,
        projectName: parcelData.projectName,
        surveyNo: parcelData.surveyNo,
        village: parcelData.village,
        district: parcelData.district,
        complainantName: grievanceName,
        complainantPhone: grievancePhone,
        category: grievanceCategory,
        categoryLabel: categoryLabels[grievanceCategory] || grievanceCategory,
        description: grievanceDescription,
      });

      setSubmittedTicket(newGrv.ticketNumber);
      setGrievances(projectStore.getGrievances(parcelData.projectId));
      setIsSubmittingGrievance(false);
      setGrievanceDescription('');
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Breadcrumb & Welcome Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/" className="hover:text-slate-800 transition-colors">
                {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#0C5A37] font-bold">
                {isHindi ? 'नागरिक भूमि सेवा केंद्र' : 'Citizen Landowner Portal'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {isHindi ? 'भूस्वामी अधिकार, मुआवजा एवं ट्रैकिंग पोर्टल' : 'Citizen & Landowner Acquisition Portal'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {isHindi
                ? 'अपने भूखंड का अधिग्रहण विवरण, आरएफसीटीएलएआरआर मुआवजा, पुनर्वास और सांविधिक आपत्तियां दर्ज करें'
                : 'Direct digital window for affected landholders to track acquisition status, compensation ledger, R&R entitlements, and submit Section 15 statutory objections.'}
            </p>
          </div>

          {/* Quick Demo Pre-select */}
          <div className="flex flex-wrap items-center gap-2 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
            <span className="font-bold text-[#0C5A37]">⚡ Quick Parcel:</span>
            <button
              type="button"
              onClick={() => setSurveyQuery('103/10')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                surveyQuery === '103/10'
                  ? 'bg-[#0C5A37] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Survey 103/10 (Padra)
            </button>
            <button
              type="button"
              onClick={() => setSurveyQuery('104/B')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all ${
                surveyQuery === '104/B'
                  ? 'bg-[#0C5A37] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Survey 104/B (Tree Valuation)
            </button>
          </div>
        </div>

        {/* Search & Land Records Lookup Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>{isHindi ? '१. अपने भूखंड का विवरण चुनें' : '1. Search Your Land Parcel (Any-RoR Cadastral Link)'}</span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              State Land Records (Any-RoR / Bhulekh) Integrated
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0C5A37]"
              >
                <option value="Gujarat">Gujarat</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">District</label>
              <input
                type="text"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0C5A37]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Tehsil / Taluka</label>
              <input
                type="text"
                value={selectedTehsil}
                onChange={(e) => setSelectedTehsil(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0C5A37]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Revenue Village</label>
              <input
                type="text"
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0C5A37]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Survey / Khasra No. *</label>
              <input
                type="text"
                value={surveyQuery}
                onChange={(e) => setSurveyQuery(e.target.value)}
                placeholder="e.g. 103/10"
                className="w-full text-xs font-mono font-bold px-3 py-2 rounded-lg border border-[#0C5A37] bg-white focus:ring-2 focus:ring-[#0C5A37]"
              />
            </div>
          </div>
        </div>

        {/* Parcel Dossier Card Header */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="bg-[#0B2540] text-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  SURVEY NO. {parcelData.surveyNo}
                </span>
                <span className="text-xs text-slate-300">
                  {parcelData.village} • {parcelData.tehsil} • {parcelData.district}
                </span>
              </div>
              <h2 className="text-xl font-extrabold">{parcelData.landowner}</h2>
              <div className="text-xs text-slate-300 flex items-center gap-4">
                <span>Associated Infrastructure Project: <strong>{parcelData.projectName}</strong></span>
              </div>
            </div>

            <div className="text-right space-y-1 bg-white/5 p-3 rounded-xl border border-white/10 shrink-0">
              <div className="text-[11px] text-slate-300">Statutory Acquisition Status</div>
              <div className="text-sm font-bold text-emerald-400">{parcelData.status}</div>
              <div className="text-[10px] text-slate-400">Section 23 Award Declared</div>
            </div>
          </div>

          {/* Privacy Protected Citizen Details Bar */}
          <div className="bg-slate-50 border-b border-slate-200 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Total Land in Parcel</span>
              <strong className="text-slate-800">{parcelData.totalAreaHa} Hectares</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Acquired Extent (Corridor)</span>
              <strong className="text-[#0C5A37]">{parcelData.acquiredAreaHa} Hectares</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Aadhaar Masked</span>
              <span className="font-mono text-slate-700 font-semibold">{parcelData.aadhaarMasked}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Direct Bank Account</span>
              <span className="font-mono text-slate-700 text-[11px] truncate block">{parcelData.bankAccountMasked}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-white px-4 overflow-x-auto">
            {[
              { id: 'STATUS' as const, label: isHindi ? '१. अधिग्रहण स्थिति' : '1. Acquisition Status' },
              { id: 'COMPENSATION' as const, label: isHindi ? '२. मुआवजा पासबुक' : '2. Compensation Passbook' },
              { id: 'RR' as const, label: isHindi ? '३. पुनर्वास एवं पुनर्व्यवस्थापन' : '3. R&R Entitlements' },
              { id: 'DOCS' as const, label: isHindi ? '४. गजट एवं नोटिस' : '4. Official Notices' },
              { id: 'GRIEVANCE' as const, label: isHindi ? '५. धारा १५ आपत्ति / शिकायत' : '5. Section 15 Objection' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0C5A37] text-[#0C5A37]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* TAB 1: ACQUISITION STATUS */}
            {activeTab === 'STATUS' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0C5A37]">Current Acquisition Stage: {parcelData.currentStage}</span>
                    <span className="font-mono font-bold text-emerald-800">80% Advanced</span>
                  </div>
                  <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#138808] h-full rounded-full w-4/5" />
                  </div>
                  <div className="text-[11px] text-slate-600">
                    RFCTLARR Section 19(7) Declaration published on 28-Jan-2026. Joint award finalized on 10-Feb-2026.
                  </div>
                </div>

                {/* Milestone Stepper */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-emerald-300 shadow-2xs space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase">Step 1 • Completed</div>
                    <div className="font-bold text-slate-900">Sec 11 Notification</div>
                    <div className="text-[11px] text-slate-500">Gazetted on 12-Oct-2025. Land freezes against unapproved sale.</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-300 shadow-2xs space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase">Step 2 • Completed</div>
                    <div className="font-bold text-slate-900">Sec 15 Hearing</div>
                    <div className="text-[11px] text-slate-500">Objections heard by Collectorate on 18-Dec-2025. Report submitted.</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-300 shadow-2xs space-y-1">
                    <div className="text-[10px] font-bold text-emerald-700 uppercase">Step 3 • Completed</div>
                    <div className="font-bold text-slate-900">Sec 19 Declaration</div>
                    <div className="text-[11px] text-slate-500">Final public declaration published within statutory 12-month limit.</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-amber-300 bg-amber-50/40 shadow-2xs space-y-1">
                    <div className="text-[10px] font-bold text-amber-800 uppercase">Step 4 • Active</div>
                    <div className="font-bold text-slate-900">Sec 23/38 Possession</div>
                    <div className="text-[11px] text-slate-600">60-day possession window running. Final 20% balance queued in PFMS.</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">Want to view cadastral boundary on GIS map?</span>
                    <span className="text-slate-500 text-[11px]">Open interactive cadastral GIS viewer with project alignment overlay.</span>
                  </div>
                  <Link
                    href={`/gis?project=${parcelData.projectId}&parcel=103-10`}
                    className="px-4 py-2 rounded-lg font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors shrink-0"
                  >
                    View on GIS Map →
                  </Link>
                </div>
              </div>
            )}

            {/* TAB 2: COMPENSATION PASSBOOK */}
            {activeTab === 'COMPENSATION' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="text-xs text-slate-600 font-medium">Total Statutory Award (Form-H)</div>
                    <div className="text-2xl font-black text-[#0C5A37] mt-1">
                      ₹{(parcelData.compensation.grandTotalAward / 100000).toFixed(2)} Lakhs
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">As per RFCTLARR First Schedule</div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-xs text-slate-600 font-medium">Disbursed via DBT (80%)</div>
                    <div className="text-2xl font-black text-blue-700 mt-1">
                      ₹{(parcelData.compensation.disbursedAmount / 100000).toFixed(2)} Lakhs
                    </div>
                    <div className="text-[11px] text-blue-800 mt-0.5 font-mono">UTR: {parcelData.compensation.utrNumber}</div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="text-xs text-slate-600 font-medium">Pending Final Balance (20%)</div>
                    <div className="text-2xl font-black text-amber-700 mt-1">
                      ₹{(parcelData.compensation.pendingAmount / 100000).toFixed(2)} Lakhs
                    </div>
                    <div className="text-[11px] text-amber-800 mt-0.5">Payable upon vacating under Sec 38</div>
                  </div>
                </div>

                {/* Calculation Breakdown Table */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Statutory Valuation Breakdown Sheet (RFCTLARR 2013 First Schedule)
                  </div>
                  <table className="w-full text-xs text-left">
                    <thead className="text-slate-500 border-b border-slate-200 font-bold">
                      <tr>
                        <th className="py-2">Statutory Component</th>
                        <th className="py-2">Legal Provision</th>
                        <th className="py-2 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-2 font-medium">Base Circle Rate / Sale Deeds Mean</td>
                        <td className="py-2 text-slate-500">Section 26(1)</td>
                        <td className="py-2 text-right font-mono">₹{parcelData.compensation.baseMarketValue.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Rural Distance Multiplier Factor (1.25x)</td>
                        <td className="py-2 text-slate-500">Section 26(2) First Schedule</td>
                        <td className="py-2 text-right font-mono">₹{parcelData.compensation.adjustedValue.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Assets attached to Land (Borewell + Fruit Trees)</td>
                        <td className="py-2 text-slate-500">Section 29 (Valuer Report)</td>
                        <td className="py-2 text-right font-mono">₹{parcelData.compensation.assetsValue.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-bold text-emerald-800">Solatium (100% of Total Market Value)</td>
                        <td className="py-2 text-slate-500">Section 30(1) Mandatory 100%</td>
                        <td className="py-2 text-right font-mono font-bold text-emerald-800">
                          ₹{parcelData.compensation.solatium100Pct.toLocaleString()}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 font-medium">Statutory Additional Interest (12% per annum)</td>
                        <td className="py-2 text-slate-500">Section 30(3) from Sec 11 date</td>
                        <td className="py-2 text-right font-mono">₹{parcelData.compensation.interest12Pct.toLocaleString()}</td>
                      </tr>
                      <tr className="bg-emerald-100/60 font-black text-slate-900">
                        <td className="py-2.5 px-2">Grand Total Award Decreed</td>
                        <td className="py-2.5 px-2">Section 23 Official Award</td>
                        <td className="py-2.5 px-2 text-right font-mono text-sm text-[#0C5A37]">
                          ₹{parcelData.compensation.grandTotalAward.toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-blue-900">
                    💳 Payment Mode: <strong>PFMS Direct Benefit Transfer (DBT)</strong> to Aadhaar Seeded Account.
                  </span>
                  <span className="font-mono text-[11px] font-bold text-blue-700">Bank Ref: 202602189421</span>
                </div>
              </div>
            )}

            {/* TAB 3: R&R ENTITLEMENTS */}
            {activeTab === 'RR' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Rehabilitation & Resettlement Card (RFCTLARR Act 2013 Second Schedule)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="text-slate-500">R&R Family Dossier No.</div>
                      <div className="font-bold text-slate-900">{parcelData.rrEntitlements.affectedFamilyCardNo}</div>
                      <div className="text-[11px] text-emerald-700 font-semibold">{parcelData.rrEntitlements.category}</div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="text-slate-500">One-Time Resettlement Allowance</div>
                      <div className="font-bold text-emerald-800 text-base">₹{parcelData.rrEntitlements.oneTimeLumpSumSubsidy.toLocaleString()}</div>
                      <div className="text-[11px] text-slate-500">{parcelData.rrEntitlements.subsidyStatus}</div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="text-slate-500">Monthly Subsistence Allowance</div>
                      <div className="font-bold text-slate-900">₹{parcelData.rrEntitlements.monthlyAnnuity}/month</div>
                      <div className="text-[11px] text-slate-500">Guaranteed for 12 months under Item 4 Second Schedule</div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="text-slate-500">Allotted Resettlement Plot</div>
                      <div className="font-bold text-slate-900">{parcelData.rrEntitlements.resettlementHousingSite}</div>
                      <div className="text-[11px] text-slate-500">+ ₹{parcelData.rrEntitlements.housingGrant.toLocaleString()} Construction Grant</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: OFFICIAL NOTICES */}
            {activeTab === 'DOCS' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Gazette Notifications & Official Documents Service
                </div>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {parcelData.notices.map((not) => (
                    <div key={not.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900">{not.title}</div>
                        <div className="text-slate-500 text-[11px]">
                          Ref: <span className="font-mono">{not.gazetteNo}</span> • Published: {not.date}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`Downloading verified copy of: ${not.title}`)}
                        className="px-3 py-1.5 rounded-lg font-bold text-[#0C5A37] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                      >
                        Download PDF ↓
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: SECTION 15 OBJECTION / GRIEVANCE FORM */}
            {activeTab === 'GRIEVANCE' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0B2540]">
                      {isHindi ? 'सांविधिक आपत्ति दर्ज करें (धारा १५ / धारा ६४)' : 'File Statutory Landowner Objection (Section 15 / 64)'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Submit an official objection regarding land measurement, area, valuation, or omitted fruit trees / assets directly to the Competent Land Acquisition Authority (CALA).
                    </p>
                  </div>

                  {submittedTicket && (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <span>✓</span>
                        <span>Objection Registered Successfully!</span>
                      </div>
                      <p className="text-emerald-800">
                        Acknowledgement Slip Tracking Number: <strong>{submittedTicket}</strong>. The Competent Authority has been notified to schedule a personal hearing as required by RFCTLARR Act 2013.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleGrievanceSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Complainant / Landowner Name *</label>
                        <input
                          type="text"
                          required
                          value={grievanceName}
                          onChange={(e) => setGrievanceName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0C5A37]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Contact Mobile (for SMS notices) *</label>
                        <input
                          type="text"
                          required
                          value={grievancePhone}
                          onChange={(e) => setGrievancePhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0C5A37]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Category of Objection *</label>
                      <select
                        value={grievanceCategory}
                        onChange={(e) => setGrievanceCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#0C5A37]"
                      >
                        <option value="COMPENSATION_DISPUTE">Valuation & Compensation Inadequacy (Sec 15/64)</option>
                        <option value="MEASUREMENT_ERROR">Cadastral Boundary / Area Error</option>
                        <option value="TITLE_DISPUTE">Inheritance / Mutation & Title Apportionment</option>
                        <option value="RR_BENEFIT">R&R Second Schedule Entitlement Omission</option>
                        <option value="PROCEDURAL">Statutory Notice Non-Service</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Specific Grounds of Objection *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="State specific survey boundaries, omitted trees, standing structures, or sale deeds supporting higher valuation..."
                        value={grievanceDescription}
                        onChange={(e) => setGrievanceDescription(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0C5A37]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingGrievance}
                      className="px-5 py-2.5 rounded-xl font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors disabled:opacity-50"
                    >
                      {isSubmittingGrievance ? 'Transmitting to CALA...' : 'Submit Statutory Objection (Sec 15) →'}
                    </button>
                  </form>
                </div>

                {/* Grievance Tracking List */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Recent Objections & Grievances in this Project
                  </div>
                  <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {grievances.map((g) => (
                      <div key={g.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-[#0C5A37]">{g.ticketNumber}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              {g.status}
                            </span>
                            <span className="text-slate-500">Survey #{g.surveyNo} ({g.village})</span>
                          </div>
                          <div className="font-semibold text-slate-800">{g.categoryLabel}</div>
                          <p className="text-slate-600 text-[11px] line-clamp-1">{g.description}</p>
                        </div>
                        <div className="text-right text-[11px] text-slate-500 shrink-0">
                          <div>Assigned: {g.assignedOfficer}</div>
                          {g.hearingDate && <div className="text-[#0C5A37] font-bold">Hearing: {g.hearingDate}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
