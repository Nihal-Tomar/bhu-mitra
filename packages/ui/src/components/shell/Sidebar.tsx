'use client';

import React from 'react';
import { useLocale } from '../../localization';
import {
  LandmarkIcon,
  LayersIcon,
  FileTextIcon,
  MapPinIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  SearchIcon,
} from '../icons';

export interface SidebarNavItem {
  id: string;
  labelEn: string;
  labelHi: string;
  href: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string | number;
  active?: boolean;
}

export interface SidebarProps {
  items?: SidebarNavItem[];
  activeId?: string;
  onSelect?: (item: SidebarNavItem) => void;
  collapsed?: boolean;
  className?: string;
}

export const defaultSidebarNavItems: SidebarNavItem[] = [
  {
    id: 'dashboard',
    labelEn: 'Executive Dashboard',
    labelHi: 'प्रशासनिक डैशबोर्ड',
    href: '/dashboard',
    icon: LandmarkIcon,
  },
  {
    id: 'projects',
    labelEn: 'Acquisition Projects',
    labelHi: 'अधिग्रहण परियोजनाएं',
    href: '/projects',
    icon: LayersIcon,
    badge: '14 Active',
  },
  {
    id: 'parcels',
    labelEn: 'Land Parcels & Khasra',
    labelHi: 'भूखंड एवं खसरा अभिलेख',
    href: '/parcels',
    icon: SearchIcon,
  },
  {
    id: 'notices',
    labelEn: 'Gazette & Section 11/19',
    labelHi: 'राजपत्र एवं धारा 11/19',
    href: '/notices',
    icon: FileTextIcon,
  },
  {
    id: 'gis',
    labelEn: 'GIS Spatial Intelligence',
    labelHi: 'भू-स्थानिक मानचित्र एवं GIS',
    href: '/gis',
    icon: MapPinIcon,
  },
  {
    id: 'objections',
    labelEn: 'Objections & Hearings',
    labelHi: 'जन आपत्तियां एवं सुनवाई',
    href: '/objections',
    icon: AlertTriangleIcon,
    badge: '6 SLA',
  },
  {
    id: 'awards',
    labelEn: 'Valuation & Awards',
    labelHi: 'मूल्यांकन एवं अधिनिर्णय',
    href: '/awards',
    icon: CheckCircleIcon,
  },
  {
    id: 'disbursement',
    labelEn: 'PFMS / DBT Disbursements',
    labelHi: 'प्रत्यक्ष लाभ अंतरण (DBT)',
    href: '/disbursement',
    icon: ClockIcon,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  items = defaultSidebarNavItems,
  activeId = 'dashboard',
  onSelect,
  collapsed = false,
  className = '',
}) => {
  const { isHindi } = useLocale();

  return (
    <nav
      aria-label="Sidebar navigation"
      className={`bg-white border-r border-slate-200 flex flex-col py-4 ${
        collapsed ? 'w-16' : 'w-64'
      } ${className}`}
    >
      <div className="px-3 pb-2 mb-2 border-b border-slate-100">
        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          {collapsed ? 'NAV' : isHindi ? 'मुख्य मॉड्यूल (RFCTLARR)' : 'Core Modules (RFCTLARR)'}
        </span>
      </div>

      <div className="flex-1 space-y-1 px-2 overflow-y-auto">
        {items.map((item) => {
          const isActive = item.id === activeId || item.active;
          const Icon = item.icon || LayersIcon;
          const label = isHindi ? item.labelHi : item.labelEn;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(item)}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors text-left ${
                isActive
                  ? 'bg-[#0A2540] text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon
                size={18}
                className={isActive ? 'text-amber-400 shrink-0' : 'text-slate-500 shrink-0'}
              />
              {!collapsed && (
                <span className="flex-1 truncate">{label}</span>
              )}
              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Statutory Compliance Footer Notice */}
      {!collapsed && (
        <div className="p-3 mx-2 mt-auto rounded border border-amber-200 bg-amber-50/60 text-[11px] text-amber-900 leading-snug">
          <span className="font-semibold block">RFCTLARR Act, 2013</span>
          <span className="text-amber-700 text-[10px]">
            {isHindi
              ? 'सख्त वैधानिक समय-सीमा अनुपालन सक्रिय'
              : 'Strict statutory SLA monitoring active'}
          </span>
        </div>
      )}
    </nav>
  );
};
