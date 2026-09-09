'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@bhumitra/ui';

export const GovernmentHeader: React.FC = () => {
  const pathname = usePathname();
  const { locale, setLocale, isHindi, t } = useLocale();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close dropdowns on path change
  useEffect(() => {
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t('nav.home', 'Home'), exact: true },
    { href: '/command', label: t('nav.command', 'National Command') },
    { href: '/infrastructure', label: t('nav.infrastructure', 'Infrastructure') },
    { href: '/projects', label: t('nav.projects', 'Projects') },
    { href: '/gis', label: t('nav.gis', 'Acquisition GIS') },
    { href: '/lifecycle', label: t('nav.lifecycle', 'Lifecycle') },
    { href: '/risk', label: t('nav.risk', 'Risk Intelligence') },
  ];

  const moreLinks = [
    { href: '/compensation', label: t('nav.compensation', 'Compensation & DBT'), subtext: isHindi ? 'मूल्यांकन, 100% तोषाण एवं संवितरण' : 'Circle Rate & 100% Solatium Traceability' },
    { href: '/rr', label: t('nav.rr', 'Rehabilitation & Resettlement'), subtext: isHindi ? 'प्रभावित परिवार, आवास एवं आजीविका' : 'Affected Families & Resettlement Safeguards' },
    { href: '/documents', label: t('nav.documents', 'Gazette & Documents'), subtext: isHindi ? 'राजपत्र धारा 11/19 एवं अधिनिर्णय' : 'Section 11/19 Gazette & SHA-256 Audit' },
    { href: '/citizen', label: t('nav.citizen', 'Citizen Transparency'), subtext: isHindi ? 'भूस्वामी अधिकार, जन सुनवाई एवं सीएससी' : 'Landowner Rights & Public Objection Guide' },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const isMoreActive = moreLinks.some(link => pathname.startsWith(link.href));

  return (
    <header className="w-full relative z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Topmost Institutional Tricolor Accent Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        
        {/* Left: Government of India Identity with Official Emblem */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Bhu-Mitra Government of India Home">
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

          <div className="flex flex-col text-left leading-tight">
            <span className="text-[12px] sm:text-[13px] font-extrabold text-slate-900 tracking-normal font-sans">
              {isHindi ? 'भारत सरकार' : 'Government of India'}
            </span>
            <span className="text-[10.5px] sm:text-[11.5px] font-bold text-[#0C5A37] tracking-tight">
              {isHindi ? 'भूमि संसाधन विभाग · ग्रामीण विकास मंत्रालय' : 'Department of Land Resources · MoRD'}
            </span>
            <span className="text-[9px] font-semibold text-slate-500 tracking-tight flex items-center gap-1.5">
              <span>{isHindi ? 'भूमि-मित्र' : 'Bhu-Mitra'}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#138808] font-bold">{isHindi ? 'राष्ट्रीय कमान मंच' : 'National Command'}</span>
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation — High Legibility, No Wrapping */}
        <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 text-[13px] font-semibold text-slate-700 whitespace-nowrap" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 rounded-md transition-all relative font-medium ${
                  active
                    ? 'text-[#0C5A37] font-bold bg-emerald-50/80 after:content-[\'\'] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[#0C5A37] after:rounded-full'
                    : 'hover:text-[#0B2540] hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-colors font-medium ${
                isMoreActive
                  ? 'text-[#0C5A37] font-bold bg-emerald-50/80'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
              }`}
              aria-expanded={moreDropdownOpen}
              aria-label="More acquisition modules"
            >
              <span>{t('nav.more', 'More')}</span>
              <svg className={`w-3.5 h-3.5 text-slate-500 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {moreDropdownOpen && (
              <div
                className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn"
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                {moreLinks.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    onClick={() => setMoreDropdownOpen(false)}
                    className={`block px-4 py-2.5 transition-colors ${
                      isActive(sub.href) ? 'bg-emerald-50 text-[#0C5A37]' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="text-[12.5px] font-bold">{sub.label}</div>
                    <div className="text-[10.5px] text-slate-500 font-normal leading-tight mt-0.5">{sub.subtext}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Language Selector + Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Language Selector (English / Hindi) with global persistence */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
              aria-label="Select Language"
              aria-expanded={langDropdownOpen}
            >
              <svg className="w-3.5 h-3.5 text-[#138808]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>{isHindi ? 'हिन्दी' : 'English'}</span>
              <svg className={`w-3 h-3 text-slate-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setLocale('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 hover:text-[#0C5A37] transition-colors ${
                    locale === 'en' ? 'text-[#0C5A37] font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>English</span>
                  {locale === 'en' && <span className="text-[#138808]">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLocale('hi');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-emerald-50 hover:text-[#0C5A37] transition-colors ${
                    locale === 'hi' ? 'text-[#0C5A37] font-bold bg-emerald-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {locale === 'hi' && <span className="text-[#138808]">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Quick National Command Action Button */}
          <Link
            href="/command"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#0C5A37] hover:bg-[#084228] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-xs transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t('nav.commandCenter', 'Command Center')}</span>
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`p-2.5 rounded-lg border transition-colors ${
                  isActive(link.href, link.exact)
                    ? 'border-emerald-500 bg-emerald-50 text-[#0C5A37] font-bold'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              {isHindi ? 'विशेष मॉड्यूल' : 'Specialized Modules'}
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg flex items-center justify-between ${
                    isActive(link.href) ? 'bg-emerald-50 text-[#0C5A37] font-bold' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-slate-400 text-[11px]">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
