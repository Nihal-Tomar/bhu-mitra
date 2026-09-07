import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Optional,
  Logger,
} from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { RRCaseDto } from '@bhumitra/types';

@Injectable()
export class RehabilitationService {
  private readonly logger = new Logger(RehabilitationService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async getCases(projectId?: string): Promise<RRCaseDto[]> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const where = projectId ? { projectId } : {};
        const cases = await this.prisma.rRCase.findMany({
          where,
          orderBy: { createdAt: 'desc' },
        });

        if (cases.length > 0) {
          return cases.map((c) => ({
            id: c.id,
            projectId: c.projectId,
            parcelId: c.parcelId || 'parcel-001',
            familyHeadName: c.familyHeadName || 'Beneficiary Head',
            familySize: c.familySize || 4,
            isScSt: c.isScSt || false,
            isBpl: c.isBpl || false,
            displacementType: (c.displacementType as any) || 'BOTH',
            packageType: c.packageType || 'Second Schedule Package A',
            entitlements: (c.entitlements as string[]) || [
              'Constructed House / Housing Grant (Sec. 31)',
              'Subsistence Allowance for 1 Year',
              'Transportation Allowance (₹50,000)',
            ],
            resettlementPlotNo: c.resettlementPlotNo || undefined,
            resettlementColonyName: c.resettlementColonyName || 'BhuMitra Adarsh R&R Colony, Vadodara',
            subsistenceGrantAmount: Number(c.subsistenceGrantAmount) || 36000,
            relocationGrantAmount: Number(c.relocationGrantAmount) || 50000,
            status: (c.status as any) || 'PACKAGE_SANCTIONED',
            createdAt: c.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        this.logger.warn(`Prisma getCases failed: ${(err as Error).message}`);
      }
    }

    const cases = this.dataStore.getRRCases();
    if (projectId) {
      return cases.filter((c) => c.projectId === projectId);
    }
    return cases;
  }

  async getCaseById(id: string): Promise<RRCaseDto> {
    const cases = await this.getCases();
    const found = cases.find((c) => c.id === id);
    if (!found) {
      throw new NotFoundException(`R&R case with ID "${id}" not found`);
    }
    return found;
  }

  async createCase(
    data: Partial<RRCaseDto>,
    actorId: string,
    actorName: string,
    actorRole?: string,
  ): Promise<RRCaseDto> {
    const authorizedRoles = ['DISTRICT_COLLECTOR', 'CALA', 'RR_OFFICER', 'SUPER_ADMIN'];
    if (actorRole && !authorizedRoles.includes(actorRole)) {
      throw new ForbiddenException(
        `Unauthorized: Only R&R Officer, CALA, or District Collector can create R&R entitlement cases.`,
      );
    }

    const newCase: RRCaseDto = {
      id: data.id || `rr-${Date.now()}`,
      projectId: data.projectId || 'proj-001',
      parcelId: data.parcelId || 'parcel-001',
      familyHeadName: data.familyHeadName || 'Beneficiary Head',
      familySize: data.familySize || 4,
      isScSt: Boolean(data.isScSt),
      isBpl: Boolean(data.isBpl),
      displacementType: data.displacementType || 'BOTH',
      packageType: data.packageType || 'Second Schedule Statutory Package',
      entitlements: data.entitlements || [
        'Housing Allowance per Second Schedule',
        'Subsistence Grant ₹36,000',
        'Relocation Assistance ₹50,000',
      ],
      resettlementPlotNo: data.resettlementPlotNo,
      resettlementColonyName: data.resettlementColonyName,
      subsistenceGrantAmount: data.subsistenceGrantAmount || 36000,
      relocationGrantAmount: data.relocationGrantAmount || 50000,
      status: 'ELIGIBLE',
      createdAt: new Date().toISOString(),
    };

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.auditLog.create({
          data: {
            actorId,
            actorName,
            actorRole: actorRole || 'RR_OFFICER',
            action: 'CREATE',
            entityType: 'REHABILITATION',
            entityId: newCase.id,
            remarks: `Created R&R case for family of ${newCase.familyHeadName}`,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to log R&R case to DB: ${(err as Error).message}`);
      }
    }

    this.dataStore.addAuditLog(
      actorId,
      actorName,
      'CREATE',
      'REHABILITATION',
      newCase.id,
      `Created R&R case for family of ${newCase.familyHeadName}`,
    );

    return newCase;
  }

  async updateStatus(
    id: string,
    status: RRCaseDto['status'],
    actorId: string,
    actorName: string,
    actorRole?: string,
  ): Promise<RRCaseDto> {
    const authorizedRoles = ['DISTRICT_COLLECTOR', 'CALA', 'RR_OFFICER', 'SUPER_ADMIN'];
    if (actorRole && !authorizedRoles.includes(actorRole)) {
      throw new ForbiddenException(
        `Unauthorized: Only R&R Officer or District Collector can update R&R status.`,
      );
    }

    const c = await this.getCaseById(id);
    c.status = status;

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.rRCase.update({
          where: { id },
          data: { status: status as any },
        });

        await this.prisma.auditLog.create({
          data: {
            actorId,
            actorName,
            actorRole: actorRole || 'RR_OFFICER',
            action: 'UPDATE',
            entityType: 'REHABILITATION',
            entityId: id,
            remarks: `Updated R&R case status to ${status}`,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to update R&R in DB: ${(err as Error).message}`);
      }
    }

    this.dataStore.addAuditLog(
      actorId,
      actorName,
      'UPDATE',
      'REHABILITATION',
      id,
      `Updated R&R case status to ${status}`,
    );

    return c;
  }

  async getStats() {
    const cases = await this.getCases();
    const total = cases.length;
    const completed = cases.filter((c) => c.status === 'COMPLETED').length;
    const plotsAllotted = cases.filter((c) => Boolean(c.resettlementPlotNo)).length;
    const scStCount = cases.filter((c) => c.isScSt).length;
    const totalGrantsDisbursed = cases.reduce(
      (acc, c) => acc + c.subsistenceGrantAmount + c.relocationGrantAmount,
      0,
    );

    return {
      totalCases: total,
      completed,
      plotsAllotted,
      scStFamiliesCount: scStCount,
      totalGrantsDisbursed,
      complianceRate: total > 0 ? Math.round((completed / total) * 100) : 100,
    };
  }
}
