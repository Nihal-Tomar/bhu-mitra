import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';
import { GovernmentHeader } from '../common/GovernmentHeader';
import { StoryVideoModal } from './StoryVideoModal';
import { HERO_STATS, GOVERNANCE_PILLARS } from '../../data/homepageData';

export const HeroSection: React.FC = () => {
  const { isHindi } = useLocale();
  const [videoOpen, setVideoOpen] = useState(false);
  const [tabletHover, setTabletHover] = useState(false);
  const [stoneHover, setStoneHover] = useState(false);

  return (
    <div className="relative w-full overflow-hidden bg-[#061727] min-h-[100svh] flex flex-col justify-between">
      <StoryVideoModal isOpen={videoOpen} onClose={() => setVideoOpen(false)} />

      {/* Cinematic Rural Indian Landscape Background with Farmer & Glowing India Map */}
      {/* Mobile art-direction: bg-[76%_12%] ensures the farmer's face, turban, and GIS tablet are prominent */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-[76%_12%] sm:bg-[74%_16%] lg:bg-[72%_20%] xl:bg-[center_top] transition-transform duration-700 ease-out"
        style={{
          backgroundImage: "url('/assets/bhumitra-hero-backdrop.jpg')",
          filter: 'contrast(1.08) brightness(1.02) saturate(1.04)',
        }}
        role="img"
        aria-label="Bhu-Mitra National Land Acquisition & Management Platform Hero with Indian rural landscape, infrastructure corridor, and farmer holding GIS tablet"
      />

      {/* Refined Directional Lighting Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.60) 30%, rgba(255,255,255,0.20) 52%, rgba(255,255,255,0.02) 74%, transparent 100%), linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 16%, transparent 74%, rgba(6,23,39,0.85) 100%)',
        }}
      />

      {/* Top: Government of India Institutional Header */}
      <GovernmentHeader />

      {/* Hero Canvas Area: Structured into Left Zone, Center Protected Farmer Zone, Right Safe Zone */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-20 sm:pb-24 flex-1 flex flex-col justify-between">
        
        {/* Main Upper Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          
          {/* ========================================================
              LEFT ZONE (0–46% width on desktop)
              Contains: Eyebrow, Bhu-Mitra, Acquisition Tagline, CTAs, KPIs
             ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-3.5 sm:space-y-4 max-w-xl">
            
            {/* National Acquisition Lifecycle Eyebrow */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-bold text-slate-800 uppercase tracking-[0.16em] sm:tracking-[0.2em]">
              <span>{isHindi ? 'प्रस्ताव' : 'PROPOSAL'}</span>
              <span className="text-slate-400">|</span>
              <span>{isHindi ? 'संवीक्षा' : 'SCRUTINY'}</span>
              <span className="text-slate-400">|</span>
              <span>{isHindi ? 'अधिसूचना' : 'NOTIFICATION'}</span>
              <span className="text-slate-400">|</span>
              <span>{isHindi ? 'अधिनिर्णय' : 'AWARD'}</span>
              <span className="text-slate-400">|</span>
              <span className="text-[#138808]">{isHindi ? 'कब्जा' : 'POSSESSION'}</span>
            </div>

            {/* Bhu-Mitra Brand Wordmark with Organic Leaf Motif */}
            <div className="relative inline-block select-none">
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] font-black tracking-[-0.025em] leading-none flex items-baseline drop-shadow-2xs">
                <span className="text-[#0B2540]">{isHindi ? 'भूमि-' : 'Bhu-'}</span>
                <span className="text-[#0C6237] relative">
                  {isHindi ? 'मित्र' : 'Mitra'}
                  {/* Organic leaf emblem positioned gracefully on the brand */}
                  <svg
                    className="absolute -top-3.5 -right-2 sm:-top-4 sm:-right-3 w-7 h-7 sm:w-9 sm:h-9 text-[#138808] drop-shadow-2xs transform rotate-12"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 4C28 4 36 12 36 20C36 28 28 36 20 36C18 36 16 35 15 34C24 30 28 22 26 14C24 6 18 5 15 4.5C16.5 4.2 18.2 4 20 4Z"
                      fill="currentColor"
                    />
                    <path d="M16 34C18 24 24 16 32 12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Acquisition Purpose Statement */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/10 border border-emerald-800/25 text-[#0C5A37] text-[10.5px] sm:text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                {isHindi ? 'राष्ट्रीय भूमि अधिग्रहण आसूचना एवं प्रबंधन मंच' : 'National Land Acquisition Intelligence Platform'}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B2540] tracking-tight leading-snug">
                {isHindi
                  ? 'प्रस्ताव से कब्जे तक — प्रत्येक अधिग्रहण हेतु एक कमान दृष्टिकोण'
                  : 'From Proposal to Possession — One Command View for Every Acquisition.'}
              </h2>
              <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal max-w-xl">
                {isHindi
                  ? 'बुनियादी ढांचा भूमि अधिग्रहण हेतु वास्तविक समय निगरानी, जीआईएस आसूचना, वैधानिक अनुपालन, प्रतिकर, पुनर्वास और जोखिम पूर्वानुमान।'
                  : 'Real-time monitoring, GIS intelligence, statutory compliance, compensation, R&R and risk intelligence for infrastructure land acquisition under RFCTLARR Act 2013.'}
              </p>
            </div>

            {/* Primary & Secondary Action CTAs (open in dedicated new tabs) */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 pt-1">
              {/* Primary Green Pill Button */}
              <Link
                href="/command"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#0C5A37] hover:bg-[#084228] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-xs hover:shadow-md transition-all hover:translate-x-0.5 group focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              >
                <span>{isHindi ? 'राष्ट्रीय कमान केंद्र खोलें' : 'Open National Command'}</span>
                <span className="text-base leading-none group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              {/* Secondary GIS Map Button */}
              <Link
                href="/gis"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-[#0C5A37] py-2 px-3 sm:px-3.5 rounded-full border border-slate-300/80 bg-white/75 hover:bg-white transition-colors group focus:outline-none focus:ring-2 focus:ring-[#138808] cursor-pointer"
              >
                <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <span>{isHindi ? 'अधिग्रहण जीआईएस देखें' : 'View Acquisition GIS'}</span>
              </Link>

              {/* Documentary Video Modal Button */}
              <button
                type="button"
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 hover:text-slate-950 py-1.5 px-2.5 rounded-full hover:bg-white/70 transition-colors group focus:outline-none cursor-pointer"
                aria-label="Watch Bhu-Mitra platform video (2 minutes)"
              >
                <span className="w-6 h-6 rounded-full border border-slate-600 group-hover:border-[#138808] flex items-center justify-center text-slate-800 group-hover:text-[#138808] transition-colors">
                  <svg className="w-2.5 h-2.5 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-[11.5px] font-medium text-slate-700">{isHindi ? 'प्लेटफ़ॉर्म वीडियो' : 'Watch Intro'}</span>
              </button>
            </div>

            {/* ── Acquisition KPIs Card — 4 in one row on desktop, 2x2 on tablet/mobile ── */}
            <div className="pt-1.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-nowrap items-center bg-white/90 hover:bg-white/96 backdrop-blur-sm border border-slate-200/80 shadow-xs rounded-xl overflow-hidden transition-all">
                {HERO_STATS.map((stat, idx) => (
                  <div
                    key={stat.id}
                    className={`flex items-center gap-2 sm:gap-2.5 px-3 py-2.5 sm:px-3.5 sm:py-3 xl:px-4 xl:py-3 ${
                      idx !== 0 ? 'border-t sm:border-t-0 sm:border-l border-slate-200/80' : ''
                    }`}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 text-[#138808] flex items-center justify-center shrink-0">
                      {stat.icon === 'projects' && (
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                      {stat.icon === 'area' && (
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                      )}
                      {stat.icon === 'finance' && (
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {stat.icon === 'families' && (
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="leading-tight">
                      <div className="text-sm sm:text-base xl:text-[15.5px] font-bold text-slate-900 tracking-tight whitespace-nowrap">{stat.value}</div>
                      <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium whitespace-nowrap">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-[10px] text-slate-600 font-medium tracking-wide mt-1 pl-1">
                * National Acquisition Model · Illustrative Telemetry Data
              </div>
            </div>

          </div>

          {/* ========================================================
              CENTER ZONE (45–82% width on desktop)
              Protected visual area for Farmer, Tablet, and Sky Telemetry
              ZERO decorative text overlapping the farmer.
             ======================================================== */}
          <div className="lg:col-span-3 xl:col-span-4 relative flex flex-col items-center justify-between min-h-[160px] lg:min-h-[280px] pointer-events-none">
            
            {/* Sky Telemetry — DARK for readability against sky */}
            <div className="text-center pt-1 select-none">
              <div className="text-[11px] font-bold text-[#111827] tracking-widest uppercase drop-shadow-sm">
                NATIONAL CORRIDOR INTELLIGENCE
              </div>
              <div className="text-[10px] font-semibold text-[#1f2937] tracking-wider drop-shadow-sm">
                Statutory Compliance • RFCTLARR Act 2013
              </div>
            </div>

            {/* Interactive Hotspot Beacon ONLY over tablet screen */}
            <div
              className="pointer-events-auto relative cursor-pointer group mt-auto mb-4"
              onClick={() => {
                window.open('/gis', '_blank', 'noopener,noreferrer');
              }}
              onMouseEnter={() => setTabletHover(true)}
              onMouseLeave={() => setTabletHover(false)}
              role="button"
              tabIndex={0}
              aria-label="Click to inspect Cadastral Parcel #103/10 in Acquisition GIS"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.open('/gis', '_blank', 'noopener,noreferrer');
                }
              }}
            >
              {/* Subtle Pulsing Beacon on Tablet Screen */}
              <div className="w-12 h-12 rounded-full bg-emerald-400/20 animate-ping" />
              
              {/* Tooltip on tablet hover */}
              {tabletHover && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 bg-[#0B1F33] text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap border border-slate-700 animate-fadeIn">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Parcel #103/10 · NH-48 Section 11 Notified</span>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#0B1F33]" />
                </div>
              )}
            </div>

          </div>

          {/* ========================================================
              RIGHT SAFE ZONE — moved INWARD from viewport edge
              pr-4 lg:pr-6 xl:pr-8 gives comfortable breathing room
             ======================================================== */}
          <div className="hidden lg:flex lg:col-span-3 space-y-3 flex-col items-end text-right pr-0 lg:pr-6 xl:pr-8">
            
            {/* Secondary Hindi Slogan */}
            <div className="space-y-0.5 text-right select-none">
              <div className="text-xl sm:text-2xl font-black text-[#0B2540] tracking-tight font-sans leading-tight">
                भूमि अधिग्रहण निगरानी तंत्र
              </div>
              <div className="text-[11px] font-semibold text-slate-700 tracking-wide">
                Fair Compensation • Timely Delivery • R&R
              </div>
            </div>

            {/* Floating Governance Pillars Card */}
            <div className="bg-white/85 hover:bg-white/95 backdrop-blur-sm border border-slate-200/80 shadow-xs rounded-xl p-3 w-full max-w-[220px] space-y-1.5 transition-all text-left">
              {GOVERNANCE_PILLARS.map((pillar) => (
                <div key={pillar.id} className="flex items-center gap-2 group cursor-default">
                  <div className="w-5 h-5 rounded bg-emerald-50 text-[#138808] flex items-center justify-center shrink-0">
                    {pillar.icon === 'shield' && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                    {pillar.icon === 'leaf' && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {pillar.icon === 'people' && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    )}
                    {pillar.icon === 'chakra' && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-800 group-hover:text-[#138808] transition-colors">
                    {pillar.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Statutory Stone Card */}
            <div
              className="relative cursor-pointer group mt-1"
              onMouseEnter={() => setStoneHover(true)}
              onMouseLeave={() => setStoneHover(false)}
            >
              <div className="bg-white/80 hover:bg-white/95 backdrop-blur-sm border border-amber-900/15 px-3 py-2 rounded-xl shadow-2xs text-center space-y-0.5 max-w-[164px] transition-all">
                <div className="text-[9.5px] font-bold text-amber-900 tracking-wider uppercase">सत्यमेव जयते</div>
                <div className="text-[13px] font-extrabold text-amber-950 font-serif leading-tight">उचित मुआवजा</div>
                <div className="text-[13px] font-extrabold text-amber-950 font-serif leading-tight">पारदर्शी पुनर्वासन</div>
                <div className="w-8 h-0.5 mx-auto rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mt-1" />
              </div>
              {stoneHover && (
                <div className="absolute -top-9 right-0 z-30 bg-[#0B1F33] text-white text-[9.5px] font-semibold px-2 py-1 rounded shadow-lg border border-slate-700 whitespace-nowrap">
                  RFCTLARR Act 2013 · Statutory Safeguards
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Lower Hero: Citizen Story Panel */}
        <div className="pt-2 sm:pt-4">
          <div className="flex items-stretch bg-[#0B1F33]/92 backdrop-blur-sm text-white rounded-xl overflow-hidden border border-slate-700/70 shadow-md max-w-[480px] transition-all hover:scale-[1.01]">
            {/* Citizen Photos Strip */}
            <div className="relative w-36 sm:w-44 shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/citizen-strip.jpg"
                alt="Indian Citizens - Farmers and rural families protected by fair land acquisition laws"
                className="w-full h-full object-cover"
                width={192}
                height={96}
              />
              <div
                className="absolute inset-y-0 right-0 w-6 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, transparent, rgba(11,31,51,0.92))',
                }}
              />
            </div>

            {/* Text Side */}
            <div className="p-3 sm:p-3.5 flex flex-col justify-center space-y-1">
              <div className="text-[13px] sm:text-[13.5px] font-bold tracking-tight text-white leading-tight">
                Citizen Transparency & Fair Entitlements
              </div>
              <div className="w-7 h-[2px] bg-[#FF9933] rounded-full my-0.5" />
              <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium leading-snug">
                100% Solatium • Direct DBT Compensation • Mandatory R&R Safeguards under RFCTLARR Act 2013.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Silhouette Strip */}
      <div className="relative z-10 w-full bg-[#061727] border-t border-slate-800/80 py-2 sm:py-2.5">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
            </svg>
            <span className="text-[10px] sm:text-[10.5px] text-slate-300 font-medium tracking-wide">
              National Land Acquisition Public Infrastructure (Prototype)
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-[12.5px] font-bold text-white tracking-wide font-sans">
            <span>सबका भूमि</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>सबका विकास</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>विकसित भारत</span>
          </div>

          <div className="flex items-center gap-2 text-right">
            <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <div className="text-[9px] sm:text-[9.5px] font-bold text-slate-300 leading-tight">
              <div>DEPARTMENT OF LAND RESOURCES</div>
              <div className="text-slate-400 font-medium">MINISTRY OF RURAL DEVELOPMENT</div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
