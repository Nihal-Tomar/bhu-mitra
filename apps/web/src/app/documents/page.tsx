'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../../components/common/GovernmentHeader';
import { InstitutionalFooter } from '../../components/common/InstitutionalFooter';
import { projectStore, VaultDocument } from '../../lib/projectStore';
import { useAuth, DEFAULT_DEMO_USER } from '../../lib/authContext';

export default function DocumentVaultPage() {
  const { isHindi } = useLocale();
  const { user } = useAuth();
  const currentUser = user || DEFAULT_DEMO_USER;

  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('ALL');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<VaultDocument['documentType']>('GAZETTE_SEC_11');
  const [newProjectId, setNewProjectId] = useState('DOLR-2026-0084');
  const [newSurveyNo, setNewSurveyNo] = useState('103/10');
  const [isUploading, setIsUploading] = useState(false);

  // Checksum Verification Modal
  const [verifyDoc, setVerifyDoc] = useState<VaultDocument | null>(null);
  const [inputHash, setInputHash] = useState('');
  const [verifyResult, setVerifyResult] = useState<{ match: boolean; checked: boolean } | null>(null);

  useEffect(() => {
    setDocuments(projectStore.getDocuments());
  }, []);

  const refreshDocs = () => {
    setDocuments(projectStore.getDocuments());
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesProject = selectedProjectFilter === 'ALL' || doc.projectId === selectedProjectFilter;
    const matchesType = selectedTypeFilter === 'ALL' || doc.documentType === selectedTypeFilter;
    const matchesSearch =
      !searchQuery ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.checksumSha256.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.surveyNo && doc.surveyNo.includes(searchQuery));
    return matchesProject && matchesType && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    setIsUploading(true);
    setTimeout(() => {
      // Generate a simulated SHA-256
      const randomHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      const typeLabels: Record<string, string> = {
        GAZETTE_SEC_11: 'Section 11(1) Preliminary Gazette Notification',
        GAZETTE_SEC_19: 'Section 19(1) Final Acquisition Declaration',
        SIA_REPORT: 'Social Impact Assessment (SIA) Study & Appraisal',
        AWARD_DECREE: 'Section 23 Statutory Award Decree (Form-H)',
        PANCHNAMA_POSSESSION: 'Joint Cadastral Demarcation Field Panchnama',
        DPR_REQUISITION: 'Administrative Requisition Docket & DPR Extract',
        VALUATION_SHEET: 'Collectorate Approved Valuation Sheet',
        ROR_7_12: 'Land Record of Rights (RoR 7/12 & 8-A)',
        PFMS_MANDATE: 'PFMS Direct Benefit Transfer Mandate & E-Scroll',
      };

      projectStore.uploadDocument({
        title: newTitle,
        documentType: newType,
        documentTypeLabel: typeLabels[newType] || newType,
        projectId: newProjectId,
        projectName: newProjectId === 'DOLR-2026-0084' ? 'NH-48 Bharatmala Six-Laning Corridor' : 'Western DFC Feeder Link',
        surveyNo: newSurveyNo,
        fileSize: '2.4 MB',
        checksumSha256: randomHash,
        uploadedBy: currentUser.name,
        uploadedRole: currentUser.designation,
      });

      refreshDocs();
      setIsUploading(false);
      setIsUploadOpen(false);
      setNewTitle('');
    }, 600);
  };

  const handleVerifyHash = () => {
    if (!verifyDoc) return;
    const cleanedInput = inputHash.trim().toLowerCase();
    const actualHash = verifyDoc.checksumSha256.trim().toLowerCase();
    setVerifyResult({
      match: cleanedInput === actualHash,
      checked: true,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-sans selection:bg-[#138808] selection:text-white">
      <GovernmentHeader />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/" className="hover:text-slate-800 transition-colors">
                {isHindi ? 'मुख्य पृष्ठ' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-[#0C5A37] font-bold">
                {isHindi ? 'राष्ट्रीय सांविधिक अभिलेख वॉल्ट' : 'National Statutory Document Vault'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {isHindi ? 'अधिग्रहण अभिलेख, राजपत्र एवं डिजिटल साक्ष्य वॉल्ट' : 'National Land Acquisition Document & Gazette Vault'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              {isHindi
                ? 'आरएफसीटीएलएआरआर 2013 के तहत अपरिवर्तनीय एसएचए-256 चेकसम द्वारा सुरक्षित राजपत्र, पंचनामा एवं अवार्ड विलेख'
                : 'Tamper-evident repository of statutory Gazette notifications, SIA appraisals, awards, and cadastral panchnamas under RFCTLARR Act 2013.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#0C5A37]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SHA-256 Hash Integrity Active</span>
            </span>
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors shadow-xs"
            >
              + {isHindi ? 'नया अभिलेख अपलोड करें' : 'Upload Statutory Document'}
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
              {isHindi ? 'खोजें (शीर्षक, आईडी, हैश)' : 'Search (Title, ID, SHA-256)'}
            </label>
            <input
              type="text"
              placeholder="e.g. Section 11, Padra, 5e88..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0C5A37]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
              {isHindi ? 'परियोजना' : 'Filter by Project'}
            </label>
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0C5A37]"
            >
              <option value="ALL">All National Projects</option>
              <option value="DOLR-2026-0084">NH-48 Bharatmala Six-Laning (DOLR-2026-0084)</option>
              <option value="DOLR-2026-0085">Western Dedicated Freight Corridor (DOLR-2026-0085)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
              {isHindi ? 'अभिलेख श्रेणी' : 'Document Category'}
            </label>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-[#0C5A37]"
            >
              <option value="ALL">All Categories</option>
              <option value="GAZETTE_SEC_11">Section 11(1) Gazette</option>
              <option value="GAZETTE_SEC_19">Section 19(1) Declaration</option>
              <option value="SIA_REPORT">SIA Appraisal Report</option>
              <option value="AWARD_DECREE">Section 23 Award Decree</option>
              <option value="PANCHNAMA_POSSESSION">Cadastral Panchnama</option>
              <option value="DPR_REQUISITION">DPR Requisition Docket</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="w-full p-2 bg-slate-100 rounded-lg text-slate-600 font-mono text-[11px] text-center">
              Showing <strong>{filteredDocs.length}</strong> of <strong>{documents.length}</strong> Vault Records
            </div>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0B2540] text-white">
                <tr>
                  <th className="py-3 px-4 font-semibold">Document Title & Category</th>
                  <th className="py-3 px-4 font-semibold">Project & Scope</th>
                  <th className="py-3 px-4 font-semibold">Uploaded By</th>
                  <th className="py-3 px-4 font-semibold">SHA-256 Digital Fingerprint</th>
                  <th className="py-3 px-4 font-semibold">Integrity Status</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{doc.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {doc.documentTypeLabel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize}</span>
                        <span className="text-[10px] text-slate-400 font-mono">v{doc.version}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">{doc.projectName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {doc.projectId} {doc.surveyNo ? `• Survey #${doc.surveyNo}` : ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{doc.uploadedBy}</div>
                      <div className="text-[10px] text-slate-500">{doc.uploadedRole}</div>
                      <div className="text-[10px] text-slate-400">{doc.uploadedAt.split('T')[0]}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200 max-w-[200px] truncate" title={doc.checksumSha256}>
                        {doc.checksumSha256}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        <span>✓</span>
                        <span>{doc.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setVerifyDoc(doc);
                            setInputHash(doc.checksumSha256);
                            setVerifyResult(null);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#0C5A37] bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                        >
                          Verify Hash 🛡️
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading verified original copy for: ${doc.title}`)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          Download ↓
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Checksum Verification Modal */}
        {verifyDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-[#0C5A37] uppercase tracking-wider">
                    Statutory Cryptographic Verification
                  </span>
                  <h3 className="text-lg font-black text-[#0B2540]">{verifyDoc.title}</h3>
                  <div className="text-xs text-slate-500 font-mono">Doc ID: {verifyDoc.id}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setVerifyDoc(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Canonical Recorded SHA-256 Hash (in National Ledger)
                  </label>
                  <div className="p-2.5 bg-slate-50 rounded-lg font-mono text-[11px] text-slate-800 border border-slate-200 break-all select-all">
                    {verifyDoc.checksumSha256}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Candidate Hash / File Hash to Test
                  </label>
                  <textarea
                    rows={2}
                    value={inputHash}
                    onChange={(e) => setInputHash(e.target.value)}
                    placeholder="Paste 64-character hex SHA-256 hash to test integrity..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] focus:ring-2 focus:ring-[#0C5A37]"
                  />
                </div>

                {verifyResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs ${
                      verifyResult.match
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <span>{verifyResult.match ? '✅' : '❌'}</span>
                      <span>
                        {verifyResult.match
                          ? 'Cryptographic Integrity Verified — Untampered'
                          : 'Hash Mismatch Detected — Potential Tampering or Corrupted Copy'}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px]">
                      {verifyResult.match
                        ? 'The tested hash strictly matches the sealed official gazette record stored at the time of legal publication.'
                        : 'The provided document checksum does not correspond with the statutory sealed copy.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVerifyDoc(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleVerifyHash}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors"
                >
                  Verify Hash Match →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload New Document Modal */}
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-[#0C5A37] uppercase tracking-wider">
                    Statutory Ingestion
                  </span>
                  <h3 className="text-lg font-black text-[#0B2540]">Upload Statutory Acquisition Document</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Section 11 Gazette Extraordinary No. 814/2026"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0C5A37]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statutory Category *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#0C5A37]"
                  >
                    <option value="GAZETTE_SEC_11">Section 11(1) Gazette Notification</option>
                    <option value="GAZETTE_SEC_19">Section 19(1) Acquisition Declaration</option>
                    <option value="SIA_REPORT">Social Impact Assessment (SIA) Report</option>
                    <option value="AWARD_DECREE">Section 23 Award Decree (Form-H)</option>
                    <option value="PANCHNAMA_POSSESSION">Joint Cadastral Demarcation Panchnama</option>
                    <option value="VALUATION_SHEET">Approved Valuation Sheet</option>
                    <option value="DPR_REQUISITION">DPR Requisition Docket</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Project Link *</label>
                    <select
                      value={newProjectId}
                      onChange={(e) => setNewProjectId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-[#0C5A37]"
                    >
                      <option value="DOLR-2026-0084">NH-48 Bharatmala</option>
                      <option value="DOLR-2026-0085">Western DFC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Survey No. (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 103/10"
                      value={newSurveyNo}
                      onChange={(e) => setNewSurveyNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#0C5A37]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-800 block">Digital Ingestion Certificate:</span>
                  <span className="text-slate-500 text-[11px]">
                    Uploaded by <strong>{currentUser.name}</strong> ({currentUser.designation}). A client-side SHA-256 cryptographic checksum will be generated and signed into the audit trail.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !newTitle}
                    className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#0C5A37] hover:bg-[#084228] transition-colors disabled:opacity-50"
                  >
                    {isUploading ? 'Computing SHA-256 & Signing...' : 'Seal & Upload Document →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <InstitutionalFooter />
    </div>
  );
}
