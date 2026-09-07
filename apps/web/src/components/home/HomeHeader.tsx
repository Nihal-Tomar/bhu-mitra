'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

const LANG_OPTIONS = [
  { label: 'English', locale: 'en' },
  { label: 'हिन्दी (Hindi)', locale: 'hi' },
] as const;

export const HomeHeader: React.FC = () => {
  const { locale, setLocale } = useLocale();
  const selectedLang = locale === 'hi' ? 'हिन्दी' : 'English';
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Keyboard shortcut listener for '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="w-full relative z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Main Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 lg:gap-3 xl:gap-4">
        
        {/* Left: Government of India Identity with Official Ashoka Lion Capital */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group" aria-label="Government of India Bhu-Mitra Home">
          {/* Official State Emblem of India Vector Asset */}
          <div className="h-9 sm:h-11 w-auto flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/emblem-of-india.svg"
              alt="State Emblem of India"
              className="h-9 sm:h-11 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              width={34}
              height={44}
            />
          </div>

          <div className="flex flex-col text-left leading-[1.15]">
            <span className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 tracking-normal font-sans">
              भारत सरकार
            </span>
            <span className="text-[11px] sm:text-[12px] font-bold text-slate-800 tracking-tight">
              Government of India
            </span>
            <span className="text-[8px] sm:text-[8.5px] font-medium text-slate-500 tracking-tight">
              Department of Land Resources • MoRD
            </span>
          </div>
        </Link>

        {/* Center: Clean Desktop Navigation — Single Row, Never Wraps */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-4 2xl:gap-5 text-[12.5px] xl:text-[13px] font-semibold text-slate-700 whitespace-nowrap" aria-label="Main Navigation">
          <Link
            href="/"
            className="text-[#138808] font-bold relative py-1 transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2.5px] after:bg-[#138808] after:rounded-full"
          >
            Home
          </Link>
          <a href="#dashboard" className="px-1.5 py-1 hover:text-[#0B2540] hover:bg-slate-50 rounded-md transition-colors">
            Overview
          </a>
          <a href="#lifecycle" className="px-1.5 py-1 hover:text-[#0B2540] hover:bg-slate-50 rounded-md transition-colors">
            Lifecycle
          </a>
          <a href="#gis-map" className="px-1.5 py-1 hover:text-[#0B2540] hover:bg-slate-50 rounded-md transition-colors">
            Acquisition GIS
          </a>
          <a href="#stakeholders" className="px-1.5 py-1 hover:text-[#0B2540] hover:bg-slate-50 rounded-md transition-colors">
            Workspaces
          </a>
          <a href="#intelligence" className="px-1.5 py-1 hover:text-[#0B2540] hover:bg-slate-50 rounded-md transition-colors">
            Risk &amp; Delay AI
          </a>

          {/* More Dropdown for Secondary Navigation to keep single clean row */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:text-slate-950 hover:bg-slate-50 rounded-md transition-colors font-semibold"
              aria-expanded={moreDropdownOpen}
              aria-label="More acquisition sections"
            >
              <span>More</span>
              <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {moreDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn text-xs"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                <a
                  href="#transparency"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="block px-3.5 py-2 text-slate-700 hover:bg-emerald-50 hover:text-[#0C5A37] font-semibold transition-colors"
                >
                  Citizen Transparency &amp; RoR
                </a>
                <a
                  href="#documents"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="block px-3.5 py-2 text-slate-700 hover:bg-emerald-50 hover:text-[#0C5A37] font-semibold transition-colors"
                >
                  Statutory Document Repository
                </a>
                <a
                  href="#safeguards"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="block px-3.5 py-2 text-slate-700 hover:bg-emerald-50 hover:text-[#0C5A37] font-semibold transition-colors"
                >
                  Statutory Safeguards (SIA / R&amp;R)
                </a>
                <a
                  href="#notices"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="block px-3.5 py-2 text-slate-700 hover:bg-emerald-50 hover:text-[#0C5A37] font-semibold transition-colors"
                >
                  Gazette Notices &amp; Awards
                </a>
                <a
                  href="#help"
                  onClick={() => setMoreDropdownOpen(false)}
                  className="block px-3.5 py-2 text-slate-700 hover:bg-emerald-50 hover:text-[#0C5A37] font-semibold transition-colors"
                >
                  Transparency &amp; Help Center
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls: Search, Language, Command Center & Digital India */}
        <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
          
          {/* Global Search Bar (Responsive width) */}
          <div className="relative hidden md:flex items-center">
            <div className="absolute left-2.5 text-slate-400 pointer-events-none flex items-center">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search corridors, awards..."
              className="w-28 sm:w-36 xl:w-48 pl-7 pr-6 py-1.5 text-xs bg-slate-50 hover:bg-white focus:bg-white text-slate-800 placeholder-slate-400 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#138808] transition-all font-sans"
            />
            <kbd className="absolute right-2 px-1 py-0.5 text-[8.5px] font-mono text-slate-400 bg-slate-100 border border-slate-300 rounded pointer-events-none hidden xl:inline-block">
              /
            </kbd>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-white border border-slate-300 rounded-full shadow-2xs transition-colors shrink-0"
              aria-expanded={langDropdownOpen}
              aria-label="Select Language"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="hidden sm:inline">{selectedLang}</span>
              <span className="sm:hidden">EN</span>
              <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-fadeIn">
                {LANG_OPTIONS.map((l) => (
                  <button
                    key={l.locale}
                    type="button"
                    onClick={() => {
                      setLocale(l.locale);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 hover:text-slate-900 transition-colors font-medium ${
                      locale === l.locale ? 'text-[#138808] font-bold bg-emerald-50' : 'text-slate-700'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Login Button (Forest Green Pill) -> Command Center — Always Visible */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 bg-[#0C5A37] hover:bg-[#09472B] text-white text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full shadow-xs hover:shadow transition-all shrink-0 whitespace-nowrap"
          >
            <svg className="w-3.5 h-3.5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Command Center</span>
            <span className="sm:hidden">Command</span>
          </Link>

          {/* Official Digital India Brand Logo */}
          <div className="hidden xl:flex items-center pl-1 shrink-0" title="Digital India · Power To Empower">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/digital-india.png"
              alt="Digital India - Power To Empower"
              className="h-8 xl:h-9 w-auto object-contain shrink-0"
              width={60}
              height={34}
            />
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-slate-700 hover:text-slate-950 rounded-lg hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 py-4 shadow-2xl text-sm space-y-3 animate-fadeIn">
          <div className="flex items-center relative mb-2">
            <input
              type="text"
              placeholder="Search projects, corridors, gazette..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#138808]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <Link href="/" className="block p-2 rounded-lg text-[#138808] bg-emerald-50 font-bold" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <a href="#dashboard" className="block p-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>National Dashboard</a>
            <a href="#lifecycle" className="block p-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>9-Stage Lifecycle</a>
            <a href="#gis-map" className="block p-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Acquisition GIS</a>
            <a href="#stakeholders" className="block p-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Workspaces</a>
            <a href="#intelligence" className="block p-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Risk &amp; Delay AI</a>
            <a href="#transparency" className="block p-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Citizen Transparency</a>
            <a href="#documents" className="block p-2 rounded-lg text-slate-700 hover:bg-slate-50" onClick={() => setMobileMenuOpen(false)}>Document Repository</a>
          </div>
          <div className="pt-2 border-t border-slate-200">
            <Link
              href="/dashboard"
              className="block w-full text-center py-2.5 bg-[#0C5A37] text-white font-bold rounded-lg text-xs shadow-xs"
              onClick={() => setMobileMenuOpen(false)}
            >
              Open National Command Center →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
