import React from 'react';
import { Card, CardContent } from '../content/Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: string | number;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  accentColor?: 'navy' | 'saffron' | 'green' | 'blue';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  accentColor = 'navy',
  className = '',
}) => {
  const accentBorder = {
    navy: 'border-l-4 border-l-[#0A2540]',
    saffron: 'border-l-4 border-l-[#FF671F]',
    green: 'border-l-4 border-l-[#046A38]',
    blue: 'border-l-4 border-l-sky-600',
  }[accentColor];

  const iconBg = {
    navy: 'bg-[#0A2540]/5 text-[#0A2540]',
    saffron: 'bg-[#FF671F]/10 text-[#FF671F]',
    green: 'bg-[#046A38]/10 text-[#046A38]',
    blue: 'bg-sky-50 text-sky-700',
  }[accentColor];

  return (
    <Card className={`${accentBorder} overflow-hidden ${className}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              {title}
            </span>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tracking-tight">
              {value}
            </div>
          </div>

          {Icon && (
            <div className={`p-2.5 rounded-md shrink-0 ${iconBg}`} aria-hidden="true">
              <Icon size={20} />
            </div>
          )}
        </div>

        {(subtitle || change) && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            {change && (
              <span
                className={`font-semibold flex items-center gap-0.5 ${
                  change.trend === 'up'
                    ? 'text-emerald-700'
                    : change.trend === 'down'
                    ? 'text-rose-700'
                    : 'text-slate-600'
                }`}
                aria-label={`Trend: ${change.trend} ${change.value}`}
              >
                {change.trend === 'up' && '▲'}
                {change.trend === 'down' && '▼'}
                {change.value}
              </span>
            )}
            {subtitle && <span className="truncate">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
