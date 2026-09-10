import { Injectable } from '@nestjs/common';
import type { ProjectDto, LandParcelDto, AiBottleneck } from '@bhumitra/types';

export interface DelayAnalysisResult {
  status: 'ON_TIME' | 'APPROACHING_DEADLINE' | 'DELAYED' | 'CRITICALLY_DELAYED';
  slaDaysRemaining: number;
  delayPredictedDays: number;
  facts: string[];
  bottlenecks: AiBottleneck[];
  recommendations: string[];
}

@Injectable()
export class AiDelayEngineService {
  /**
   * Deterministically analyze delays for a given project
   */
  analyzeProjectDelay(project: ProjectDto, parcels: LandParcelDto[] = []): DelayAnalysisResult {
    const slaRemaining = project.slaDaysRemaining ?? 0;
    const delayDays = project.delayPredictedDays ?? 0;

    let status: DelayAnalysisResult['status'] = 'ON_TIME';
    if (project.riskLevel === 'critical' || slaRemaining <= 0 || delayDays > 45) {
      status = 'CRITICALLY_DELAYED';
    } else if (project.riskLevel === 'high' || slaRemaining <= 15 || delayDays > 15) {
      status = 'DELAYED';
    } else if (slaRemaining <= 30) {
      status = 'APPROACHING_DEADLINE';
    }

    const facts: string[] = [];
    const bottlenecks: AiBottleneck[] = [];
    const recommendations: string[] = [];

    // Factual grounding
    facts.push(
      `Project "${project.name}" is currently at stage: ${project.stage}.`,
      `SLA Days remaining: ${slaRemaining} days (Target Completion: ${new Date(project.targetCompletionDate).toLocaleDateString('en-IN')}).`,
      `Acquisition Progress: ${project.totalAreaAcquiredHa} Ha acquired of ${project.totalAreaProposedHa} Ha proposed (${Math.round(
        (project.totalAreaAcquiredHa / (project.totalAreaProposedHa || 1)) * 100,
      )}%).`,
      `Compensation Disbursed: ₹${project.compensationDisbursedCr} Cr of ₹${project.compensationAssessedCr || project.estimatedBudgetCr} Cr assessed.`,
    );

    // Identify stage-specific bottlenecks
    if (project.stageCode === 'SEC_11_PRELIMINARY' || project.stageCode === 'SEC_15_HEARING') {
      bottlenecks.push({
        stage: 'Section 15 Hearings & Objections',
        issue: 'Khatedar objections and cadastral survey discrepancies require formal Collector disposal hearings.',
        affectedCount: parcels.length > 0 ? parcels.filter((p) => p.stageCode === 'SEC_11_PRELIMINARY').length : 7,
        severity: 'critical',
      });
      recommendations.push(
        'Convene special revenue court session under CALA / SDO to complete Section 15(2) objection disposals.',
        'Upload verified cadastral survey overlays to prevent boundary litigation.',
      );
    }

    if (project.stageCode === 'SEC_19_DECLARATION' || slaRemaining <= 10) {
      bottlenecks.push({
        stage: 'Section 19 Statutory Gazette Publication',
        issue: 'Statutory 12-month declaration deadline approaching under RFCTLARR Act 2013 Section 19(7). Risk of notification lapse.',
        affectedCount: parcels.length > 0 ? parcels.length : 14,
        severity: 'critical',
      });
      recommendations.push(
        'Direct CALA to issue Section 19 declaration requisition to Government Central Press immediately to prevent statutory lapse.',
      );
    }

    if (project.compensationDisbursedCr < project.compensationAssessedCr * 0.5) {
      bottlenecks.push({
        stage: 'Compensation Apportionment & DBT Disbursal',
        issue: 'Apportionment disputes among joint khatedars and pending PFMS/e-Kuber bank account mandates.',
        affectedCount: 12,
        severity: 'high',
      });
      recommendations.push(
        'Prioritize bank mandate verification camp at Tehsil headquarters for awardee khatedars.',
        'Deposit disputed compensation shares into Reference Authority escrow under Section 77.',
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'Maintain regular weekly monitoring and ensure milestone gazette notifications remain on track.',
      );
    }

    return {
      status,
      slaDaysRemaining: slaRemaining,
      delayPredictedDays: delayDays,
      facts,
      bottlenecks,
      recommendations,
    };
  }
}
