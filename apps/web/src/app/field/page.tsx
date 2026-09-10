'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { projectStore } from '../../lib/projectStore';
import { useAuth, DEFAULT_DEMO_USER } from '../../lib/authContext';

interface FieldTask {
  id: string;
  taskType: 'DEMARCATION' | 'VALUATION_INSPECTION' | 'RR_SURVEY' | 'POSSESSION_PANCHNAMA';
  title: string;
  surveyNo: string;
  village: string;
  district: string;
  projectId: string;
  projectName: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SUBMITTED';
  priority: 'high' | 'medium';
}

export default function FieldInspectionPage() {
  const { isHindi } = useLocale();
  const { user } = useAuth();
  const currentUser = user || DEFAULT_DEMO_USER;

  const [tasks, setTasks] = useState<FieldTask[]>([
    {
      id: 'TSK-2026-081',
      taskType: 'DEMARCATION',
      title: 'Joint Cadastral Ground Demarcation & Pegging',
      surveyNo: '103/10',
      village: 'Padra',
      district: 'Vadodara',
      projectId: 'DOLR-2026-0084',
      projectName: 'NH-48 Bharatmala Six-Laning Corridor',
      dueDate: 'Today, 05:00 PM',
      status: 'IN_PROGRESS',
      priority: 'high',
    },
    {
      id: 'TSK-2026-082',
      taskType: 'VALUATION_INSPECTION',
      title: 'Horticulture Asset Enumeration (Mango Trees & Borewell)',
      surveyNo: '104/B',
      village: 'Padra',
      district: 'Vadodara',
      projectId: 'DOLR-2026-0084',
      projectName: 'NH-48 Bharatmala Six-Laning Corridor',
      dueDate: 'Tomorrow, 12:00 PM',
      status: 'PENDING',
      priority: 'high',
    },
    {
      id: 'TSK-2026-079',
      taskType: 'RR_SURVEY',
      title: 'Displaced Family Livelihood Baseline Verification',
      surveyNo: '102/1A',
      village: 'Padra',
      district: 'Vadodara',
      projectId: 'DOLR-2026-0084',
      projectName: 'NH-48 Bharatmala Six-Laning Corridor',
      dueDate: 'Completed',
      status: 'SUBMITTED',
      priority: 'medium',
    },
  ]);

  const [activeTask, setActiveTask] = useState<FieldTask>(tasks[0]);
  const [gpsCaptured, setGpsCaptured] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState('22.2587° N, 73.1812° E (Accuracy: ±1.8m)');
  const [treeCount, setTreeCount] = useState('4');
  const [borewellCount, setBorewellCount] = useState('1');
  const [boundaryPegged, setBoundaryPegged] = useState(true);
  const [landownerPresent, setLandownerPresent] = useState(true);
  const [panchnamaRemarks, setPanchnamaRemarks] = useState(
    'Joint inspection completed in presence of landholder Ramesh Chandra Patel and Gram Panchayat Talati. Boundary pegs driven along centerline alignment without dispute.'
  );
  const [photosAttached, setPhotosAttached] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleCaptureGps = () => {
    // Simulated GPS capture with high precision
    setGpsCoordinates('22.2591° N, 73.1824° E (Accuracy: ±1.2m via NavIC / GPS)');
    setGpsCaptured(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Log Audit
      projectStore.logAudit({
        actorId: currentUser.id,
        actorName: currentUser.name,
        actorRole: currentUser.designation,
        action: 'FIELD_INSPECTION_SUBMITTED',
        actionLabel: 'Joint Field Panchnama Submitted',
        entityType: 'PARCEL',
        entityId: activeTask.surveyNo,
        projectId: activeTask.projectId,
        projectName: activeTask.projectName,
        remarks: `Surveyor panchnama submitted for Survey #${activeTask.surveyNo} at ${gpsCoordinates}. Boundary pegged: ${boundaryPegged ? 'Yes' : 'No'}.`,
      });

      // 2. Add Vault Document
      projectStore.uploadDocument({
        title: `Joint Field Inspection Panchnama — Survey #${activeTask.surveyNo}`,
        documentType: 'PANCHNAMA_POSSESSION',
        documentTypeLabel: 'Joint Survey Panchnama',
        projectId: activeTask.projectId,
        projectName: activeTask.projectName,
        surveyNo: activeTask.surveyNo,
        fileSize: '1.9 MB',
        checksumSha256: '7b91c841e2a09f8314e12da7793b821415d4812f8910cd91283ea01874219401',
        uploadedBy: currentUser.name,
        uploadedRole: currentUser.designation,
      });

      // 3. Mark task submitted
      setTasks((prev) =>
        prev.map((t) => (t.id === activeTask.id ? { ...t, status: 'SUBMITTED' } : t))
      );

      setIsSubmitting(false);
      setSubmissionSuccess(true);
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-5">
        
        {/* Mobile Header & Officer Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-0.5">
              <Link href="/" className="hover:text-slate-800 transition-colors">
                {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#0C5A37] font-bold">
                {isHindi ? 'क्षेत्रीय सर्वेक्षण एवं मौका पंचनामा' : 'Mobile Field Surveyor Module'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0B2540] tracking-tight">
              {isHindi ? 'राजस्व निरीक्षक / अमीन क्षेत्रीय कार्यस्थल' : 'Field Surveyor & Demarcation Console'}
            </h1>
            <div className="text-xs text-slate-600 flex items-center gap-2 mt-0.5">
              <span>Surveyor: <strong>{currentUser.name}</strong> ({currentUser.designation})</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">Jurisdiction: {currentUser.jurisdiction}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#0C5A37] text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NavIC / GPS Online</span>
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
              Offline Sync Ready
            </span>
          </div>
        </div>

        {/* Task Selection Bar */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {isHindi ? 'आज के आवंटित कार्य' : 'Assigned Inspection Tasks for Today'}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {tasks.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => {
                  setActiveTask(task);
                  setSubmissionSuccess(false);
                }}
                className={`text-left p-3.5 rounded-xl border transition-all ${
                  activeTask.id === task.id
                    ? 'border-[#0C5A37] bg-white ring-2 ring-[#0C5A37] shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-mono text-[10.5px] font-bold text-slate-500">{task.id}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      task.status === 'SUBMITTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 line-clamp-1">{task.title}</div>
                <div className="text-[11px] text-[#0C5A37] font-semibold mt-1">
                  Survey #{task.surveyNo} • {task.village}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Success Banner */}
        {submissionSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-center space-y-2 animate-fadeIn">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 font-black rounded-full flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <h3 className="text-base font-bold text-emerald-950">
              Joint Panchnama Submitted to Collectorate!
            </h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Ground demarcation report for <strong>Survey #{activeTask.surveyNo}</strong> has been sealed with geo-coordinates and signed into the National Document Vault.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Link
                href={`/gis?project=${activeTask.projectId}&parcel=103-10`}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors"
              >
                View on Cadastral GIS →
              </Link>
            </div>
          </div>
        )}

        {/* Active Inspection Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
            <div>
              <span className="text-[10.5px] font-bold text-[#0C5A37] uppercase tracking-wider">
                Active Ground Task
              </span>
              <h2 className="text-lg font-black text-[#0B2540]">{activeTask.title}</h2>
              <div className="text-xs text-slate-500 font-medium">
                Survey #{activeTask.surveyNo} • {activeTask.village} • Project: {activeTask.projectName}
              </div>
            </div>

            <Link
              href={`/gis?project=${activeTask.projectId}&parcel=103-10`}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0C5A37] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shrink-0 text-center"
            >
              Open Cadastral Map 🗺️
            </Link>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
            {/* Geo-tagging / Location Block */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  1. Geo-Tag & NavIC Coordinates
                </span>
                <button
                  type="button"
                  onClick={handleCaptureGps}
                  className="px-3 py-1 rounded-lg font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors text-[11px] flex items-center gap-1"
                >
                  <span>📍</span>
                  <span>{gpsCaptured ? 'Refresh Coordinates' : 'Capture Ground GPS'}</span>
                </button>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 flex items-center justify-between">
                <span>{gpsCoordinates}</span>
                <span className="text-emerald-600 font-bold text-[10px]">VERIFIED SATELLITE LOCK</span>
              </div>
            </div>

            {/* Demarcation Checklist */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                2. Boundary & Presence Verification
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={boundaryPegged}
                    onChange={(e) => setBoundaryPegged(e.target.checked)}
                    className="rounded text-[#0C5A37] focus:ring-[#0C5A37]"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Boundary Pegs Placed</div>
                    <div className="text-[10px] text-slate-500">Centerline & RoW boundary stones installed</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={landownerPresent}
                    onChange={(e) => setLandownerPresent(e.target.checked)}
                    className="rounded text-[#0C5A37] focus:ring-[#0C5A37]"
                  />
                  <div>
                    <div className="font-bold text-slate-900">Landowner / Representative Present</div>
                    <div className="text-[10px] text-slate-500">Ramesh Chandra Patel verified in-person</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Assets on Land Enumeration */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                3. Standing Assets Enumeration (Section 29)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Fruit / Timber Trees</label>
                  <input
                    type="number"
                    value={treeCount}
                    onChange={(e) => setTreeCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Wells / Borewells</label>
                  <input
                    type="number"
                    value={borewellCount}
                    onChange={(e) => setBorewellCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold">Permanent Structures</label>
                  <input
                    type="number"
                    defaultValue="0"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Photo Evidence & Remarks */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  4. Photo Evidence & Panchnama Text
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">
                  📷 {photosAttached} Geo-Tagged Photos Captured
                </span>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold">
                  Field Inspector Remarks / Spot Observations
                </label>
                <textarea
                  rows={3}
                  value={panchnamaRemarks}
                  onChange={(e) => setPanchnamaRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#0C5A37]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? 'Sealing & Transmitting Panchnama...' : 'Submit Joint Panchnama (Form-J) →'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <InstitutionalFooter />
    </div>
  );
}
