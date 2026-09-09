'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@bhumitra/ui';

export const SectorSelectionSection: React.FC = () => {
  const { isHindi, t } = useLocale();

  const sectorCards = [
    {
      id: 'highways',
      title: t('sector.highways', 'Highways & Expressways'),
      desc: t('sector.highwaysDesc', 'Bharatmala corridors, national highway expansion, bypasses, and access-controlled expressways.'),
      icon: '🛣️',
      projects: 540,
      land: '24,600 Ha',
      risk: isHindi ? 'कम जोखिम' : 'Low Risk',
      riskColor: 'bg-emerald-100 text-emerald-800',
      href: '/infrastructure?sector=highways',
    },
    {
      id: 'railways',
      title: t('sector.railways', 'Railways & Freight Corridors'),
      desc: t('sector.railwaysDesc', 'Dedicated Freight Corridors (DFC), High Speed Rail (Bullet Train), and regional multi-tracking.'),
      icon: '🚆',
      projects: 312,
      land: '12,400 Ha',
      risk: isHindi ? 'मध्यम जोखिम' : 'Medium Risk',
      riskColor: 'bg-blue-100 text-blue-800',
      href: '/infrastructure?sector=railways',
    },
    {
      id: 'renewable',
      title: t('sector.renewable', 'Renewable Energy & Power'),
      desc: t('sector.renewableDesc', 'Ultra-mega solar parks, wind turbine zones, green energy corridors, and high-voltage transmission.'),
      icon: '⚡',
      projects: 185,
      land: '7,800 Ha',
      risk: isHindi ? 'कम जोखिम' : 'Low Risk',
      riskColor: 'bg-emerald-100 text-emerald-800',
      href: '/infrastructure?sector=renewable',
    },
    {
      id: 'urban',
      title: t('sector.urban', 'Urban Infrastructure & Metro'),
      desc: t('sector.urbanDesc', 'Metro rail networks, smart city peripheral ring roads, multi-modal transport hubs, and grade separators.'),
      icon: '🏙️',
      projects: 142,
      land: '2,350 Ha',
      risk: isHindi ? 'गंभीर जोखिम' : 'Critical Risk',
      riskColor: 'bg-red-100 text-red-800',
      href: '/infrastructure?sector=urban',
    },
    {
      id: 'industrial',
      title: t('sector.industrial', 'Industrial & Strategic Corridors'),
      desc: t('sector.industrialDesc', 'National Industrial Corridors (NICDIT), Multi-Modal Logistics Parks (MMLP), ports, and defense nodes.'),
      icon: '🏭',
      projects: 105,
      land: '1,350 Ha',
      risk: isHindi ? 'उच्च जोखिम' : 'High Risk',
      riskColor: 'bg-amber-100 text-amber-800',
      href: '/infrastructure?sector=industrial',
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-[#F8FAFC] border-b border-slate-200/80">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0C5A37] uppercase tracking-widest bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
              <span>{isHindi ? 'बुनियादी ढांचा क्षेत्र चयन' : 'Infrastructure Sectors'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2540] tracking-tight">
              {t('home.sectorTitle', 'Choose an Infrastructure Sector')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t('home.sectorSubtitle', 'Drill down into corridor alignments, affected parcels, and statutory progress across national priority sectors.')}
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/infrastructure"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm font-bold text-[#0C5A37] hover:text-[#084228] hover:underline flex items-center gap-1.5"
            >
              <span>{isHindi ? 'सभी क्षेत्र देखें' : 'View All Sectors'}</span>
              <span>↗</span>
            </Link>
          </div>
        </div>

        {/* 5 Compact Sector Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {sectorCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0C5A37] transition-all p-5 flex flex-col justify-between space-y-4 group cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{card.icon}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${card.riskColor}`}>
                    {card.risk}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#0B2540] group-hover:text-[#0C5A37] transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed mt-1 line-clamp-2">
                    {card.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">{isHindi ? 'परियोजनाएं' : 'Projects'}:</span>
                  <span className="font-bold text-slate-900">{card.projects}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">{isHindi ? 'भूमि क्षेत्र' : 'Land Area'}:</span>
                  <span className="font-bold text-[#138808]">{card.land}</span>
                </div>
                <div className="text-[11px] font-bold text-[#0C5A37] flex items-center justify-end gap-1 pt-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{isHindi ? 'आसूचना खोलें' : 'Sector Intel'}</span>
                  <span>↗</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
