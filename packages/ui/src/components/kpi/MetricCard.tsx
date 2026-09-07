import React from 'react';
import { Card, CardContent } from '../content/Card';

export interface MetricItem {
  label: string;
  value: string | number;
  highlight?: boolean;
}

export interface MetricCardProps {
  title: string;
  metrics: MetricItem[];
  footerNote?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  metrics,
  footerNote,
  className = '',
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-4 sm:p-5 space-y-3">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-0.5">
              <span className="text-[11px] text-slate-500 block truncate">{m.label}</span>
              <span
                className={`text-sm sm:text-base font-bold font-mono tracking-tight ${
                  m.highlight ? 'text-[#0A2540]' : 'text-slate-800'
                }`}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {footerNote && (
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
            {footerNote}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
