import { Injectable } from '@nestjs/common';
import type { ProjectDto, AiRiskAssessment } from '@bhumitra/types';

@Injectable()
export class AiRiskEngineService {
  /**
   * Deterministically evaluate project acquisition risk (0 - 100)
   */
  evaluateProjectRisk(project: ProjectDto, unresolvedGrievanceCount = 0): AiRiskAssessment {
    let score = 0;
    const factors: string[] = [];

    // 1. Delay & SLA remaining (Max 30 pts)
    const sla = project.slaDaysRemaining ?? 60;
    if (sla <= 0) {
      score += 30;
      factors.push(`SLA timeline breached by ${Math.abs(sla)} days`);
    } else if (sla <= 10) {
      score += 25;
      factors.push(`Statutory deadline imminent (${sla} days remaining)`);
    } else if (sla <= 30) {
      score += 15;
      factors.push(`Approaching intermediate milestone deadline (${sla} days left)`);
    } else {
      score += 5;
    }

    // 2. Acquisition Progress Gap (Max 25 pts)
    const proposed = project.totalAreaProposedHa || 1;
    const acquired = project.totalAreaAcquiredHa || 0;
    const progressPct = Math.round((acquired / proposed) * 100);
    if (progressPct < 25) {
      score += 25;
      factors.push(`Severe land possession backlog (${100 - progressPct}% pending possession)`);
    } else if (progressPct < 60) {
      score += 15;
      factors.push(`Substantial land acquisition backlog (${100 - progressPct}% unacquired)`);
    } else {
      score += 5;
    }

    // 3. Compensation Disbursal Gap (Max 25 pts)
    const assessed = project.compensationAssessedCr || project.estimatedBudgetCr || 1;
    const disbursed = project.compensationDisbursedCr || 0;
    const compPct = Math.round((disbursed / assessed) * 100);
    if (compPct < 30) {
      score += 25;
      factors.push(`Compensation disbursal stalled (${100 - compPct}% undisbursed)`);
    } else if (compPct < 70) {
      score += 15;
      factors.push(`Direct benefit transfer disbursal pending in multiple awardee accounts`);
    } else {
      score += 5;
    }

    // 4. Unresolved Objections & Legal Objections (Max 20 pts)
    if (unresolvedGrievanceCount >= 5) {
      score += 20;
      factors.push(`${unresolvedGrievanceCount} unresolved khatedar objection petitions pending`);
    } else if (unresolvedGrievanceCount > 0) {
      score += 10;
      factors.push(`${unresolvedGrievanceCount} active khatedar inquiries`);
    } else {
      score += 2;
    }

    // Cap score at 100
    score = Math.min(100, Math.max(0, score));

    let level: AiRiskAssessment['level'] = 'LOW';
    if (score >= 75) level = 'CRITICAL';
    else if (score >= 50) level = 'HIGH';
    else if (score >= 30) level = 'MEDIUM';

    return {
      score,
      level,
      factors: factors.length > 0 ? factors : ['Normal operational variance within scheduled milestones.'],
    };
  }
}
