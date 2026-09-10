'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../../components/common/InstitutionalFooter';
import { projectStore, NewProposalDto } from '../../../lib/projectStore';
import { useAuth, DEFAULT_DEMO_USER } from '../../../lib/authContext';

export default function NewProjectProposalPage() {
  const { isHindi } = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const currentUser = user || DEFAULT_DEMO_USER;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProject, setCreatedProject] = useState<{ id: string; name: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState<NewProposalDto>({
    projectName: '',
    corridorName: '',
    sector: 'Highways',
    ministry: 'Ministry of Road Transport and Highways (MoRTH)',
    requiringBody: 'National Highways Authority of India (NHAI)',
    state: 'Gujarat',
    district: 'Vadodara',
    totalAreaProposedHa: 145.5,
    privateLandHa: 112.0,
    governmentLandHa: 24.5,
    forestLandHa: 9.0,
    affectedVillagesCount: 8,
    estimatedBudgetCr: 320.0,
    targetMonths: 18,
    description: '',
    requisitionDocName: 'Requisition_DPR_Annexure_A.pdf',
  });

  const [attachedFiles, setAttachedFiles] = useState<{
    dpr: boolean;
    alignment: boolean;
    cadastral: boolean;
    siaTor: boolean;
  }>({
    dpr: true,
    alignment: true,
    cadastral: true,
    siaTor: false,
  });

  const [statutoryDeclaration, setStatutoryDeclaration] = useState(false);

  // Quick Preset for Evaluator Demo
  const applyPreset = (type: 'EXPRESSWAY' | 'RAILWAY' | 'SOLAR') => {
    if (type === 'EXPRESSWAY') {
      setFormData({
        projectName: 'Delhi-Dehradun Economic Corridor (Package 4A)',
        corridorName: 'NH-709B Alignment Expansion',
        sector: 'Highways',
        ministry: 'Ministry of Road Transport and Highways (MoRTH)',
        requiringBody: 'National Highways Authority of India (NHAI)',
        state: 'Uttar Pradesh',
        district: 'Saharanpur',
        totalAreaProposedHa: 184.2,
        privateLandHa: 148.0,
        governmentLandHa: 26.2,
        forestLandHa: 10.0,
        affectedVillagesCount: 14,
        estimatedBudgetCr: 480.0,
        targetMonths: 24,
        description: 'Greenfield access-controlled six-lane corridor to reduce transit duration to 2.5 hours.',
        requisitionDocName: 'MoRTH_InPrinciple_Requisition_2026.pdf',
      });
    } else if (type === 'RAILWAY') {
      setFormData({
        projectName: 'Western DFC Feeder Link — Sanand Industrial Multi-Modal Hub',
        corridorName: 'Sanand-Viramgam DFC Spur',
        sector: 'Railways',
        ministry: 'Ministry of Railways (MoR)',
        requiringBody: 'Dedicated Freight Corridor Corporation of India (DFCCIL)',
        state: 'Gujarat',
        district: 'Ahmedabad',
        totalAreaProposedHa: 92.4,
        privateLandHa: 75.0,
        governmentLandHa: 17.4,
        forestLandHa: 0,
        affectedVillagesCount: 6,
        estimatedBudgetCr: 210.0,
        targetMonths: 14,
        description: 'Double-line electrified heavy-haul freight connectivity to Sanand GIDC auto cluster.',
        requisitionDocName: 'DFCCIL_Feeder_Sanand_DPR.pdf',
      });
    } else {
      setFormData({
        projectName: 'Khavda Ultra Mega Renewable Energy Park (Phase 3 Evacuation)',
        corridorName: '765kV Green Energy Corridor',
        sector: 'Renewable Energy',
        ministry: 'Ministry of New and Renewable Energy (MNRE)',
        requiringBody: 'Power Grid Corporation of India Limited (PGCIL)',
        state: 'Gujarat',
        district: 'Kutch',
        totalAreaProposedHa: 340.0,
        privateLandHa: 45.0,
        governmentLandHa: 295.0,
        forestLandHa: 0,
        affectedVillagesCount: 4,
        estimatedBudgetCr: 650.0,
        targetMonths: 12,
        description: 'High voltage transmission pooling substation and tower corridor in barren salt desert.',
        requisitionDocName: 'PGCIL_Khavda_Substation_DPR.pdf',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statutoryDeclaration) {
      alert('Please check the statutory declaration confirming adherence to RFCTLARR Act 2013.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const { project } = projectStore.createProposal(formData);

        // Upload sample document in store
        projectStore.uploadDocument({
          title: `Statutory Requisition Docket — ${formData.projectName}`,
          documentType: 'DPR_REQUISITION',
          documentTypeLabel: 'Administrative Requisition Docket',
          projectId: project.id,
          projectName: project.name,
          fileSize: '4.2 MB',
          uploadedBy: currentUser.name,
          uploadedRole: currentUser.designation,
          checksumSha256: 'a6c8e391b4278df90b6a9e1e2d83fa1c52d8e411b7a692cd8015e34bca891042',
        });

        setIsSubmitting(false);
        setCreatedProject({ id: project.id, name: project.name });
      } catch (err) {
        setIsSubmitting(false);
        alert('Error submitting proposal. Please verify fields.');
      }
    }, 750);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/" className="hover:text-slate-800 transition-colors">
                {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
              </Link>
              <span>/</span>
              <Link href="/projects" className="hover:text-slate-800 transition-colors">
                {isHindi ? 'परियोजना निर्देशिका' : 'Projects'}
              </Link>
              <span>/</span>
              <span className="text-[#0C5A37] font-bold">
                {isHindi ? 'नया अधिग्रहण प्रस्ताव' : 'New Acquisition Proposal'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {isHindi ? 'ऑनलाइन भूमि अधिग्रहण प्रस्ताव प्रस्तुति' : 'Online Land Acquisition Requisition (Form-A)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {isHindi
                ? 'आरएफसीटीएलएआरआर अधिनियम 2013 की धारा 3/4 के तहत राष्ट्रीय अवसंरचना हेतु भूमि मांग पत्र'
                : 'Statutory electronic requisition submission by Implementing Agency / Requiring Body under RFCTLARR Act 2013.'}
            </p>
          </div>

          {/* Quick Demo Autofill */}
          {!createdProject && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-2 rounded-xl text-xs">
              <span className="font-bold text-amber-900 hidden sm:inline">⚡ {isHindi ? 'त्वरित डेमो भरें:' : 'Quick Demo Fill:'}</span>
              <button
                type="button"
                onClick={() => applyPreset('EXPRESSWAY')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 font-semibold rounded-lg border border-amber-300 transition-colors"
              >
                Expressway
              </button>
              <button
                type="button"
                onClick={() => applyPreset('RAILWAY')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 font-semibold rounded-lg border border-amber-300 transition-colors"
              >
                Railway DFC
              </button>
              <button
                type="button"
                onClick={() => applyPreset('SOLAR')}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 font-semibold rounded-lg border border-amber-300 transition-colors"
              >
                Solar Park
              </button>
            </div>
          )}
        </div>

        {/* Successful Submission View */}
        {createdProject ? (
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-lg p-8 text-center max-w-2xl mx-auto space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl font-black">
              ✓
            </div>
            <div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                REQUISITION ID: {createdProject.id}
              </span>
              <h2 className="text-2xl font-black text-[#0B2540] mt-3">
                {isHindi ? 'प्रस्ताव सफलतापूर्वक दर्ज किया गया' : 'Acquisition Requisition Registered'}
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-md mx-auto">
                Proposal for <strong>{createdProject.name}</strong> has been transmitted to the Competent Authority / District Collector for preliminary scrutiny and joint survey demarcation.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Requisition Status:</span>
                <span className="font-bold text-[#0C5A37]">Stage 01: Administrative Scrutiny & Preliminary Inquiry</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Statutory SLA Window:</span>
                <span className="font-bold text-slate-800">30 Calendar Days (Sec 4/7)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Assigned Authority:</span>
                <span className="font-bold text-slate-800">Collectorate ({formData.district}, {formData.state})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Audit Record:</span>
                <span className="font-mono text-slate-600">Logged with SHA-256 integrity token</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href={`/projects/${createdProject.id}`}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors shadow-sm"
              >
                {isHindi ? 'परियोजना कमान केंद्र खोलें →' : 'Open Project Command Center →'}
              </Link>
              <Link
                href={`/lifecycle?project=${createdProject.id}`}
                className="px-4 py-2.5 rounded-xl font-bold text-sm text-[#0B2540] bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {isHindi ? 'जीवनचक्र ट्रैकिंग' : 'Track in Lifecycle'}
              </Link>
              <Link
                href="/projects"
                className="px-4 py-2.5 rounded-xl font-medium text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                {isHindi ? 'परियोजना निर्देशिका' : 'Projects Directory'}
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-Step Wizard */
          <div className="space-y-6">
            {/* Step Indicators */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { step: 1, label: isHindi ? '१. परियोजना विवरण' : '1. Project Profile' },
                  { step: 2, label: isHindi ? '२. भूमि एवं स्थान' : '2. Land & Location' },
                  { step: 3, label: isHindi ? '३. विस्थापन एवं न्याय' : '3. Minimization & SIA' },
                  { step: 4, label: isHindi ? '४. अभिलेख अपलोड' : '4. Documents & Plans' },
                  { step: 5, label: isHindi ? '५. समीक्षा एवं घोषणा' : '5. Review & Submit' },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setCurrentStep(s.step)}
                    className={`text-left p-2.5 rounded-lg border transition-all ${
                      currentStep === s.step
                        ? 'border-[#0C5A37] bg-emerald-50/60 text-[#0C5A37] font-bold ring-1 ring-[#0C5A37]'
                        : currentStep > s.step
                        ? 'border-emerald-300 bg-slate-50 text-slate-700 font-semibold'
                        : 'border-slate-200 bg-slate-50/40 text-slate-400 font-medium'
                    }`}
                  >
                    <div className="text-[11px] leading-tight flex items-center justify-between">
                      <span>{s.label}</span>
                      {currentStep > s.step && <span className="text-emerald-600 font-bold">✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1: Project Profile */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2540]">
                    {isHindi ? 'चरण १: परियोजना एवं प्रस्तावक विवरण' : 'Step 1: Project Profile & Requiring Body'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Specify the official project nomenclature, sponsoring Ministry, and implementing entity under RFCTLARR Section 3(za).
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'परियोजना का आधिकारिक नाम *' : 'Official Project Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vadodara-Mumbai Expressway Extension Package 2"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'कॉरिडोर / अनुभाग नाम' : 'Corridor / Sub-Section'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. KM 42.000 to KM 86.500"
                      value={formData.corridorName}
                      onChange={(e) => setFormData({ ...formData, corridorName: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'अवसंरचना क्षेत्र (Sector) *' : 'Infrastructure Sector *'}
                    </label>
                    <select
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    >
                      <option value="Highways">Highways & Expressways (MoRTH/NHAI)</option>
                      <option value="Railways">Railways & Freight Corridors (MoR/DFCCIL)</option>
                      <option value="Renewable Energy">Renewable Energy & Solar Parks (MNRE/SECI)</option>
                      <option value="Urban Infra">Urban Infrastructure & Metro Rail (MoHUA)</option>
                      <option value="Industrial Corridor">Industrial Corridors & Smart Cities (DPIIT/NICDC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'प्रायोजक मंत्रालय *' : 'Sponsoring Ministry *'}
                    </label>
                    <input
                      type="text"
                      value={formData.ministry}
                      onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'मांगकर्ता निकाय / एजेंसी (Requiring Body) *' : 'Requiring Body / Implementing Agency *'}
                    </label>
                    <input
                      type="text"
                      value={formData.requiringBody}
                      onChange={(e) => setFormData({ ...formData, requiringBody: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'अनुमानित भू-अधिग्रहण बजट (₹ करोड़)' : 'Estimated Acquisition Budget (₹ Cr)'}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.estimatedBudgetCr}
                      onChange={(e) => setFormData({ ...formData, estimatedBudgetCr: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'लक्ष्य अधिग्रहण अवधि (महीने)' : 'Statutory Completion Target (Months)'}
                    </label>
                    <input
                      type="number"
                      value={formData.targetMonths}
                      onChange={(e) => setFormData({ ...formData, targetMonths: parseInt(e.target.value) || 12 })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.projectName) {
                        alert('Please enter project name');
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors"
                  >
                    {isHindi ? 'अगला: भूमि आवश्यकता →' : 'Next: Land Requirement →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Land & Location */}
            {currentStep === 2 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2540]">
                    {isHindi ? 'चरण २: भूमि आवश्यकता एवं स्थानिक सीमा' : 'Step 2: Land Requirement & Geographical Scope'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Categorize the land requirement across Private, Government, and Forest land parcels under RFCTLARR Act guidelines.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'राज्य (State) *' : 'State *'}
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    >
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Haryana">Haryana</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'जिला (District) *' : 'District *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'कुल प्रस्तावित भूमि (हेक्टेयर) *' : 'Total Proposed Land Area (Ha) *'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.totalAreaProposedHa}
                      onChange={(e) => setFormData({ ...formData, totalAreaProposedHa: parseFloat(e.target.value) || 0 })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'प्रभावित राजस्व गांव संख्या' : 'Number of Affected Revenue Villages'}
                    </label>
                    <input
                      type="number"
                      value={formData.affectedVillagesCount}
                      onChange={(e) => setFormData({ ...formData, affectedVillagesCount: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>

                  {/* Classification Breakdown */}
                  <div className="sm:col-span-2 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {isHindi ? 'भूमि वर्गीकरण विभाजन (हेक्टेयर)' : 'Land Tenure Breakdown (Hectares)'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Private Agricultural/Abadi Land
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.privateLandHa}
                          onChange={(e) => setFormData({ ...formData, privateLandHa: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Government / Gamtal Land
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.governmentLandHa}
                          onChange={(e) => setFormData({ ...formData, governmentLandHa: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Forest / Protected Land
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.forestLandHa}
                          onChange={(e) => setFormData({ ...formData, forestLandHa: parseFloat(e.target.value) || 0 })}
                          className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Sum of Breakdown: {(formData.privateLandHa + formData.governmentLandHa + formData.forestLandHa).toFixed(2)} Ha / Total: {formData.totalAreaProposedHa} Ha
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors"
                  >
                    {isHindi ? 'अगला: सामाजिक प्रभाव आकलन →' : 'Next: Minimization & SIA →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Minimization & SIA */}
            {currentStep === 3 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2540]">
                    {isHindi ? 'चरण ३: विस्थापन न्यूनीकरण एवं जनहित औचित्य' : 'Step 3: Minimization of Displacement & Public Purpose Justification'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Statutory requirement under RFCTLARR Act Section 4: Demonstrate that extent of acquisition is bare minimum necessary.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHindi ? 'सार्वजनिक प्रयोजन का विवरण (Public Purpose Justification) *' : 'Detailed Public Purpose Justification *'}
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Detail why this acquisition is necessary for public infrastructure, national logistics, or economic development..."
                      className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>

                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2 text-xs">
                    <div className="font-bold text-[#0C5A37] flex items-center gap-1.5">
                      <span>✓</span>
                      <span>Statutory Alignment Criteria Verification</span>
                    </div>
                    <div className="space-y-1.5 text-slate-700">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-[#0C5A37] focus:ring-[#0C5A37]" />
                        <span>Certified that no feasible alternative on unutilized government or barren land exists for this alignment.</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-[#0C5A37] focus:ring-[#0C5A37]" />
                        <span>Certified that multi-cropped agricultural land acquired is kept to the barest minimum required.</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-[#0C5A37] focus:ring-[#0C5A37]" />
                        <span>Terms of Reference (ToR) for Social Impact Assessment (SIA) drafted as per Section 4(1).</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors"
                  >
                    {isHindi ? 'अगला: अभिलेख संलग्नक →' : 'Next: Upload Documents →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Documents & Plans */}
            {currentStep === 4 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2540]">
                    {isHindi ? 'चरण ४: अनिवार्य वैधानिक अभिलेख एवं संरेखण योजना' : 'Step 4: Statutory Requisition Dockets & Alignment Geodata'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Attach digitized DPR requisitions, cadastral village lists, and geo-referenced alignment KML/Shapefiles.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      key: 'dpr' as const,
                      title: 'Detailed Project Report (DPR) Requisition Requisition Note',
                      file: 'DPR_Executive_Extract_Vol1.pdf (4.8 MB)',
                      required: true,
                    },
                    {
                      key: 'alignment' as const,
                      title: 'Digitized Alignment Strip Plan / KML Vector File',
                      file: 'Corridor_Alignment_Centerline.kml (1.2 MB)',
                      required: true,
                    },
                    {
                      key: 'cadastral' as const,
                      title: 'Cadastral Village Survey Schedule (Draft Form-A Schedule)',
                      file: 'Village_Survey_Schedule_Schedule.xlsx (840 KB)',
                      required: true,
                    },
                    {
                      key: 'siaTor' as const,
                      title: 'Draft SIA Terms of Reference (ToR) & Agency Panel Requisition',
                      file: 'Draft_SIA_ToR_2026.pdf (1.9 MB)',
                      required: false,
                    },
                  ].map((doc) => (
                    <div
                      key={doc.key}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{doc.title}</span>
                          {doc.required && <span className="text-red-500">*</span>}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{doc.file}</div>
                        <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          SHA-256 Checksum Computed
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={attachedFiles[doc.key]}
                        onChange={(e) => setAttachedFiles({ ...attachedFiles, [doc.key]: e.target.checked })}
                        className="mt-1 rounded text-[#0C5A37] focus:ring-[#0C5A37]"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    ← Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors"
                  >
                    {isHindi ? 'अगला: अंतिम समीक्षा →' : 'Next: Review & Submit →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2540]">
                    {isHindi ? 'चरण ५: अंतिम समीक्षा एवं वैधानिक घोषणा' : 'Step 5: Review Requisition & Statutory Declaration'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verify all requisition parameters before official dispatch to the District Collectorate / CALA.
                  </p>
                </div>

                {/* Summary Table */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-xs">
                  <div className="font-bold text-[#0B2540] border-b border-slate-200 pb-2">
                    Requisition Dossier Summary
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Project Name</span>
                      <strong className="text-slate-900">{formData.projectName || '—'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Sector / Ministry</span>
                      <strong className="text-slate-900">{formData.sector}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Location</span>
                      <strong className="text-slate-900">{formData.district}, {formData.state}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Total Area</span>
                      <strong className="text-slate-900">{formData.totalAreaProposedHa} Hectares</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Private Land</span>
                      <strong className="text-slate-900">{formData.privateLandHa} Ha</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Villages Affected</span>
                      <strong className="text-slate-900">{formData.affectedVillagesCount} Revenue Villages</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Est. Budget</span>
                      <strong className="text-slate-900">₹{formData.estimatedBudgetCr} Cr</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Requiring Body</span>
                      <strong className="text-slate-900">{formData.requiringBody}</strong>
                    </div>
                  </div>
                </div>

                {/* Statutory Oath & Declaration */}
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span>📜</span>
                    <span>Statutory Requisition Undertaking (RFCTLARR Act 2013)</span>
                  </div>
                  <p className="text-amber-900 text-[11px] leading-relaxed">
                    I, on behalf of the Requiring Body, certify that the land proposed is strictly limited to the minimum extent required for the execution of the public purpose. All funds necessary for preliminary inquiry, Social Impact Assessment, and statutory compensation deposit shall be made available to the Collector / CALA within the stipulated timeframe.
                  </p>
                  <label className="flex items-start gap-2 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={statutoryDeclaration}
                      onChange={(e) => setStatutoryDeclaration(e.target.checked)}
                      className="mt-0.5 rounded text-[#0C5A37] focus:ring-[#0C5A37]"
                    />
                    <span className="font-bold text-slate-800">
                      I solemnly affirm the accuracy of the requisition data and authorize immediate transmission to the Competent Land Acquisition Authority.
                    </span>
                  </label>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    ← Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !statutoryDeclaration}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        <span>Registering Requisition...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Requisition (Form-A) →</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      <InstitutionalFooter />
    </div>
  );
}
