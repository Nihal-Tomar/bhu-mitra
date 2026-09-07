'use client';

import React from 'react';
import { QUICK_ACTIONS, QuickActionItem } from '../../data/homepageData';

interface QuickActionBarProps {
  onSelectAction: (action: QuickActionItem) => void;
}

export const QuickActionBar: React.FC<QuickActionBarProps> = ({ onSelectAction }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative z-30 max-w-[1440px] w-full mx-auto px-3 sm:px-6 lg:px-8 -mt-5 sm:-mt-7 lg:-mt-8 max-w-full overflow-hidden lg:overflow-visible">
      {/* Floating White Pill Service Launcher */}
      <div className="bg-white/95 hover:bg-white backdrop-blur-md rounded-xl lg:rounded-full border border-slate-200/90 shadow-[0_4px_20px_rgba(11,31,51,0.08)] p-1 sm:p-1.5 lg:p-2 transition-all flex items-center gap-2 max-w-full overflow-hidden lg:overflow-visible">
        
        {/* 6 Quick Action Hubs: Horizontal Scroll Rail on Mobile/Tablet, 6-col Grid on Desktop */}
        <div className="flex-1 flex lg:grid lg:grid-cols-6 items-center gap-1 sm:gap-1.5 xl:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-0.5 max-w-full">
          {QUICK_ACTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectAction(item)}
              className="shrink-0 flex items-center gap-2 px-2.5 py-1.5 sm:py-1.5 lg:px-2 xl:px-2.5 lg:py-1.5 rounded-full bg-slate-50/80 hover:bg-slate-100 lg:bg-transparent lg:hover:bg-slate-50 transition-all text-left group cursor-pointer lg:border-r lg:border-slate-100 last:border-r-0 focus:outline-none focus:ring-2 focus:ring-[#138808] whitespace-nowrap"
              aria-label={`Access ${item.title}`}
            >
              {/* Circular Colored Icon Container */}
              <div
                style={{ backgroundColor: item.bgCircle }}
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 xl:w-8 xl:h-8 rounded-full text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-all"
              >
                {/* 1. National Dashboard */}
                {item.id === 'act-dashboard' && (
                  <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                )}

                {/* 2. 9-Stage Lifecycle */}
                {item.id === 'act-lifecycle' && (
                  <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}

                {/* 3. Acquisition GIS */}
                {item.id === 'act-gis' && (
                  <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}

                {/* 4. Risk & Delay Intelligence */}
                {item.id === 'act-risk' && (
                  <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )}

                {/* 5. Stakeholder Workspaces */}
                {item.id === 'act-stakeholders' && (
                  <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}

                {/* 6. Citizen Transparency */}
                {item.id === 'act-transparency' && (
                  <svg className="w-3.5 h-3.5 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
              </div>

              {/* Title & Arrow */}
              <div className="flex-1 min-w-0 pr-0.5 flex items-center justify-between gap-1 overflow-hidden">
                <span className="text-xs sm:text-[11.5px] lg:text-[11px] xl:text-[12px] 2xl:text-[12.5px] font-semibold text-slate-800 group-hover:text-[#0B2540] leading-tight whitespace-nowrap">
                  {item.title}
                </span>
                <span className="hidden xl:inline text-slate-400 group-hover:text-[#138808] group-hover:translate-x-0.5 transition-all text-xs font-bold shrink-0 ml-0.5">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Circular Scroll-to-Top Floating Button */}
        <button
          type="button"
          onClick={scrollToTop}
          className="hidden xl:flex w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200 text-slate-700 hover:text-slate-950 items-center justify-center shrink-0 border border-slate-200 shadow-2xs transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#138808]"
          title="Scroll to Top"
          aria-label="Scroll to Top of Page"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>

      </div>
    </div>
  );
};
