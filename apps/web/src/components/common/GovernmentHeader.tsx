'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from '@bhumitra/ui';
import { useAuth, DEFAULT_DEMO_USER, OfficerPreset } from '../../lib/authContext';
import { projectStore, SystemNotification } from '../../lib/projectStore';

export const GovernmentHeader: React.FC = () => {
  const pathname = usePathname();
  const { locale, setLocale, isHindi, t } = useLocale();
  const { user, switchUser, demoUsers } = useAuth();
  const currentUser = user || DEFAULT_DEMO_USER;

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  useEffect(() => {
    setNotifications(projectStore.getNotifications(currentUser.role));
  }, [currentUser.role, notifDropdownOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdowns on path change
  useEffect(() => {
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    setUserDropdownOpen(false);
    setNotifDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t('nav.home', 'Home'), exact: true },
    { href: '/command', label: t('nav.command', 'National Command') },
    { href: '/infrastructure', label: t('nav.infrastructure', 'Infrastructure') },
    { href: '/projects', label: t('nav.projects', 'Projects') },
    { href: '/gis', label: t('nav.gis', 'Acquisition GIS') },
  ];

  const moreLinks = [
    {
      href: '/lifecycle',
      label: t('nav.lifecycle', 'Lifecycle'),
      subtext: isHindi ? 'धारावार 9-चरणीय सांविधिक यात्रा' : 'RFCTLARR 9-Stage Statutory Workflow',
    },
    {
      href: '/risk',
      label: t('nav.risk', 'Risk Intelligence'),
      subtext: isHindi ? 'पूर्वाभास एवं विलंब चालक विश्लेषण' : 'Early Warning & Delay Driver Analytics',
    },
    {
      href: '/compensation',
      label: t('nav.compensation', 'Compensation & DBT'),
      subtext: isHindi ? 'मूल्यांकन, 100% तोषाण एवं संवितरण' : 'Circle Rate & 100% Solatium Traceability',
    },
    {
      href: '/rr',
      label: t('nav.rr', 'Rehabilitation & Resettlement'),
      subtext: isHindi ? 'प्रभावित परिवार, आवास एवं आजीविका' : 'Affected Families & Resettlement Safeguards',
    },
    {
      href: '/documents',
      label: t('nav.documents', 'Gazette & Documents'),
      subtext: isHindi ? 'राजपत्र धारा 11/19 एवं अधिनिर्णय' : 'Section 11/19 Gazette & SHA-256 Audit',
    },
    {
      href: '/citizen',
      label: t('nav.citizen', 'Citizen Transparency'),
      subtext: isHindi ? 'भूस्वामी अधिकार, जन सुनवाई एवं सीएससी' : 'Landowner Rights & Public Objection Guide',
    },
  ];

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const isMoreActive = moreLinks.some(link => pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href)));

  return (
    <header className="w-full relative z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Topmost Institutional Tricolor Accent Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />

      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-5 2xl:px-8 py-2 2xl:py-2.5 flex items-center justify-between gap-1.5 sm:gap-2.5 2xl:gap-3 min-w-0">
        
        {/* Left: Government of India Identity with Official Emblem */}
        <Link href="/" className="flex items-center gap-2 2xl:gap-2.5 shrink-0 group" aria-label="Bhu-Mitra Government of India Home">
          <div className="h-8 sm:h-10 2xl:h-11 w-auto flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/emblem-of-india.svg"
              alt="State Emblem of India"
              className="h-8 sm:h-10 2xl:h-11 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              width={34}
              height={44}
            />
          </div>

          <div className="flex flex-col text-left leading-tight">
            <span className="text-[11.5px] sm:text-[12px] 2xl:text-[13px] font-extrabold text-slate-900 tracking-normal font-sans">
              {isHindi ? 'भारत सरकार' : 'Government of India'}
            </span>
            <span className="text-[9.5px] sm:text-[10.5px] 2xl:text-[11.5px] font-bold text-[#0C5A37] tracking-tight">
              {isHindi ? 'भूमि संसाधन विभाग · ग्रामीण विकास मंत्रालय' : 'Department of Land Resources · MoRD'}
            </span>
            <span className="text-[8.5px] sm:text-[9px] font-semibold text-slate-500 tracking-tight flex items-center gap-1">
              <span>{isHindi ? 'भूमि-मित्र' : 'Bhu-Mitra'}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#138808] font-bold">{isHindi ? 'राष्ट्रीय कमान मंच' : 'National Command'}</span>
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation — Smoothly Compressible, No Overflow */}
        <nav className="hidden xl:flex items-center min-w-0 flex-shrink gap-1 2xl:gap-1.5 text-[12px] 2xl:text-[13px] font-semibold text-slate-700 whitespace-nowrap" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2 2xl:px-2.5 py-1.5 rounded-md transition-all relative font-medium ${
                  active
                    ? 'text-[#0C5A37] font-bold bg-emerald-50/80 after:content-[\'\'] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[#0C5A37] after:rounded-full'
                    : 'hover:text-[#0B2540] hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* More Dropdown (Hover & Click Supported) */}
          <div
            className="relative"
            onMouseEnter={() => setMoreDropdownOpen(true)}
            onMouseLeave={() => setMoreDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex items-center gap-1 2xl:gap-1.5 px-2 2xl:px-2.5 py-1.5 rounded-md transition-colors font-medium ${
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
                className="absolute left-0 mt-1 w-80 max-w-[calc(100vw-32px)] bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fadeIn"
              >
                {moreLinks.map((sub) => {
                  const active = isActive(sub.href);
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMoreDropdownOpen(false)}
                      className={`block px-3.5 py-2 transition-colors ${
                        active ? 'bg-emerald-50 text-[#0C5A37]' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="text-[12.5px] font-bold flex items-center justify-between">
                        <span>{sub.label}</span>
                        {active && <span className="text-[10px] bg-[#0C5A37] text-white px-1.5 py-0.5 rounded font-semibold">Active</span>}
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-normal leading-tight mt-0.5">{sub.subtext}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Language Selector + Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 2xl:gap-3 shrink-0">
          
          {/* Language Selector (English / Hindi) with global persistence */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 2xl:gap-1.5 px-2 2xl:px-2.5 py-1 2xl:py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors shrink-0"
              aria-label="Select Language"
              aria-expanded={langDropdownOpen}
            >
              <svg className="w-3.5 h-3.5 text-[#138808] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span>{isHindi ? 'हिन्दी' : 'English'}</span>
              <svg className={`w-3 h-3 text-slate-500 transition-transform shrink-0 ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 max-w-[calc(100vw-24px)] bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 text-xs font-semibold">
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

          {/* Global Notification Bell */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-1.5 rounded-lg text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors shrink-0"
              aria-label="Notifications"
            >
              <svg className="w-4 h-4 text-slate-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9.5px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-24px)] bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-fadeIn"
                onMouseLeave={() => setNotifDropdownOpen(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-[#0B2540] uppercase tracking-wider">
                    Official Alerts & SLA Warnings ({unreadCount})
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Role: {currentUser.role}</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">No active alerts.</div>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.linkUrl}
                        onClick={() => {
                          projectStore.markNotificationRead(n.id);
                          setNotifDropdownOpen(false);
                        }}
                        className={`block p-2.5 rounded-lg text-xs transition-colors ${
                          !n.isRead ? 'bg-amber-50/60 hover:bg-amber-100/60' : 'hover:bg-slate-50 opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            n.priority === 'critical'
                              ? 'bg-red-100 text-red-800'
                              : n.priority === 'high'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {n.priority.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="font-bold text-slate-900 mt-1">{n.title}</div>
                        <div className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{n.message}</div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Persona & Role Switcher */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1 2xl:gap-1.5 px-2 2xl:px-2.5 py-1 2xl:py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100/80 text-xs transition-colors shrink-0"
              aria-label="User profile and role switcher"
            >
              <div className="w-5 h-5 rounded-full bg-[#0C5A37] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block leading-tight">
                <div className="font-bold text-slate-900 text-[10.5px] 2xl:text-[11px] truncate max-w-[80px] 2xl:max-w-[110px]">{currentUser.name.split(',')[0]}</div>
                <div className="text-[9px] 2xl:text-[9.5px] text-[#0C5A37] font-semibold truncate max-w-[85px] 2xl:max-w-[125px]">{currentUser.designation}</div>
              </div>
              <svg className="w-3 h-3 text-[#0C5A37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-24px)] bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 animate-fadeIn"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="pb-2 border-b border-slate-100">
                  <div className="font-bold text-xs text-[#0B2540]">{currentUser.name}</div>
                  <div className="text-[11px] text-[#0C5A37] font-semibold">{currentUser.designation}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {currentUser.id} • {currentUser.jurisdiction}</div>
                </div>

                <div className="pt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {isHindi ? 'डेमो भूमिका बदलें (RBAC)' : 'Switch Role (SIH Evaluator Demo)'}
                  </div>
                  <div className="space-y-1">
                    {demoUsers.map((u: OfficerPreset) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          switchUser(u.id);
                          setUserDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          currentUser.id === u.id
                            ? 'bg-emerald-50 text-[#0C5A37] font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{u.name}</div>
                          <div className="text-[10px] text-slate-500">{u.designation}</div>
                        </div>
                        {currentUser.id === u.id && <span className="text-[#138808] font-bold">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick National Command Action Button — Always Visible & Accessible */}
          <Link
            href="/command"
            className="inline-flex items-center gap-1 2xl:gap-1.5 bg-[#0C5A37] hover:bg-[#084228] text-white text-[11px] 2xl:text-xs font-bold px-2.5 2xl:px-3.5 py-1.5 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="whitespace-nowrap">{t('nav.commandCenter', 'Command')}</span>
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
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
