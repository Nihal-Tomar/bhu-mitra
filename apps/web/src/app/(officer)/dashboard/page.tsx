'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GovMasthead } from '@bhumitra/ui';
import { apiGetDashboard, type DashboardMetrics, type StateKpi, type RecentProject, type PriorityAction } from '../../../lib/api';

// ─── Fallback data (shown while fetching or if API unreachable) ───────────────

const FALLBACK_KPIS = {
  totalProjects: 1284,
  totalAreaHa: 4850,
  totalAreaAcquiredHa: 1800,
  compensationPaidCr: 1248,
  compensationAssessedCr: 2400,
  slaComplianceRate: 91.4,
  slaAlertsCount: 14,
  pendingObjections: 68,
};

const FALLBACK_STATE_KPIS: StateKpi[] = [
  { state: 'Gujarat', projects: 148, area: '820 Ha', areaHa: 820, sla: 94, risk: 2, color: '#FF9933' },
  { state: 'Rajasthan', projects: 112, area: '640 Ha', areaHa: 640, sla: 87, risk: 5, color: '#B42318' },
  { state: 'Maharashtra', projects: 195, area: '1,240 Ha', areaHa: 1240, sla: 91, risk: 3, color: '#155EEF' },
  { state: 'Uttar Pradesh', projects: 241, area: '1,580 Ha', areaHa: 1580, sla: 82, risk: 8, color: '#B45309' },
  { state: 'Madhya Pradesh', projects: 98, area: '520 Ha', areaHa: 520, sla: 96, risk: 1, color: '#138808' },
  { state: 'Odisha', projects: 76, area: '380 Ha', areaHa: 380, sla: 88, risk: 3, color: '#7C3AED' },
];

const FALLBACK_PROJECTS: RecentProject[] = [
  { id: 'DOLR-2026-0084', name: 'NH-48 Bharatmala Six-Laning', state: 'Gujarat', stage: 'Sec. 15 Hearing', area: '142.5 Ha', sla: 8, risk: 'high' },
  { id: 'DOLR-2026-0071', name: 'Eastern Dedicated Freight Corridor', state: 'Rajasthan', stage: 'Sec. 19 Declared', area: '310.0 Ha', sla: 24, risk: 'medium' },
  { id: 'DOLR-2026-0066', name: 'Pune–Nashik High Speed Rail', state: 'Maharashtra', stage: 'Sec. 11 Gazette', area: '218.7 Ha', sla: 45, risk: 'low' },
  { id: 'DOLR-2026-0059', name: 'Lucknow Metro Phase III', state: 'Uttar Pradesh', stage: 'Compensation', area: '64.2 Ha', sla: -3, risk: 'critical' },
  { id: 'DOLR-2026-0048', name: 'Bhopal Smart City Ring Road', state: 'Madhya Pradesh', stage: 'Sec. 23 Award', area: '95.8 Ha', sla: 32, risk: 'low' },
  { id: 'DOLR-2026-0041', name: 'Amritsar Smart City Metro', state: 'Punjab', stage: 'Sec. 15 Hearing', area: '51.3 Ha', sla: 12, risk: 'medium' },
];

const FALLBACK_PRIORITY_ACTIONS: PriorityAction[] = [
  { severity: 'critical', label: 'SLA Breach — Section 19', count: 3, detail: 'NH-48, Lucknow Metro, DFC Phase II overdue' },
  { severity: 'critical', label: 'Gazette Response Pending', count: 7, detail: 'CALA objection disposal summary not filed' },
  { severity: 'high', label: 'Disbursal Mandate Hold', count: 12, detail: 'Beneficiary account verification pending in 12 awardee cases' },
  { severity: 'high', label: 'Hearing Scheduled Today', count: 5, detail: 'Section 15 hearings — Gujarat, Rajasthan clusters' },
  { severity: 'medium', label: 'Env. Clearance Required', count: 5, detail: 'MoEF pending for forest land parcels' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function riskBadge(risk: string) {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    critical: { bg: '#FEE2E2', text: '#B42318', label: 'Critical' },
    high:     { bg: '#FEF3C7', text: '#B45309', label: 'High' },
    medium:   { bg: '#EFF6FF', text: '#155EEF', label: 'Medium' },
    low:      { bg: '#E8F5E2', text: '#137333', label: 'Low' },
  };
  return map[risk] ?? map.low;
}

function fmt(n: number | undefined): string {
  if (n === undefined) return '—';
  return n.toLocaleString('en-IN');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    let cancelled = false;
    apiGetDashboard()
      .then((data) => {
        if (!cancelled) {
          setMetrics(data);
          setIsLive(true);
          setLastUpdated(new Date(data.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
        }
      })
      .catch(() => {
        // API unreachable — silently use fallback data
        if (!cancelled) {
          setIsLive(false);
          setLastUpdated(new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }));
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Use live or fallback data
  const kpis = metrics?.kpis ?? FALLBACK_KPIS;
  const stateKpis = metrics?.stateKpis ?? FALLBACK_STATE_KPIS;
  const recentProjects = metrics?.recentProjects ?? FALLBACK_PROJECTS;
  const priorityActions = metrics?.priorityActions ?? FALLBACK_PRIORITY_ACTIONS;

  const kpiCards = [
    { id: 'dash-kpi-1', label: 'Total Projects', value: fmt(kpis.totalProjects), sub: 'All stages', color: 'var(--gov-navy)' },
    { id: 'dash-kpi-2', label: 'Total Area', value: `${fmt(kpis.totalAreaHa)} Ha`, sub: 'Under acquisition', color: '#155EEF' },
    { id: 'dash-kpi-3', label: 'Compensation Paid', value: `₹${fmt(kpis.compensationPaidCr)} Cr`, sub: 'Disbursed via PFMS-DBT', color: '#138808' },
    { id: 'dash-kpi-4', label: 'SLA Compliance', value: `${kpis.slaComplianceRate}%`, sub: 'Across all projects', color: '#7C3AED' },
    { id: 'dash-kpi-5', label: 'SLA Alerts', value: fmt(kpis.slaAlertsCount), sub: '4 critical', color: '#B42318' },
    { id: 'dash-kpi-6', label: 'Pending Objections', value: fmt(kpis.pendingObjections), sub: 'Section 15 hearings', color: '#B45309' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--surface-bg)' }}>
      <GovMasthead />

      {/* Sub-header */}
      <div style={{ background: 'var(--gov-navy)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '12px 0' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/60 hover:text-white transition-colors text-xs font-medium">
              BHUMITRA
            </Link>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-white font-semibold text-sm">National Command Centre</span>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '11px', color: isLive ? '#4ADE80' : '#FCD34D', background: isLive ? 'rgba(74,222,128,0.1)' : 'rgba(252,211,77,0.1)', border: `1px solid ${isLive ? 'rgba(74,222,128,0.2)' : 'rgba(252,211,77,0.2)'}`, borderRadius: '4px', padding: '2px 8px', fontWeight: 600 }}>
              {isLive ? '● LIVE' : '● DEMO'}
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
              {lastUpdated || 'Loading…'}
            </span>
          </div>
        </div>
      </div>

      <main id="main-content" className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Page title */}
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            National Command Centre
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Executive monitoring for land acquisition projects across all 28 States and 8 Union Territories
          </p>
        </div>

        {/* National KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {kpiCards.map((kpi) => (
            <div key={kpi.id} id={kpi.id} className="rounded-lg overflow-hidden" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-light)' }}>
              <div style={{ background: kpi.color, padding: '10px 14px' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{kpi.value}</div>
              </div>
              <div style={{ padding: '8px 12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{kpi.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>{kpi.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: State overview table */}
          <div className="lg:col-span-2">
            <div className="rounded-lg overflow-hidden" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-light)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>State-wise Acquisition Summary</h2>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Top 6 states by project count {isLive ? '· Live database data' : '· Demonstration data'}
                  </p>
                </div>
                <button type="button" className="btn-secondary" style={{ fontSize: '11px', padding: '5px 12px' }}>View All States</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="gov-table" aria-label="State-wise Acquisition Summary">
                  <thead>
                    <tr>
                      <th scope="col">State</th>
                      <th scope="col" style={{ textAlign: 'right' }}>Projects</th>
                      <th scope="col" style={{ textAlign: 'right' }}>Area</th>
                      <th scope="col">SLA Compliance</th>
                      <th scope="col" style={{ textAlign: 'right' }}>At Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stateKpis.map((row) => (
                      <tr key={row.state}>
                        <td>
                          <div className="flex items-center gap-2">
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: row.color, flexShrink: 0, display: 'inline-block' }} aria-hidden="true" />
                            <span style={{ fontSize: '13px', fontWeight: 500 }}>{row.state}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontSize: '13px', fontWeight: 600 }}>{row.projects}</td>
                        <td style={{ textAlign: 'right', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{row.area}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div style={{ flex: 1, height: 6, background: 'var(--surface-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${row.sla}%`, background: row.sla >= 90 ? '#138808' : row.sla >= 85 ? '#B45309' : '#B42318', borderRadius: 3 }} aria-label={`${row.sla}%`} />
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, minWidth: 32, textAlign: 'right', color: row.sla >= 90 ? '#137333' : row.sla >= 85 ? '#B45309' : '#B42318' }}>{row.sla}%</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: row.risk > 4 ? '#B42318' : row.risk > 2 ? '#B45309' : '#137333' }}>
                            {row.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Priority alerts */}
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>Priority Actions</h2>
            <div className="space-y-3">
              {priorityActions.map((action, i) => {
                const style = {
                  critical: { border: '#B42318', bg: '#FEF2F2', text: '#B42318', tag: '#FEE2E2', tagText: '#991B1B' },
                  high: { border: '#B45309', bg: '#FFFBEB', text: '#B45309', tag: '#FEF3C7', tagText: '#92400E' },
                  medium: { border: '#155EEF', bg: '#EFF6FF', text: '#155EEF', tag: '#DBEAFE', tagText: '#1E40AF' },
                }[action.severity as 'critical' | 'high' | 'medium'];
                return (
                  <div key={i} className="rounded" style={{ background: style!.bg, borderLeft: `3px solid ${style!.border}`, padding: '10px 12px' }}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: '2px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: style!.text }}>{action.label}</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, background: style!.tag, color: style!.tagText, borderRadius: 3, padding: '1px 5px' }}>{action.count}</span>
                        </div>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{action.detail}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Projects Table */}
        <div className="rounded-lg overflow-hidden" style={{ background: 'var(--surface-card)', border: '1px solid var(--border-light)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Active Acquisition Projects</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>RFCTLARR Act 2013 — Most recently updated</p>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="btn-secondary" style={{ fontSize: '11px', padding: '5px 12px' }}>Filter</button>
              <button type="button" className="btn-primary" style={{ fontSize: '11px', padding: '5px 12px' }}>Export</button>
            </div>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-table" aria-label="Active Acquisition Projects">
              <thead>
                <tr>
                  <th scope="col">Project ID</th>
                  <th scope="col">Project Name</th>
                  <th scope="col">State</th>
                  <th scope="col">Stage</th>
                  <th scope="col" style={{ textAlign: 'right' }}>Area</th>
                  <th scope="col">SLA Status</th>
                  <th scope="col">Risk</th>
                  <th scope="col" style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map((proj) => {
                  const rb = riskBadge(proj.risk);
                  return (
                    <tr key={proj.id}>
                      <td>
                        <code style={{ fontSize: '11px', fontFamily: 'monospace', color: '#000080', background: '#EEF1F6', padding: '2px 5px', borderRadius: 3 }}>
                          {proj.id}
                        </code>
                      </td>
                      <td>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{proj.name}</span>
                      </td>
                      <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{proj.state}</td>
                      <td>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#000080', background: '#EFF6FF', padding: '2px 7px', borderRadius: 3, border: '1px solid #DBEAFE', whiteSpace: 'nowrap' }}>
                          {proj.stage}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{proj.area}</td>
                      <td>
                        <span
                          style={{ fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap', color: proj.sla < 0 ? '#B42318' : proj.sla <= 10 ? '#B45309' : '#137333' }}
                        >
                          {proj.sla < 0 ? `${Math.abs(proj.sla)}d overdue` : `${proj.sla}d remaining`}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '10px', fontWeight: 600, background: rb.bg, color: rb.text, borderRadius: 3, padding: '2px 7px' }}>
                          {rb.label}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button type="button" style={{ fontSize: '11px', color: '#000080', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }} aria-label={`View project ${proj.id}`}>
                          View →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back link */}
        <div style={{ paddingBottom: '16px' }}>
          <Link href="/" style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }} className="hover:text-gov-navy transition-colors">
            ← Return to BHUMITRA Platform Home
          </Link>
        </div>

      </main>

      <footer style={{ background: 'var(--gov-navy-dark)', color: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 0' }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <span style={{ fontSize: '11px' }}>BHUMITRA · Department of Land Resources (DoLR) · Ministry of Rural Development · Government of India</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>NATIONAL LAND ACQUISITION INTELLIGENCE &amp; MANAGEMENT PLATFORM</span>
        </div>
      </footer>
    </div>
  );
}
