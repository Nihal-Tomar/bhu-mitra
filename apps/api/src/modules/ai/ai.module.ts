import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './services/ai.service';
import { AiToolsService } from './services/ai-tools.service';
import { AiDelayEngineService } from './services/ai-delay-engine.service';
import { AiRiskEngineService } from './services/ai-risk-engine.service';
import { AiProviderService } from './services/ai-provider.service';
import { ProjectsModule } from '../projects/projects.module';
import { ParcelsModule } from '../parcels/parcels.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { CompensationModule } from '../compensation/compensation.module';
import { WorkflowModule } from '../workflow/workflow.module';
import { ReportsModule } from '../reports/reports.module';
import { DocumentsModule } from '../documents/documents.module';
import { GisModule } from '../gis/gis.module';
import { AuditModule } from '../audit/audit.module';
import { DataStoreModule } from '../../common/data-store/data-store.module';

import { LanguageDetectionService } from './services/language-detection.service';
import { DocumentIntelligenceService } from './services/document-intelligence.service';
import { AiIntentEngineService } from './services/ai-intent-engine.service';

@Module({
  imports: [
    ProjectsModule,
    ParcelsModule,
    AnalyticsModule,
    CompensationModule,
    WorkflowModule,
    ReportsModule,
    DocumentsModule,
    GisModule,
    AuditModule,
    DataStoreModule,
  ],
  controllers: [AiController],
  providers: [
    AiToolsService,
    AiDelayEngineService,
    AiRiskEngineService,
    AiProviderService,
    LanguageDetectionService,
    DocumentIntelligenceService,
    AiIntentEngineService,
    AiService,
  ],
  exports: [
    AiService,
    AiToolsService,
    LanguageDetectionService,
    DocumentIntelligenceService,
    AiIntentEngineService,
  ],
})
export class AiModule {}

