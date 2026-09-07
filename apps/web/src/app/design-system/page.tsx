'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LocaleProvider,
  useLocale,
  GovMasthead,
  GovEmblem,
  Breadcrumbs,
  Tabs,
  SectionHeader,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  DataTable,
  type ColumnDef,
  StatusBadge,
  type BhuMitraStatus,
  PriorityBadge,
  SlaIndicator,
  ProgressIndicator,
  StatCard,
  MetricCard,
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  FormField,
  FileUpload,
  DatePicker,
  Stepper,
  type StepItem,
  Timeline,
  ApprovalStep,
  Alert,
  Dialog,
  ConfirmDialog,
  Tooltip,
  Popover,
  EmptyState,
  LoadingState,
  ErrorState,
  OfficialNotice,
  ReferenceNumber,
  DocumentStatus,
  AuditMetadata,
  MapContainer,
  MapToolbar,
  MapLegend,
  MapDrawer,
  MapFilterPanel,
  MapPinIcon,
  LayersIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  DownloadIcon,
} from '@bhumitra/ui';

// Interactive parcel demo records for Section F conforming to Record<string, unknown>
interface ParcelRecord extends Record<string, unknown> {
  surveyNo: string;
  village: string;
  tehsil: string;
  district: string;
  areaHa: number;
  calaOfficer: string;
  valuationInr: string;
  status: BhuMitraStatus;
}

const DEMO_PARCELS: ParcelRecord[] = [
  {
    surveyNo: '104/2B',
    village: 'Dharampur',
    tehsil: 'Vadodara Rural',
    district: 'Vadodara',
    areaHa: 2.45,
    calaOfficer: 'Dr. R. K. Sharma, IAS',
    valuationInr: '₹48,20,000',
    status: 'section11Issued',
  },
  {
    surveyNo: '108/1A',
    village: 'Kishanpur',
    tehsil: 'Anand',
    district: 'Anand',
    areaHa: 1.8,
    calaOfficer: 'Ms. P. Verma, GAS',
    valuationInr: '₹35,50,000',
    status: 'objectionPending',
  },
  {
    surveyNo: '215/3',
    village: 'Rampur Khurd',
    tehsil: 'Dabhoi',
    district: 'Vadodara',
    areaHa: 4.12,
    calaOfficer: 'Dr. R. K. Sharma, IAS',
    valuationInr: '₹82,40,000',
    status: 'section19Declared',
  },
  {
    surveyNo: '312/4C',
    village: 'Samaspur',
    tehsil: 'Padra',
    district: 'Vadodara',
    areaHa: 0.95,
    calaOfficer: 'Shri A. N. Patel, GAS',
    valuationInr: '₹19,00,000',
    status: 'valuationInProgress',
  },
  {
    surveyNo: '401/1',
    village: 'Navagam',
    tehsil: 'Anand',
    district: 'Anand',
    areaHa: 3.5,
    calaOfficer: 'Ms. P. Verma, GAS',
    valuationInr: '₹70,00,000',
    status: 'awardDeclared',
  },
  {
    surveyNo: '502/2A',
    village: 'Bhat',
    tehsil: 'Gandhinagar',
    district: 'Gandhinagar',
    areaHa: 5.2,
    calaOfficer: 'Shri S. K. Mehta, IAS',
    valuationInr: '₹1,04,00,000',
    status: 'disbursed',
  },
  {
    surveyNo: '614/7',
    village: 'Koba',
    tehsil: 'Gandhinagar',
    district: 'Gandhinagar',
    areaHa: 1.15,
    calaOfficer: 'Shri S. K. Mehta, IAS',
    valuationInr: '₹23,00,000',
    status: 'overdue',
  },
];

// Workflow Steps for Section E
const DEMO_WORKFLOW_STEPS: StepItem[] = [
  { id: '1', title: 'SIA Study', subtitle: 'Section 4-8', status: 'completed' },
  { id: '2', title: 'Sec 11 Gazette', subtitle: 'Preliminary Notice', status: 'completed' },
  { id: '3', title: 'Sec 15 Objections', subtitle: 'Hearing & Disposal', status: 'current' },
  { id: '4', title: 'Sec 19 Declaration', subtitle: 'Final Acquisition', status: 'upcoming' },
  { id: '5', title: 'Land Valuation', subtitle: 'Circle & Multiplier', status: 'upcoming' },
  { id: '6', title: 'Award Inquiry', subtitle: 'Sec 23/30 Award', status: 'upcoming' },
  { id: '7', title: 'DBT Disbursement', subtitle: 'PFMS e-Transfer', status: 'upcoming' },
  { id: '8', title: 'Possession & Mutation', subtitle: 'Revenue Records', status: 'upcoming' },
];

function DesignSystemShowcaseContent() {
  const { locale, setLocale, t } = useLocale();

  // Navigation tab state
  const [activeNavTab, setActiveNavTab] = useState('overview');

  // Interactive Form State (Section G)
  const [formData, setFormData] = useState({
    projectName: 'NH-48 Six-Laning Corridor (Vadodara–Surat Section)',
    gazetteNo: 'DL-33004/99/2026-SEC11-042',
    actStatute: 'rfctlarr2013',
    landType: 'agricultural',
    totalArea: '142.50',
    estimatedBeneficiaries: '320',
    hearingHeld: true,
    envClearance: true,
    urgencyClause: 'no',
    notes: 'Preliminary survey completed. Boundary pillar pegging in progress.',
  });

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<string | null>(null);

  // Map primitive states (Section I)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isMapDrawerOpen, setIsMapDrawerOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<ParcelRecord | null>(null);

  const columns: ColumnDef<ParcelRecord>[] = [
    {
      key: 'surveyNo',
      header: 'Survey Number',
      sortable: true,
      render: (p) => (
        <span className="font-mono font-semibold text-[#0A2540]">{p.surveyNo}</span>
      ),
    },
    {
      key: 'village',
      header: 'Village / Tehsil',
      render: (p) => (
        <div>
          <div className="font-medium text-slate-800">{p.village}</div>
          <div className="text-[11px] text-slate-500">{p.tehsil}</div>
        </div>
      ),
    },
    {
      key: 'district',
      header: 'District',
      sortable: true,
    },
    {
      key: 'areaHa',
      header: 'Area (Hectares)',
      align: 'right',
      sortable: true,
      render: (p) => (
        <span className="font-mono font-medium">{p.areaHa.toFixed(2)} Ha</span>
      ),
    },
    {
      key: 'valuationInr',
      header: 'Est. Valuation',
      align: 'right',
      render: (p) => <span className="font-mono text-emerald-800">{p.valuationInr}</span>,
    },
    {
      key: 'status',
      header: 'Statutory Status',
      render: (p) => <StatusBadge status={p.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'center',
      render: (p) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSelectedParcel(p);
            setIsMapDrawerOpen(true);
          }}
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-amber-500/20 selection:text-amber-900">
      {/* Government Masthead */}
      <GovMasthead />

      {/* Design System Header */}
      <header className="text-white border-b border-slate-800 px-4 sm:px-8 py-5 shadow-sm" style={{ background: 'var(--gov-navy)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <GovEmblem size={48} className="border-amber-400/40 bg-white/5" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                  Department of Land Resources (DoLR)
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300">Internal Design Reference</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                BHUMITRA
                <span className="text-sm sm:text-base font-normal text-slate-300 ml-3">
                  Government Design System
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Accessibility-focused, bilingual English/Hindi UI component library — WCAG 2.1 AA · Government of India Digital Standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="p-2 rounded bg-white/10 border border-white/10 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Language:</span>
              <button
                type="button"
                id="lang-toggle-showcase"
                onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}
                className="px-2.5 py-1 rounded font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                title="Toggle English / Hindi"
              >
                {locale === 'en' ? 'हिन्दी' : 'English'}
              </button>
            </div>
            <Link
              href="/"
              className="px-3 py-1.5 rounded text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 border border-white/20 transition-colors"
            >
              &larr; BHUMITRA Platform
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* Navigation Breadcrumb Trail */}
        <Breadcrumbs
          items={[
            { label: 'BHUMITRA', href: '/' },
            { label: 'Design System', href: '/design-system' },
            { label: 'Component Library' },
          ]}
        />

        {/* Section Navigation Tabs */}
        <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
          <Tabs
            tabs={[
              { id: 'overview', label: 'Identity & Colours' },
              { id: 'dashboard', label: 'Metrics & KPI' },
              { id: 'workflow', label: 'Statutory Workflow' },
              { id: 'datatable', label: 'Cadastral Table' },
              { id: 'forms', label: 'Gazette Forms' },
              { id: 'feedback', label: 'Notices & Alerts' },
              { id: 'gis', label: 'GIS & Spatial' },
            ]}
            activeTab={activeNavTab}
            onChange={setActiveNavTab}
          />
        </div>

        {/* TAB 1: IDENTITY, TOKENS & LOCALIZATION */}
        {(activeNavTab === 'overview' || activeNavTab === 'all') && (
          <section className="space-y-6">
            <SectionHeader
              title="Government Identity &amp; Localization Foundation"
              description="Official typography, restrained Indian Tricolor accents, bilingual English/Hindi dictionary, and Government emblem treatment."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Emblem & Branding Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Government Emblem & Authority</CardTitle>
                  <CardDescription>
                    Neutral, compliant emblem placeholder conforming to Indian State Emblem rules.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded bg-slate-50 border border-slate-200">
                    <GovEmblem size={48} />
                    <div>
                      <div className="font-bold text-sm text-slate-900">
                        Government of India
                      </div>
                      <div className="text-xs text-slate-600">Ministry of Rural Development</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Department of Land Resources (DoLR)
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    Designed with an accessible label, zero false Ashoka Lion imitation, and clean asset
                    slots for official SVGs upon ministerial deployment.
                  </div>
                </CardContent>
              </Card>

              {/* Color Palette & Tricolor Accents */}
              <Card>
                <CardHeader>
                  <CardTitle>Restrained Palette & Tricolor Accents</CardTitle>
                  <CardDescription>
                    Government navy, Ashoka blue, Indian saffron, and Indian green accents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-[#0A2540] text-white">
                      <span className="font-semibold">Deep Navy (Primary)</span>
                      <span className="font-mono text-[11px]">#0A2540</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#FF671F] text-white font-semibold">
                      <span>Indian Saffron Accent</span>
                      <span className="font-mono text-[11px]">#FF671F</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#046A38] text-white font-semibold">
                      <span>Indian Green Accent</span>
                      <span className="font-mono text-[11px]">#046A38</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#000080] text-white font-semibold">
                      <span>Ashoka Chakra Blue</span>
                      <span className="font-mono text-[11px]">#000080</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bilingual Terminology Dictionary */}
              <Card>
                <CardHeader>
                  <CardTitle>Bilingual Terminology ({locale.toUpperCase()})</CardTitle>
                  <CardDescription>
                    Real-time English ↔ Hindi land acquisition dictionary terms.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Land Acquisition:</span>
                    <strong className="text-slate-900">{t('landAcquisition')}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Gazette Notification:</span>
                    <strong className="text-slate-900">{t('notification')}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Public Hearing / Consent:</span>
                    <strong className="text-slate-900">{t('consent')}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Valuation & Market Value:</span>
                    <strong className="text-slate-900">{t('valuation')}</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Statutory Award:</span>
                    <strong className="text-slate-900">{t('award')}</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Direct Benefit Transfer:</span>
                    <strong className="text-slate-900">{t('disbursement')}</strong>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* TAB 2: METRICS & KPI DASHBOARD */}
        {(activeNavTab === 'dashboard' || activeNavTab === 'all') && (
          <section className="space-y-6">
            <SectionHeader
              title="Metrics, KPI & SLA Indicators"
              description="High-density statistical metrics, statutory deadline tracking, and status badge spectrum for RFCTLARR Act 2013 compliance."
            />

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title={t('totalAreaAcquired')}
                value="4,850.40 Ha"
                subtitle="Across 18 State Highway Corridors"
                change={{ value: '+12.4%', trend: 'up', label: 'vs last quarter' }}
                icon={LayersIcon}
                accentColor="navy"
              />
              <StatCard
                title={t('compensationDisbursed')}
                value="₹1,248.50 Cr"
                subtitle="100% PFMS direct account credit"
                change={{ value: '₹142 Cr', trend: 'up', label: 'past 30 days' }}
                icon={CheckCircleIcon}
                accentColor="green"
              />
              <StatCard
                title={t('pendingSla')}
                value="14 Alerts"
                subtitle="Within 15 days of statutory lapse"
                change={{ value: '4 critical', trend: 'down' }}
                icon={AlertTriangleIcon}
                accentColor="saffron"
              />
              <StatCard
                title="Active Land Parcels"
                value="18,420 Plots"
                subtitle="Digitized via Bhunaksha GIS"
                icon={MapPinIcon}
                accentColor="blue"
              />
            </div>

            {/* Metric Cards & Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Section 11 to 19 Statutory Conversion"
                metrics={[
                  { label: 'Conversion Rate', value: '91.4%', highlight: true },
                  { label: 'SLA Benchmark', value: '88.0%' },
                  { label: 'Avg Duration', value: '7.8 Mo' },
                ]}
                footerNote="82 of 90 projects completed statutory inquiry within the mandated 12-month window under RFCTLARR Section 19(7)."
              />
              <MetricCard
                title="Direct Beneficiary DBT Success"
                metrics={[
                  { label: 'Success Rate', value: '99.82%', highlight: true },
                  { label: 'Aadhaar Seeded', value: '100%' },
                  { label: 'Escrow Fallback', value: '0.18%' },
                ]}
                footerNote="Failed transactions automatically routed to District Escrow with instant SMS grievance alert."
              />
              <Card>
                <CardHeader>
                  <CardTitle>Milestone Progress & SLA Trackers</CardTitle>
                  <CardDescription>Live statutory timer compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ProgressIndicator
                    label="Vadodara–Surat Section Progress"
                    value={68}
                    max={100}
                  />
                  <div className="flex flex-wrap gap-2 pt-2">
                    <SlaIndicator daysRemaining={42} statutoryLimitDate="18-Oct-2026" />
                    <SlaIndicator daysRemaining={6} statutoryLimitDate="10-Sep-2026" />
                    <SlaIndicator daysRemaining={-8} statutoryLimitDate="27-Aug-2026" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Badges Full Spectrum */}
            <Card>
              <CardHeader>
                <CardTitle>Statutory Status Badge Hierarchy (Non-Color Dependent)</CardTitle>
                <CardDescription>
                  Combining explicit textual indicators, high-contrast borders, and distinctive iconography.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2.5">
                  <StatusBadge status="draft" />
                  <StatusBadge status="submitted" />
                  <StatusBadge status="underReview" />
                  <StatusBadge status="section11Issued" />
                  <StatusBadge status="objectionPending" />
                  <StatusBadge status="section19Declared" />
                  <StatusBadge status="valuationInProgress" />
                  <StatusBadge status="awardDeclared" />
                  <StatusBadge status="disbursed" />
                  <StatusBadge status="completed" />
                  <StatusBadge status="escalated" />
                  <StatusBadge status="overdue" />
                  <StatusBadge status="onHold" />
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap gap-2 items-center text-xs">
                  <span className="font-semibold text-slate-700 mr-2">Priority Levels:</span>
                  <PriorityBadge priority="urgent" />
                  <PriorityBadge priority="high" />
                  <PriorityBadge priority="medium" />
                  <PriorityBadge priority="low" />
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* TAB 3: STATUTORY WORKFLOW */}
        {(activeNavTab === 'workflow' || activeNavTab === 'all') && (
          <section className="space-y-6">
            <SectionHeader
              title="Statutory Acquisition Workflow & Audit Timeline"
              description="RFCTLARR Act 2013 acquisition sequence with digital approval trail — NH-48 Bharatmala Project (Demonstration Data)."
            />

            {/* Horizontal Workflow Stepper */}
            <Card>
              <CardHeader>
                <CardTitle>Mandated RFCTLARR Acquisition Sequence</CardTitle>
                <CardDescription>
                  Step progression highlighting completed, active, and scheduled statutory phases.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Stepper steps={DEMO_WORKFLOW_STEPS} activeStepId="3" />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Event Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Official Project Audit Trail</CardTitle>
                  <CardDescription>Chronological log of gazette orders and field hearings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Timeline
                    events={[
                      {
                        id: 'e1',
                        timestamp: '14 May 2026, 11:30 AM',
                        title: 'Section 4 Social Impact Assessment Report Accepted',
                        description: 'Expert Group submitted report confirming public purpose for highway corridor.',
                        actor: 'State Nodal Officer (DoLR)',
                        statusBadge: <StatusBadge status="completed" size="sm" />,
                      },
                      {
                        id: 'e2',
                        timestamp: '02 June 2026, 04:15 PM',
                        title: 'Section 11 Preliminary Notification Gazetted',
                        description: 'Published in District Gazette No. DL-33004/99 and two local newspapers.',
                        actor: 'CALA / Additional District Collector',
                        statusBadge: <StatusBadge status="section11Issued" size="sm" />,
                      },
                      {
                        id: 'e3',
                        timestamp: '18 August 2026, 10:00 AM',
                        title: 'Public Objection Hearing Commenced (Section 15)',
                        description: '42 landowner claims filed regarding tree enumeration and crop compensation.',
                        actor: 'CALA Hearing Courtroom',
                        statusBadge: <StatusBadge status="objectionPending" size="sm" />,
                      },
                    ]}
                  />
                </CardContent>
              </Card>

              {/* Digital Approvals Box */}
              <div className="space-y-4">
                <ApprovalStep
                  roleTitle="Competent Authority Land Acquisition (CALA)"
                  officerName="Dr. R. K. Sharma, IAS (District Collector)"
                  status="approved"
                  timestamp="02-Jun-2026 16:15:30 IST"
                  remarks="Section 11 notification text verified against Bhunaksha geo-coordinates. Forwarded for state gazette."
                />
                <ApprovalStep
                  roleTitle="State Nodal Officer (Revenue Department)"
                  officerName="Shri A. K. Sengupta, IAS"
                  status="approved"
                  timestamp="04-Jun-2026 10:20:12 IST"
                  remarks="Budget estimate of ₹184 Cr approved under Ministry allocation head 5054."
                />
                <ApprovalStep
                  roleTitle="Central Monitoring Division (DoLR, New Delhi)"
                  officerName="Smt. Meenakshi Sundaram, Joint Secretary"
                  status="pending"
                  remarks="Awaiting completion of Section 15 objection disposal summary."
                />
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: CADASTRAL DATA TABLE */}
        {(activeNavTab === 'datatable' || activeNavTab === 'all') && (
          <section className="space-y-6">
            <SectionHeader
              title="Cadastral Parcel Data Table"
              description="Enterprise-grade data table with multi-column sorting, search, pagination, and row inspection — RFCTLARR Section 11 &amp; Section 19 register."
            />

            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Acquisition Parcel Register</CardTitle>
                  <CardDescription>
                    Interactive record of parcels under RFCTLARR Section 11 & Section 19
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <DownloadIcon size={14} className="mr-1.5" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 sm:p-0">
                <DataTable<ParcelRecord>
                  columns={columns}
                  data={DEMO_PARCELS}
                  keyExtractor={(p) => p.surveyNo}
                  searchable
                  searchPlaceholder="Filter Survey, Village, Tehsil..."
                  pageSize={5}
                />
              </CardContent>
            </Card>
          </section>
        )}

        {/* TAB 5: GOVERNMENT FORMS */}
        {(activeNavTab === 'forms' || activeNavTab === 'all') && (
          <section className="space-y-6">
            <SectionHeader
              title="Gazette Declaration Form"
              description="Section 11 Preliminary Notification form — conforming to RFCTLARR (Compensation &amp; Rehabilitation) Rules. Demonstration UI only."
            />

            <Card>
              <CardHeader>
                <CardTitle>Section 11 Gazette Declaration Draft Form</CardTitle>
                <CardDescription>
                  Conforming to Form 11 prescribed under RFCTLARR (Compensation & Rehabilitation) Rules.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    id="projectName"
                    label="Public Project Name"
                    required
                    description="Official statutory project name approved by Central Ministry"
                  >
                    <Input
                      id="projectName"
                      value={formData.projectName}
                      onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    />
                  </FormField>

                  <FormField
                    id="gazetteNo"
                    label="Gazette Notification Reference Number"
                    required
                    description="Standard numbering format: STATE/DIST/YEAR/SEC11/NO"
                  >
                    <Input
                      id="gazetteNo"
                      value={formData.gazetteNo}
                      onChange={(e) => setFormData({ ...formData, gazetteNo: e.target.value })}
                    />
                  </FormField>

                  <FormField id="actStatute" label="Statutory Act Authority" required>
                    <Select
                      id="actStatute"
                      value={formData.actStatute}
                      onChange={(e) => setFormData({ ...formData, actStatute: e.target.value })}
                      options={[
                        { value: 'rfctlarr2013', label: 'RFCTLARR Act 2013 (National Default)' },
                        { value: 'nhai1956', label: 'National Highways Act 1956 (Section 3A)' },
                        { value: 'railways1989', label: 'Railways Act 1989 (Special Railway Project)' },
                      ]}
                    />
                  </FormField>

                  <FormField id="landType" label="Primary Land Classification" required>
                    <Select
                      id="landType"
                      value={formData.landType}
                      onChange={(e) => setFormData({ ...formData, landType: e.target.value })}
                      options={[
                        { value: 'agricultural', label: 'Agricultural (Irrigated Multi-Crop)' },
                        { value: 'dry_agricultural', label: 'Agricultural (Dry / Single Crop)' },
                        { value: 'commercial', label: 'Commercial / Industrial' },
                        { value: 'residential', label: 'Abadi / Rural Residential' },
                      ]}
                    />
                  </FormField>

                  <FormField id="totalArea" label="Total Area (in Hectares)" required>
                    <Input
                      id="totalArea"
                      type="number"
                      step="0.01"
                      value={formData.totalArea}
                      onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                    />
                  </FormField>

                  <FormField id="estBeneficiaries" label="Estimated Project Affected Families (PAFs)">
                    <Input
                      id="estBeneficiaries"
                      type="number"
                      value={formData.estimatedBeneficiaries}
                      onChange={(e) =>
                        setFormData({ ...formData, estimatedBeneficiaries: e.target.value })
                      }
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <FormField
                    id="gazetteDate"
                    label="Proposed Gazette Publication Date"
                    required
                    description="Must allow 60 statutory days for filing Section 15 objections"
                  >
                    <DatePicker
                      id="gazetteDate"
                      value="2026-10-01"
                      onChange={() => {}}
                    />
                  </FormField>

                  <FormField
                    id="gazetteDoc"
                    label="Draft Gazette Order & Schedule of Lands (PDF)"
                    description="Upload scanned gazette notification draft signed by CALA"
                  >
                    <FileUpload
                      label="Upload Gazette Order Draft"
                      accept=".pdf,.png,.jpg"
                      description="Supported files: PDF, PNG up to 25MB"
                    />
                  </FormField>
                </div>

                <FormField id="notes" label="Statutory Notes & Land Description">
                  <Textarea
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </FormField>

                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="text-xs font-semibold text-slate-800">
                    Mandatory Statutory Declarations:
                  </div>
                  <Checkbox
                    id="hearingHeld"
                    checked={formData.hearingHeld}
                    onChange={(e) => setFormData({ ...formData, hearingHeld: e.target.checked })}
                    label="Gram Sabha / Public Consultation conducted as per Section 4(2)"
                    description="Confirmed resolution minutes deposited in District Revenue archive."
                  />
                  <Checkbox
                    id="envClearance"
                    checked={formData.envClearance}
                    onChange={(e) => setFormData({ ...formData, envClearance: e.target.checked })}
                    label="Expert Group Social Impact Appraisal submitted without statutory reservation"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <label className="text-xs font-semibold text-slate-800 block mb-2">
                    Application of Urgency Clause (Section 40):
                  </label>
                  <RadioGroup
                    name="urgencyClause"
                    value={formData.urgencyClause}
                    onChange={(val) => setFormData({ ...formData, urgencyClause: val })}
                    options={[
                      {
                        value: 'no',
                        label: 'Standard Workflow (Section 15 Objections Hearing enabled — 60 days)',
                      },
                      {
                        value: 'yes',
                        label: 'Urgency Invoked (Restricted to National Defence / Natural Disaster)',
                      },
                    ]}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => alert('Draft reset.')}>
                  Reset Form
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => alert('Draft saved to session storage.')}
                  >
                    Save Draft
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsConfirmDialogOpen(true)}
                  >
                    Submit Gazette Order
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </section>
        )}

        {/* TAB 6: NOTICES, AUDIT & FEEDBACK */}
        {(activeNavTab === 'feedback' || activeNavTab === 'all') && (
          <section className="space-y-6">
            <SectionHeader
              title="Official Notices, Alerts &amp; Audit Trail"
              description="Statutory gazette notification templates, reference numbers with copy actions, system alerts, confirmation dialogs, and approval audit trail."
            />

            {/* Official Notice Example */}
            <OfficialNotice
              gazetteNumber="DL-33004/99/2026-SEC11-042"
              section="Section 11(1) of Act 30 of 2013"
              issueDate="02 June 2026"
              issuingAuthority="Competent Authority & District Collector, Vadodara"
              title="PRELIMINARY NOTIFICATION FOR ACQUISITION OF LAND FOR PUBLIC PURPOSE"
            >
              <p className="mb-2">
                Whereas it appears to the Appropriate Government that a total of{' '}
                <strong>142.50 Hectares</strong> of land is required in the villages of{' '}
                <em>Dharampur, Kishanpur, and Rampur Khurd</em> for a public purpose, namely the
                construction of the NH-48 Six-Laning Corridor.
              </p>
              <p>
                Any person interested in any land which has been notified may within sixty days from the
                date of publication of this notice object to the acquisition of land under Section 15 of
                the Act before the Competent Authority.
              </p>
            </OfficialNotice>

            {/* Identifiers & Audit Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statutory Identifiers & Document Status</CardTitle>
                  <CardDescription>Reference number tokens with one-click copy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <ReferenceNumber value="NH-48/SEC11/2026/092" prefix="NOTIF" />
                    <ReferenceNumber value="GJ-VAD-2026-PAR-104" prefix="PARCEL" />
                    <ReferenceNumber value="PFMS-DBT-2026-TX-883" prefix="DBT" />
                  </div>

                  <DocumentStatus
                    documentType="Gazette Publication Certificate"
                    documentNumber="eGazette/2026/DoLR/09281"
                    status="published"
                    publishedDate="02-Jun-2026"
                    signatory="Under Secretary, Government of India"
                    verificationHash="SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
                  />
                </CardContent>
              </Card>

              {/* CAG Audit Trail Box */}
              <Card>
                <CardHeader>
                  <CardTitle>Statutory Audit Trail</CardTitle>
                  <CardDescription>Immutable transaction logging representation</CardDescription>
                </CardHeader>
                <CardContent>
                  <AuditMetadata
                    createdAt="2026-06-02 16:15:32 UTC+05:30"
                    officerId="GOI-NIC-DL-88301"
                    officerRole="District Collector / CALA (Vadodara)"
                    ipAddress="10.14.92.110 (NICNET Secure Gateway)"
                    transactionHash="0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Alerts & Feedback States */}
            <div className="space-y-3">
              <Alert variant="info" title="Statutory Notice Period Active">
                Section 15 objection window is open until 01-Aug-2026 (38 days remaining). Hearings are
                scheduled every Tuesday at the Sub-Divisional Magistrate Court.
              </Alert>
              <Alert variant="success" title="PFMS Account Verification Complete">
                100% of the 320 project-affected bank accounts have been Aadhaar-validated for direct benefit
                transfer.
              </Alert>
              <Alert variant="warning" title="Circle Rate Discrepancy Flagged">
                Tehsil Dabhoi village boundary requires alignment with Gujarat Jantri 2026 revision rates.
              </Alert>
              <Alert variant="error" title="Statutory Deadline Warning">
                Four parcels exceed the 12-month preliminary declaration window under Section 19(7). Action
                required to prevent lapse.
              </Alert>
            </div>

            {/* Modal Controls Demonstration */}
            <Card>
              <CardHeader>
                <CardTitle>Accessible Dialogs & Overlays</CardTitle>
                <CardDescription>
                  Keyboard-accessible focus-trapped dialogs and confirmations.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                <Button id="btn-open-dialog" variant="secondary" onClick={() => setIsDialogOpen(true)}>
                  Open Informational Dialog
                </Button>
                <Button id="btn-open-confirm" variant="destructive" onClick={() => setIsConfirmDialogOpen(true)}>
                  Trigger Confirmation Modal
                </Button>

                <Tooltip content="Direct Benefit Transfer via Public Financial Management System">
                  <span className="px-3 py-1.5 rounded bg-slate-200 text-xs font-semibold text-slate-800 cursor-help">
                    Hover for Tooltip (PFMS)
                  </span>
                </Tooltip>

                <Popover
                  trigger={
                    <Button variant="outline" size="sm">
                      Open Officer Notes Popover
                    </Button>
                  }
                  title="Field Survey Notes"
                >
                  <p className="text-xs text-slate-600 leading-normal">
                    Ground verification completed on 24-Aug-2026. No religious structures or school grounds
                    lie inside the 60m right-of-way alignment.
                  </p>
                </Popover>
              </CardContent>
            </Card>

            {/* Empty, Loading, and Error States */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EmptyState
                title="No Pending Objections Found"
                description="All landowner objections under Section 15 for this village have been disposed of by the Competent Authority."
                action={{ label: 'View Archived Hearings', onClick: () => alert('Archived view') }}
              />
              <LoadingState message="Fetching live Bhunaksha geo-coordinates..." />
              <ErrorState
                title="NIC Land Record Gateway Timeout"
                description="Unable to reach State Revenue RoR API. Please verify VPN gateway or retry in 30 seconds."
                action={{ label: 'Retry Connection', onClick: () => alert('Retrying...') }}
              />
            </div>
          </section>
        )}

        {/* TAB 7: GIS CHROME & MAP PRIMITIVES */}
        {(activeNavTab === 'gis' || activeNavTab === 'all') && (
          <section className="space-y-6">
            <SectionHeader
              title="GIS Map Interface &amp; Spatial Chrome"
              description="Map layout surfaces, layer controls, cadastral legends, spatial filter panels, and parcel detail drawers — ready for MapLibre / PostGIS vector tile integration."
            />

            <Card>
              <CardHeader>
                <CardTitle>Cadastral Spatial Viewer (Chrome Demo)</CardTitle>
                <CardDescription>
                  Clean user-interface overlays ready for MapLibre / PostGIS vector tiles in Stage 7.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 sm:p-0">
                <MapContainer height="460px">
                  {/* Floating Spatial Filter Button */}
                  <MapFilterPanel
                    isOpen={isFilterPanelOpen}
                    onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                  >
                    <div className="space-y-2">
                      <div className="font-bold text-slate-800 pb-1 border-b border-slate-100">
                        Layer Filters
                      </div>
                      <Checkbox id="f1" label="Section 11 Preliminary Parcels" defaultChecked />
                      <Checkbox id="f2" label="Section 19 Declared Corridors" defaultChecked />
                      <Checkbox id="f3" label="Disputed & Litigated Plots" defaultChecked />
                      <Checkbox id="f4" label="Forest & Eco-Sensitive Buffers" />
                    </div>
                  </MapFilterPanel>

                  {/* Floating Top-Right Map Toolbar */}
                  <MapToolbar position="top-right">
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                      title="Toggle Cadastral Layer"
                    >
                      <LayersIcon size={16} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                      title="Reset North / Center"
                    >
                      <RefreshCwIcon size={16} />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 rounded hover:bg-slate-100 text-slate-700"
                      title="Measure Distance"
                    >
                      <MapPinIcon size={16} />
                    </button>
                  </MapToolbar>

                  {/* Simulated interactive parcel pins on the grid */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="p-4 rounded-xl bg-white/90 backdrop-blur-xs border border-slate-300 shadow-lg text-center max-w-sm pointer-events-auto">
                      <div className="w-10 h-10 rounded-full bg-[#0A2540] text-amber-400 mx-auto flex items-center justify-center mb-2">
                        <MapPinIcon size={20} />
                      </div>
                      <div className="font-bold text-sm text-slate-900">
                        NH-48 Corridor Alignment KM 112–148
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Vadodara Rural &bull; 142.50 Ha &bull; 320 Affected Landowners
                      </div>
                      <Button
                        id="btn-inspect-parcel-grid"
                        size="sm"
                        variant="primary"
                        className="mt-3 w-full"
                        onClick={() => {
                          setSelectedParcel(DEMO_PARCELS[0]);
                          setIsMapDrawerOpen(true);
                        }}
                      >
                        Inspect Active Parcel (Survey 104/2B)
                      </Button>
                    </div>
                  </div>

                  {/* Bottom Left Cadastral Legend */}
                  <MapLegend
                    title="Cadastral Overlay Legend"
                    position="bottom-left"
                    items={[
                      { color: '#FF671F', label: 'Section 11 Preliminary Notification' },
                      { color: '#046A38', label: 'Compensation Disbursed (Award Final)' },
                      { color: '#DC2626', label: 'Pending Objections / High Court Stay' },
                      { color: '#0A2540', label: 'Proposed Right-of-Way (60m)' },
                    ]}
                  />

                  {/* Right-hand side Map Drawer */}
                  <MapDrawer
                    isOpen={isMapDrawerOpen}
                    onClose={() => setIsMapDrawerOpen(false)}
                    title={`Parcel Inspection: ${selectedParcel?.surveyNo || '104/2B'}`}
                  >
                    {selectedParcel && (
                      <div className="space-y-4">
                        <div>
                          <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                            Survey Number
                          </div>
                          <div className="text-lg font-bold font-mono text-[#0A2540]">
                            {selectedParcel.surveyNo}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500">Village:</span>
                            <div className="font-semibold">{selectedParcel.village}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Tehsil:</span>
                            <div className="font-semibold">{selectedParcel.tehsil}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">District:</span>
                            <div className="font-semibold">{selectedParcel.district}</div>
                          </div>
                          <div>
                            <span className="text-slate-500">Total Area:</span>
                            <div className="font-semibold font-mono">{selectedParcel.areaHa} Ha</div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="text-slate-500">Competent Authority:</div>
                          <div className="font-semibold text-slate-800">
                            {selectedParcel.calaOfficer}
                          </div>
                          <div className="text-slate-500 pt-1">Estimated Valuation:</div>
                          <div className="font-bold text-emerald-700 font-mono">
                            {selectedParcel.valuationInr}
                          </div>
                        </div>

                        <div>
                          <div className="text-slate-500 text-xs mb-1">Statutory Status:</div>
                          <StatusBadge status={selectedParcel.status} />
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full"
                            onClick={() => alert(`Opening statutory dossier for ${selectedParcel.surveyNo}`)}
                          >
                            Open Complete Land Dossier &rarr;
                          </Button>
                        </div>
                      </div>
                    )}
                  </MapDrawer>
                </MapContainer>
              </CardContent>
            </Card>
          </section>
        )}
      </main>

      {/* Informational Dialog */}
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Department of Land Resources (DoLR) — Design Guidelines"
        description="Statutory user interface principles for Indian land administration."
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsDialogOpen(false)}>
            Close Guidelines
          </Button>
        }
      >
        <div className="space-y-3 text-xs leading-relaxed text-slate-700">
          <p>
            The Bhu-Mitra Design System enforces three primary digital governance rules:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
            <li>
              <strong>Accessible by Default:</strong> All text and status indicators must maintain
              high visual contrast and never rely exclusively on color.
            </li>
            <li>
              <strong>Bilingual First:</strong> English and Hindi (Devanagari) are foundational. Layouts
              must accommodate variations in Devanagari line height and text length.
            </li>
            <li>
              <strong>Transparent Audit Trails:</strong> Every transaction and statutory step displays
              the responsible officer authority, reference code, and cryptographic verification hash.
            </li>
          </ol>
        </div>
      </Dialog>

      {/* Confirm Action Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => {
          setIsConfirmDialogOpen(false);
          setConfirmStatus('Section 11 Gazette Declaration successfully published (Demo)');
          setTimeout(() => setConfirmStatus(null), 4000);
        }}
        title="Confirm Gazette Publication Order"
        message="Are you sure you want to finalize and digitally sign this Section 11 Preliminary Notification? This will generate public notice records and initiate the 60-day objection timeline."
        confirmLabel="Sign & Gazette Order"
        variant="primary"
      />

      {confirmStatus && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-emerald-900 text-white border border-emerald-700 shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircleIcon size={16} />
          <span>{confirmStatus}</span>
        </div>
      )}

      {/* Government Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white px-6 py-6 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GovEmblem size={32} />
            <div>
              <div className="font-semibold text-slate-900">
                BHUMITRA Design System • Department of Land Resources (DoLR)
              </div>
              <div className="text-[11px] text-slate-500">
                Government of India &bull; Ministry of Rural Development &bull; Internal Reference
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>WCAG 2.1 AA &bull; GIGW 3.0 Aligned</span>
            <span>&bull;</span>
            <Link href="/" className="text-[#0F2D4A] font-semibold hover:underline">
              ← BHUMITRA Platform
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DesignSystemPage() {
  return (
    <LocaleProvider>
      <DesignSystemShowcaseContent />
    </LocaleProvider>
  );
}
