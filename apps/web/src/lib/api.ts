/**
 * BhuMitra API Client
 * Typed HTTP client for all API calls from the Next.js frontend.
 * Base URL read from NEXT_PUBLIC_API_URL env var (defaults to localhost:3001).
 */

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001') + '/api/v1';

/** Key used for JWT storage in localStorage */
const TOKEN_KEY = 'bhumitra_access_token';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `API error ${res.status}: ${res.statusText}`;
    try {
      const body = await res.json();
      errorMsg = body?.error?.message || body?.message || errorMsg;
    } catch {
      // ignore parse errors
    }
    throw new Error(errorMsg);
  }

  // Handle CSV/text responses
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('text/csv') || contentType.includes('text/plain')) {
    return (await res.text()) as unknown as T;
  }

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  userId?: string;
  email?: string;
  password?: string;
  authMode?: 'credentials' | 'sso';
}

export interface AuthUser {
  id: string;
  officerId: string;
  name: string;
  email: string;
  role: string;
  roleLabel: string;
  designation: string;
  jurisdiction: string;
  permissions: string[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: AuthUser;
}

export async function apiLogin(payload: LoginPayload): Promise<LoginResponse> {
  const data = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  setToken(data.accessToken);
  return data;
}

export async function apiGetCurrentUser(): Promise<AuthUser> {
  return request<AuthUser>('/auth/me');
}

// ─── Analytics / Dashboard ────────────────────────────────────────────────────

export interface DashboardKpis {
  totalProjects: number;
  totalAreaHa: number;
  totalAreaAcquiredHa: number;
  compensationPaidCr: number;
  compensationAssessedCr: number;
  slaComplianceRate: number;
  slaAlertsCount: number;
  pendingObjections: number;
}

export interface StateKpi {
  state: string;
  projects: number;
  area: string;
  areaHa: number;
  sla: number;
  risk: number;
  color: string;
}

export interface RecentProject {
  id: string;
  name: string;
  state: string;
  stage: string;
  area: string;
  sla: number;
  risk: string;
}

export interface PriorityAction {
  severity: 'critical' | 'high' | 'medium';
  label: string;
  count: number;
  detail: string;
}

export interface DashboardMetrics {
  timestamp: string;
  kpis: DashboardKpis;
  stateKpis: StateKpi[];
  recentProjects: RecentProject[];
  priorityActions: PriorityAction[];
}

export async function apiGetDashboard(): Promise<DashboardMetrics> {
  return request<DashboardMetrics>('/analytics/dashboard');
}

export async function apiGetDecisionSupport() {
  return request('/analytics/decision-support');
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function apiGetProjects(query?: {
  state?: string;
  status?: string;
  stage?: string;
  search?: string;
}) {
  const params = new URLSearchParams(
    Object.entries(query ?? {}).filter(([, v]) => v) as [string, string][],
  );
  const qs = params.toString() ? `?${params.toString()}` : '';
  return request(`/projects${qs}`);
}

export async function apiGetProject(id: string) {
  return request(`/projects/${id}`);
}

// ─── Parcels ──────────────────────────────────────────────────────────────────

export async function apiGetParcels(query?: { projectId?: string; state?: string }) {
  const params = new URLSearchParams(
    Object.entries(query ?? {}).filter(([, v]) => v) as [string, string][],
  );
  const qs = params.toString() ? `?${params.toString()}` : '';
  return request(`/parcels${qs}`);
}

export async function apiGetParcel360(id: string) {
  return request(`/parcels/${id}/360`);
}

// ─── GIS ──────────────────────────────────────────────────────────────────────

export async function apiGetGisParcels(query?: { projectId?: string; state?: string }) {
  const params = new URLSearchParams(
    Object.entries(query ?? {}).filter(([, v]) => v) as [string, string][],
  );
  const qs = params.toString() ? `?${params.toString()}` : '';
  return request(`/gis/parcels${qs}`);
}

export async function apiGetGisProjects() {
  return request('/gis/projects');
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function apiGetNotifications() {
  return request('/notifications');
}

export async function apiMarkNotificationRead(id: string) {
  return request(`/notifications/${id}/read`, { method: 'PATCH' });
}

// ─── Grievances ───────────────────────────────────────────────────────────────

export async function apiGetGrievances() {
  return request('/grievances');
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function apiGetMisReport() {
  return request('/reports/mis');
}

export async function apiExportCsv(type = 'mis'): Promise<string> {
  return request<string>(`/reports/export?type=${type}`);
}
