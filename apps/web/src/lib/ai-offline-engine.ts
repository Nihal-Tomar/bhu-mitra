import type {
  AiQueryDto,
  AiMessage,
  AiStructuredResponse,
  SupportedLanguage,
  ProjectDto,
  AiConversationContext,
} from '@bhumitra/types';
import { SAMPLE_PROJECTS, type AcquisitionProject } from '../data/homepageData';

// Map AcquisitionProject from homepageData to ProjectDto format
function toProjectDto(ap: AcquisitionProject): ProjectDto {
  return {
    id: ap.id,
    projectCode: ap.id,
    name: ap.name,
    description: ap.riskFactors.join('; '),
    type: ap.type === 'Railways' ? 'Rail' : ap.type === 'Highways' ? 'Highway' : ap.type === 'Urban Infra' ? 'Metro' : ap.type === 'Renewable Energy' ? 'Energy' : 'Industrial',
    ministry: ap.ministry,
    requiringBody: ap.ministry.split('/')[1]?.trim() || ap.ministry,
    state: ap.state,
    stateCode: ap.state === 'Gujarat' ? 'GJ' : ap.state === 'Maharashtra' ? 'MH' : ap.state === 'Rajasthan' ? 'RJ' : ap.state === 'Uttar Pradesh' ? 'UP' : 'MP',
    district: ap.district,
    stage: ap.stage,
    stageCode: ap.stage.includes('Section 11')
      ? 'SEC_11_PRELIMINARY'
      : ap.stage.includes('Section 15')
      ? 'SEC_15_HEARING'
      : ap.stage.includes('Section 19')
      ? 'SEC_19_DECLARATION'
      : ap.stage.includes('Compensation')
      ? 'VALUATION'
      : 'SEC_23_AWARD',
    status: ap.slaDaysRemaining < 0 ? 'DELAYED' : 'IN_PROGRESS',
    totalAreaProposedHa: ap.landProposedHa,
    totalAreaNotifiedHa: ap.landNotifiedHa,
    totalAreaAcquiredHa: ap.landAcquiredHa,
    estimatedBudgetCr: ap.compensationAssessedCr * 2.5,
    compensationAssessedCr: ap.compensationAssessedCr,
    compensationDisbursedCr: ap.compensationDisbursedCr,
    affectedFamilies: ap.affectedFamilies,
    slaDaysRemaining: ap.slaDaysRemaining,
    riskLevel: ap.riskLevel.toLowerCase() as any,
    delayPredictedDays: ap.delayPredictedDays,
    recommendedAction: ap.recommendedAction,
    targetCompletionDate: new Date('2027-03-31').toISOString(),
    startDate: new Date('2024-04-01').toISOString(),
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

const LOCAL_PROJECTS: ProjectDto[] = SAMPLE_PROJECTS.map(toProjectDto);

export function detectLanguageLocal(text: string): { language: SupportedLanguage; label: string } {
  if (!text || !text.trim()) return { language: 'en', label: 'English' };

  const trimmed = text.trim();
  const lower = trimmed.toLowerCase();

  // Devanagari script detection
  if (/[\u0900-\u097F]/.test(trimmed)) {
    return { language: 'hi', label: 'हिन्दी (Hindi)' };
  }

  // Explicit user language requests
  if (lower.includes('hindi mein') || lower.includes('in hindi') || lower.includes('hindi')) {
    return { language: 'hi', label: 'हिन्दी (Hindi)' };
  }

  // Hinglish keywords
  const hinglishMarkers = [
    'mera', 'meri', 'mere', 'kisan', 'zamin', 'zameen', 'muavja', 'muawza',
    'kab', 'milega', 'kitna', 'kitne', 'kitni', 'kaise', 'kya', 'hoga', 'adhigrahan', 'batao',
    'dastavej', 'chahiye', 'rok', 'paisa', 'mujhe', 'bare', 'mein', 'dikhao',
    'kaunse', 'kaun', 'chal', 'rahe', 'raha', 'rahi', 'wala', 'wali', 'wale',
    'iska', 'iski', 'iske', 'uski', 'uske', 'sabse', 'zyada', 'deri', 'bhi', 'hain', 'hai'
  ];

  const matched = hinglishMarkers.filter((m) => new RegExp(`\\b${m}\\b`, 'i').test(lower));
  if (matched.length >= 2 || (matched.length === 1 && (lower.includes('hai') || lower.includes('hain') || lower.includes('mein') || lower.includes('batao') || lower.includes('dikhao')))) {
    return { language: 'hi', label: 'Hinglish / हिन्दी' };
  }

  return { language: 'en', label: 'English' };
}

export function executeOfflineQuery(dto: AiQueryDto): AiMessage {
  const raw = dto.message?.trim() || '';
  const detected = detectLanguageLocal(raw);
  const lang: SupportedLanguage = detected.language !== 'en' ? detected.language : (dto.language || 'en');
  const isHindi = lang === 'hi';
  const q = raw.toLowerCase();
  const ctx = dto.conversationContext || {};
  const updatedContext: AiConversationContext = { ...ctx };

  let structured: AiStructuredResponse;

  // 1. Follow-up: "Pehla wala" / "First one"
  if (
    (q.includes('pehla') || q.includes('first') || q.includes('पहला')) &&
    (q.includes('wala') || q.includes('one') || q.includes('detail') || q.includes('project') || q.includes('बारे'))
  ) {
    const candidateId = ctx.lastProjects?.[0]?.id || 'DOLR-2026-0071';
    const proj = LOCAL_PROJECTS.find((p) => p.id === candidateId || p.projectCode === candidateId) || LOCAL_PROJECTS[0];
    updatedContext.selectedProjectId = proj.id;
    updatedContext.selectedProjectName = proj.name;
    structured = buildSingleProjectResponse(proj, isHindi);
  }
  // 2. Follow-up: "Dusra wala" / "Second one"
  else if (
    (q.includes('dusra') || q.includes('second') || q.includes('दूसरा')) &&
    (q.includes('wala') || q.includes('one') || q.includes('detail') || q.includes('project'))
  ) {
    const candidateId = ctx.lastProjects?.[1]?.id || 'DOLR-2026-0066';
    const proj = LOCAL_PROJECTS.find((p) => p.id === candidateId || p.projectCode === candidateId) || LOCAL_PROJECTS[1] || LOCAL_PROJECTS[0];
    updatedContext.selectedProjectId = proj.id;
    updatedContext.selectedProjectName = proj.name;
    structured = buildSingleProjectResponse(proj, isHindi);
  }
  // 3. Follow-up: "Iska land acquisition" / "Pending zameen"
  else if (
    (q.includes('iska') || q.includes('iski') || q.includes('iske') || q.includes('uski') || q.includes('usme') || q.includes('इसकी') || q.includes('इसका') || q.includes('it')) &&
    (q.includes('land') || q.includes('zameen') || q.includes('zamin') || q.includes('जमीन') || q.includes('acquisition') || q.includes('अधिग्रहण') || q.includes('pending') || q.includes('लंबित') || q.includes('status') || q.includes('स्थिति'))
  ) {
    const candidateId = ctx.selectedProjectId || ctx.lastProjects?.[0]?.id || 'DOLR-2026-0071';
    const proj = LOCAL_PROJECTS.find((p) => p.id === candidateId || p.projectCode === candidateId) || LOCAL_PROJECTS[0];
    structured = buildSingleProjectResponse(proj, isHindi);
  }
  // 4. Sector Query: Railway / Rail
  else if (
    q.includes('rail') ||
    q.includes('railway') ||
    q.includes('रेल') ||
    q.includes('रेलवे')
  ) {
    const railProjects = LOCAL_PROJECTS.filter((p) => p.type === 'Rail');
    updatedContext.lastProjects = railProjects.map(mapProjectContext);
    updatedContext.activeFilters = { sector: 'Rail' };
    updatedContext.contextLabel = `Railway Corridors (${railProjects.length})`;
    structured = buildSectorResponse('Rail', railProjects, isHindi);
  }
  // 5. Sector Query: Highway
  else if (
    q.includes('highway') ||
    q.includes('highways') ||
    q.includes('road') ||
    q.includes('सड़क') ||
    q.includes('हाईवे')
  ) {
    const hwProjects = LOCAL_PROJECTS.filter((p) => p.type === 'Highway');
    updatedContext.lastProjects = hwProjects.map(mapProjectContext);
    updatedContext.activeFilters = { sector: 'Highway' };
    updatedContext.contextLabel = `Highway Corridors (${hwProjects.length})`;
    structured = buildSectorResponse('Highway', hwProjects, isHindi);
  }
  // 6. Sector Query: Metro / Urban
  else if (q.includes('metro') || q.includes('मेट्रो')) {
    const metroProjects = LOCAL_PROJECTS.filter((p) => p.type === 'Metro');
    updatedContext.lastProjects = metroProjects.map(mapProjectContext);
    updatedContext.activeFilters = { sector: 'Metro' };
    updatedContext.contextLabel = `Metro Corridors (${metroProjects.length})`;
    structured = buildSectorResponse('Metro', metroProjects, isHindi);
  }
  // 7. Delayed Projects
  else if (
    q.includes('delayed') ||
    q.includes('late') ||
    q.includes('देरी') ||
    q.includes('विलंबित') ||
    q.includes('piche')
  ) {
    const delayed = LOCAL_PROJECTS.filter((p) => p.status === 'DELAYED' || p.riskLevel === 'high' || p.riskLevel === 'critical' || p.slaDaysRemaining <= 15);
    updatedContext.lastProjects = delayed.map(mapProjectContext);
    updatedContext.activeFilters = { status: 'DELAYED' };
    updatedContext.contextLabel = `Delayed Corridors (${delayed.length})`;
    structured = buildDelayedProjectsResponse(delayed, isHindi);
  }
  // 8. Specific Project: NH-48 / Bharatmala
  else if (q.includes('nh-48') || q.includes('nh48') || q.includes('bharatmala')) {
    const proj = LOCAL_PROJECTS.find((p) => p.id === 'DOLR-2026-0084') || LOCAL_PROJECTS[0];
    updatedContext.selectedProjectId = proj.id;
    updatedContext.selectedProjectName = proj.name;
    structured = buildSingleProjectResponse(proj, isHindi);
  }
  // 9. Specific Project: Lucknow Metro
  else if (q.includes('lucknow')) {
    const proj = LOCAL_PROJECTS.find((p) => p.id === 'DOLR-2026-0059') || LOCAL_PROJECTS[3];
    updatedContext.selectedProjectId = proj.id;
    updatedContext.selectedProjectName = proj.name;
    structured = buildSingleProjectResponse(proj, isHindi);
  }
  // 10. Specific Project: Pune-Nashik
  else if (q.includes('pune') || q.includes('nashik')) {
    const proj = LOCAL_PROJECTS.find((p) => p.id === 'DOLR-2026-0066') || LOCAL_PROJECTS[2];
    updatedContext.selectedProjectId = proj.id;
    updatedContext.selectedProjectName = proj.name;
    structured = buildSingleProjectResponse(proj, isHindi);
  }
  // 11. Most Critical / High Risk
  else if (
    q.includes('critical') ||
    q.includes('गंभीर') ||
    q.includes('highest risk') ||
    q.includes('sabse zyada deri')
  ) {
    const critical = LOCAL_PROJECTS.find((p) => p.riskLevel === 'critical') || LOCAL_PROJECTS.find((p) => p.status === 'DELAYED') || LOCAL_PROJECTS[0];
    updatedContext.selectedProjectId = critical.id;
    updatedContext.selectedProjectName = critical.name;
    structured = buildSingleProjectResponse(critical, isHindi);
  }
  // 12. Today's Briefing / Attention
  else if (
    q.includes('briefing') ||
    q.includes('attention') ||
    q.includes('priorities') ||
    q.includes('प्राथमिकता') ||
    q.includes('आज की')
  ) {
    structured = buildBriefingResponse(isHindi);
  }
  // 13. Citizen: My Land / Survey Status
  else if (
    q.includes('meri zameen') ||
    q.includes('मेरी जमीन') ||
    q.includes('103') ||
    q.includes('track') ||
    q.includes('status of my land')
  ) {
    structured = buildCitizenStatusResponse(isHindi);
  }
  // 14. Citizen: Compensation
  else if (q.includes('muavja') || q.includes('मुआवजा') || q.includes('compensation')) {
    structured = buildCitizenCompensationResponse(isHindi);
  }
  // 15. Citizen: Documents
  else if (q.includes('dastavej') || q.includes('दस्तावेज') || q.includes('document')) {
    structured = buildCitizenDocumentsResponse(isHindi);
  }
  // 16. Explain Simply
  else if (q.includes('explain simply') || q.includes('simple words') || q.includes('सरल भाषा')) {
    structured = buildExplainSimplyResponse(isHindi);
  }
  // 17. Greetings
  else if (isGreeting(q)) {
    structured = buildGreetingResponse(isHindi);
  }
  // Default: State Corridors / Recent
  else {
    const recent = LOCAL_PROJECTS.slice(0, 3);
    updatedContext.lastProjects = recent.map(mapProjectContext);
    structured = buildRecentProjectsResponse(recent, isHindi);
  }

  // Set Voice Metadata & Spoken Summary
  structured.language = lang;
  structured.inputSource = dto.inputSource || 'text';
  structured.speakResponse = dto.inputSource === 'voice';
  structured.spokenSummary = generateOfflineSpokenSummary(structured);
  structured.conversationContext = updatedContext;

  return {
    id: `ai-${Date.now()}`,
    role: 'assistant',
    content: structured.summary,
    structuredResponse: structured,
    timestamp: new Date().toISOString(),
  };
}

function mapProjectContext(p: ProjectDto) {
  return {
    id: p.id,
    projectCode: p.projectCode,
    name: p.name,
    state: p.state,
    riskLevel: p.riskLevel,
    status: p.status,
  };
}

function isGreeting(q: string): boolean {
  const g = ['hi', 'hello', 'hey', 'namaste', 'नमस्ते', 'pranam', 'good morning', 'good afternoon', 'good evening'];
  return g.includes(q) || g.some((w) => q.startsWith(w));
}

// ── Response Builders ──────────────────────────────────────────────────────────

function buildSectorResponse(sector: string, projects: ProjectDto[], isHindi: boolean): AiStructuredResponse {
  const sectorHindiMap: Record<string, string> = {
    Rail: 'रेलवे (Railway)',
    Highway: 'राजमार्ग (Highways)',
    Metro: 'मेट्रो (Metro)',
    Energy: 'ऊर्जा (Energy)',
  };
  const sectorTitle = isHindi ? (sectorHindiMap[sector] || sector) : `${sector} Sector`;

  const summaries = projects.map((p, idx) => {
    const pendingHa = Math.max(0, Math.round(((p.totalAreaProposedHa || 0) - (p.totalAreaAcquiredHa || 0)) * 10) / 10);
    const pct = Math.round(((p.totalAreaAcquiredHa || 0) / (p.totalAreaProposedHa || 1)) * 100);
    if (isHindi) {
      return `${idx + 1}. **${p.name}** (${p.projectCode})\n` +
        `   • स्थान: ${p.district}, ${p.state}\n` +
        `   • स्थिति: ${p.stage}\n` +
        `   • अधिग्रहण प्रगति: ${pct}%\n` +
        `   • भूमि आवश्यकता: ${p.totalAreaProposedHa} Ha | अधिग्रहीत: ${p.totalAreaAcquiredHa} Ha | लंबित: ${pendingHa} Ha\n` +
        `   • एजेंसी: ${p.requiringBody}`;
    }
    return `${idx + 1}. **${p.name}** (${p.projectCode})\n` +
      `   • Location: ${p.district}, ${p.state}\n` +
      `   • Status: ${p.stage}\n` +
      `   • Acquisition Progress: ${pct}%\n` +
      `   • Land Required: ${p.totalAreaProposedHa} Ha | Acquired: ${p.totalAreaAcquiredHa} Ha | Pending: ${pendingHa} Ha\n` +
      `   • Requiring Body: ${p.requiringBody}`;
  }).join('\n\n');

  const text = isHindi
    ? `Bhu-Mitra के ${sectorTitle} में वर्तमान में ${projects.length} सक्रिय परियोजनाएं दर्ज हैं:\n\n${summaries}\n\nअगर आप चाहें तो मैं इनमें से किसी एक परियोजना की भूमि अधिग्रहण, मुआवज़ा और R&R की पूरी स्थिति भी बता सकता हूँ।`
    : `Found ${projects.length} active infrastructure corridor${projects.length > 1 ? 's' : ''} recorded under ${sectorTitle}:\n\n${summaries}`;

  return {
    title: isHindi ? `${sectorTitle} में सक्रिय परियोजनाएँ` : `Active Corridors in ${sectorTitle}`,
    summary: text,
    language: isHindi ? 'hi' : 'en',
    detectedIntent: 'PROJECT_SECTOR',
    projects,
    metrics: [
      { label: isHindi ? 'सक्रिय कॉरिडोर' : 'Active Corridors', value: projects.length, variant: 'default' },
      { label: isHindi ? 'कुल प्रस्तावित भूमि' : 'Proposed Land', value: `${projects.reduce((acc, p) => acc + (p.totalAreaProposedHa || 0), 0).toFixed(1)} Ha`, variant: 'info' },
      { label: isHindi ? 'अधिग्रहीत भूमि' : 'Acquired Land', value: `${projects.reduce((acc, p) => acc + (p.totalAreaAcquiredHa || 0), 0).toFixed(1)} Ha`, variant: 'success' },
    ],
    actions: [
      { label: isHindi ? 'मानचित्र पर देखें' : 'Open National GIS', actionType: 'NAVIGATE', payload: { url: '/gis' } },
      { label: isHindi ? 'एमआईएस रिपोर्ट (CSV)' : 'Export MIS (CSV)', actionType: 'GENERATE_REPORT', payload: { format: 'CSV' } },
    ],
    sources: ['National Infrastructure Pipeline (NIP)', 'DoLR Central Decision Support Engine'],
  };
}

function buildSingleProjectResponse(p: ProjectDto, isHindi: boolean): AiStructuredResponse {
  const pendingHa = Math.max(0, Math.round(((p.totalAreaProposedHa || 0) - (p.totalAreaAcquiredHa || 0)) * 10) / 10);
  const pct = Math.round(((p.totalAreaAcquiredHa || 0) / (p.totalAreaProposedHa || 1)) * 100);

  const text = isHindi
    ? `**${p.name}** (${p.projectCode}) ${p.state} राज्य के ${p.district} में स्थित ${p.type} परियोजना है।\n\n` +
      `• **वैधानिक स्थिति:** ${p.stage}\n` +
      `• **अधिग्रहण प्रगति:** ${pct}% (${p.totalAreaAcquiredHa} Ha अधिग्रहीत / ${p.totalAreaProposedHa} Ha कुल)\n` +
      `• **लंबित भूमि:** ${pendingHa} Ha\n` +
      `• **मुआवजा वितरण:** ₹${p.compensationDisbursedCr} Cr वितरित (कुल स्वीकृत: ₹${p.compensationAssessedCr} Cr)\n` +
      `• **समयसीमा (SLA):** ${p.slaDaysRemaining} दिन शेष\n` +
      `• **जोखिम स्तर:** ${p.riskLevel.toUpperCase()} RISK (${p.delayPredictedDays} दिन अनुमानित विलंब)\n` +
      `• **अनुशंसित प्रशासनिक कार्रवाई:** ${p.recommendedAction}`
    : `**${p.name}** (${p.projectCode}) is a ${p.type} corridor located in ${p.district}, ${p.state}.\n\n` +
      `• **Statutory Stage:** ${p.stage}\n` +
      `• **Acquisition Progress:** ${pct}% (${p.totalAreaAcquiredHa} Ha acquired of ${p.totalAreaProposedHa} Ha proposed)\n` +
      `• **Pending Land:** ${pendingHa} Ha\n` +
      `• **Compensation Disbursal:** ₹${p.compensationDisbursedCr} Cr disbursed of ₹${p.compensationAssessedCr} Cr assessed\n` +
      `• **Statutory SLA:** ${p.slaDaysRemaining} days remaining\n` +
      `• **Risk Tier:** ${p.riskLevel.toUpperCase()} RISK (${p.delayPredictedDays} days predicted delay)\n` +
      `• **Recommended Action:** ${p.recommendedAction}`;

  return {
    title: isHindi ? `परियोजना विवरण: ${p.name}` : `Corridor Intelligence: ${p.name}`,
    summary: text,
    language: isHindi ? 'hi' : 'en',
    detectedIntent: 'PROJECT_DETAILS',
    projects: [p],
    metrics: [
      { label: isHindi ? 'अधिग्रहण %' : 'Acquisition %', value: `${pct}%`, variant: 'info' },
      { label: isHindi ? 'SLA शेष दिन' : 'SLA Remaining', value: `${p.slaDaysRemaining} Days`, variant: p.slaDaysRemaining <= 10 ? 'danger' : 'warning' },
      { label: isHindi ? 'जोखिम स्तर' : 'Risk Tier', value: p.riskLevel.toUpperCase(), variant: p.riskLevel === 'critical' || p.riskLevel === 'high' ? 'danger' : 'default' },
      { label: isHindi ? 'वितरित मुआवजा' : 'Disbursed', value: `₹${p.compensationDisbursedCr} Cr`, variant: 'success' },
    ],
    facts: [
      `Requiring Body: ${p.requiringBody}`,
      `Total Area: ${p.totalAreaProposedHa} Ha (Acquired: ${p.totalAreaAcquiredHa} Ha, Pending: ${pendingHa} Ha)`,
      `Affected Families: ${p.affectedFamilies}`,
    ],
    actions: [
      { label: isHindi ? 'मानचित्र पर देखें' : 'Show on Map', actionType: 'GIS_FILTER', payload: { projectId: p.id, highlight: true } },
      { label: isHindi ? 'परियोजना देखें' : 'View Project', actionType: 'OPEN_PROJECT', payload: { projectId: p.id } },
    ],
    sources: ['DoLR Master Infrastructure Registry', 'State Gazettes RFCTLARR Act 2013'],
  };
}

function buildDelayedProjectsResponse(projects: ProjectDto[], isHindi: boolean): AiStructuredResponse {
  const summaries = projects.map((p, i) => {
    return `${i + 1}. **${p.name}** (${p.state}) — ${p.slaDaysRemaining <= 0 ? `${Math.abs(p.slaDaysRemaining)} दिन समयसीमा से पीछे` : `${p.slaDaysRemaining} दिन शेष`}. रुकावट: ${p.recommendedAction}`;
  }).join('\n\n');

  const text = isHindi
    ? `Bhu-Mitra टेलीमेट्री के अनुसार वर्तमान में ${projects.length} परियोजनाएं वैधानिक समयसीमा से पीछे अथवा उच्च जोखिम में हैं:\n\n${summaries}`
    : `Found ${projects.length} infrastructure corridors currently behind statutory SLA milestones or flagged with high risk:\n\n${summaries}`;

  return {
    title: isHindi ? 'विलंबित एवं उच्च जोखिम वाली परियोजनाएं' : 'Delayed Infrastructure Corridors',
    summary: text,
    language: isHindi ? 'hi' : 'en',
    detectedIntent: 'PROJECT_DELAYED',
    projects,
    metrics: [
      { label: isHindi ? 'विलंबित गलियारे' : 'Delayed Corridors', value: projects.length, variant: 'danger' },
      { label: isHindi ? 'सर्वाधिक जोखिम' : 'Highest Risk', value: projects[0]?.name || 'N/A', variant: 'warning' },
    ],
    actions: [
      { label: isHindi ? 'मानचित्र पर देखें' : 'Show on Map', actionType: 'NAVIGATE', payload: { url: '/gis' } },
      { label: isHindi ? 'दैनिक ब्रीफिंग' : "Today's Briefing", actionType: 'NAVIGATE', payload: { action: 'briefing' } },
    ],
    sources: ['DoLR Multi-Factor Delay Prediction Engine', 'District SLA Registers'],
  };
}

function buildRecentProjectsResponse(projects: ProjectDto[], isHindi: boolean): AiStructuredResponse {
  const summaries = projects.map((p, i) => {
    const pct = Math.round(((p.totalAreaAcquiredHa || 0) / (p.totalAreaProposedHa || 1)) * 100);
    return `${i + 1}. **${p.name}** (${p.type}, ${p.state}) — प्रगति: ${pct}%, स्थिति: ${p.stage}`;
  }).join('\n');

  const text = isHindi
    ? `राष्ट्रीय पोर्टल पर हाल ही में अद्यतन की गई प्रमुख परियोजनाएं:\n\n${summaries}`
    : `Here are recently updated national infrastructure corridors:\n\n${summaries}`;

  return {
    title: isHindi ? 'हाल ही में अद्यतन परियोजनाएं' : 'Recently Updated Corridors',
    summary: text,
    language: isHindi ? 'hi' : 'en',
    detectedIntent: 'PROJECT_RECENT',
    projects,
    metrics: [
      { label: isHindi ? 'निगरानी गलियारे' : 'Monitored Corridors', value: projects.length, variant: 'default' },
    ],
    actions: [
      { label: isHindi ? 'मानचित्र पर देखें' : 'Show on Map', actionType: 'NAVIGATE', payload: { url: '/gis' } },
    ],
    sources: ['National Infrastructure Pipeline (NIP)'],
  };
}

function buildBriefingResponse(isHindi: boolean): AiStructuredResponse {
  return {
    title: isHindi ? 'आज की एआई प्रशासनिक ब्रीफिंग (Executive Briefing)' : "Today's Official AI Executive Briefing",
    summary: isHindi
      ? 'सुप्रभात अधिकारी महोदय। राष्ट्रीय भूमि अधिग्रहण समीक्षा में 3 गंभीर समयसीमाएं, 12 मुआवजा बैंक सत्यापन, और 4 उच्च जोखिम वाले गलियारे चिन्हित हैं। सर्वोच्च प्राथमिकता: NH-48 भरतमाला धारा 19 घोषणा जारी करना और लखनऊ मेट्रो मुआवजा आवंटन।'
      : "Good morning Officer. Today's acquisition telemetry flags 3 critical SLA milestones, 12 compensation mandates awaiting PFMS verification, and 4 high-risk corridors. Highest priority: NH-48 Bharatmala Section 19 gazette declaration to avert statutory lapse.",
    language: isHindi ? 'hi' : 'en',
    detectedIntent: 'DAILY_BRIEFING',
    metrics: [
      { label: isHindi ? 'गंभीर उल्लंघन' : 'Critical Breaches', value: 3, variant: 'danger' },
      { label: isHindi ? 'लंबित अनुमोदन' : 'Pending Approvals', value: 12, variant: 'warning' },
      { label: isHindi ? 'स्वीकृत राशि' : 'Assessed Amount', value: '₹14,850 Cr', variant: 'info' },
      { label: isHindi ? 'डीबीटी भुगतान' : 'Disbursed (DBT)', value: '₹9,840 Cr', variant: 'success' },
    ],
    actions: [
      { label: isHindi ? 'विलंबित मामले देखें' : 'View Delayed Corridors', actionType: 'NAVIGATE', payload: { url: '/risk' } },
      { label: isHindi ? 'राष्ट्रीय जीआईएस' : 'Open National GIS', actionType: 'NAVIGATE', payload: { url: '/gis' } },
    ],
    sources: ['DoLR Central Decision Support Engine', 'Ministry of Rural Development'],
  };
}

function buildCitizenStatusResponse(isHindi: boolean): AiStructuredResponse {
  return {
    title: isHindi ? 'भूमि अधिग्रहण स्थिति ट्रैकर (सर्वे #103/10)' : 'Land Acquisition Status Tracker (Survey #103/10)',
    summary: isHindi
      ? 'सर्वे नंबर #103/10 के लिए प्रारंभिक धारा 11 राजपत्र अधिसूचना (Gazette No. 512/2026) जारी हो चुकी है। धारा 15 आपत्ति सुनवाई पूर्ण हो चुकी है और धारा 23 मुआवजा अवार्ड तैयार किया जा रहा है। 80% राशि सीधे आपके बैंक खाते में भेजी जाएगी।'
      : 'For Survey #103/10, preliminary Section 11 gazette notification has been published. Section 15 objection hearing is complete and Section 23 award declaration is under preparation. 80% compensation will be transferred directly to your bank account via DBT.',
    language: isHindi ? 'hi' : 'en',
    detectedIntent: 'CITIZEN_ACQUISITION_STATUS',
    actions: [
      { label: isHindi ? 'नक्शे पर जमीन देखें' : 'View on Map', actionType: 'GIS_FILTER', payload: { parcelId: '103-10', highlight: true } },
      { label: isHindi ? 'मुआवजा स्थिति' : 'Check Compensation', actionType: 'OPEN_COMPENSATION', payload: {} },
    ],
    sources: ['राजपत्र असाधारण संख्या 512/2026-DoLR', 'सक्षम प्राधिकारी (CALA)'],
  };
}

function buildCitizenCompensationResponse(isHindi: boolean): AiStructuredResponse {
  return {
    title: isHindi ? 'मुआवजा आकलन एवं भुगतान स्थिति' : 'Authorized Compensation Calculation',
    summary: isHindi
      ? 'सर्वे #103/10 हेतु कुल ₹48.50 लाख का मुआवजा स्वीकृत हुआ है। 80% राशि (₹38.80 लाख) सीधे बैंक खाते में प्रेषित की जा चुकी है, शेष 20% (₹9.70 लाख) अंतिम भौतिक कब्ज़ा हस्तांतरण पर देय होगी।'
      : 'For Survey #103/10, total authorized compensation is ₹48.50 Lakhs. 80% (₹38.80 L) has been transferred via Direct Benefit Transfer (DBT), and remainder 20% (₹9.70 L) will disburse upon possession handover.',
    language: isHindi ? 'hi' : 'en',
    detectedIntent: 'CITIZEN_COMPENSATION',
    actions: [
      { label: isHindi ? 'दस्तावेज अपलोड करें' : 'Upload Bank Details', actionType: 'NAVIGATE', payload: { url: '/citizen' } },
    ],
    sources: ['सक्षम प्राधिकारी (CALA) अवार्ड आदेश #2026-084-103'],
  };
}

function buildCitizenDocumentsResponse(isHindi: boolean): AiStructuredResponse {
  return {
    title: isHindi ? 'आवश्यक दस्तावेज चेकलिस्ट' : 'Mandatory Documents Checklist',
    summary: isHindi
      ? 'भूमि अधिग्रहण मुआवजा और पुनर्वास लाभ प्राप्त करने हेतु निम्नलिखित 5 दस्तावेज आवश्यक हैं:\n\n1. खतौनी / 7/12 (Record of Rights)\n2. आधार कार्ड (UIDAI बायोमेट्रिक/ओटीपी सत्यापन हेतु)\n3. बैंक पासबुक या कैंसल चेक (PFMS/DBT भुगतान हेतु)\n4. पैन कार्ड\n5. चालू वित्तीय वर्ष की लगान रसीद'
      : 'To claim compensation award and R&R entitlements under RFCTLARR Act 2013, keep the following 5 documents ready:\n\n1. Record of Rights (RoR 7/12 or Jamabandi)\n2. Aadhaar Card for UIDAI biometric/OTP verification\n3. Bank Passbook or Cancelled Cheque for PFMS/DBT disbursal\n4. PAN Card\n5. Land Revenue Tax Receipt for current financial year',
    language: isHindi ? 'hi' : 'en',
    detectedIntent: 'CITIZEN_DOCUMENTS',
    actions: [
      { label: isHindi ? 'दस्तावेज अपलोड करें' : 'Upload Documents', actionType: 'NAVIGATE', payload: { url: '/citizen' } },
    ],
    sources: ['Ministry of Rural Development, Government of India'],
  };
}

function buildExplainSimplyResponse(isHindi: boolean): AiStructuredResponse {
  return {
    title: isHindi ? 'सरल भाषा में व्याख्या (Plain Language)' : 'Plain-Language Citizen Explanation',
    summary: isHindi
      ? 'सरल शब्दों में: सरकार राष्ट्रीय राजमार्ग (NH-48) को चौड़ा करने के लिए जमीन ले रही है। आपकी जमीन का नाप-जोख हो चुका है। सरकार ने इसके बदले में बाजार भाव से दोगुना (100% अतिरिक्त सोलेशियम) मुआवजा तय किया है। 80% पैसा सीधे बैंक खाते में भेजा जा चुका है। बाकी 20% पैसा जमीन का कब्जा सौंपते ही मिल जाएगा।'
      : 'In Simple Words: The government is widening National Highway NH-48. Your land survey has been verified. You are entitled to double the market value (including 100% solatium bonus) under statutory law. 80% of your compensation has already been deposited into your bank account. The remaining 20% will be transferred as soon as possession is completed.',
    language: isHindi ? 'hi' : 'en',
    detectedIntent: 'EXPLAIN_SIMPLY',
    actions: [
      { label: isHindi ? 'नक्शा देखें' : 'View on Map', actionType: 'GIS_FILTER', payload: { parcelId: '103-10', highlight: true } },
    ],
    sources: ['RFCTLARR Act 2013 Citizen Handbook'],
  };
}

function buildGreetingResponse(isHindi: boolean): AiStructuredResponse {
  return {
    title: isHindi ? 'भू-मित्र एआई कमांड केंद्र' : 'Bhu-Mitra AI Command Center',
    summary: isHindi
      ? 'नमस्ते! मैं भू-मित्र एआई कमांड सहायक हूँ। आप राष्ट्रीय परियोजनाओं (जैसे रेलवे, हाईवे, विलंबित गलियारे) या अपनी जमीन के अधिग्रहण व मुआवजे की स्थिति के बारे में पूछ सकते हैं।'
      : 'Hello! I am the Bhu-Mitra AI Command Assistant. Ask me about recent projects, delayed corridors, high-risk infrastructure, or state-specific acquisitions (e.g. in Madhya Pradesh or Gujarat).',
    language: isHindi ? 'hi' : 'en',
    detectedIntent: 'GENERAL_GREETING',
    actions: [
      { label: isHindi ? 'रेलवे परियोजनाएं' : 'Show Railway Projects', actionType: 'NAVIGATE', payload: { sector: 'Rail' } },
      { label: isHindi ? 'विलंबित परियोजनाएं' : 'Delayed Projects', actionType: 'NAVIGATE', payload: { action: 'delayed' } },
      { label: isHindi ? 'राष्ट्रीय जीआईएस' : 'Open National GIS', actionType: 'NAVIGATE', payload: { url: '/gis' } },
    ],
    sources: ['Department of Land Resources (DoLR), Ministry of Rural Development'],
  };
}

function generateOfflineSpokenSummary(structured: AiStructuredResponse): string {
  const isHindi = structured.language === 'hi';

  if (structured.detectedIntent === 'PROJECT_SECTOR' && structured.projects && structured.projects.length > 0) {
    const names = structured.projects.map((p) => p.name).join(isHindi ? ' और ' : ' and ');
    if (isHindi) {
      return `भू-मित्र के डेटाबेस में ${structured.projects.length} सक्रिय परियोजनाएं दर्ज हैं: ${names}।`;
    }
    return `I found ${structured.projects.length} active corridors: ${names}.`;
  }

  if (structured.detectedIntent === 'PROJECT_DETAILS' && structured.projects && structured.projects.length > 0) {
    const p = structured.projects[0];
    const pct = Math.round(((p.totalAreaAcquiredHa || 0) / (p.totalAreaProposedHa || 1)) * 100);
    if (isHindi) {
      return `${p.name} का अधिग्रहण ${pct} प्रतिशत पूर्ण हो चुका है। स्थिति ${p.status} है।`;
    }
    return `${p.name} acquisition is ${pct} percent complete with current status ${p.status}.`;
  }

  if (structured.detectedIntent === 'PROJECT_DELAYED' && structured.projects && structured.projects.length > 0) {
    if (isHindi) {
      return `वर्तमान में ${structured.projects.length} परियोजनाएं वैधानिक समयसीमा से पीछे चल रही हैं।`;
    }
    return `I found ${structured.projects.length} delayed corridors currently behind statutory schedules.`;
  }

  if (structured.detectedIntent === 'GENERAL_GREETING') {
    if (isHindi) {
      return 'नमस्ते! मैं भू-मित्र एआई कमांड सहायक हूँ। आप राष्ट्रीय परियोजनाओं, विलंबित गलियारों, या राज्यवार अधिग्रहण के बारे में पूछ सकते हैं।';
    }
    return 'Hello! I am the Bhu-Mitra AI Command Assistant. Ask me about recent projects, delayed corridors, or land acquisition status.';
  }

  // Sanitize summary
  return cleanText(structured.summary);
}

function cleanText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[*#_`~>|]/g, '')
    .replace(/•\s*/g, '')
    .replace(/₹/g, 'Rupees ')
    .replace(/%/g, ' percent')
    .replace(/\s+/g, ' ')
    .replace(/(\n|\r)+/g, '. ')
    .replace(/\.{2,}/g, '.')
    .trim();
}
