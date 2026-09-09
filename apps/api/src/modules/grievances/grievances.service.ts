import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Optional,
  Logger,
} from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { GrievanceDto } from '@bhumitra/types';

@Injectable()
export class GrievancesService {
  private readonly logger = new Logger(GrievancesService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async getAll(filter?: { projectId?: string; status?: string; isOverdue?: boolean }): Promise<GrievanceDto[]> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const where: Record<string, any> = {};
        if (filter?.projectId) where.projectId = filter.projectId;
        if (filter?.status) where.status = filter.status;
        if (filter?.isOverdue !== undefined) where.isOverdue = filter.isOverdue;

        const dbGrvs = await this.prisma.grievance.findMany({
          where,
          include: { project: true, parcel: true },
          orderBy: { filingDate: 'desc' },
        });

        if (dbGrvs.length > 0) {
          const now = new Date();
          return dbGrvs.map((g) => ({
            id: g.id,
            ticketNumber: g.ticketNumber,
            projectId: g.projectId,
            projectName: g.project?.name,
            parcelId: g.parcelId || undefined,
            surveyNo: g.parcel?.surveyNo || undefined,
            complainantName: g.complainantName,
            phone: g.phone || undefined,
            category: g.category as any,
            description: g.description,
            filingDate: g.filingDate.toISOString(),
            hearingDate: g.hearingDate?.toISOString(),
            slaDueDate: g.slaDueDate.toISOString(),
            isOverdue: g.status !== 'RESOLVED' && g.status !== 'CLOSED' && now > g.slaDueDate,
            assignedOfficerName: g.assignedOfficerName,
            status: g.status as any,
          }));
        }
      } catch (err) {
        this.logger.warn(`Prisma getAll grievances failed: ${(err as Error).message}`);
      }
    }

    let items = this.dataStore.getGrievances();
    const now = new Date();

    // Dynamically update SLA overdue status
    items = items.map((g) => ({
      ...g,
      isOverdue: g.status !== 'RESOLVED' && g.status !== 'CLOSED' && now > new Date(g.slaDueDate),
    }));

    if (filter?.projectId) {
      items = items.filter((g) => g.projectId === filter.projectId);
    }
    if (filter?.status) {
      items = items.filter((g) => g.status === filter.status);
    }
    if (filter?.isOverdue !== undefined) {
      items = items.filter((g) => g.isOverdue === filter.isOverdue);
    }

    return items;
  }

  async getByTicket(ticketNumber: string): Promise<GrievanceDto> {
    const items = await this.getAll();
    const found = items.find((g) => g.ticketNumber === ticketNumber || g.id === ticketNumber);
    if (!found) {
      throw new NotFoundException(`Grievance ticket "${ticketNumber}" not found`);
    }
    return found;
  }

  async create(data: Partial<GrievanceDto>): Promise<GrievanceDto> {
    if (!data.complainantName || !data.category || !data.description) {
      throw new BadRequestException('Complainant name, category, and description are required');
    }

    const filingDate = new Date();
    // Statutory RFCTLARR 2013: 30 days statutory grievance SLA
    const slaDays = data.category === 'COMPENSATION_DISPUTE' ? 30 : 21;
    const slaDueDate = new Date(filingDate.getTime() + slaDays * 24 * 60 * 60 * 1000);
    const ticketNumber = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newGrv: GrievanceDto = {
      id: `grv-${Date.now()}`,
      ticketNumber,
      projectId: data.projectId || 'proj-001',
      projectName: data.projectName || 'Vadodara-Mumbai Expressway',
      parcelId: data.parcelId,
      surveyNo: data.surveyNo,
      complainantName: data.complainantName,
      phone: data.phone,
      category: data.category as any,
      description: data.description,
      filingDate: filingDate.toISOString(),
      slaDueDate: slaDueDate.toISOString(),
      isOverdue: false,
      assignedOfficerName: data.assignedOfficerName || 'Sub-Divisional Magistrate / Revenue Officer',
      status: 'SUBMITTED',
    };

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.grievance.create({
          data: {
            id: newGrv.id,
            ticketNumber,
            projectId: newGrv.projectId,
            parcelId: newGrv.parcelId,
            complainantName: newGrv.complainantName,
            phone: newGrv.phone,
            category: newGrv.category,
            description: newGrv.description,
            filingDate,
            slaDueDate,
            isOverdue: false,
            assignedOfficerName: newGrv.assignedOfficerName,
            status: 'SUBMITTED',
          },
        });

        await this.prisma.auditLog.create({
          data: {
            actorId: 'user-admin-national',
            actorName: `${newGrv.complainantName} (Citizen Portal)`,
            actorRole: 'CITIZEN',
            action: 'CREATE',
            entityType: 'GRIEVANCE',
            entityId: newGrv.id,
            remarks: `Submitted grievance ${ticketNumber} (${newGrv.category})`,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to insert grievance into DB: ${(err as Error).message}`);
      }
    }

    const created = this.dataStore.createGrievance(newGrv);
    this.dataStore.addAuditLog(
      'public-citizen',
      newGrv.complainantName,
      'CREATE',
      'GRIEVANCE',
      created.id,
      `Submitted grievance ${ticketNumber} (${newGrv.category})`,
    );

    return created;
  }

  async updateStatus(
    id: string,
    status: GrievanceDto['status'],
    remarks: string,
    actorId: string,
    actorName: string,
    actorRole?: string,
  ): Promise<GrievanceDto> {
    const grv = await this.getByTicket(id);
    grv.status = status;
    if (remarks) {
      grv.resolutionNotes = remarks;
    }
    if (status === 'RESOLVED' || status === 'CLOSED') {
      grv.resolutionDate = new Date().toISOString();
    }

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.grievance.update({
          where: { id: grv.id },
          data: {
            status: status as any,
            isOverdue: false,
          },
        });

        await this.prisma.auditLog.create({
          data: {
            actorId,
            actorName,
            actorRole: actorRole || 'OFFICER',
            action: 'UPDATE',
            entityType: 'GRIEVANCE',
            entityId: grv.id,
            remarks: `Updated grievance status to ${status}. Remarks: ${remarks}`,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to update grievance in DB: ${(err as Error).message}`);
      }
    }

    this.dataStore.addAuditLog(
      actorId,
      actorName,
      'UPDATE',
      'GRIEVANCE',
      grv.id,
      `Updated grievance status to ${status}. Remarks: ${remarks}`,
    );

    return grv;
  }

  async scheduleHearing(
    id: string,
    hearingDate: string,
    actorId: string,
    actorName: string,
    _actorRole?: string,
  ): Promise<GrievanceDto> {
    const grv = await this.getByTicket(id);
    grv.hearingDate = hearingDate;
    grv.status = 'HEARING_SCHEDULED';

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.grievance.update({
          where: { id: grv.id },
          data: {
            hearingDate: new Date(hearingDate),
            status: 'HEARING_SCHEDULED',
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to schedule hearing in DB: ${(err as Error).message}`);
      }
    }

    this.dataStore.addAuditLog(
      actorId,
      actorName,
      'UPDATE',
      'GRIEVANCE',
      grv.id,
      `Scheduled statutory Section 15 objection hearing for ${hearingDate}`,
    );

    return grv;
  }
}
