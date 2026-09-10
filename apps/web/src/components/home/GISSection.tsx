'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface AcquisitionParcelDetail {
  id: string;
  surveyNo: string;
  projectName: string;
  projectId: string;
  village: string;
  district: string;
  state: string;
  stage: string;
  stageStep: string;
  owner: string;
  ownerPhone: string;
  coOwners: string[];
  totalArea: string;
  acquiredArea: string;
  classification: string;
  // Legal
  sec11Notice: string;
  sec19Declaration: string;
  objectionOutcome: string;
  // Financial
  compensationAssessed: string;
  solatiumAmount: string;
  interestAmount: string;
  disbursedAmount: string;
  pendingAmount: string;
  compensationStatus: 'Disbursed (100%)' | 'Partially Paid (80%)' | 'Award In Calculation' | 'Hearing Pending';
  pfmsUtr: string;
  // R&R & Possession
  affectedFamilyCount: number;
  rrStatus: string;
  resettlementColony?: string;
  possessionStatus: 'Possession Taken' | 'Handover Scheduled' | 'Pending Compensation' | 'Pending R&R';
  possessionDate?: string;
  // Audit & Documents
  coordinates: string;
  gazetteNotice: string;
  lastAuditUpdate: string;
  auditOfficer: string;
  documents: { name: string; type: string }[];
  color: string;
}

const DEMO_PARCELS: Record<string, AcquisitionParcelDetail> = {
  '103-10': {
    id: '103-10',
    surveyNo: '103/10',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    projectId: 'DOLR-2026-0084',
    village: 'Padra Village',
    district: 'Vadodara',
    state: 'Gujarat',
    stage: '05 - Section 15 Objection Hearing Completed',
    stageStep: '05',
    owner: 'Shri Ramchandra Patil',
    ownerPhone: '+91 98251 44556',
    coOwners: ['Smt. Shobhaben Patil (20%)', 'Shri Dinesh Patil (20%)'],
    totalArea: '1.42 Hectares (3.51 Acres)',
    acquiredArea: '0.95 Hectares (2.35 Acres)',
    classification: 'Irrigated Agricultural (Double Crop)',
    sec11Notice: 'Notified 05 Jul 2023 (Gazette Extra No. 512/2026-DoLR)',
    sec19Declaration: 'Draft Notified 10 Jan 2024 (Sec 19 No. 88)',
    objectionOutcome: 'Commercial multiplier appeal dismissed; 1.25x rural factor sustained.',
    compensationAssessed: '₹48.50 Lakhs (incl. 100% Solatium & Multiplier)',
    solatiumAmount: '₹17.75 Lakhs (100% Sec. 30)',
    interestAmount: '₹2.35 Lakhs (12% Sec. 30)',
    disbursedAmount: '₹38.80 Lakhs (80%)',
    pendingAmount: '₹9.70 Lakhs',
    compensationStatus: 'Partially Paid (80%)',
    pfmsUtr: 'PFMS-2026-98124501',
    affectedFamilyCount: 6,
    rrStatus: 'Eligible: Resettlement Plot #24 Allocated',
    resettlementColony: 'Vikas Nagar Resettlement Colony, Padra',
    possessionStatus: 'Pending Compensation',
    possessionDate: 'Scheduled 15 Oct 2026',
    coordinates: "22°18'42.1\"N, 73°11'24.8\"E",
    gazetteNotice: 'Gazette Extra. No. 512/2026-DoLR',
    lastAuditUpdate: '2026-09-08 14:32 IST',
    auditOfficer: 'Shri Rajesh Sharma, IAS (Collector & CALA Head)',
    documents: [
      { name: 'Sec 11 Gazette Notice', type: 'PDF' },
      { name: 'Sec 15 Hearing Order', type: 'PDF' },
      { name: 'PFMS Disbursal Advice', type: 'Slip' },
      { name: 'R&R Plot Allotment Letter', type: 'PDF' },
    ],
    color: '#F59E0B',
  },
  '102-1A': {
    id: '102-1A',
    surveyNo: '102/1A',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    projectId: 'DOLR-2026-0084',
    village: 'Padra Village',
    district: 'Vadodara',
    state: 'Gujarat',
    stage: '04 - Section 11(1) Preliminary Notified',
    stageStep: '04',
    owner: 'Smt. Kamlaben Rathod',
    ownerPhone: '+91 98252 66778',
    coOwners: ['Sole Titleholder (100%)'],
    totalArea: '0.88 Hectares (2.17 Acres)',
    acquiredArea: '0.88 Hectares (Full Acquisition)',
    classification: 'Agricultural (Dry Crop)',
    sec11Notice: 'Notified 05 Jul 2023 (Gazette Extra No. 512/2026-DoLR)',
    sec19Declaration: 'Pending Hearing Disposal',
    objectionOutcome: 'Hearing scheduled for R&R housing grant appeal under Second Schedule.',
    compensationAssessed: '₹32.40 Lakhs (Draft Estimate)',
    solatiumAmount: '₹15.62 Lakhs (100% Solatium)',
    interestAmount: '₹1.88 Lakhs (12% Sec. 30)',
    disbursedAmount: '₹0.00 Lakhs',
    pendingAmount: '₹32.40 Lakhs',
    compensationStatus: 'Hearing Pending',
    pfmsUtr: 'PFMS-HOLD-SEC15',
    affectedFamilyCount: 4,
    rrStatus: 'Alternative Housing Subsistence Grant Applied',
    resettlementColony: 'Under Review at Vikas Nagar Enclave',
    possessionStatus: 'Pending Compensation',
    possessionDate: 'Awaiting Hearing Resolution',
    coordinates: "22°18'45.6\"N, 73°11'29.2\"E",
    gazetteNotice: 'Gazette Extra. No. 512/2026-DoLR',
    lastAuditUpdate: '2026-08-20 11:15 IST',
    auditOfficer: 'Smt. Priya Meena, RAS (CALA)',
    documents: [
      { name: 'Sec 11 Gazette Notice', type: 'PDF' },
      { name: 'Sec 15 Hearing Summons', type: 'Notice' },
    ],
    color: '#EF4444',
  },
  '104-B': {
    id: '104-B',
    surveyNo: '104/B',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    projectId: 'DOLR-2026-0084',
    village: 'Karjan Gram',
    district: 'Vadodara',
    state: 'Gujarat',
    stage: '06 - Compensation Disbursed (Direct Transfer)',
    stageStep: '06',
    owner: 'Shri Govindbhai Solanki',
    ownerPhone: '+91 98253 88990',
    coOwners: ['Shri Bharat Solanki (50%)'],
    totalArea: '2.10 Hectares (5.19 Acres)',
    acquiredArea: '1.15 Hectares (2.84 Acres)',
    classification: 'Agricultural with Tube Well & Orchards',
    sec11Notice: 'Notified 05 Jul 2023 (Gazette Extra No. 512/2026-DoLR)',
    sec19Declaration: 'Published 10 Jan 2024 (Gazette Sec 19 No. 88)',
    objectionOutcome: 'Consent award executed; no dispute.',
    compensationAssessed: '₹76.80 Lakhs (Assets Valued)',
    solatiumAmount: '₹35.50 Lakhs (100% Solatium)',
    interestAmount: '₹4.60 Lakhs (12% Sec. 30)',
    disbursedAmount: '₹76.80 Lakhs (100%)',
    pendingAmount: '₹0.00 Lakhs',
    compensationStatus: 'Disbursed (100%)',
    pfmsUtr: 'PFMS-2026-98124502',
    affectedFamilyCount: 5,
    rrStatus: 'Self-Relocation Grant Sanctioned (100% Disbursed)',
    possessionStatus: 'Handover Scheduled',
    possessionDate: 'Scheduled 25 Sep 2026',
    coordinates: "22°18'39.4\"N, 73°11'21.3\"E",
    gazetteNotice: 'Gazette Extra. No. 512/2026-DoLR',
    lastAuditUpdate: '2026-04-10 16:00 IST',
    auditOfficer: 'Compensation Officer (CALA Vadodara)',
    documents: [
      { name: 'Sec 11 Gazette Notice', type: 'PDF' },
      { name: 'Sec 19 Declaration', type: 'PDF' },
      { name: 'Sec 23 Consent Award', type: 'PDF' },
      { name: 'PFMS Final Receipt', type: 'Slip' },
    ],
    color: '#3B82F6',
  },
  '105-C': {
    id: '105-C',
    surveyNo: '105/C',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    projectId: 'DOLR-2026-0084',
    village: 'Karjan Gram',
    district: 'Vadodara',
    state: 'Gujarat',
    stage: '08 - Section 38 Possession Completed',
    stageStep: '08',
    owner: 'Gram Panchayat Karjan Common Body',
    ownerPhone: '+91 98250 99881',
    coOwners: ['Gram Sabha Trustees'],
    totalArea: '4.60 Hectares (11.36 Acres)',
    acquiredArea: '2.40 Hectares (5.93 Acres)',
    classification: 'Community Gauchar Land',
    sec11Notice: 'Notified 05 Jul 2023 (Gazette Extra No. 512/2026-DoLR)',
    sec19Declaration: 'Published 10 Jan 2024 (Gazette Sec 19 No. 88)',
    objectionOutcome: 'Gram Sabha resolution consenting to compensatory grazing land.',
    compensationAssessed: '₹112.00 Lakhs (Panchayat Escrow)',
    solatiumAmount: '₹55.00 Lakhs (100% Solatium)',
    interestAmount: '₹7.00 Lakhs (12% Sec. 30)',
    disbursedAmount: '₹112.00 Lakhs (100%)',
    pendingAmount: '₹0.00 Lakhs',
    compensationStatus: 'Disbursed (100%)',
    pfmsUtr: 'PFMS-2026-PANCHAYAT-01',
    affectedFamilyCount: 0,
    rrStatus: 'Compensatory Grazing Land Allotted in Village 043 (3.0 Ha)',
    possessionStatus: 'Possession Taken',
    possessionDate: 'Possession Completed 01 Jul 2024',
    coordinates: "22°18'35.0\"N, 73°11'15.0\"E",
    gazetteNotice: 'Gazette Extra. No. 512/2026-DoLR',
    lastAuditUpdate: '2024-07-01 10:30 IST',
    auditOfficer: 'Tehsildar Karjan',
    documents: [
      { name: 'Sec 11 Gazette Notice', type: 'PDF' },
      { name: 'Gram Sabha Resolution', type: 'Resolution' },
      { name: 'Sec 38 Possession Certificate', type: 'Certificate' },
    ],
    color: '#10B981',
  },
};

export const GISSection: React.FC = () => {
  const [selectedState, setSelectedState] = useState('Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState('Vadodara');
  const [selectedProject, setSelectedProject] = useState('NH-48 Bharatmala Corridor (Pkg 4)');
  const [activeLayers, setActiveLayers] = useState({
    corridor: true,
    notified: true,
    compensated: true,
    possessed: true,
    rrZones: true,
    satellite: true,
  });
  const [selectedParcel, setSelectedParcel] = useState<AcquisitionParcelDetail>(DEMO_PARCELS['103-10']);
  const [zoomLevel, setZoomLevel] = useState(16);
  const [activeDossierTab, setActiveDossierTab] = useState<'overview' | 'legal' | 'financial' | 'rr' | 'audit'>('overview');

  // Sync with AI Assistant GIS actions & URL search params
  useEffect(() => {
    // 1. Check URL params on mount
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const projectParam = params.get('project');
      const parcelParam = params.get('parcel');

      if (projectParam) {
        if (projectParam.includes('0071') || projectParam.toLowerCase().includes('dfc')) {
          setSelectedProject('Western DFC Phase 2 Corridor');
          setSelectedState('Rajasthan');
          setSelectedDistrict('Jaipur');
        } else if (projectParam.includes('0066') || projectParam.toLowerCase().includes('pune')) {
          setSelectedProject('Pune-Nashik Rail Alignment');
          setSelectedState('Maharashtra');
          setSelectedDistrict('Pune');
        } else {
          setSelectedProject('NH-48 Bharatmala Corridor (Pkg 4)');
          setSelectedState('Gujarat');
          setSelectedDistrict('Vadodara');
        }
      }

      if (parcelParam && DEMO_PARCELS[parcelParam]) {
        setSelectedParcel(DEMO_PARCELS[parcelParam]);
        setZoomLevel(18);
      }
    }

    // 2. Listen for custom AI Assistant events
    const handleAiGisSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ parcelId?: string; projectId?: string }>;
      const pId = customEvent.detail?.parcelId;
      if (pId && DEMO_PARCELS[pId]) {
        setSelectedParcel(DEMO_PARCELS[pId]);
        setZoomLevel(18);
        const mapElem = document.getElementById('gis-map');
        if (mapElem) {
          mapElem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('bhumitra:gis:select-parcel', handleAiGisSelect);
    return () => window.removeEventListener('bhumitra:gis:select-parcel', handleAiGisSelect);
  }, []);

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <section id="gis-map" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 sm:mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
            GIS Core · Spatial Corridor Intelligence
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
            National Acquisition GIS &amp; Parcel Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Interactive multi-layered GIS tracking for national infrastructure alignments: inspect proposed Right-of-Way (RoW) buffers, Section 11 preliminary notified parcels, compensation disbursement status, and R&amp;R resettlement zones.
          </p>
        </div>

        {/* Split GIS Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 bg-[#F8FAFC] border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
          
          {/* Left Column: Acquisition Hierarchy, Layers & Parcel Dossier (4 Cols) */}
          <div className="lg:col-span-4 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-4 bg-white">
            
            {/* Project & Administrative Hierarchy */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                <span>Acquisition Hierarchy</span>
                <span className="text-[10px] text-emerald-700 font-semibold">● RFCTLARR GIS</span>
              </h3>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-[10.5px] font-semibold text-slate-600 mb-0.5">Project Alignment</label>
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium"
                  >
                    <option value="NH-48 Bharatmala Corridor (Pkg 4)">NH-48 Bharatmala Corridor (Pkg 4)</option>
                    <option value="Western DFC Phase 2 Corridor">Western DFC Phase 2 Corridor</option>
                    <option value="Pune-Nashik Rail Alignment">Pune-Nashik Rail Alignment</option>
                    <option value="Rewa Solar Park Corridor">Rewa Solar Park Corridor</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10.5px] font-semibold text-slate-600 mb-0.5">State</label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium"
                    >
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10.5px] font-semibold text-slate-600 mb-0.5">District / CALA</label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 font-medium"
                    >
                      <option value="Vadodara">Vadodara</option>
                      <option value="Bharuch">Bharuch</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Acquisition Spatial Layer Toggles */}
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                <span>Acquisition Spatial Layers</span>
                <span className="text-[10px] text-slate-400">Click to filter</span>
              </h3>
              <div className="space-y-1.5">
                {[
                  { key: 'corridor', label: 'Proposed Corridor Alignment (RoW)', color: '#F59E0B' },
                  { key: 'notified', label: 'Section 11 Notified Parcels', color: '#EF4444' },
                  { key: 'compensated', label: 'Compensation Disbursed (PFMS)', color: '#3B82F6' },
                  { key: 'possessed', label: 'Possession Completed (Sec. 38)', color: '#10B981' },
                  { key: 'rrZones', label: 'R&R Resettlement Colonies', color: '#8B5CF6' },
                  { key: 'satellite', label: 'Drone Orthomosaic & High-Res Feed', color: '#0284C7' },
                ].map((lyr) => (
                  <label
                    key={lyr.key}
                    className="flex items-center justify-between p-1.5 px-2 rounded-lg hover:bg-slate-50 border border-slate-200/60 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: lyr.color }}
                      />
                      <span className="text-slate-800 text-[11px] font-medium leading-tight">{lyr.label}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeLayers[lyr.key as keyof typeof activeLayers]}
                      onChange={() => toggleLayer(lyr.key as keyof typeof activeLayers)}
                      className="rounded text-[#138808] focus:ring-[#138808]"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Selected Parcel Comprehensive Acquisition Dossier */}
            {selectedParcel && (
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-2.5 animate-fadeIn text-xs">
                {/* Dossier Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedParcel.color }} />
                    <span className="font-extrabold text-emerald-950 text-xs sm:text-sm">
                      Parcel #{selectedParcel.surveyNo}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono font-bold bg-white text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-200">
                    {selectedParcel.projectId}
                  </span>
                </div>

                {/* Sub-tabs for Dossier View */}
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-white rounded-lg border border-emerald-200 text-[10px] font-bold text-center">
                  <button
                    type="button"
                    onClick={() => setActiveDossierTab('overview')}
                    className={`py-1 rounded transition-colors ${
                      activeDossierTab === 'overview'
                        ? 'bg-[#0C5A37] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDossierTab('legal')}
                    className={`py-1 rounded transition-colors ${
                      activeDossierTab === 'legal'
                        ? 'bg-[#0C5A37] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Legal/Award
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDossierTab('rr')}
                    className={`py-1 rounded transition-colors ${
                      activeDossierTab === 'rr'
                        ? 'bg-[#0C5A37] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    R&amp;R / Poss.
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveDossierTab('audit')}
                    className={`py-1 rounded transition-colors ${
                      activeDossierTab === 'audit'
                        ? 'bg-[#0C5A37] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Audit &amp; Docs
                  </button>
                </div>

                {/* Tab 1: Overview (Identity & Land) */}
                {activeDossierTab === 'overview' && (
                  <div className="space-y-1.5 text-slate-700 text-[11px] animate-fadeIn">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Khatedar (Affected Owner)</span>
                      <span className="font-bold text-slate-900">{selectedParcel.owner}</span>
                      <span className="text-slate-500 text-[10px] block">{selectedParcel.ownerPhone}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Village / Location</span>
                        <span className="font-semibold text-slate-800">{selectedParcel.village}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Classification</span>
                        <span className="font-semibold text-slate-800">{selectedParcel.classification}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200/60">
                      <div>
                        <span className="text-slate-500 text-[10px] block">Acquired / Total Area</span>
                        <span className="font-semibold text-slate-800">{selectedParcel.acquiredArea} / {selectedParcel.totalArea}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">Current Stage</span>
                        <span className="font-semibold text-amber-900 line-clamp-1">{selectedParcel.stage}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Legal & Award */}
                {activeDossierTab === 'legal' && (
                  <div className="space-y-1.5 text-slate-700 text-[11px] animate-fadeIn">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Section 11(1) Notice</span>
                      <span className="font-medium text-slate-900 text-[10.5px]">{selectedParcel.sec11Notice}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Section 19 Declaration</span>
                      <span className="font-medium text-slate-900 text-[10.5px]">{selectedParcel.sec19Declaration}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Section 15 Hearing Outcome</span>
                      <span className="font-medium text-slate-800 text-[10px]">{selectedParcel.objectionOutcome}</span>
                    </div>
                    <div className="pt-1 border-t border-emerald-200/60">
                      <span className="text-slate-500 text-[10px] block">Award &amp; 100% Solatium</span>
                      <div className="font-bold text-emerald-950">{selectedParcel.compensationAssessed}</div>
                      <div className="text-[10px] text-slate-600">Solatium: {selectedParcel.solatiumAmount} • {selectedParcel.interestAmount}</div>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-[9.5px] font-extrabold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                          {selectedParcel.compensationStatus}
                        </span>
                        <span className="font-mono text-[9px] text-slate-500">{selectedParcel.pfmsUtr}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: R&R & Possession */}
                {activeDossierTab === 'rr' && (
                  <div className="space-y-1.5 text-slate-700 text-[11px] animate-fadeIn">
                    <div>
                      <span className="text-slate-500 text-[10px] block">R&amp;R Safeguards Status</span>
                      <div className="font-semibold text-slate-900">{selectedParcel.rrStatus}</div>
                      {selectedParcel.resettlementColony && (
                        <div className="text-[10px] text-slate-600 mt-0.5">Colony: {selectedParcel.resettlementColony}</div>
                      )}
                    </div>
                    <div className="pt-1 border-t border-emerald-200/60">
                      <span className="text-slate-500 text-[10px] block">Section 38 Possession Status</span>
                      <span className="inline-block mt-0.5 text-[10px] font-extrabold px-1.5 py-0.5 bg-slate-200 text-slate-800 rounded">
                        {selectedParcel.possessionStatus}
                      </span>
                      {selectedParcel.possessionDate && (
                        <div className="text-[10px] text-slate-600 mt-0.5">{selectedParcel.possessionDate}</div>
                      )}
                      <div className="text-[9.5px] text-slate-500 italic mt-1">
                        * Under Sec. 38, possession is strictly restricted until 100% compensation award deposit and R&amp;R passbook execution.
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Audit & Documents */}
                {activeDossierTab === 'audit' && (
                  <div className="space-y-1.5 text-slate-700 text-[11px] animate-fadeIn">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Last Official Update</span>
                      <span className="font-mono font-bold text-slate-900 text-[10.5px]">{selectedParcel.lastAuditUpdate}</span>
                      <span className="text-slate-600 text-[10px] block">By: {selectedParcel.auditOfficer}</span>
                    </div>
                    <div className="pt-1 border-t border-emerald-200/60 space-y-1">
                      <span className="text-slate-500 text-[10px] block font-bold">Attached Statutory Records:</span>
                      {selectedParcel.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[10px] bg-white p-1 rounded border border-emerald-200">
                          <span className="font-medium text-slate-800">{doc.name}</span>
                          <span className="font-mono text-emerald-800 font-bold">{doc.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cross-Link to Project Lifecycle */}
                <div className="pt-2 border-t border-emerald-200 flex flex-col gap-1.5">
                  <Link
                    href={`/lifecycle?project=${selectedParcel.projectId}&stage=${selectedParcel.stageStep}`}
                    className="w-full text-center py-1.5 bg-[#0C5A37] hover:bg-[#084228] text-white text-[11px] font-bold rounded-lg shadow-xs transition-colors"
                  >
                    View in Acquisition Lifecycle (Stage {selectedParcel.stageStep}) →
                  </Link>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Interactive Map Canvas (8 Cols) */}
          <div className="lg:col-span-8 relative bg-slate-950 min-h-[460px] lg:min-h-[580px] overflow-hidden flex flex-col justify-between p-4 sm:p-5">
            
            {/* Satellite Background Layer with Cadastral Vector Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
              style={{
                backgroundImage: "url('/assets/bhumitra-hero-backdrop.jpg')",
                opacity: activeLayers.satellite ? 0.38 : 0.08,
              }}
            />

            {/* Top Canvas Telemetry Bar */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-white text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-[11px] sm:text-xs">
                  {selectedProject}
                </span>
                <span className="hidden sm:inline text-slate-400 text-[10px]">
                  • WGS-84 / UTM Datum
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(z + 1, 20))}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold"
                  title="Zoom In"
                >
                  +
                </button>
                <span className="text-slate-400 font-mono px-1">Z:{zoomLevel}</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
                  className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold"
                  title="Zoom Out"
                >
                  -
                </button>
              </div>
            </div>

            {/* Center Canvas: Interactive SVG Cadastral Corridor Overlay */}
            <div className="relative z-10 my-auto flex items-center justify-center py-6">
              <svg
                viewBox="0 0 700 380"
                className="w-full max-w-[660px] h-auto drop-shadow-2xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Proposed Linear Corridor Alignment Buffer (Right of Way) */}
                {activeLayers.corridor && (
                  <path
                    d="M 20 180 Q 240 120, 480 200 T 680 160"
                    stroke="#F59E0B"
                    strokeWidth="48"
                    strokeOpacity="0.22"
                    fill="none"
                    strokeLinecap="round"
                  />
                )}

                {/* Proposed Center Line */}
                {activeLayers.corridor && (
                  <path
                    d="M 20 180 Q 240 120, 480 200 T 680 160"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    fill="none"
                  />
                )}

                {/* Parcel 103/10 (Sec 11 Notified) */}
                {activeLayers.notified && (
                  <g
                    className="cursor-pointer group"
                    onClick={() => setSelectedParcel(DEMO_PARCELS['103-10'])}
                  >
                    <polygon
                      points="200,110 320,130 310,210 180,185"
                      fill="#F59E0B"
                      fillOpacity={selectedParcel.id === '103-10' ? '0.65' : '0.40'}
                      stroke={selectedParcel.id === '103-10' ? '#FFFFFF' : '#F59E0B'}
                      strokeWidth={selectedParcel.id === '103-10' ? '3' : '1.5'}
                      className="transition-all duration-200 group-hover:fill-opacity-70"
                    />
                    <text x="240" y="160" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                      #103/10
                    </text>
                    <text x="240" y="174" fill="#FEF3C7" fontSize="9" textAnchor="middle">
                      Sec 11 Notified
                    </text>
                  </g>
                )}

                {/* Parcel 102/1A (Critical Sec 11 Hearing Pending) */}
                {activeLayers.notified && (
                  <g
                    className="cursor-pointer group"
                    onClick={() => setSelectedParcel(DEMO_PARCELS['102-1A'])}
                  >
                    <polygon
                      points="90,140 190,120 170,210 70,200"
                      fill="#EF4444"
                      fillOpacity={selectedParcel.id === '102-1A' ? '0.65' : '0.40'}
                      stroke={selectedParcel.id === '102-1A' ? '#FFFFFF' : '#EF4444'}
                      strokeWidth={selectedParcel.id === '102-1A' ? '3' : '1.5'}
                      className="transition-all duration-200 group-hover:fill-opacity-70"
                    />
                    <text x="130" y="165" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                      #102/1A
                    </text>
                    <text x="130" y="180" fill="#FEE2E2" fontSize="9" textAnchor="middle">
                      Hearing Pending
                    </text>
                  </g>
                )}

                {/* Parcel 104/B (Compensation Disbursed) */}
                {activeLayers.compensated && (
                  <g
                    className="cursor-pointer group"
                    onClick={() => setSelectedParcel(DEMO_PARCELS['104-B'])}
                  >
                    <polygon
                      points="330,135 450,150 440,230 320,215"
                      fill="#3B82F6"
                      fillOpacity={selectedParcel.id === '104-B' ? '0.65' : '0.40'}
                      stroke={selectedParcel.id === '104-B' ? '#FFFFFF' : '#3B82F6'}
                      strokeWidth={selectedParcel.id === '104-B' ? '3' : '1.5'}
                      className="transition-all duration-200 group-hover:fill-opacity-70"
                    />
                    <text x="380" y="175" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                      #104/B
                    </text>
                    <text x="380" y="190" fill="#DBEAFE" fontSize="9" textAnchor="middle">
                      Compensation Paid
                    </text>
                  </g>
                )}

                {/* Parcel 105/C (Possession Completed) */}
                {activeLayers.possessed && (
                  <g
                    className="cursor-pointer group"
                    onClick={() => setSelectedParcel(DEMO_PARCELS['105-C'])}
                  >
                    <polygon
                      points="460,155 580,175 570,265 450,235"
                      fill="#10B981"
                      fillOpacity={selectedParcel.id === '105-C' ? '0.65' : '0.40'}
                      stroke={selectedParcel.id === '105-C' ? '#FFFFFF' : '#10B981'}
                      strokeWidth={selectedParcel.id === '105-C' ? '3' : '1.5'}
                      className="transition-all duration-200 group-hover:fill-opacity-70"
                    />
                    <text x="515" y="205" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                      #105/C
                    </text>
                    <text x="515" y="220" fill="#D1FAE5" fontSize="9" textAnchor="middle">
                      Possession Taken
                    </text>
                  </g>
                )}

                {/* R&R Resettlement Colony Zone (Purple) */}
                {activeLayers.rrZones && (
                  <g className="cursor-pointer group">
                    <polygon
                      points="320,20 440,25 430,95 310,90"
                      fill="#8B5CF6"
                      fillOpacity="0.45"
                      stroke="#C4B5FD"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                    <text x="375" y="55" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
                      R&R Colony Plot
                    </text>
                    <text x="375" y="70" fill="#EDE9FE" fontSize="8.5" textAnchor="middle">
                      Model Resettlement Zone
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom Color-Coded Acquisition Legend */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-800 text-[10.5px] text-slate-300">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-white">Acquisition Status Legend:</span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Sec 11 Notified</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Award Declared</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Compensation Paid</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Possession Taken</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <span>R&R Colony</span>
                </span>
              </div>

              <div className="text-slate-400 italic text-[10px]">
                * Click any parcel polygon on map to inspect statutory dossier
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
