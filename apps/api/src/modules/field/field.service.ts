import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Optional,
  Logger,
} from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { FieldInspectionDto, UserSession } from '@bhumitra/types';

@Injectable()
export class FieldService {
  private readonly logger = new Logger(FieldService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async getInspections(query?: { parcelId?: string; projectId?: string }): Promise<FieldInspectionDto[]> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const where: Record<string, any> = {};
        if (query?.parcelId) where.parcelId = query.parcelId;

        const items = await this.prisma.fieldInspection.findMany({
          where,
          include: { parcel: true },
          orderBy: { inspectionDate: 'desc' },
        });

        if (items.length > 0) {
          return items.map((i) => ({
            id: i.id,
            parcelId: i.parcelId,
            inspectorName: i.inspectorName,
            inspectionDate: i.inspectionDate.toISOString(),
            gpsLatitude: i.gpsLatitude,
            gpsLongitude: i.gpsLongitude,
            gpsAccuracyMeters: i.gpsAccuracyMeters,
            observations: i.observations,
            encroachmentFound: i.encroachmentFound,
            evidencePhotos: i.evidencePhotos,
            verificationStatus: i.verificationStatus as any,
          }));
        }
      } catch (err) {
        this.logger.warn(`Prisma getInspections query failed: ${(err as Error).message}`);
      }
    }

    return this.dataStore.getFieldInspections(query);
  }

  async submitInspection(data: Partial<FieldInspectionDto>, user: UserSession): Promise<FieldInspectionDto> {
    const authorizedRoles = ['FIELD_OFFICER', 'TEHSILDAR', 'LAND_ACQUISITION_OFFICER', 'SUPER_ADMIN'];
    if (user.role && !authorizedRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Unauthorized: Only Field Surveyors or Revenue Officers can submit ground inspection surveys. Current role: ${user.role}`,
      );
    }

    if (!data.parcelId) {
      throw new BadRequestException('Target land parcelId is required');
    }

    const lat = data.gpsLatitude;
    const lon = data.gpsLongitude;

    if (lat === undefined || lat < -90 || lat > 90) {
      throw new BadRequestException('Valid GPS latitude between -90 and 90 degrees is mandatory for ground verification');
    }

    if (lon === undefined || lon < -180 || lon > 180) {
      throw new BadRequestException('Valid GPS longitude between -180 and 180 degrees is mandatory for ground verification');
    }

    const newInspection: FieldInspectionDto = {
      id: `insp-${Date.now()}`,
      parcelId: data.parcelId,
      projectId: data.projectId,
      inspectorName: user.name,
      inspectionDate: new Date().toISOString(),
      gpsLatitude: lat,
      gpsLongitude: lon,
      gpsAccuracyMeters: data.gpsAccuracyMeters || 2.4,
      observations: data.observations || 'Boundary stones checked, alignment cleared',
      encroachmentFound: Boolean(data.encroachmentFound),
      evidencePhotos: data.evidencePhotos || [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
      ],
      evidencePhotosCount: data.evidencePhotos?.length || 1,
      verificationStatus: 'VERIFIED',
    };

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.fieldInspection.create({
          data: {
            id: newInspection.id,
            parcelId: newInspection.parcelId,
            inspectorName: user.name,
            inspectionDate: new Date(),
            gpsLatitude: lat,
            gpsLongitude: lon,
            gpsAccuracyMeters: newInspection.gpsAccuracyMeters,
            observations: newInspection.observations,
            encroachmentFound: newInspection.encroachmentFound,
            evidencePhotos: newInspection.evidencePhotos,
            verificationStatus: 'VERIFIED',
          },
        });

        await this.prisma.auditLog.create({
          data: {
            actorId: user.id,
            actorName: user.name,
            actorRole: user.role,
            action: 'CREATE',
            entityType: 'FIELD_INSPECTION',
            entityId: newInspection.id,
            remarks: `Geo-tagged field inspection submitted at (${lat}, ${lon}) for parcel ${newInspection.parcelId}`,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to insert inspection in DB: ${(err as Error).message}`);
      }
    }

    const created = this.dataStore.createFieldInspection(newInspection);
    this.dataStore.addAuditLog(
      user.id,
      user.name,
      'CREATE',
      'FIELD_INSPECTION',
      created.id,
      `Geo-tagged field inspection submitted at (${lat}, ${lon}) for parcel ${newInspection.parcelId}`,
    );

    return created;
  }

  async verifyInspection(
    id: string,
    verificationStatus: 'VERIFIED' | 'DISCREPANCY_NOTED' | 'RE_SURVEY_REQUIRED',
    notes: string,
    actorId: string,
    actorName: string,
    actorRole?: string,
  ): Promise<FieldInspectionDto> {
    const authorizedRoles = ['DISTRICT_COLLECTOR', 'CALA', 'TEHSILDAR', 'SUPER_ADMIN'];
    if (actorRole && !authorizedRoles.includes(actorRole)) {
      throw new ForbiddenException(
        `Unauthorized: Only Sub-Divisional Officer, CALA, or District Collector can verify inspection findings.`,
      );
    }

    const inspections = await this.getInspections();
    const found = inspections.find((i) => i.id === id);
    if (!found) {
      throw new NotFoundException(`Inspection with ID "${id}" not found`);
    }

    found.verificationStatus = verificationStatus;
    if (notes) {
      found.observations = `${found.observations} [Review note: ${notes}]`;
    }

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.fieldInspection.update({
          where: { id },
          data: { verificationStatus },
        });

        await this.prisma.auditLog.create({
          data: {
            actorId,
            actorName,
            actorRole: actorRole || 'OFFICER',
            action: 'UPDATE',
            entityType: 'FIELD_INSPECTION',
            entityId: id,
            remarks: `Verified inspection status as ${verificationStatus}`,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to update inspection in DB: ${(err as Error).message}`);
      }
    }

    this.dataStore.addAuditLog(
      actorId,
      actorName,
      'UPDATE',
      'FIELD_INSPECTION',
      id,
      `Verified inspection status as ${verificationStatus}`,
    );

    return found;
  }
}
