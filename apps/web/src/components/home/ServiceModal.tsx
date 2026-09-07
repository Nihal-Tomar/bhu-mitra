'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export interface ServiceModalData {
  title: string;
  category: string;
  description: string;
  features: string[];
}

interface ServiceModalProps {
  data: ServiceModalData | null;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ data, onClose }) => {
  const [queryState, setQueryState] = useState('Gujarat');
  const [queryDistrict, setQueryDistrict] = useState('Vadodara');
  const [surveyNo, setSurveyNo] = useState('103/10');
  const [searched, setSearched] = useState(false);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-[#0B1F33] text-white px-6 py-5 flex items-center justify-between border-b border-slate-700">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded">
              {data.category}
            </span>
            <h2 className="text-lg font-bold text-white mt-1">{data.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {data.description}
          </p>

          {/* Interactive Quick Scrutiny Query Form */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center justify-between">
              <span>Upstream Cadastral Scrutiny &amp; Section 11 Check</span>
              <span className="text-[10px] text-emerald-700 font-semibold">● Illustrative Prototype Simulation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">State</label>
                <select
                  value={queryState}
                  onChange={(e) => setQueryState(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                >
                  <option value="Gujarat">Gujarat (NH-48 Corridor)</option>
                  <option value="Maharashtra">Maharashtra (Pune-Nashik Rail)</option>
                  <option value="Rajasthan">Rajasthan (Western DFC)</option>
                  <option value="Uttar Pradesh">Uttar Pradesh (Lucknow Metro)</option>
                  <option value="Madhya Pradesh">Madhya Pradesh (Rewa Solar)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">District</label>
                <select
                  value={queryDistrict}
                  onChange={(e) => setQueryDistrict(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white"
                >
                  <option value="Vadodara">Vadodara</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Lucknow">Lucknow</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Upstream Survey / Khasra No.</label>
                <input
                  type="text"
                  value={surveyNo}
                  onChange={(e) => setSurveyNo(e.target.value)}
                  placeholder="e.g. 103/10"
                  className="w-full text-xs p-2 rounded border border-slate-300 bg-white font-mono font-bold"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSearched(true)}
              className="w-full py-2 bg-[#0C5A37] hover:bg-[#084228] text-white text-xs font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Verify Upstream RoR &amp; Acquisition Gazette Status</span>
            </button>
          </div>

          {/* Search Result Simulation */}
          {searched && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950">
                    Notified Parcel: Khasra #{surveyNo} ({queryDistrict}, {queryState})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded">
                    SECTION 11 GAZETTE NOTIFIED
                  </span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                    DEMO DATA
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-700 pt-1">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Upstream Title Holder</span>
                  <span className="font-bold">Shri Rameshwar Patel</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Acquisition Extent</span>
                  <span className="font-bold">0.85 Ha (of 1.42 Ha)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Project Corridor</span>
                  <span className="font-bold text-blue-900">NH-48 Six-Laning</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Est. Compensation</span>
                  <span className="font-bold text-emerald-700">₹48,20,000 (Demo)</span>
                </div>
              </div>
            </div>
          )}

          {/* Key Features List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Statutory Capabilities &amp; RFCTLARR Standards
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {data.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/login"
            className="text-xs font-bold text-[#0F2D4A] hover:underline flex items-center gap-1"
          >
            Officer / Staff Login for Full Dossier →
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
