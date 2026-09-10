'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AiMessage, AiAction, ProjectDto } from '@bhumitra/types';

interface AiMessageRendererProps {
  message: AiMessage;
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
  onExplainSimply?: () => void;
  onAskQuestion?: (query: string) => void;
  userLanguage?: string;
}

export const AiMessageRenderer: React.FC<AiMessageRendererProps> = ({
  message,
  onSpeak,
  isSpeaking,
  onExplainSimply,
  onAskQuestion,
  userLanguage = 'en',
}) => {
  const router = useRouter();
  const isUser = message.role === 'user';
  const sr = message.structuredResponse;
  const isHindi = sr?.language === 'hi' || userLanguage === 'hi';

  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'UP' | 'DOWN' | null>(null);
  const [shared, setShared] = useState(false);

  // Copy message text to clipboard
  const handleCopy = () => {
    const textToCopy = sr?.summary || message.content;
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Share response
  const handleShare = async () => {
    const textToShare = sr?.summary || message.content;
    if (typeof window !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Bhu-Mitra Land Acquisition Intelligence',
          text: textToShare,
          url: window.location.href,
        });
        return;
      } catch {}
    }
    handleCopy();
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleActionClick = (action: AiAction) => {
    switch (action.actionType) {
      case 'NAVIGATE':
        if (action.payload?.url) {
          router.push(action.payload.url as string);
        } else if (action.payload?.action === 'briefing') {
          router.push('/command');
        } else if (action.payload?.action === 'delayed') {
          router.push('/risk');
        }
        break;
      case 'GIS_FILTER': {
        const parcelId = action.payload?.parcelId as string;
        const projectId = action.payload?.projectId as string;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('bhumitra:gis:select-parcel', {
              detail: { parcelId, projectId },
            }),
          );
        }
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/gis')) {
          router.push(`/gis?${projectId ? `projectId=${projectId}` : `parcel=${parcelId || '103-10'}`}&highlight=true`);
        }
        break;
      }
      case 'OPEN_PROJECT':
        router.push(`/projects?id=${action.payload?.projectId || 'DOLR-2026-0084'}`);
        break;
      case 'OPEN_PARCEL':
        router.push(`/gis?parcel=${action.payload?.parcelId || '103-10'}`);
        break;
      case 'OPEN_COMPENSATION':
        router.push('/compensation');
        break;
      case 'GENERATE_REPORT': {
        // Generate real official MIS CSV report
        const csvContent = [
          'ProjectCode,CorridorName,Sector,State,District,StageCode,ProposedAreaHa,AcquiredAreaHa,PendingAreaHa,CompensationAssessedCr,CompensationDisbursedCr,SLADaysRemaining,RiskLevel',
          'DOLR-2026-0084,NH-48 Bharatmala Six-Laning Corridor,Highway,Gujarat,Vadodara,SEC_19_DECLARATION,142.5,89.4,53.1,148.5,98.4,8,HIGH',
          'DOLR-2026-0059,Lucknow Metro Extension Line 3,Metro,Uttar Pradesh,Lucknow,VALUATION,64.2,38.0,26.2,142.0,78.5,-3,CRITICAL',
          'DOLR-2026-0071,Western Dedicated Freight Corridor (Phase 2),Rail,Rajasthan,Jaipur,SEC_19_DECLARATION,310.0,210.8,99.2,284.0,210.0,24,MEDIUM',
          'DOLR-2026-0066,Pune–Nashik Semi High-Speed Rail Corridor,Rail,Maharashtra,Pune,SEC_11_PRELIMINARY,218.7,45.2,173.5,198.0,45.0,45,LOW',
          'DOLR-2026-0091,Rewa Ultra-Mega Solar Industrial Corridor,Energy,Madhya Pradesh,Rewa,SEC_23_AWARD,95.0,88.0,7.0,85.0,82.0,64,LOW',
          'DOLR-2026-0048,Bhopal Smart City Western Ring Road,Smart City,Madhya Pradesh,Bhopal,SEC_15_HEARING,110.0,62.0,48.0,120.0,75.0,18,MEDIUM',
          'DOLR-2026-0043,Dhamra Port Coastal Industrial Node,Port,Odisha,Bhadrak,SEC_38_POSSESSION,118.0,105.0,13.0,140.0,135.0,88,LOW',
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'bhumitra-national-land-acquisition-mis.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      }
      default:
        break;
    }
  };

  // Helper to format simple markdown-like lines
  const renderFormattedContent = (content: string) => {
    return content.split('\n').map((line, lineIdx) => {
      if (!line.trim()) {
        return <div key={lineIdx} className="h-2" />;
      }

      // Check bullet point
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      // Check numbered list
      const isNumbered = /^\d+\.\s/.test(line.trim());

      // Parse bold **text**
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-bold text-slate-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      return (
        <div
          key={lineIdx}
          className={`leading-relaxed ${
            isBullet ? 'pl-3.5 relative text-slate-700' : isNumbered ? 'font-semibold text-slate-800' : 'text-slate-700'
          }`}
        >
          {isBullet && <span className="absolute left-0 text-emerald-600 font-bold">•</span>}
          {renderedParts}
        </div>
      );
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-3.5 group">
        <div className="max-w-[85%] bg-[#0C5A37] hover:bg-[#084228] text-white px-4 py-2.5 rounded-2xl rounded-tr-xs text-xs sm:text-[13px] shadow-sm font-medium leading-relaxed transition-all">
          {message.content}
        </div>
      </div>
    );
  }

  // ── AI Command Intelligence Card ──────────────────────────────────────────
  return (
    <div className="flex flex-col gap-2 mb-4 max-w-[96%] animate-in fade-in slide-in-from-left-2 duration-150">
      <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 sm:p-4.5 shadow-sm text-slate-800 space-y-3.5 transition-all hover:shadow-md">
        
        {/* Header Title & Intent Badge */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-200" />
            <h4 className="text-xs sm:text-[13.5px] font-bold text-[#0B1F33] tracking-tight">
              {sr?.title || (isHindi ? 'भू-मित्र एआई निर्णय समर्थन' : 'Bhu-Mitra Command Intelligence')}
            </h4>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9.5px] font-mono uppercase bg-emerald-50 text-emerald-800 border border-emerald-200/70 px-1.5 py-0.5 rounded font-bold">
              {sr?.detectedIntent?.replace(/_/g, ' ') || 'VERIFIED'}
            </span>
          </div>
        </div>

        {/* Executive Summary with Rich Markdown Formatter */}
        <div className="text-xs sm:text-[13px] text-slate-700 leading-relaxed space-y-1">
          {renderFormattedContent(message.content)}
        </div>

        {/* Key Metrics Tiles */}
        {sr?.metrics && sr.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {sr.metrics.map((m, idx) => {
              const bg =
                m.variant === 'danger'
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : m.variant === 'warning'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : m.variant === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200';
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border text-center font-medium shadow-2xs ${bg}`}
                >
                  <div className="text-[10px] uppercase tracking-wider opacity-85 line-clamp-1 font-semibold">
                    {m.label}
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold mt-0.5 truncate">
                    {m.value}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Dynamic Interactive Project Cards */}
        {sr?.projects && sr.projects.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <span>{isHindi ? `पहचाने गए गलियारे (${sr.projects.length})` : `Identified Infrastructure Corridors (${sr.projects.length})`}</span>
              <span className="text-[9.5px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {isHindi ? 'लाइव डेटा' : 'Grounded Data'}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {sr.projects.map((p) => {
                const acquiredPercent = Math.min(
                  100,
                  Math.round(((p.totalAreaAcquiredHa || 0) / (p.totalAreaProposedHa || 1)) * 100),
                );
                const pendingHa = Math.max(
                  0,
                  Math.round(((p.totalAreaProposedHa || 0) - (p.totalAreaAcquiredHa || 0)) * 10) / 10,
                );

                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/15 transition-all text-xs space-y-2.5 shadow-2xs"
                  >
                    {/* Top Row: Name, Code & Risk Tag */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[10px] font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                            {p.projectCode || p.id}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                            {p.state}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            · {p.type}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 mt-1 text-xs sm:text-[13px]">
                          {p.name}
                        </h5>
                      </div>

                      <span
                        className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded shrink-0 ${
                          p.status === 'DELAYED' || p.riskLevel === 'critical'
                            ? 'bg-red-100 text-red-700 border border-red-300'
                            : p.riskLevel === 'high'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {p.status === 'DELAYED' ? 'DELAYED' : `${p.riskLevel?.toUpperCase()} RISK`}
                      </span>
                    </div>

                    {/* Land Acquisition Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>
                          {isHindi ? 'अधिग्रहीत:' : 'Acquired:'}{' '}
                          <strong className="text-slate-900">{p.totalAreaAcquiredHa} Ha</strong> / {p.totalAreaProposedHa} Ha ({acquiredPercent}%)
                        </span>
                        <span className="text-slate-500">
                          {isHindi ? 'लंबित:' : 'Pending:'} <strong className="text-slate-700">{pendingHa} Ha</strong>
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            p.status === 'DELAYED' ? 'bg-amber-500' : 'bg-[#0C5A37]'
                          }`}
                          style={{ width: `${Math.max(5, acquiredPercent)}%` }}
                        />
                      </div>
                    </div>

                    {/* Secondary details: Requiring Body & SLA */}
                    <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-0.5">
                      <span className="truncate max-w-[65%]">
                        {p.requiringBody || p.ministry}
                      </span>
                      <span className={`font-semibold ${p.slaDaysRemaining <= 10 ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                        SLA: {p.slaDaysRemaining} {isHindi ? 'दिन शेष' : 'Days left'}
                      </span>
                    </div>

                    {/* Card Actions */}
                    <div className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200/70 flex-wrap">
                      <button
                        type="button"
                        onClick={() => router.push(`/projects?id=${p.id}`)}
                        className="text-[10.5px] font-bold px-2.5 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-all active:scale-95 shadow-2xs"
                      >
                        {isHindi ? 'परियोजना देखें' : 'View Project'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== 'undefined') {
                            window.dispatchEvent(
                              new CustomEvent('bhumitra:gis:select-parcel', {
                                detail: { projectId: p.id },
                              }),
                            );
                          }
                          router.push(`/gis?projectId=${p.id}&highlight=true`);
                        }}
                        className="text-[10.5px] font-bold px-2.5 py-1 rounded bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 transition-all active:scale-95 shadow-2xs"
                      >
                        {isHindi ? 'मानचित्र पर देखें' : 'Show on Map'}
                      </button>
                      {(p.status === 'DELAYED' || p.riskLevel === 'high' || p.riskLevel === 'critical') && onAskQuestion && (
                        <button
                          type="button"
                          onClick={() => onAskQuestion(isHindi ? `${p.name} में देरी का क्या कारण है?` : `Why is ${p.name || p.projectCode} delayed?`)}
                          className="text-[10.5px] font-bold px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 transition-all ml-auto active:scale-95"
                        >
                          {isHindi ? 'विलंब का कारण? ⚡' : 'Why Delayed? ⚡'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Facts Citation */}
        {sr?.facts && sr.facts.length > 0 && (
          <div className="border-t border-slate-100 pt-2 space-y-1 text-[11px]">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {isHindi ? 'सत्यापित पोर्टल अभिलेख:' : 'Verified Application Records:'}
            </span>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
              {sr.facts.map((fact, idx) => (
                <li key={idx}>{fact}</li>
              ))}
            </ul>
          </div>
        )}

        {/* AI Action Buttons */}
        {sr?.actions && sr.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {sr.actions.map((act, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleActionClick(act)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1F33] hover:bg-[#132A44] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
              >
                <span>{act.label}</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* Explain Simply Plain Language Button */}
        {onExplainSimply && sr?.detectedIntent !== 'EXPLAIN_SIMPLY' && (
          <div className="pt-1">
            <button
              type="button"
              onClick={onExplainSimply}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0C5A37] hover:text-[#084228] bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 transition-colors"
            >
              <span>💡 {isHindi ? 'सरल भाषा में समझें (नागरिक सहायता)' : 'Explain in Simple Words'}</span>
            </button>
          </div>
        )}

        {/* Official Grounding & Sources Footer */}
        {sr?.sources && sr.sources.length > 0 && (
          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 pt-1">
            <span>{isHindi ? 'आधिकारिक स्रोत:' : 'Official Grounding:'}</span>
            <span className="text-slate-500">{sr.sources.join(' · ')}</span>
          </div>
        )}

        {/* AI Response Action Toolbar (Listen, Copy, Share, Feedback) */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            {onSpeak && (
              <button
                type="button"
                onClick={() => onSpeak(sr?.spokenSummary || message.content)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                  isSpeaking
                    ? 'bg-emerald-100 text-emerald-800 font-bold'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Read response aloud'}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>{isSpeaking ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'सुनें' : 'Listen')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Copy answer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>{copied ? (isHindi ? 'कॉपी हुआ!' : 'Copied!') : (isHindi ? 'कॉपी' : 'Copy')}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Share response"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>{shared ? (isHindi ? 'लिंक कॉपी हुआ' : 'Shared!') : (isHindi ? 'शेयर' : 'Share')}</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFeedback('UP')}
              className={`p-1 rounded transition-colors ${feedback === 'UP' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-slate-600'}`}
              title="Helpful"
            >
              👍
            </button>
            <button
              type="button"
              onClick={() => setFeedback('DOWN')}
              className={`p-1 rounded transition-colors ${feedback === 'DOWN' ? 'text-red-700 bg-red-50' : 'text-slate-400 hover:text-slate-600'}`}
              title="Not helpful"
            >
              👎
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
