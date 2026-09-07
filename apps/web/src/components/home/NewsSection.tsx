'use client';

import React, { useState } from 'react';
import { LATEST_UPDATES, AcquisitionUpdate } from '../../data/homepageData';

export const NewsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedNotice, setSelectedNotice] = useState<AcquisitionUpdate | null>(null);

  const categories = ['All', 'Gazette Notice', 'Award Declared', 'DBT Compensation', 'R&R Progress'];

  const filteredNews =
    activeCategory === 'All'
      ? LATEST_UPDATES
      : LATEST_UPDATES.filter((n) => n.category === activeCategory);

  return (
    <section id="notices" className="py-16 sm:py-20 bg-[#F8FAFC] border-t border-slate-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10 sm:mb-12">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0284C7] uppercase tracking-widest bg-sky-50 border border-sky-200/80 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]" />
              Official Gazette &amp; Statutory Bulletins
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B1F33] tracking-tight">
              Latest Acquisition Gazette Notices &amp; Awards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Official gazetted Section 11 preliminary notifications, Section 23 awards, PFMS compensation disbursements, and R&amp;R colony progress.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === c
                    ? 'bg-[#0B1F33] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.date}
                  </span>
                  <span className="text-[9.5px] font-bold bg-sky-50 text-[#0284C7] px-2 py-0.5 rounded-full border border-sky-200">
                    {item.category}
                  </span>
                </div>

                <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 mb-2 leading-snug">
                  {item.headline}
                </h3>

                <p className="text-xs text-slate-600 mb-4 leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-emerald-800 font-bold truncate max-w-[170px]">
                  {item.gazetteRef}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedNotice(item)}
                  className="font-bold text-[#0C5A37] hover:underline cursor-pointer"
                >
                  Read Notice →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Notice Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                    {selectedNotice.gazetteRef} • {selectedNotice.date}
                  </span>
                  <h3 className="text-base font-extrabold text-[#0B1F33] mt-0.5">
                    {selectedNotice.headline}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedNotice(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p>{selectedNotice.summary}</p>
                <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                  <span>Jurisdiction: <strong>{selectedNotice.state}</strong></span>
                  <span className="mx-2">•</span>
                  <span>Category: <strong>{selectedNotice.category}</strong></span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedNotice(null)}
                  className="bg-[#0B2540] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
