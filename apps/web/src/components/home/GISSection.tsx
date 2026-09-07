'use client';

import React, { useState } from 'react';

interface AcquisitionParcelDetail {
  id: string;
  surveyNo: string;
  projectName: string;
  projectId: string;
  stage: string;
  owner: string;
  totalArea: string;
  acquiredArea: string;
  classification: string;
  compensationAssessed: string;
  compensationStatus: 'Disbursed (100%)' | 'Partially Paid (80%)' | 'Award In Calculation' | 'Hearing Pending';
  rrStatus: string;
  possessionStatus: 'Possession Taken' | 'Handover Scheduled' | 'Pending Compensation' | 'Pending R&R';
  coordinates: string;
  gazetteNotice: string;
  color: string;
}

const DEMO_PARCELS: Record<string, AcquisitionParcelDetail> = {
  '103-10': {
    id: '103-10',
    surveyNo: '103/10',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    projectId: 'DOLR-2026-0084',
    stage: '05 - Section 15 Objection Hearing Completed',
    owner: 'Shri Ramchandra Patil & 2 Co-Sharers',
    totalArea: '1.42 Hectares (3.51 Acres)',
    acquiredArea: '0.95 Hectares (2.35 Acres)',
    classification: 'Irrigated Agricultural (Double Crop)',
    compensationAssessed: '₹48.50 Lakhs (incl. 100% Solatium & Multiplier)',
    compensationStatus: 'Partially Paid (80%)',
    rrStatus: 'Eligible: Resettlement Plot #24 Allocated',
    possessionStatus: 'Pending Compensation',
    coordinates: '22°18\'42.1"N, 73°11\'24.8"E',
    gazetteNotice: 'Gazette Extra. No. 512/2026-DoLR',
    color: '#F59E0B', // Amber
  },
  '102-1A': {
    id: '102-1A',
    surveyNo: '102/1A',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    projectId: 'DOLR-2026-0084',
    stage: '04 - Section 11(1) Preliminary Notified',
    owner: 'Smt. Kamlaben Rathod',
    totalArea: '0.88 Hectares (2.17 Acres)',
    acquiredArea: '0.88 Hectares (Full Acquisition)',
    classification: 'Agricultural (Dry Crop)',
    compensationAssessed: '₹32.40 Lakhs (Draft Estimate)',
    compensationStatus: 'Hearing Pending',
    rrStatus: 'Alternative Housing Subsistence Grant Applied',
    possessionStatus: 'Pending Compensation',
    coordinates: '22°18\'45.6"N, 73°11\'29.2"E',
    gazetteNotice: 'Gazette Extra. No. 512/2026-DoLR',
    color: '#EF4444', // Red
  },
  '104-B': {
    id: '104-B',
    surveyNo: '104/B',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    projectId: 'DOLR-2026-0084',
    stage: '06 - Compensation Disbursed (Direct Transfer)',
    owner: 'Shri Govindbhai Solanki',
    totalArea: '2.10 Hectares (5.19 Acres)',
    acquiredArea: '1.15 Hectares (2.84 Acres)',
    classification: 'Agricultural with Tube Well & Orchards',
    compensationAssessed: '₹76.80 Lakhs (Assets Valued)',
    compensationStatus: 'Disbursed (100%)',
    rrStatus: 'Self-Relocation Grant Sanctioned',
    possessionStatus: 'Handover Scheduled',
    coordinates: '22°18\'39.4"N, 73°11\'21.3"E',
    gazetteNotice: 'Gazette Extra. No. 512/2026-DoLR',
    color: '#3B82F6', // Blue
  },
  '105-C': {
    id: '105-C',
    surveyNo: '105/C',
    projectName: 'NH-48 Bharatmala Six-Laning Corridor',
    projectId: 'DOLR-2026-0084',
    stage: '08 - Section 38 Possession Completed',
    owner: 'Gram Panchayat Common Grazing Land',
    totalArea: '4.60 Hectares (11.36 Acres)',
    acquiredArea: '2.40 Hectares (5.93 Acres)',
    classification: 'Community Gauchar Land',
    compensationAssessed: '₹112.00 Lakhs (Panchayat Escrow)',
    compensationStatus: 'Disbursed (100%)',
    rrStatus: 'Compensatory Grazing Land Allotted in Village 043',
    possessionStatus: 'Possession Taken',
    coordinates: '22°18\'35.0"N, 73°11\'15.0"E',
    gazetteNotice: 'Gazette Extra. No. 512/2026-DoLR',
    color: '#10B981', // Green
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

            {/* Selected Parcel Acquisition Dossier */}
            {selectedParcel && (
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-2 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedParcel.color }} />
                    <span className="font-extrabold text-emerald-950 text-xs">
                      Parcel #{selectedParcel.surveyNo}
                    </span>
                  </div>
                  <span className="text-[9.5px] font-mono font-bold bg-white text-emerald-900 px-1.5 py-0.5 rounded border border-emerald-200">
                    {selectedParcel.projectId}
                  </span>
                </div>

                <div className="space-y-1 text-slate-700 text-[11px]">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Khatedar (Affected Owner):</span>
                    <span className="font-bold text-slate-900">{selectedParcel.owner}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Acquired / Total Area</span>
                      <span className="font-semibold text-slate-800">{selectedParcel.acquiredArea}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Current Stage</span>
                      <span className="font-semibold text-amber-900 line-clamp-1">{selectedParcel.stage}</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-slate-500 text-[10px] block">Assessed Compensation & Status</span>
                    <div className="font-bold text-emerald-900">{selectedParcel.compensationAssessed}</div>
                    <span className="inline-block mt-0.5 text-[9.5px] font-extrabold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                      {selectedParcel.compensationStatus}
                    </span>
                  </div>

                  <div className="pt-1">
                    <span className="text-slate-500 text-[10px] block">R&R & Possession Safeguards</span>
                    <div className="text-[10.5px] text-slate-800 font-medium">{selectedParcel.rrStatus}</div>
                    <span className="inline-block mt-0.5 text-[9.5px] font-extrabold px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded">
                      Possession: {selectedParcel.possessionStatus}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-emerald-200 flex gap-2">
                  <a
                    href="#transparency"
                    className="flex-1 text-center py-1.5 bg-[#0C5A37] hover:bg-[#084228] text-white text-[10.5px] font-bold rounded shadow-xs transition-colors"
                  >
                    View Statutory Notice ({selectedParcel.gazetteNotice.split(' ')[0]}..)
                  </a>
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
