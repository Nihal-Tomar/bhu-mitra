import { Injectable } from '@nestjs/common';
import type { AiConversationContext, SupportedLanguage } from '@bhumitra/types';

export type DetectedAiIntent =
  | 'PROJECT_RECENT'
  | 'PROJECT_DELAYED'
  | 'PROJECT_HIGH_RISK'
  | 'PROJECT_MOST_CRITICAL'
  | 'PROJECT_LOCATION'
  | 'PROJECT_SECTOR'
  | 'PROJECT_STAGE'
  | 'PROJECT_COMPENSATION_PENDING'
  | 'PROJECT_COUNT'
  | 'PROJECT_DETAILS'
  | 'PROJECT_WHY_DELAYED'
  | 'FOLLOW_UP_WHICH_ONE'
  | 'FOLLOW_UP_WHY_DELAYED'
  | 'ATTENTION_TODAY'
  | 'DAILY_BRIEFING'
  | 'GIS_MAP'
  | 'REPORT_GENERATION'
  | 'CITIZEN_ACQUISITION_STATUS'
  | 'CITIZEN_COMPENSATION'
  | 'CITIZEN_DOCUMENTS'
  | 'EXPLAIN_SIMPLY'
  | 'GENERAL_GREETING'
  | 'HELP'
  | 'UNKNOWN';

export interface ExtractedEntities {
  state?: string;
  stateCode?: string;
  sector?: string;
  stageCode?: string;
  projectQuery?: string;
  isRecent?: boolean;
  isDelayed?: boolean;
  isCritical?: boolean;
  hasCompensationPending?: boolean;
  isCountQuery?: boolean;
}

export interface IntentAnalysisResult {
  intent: DetectedAiIntent;
  entities: ExtractedEntities;
  confidence: number;
  resolvedProjectId?: string;
}

@Injectable()
export class AiIntentEngineService {
  private readonly stateMap: Record<string, { name: string; code: string }> = {
    'madhya pradesh': { name: 'Madhya Pradesh', code: 'MP' },
    'mp': { name: 'Madhya Pradesh', code: 'MP' },
    'मध्य प्रदेश': { name: 'Madhya Pradesh', code: 'MP' },
    'gujarat': { name: 'Gujarat', code: 'GJ' },
    'गुजरात': { name: 'Gujarat', code: 'GJ' },
    'maharashtra': { name: 'Maharashtra', code: 'MH' },
    'महाराष्ट्र': { name: 'Maharashtra', code: 'MH' },
    'rajasthan': { name: 'Rajasthan', code: 'RJ' },
    'राजस्थान': { name: 'Rajasthan', code: 'RJ' },
    'uttar pradesh': { name: 'Uttar Pradesh', code: 'UP' },
    'up': { name: 'Uttar Pradesh', code: 'UP' },
    'उत्तर प्रदेश': { name: 'Uttar Pradesh', code: 'UP' },
    'odisha': { name: 'Odisha', code: 'OD' },
    'उड़ीसा': { name: 'Odisha', code: 'OD' },
    'punjab': { name: 'Punjab', code: 'PB' },
    'पंजाब': { name: 'Punjab', code: 'PB' },
    'haryana': { name: 'Haryana', code: 'HR' },
    'हरियाणा': { name: 'Haryana', code: 'HR' },
    'goa': { name: 'Goa', code: 'GA' },
  };

  private readonly sectorMap: Record<string, string> = {
    highway: 'Highway',
    highways: 'Highway',
    road: 'Highway',
    सड़क: 'Highway',
    हाईवे: 'Highway',
    rail: 'Rail',
    railway: 'Rail',
    railways: 'Rail',
    रेल: 'Rail',
    रेलवे: 'Rail',
    metro: 'Metro',
    'मेट्रो': 'Metro',
    'smart city': 'Smart City',
    'स्मार्ट सिटी': 'Smart City',
    energy: 'Energy',
    solar: 'Energy',
    सौर: 'Energy',
    ऊर्जा: 'Energy',
    port: 'Port',
    ports: 'Port',
    बंदरगाह: 'Port',
    airport: 'Airport',
    airports: 'Airport',
  };

  private readonly stageMap: Record<string, string> = {
    'section 11': 'SEC_11_PRELIMINARY',
    'sec 11': 'SEC_11_PRELIMINARY',
    'धारा 11': 'SEC_11_PRELIMINARY',
    'section 15': 'SEC_15_HEARING',
    'sec 15': 'SEC_15_HEARING',
    'धारा 15': 'SEC_15_HEARING',
    'section 19': 'SEC_19_DECLARATION',
    'sec 19': 'SEC_19_DECLARATION',
    'धारा 19': 'SEC_19_DECLARATION',
    'valuation': 'VALUATION',
    'section 23': 'SEC_23_AWARD',
    'sec 23': 'SEC_23_AWARD',
    'धारा 23': 'SEC_23_AWARD',
    'award': 'SEC_23_AWARD',
    'possession': 'SEC_38_POSSESSION',
    'कब्जा': 'SEC_38_POSSESSION',
  };


  /**
   * Main Intent & Entity Analyzer
   */
  analyze(
    rawMessage: string,
    _lang: SupportedLanguage,
    conversationContext?: AiConversationContext,
  ): IntentAnalysisResult {
    const q = rawMessage.trim().toLowerCase();
    const entities = this.extractEntities(q);

    // 1. Genuine Greetings & Help (Strict bounds to prevent hijacking data queries)
    if (this.isPureGreeting(q)) {
      return { intent: 'GENERAL_GREETING', entities, confidence: 1.0 };
    }
    if (q === 'help' || q === 'मदद' || q === 'what can you do' || q === 'who are you') {
      return { intent: 'HELP', entities, confidence: 1.0 };
    }

    // 2. Anaphora & Contextual Follow-Up Questions (e.g. "Pehla wala detail mein batao", "Iska land acquisition kitna hua?")
    // Check if user is asking for the first project in previous context
    if (
      (q.includes('pehla') || q.includes('first') || q.includes('पहला')) &&
      (q.includes('wala') || q.includes('one') || q.includes('detail') || q.includes('project') || q.includes('बारे'))
    ) {
      const resolvedId = conversationContext?.lastProjects?.[0]?.id;
      if (resolvedId) {
        return {
          intent: 'PROJECT_DETAILS',
          entities: { ...entities, projectQuery: resolvedId },
          confidence: 0.98,
          resolvedProjectId: resolvedId,
        };
      }
    }

    // Check if user is asking for the second project in previous context
    if (
      (q.includes('dusra') || q.includes('second') || q.includes('दूसरा')) &&
      (q.includes('wala') || q.includes('one') || q.includes('detail') || q.includes('project'))
    ) {
      const resolvedId = conversationContext?.lastProjects?.[1]?.id;
      if (resolvedId) {
        return {
          intent: 'PROJECT_DETAILS',
          entities: { ...entities, projectQuery: resolvedId },
          confidence: 0.98,
          resolvedProjectId: resolvedId,
        };
      }
    }

    // Check if user is asking about the current project's land / compensation / pending area
    if (
      (q.includes('iska') || q.includes('iski') || q.includes('iske') || q.includes('uski') || q.includes('usme') || q.includes('इसकी') || q.includes('इसका') || q.includes('it')) &&
      (q.includes('land') || q.includes('zameen') || q.includes('zamin') || q.includes('जमीन') || q.includes('acquisition') || q.includes('अधिग्रहण') || q.includes('pending') || q.includes('लंबित') || q.includes('compensation') || q.includes('मुआवजा') || q.includes('status') || q.includes('स्थिति'))
    ) {
      const resolvedId = conversationContext?.selectedProjectId || conversationContext?.lastProjects?.[0]?.id;
      if (resolvedId) {
        return {
          intent: 'PROJECT_DETAILS',
          entities: { ...entities, projectQuery: resolvedId },
          confidence: 0.98,
          resolvedProjectId: resolvedId,
        };
      }
    }

    if (this.isFollowUpCriticalQuery(q)) {
      const resolved = this.resolveMostCriticalFromContext(conversationContext);
      return {
        intent: 'PROJECT_MOST_CRITICAL',
        entities,
        confidence: 0.95,
        resolvedProjectId: resolved?.id,
      };
    }

    if (this.isFollowUpWhyDelayedQuery(q)) {
      const resolved = conversationContext?.selectedProjectId || conversationContext?.lastProjects?.[0]?.id;
      return {
        intent: 'PROJECT_WHY_DELAYED',
        entities,
        confidence: 0.95,
        resolvedProjectId: resolved,
      };
    }

    // 3. Citizen Specific Intents
    if (
      q.includes('मेरी जमीन') ||
      q.includes('meri zameen') ||
      q.includes('status of my land') ||
      q.includes('track my land') ||
      q.includes('अधिग्रहण कब होगा')
    ) {
      return { intent: 'CITIZEN_ACQUISITION_STATUS', entities, confidence: 0.95 };
    }

    if (
      q.includes('मुआवजा') ||
      q.includes('muavja') ||
      q.includes('kitna milega') ||
      q.includes('how much compensation will i receive')
    ) {
      return { intent: 'CITIZEN_COMPENSATION', entities, confidence: 0.95 };
    }

    if (
      q.includes('दस्तावेज') ||
      q.includes('dastavej') ||
      q.includes('documents required') ||
      ((q.includes('kaun se') || q.includes('which')) && (q.includes('document') || q.includes('kagaz') || q.includes('paper')))
    ) {
      return { intent: 'CITIZEN_DOCUMENTS', entities, confidence: 0.95 };
    }


    if (q.includes('explain simply') || q.includes('simple words') || q.includes('सरल भाषा')) {
      return { intent: 'EXPLAIN_SIMPLY', entities, confidence: 0.95 };
    }

    // 4. Specific Project Inquiries (e.g. "Why is NH-48 delayed?", "Show NH-48", "Details of Lucknow Metro")
    const projectIdentifier = this.detectSpecificProject(q);
    if (projectIdentifier) {
      if (
        q.includes('delay') ||
        q.includes('late') ||
        q.includes('क्यों') ||
        q.includes('kyun') ||
        q.includes('slow') ||
        q.includes('bottleneck')
      ) {
        return {
          intent: 'PROJECT_WHY_DELAYED',
          entities: { ...entities, projectQuery: projectIdentifier },
          confidence: 0.95,
          resolvedProjectId: projectIdentifier,
        };
      }
      return {
        intent: 'PROJECT_DETAILS',
        entities: { ...entities, projectQuery: projectIdentifier },
        confidence: 0.95,
        resolvedProjectId: projectIdentifier,
      };
    }

    // 5. High-Risk / Most Critical Project
    if (
      q.includes('most critical') ||
      q.includes('sabse critical') ||
      q.includes('highest risk') ||
      q.includes('सबसे गंभीर')
    ) {
      return { intent: 'PROJECT_MOST_CRITICAL', entities, confidence: 0.95 };
    }

    // 6. Recent Projects Query
    if (
      q.includes('recent') ||
      q.includes('newly') ||
      q.includes('latest') ||
      q.includes('updated') ||
      q.includes('हालिया') ||
      q.includes('नया') ||
      q.includes('naye')
    ) {
      return { intent: 'PROJECT_RECENT', entities: { ...entities, isRecent: true }, confidence: 0.95 };
    }

    // 7. Location (State / District) Filter
    if (entities.state || entities.stateCode) {
      if (entities.isCountQuery) {
        return { intent: 'PROJECT_COUNT', entities, confidence: 0.9 };
      }
      return { intent: 'PROJECT_LOCATION', entities, confidence: 0.95 };
    }

    // 8. Sector Filter
    if (entities.sector) {
      return { intent: 'PROJECT_SECTOR', entities, confidence: 0.95 };
    }

    // 9. Statutory Stage Filter
    if (entities.stageCode) {
      return { intent: 'PROJECT_STAGE', entities, confidence: 0.95 };
    }

    // 10. Pending Compensation Filter
    if (
      q.includes('pending compensation') ||
      q.includes('मुआवजा लंबित') ||
      q.includes('compensation pending') ||
      q.includes('compensation gap')
    ) {
      return { intent: 'PROJECT_COMPENSATION_PENDING', entities, confidence: 0.95 };
    }

    // 11. Delayed Projects
    if (
      q.includes('delayed') ||
      q.includes('delay') ||
      q.includes('running late') ||
      q.includes('behind schedule') ||
      q.includes('देरी से') ||
      q.includes('late hain')
    ) {
      return { intent: 'PROJECT_DELAYED', entities: { ...entities, isDelayed: true }, confidence: 0.95 };
    }

    // 12. General High-Risk
    if (q.includes('risk') || q.includes('जोखिम') || q.includes('khatra')) {
      return { intent: 'PROJECT_HIGH_RISK', entities: { ...entities, isCritical: true }, confidence: 0.95 };
    }

    // 13. System Shortcuts
    if (q.includes('briefing') || q.includes('ai briefing')) {
      return { intent: 'DAILY_BRIEFING', entities, confidence: 0.95 };
    }

    if (q.includes('attention') || q.includes('priorities') || q.includes('important today')) {
      return { intent: 'ATTENTION_TODAY', entities, confidence: 0.95 };
    }

    if (q.includes('map') || q.includes('gis') || q.includes('spatial') || q.includes('show on map')) {
      return { intent: 'GIS_MAP', entities, confidence: 0.95 };
    }

    if (q.includes('report') || q.includes('export mis') || q.includes('csv')) {
      return { intent: 'REPORT_GENERATION', entities, confidence: 0.95 };
    }

    if (entities.isCountQuery) {
      return { intent: 'PROJECT_COUNT', entities, confidence: 0.9 };
    }

    return { intent: 'UNKNOWN', entities, confidence: 0.5 };
  }

  /**
   * Entity Extraction
   */
  private extractEntities(q: string): ExtractedEntities {
    const entities: ExtractedEntities = {};

    // State extraction
    for (const [key, val] of Object.entries(this.stateMap)) {
      if (/[^\x00-\x7F]/.test(key)) {
        if (q.includes(key)) {
          entities.state = val.name;
          entities.stateCode = val.code;
          break;
        }
      } else {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(q)) {
          entities.state = val.name;
          entities.stateCode = val.code;
          break;
        }
      }
    }


    // Sector extraction
    for (const [key, val] of Object.entries(this.sectorMap)) {
      if (q.includes(key)) {
        entities.sector = val;
        break;
      }
    }

    // Stage extraction
    for (const [key, val] of Object.entries(this.stageMap)) {
      if (q.includes(key)) {
        entities.stageCode = val;
        break;
      }
    }

    // Count query
    if (
      q.includes('how many') ||
      q.includes('kitne') ||
      q.includes('kitni') ||
      q.includes('कुल कितने') ||
      q.includes('count')
    ) {
      entities.isCountQuery = true;
    }

    if (q.includes('delay') || q.includes('late') || q.includes('देरी')) {
      entities.isDelayed = true;
    }

    if (q.includes('recent') || q.includes('latest') || q.includes('updated')) {
      entities.isRecent = true;
    }

    if (q.includes('risk') || q.includes('critical') || q.includes('गंभीर')) {
      entities.isCritical = true;
    }

    return entities;
  }

  /**
   * Pure greetings detection (only match when message has no data context)
   */
  private isPureGreeting(q: string): boolean {
    const pure = ['hello', 'hi', 'hey', 'namaste', 'नमस्ते', 'pranam', 'good morning', 'good afternoon', 'good evening'];
    return pure.includes(q) || pure.some((p) => q === `${p}!` || q === `${p}.`);
  }

  /**
   * Follow-up check: "Which one is most critical?"
   */
  private isFollowUpCriticalQuery(q: string): boolean {
    return (
      (q.includes('which one') || q.includes('kaunsa') || q.includes('कौन सा')) &&
      (q.includes('critical') || q.includes('highest risk') || q.includes('गंभीर') || q.includes('late') || q.includes('delayed'))
    );
  }

  /**
   * Follow-up check: "Why is it delayed?"
   */
  private isFollowUpWhyDelayedQuery(q: string): boolean {
    return (
      (q.includes('why is it') || q.includes('wo kyu') || q.includes('यह क्यों')) &&
      (q.includes('delayed') || q.includes('late') || q.includes('देरी'))
    );
  }

  /**
   * Detect named project in user message
   */
  private detectSpecificProject(q: string): string | undefined {
    if (q.includes('nh-48') || q.includes('nh48') || q.includes('bharatmala')) return 'proj-0084';
    if (q.includes('lucknow metro') || q.includes('lucknow')) return 'proj-0059';
    if (q.includes('eastern dfc') || q.includes('freight corridor') || q.includes('dfc')) return 'proj-0071';
    if (q.includes('pune') || q.includes('nashik') || q.includes('pune–nashik')) return 'proj-0066';
    if (q.includes('bhopal') || q.includes('smart city ring road')) return 'proj-0048';
    if (q.includes('amritsar')) return 'proj-0041';
    if (q.includes('rewa') || q.includes('solar')) return 'proj-0091';
    if (q.includes('dhamra') || q.includes('port')) return 'proj-0043';

    // Regex match for project code DOLR-2026-XXXX
    const match = q.match(/dolr-2026-\d{4}/i);
    if (match) return match[0].toUpperCase();

    return undefined;
  }

  /**
   * Resolve most critical project from conversation context
   */
  private resolveMostCriticalFromContext(context?: AiConversationContext) {
    if (!context?.lastProjects || context.lastProjects.length === 0) return undefined;
    // Rank critical > high > medium > low
    const ranking: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
    const sorted = [...context.lastProjects].sort((a, b) => {
      const rA = ranking[a.riskLevel?.toLowerCase()] || 0;
      const rB = ranking[b.riskLevel?.toLowerCase()] || 0;
      return rB - rA;
    });
    return sorted[0];
  }
}
