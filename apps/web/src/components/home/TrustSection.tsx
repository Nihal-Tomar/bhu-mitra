'use client';

import React, { useState } from 'react';
import { STATUTORY_DOCUMENTS, StatutoryDocument } from '../../data/homepageData';

export const TrustSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [inspectDoc, setInspectDoc] = useState<StatutoryDocument | null>(null);

  const categories = ['All', 'Gazette Notice', 'Award', 'R&R Order', 'Possession'];

  const filteredDocs = selectedCategory === 'All'
    ? STATUTORY_DOCUMENTS
    : STATUTORY_DOCUMENTS.filter((d) => d.category === selectedCategory);

  return (
    <section id="documents" className="py-16 sm:py-20 bg-white border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
            Document Governance · Statutory Audit Integrity
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
            Statutory Document Repository &amp; Audit Trail
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Transparent, tamper-evident repository for all official acquisition records: project indents, Section 11/19 gazette notifications, objection hearing proceedings, Section 23 awards, and legal possession panchnamas.
          </p>
        </div>

        {/* 4 Core Architectural Principles (Zero False Claims) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
          {[
            {
              step: '01',
              title: 'Tamper-Evident Logging',
              subtitle: 'Cryptographic Integrity',
              desc: 'Every statutory gazette publication and award order is indexed with cryptographic checksums to prevent backdated alterations.',
              color: '#138808',
            },
            {
              step: '02',
              title: 'Public Scrutiny Registry',
              subtitle: 'Section 15 Transparency',
              desc: 'Public notices, hearing calendars, and alignment maps remain accessible for citizen inspection and objection filing.',
              color: '#0284C7',
            },
            {
              step: '03',
              title: 'Role-Based Access Control',
              subtitle: 'Segregation of Duties',
              desc: 'Strict authorization boundaries separating Proposal Indenting, Award Sanctioning, Fund Release, and Revenue Mutation.',
              color: '#D97706',
            },
            {
              step: '04',
              title: 'Disbursement Audit Trail',
              subtitle: 'Direct Compensation Accountability',
              desc: 'Complete electronic reconciliation linking land valuation awards with direct bank payment advices and escrow ledgers.',
              color: '#6D28D9',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs hover:border-[#138808] transition-colors flex flex-col justify-between"
            >
              <div>
                <div
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs mb-3 font-mono"
                >
                  {item.step}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                  {item.subtitle}
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0B1F33] mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Statutory Document Repository Table */}
        <div className="bg-[#F8FAFC] border border-slate-300 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base font-extrabold text-[#0B1F33]">
                Official Statutory Orders &amp; Gazette Archive
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect legally mandated publications under RFCTLARR Act 2013.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-white text-[#0B1F33] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Document Rows */}
          <div className="divide-y divide-slate-200 mt-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="py-3.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-white/80 p-2 rounded-xl transition-colors"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {doc.docNumber}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {doc.projectName}
                    </span>
                    <span className="text-[9.5px] font-extrabold px-2 py-0.2 rounded-full bg-slate-200 text-slate-800">
                      {doc.status}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-[13px] font-bold text-[#0B1F33]">
                    {doc.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span>Authority: <strong className="text-slate-700">{doc.issuingAuthority}</strong></span>
                    <span>•</span>
                    <span>Date: <strong className="text-slate-700">{doc.publishedDate}</strong></span>
                    <span>•</span>
                    <span>Size: <strong className="text-slate-700">{doc.fileSize}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setInspectDoc(doc)}
                    className="text-xs font-bold text-[#0C5A37] hover:bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Inspect Checksum
                  </button>
                  <a
                    href="#transparency"
                    className="text-xs font-bold text-white bg-[#0B2540] hover:bg-[#07192b] px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                  >
                    View Notice
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal / Checksum Inspector Popover */}
        {inspectDoc && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h4 className="text-sm font-extrabold text-[#0B1F33]">
                    Cryptographic Document Verification
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setInspectDoc(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 text-[10px] block">Document Title:</span>
                  <span className="font-bold text-slate-900">{inspectDoc.title}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Gazette / Award Reference:</span>
                  <span className="font-mono text-emerald-800 font-bold">{inspectDoc.docNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">SHA-256 Audit Verification Hash:</span>
                  <span className="font-mono text-[10.5px] bg-slate-100 p-2 rounded block break-all text-slate-900 border border-slate-200 select-all">
                    {inspectDoc.verificationHash}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 italic mt-2">
                  * Prototype Security Architecture: This demonstrates tamper-evident audit hashing designed to guarantee non-repudiation for public land acquisition gazette records.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setInspectDoc(null)}
                  className="bg-[#0B2540] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-800"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Platform System Notice */}
        <div className="mt-8 bg-slate-100/90 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
            <span>
              <strong>Platform Architecture Specification:</strong> Designed around RFCTLARR Act 2013 statutory rules &amp; GIGW 3.0 accessibility principles.
            </span>
          </div>
          <div className="text-[11px] text-slate-500 shrink-0">
            National Land Acquisition Telemetry Dataset
          </div>
        </div>

      </div>
    </section>
  );
};
