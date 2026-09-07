'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GovMasthead, GovEmblem } from '@bhumitra/ui';
import { apiLogin } from '../../../lib/api';

interface OfficerPreset {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
  jurisdiction: string;
}

const OFFICER_PRESETS: OfficerPreset[] = [
  {
    id: 'GJ-DM-VD-0042',
    name: 'Shri Rajesh Sharma, IAS',
    role: 'district_collector',
    roleLabel: 'District Collector / DM (Vadodara)',
    jurisdiction: 'Vadodara District, Gujarat',
  },
  {
    id: 'RJ-CALA-JP-109',
    name: 'Smt. Priya Meena, RAS',
    role: 'cala',
    roleLabel: 'CALA — Competent Authority (NH-48)',
    jurisdiction: 'Jaipur Rural, Rajasthan',
  },
  {
    id: 'DL-JS-DOLR-001',
    name: 'Dr. Alok Kumar, IAS',
    role: 'joint_secretary',
    roleLabel: 'Joint Secretary (DoLR, New Delhi)',
    jurisdiction: 'National Command, MoRD',
  },
  {
    id: 'MH-SNO-REV-204',
    name: 'Shri Sunil Patil, IAS',
    role: 'state_nodal',
    roleLabel: 'State Nodal Officer (Revenue)',
    jurisdiction: 'State of Maharashtra',
  },
  {
    id: 'UP-TEH-LKO-551',
    name: 'Shri Amit Verma',
    role: 'tehsildar',
    roleLabel: 'Tehsildar / Revenue Inspector',
    jurisdiction: 'Lucknow Sub-Division, Uttar Pradesh',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'credentials' | 'sso'>('credentials');
  const [userId, setUserId] = useState(OFFICER_PRESETS[0].id);
  const [password, setPassword] = useState('Bhumitra@2026');
  const [selectedRole, setSelectedRole] = useState(OFFICER_PRESETS[0].role);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState('7K9P4');
  const [captchaInput, setCaptchaInput] = useState('');
  const [ssoAadhaar, setSsoAadhaar] = useState('');
  const [ssoOtpSent, setSsoOtpSent] = useState(false);
  const [ssoOtp, setSsoOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
  };

  const handleSelectPreset = (preset: OfficerPreset) => {
    setUserId(preset.id);
    setSelectedRole(preset.role);
    setError(null);
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side captcha validation
    if (captchaInput.toUpperCase() !== captchaCode) {
      setError('Captcha verification failed. Please re-enter the security code.');
      refreshCaptcha();
      return;
    }

    setIsLoading(true);
    try {
      await apiLogin({ userId, password, authMode: 'credentials' });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failed. Please verify your credentials.';
      setError(message);
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSsoVerify = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For the SSO flow demo, use the Aadhaar/ID as userId with SSO mode
      await apiLogin({ userId: ssoAadhaar || userId, authMode: 'sso' });
      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'SSO authentication failed.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA]">
      {/* Official Government Masthead with GIGW Accessibility & Language Switcher */}
      <GovMasthead skipToId="login-card-section" />

      {/* Hero Stripe with Department Branding */}
      <div className="bg-[#0B1F33] border-b border-slate-700/60 py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <GovEmblem size={44} className="bg-white/10 border-white/20 text-amber-300" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight">BHUMITRA</span>
                <span className="text-amber-400 font-bold text-xs bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded">
                  भूमिमित्र
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                National Land Acquisition Intelligence &amp; Management Platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold px-2.5 py-1 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              RFCTLARR Act 2013 Statutory Gateway
            </span>
          </div>
        </div>
      </div>

      {/* Main Login Content */}
      <main
        id="login-card-section"
        className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 20%, rgba(15, 45, 74, 0.05) 0%, transparent 60%), linear-gradient(180deg, #F8FAFC 0%, #EEF2F6 100%)',
        }}
      >
        <div className="w-full max-w-xl">
          {/* Official Security Advisory Banner */}
          <div className="mb-4 bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-md shadow-xs text-xs text-amber-900 flex items-start gap-2.5">
            <svg className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <span className="font-bold">Official Government of India Portal:</span> Access restricted to authorized
              personnel under RFCTLARR Act 2013. Unauthorized access is punishable under Section 43 &amp; 66 of the IT
              Act, 2000.
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md text-xs text-red-800 flex items-start gap-2.5 animate-fadeIn">
              <svg className="w-4 h-4 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-bold">Authentication Error: </span>{error}
              </div>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-[#0F2D4A] text-white p-5 sm:p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Officer Authentication</h1>
                  <p className="text-xs text-slate-300 mt-1">
                    Department of Land Resources · Ministry of Rural Development
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 bg-amber-400/15 border border-amber-400/30 px-2 py-1 rounded">
                    NIC Certified 256-Bit SSL
                  </span>
                </div>
              </div>

              {/* Tab Selector: Credentials vs MeriPehchaan SSO */}
              <div className="flex gap-2 mt-5 bg-slate-900/50 p-1 rounded-lg border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => { setAuthMode('credentials'); setError(null); }}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-all ${
                    authMode === 'credentials'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Officer Parichay / Credentials
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('sso'); setError(null); }}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'sso'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>MeriPehchaan (National SSO)</span>
                </button>
              </div>
            </div>

            {/* Quick Officer Role Switcher */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center justify-between">
                <span>Quick Role Presets (Operational Login)</span>
                <span className="text-[10px] text-amber-700 font-normal">Click to auto-fill credentials</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {OFFICER_PRESETS.map((p) => {
                  const isActive = userId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectPreset(p)}
                      className={`text-left p-1.5 rounded text-[11px] border transition-all ${
                        isActive
                          ? 'bg-amber-100/70 border-amber-400 text-slate-900 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="truncate text-[11px] font-semibold">{p.roleLabel.split(' ')[0]} {p.roleLabel.split(' ')[1]}</div>
                      <div className="text-[9px] text-slate-700 truncate">{p.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Body */}
            <div className="p-5 sm:p-7">
              {authMode === 'credentials' ? (
                <form onSubmit={handleCredentialsSubmit} noValidate className="space-y-4">
                  <div>
                    <label
                      htmlFor="login-userid"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                    >
                      Government User ID / Parichay ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="login-userid"
                      type="text"
                      autoComplete="username"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="e.g. GJ-DM-VD-0042 or NIC email"
                      required
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D4A] focus:border-transparent font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="login-password"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                      >
                        Password / Passphrase <span className="text-red-500">*</span>
                      </label>
                      <a href="#forgot" className="text-xs text-[#0F2D4A] hover:underline font-medium">
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        required
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D4A] focus:border-transparent font-mono pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="login-role"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                    >
                      Assigned Statutory Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="login-role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D4A] focus:border-transparent font-medium"
                    >
                      <option value="district_collector">District Collector / District Magistrate (DM)</option>
                      <option value="cala">CALA — Competent Authority for Land Acquisition</option>
                      <option value="joint_secretary">Joint Secretary (DoLR, MoRD New Delhi)</option>
                      <option value="state_nodal">State Nodal Officer (Revenue Dept.)</option>
                      <option value="tehsildar">Tehsildar / Sub-Divisional Officer</option>
                    </select>
                  </div>

                  {/* Security Captcha (Standard Indian Government Requirement) */}
                  <div className="pt-1">
                    <label
                      htmlFor="captcha-input"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                    >
                      Security Verification Captcha <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      {/* Stylized Captcha Canvas */}
                      <div
                        className="h-10 px-4 flex items-center justify-center bg-slate-100 border border-slate-300 rounded font-mono font-bold text-lg tracking-widest text-[#0B1F33] select-none relative overflow-hidden"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)',
                        }}
                      >
                        <span className="line-through decoration-slate-400">{captchaCode}</span>
                      </div>

                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        title="Reload Captcha"
                        className="p-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>

                      <input
                        id="captcha-input"
                        type="text"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                        placeholder="Enter 5 characters"
                        maxLength={5}
                        className="flex-1 px-3 py-2 text-sm rounded border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D4A] uppercase font-mono"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      id="login-submit-btn"
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 bg-[#0F2D4A] hover:bg-[#0B1F33] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm tracking-wide"
                    >
                      {isLoading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin text-amber-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          Authenticate &amp; Access Command Center
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* MeriPehchaan (National SSO) Tab */
                <div className="space-y-4 py-2">
                  <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-700 flex items-center justify-center mx-auto mb-2 font-bold text-xl border border-amber-400/40">
                      म
                    </div>
                    <h2 className="text-sm font-bold text-slate-900">MeriPehchaan National Single Sign-On (NSSO)</h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                      Authorized by Ministry of Electronics &amp; Information Technology (MeitY) &amp; NIC for all
                      Central &amp; State Government officers.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="aadhaar-id"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                    >
                      Aadhaar / Parichay Linked Mobile / Jan Parichay ID
                    </label>
                    <input
                      id="aadhaar-id"
                      type="text"
                      value={ssoAadhaar}
                      onChange={(e) => setSsoAadhaar(e.target.value)}
                      placeholder="e.g. 9876543210 or officer@gov.in"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D4A]"
                    />
                  </div>

                  {ssoOtpSent && (
                    <div>
                      <label
                        htmlFor="sso-otp"
                        className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
                      >
                        Enter 6-digit OTP sent to registered mobile
                      </label>
                      <input
                        id="sso-otp"
                        type="text"
                        value={ssoOtp}
                        onChange={(e) => setSsoOtp(e.target.value)}
                        placeholder="1 2 3 4 5 6"
                        maxLength={6}
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D4A] tracking-widest text-center font-mono font-bold"
                      />
                    </div>
                  )}

                  <div className="pt-2">
                    {ssoOtpSent ? (
                      <button
                        type="button"
                        onClick={handleSsoVerify}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-[#138808] hover:bg-[#0D6606] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm tracking-wide"
                      >
                        {isLoading ? 'Verifying...' : 'Verify OTP & Proceed'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSsoOtpSent(true)}
                        className="w-full flex items-center justify-center gap-2 bg-[#0F2D4A] hover:bg-[#0B1F33] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all text-sm tracking-wide"
                      >
                        Send OTP via MeriPehchaan Gateway
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Return */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <Link href="/" className="hover:text-[#0F2D4A] font-medium flex items-center gap-1">
                  <span>←</span> Return to BHUMITRA Platform Home
                </Link>
                <Link href="/design-system" className="hover:text-[#0F2D4A] font-medium text-amber-700">
                  Platform Design System Spec →
                </Link>
              </div>
            </div>

            {/* Card Footer: Security & GIGW */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                <span>e-Governance Security Standard Compliant</span>
              </div>
              <div>NIC Data Centre · Disaster Recovery Enabled</div>
            </div>
          </div>

          {/* Helpdesk Contacts Strip */}
          <div className="mt-6 text-center text-xs text-slate-600 space-y-1">
            <p>
              National Land Records Modernization Programme (NLRMP) / DILRMP Support Cell
            </p>
            <p className="text-slate-700">
              Toll Free Helpdesk: <span className="font-semibold text-slate-800">1800-11-DOLR (3657)</span> |
              Email: <span className="font-semibold text-slate-800">support-bhumitra@gov.in</span>
            </p>
          </div>
        </div>
      </main>

      {/* Official Government Footer */}
      <footer className="bg-[#0B1F33] text-white/60 border-t border-slate-800 py-4 px-4 text-center text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 Department of Land Resources (DoLR), Ministry of Rural Development, Government of India
          </div>
          <div className="text-[11px] text-slate-300">
            RFCTLARR Act 2013 Statutory Compliance Engine
          </div>
        </div>
      </footer>
    </div>
  );
}
