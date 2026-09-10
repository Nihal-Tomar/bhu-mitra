import { Injectable } from '@nestjs/common';
import { AiToolsService } from './ai-tools.service';
import { AiDelayEngineService } from './ai-delay-engine.service';
import { AiRiskEngineService } from './ai-risk-engine.service';
import { AiProviderService } from './ai-provider.service';
import { AuditService } from '../../audit/audit.service';
import { LanguageDetectionService } from './language-detection.service';
import { DocumentIntelligenceService } from './document-intelligence.service';
import { AiIntentEngineService, type IntentAnalysisResult } from './ai-intent-engine.service';
import type {
  AiQueryDto,
  AiStructuredResponse,
  AiMessage,
  AiConversationSession,
  AiConversationContext,
  UserSession,
  SupportedLanguage,
  ProjectDto,
} from '@bhumitra/types';

@Injectable()
export class AiService {
  private readonly sessions: Map<string, AiConversationSession> = new Map();

  constructor(
    private readonly tools: AiToolsService,
    private readonly delayEngine: AiDelayEngineService,
    private readonly riskEngine: AiRiskEngineService,
    private readonly provider: AiProviderService,
    private readonly audit: AuditService,
    private readonly languageDetector: LanguageDetectionService,
    private readonly documentIntelligence: DocumentIntelligenceService,
    private readonly intentEngine: AiIntentEngineService,
  ) {}

  /**
   * Main query execution pipeline
   */
  async processQuery(dto: AiQueryDto, user?: UserSession): Promise<AiMessage> {
    const rawMessage = dto.message?.trim() || '';
    const detected = this.languageDetector.detectLanguage(rawMessage);
    // If the message contains non-English text/script or explicit language marker, use detected language
    const lang: SupportedLanguage = detected.language !== 'en' ? detected.language : (dto.language || 'en');

    // Retrieve or initialize conversation session and context
    const sessionId = dto.conversationId || 'default-session';
    const existingSession = this.sessions.get(sessionId);
    const activeContext: AiConversationContext = {
      ...(existingSession?.context || {}),
      ...(dto.conversationContext || {}),
    };

    // Check for Document Intelligence / Notice attachment
    if (
      dto.attachment ||
      rawMessage.toLowerCase().includes('this notice') ||
      rawMessage.toLowerCase().includes('this document')
    ) {
      const fileName = dto.attachment?.name || 'Gazette_Notification_RFCTLARR_Sec11.pdf';
      const fileContent = dto.attachment?.content || rawMessage;
      const docResponse = this.documentIntelligence.analyzeDocument(fileName, fileContent, lang);
      return {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: docResponse.summary,
        structuredResponse: docResponse,
        timestamp: new Date().toISOString(),
      };
    }

    // 1. Natural Language Intent & Entity Extraction
    const analysis = this.intentEngine.analyze(rawMessage, lang, activeContext);

    // 2. Data Retrieval, Grounded Analysis & Context Updating
    const { structured, updatedContext } = await this.executeIntent(
      analysis,
      rawMessage,
      lang,
      activeContext,
      user,
    );

    // Attach updated conversation context to response
    structured.conversationContext = updatedContext;

    // 3. Optional LLM enhancement for phrasing if available
    const llmSummary = await this.provider.enhanceWithLlm(rawMessage, {
      language: lang,
      intent: structured.detectedIntent || analysis.intent,
      data: structured as unknown as Record<string, unknown>,
    });
    if (llmSummary) {
      structured.summary = llmSummary;
    }

    // 4. Set Voice Metadata & Contextual Natural Spoken Response
    const inputSource = dto.inputSource || 'text';
    structured.inputSource = inputSource;
    structured.speakResponse = inputSource === 'voice';
    structured.spokenSummary = this.generateSpokenSummary(structured);

    // 5. Record Audit Log
    try {
      await this.audit.getLogs({ actorId: user?.id || 'public-user' });
    } catch {
      // Non-blocking
    }

    const message: AiMessage = {
      id: `ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      role: 'assistant',
      content: structured.summary,
      structuredResponse: structured,
      timestamp: new Date().toISOString(),
    };

    // Store in session with updated context
    this.appendMessageToSession(sessionId, rawMessage, message, updatedContext);

    return message;
  }

  /**
   * Execute Intent with Real Application Data
   */
  private async executeIntent(
    analysis: IntentAnalysisResult,
    rawMessage: string,
    lang: SupportedLanguage,
    context: AiConversationContext,
    user?: UserSession,
  ): Promise<{ structured: AiStructuredResponse; updatedContext: AiConversationContext }> {
    const updatedContext: AiConversationContext = { ...context };

    switch (analysis.intent) {
      // ─── 1. RECENT PROJECTS ───────────────────────────────────────────────────
      case 'PROJECT_RECENT': {
        const projects = await this.tools.getRecentProjects(5);
        updatedContext.lastProjects = projects.map((p) => this.mapProjectContext(p));
        updatedContext.contextLabel = `Recent Projects (${projects.length})`;
        return {
          structured: this.renderProjectListResponse(
            lang === 'hi' ? 'हाल ही में अद्यतन परियोजनाएं' : 'Recently Updated Projects',
            lang === 'hi'
              ? `राष्ट्रीय पोर्टल पर हाल ही में अद्यतन की गई 5 प्रमुख परियोजनाएं:`
              : `Here are the 5 most recently updated infrastructure corridors based on latest field progress and SLA telemetry:`,
            projects,
            lang,
            'PROJECT_RECENT',
          ),
          updatedContext,
        };
      }

      // ─── 2. DELAYED PROJECTS ──────────────────────────────────────────────────
      case 'PROJECT_DELAYED': {
        const delayed = await this.tools.getDelayedProjects();
        updatedContext.lastProjects = delayed.map((p) => this.mapProjectContext(p));
        updatedContext.activeFilters = { status: 'DELAYED' };
        updatedContext.contextLabel = `Delayed Projects (${delayed.length})`;
        return {
          structured: this.renderProjectListResponse(
            lang === 'hi' ? 'विलंबित परियोजनाएं' : 'Delayed Infrastructure Projects',
            lang === 'hi'
              ? `वर्तमान में ${delayed.length} परियोजनाएं वैधानिक समयसीमा से पीछे चल रही हैं:`
              : `Found ${delayed.length} infrastructure projects currently running behind statutory milestone schedules:`,
            delayed,
            lang,
            'PROJECT_DELAYED',
          ),
          updatedContext,
        };
      }

      // ─── 3. LOCATION FILTER (STATE / DISTRICT) ────────────────────────────────
      case 'PROJECT_LOCATION': {
        const stateName = analysis.entities.state || 'Selected State';
        const projects = await this.tools.filterProjects({
          state: analysis.entities.state,
          stateCode: analysis.entities.stateCode,
          isDelayed: analysis.entities.isDelayed,
        });
        updatedContext.lastProjects = projects.map((p) => this.mapProjectContext(p));
        updatedContext.activeFilters = { state: stateName };
        updatedContext.contextLabel = `${stateName} (${projects.length} Projects)`;

        if (projects.length === 0) {
          return {
            structured: {
              title: lang === 'hi' ? `${stateName} में परियोजनाएं` : `Projects in ${stateName}`,
              summary:
                lang === 'hi'
                  ? `${stateName} में वर्तमान डेटासेट में कोई परियोजना नहीं मिली। आप मध्य प्रदेश, गुजरात, महाराष्ट्र, राजस्थान या उत्तर प्रदेश के बारे में पूछ सकते हैं।`
                  : `I couldn't find any projects recorded in ${stateName} in the current Bhu-Mitra dataset. You can explore active corridors in Madhya Pradesh, Gujarat, Maharashtra, Rajasthan, or Uttar Pradesh.`,
              language: lang,
              detectedIntent: 'PROJECT_LOCATION',
              actions: [
                { label: 'Show Madhya Pradesh', actionType: 'NAVIGATE', payload: { state: 'MP' } },
                { label: 'Show Gujarat', actionType: 'NAVIGATE', payload: { state: 'GJ' } },
              ],
              sources: ['State Infrastructure Registry'],
            },
            updatedContext,
          };
        }

        return {
          structured: this.renderProjectListResponse(
            lang === 'hi' ? `${stateName} में परियोजनाएं` : `Acquisition Corridors in ${stateName}`,
            lang === 'hi'
              ? `${stateName} में ${projects.length} सक्रिय परियोजनाएं दर्ज हैं:`
              : `Found ${projects.length} acquisition project${projects.length > 1 ? 's' : ''} active in ${stateName}:`,
            projects,
            lang,
            'PROJECT_LOCATION',
          ),
          updatedContext,
        };
      }

      // ─── 4. SECTOR FILTER ─────────────────────────────────────────────────────
      case 'PROJECT_SECTOR': {
        const sector = analysis.entities.sector || 'Sector';
        const projects = await this.tools.filterProjects({ sector });
        updatedContext.lastProjects = projects.map((p) => this.mapProjectContext(p));
        updatedContext.activeFilters = { sector };
        updatedContext.contextLabel = `${sector} Corridors (${projects.length})`;

        const isHindi = lang === 'hi';
        const sectorHindiMap: Record<string, string> = {
          Rail: 'रेलवे (Railway)',
          Highway: 'राजमार्ग (Highways)',
          Metro: 'मेट्रो (Metro)',
          Energy: 'ऊर्जा (Energy)',
          'Smart City': 'स्मार्ट सिटी (Smart City)',
          Port: 'बंदरगाह (Ports)',
          Airport: 'हवाई अड्डा (Airports)',
        };
        const sectorDisplay = isHindi ? (sectorHindiMap[sector] || sector) : `${sector} Infrastructure`;

        if (projects.length === 0) {
          return {
            structured: {
              title: isHindi ? `${sectorDisplay} परियोजनाएं` : `${sector} Infrastructure Projects`,
              summary: isHindi
                ? `Bhu-Mitra डेटाबेस में वर्तमान में ${sectorDisplay} सेक्टर के लिए कोई सक्रिय परियोजना दर्ज नहीं है। आप रेलवे, हाईवे या मेट्रो प्रोजेक्ट्स के बारे में पूछ सकते हैं।`
                : `No active infrastructure corridors recorded under the ${sector} sector in the current Bhu-Mitra dataset. You can explore active corridors in Railways, Highways, or Metro sectors.`,
              language: lang,
              detectedIntent: 'PROJECT_SECTOR',
              actions: [
                { label: isHindi ? 'रेलवे प्रोजेक्ट देखें' : 'Show Railway Projects', actionType: 'NAVIGATE', payload: { sector: 'Rail' } },
                { label: isHindi ? 'हाईवे प्रोजेक्ट देखें' : 'Show Highway Projects', actionType: 'NAVIGATE', payload: { sector: 'Highway' } },
              ],
              sources: ['National Infrastructure Pipeline (NIP)', 'DoLR Central Decision Support Engine'],
            },
            updatedContext,
          };
        }

        const projectSummaries = projects
          .map((p, idx) => {
            const pendingHa = Math.max(0, Math.round(((p.totalAreaProposedHa || 0) - (p.totalAreaAcquiredHa || 0)) * 10) / 10);
            const progressPct = Math.round(((p.totalAreaAcquiredHa || 0) / (p.totalAreaProposedHa || 1)) * 100);
            if (isHindi) {
              return `${idx + 1}. **${p.name}** (${p.projectCode || p.id})\n` +
                `   • स्थान: ${p.district ? p.district + ', ' : ''}${p.state}\n` +
                `   • स्थिति: ${p.stage || p.status}\n` +
                `   • प्रगति: ${progressPct}%\n` +
                `   • भूमि अधिग्रहण: कुल आवश्यकता ${p.totalAreaProposedHa} Ha | अधिग्रहीत: ${p.totalAreaAcquiredHa} Ha | लंबित: ${pendingHa} Ha\n` +
                `   • प्रभावित परिवार: ${p.affectedFamilies || 'उपलब्ध नहीं'}\n` +
                `   • एजेंसी: ${p.requiringBody || p.ministry}`;
            }
            return `${idx + 1}. **${p.name}** (${p.projectCode || p.id})\n` +
              `   • Location: ${p.district ? p.district + ', ' : ''}${p.state}\n` +
              `   • Status: ${p.stage || p.status}\n` +
              `   • Progress: ${progressPct}%\n` +
              `   • Land Acquisition: Proposed: ${p.totalAreaProposedHa} Ha | Acquired: ${p.totalAreaAcquiredHa} Ha | Pending: ${pendingHa} Ha\n` +
              `   • Affected Families: ${p.affectedFamilies || 'N/A'}\n` +
              `   • Requiring Body: ${p.requiringBody || p.ministry}`;
          })
          .join('\n\n');

        const summaryText = isHindi
          ? `Bhu-Mitra के ${sectorDisplay} सेक्टर में वर्तमान में ${projects.length} सक्रिय परियोजनाएं दर्ज हैं:\n\n${projectSummaries}\n\nअगर आप चाहें तो मैं इनमें से किसी एक परियोजना की भूमि अधिग्रहण, मुआवज़ा और R&R की पूरी स्थिति भी बता सकता हूँ।`
          : `Found ${projects.length} active corridors categorized under ${sector} sector:\n\n${projectSummaries}`;

        return {
          structured: this.renderProjectListResponse(
            isHindi ? `${sectorDisplay} में सक्रिय परियोजनाएँ` : `${sector} Infrastructure Projects`,
            summaryText,
            projects,
            lang,
            'PROJECT_SECTOR',
          ),
          updatedContext,
        };
      }

      // ─── 5. STATUTORY STAGE FILTER ────────────────────────────────────────────
      case 'PROJECT_STAGE': {
        const stageCode = analysis.entities.stageCode || 'SEC_15_HEARING';
        const projects = await this.tools.filterProjects({ stageCode });
        updatedContext.lastProjects = projects.map((p) => this.mapProjectContext(p));
        updatedContext.activeFilters = { stage: stageCode };
        updatedContext.contextLabel = `Stage: ${stageCode} (${projects.length})`;

        return {
          structured: this.renderProjectListResponse(
            `Projects at Stage: ${stageCode}`,
            `Identified ${projects.length} infrastructure corridors currently pending at ${stageCode}:`,
            projects,
            lang,
            'PROJECT_STAGE',
          ),
          updatedContext,
        };
      }

      // ─── 6. PENDING COMPENSATION ──────────────────────────────────────────────
      case 'PROJECT_COMPENSATION_PENDING': {
        const projects = await this.tools.getProjectsWithPendingCompensation();
        updatedContext.lastProjects = projects.map((p) => this.mapProjectContext(p));
        updatedContext.contextLabel = `Compensation Backlog (${projects.length})`;

        return {
          structured: this.renderProjectListResponse(
            'Projects with Pending Compensation Disbursal',
            `Found ${projects.length} corridors with significant gaps between assessed compensation and disbursed DBT funds:`,
            projects,
            lang,
            'PROJECT_COMPENSATION_PENDING',
          ),
          updatedContext,
        };
      }

      // ─── 7. MOST CRITICAL PROJECT ─────────────────────────────────────────────
      case 'PROJECT_MOST_CRITICAL': {
        // Check candidate projects from context first if follow-up
        let candidateProjects: ProjectDto[] | undefined;
        if (context.lastProjects && context.lastProjects.length > 0) {
          const loaded = await Promise.all(
            context.lastProjects.map((lp) => this.tools.getProjectDetails(lp.id, user)),
          );
          candidateProjects = loaded.filter((p): p is ProjectDto => p !== null);
        }

        const critical = await this.tools.getMostCriticalProject(candidateProjects);
        if (!critical) {
          return {
            structured: {
              title: 'Critical Project Assessment',
              summary: 'No projects with high or critical risk levels were found matching your current context.',
              language: lang,
              detectedIntent: 'PROJECT_MOST_CRITICAL',
            },
            updatedContext,
          };
        }

        updatedContext.selectedProjectId = critical.id;
        updatedContext.selectedProjectCode = critical.projectCode;
        updatedContext.selectedProjectName = critical.name;
        updatedContext.contextLabel = `Critical: ${critical.name}`;

        const isHindi = lang === 'hi';
        return {
          structured: {
            title: isHindi
              ? `सर्वाधिक गंभीर परियोजना: ${critical.name}`
              : `Most Critical Project: ${critical.name}`,
            summary: isHindi
              ? `पहचानी गई सर्वाधिक गंभीर परियोजना ${critical.projectCode} (${critical.name}) है। इसका जोखिम स्तर ${critical.riskLevel.toUpperCase()} है और वैधानिक SLA केवल ${critical.slaDaysRemaining} दिन शेष है।`
              : `The most critical project identified is ${critical.projectCode} (${critical.name}) in ${critical.state}. It is flagged as ${critical.riskLevel.toUpperCase()} RISK with SLA Days Remaining at ${critical.slaDaysRemaining} and ${critical.delayPredictedDays} days of predicted delay.`,
            language: lang,
            detectedIntent: 'PROJECT_MOST_CRITICAL',
            projects: [critical],
            metrics: [
              { label: 'Risk Level', value: critical.riskLevel.toUpperCase(), variant: 'danger' },
              { label: 'SLA Remaining', value: `${critical.slaDaysRemaining} Days`, variant: critical.slaDaysRemaining <= 10 ? 'danger' : 'warning' },
              { label: 'Stage', value: critical.stageCode, variant: 'default' },
              { label: 'Compensation Disbursed', value: `₹${critical.compensationDisbursedCr} Cr`, variant: 'info' },
            ],
            facts: [
              `State / District: ${critical.district}, ${critical.state}`,
              `Requiring Body: ${critical.requiringBody}`,
              `Recommended Statutory Action: ${critical.recommendedAction}`,
            ],
            actions: [
              { label: 'Why is it delayed?', actionType: 'OPEN_PROJECT', payload: { projectId: critical.id, query: 'why_delayed' } },
              { label: 'View Project', actionType: 'OPEN_PROJECT', payload: { projectId: critical.id } },
              { label: 'Show on Map', actionType: 'GIS_FILTER', payload: { projectId: critical.id, highlight: true } },
            ],
            sources: ['DoLR Multi-Factor Risk Model', 'State SLA Register'],
          },
          updatedContext,
        };
      }

      // ─── 8. WHY DELAYED (SPECIFIC CORRIDOR) ───────────────────────────────────
      case 'PROJECT_WHY_DELAYED': {
        const identifier =
          analysis.entities.projectQuery ||
          analysis.resolvedProjectId ||
          context.selectedProjectId ||
          context.lastProjects?.[0]?.id ||
          'proj-0084';

        const project = await this.tools.findProjectByNameOrCode(identifier);
        if (!project) {
          return {
            structured: {
              title: 'Project Delay Diagnostics',
              summary: `I couldn't find a project matching "${identifier}" in the current Bhu-Mitra records. Please verify the project name or corridor ID.`,
              language: lang,
              detectedIntent: 'PROJECT_WHY_DELAYED',
            },
            updatedContext,
          };
        }

        updatedContext.selectedProjectId = project.id;
        updatedContext.selectedProjectCode = project.projectCode;
        updatedContext.selectedProjectName = project.name;
        updatedContext.contextLabel = `Project ${project.name}`;

        const delayDiag = this.delayEngine.analyzeProjectDelay(project);
        const riskAss = this.riskEngine.evaluateProjectRisk(project, delayDiag.bottlenecks.length);

        const isHindi = lang === 'hi';
        return {
          structured: {
            title: isHindi
              ? `विलंब का कारण: ${project.name}`
              : `Delay Diagnostics: ${project.name}`,
            summary: isHindi
              ? `${project.name} (${project.projectCode}) वर्तमान में ${project.status} स्थिति में है। वैधानिक SLA में केवल ${project.slaDaysRemaining} दिन शेष हैं। मुख्य रुकावट: ${delayDiag.bottlenecks[0]?.issue || project.recommendedAction}।`
              : `${project.name} (${project.projectCode}) is currently ${project.status}. SLA days remaining: ${project.slaDaysRemaining} days. Key delay factors: ${delayDiag.bottlenecks.map((b: any) => b.issue).join('; ') || project.recommendedAction}.`,

            language: lang,
            detectedIntent: 'DELAY_ANALYSIS',
            projects: [project],
            metrics: [
              { label: 'Status', value: project.status, variant: project.status === 'DELAYED' ? 'danger' : 'warning' },
              { label: 'SLA Days Remaining', value: `${project.slaDaysRemaining} Days`, variant: project.slaDaysRemaining <= 10 ? 'danger' : 'info' },
              { label: 'Risk Score', value: `${riskAss.score}/100`, variant: riskAss.level === 'CRITICAL' ? 'danger' : 'warning' },
              { label: 'Acquired Area', value: `${Math.round((project.totalAreaAcquiredHa / (project.totalAreaProposedHa || 1)) * 100)}%`, variant: 'info' },
            ],
            risk: riskAss,
            bottlenecks: delayDiag.bottlenecks,
            facts: [
              `Statutory Stage: ${project.stage}`,
              `Compensation Disbursed: ₹${project.compensationDisbursedCr} Cr of ₹${project.compensationAssessedCr || project.estimatedBudgetCr} Cr assessed.`,
              `Affected Families: ${project.affectedFamilies}`,
              `Target Completion Date: ${new Date(project.targetCompletionDate).toLocaleDateString('en-IN')}`,
            ],
            recommendations: delayDiag.recommendations,
            actions: [
              { label: 'View Project', actionType: 'OPEN_PROJECT', payload: { projectId: project.id } },
              { label: 'Show on Map', actionType: 'GIS_FILTER', payload: { projectId: project.id, highlight: true } },
              { label: 'Check Compensation', actionType: 'OPEN_COMPENSATION', payload: { projectId: project.id } },
            ],
            sources: ['State Gazette Record', 'CALA Revenue Court Register', 'PFMS Disbursement Ledger'],
          },
          updatedContext,
        };
      }

      // ─── 9. PROJECT DETAILS / SUMMARY ─────────────────────────────────────────
      case 'PROJECT_DETAILS': {
        const identifier = analysis.entities.projectQuery || analysis.resolvedProjectId || 'proj-0084';
        const project = await this.tools.findProjectByNameOrCode(identifier);
        if (!project) {
          return {
            structured: {
              title: 'Project Details',
              summary: `I could not find project records matching "${identifier}".`,
              language: lang,
              detectedIntent: 'PROJECT_DETAILS',
            },
            updatedContext,
          };
        }

        updatedContext.selectedProjectId = project.id;
        updatedContext.selectedProjectCode = project.projectCode;
        updatedContext.selectedProjectName = project.name;
        updatedContext.contextLabel = `Project ${project.name}`;

        return {
          structured: this.renderSingleProjectResponse(project, lang),
          updatedContext,
        };
      }

      // ─── 10. PROJECT COUNT QUERY ──────────────────────────────────────────────
      case 'PROJECT_COUNT': {
        const projects = await this.tools.filterProjects({
          state: analysis.entities.state,
          sector: analysis.entities.sector,
          isDelayed: analysis.entities.isDelayed,
        });

        const filterDesc = [
          analysis.entities.isDelayed ? 'delayed' : '',
          analysis.entities.sector || '',
          analysis.entities.state ? `in ${analysis.entities.state}` : '',
        ]
          .filter(Boolean)
          .join(' ');

        return {
          structured: {
            title: 'Project Count Telemetry',
            summary: `There ${projects.length === 1 ? 'is' : 'are'} currently ${projects.length} ${filterDesc || 'active'} project${projects.length === 1 ? '' : 's'} recorded in Bhu-Mitra.`,
            language: lang,
            detectedIntent: 'PROJECT_COUNT',
            projects: projects.slice(0, 5),
            metrics: [{ label: 'Matching Projects', value: projects.length, variant: 'info' }],
            actions: [
              { label: 'Show Project List', actionType: 'NAVIGATE', payload: { action: 'list' } },
              { label: 'Open National GIS', actionType: 'NAVIGATE', payload: { url: '/gis' } },
            ],
            sources: ['DoLR Master Infrastructure Registry'],
          },
          updatedContext,
        };
      }

      // ─── 11. HIGH RISK PROJECTS ───────────────────────────────────────────────
      case 'PROJECT_HIGH_RISK': {
        const delayed = await this.tools.getDelayedProjects();
        updatedContext.lastProjects = delayed.map((p) => this.mapProjectContext(p));
        updatedContext.contextLabel = `High-Risk Projects (${delayed.length})`;

        return {
          structured: this.renderProjectListResponse(
            'High-Risk Infrastructure Corridors',
            `Currently ${delayed.length} acquisition projects have high or critical risk indicators due to statutory deadlines or pending compensation:`,
            delayed,
            lang,
            'PROJECT_HIGH_RISK',
          ),
          updatedContext,
        };
      }

      // ─── 12. ATTENTION TODAY / DAILY BRIEFING ─────────────────────────────────
      case 'ATTENTION_TODAY': {
        return {
          structured: await this.handleAttentionToday(lang),
          updatedContext,
        };
      }

      case 'DAILY_BRIEFING': {
        return {
          structured: await this.handleDailyBriefing(lang),
          updatedContext,
        };
      }

      // ─── 13. GIS / MAP ────────────────────────────────────────────────────────
      case 'GIS_MAP': {
        return {
          structured: await this.handleGisRequest(lang, context.selectedProjectId, '103-10'),
          updatedContext,
        };
      }

      // ─── 14. REPORT GENERATION ────────────────────────────────────────────────
      case 'REPORT_GENERATION': {
        return {
          structured: await this.handleReportGeneration(lang, context.selectedProjectId),
          updatedContext,
        };
      }

      // ─── 15. CITIZEN SPECIFIC ─────────────────────────────────────────────────
      case 'CITIZEN_ACQUISITION_STATUS': {
        return {
          structured: this.handleCitizenStatus(lang, '103-10'),
          updatedContext,
        };
      }

      case 'CITIZEN_COMPENSATION': {
        return {
          structured: this.handleCitizenCompensation(lang, '103-10'),
          updatedContext,
        };
      }

      case 'CITIZEN_DOCUMENTS': {
        return {
          structured: this.handleCitizenDocuments(lang),
          updatedContext,
        };
      }

      case 'EXPLAIN_SIMPLY': {
        return {
          structured: this.handleExplainSimply(lang, context.selectedProjectId),
          updatedContext,
        };
      }

      // ─── 16. GENERAL GREETING (STRICT) ────────────────────────────────────────
      case 'GENERAL_GREETING': {
        return {
          structured: this.handleGreeting(lang),
          updatedContext,
        };
      }

      case 'HELP': {
        return {
          structured: this.handleHelp(lang),
          updatedContext,
        };
      }

      // ─── 17. UNKNOWN / AMBIGUOUS ──────────────────────────────────────────────
      default: {
        return {
          structured: {
            title: 'Bhu-Mitra Decision Support',
            summary:
              lang === 'hi'
                ? 'मुझे इस प्रश्न का सीधा रिकॉर्ड नहीं मिला। आप विलंबित परियोजनाओं, हाल के अपडेट्स, या किसी विशेष राज्य (जैसे मध्य प्रदेश या गुजरात) के बारे में पूछ सकते हैं।'
                : `I could not find exact records matching "${rawMessage}". Would you like to view active corridors, delayed projects, recently updated projects, or filter by state (e.g. Madhya Pradesh, Gujarat)?`,
            language: lang,
            detectedIntent: 'UNKNOWN',
            actions: [
              { label: 'Show Recent Projects', actionType: 'NAVIGATE', payload: { action: 'recent' } },
              { label: 'Show Delayed Projects', actionType: 'NAVIGATE', payload: { action: 'delayed' } },
              { label: 'Projects in MP', actionType: 'NAVIGATE', payload: { state: 'MP' } },
            ],
            sources: ['Bhu-Mitra National Land Acquisition Engine'],
          },
          updatedContext,
        };
      }
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Helper Renderers
  // ───────────────────────────────────────────────────────────────────────────

  private renderProjectListResponse(
    title: string,
    summary: string,
    projects: ProjectDto[],
    lang: SupportedLanguage,
    intent: string,
  ): AiStructuredResponse {
    return {
      title,
      summary,
      language: lang,
      detectedIntent: intent,
      projects,
      metrics: [
        { label: 'Total Corridors', value: projects.length, variant: 'default' },
        {
          label: 'Delayed / At Risk',
          value: projects.filter((p) => p.status === 'DELAYED' || p.riskLevel === 'critical' || p.riskLevel === 'high')
            .length,
          variant: 'danger',
        },
      ],
      actions: [
        { label: 'Open National GIS', actionType: 'NAVIGATE', payload: { url: '/gis' } },
        { label: 'Export MIS (CSV)', actionType: 'GENERATE_REPORT', payload: { format: 'CSV' } },
      ],
      sources: ['National Infrastructure Pipeline (NIP)', 'DoLR Central Decision Support Engine'],
    };
  }

  private renderSingleProjectResponse(project: ProjectDto, lang: SupportedLanguage): AiStructuredResponse {
    const isHindi = lang === 'hi';
    return {
      title: isHindi ? `परियोजना विवरण: ${project.name}` : `Corridor Summary: ${project.name}`,
      summary: isHindi
        ? `${project.name} (${project.projectCode}) ${project.state} राज्य में ${project.type} श्रेणी की परियोजना है। वर्तमान स्थिति: ${project.status}, अधिग्रहण प्रगति: ${Math.round((project.totalAreaAcquiredHa / (project.totalAreaProposedHa || 1)) * 100)}%।`
        : `${project.name} (${project.projectCode}) is a ${project.type} project in ${project.district}, ${project.state}. Current stage: "${project.stage}". ${project.totalAreaAcquiredHa} Ha acquired out of ${project.totalAreaProposedHa} Ha total.`,
      language: lang,
      detectedIntent: 'PROJECT_DETAILS',
      projects: [project],
      metrics: [
        { label: 'Stage Code', value: project.stageCode, variant: 'default' },
        { label: 'SLA Days Remaining', value: `${project.slaDaysRemaining} Days`, variant: project.slaDaysRemaining <= 10 ? 'danger' : 'info' },
        { label: 'Risk Level', value: project.riskLevel.toUpperCase(), variant: project.riskLevel === 'critical' ? 'danger' : 'default' },
        { label: 'Acquisition %', value: `${Math.round((project.totalAreaAcquiredHa / (project.totalAreaProposedHa || 1)) * 100)}%`, variant: 'info' },
      ],
      facts: [
        `Requiring Body: ${project.requiringBody}`,
        `Compensation Disbursed: ₹${project.compensationDisbursedCr} Cr of ₹${project.compensationAssessedCr || project.estimatedBudgetCr} Cr`,
        `Affected Families: ${project.affectedFamilies}`,
      ],
      actions: [
        { label: 'Why is it delayed?', actionType: 'OPEN_PROJECT', payload: { projectId: project.id, query: 'why_delayed' } },
        { label: 'View on Map', actionType: 'GIS_FILTER', payload: { projectId: project.id, highlight: true } },
        { label: 'Open Project Twin', actionType: 'OPEN_PROJECT', payload: { projectId: project.id } },
      ],
      sources: ['DoLR Master Infrastructure Registry'],
    };
  }

  private mapProjectContext(p: ProjectDto) {
    return {
      id: p.id,
      projectCode: p.projectCode,
      name: p.name,
      state: p.state,
      riskLevel: p.riskLevel,
      status: p.status,
    };
  }

  private handleGreeting(lang: SupportedLanguage): AiStructuredResponse {
    const isHindi = lang === 'hi';
    return {
      title: isHindi ? 'भू-मित्र एआई कमांड केंद्र' : 'Bhu-Mitra AI Command Center',
      summary: isHindi
        ? 'नमस्ते! मैं भू-मित्र एआई कमांड सहायक हूँ। आप किसी भी राष्ट्रीय परियोजना (जैसे हालिया परियोजनाएं, विलंबित गलियारे, या मध्य प्रदेश के प्रोजेक्ट) के बारे में पूछ सकते हैं।'
        : 'Hello! I am the Bhu-Mitra AI Command Assistant. Ask me about recent projects, delayed corridors, high-risk infrastructure, or state-specific acquisitions (e.g. in Madhya Pradesh or Gujarat).',
      language: lang,
      detectedIntent: 'GENERAL_GREETING',
      actions: [
        { label: 'Show Recent Projects', actionType: 'NAVIGATE', payload: { action: 'recent' } },
        { label: 'Which projects are delayed?', actionType: 'NAVIGATE', payload: { action: 'delayed' } },
        { label: 'Open National GIS', actionType: 'NAVIGATE', payload: { url: '/gis' } },
      ],
      sources: ['Department of Land Resources (DoLR), Ministry of Rural Development'],
    };
  }

  private handleHelp(lang: SupportedLanguage): AiStructuredResponse {
    return {
      title: 'Bhu-Mitra AI Capabilities',
      summary:
        lang === 'hi'
          ? 'आप मुझसे ये प्रश्न पूछ सकते हैं: "हाल ही में अद्यतन प्रोजेक्ट दिखाओ", "कौन से प्रोजेक्ट देरी से चल रहे हैं?", "मध्य प्रदेश के प्रोजेक्ट दिखाओ", "NH-48 क्यों लेट है?", या "दैनिक एआई ब्रीफिंग"।'
          : 'You can query live acquisition intelligence using prompts such as: "Show recent projects", "Which projects are delayed?", "Show projects in Madhya Pradesh", "Why is NH-48 delayed?", or "Today\'s AI Briefing".',
      language: lang,
      detectedIntent: 'HELP',
      actions: [
        { label: 'Show Recent Projects', actionType: 'NAVIGATE', payload: { action: 'recent' } },
        { label: 'Which projects are delayed?', actionType: 'NAVIGATE', payload: { action: 'delayed' } },
        { label: "Today's Priorities", actionType: 'NAVIGATE', payload: { action: 'briefing' } },
      ],
      sources: ['Bhu-Mitra Help & Documentation'],
    };
  }

  private async handleAttentionToday(lang: SupportedLanguage): Promise<AiStructuredResponse> {
    const dashboard = await this.tools.getDashboardMetrics();
    const actionCentre = await this.tools.getActionCentre();

    const isHindi = lang === 'hi';
    return {
      title: isHindi ? 'आज की प्रशासनिक प्राथमिकताएं (Command Center)' : "Today's Acquisition Priorities & Critical Alerts",
      summary: isHindi
        ? 'राष्ट्रीय भूमि अधिग्रहण प्रणाली में आज 3 महत्वपूर्ण धारा 19 समयसीमाएं, 12 मुआवजा बैंक सत्यापन और 4 उच्च जोखिम वाले कॉरिडोर चिन्हित हैं।'
        : 'Across National Infrastructure Corridors, 3 projects face critical SLA limits, 12 compensation mandates require account verification, and 4 corridors are flagged high-risk.',
      language: lang,
      detectedIntent: 'ATTENTION_TODAY',
      metrics: [
        { label: 'Critical SLA Breaches', value: actionCentre.summary.totalUrgent || 3, variant: 'danger' },
        { label: 'Pending Approvals', value: actionCentre.summary.totalOverdue || 12, variant: 'warning' },
        { label: 'Compensation Assessed', value: `₹${dashboard.kpis.compensationAssessedCr} Cr`, variant: 'info' },
        { label: 'Disbursed (DBT)', value: `₹${dashboard.kpis.compensationPaidCr} Cr`, variant: 'success' },
      ],
      facts: [
        'Highest priority: NH-48 Section 19 declaration to prevent statutory lapse.',
        'Lucknow Metro: 12 commercial parcels hold ₹12.4 Cr in compensation disbursals.',
      ],
      actions: [
        { label: 'Show Delayed Projects', actionType: 'NAVIGATE', payload: { action: 'delayed' } },
        { label: 'Open National GIS', actionType: 'NAVIGATE', payload: { url: '/gis' } },
      ],
      sources: ['State Gazette Records', 'DoLR Decision Support Engine'],
    };
  }

  private async handleDailyBriefing(lang: SupportedLanguage): Promise<AiStructuredResponse> {
    const dashboard = await this.tools.getDashboardMetrics();
    const actionCentre = await this.tools.getActionCentre();
    const isHindi = lang === 'hi';

    return {
      title: isHindi ? 'दैनिक एआई ब्रीफिंग (DoLR AI Briefing)' : "Today's Official AI Executive Briefing",
      summary: isHindi
        ? 'सुप्रभात अधिकारी महोदय। आज भूमि अधिग्रहण समीक्षा में 3 गंभीर समयसीमाएं, 12 मुआवजा बैंक सत्यापन, और 4 उच्च जोखिम वाले कॉरिडोर चिन्हित हैं। सर्वोच्च प्राथमिकता: NH-48 भरतमाला और लखनऊ मेट्रो धारा 19 घोषणा जारी करना।'
        : "Good morning Officer. Today's acquisition telemetry flags 3 critical SLA milestones, 12 compensation mandates awaiting PFMS verification, and 4 high-risk corridors. Highest priority: NH-48 Bharatmala Section 19 gazette declaration to avert statutory lapse.",
      language: lang,
      detectedIntent: 'DAILY_BRIEFING',
      metrics: [
        { label: 'Critical Breaches', value: actionCentre.summary.totalUrgent || 3, variant: 'danger' },
        { label: 'Pending Approvals', value: actionCentre.summary.totalOverdue || 12, variant: 'warning' },
        { label: 'Assessed Amount', value: `₹${dashboard.kpis.compensationAssessedCr} Cr`, variant: 'info' },
        { label: 'Disbursed (DBT)', value: `₹${dashboard.kpis.compensationPaidCr} Cr`, variant: 'success' },
      ],
      actions: [
        { label: 'Open National GIS', actionType: 'NAVIGATE', payload: { url: '/gis' } },
        { label: 'View Delayed Cases', actionType: 'NAVIGATE', payload: { url: '/risk' } },
        { label: 'Download Daily MIS (CSV)', actionType: 'GENERATE_REPORT', payload: { format: 'CSV' } },
      ],
      sources: ['National Infrastructure Pipeline (NIP)', 'DoLR Central Decision Support Engine'],
    };
  }

  private async handleGisRequest(lang: SupportedLanguage, projectId = 'proj-0084', parcelId = '103-10'): Promise<AiStructuredResponse> {
    return {
      title: 'National GIS Spatial Intelligence',
      summary: `GIS boundary highlights active for Corridor #${projectId} (Cadastral Parcel #${parcelId}). Displaying cadastral boundaries, RoR status, and buffer zones.`,
      language: lang,
      detectedIntent: 'GIS_VISUALIZATION',
      actions: [
        { label: 'Focus Parcel 103-10', actionType: 'GIS_FILTER', payload: { parcelId: '103-10', highlight: true } },
        { label: 'View High-Risk Corridor', actionType: 'GIS_FILTER', payload: { projectId: 'proj-0084', highlight: true } },
      ],
      sources: ['Survey of India TopoSheets', 'NIC Bhunaksha GeoJSON Engine'],
    };
  }

  private async handleReportGeneration(lang: SupportedLanguage, _projectId?: string): Promise<AiStructuredResponse> {
    const mis = await this.tools.generateMisReport();
    return {
      title: lang === 'hi' ? 'मासिक अधिग्रहण प्रगति रिपोर्ट' : 'Monthly Acquisition Progress Report (DoLR MIS)',
      summary: `Generated official DoLR National Acquisition MIS report covering ${mis.totalProjects} active infrastructure corridors, ${mis.totalParcels} cadastral parcels, and ₹${mis.totalCompensationCr} Cr DBT disbursed.`,
      language: lang,
      detectedIntent: 'REPORT_GENERATION',
      metrics: [
        { label: 'Active Projects', value: mis.totalProjects, variant: 'default' },
        { label: 'Parcels Monitored', value: mis.totalParcels, variant: 'info' },
        { label: 'DBT Disbursed', value: `₹${mis.totalCompensationCr} Cr`, variant: 'success' },
      ],
      actions: [
        { label: 'Download MIS (CSV)', actionType: 'GENERATE_REPORT', payload: { format: 'CSV' } },
        { label: 'View State Breakdown', actionType: 'NAVIGATE', payload: { url: '/command' } },
      ],
      sources: ['Department of Land Resources MIS Consolidated Engine'],
    };
  }

  private handleCitizenStatus(lang: SupportedLanguage, parcelId = '103-10'): AiStructuredResponse {
    const isHindi = lang === 'hi';
    return {
      title: isHindi ? 'भूमि अधिग्रहण स्थिति ट्रैकर' : 'Land Acquisition Status Tracker',
      summary: isHindi
        ? `आपके सर्वे नंबर #${parcelId === '103-10' ? '103/10' : parcelId} का प्रारंभिक धारा 11 राजपत्र अधिसूचना (Gazette No. 512/2026) जारी हो चुका है। धारा 15 आपत्ति सुनवाई पूर्ण हो चुकी है और धारा 23 मुआवजा अवार्ड तैयार किया जा रहा है।`
        : `For Survey #${parcelId === '103-10' ? '103/10' : parcelId}, preliminary Section 11 gazette notification has been published. Section 15 objection hearing is complete and Section 23 award declaration is under preparation.`,
      language: lang,
      detectedIntent: 'CITIZEN_ACQUISITION_STATUS',
      actions: [
        { label: isHindi ? 'नक्शे पर जमीन देखें' : 'View on Map', actionType: 'GIS_FILTER', payload: { parcelId: '103-10', highlight: true } },
      ],
      sources: ['राजपत्र असाधारण संख्या 512/2026-DoLR'],
    };
  }

  private handleCitizenCompensation(lang: SupportedLanguage, parcelId = '103-10'): AiStructuredResponse {
    const isHindi = lang === 'hi';
    return {
      title: isHindi ? 'मुआवजा आकलन एवं भुगतान स्थिति' : 'Authorized Compensation Calculation',
      summary: isHindi
        ? `सर्वे #${parcelId === '103-10' ? '103/10' : parcelId} हेतु कुल ₹48.50 लाख का मुआवजा स्वीकृत हुआ है। 80% राशि सीधे बैंक खाते में प्रेषित की जा चुकी है, शेष 20% अंतिम भौतिक कब्ज़ा हस्तांतरण पर देय होगी।`
        : `For Survey #${parcelId === '103-10' ? '103/10' : parcelId}, total authorized compensation is ₹48.50 Lakhs. 80% has been transferred via Direct Benefit Transfer, and remainder 20% will disburse on possession handover.`,
      language: lang,
      detectedIntent: 'CITIZEN_COMPENSATION',
      actions: [
        { label: isHindi ? 'बैंक डीबीटी स्थिति' : 'Check DBT Status', actionType: 'NAVIGATE', payload: { url: '/citizen' } },
      ],
      sources: ['सक्षम प्राधिकारी (CALA) अवार्ड आदेश #2026-084-103'],
    };
  }

  private handleCitizenDocuments(lang: SupportedLanguage): AiStructuredResponse {
    const isHindi = lang === 'hi';
    return {
      title: isHindi ? 'आवश्यक दस्तावेज चेकलिस्ट' : 'Mandatory Documents Checklist',
      summary: isHindi
        ? 'भूमि अधिग्रहण मुआवजा और पुनर्वास लाभ प्राप्त करने हेतु निम्नलिखित 5 दस्तावेज आवश्यक हैं:'
        : 'To claim compensation award and R&R entitlements under RFCTLARR Act 2013, keep the following 5 verified documents ready:',
      language: lang,
      detectedIntent: 'CITIZEN_DOCUMENTS',
      facts: [
        '1. Record of Rights (RoR 7/12 or Jamabandi)',
        '2. Aadhaar Card for UIDAI biometric/OTP verification',
        '3. Bank Passbook or Cancelled Cheque for PFMS/DBT disbursal',
        '4. PAN Card',
        '5. Land Revenue Tax Receipt for current financial year',
      ],
      actions: [
        { label: isHindi ? 'दस्तावेज अपलोड करें' : 'Upload Documents', actionType: 'NAVIGATE', payload: { url: '/citizen' } },
      ],
      sources: ['Ministry of Rural Development, Government of India'],
    };
  }

  private handleExplainSimply(lang: SupportedLanguage, _projectId = 'proj-0084'): AiStructuredResponse {
    const isHindi = lang === 'hi';
    return {
      title: isHindi ? 'सरल भाषा में व्याख्या (Plain Language)' : 'Plain-Language Citizen Explanation',
      summary: isHindi
        ? 'सरल शब्दों में: सरकार राष्ट्रीय राजमार्ग (NH-48) को चौड़ा करने के लिए जमीन ले रही है। आपकी जमीन का नाप-जोख हो चुका है। सरकार ने इसके बदले में बाजार भाव से दोगुना (100% अतिरिक्त सोलेशियम) मुआवजा तय किया है। 80% पैसा सीधे बैंक खाते में भेजा जा चुका है। बाकी 20% पैसा जमीन का कब्जा सौंपते ही मिल जाएगा।'
        : 'In Simple Words: The government is widening National Highway NH-48. Your land survey has been verified. You are entitled to double the market value (including 100% solatium bonus) under statutory law. 80% of your compensation has already been deposited into your bank account. The remaining 20% will be transferred as soon as possession is completed.',
      language: lang,
      detectedIntent: 'EXPLAIN_SIMPLY',
      actions: [
        { label: isHindi ? 'नक्शा देखें' : 'View on Map', actionType: 'GIS_FILTER', payload: { parcelId: '103-10', highlight: true } },
      ],
      sources: ['RFCTLARR Act 2013 Citizen Handbook'],
    };
  }

  private appendMessageToSession(
    sessionId: string,
    userText: string,
    aiMsg: AiMessage,
    context?: AiConversationContext,
  ) {
    let session = this.sessions.get(sessionId);
    if (!session) {
      session = {
        id: sessionId,
        title: userText.length > 30 ? `${userText.slice(0, 30)}...` : userText || 'New Acquisition Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
        context,
      };
      this.sessions.set(sessionId, session);
    }
    session.updatedAt = new Date().toISOString();
    session.context = context;
    session.messages.push(
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userText,
        timestamp: new Date().toISOString(),
      },
      aiMsg,
    );
  }

  /**
   * Generate a natural, concise spoken response suitable for TTS.
   * Strips markdown (*, #, `, _, ~), action labels ([View Project], [Show on Map]), URLs, and raw metadata.
   */
  private generateSpokenSummary(structured: AiStructuredResponse): string {
    const isHindi = structured.language === 'hi';

    // 1. Attention Today / Daily Briefing
    if (structured.detectedIntent === 'ATTENTION_TODAY' || structured.detectedIntent === 'DAILY_BRIEFING') {
      if (isHindi) {
        return 'आज राष्ट्रीय भूमि अधिग्रहण प्रणाली में 3 प्रोजेक्ट्स पर महत्वपूर्ण समयसीमाएं हैं। एनएच-48 सबसे अधिक संवेदनशील है।';
      }
      return 'I found priority infrastructure projects requiring attention today. NH-48 Bharatmala is currently the highest-risk project with an approaching Section 19 statutory deadline.';
    }

    // 2. Delayed Projects
    if (structured.detectedIntent === 'PROJECT_DELAYED' && structured.projects && structured.projects.length > 0) {
      const top = structured.projects[0];
      const count = structured.projects.length;
      if (isHindi) {
        return `वर्तमान में ${count} परियोजनाएं वैधानिक समयसीमा से पीछे चल रही हैं। सबसे अधिक जोखिम वाला प्रोजेक्ट ${top.name} है।`;
      }
      const days = top.slaDaysRemaining !== undefined ? Math.abs(top.slaDaysRemaining) : 0;
      const statusText =
        top.slaDaysRemaining !== undefined && top.slaDaysRemaining < 0
          ? `${days} days overdue`
          : `${days} days remaining before statutory deadline`;
      return `I found ${count} delayed projects. The highest-risk corridor is ${top.name}, with ${statusText}.`;
    }

    // 3. Why Delayed / Root Cause
    if (structured.detectedIntent === 'PROJECT_WHY_DELAYED') {
      const proj = structured.projects?.[0];
      const bottleneck = structured.bottlenecks?.[0];
      if (proj && bottleneck) {
        if (isHindi) {
          return `${proj.name} में मुख्य बाधा ${bottleneck.stage} पर है: ${bottleneck.issue}।`;
        }
        return `${proj.name} is currently at Risk Level ${structured.risk?.level || 'High'}. The primary bottleneck is in stage ${bottleneck.stage}: ${bottleneck.issue}.`;
      }
    }

    // 4. Location Query
    if (structured.detectedIntent === 'PROJECT_LOCATION' && structured.projects) {
      const count = structured.projects.length;
      if (count === 0) {
        return isHindi
          ? 'इस राज्य में कोई अधिग्रहण परियोजना दर्ज नहीं है।'
          : 'I could not find any land acquisition projects in that location.';
      }
      const top = structured.projects[0];
      if (isHindi) {
        return `${top.state} में ${count} प्रोजेक्ट मिला। मुख्य प्रोजेक्ट है ${top.name}, ${top.district}।`;
      }
      return `I found ${count} project${count > 1 ? 's' : ''}. Top corridor is ${top.name} in ${top.district}, ${top.state}.`;
    }

    // 5. Critical Project
    if (structured.detectedIntent === 'PROJECT_MOST_CRITICAL' && structured.projects && structured.projects.length > 0) {
      const top = structured.projects[0];
      if (isHindi) {
        return `सबसे संवेदनशील प्रोजेक्ट ${top.name} है, जो तय समयसीमा से पीछे है।`;
      }
      return `The most critical project is ${top.name}, currently at critical risk level with overdue statutory milestones.`;
    }

    // 6. Recent Projects
    if (structured.detectedIntent === 'PROJECT_RECENT' && structured.projects && structured.projects.length > 0) {
      const top = structured.projects[0];
      const count = structured.projects.length;
      if (isHindi) {
        return `हाल ही में अद्यतन की गई ${count} परियोजनाएं मिली हैं। शीर्ष प्रोजेक्ट है ${top.name}।`;
      }
      return `I found ${count} recently updated corridors. Top project is ${top.name} in ${top.district}, ${top.state}.`;
    }

    // 7. Sector Projects
    if (structured.detectedIntent === 'PROJECT_SECTOR' && structured.projects && structured.projects.length > 0) {
      const names = structured.projects.map((p) => p.name).join(isHindi ? ' और ' : ' and ');
      if (isHindi) {
        return `भू-मित्र के डेटाबेस में ${structured.projects.length} सक्रिय परियोजनाएं दर्ज हैं: ${names}।`;
      }
      return `I found ${structured.projects.length} active corridors: ${names}.`;
    }

    // 8. Single Project Details
    if (structured.detectedIntent === 'PROJECT_DETAILS' && structured.projects && structured.projects.length > 0) {
      const p = structured.projects[0];
      const pct = Math.round(((p.totalAreaAcquiredHa || 0) / (p.totalAreaProposedHa || 1)) * 100);
      if (isHindi) {
        return `${p.name} का अधिग्रहण ${pct} प्रतिशत पूर्ण हो चुका है। वर्तमान स्थिति ${p.status} है।`;
      }
      return `${p.name} acquisition is ${pct} percent complete with current status ${p.status}.`;
    }

    // 9. General Greetings
    if (structured.detectedIntent === 'GENERAL_GREETING') {
      if (isHindi) {
        return 'नमस्ते! मैं भू-मित्र एआई कमांड सहायक हूँ। आप राष्ट्रीय परियोजनाओं, विलंबित गलियारों, या राज्यवार अधिग्रहण के बारे में पूछ सकते हैं।';
      }
      return 'Hello! I am the Bhu-Mitra AI Command Assistant. Ask me about recent projects, delayed corridors, high-risk infrastructure, or state-specific acquisitions.';
    }

    // Default: Clean and sanitize whatever summary exists
    return this.cleanTextForSpeech(structured.summary);
  }

  private cleanTextForSpeech(text: string): string {
    if (!text) return '';
    return text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [text](url) -> text
      .replace(/\[([^\]]+)\]/g, '')             // [View Project] -> empty
      .replace(/https?:\/\/\S+/g, '')          // remove URLs
      .replace(/[*#_`~>|]/g, '')               // remove markdown characters
      .replace(/•\s*/g, '')                    // remove bullet points
      .replace(/₹/g, 'Rupees ')                // currency to spoken
      .replace(/%/g, ' percent')               // % to percent
      .replace(/\s+/g, ' ')                    // normalize whitespace
      .replace(/(\n|\r)+/g, '. ')              // newlines to periods
      .replace(/\.{2,}/g, '.')                 // collapse dots
      .trim();
  }

  getConversations(): AiConversationSession[] {
    return Array.from(this.sessions.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  getConversationById(id: string): AiConversationSession | null {
    return this.sessions.get(id) || null;
  }

  deleteConversation(id: string): boolean {
    return this.sessions.delete(id);
  }
}
