# Bhu-Mitra Government Design System & UI Component Library (`@bhumitra/ui`)

> **Stage 2 Deliverable** — Department of Land Resources (DoLR), Ministry of Rural Development, Government of India.
> Purpose-built for the National Land Acquisition Intelligence & Management Platform (SIH 2026 Problem Statement 26016).

---

## 1. Design Philosophy

The Bhu-Mitra Design System bridges **Government Credibility**, **Indian Identity**, and **Enterprise UX**:

1. **Credibility & Trust**: Clean, restrained aesthetics prioritizing high information density, clear statutory hierarchy, and transparency.
2. **Accessible by Default**: Designed toward WCAG 2.1 AA and aligned with Guidelines for Indian Government Websites (GIGW 3.0). Never relies on color alone to convey critical statutory states.
3. **Bilingual Foundation**: First-class support for English and Hindi (Devanagari script), designed with flexible spacing to accommodate varying line lengths without clipping.
4. **Transparent Auditability**: Every notification, approval, and transaction exposes responsible officer identity, timestamp, and verification hashes.
5. **Civic Emblem Compliance**: Uses an accessible national asset slot (`GovEmblem`) with zero counterfeit imitation of the protected State Emblem of India.

---

## 2. Design Tokens (`packages/ui/src/tokens/`)

### Colors (`colors.ts`)
* **Primary Navy**: `#0A2540` — National governance authority, deep administrative depth.
* **Secondary Slate**: `#334155` to `#0F172A` — Neutral backgrounds, card borders, and high-contrast text.
* **Indian Saffron Accent**: `#FF671F` — Restrained statutory alerts and section highlights.
* **Indian Green Accent**: `#046A38` — Disbursed compensation, validated surveys, and success states.
* **Ashoka Blue**: `#000080` — Focus indicators, link highlights, and civic insignia.
* **Semantic Spectrum**:
  - `success`: `#046A38` / `#ECFDF5`
  - `warning`: `#D97706` / `#FFFBEB`
  - `error`: `#DC2626` / `#FEF2F2`
  - `info`: `#0284C7` / `#F0F9FF`

### Typography (`typography.ts`)
* **Headings**: Georgia, serif (statutory gravity and gazette tradition).
* **Body / UI**: Inter, -apple-system, sans-serif (legibility at dense data scales).
* **Identifiers / Data**: JetBrains Mono, monospace (survey numbers, gazette references, transaction hashes).

### Spacing & Elevation (`spacing.ts`)
* Consistent 4px / 8px / 16px / 24px / 32px layout scale.
* Crisp 1px borders with subtle micro-shadows (`shadow-xs`, `shadow-sm`) suitable for high-density enterprise data tables.

---

## 3. Localization Foundation (`packages/ui/src/localization/`)

Bhu-Mitra components are wrapped in a central context:

```tsx
import { LocaleProvider, useLocale } from '@bhumitra/ui';

function MyComponent() {
  const { locale, setLocale, t } = useLocale();

  return (
    <button onClick={() => setLocale(locale === 'en' ? 'hi' : 'en')}>
      {t('appName')} — {locale.toUpperCase()}
    </button>
  );
}
```

### Representative Statutory Terms:
| English Term | Hindi / Devanagari | Context |
| :--- | :--- | :--- |
| **Land Acquisition** | भूमि अधिग्रहण | RFCTLARR statutory process |
| **Gazette Notification** | अधिसूचना | Section 11 / Section 19 publication |
| **Objections / Hearing** | आपत्ति / सुनवाई | Section 15 landowner inquiry |
| **Statutory Award** | अधिनिर्णय | Section 23/30 final compensation award |
| **Direct Benefit Transfer** | प्रत्यक्ष लाभ अंतरण (DBT) | PFMS electronic fund transfer |
| **Market Valuation** | मूल्यांकन | Multiplier-weighted land pricing |

---

## 4. Component Architecture (`packages/ui/src/components/`)

| Category | Components | Primary Responsibilities |
| :--- | :--- | :--- |
| **Shell & Identity** | `GovMasthead`, `GovEmblem`, `AppHeader`, `Sidebar`, `MobileNav`, `LanguageSwitcher` | Official Government of India top banner, tricolor ribbon, ministry titles, responsive navigation. |
| **Navigation** | `Breadcrumbs`, `Tabs`, `Pagination` | Hierarchical cadastral location tracking, keyboard-accessible tab switches, pagination controls. |
| **Content & Structure** | `PageHeader`, `SectionHeader`, `Card` | Uniform page headers with breadcrumbs and actions; modular card containers. |
| **Data & Badges** | `DataTable`, `StatusBadge`, `PriorityBadge`, `SlaIndicator`, `ProgressIndicator` | Sorting/filtering cadastral tables; 13 statutory statuses with icons and high-contrast borders; SLA limit countdowns. |
| **KPI & Metrics** | `StatCard`, `MetricCard` | High-level summary metrics with trend indicators (area acquired, DBT disbursed, overdue SLAs). |
| **Forms** | `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `FormField`, `FileUpload`, `DatePicker` | Accessible form controls compatible with React Hook Form, complete with error labels and descriptions. |
| **Workflow** | `Stepper`, `Timeline`, `ApprovalStep` | Horizontal/vertical 8-step RFCTLARR workflow, chronological event audit logs, multi-tier officer sign-offs. |
| **Feedback & Overlays**| `Alert`, `Dialog`, `ConfirmDialog`, `Tooltip`, `Popover`, `EmptyState`, `LoadingState`, `ErrorState` | Focus-trapped modals, escape-key support, inline alerts, contextual help tooltips. |
| **Government Specific** | `OfficialNotice`, `ReferenceNumber`, `DocumentStatus`, `AuditMetadata` | Gazette notification paper layout, one-click copy reference codes, e-sign verification metadata. |
| **GIS Chrome** | `MapContainer`, `MapToolbar`, `MapLegend`, `MapDrawer`, `MapFilterPanel` | UI chrome for map layers, measuring tools, cadastral legends, and parcel inspection drawers. |

---

## 5. Usage Example

```tsx
import {
  GovMasthead,
  PageHeader,
  DataTable,
  StatusBadge,
  Button
} from '@bhumitra/ui';

export default function ParcelListPage() {
  return (
    <div>
      <GovMasthead />
      <div className="max-w-7xl mx-auto p-6">
        <PageHeader
          title="Section 11 Preliminary Parcels"
          subtitle="Vadodara–Surat Highway Expansion Project"
          actions={<Button variant="primary">Export Gazette Notice</Button>}
        />
        <DataTable
          columns={[
            { key: 'surveyNo', header: 'Survey No', sortable: true },
            { key: 'village', header: 'Village' },
            { 
              key: 'status', 
              header: 'Status', 
              render: (item) => <StatusBadge status={item.status} /> 
            }
          ]}
          data={parcelData}
          keyExtractor={(p) => p.surveyNo}
          searchable
        />
      </div>
    </div>
  );
}
```

---

## 6. Live Interactive Showcase

The complete interactive showcase demonstrating all components, tokens, forms, workflows, and GIS chrome is available at:

```text
/design-system
```

within the Next.js web application (`apps/web`).
