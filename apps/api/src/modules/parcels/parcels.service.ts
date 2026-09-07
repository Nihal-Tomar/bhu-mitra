import { Injectable, NotFoundException, Optional, Logger } from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { LandParcelDto, Parcel360Dto } from '@bhumitra/types';

@Injectable()
export class ParcelsService {
  private readonly logger = new Logger(ParcelsService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async getAll(query?: {
    projectId?: string;
    state?: string;
    district?: string;
    stage?: string;
    search?: string;
  }): Promise<LandParcelDto[]> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const where: Record<string, any> = {};
        if (query?.projectId) where.projectId = query.projectId;
        if (query?.stage) where.stageCode = query.stage;
        if (query?.district) where.district = { name: { contains: query.district, mode: 'insensitive' } };
        if (query?.search) {
          where.OR = [
            { surveyNo: { contains: query.search, mode: 'insensitive' } },
            { parcelNumber: { contains: query.search, mode: 'insensitive' } },
          ];
        }

        const dbParcels = await this.prisma.landParcel.findMany({
          where,
          include: { owners: true, project: true, state: true, district: true, village: true },
          take: 100,
        });

        if (dbParcels.length > 0) {
          return dbParcels.map((p) => ({
            id: p.id,
            parcelNumber: p.parcelNumber,
            surveyNo: p.surveyNo,
            projectId: p.projectId,
            projectName: p.project?.name || 'Infrastructure Corridor',
            state: p.state?.name || 'Gujarat',
            district: p.district?.name || 'Vadodara',
            tehsil: 'Vadodara Rural',
            village: p.village?.name || 'Unknown',
            totalAreaHa: p.totalAreaHa,
            acquiredAreaHa: p.acquiredAreaHa,
            landCategory: p.landCategory as any,
            landUse: p.landUse || undefined,
            stage: p.stage,
            stageCode: (p.stageCode as any) || 'VALUATION',
            compensationStatus: p.compensationStatus as any,
            compensationAssessed: p.compensationAssessed,
            compensationAssessedAmount: p.compensationAssessedAmount,
            rrStatus: p.rrStatus,
            possessionStatus: p.possessionStatus as any,
            coordinates: p.coordinates,
            latitude: p.latitude,
            longitude: p.longitude,
            gazetteNotice: p.gazetteNotice,
            color: p.color,
            owners: p.owners.map((o) => ({
              id: o.id,
              name: o.name,
              sharePercentage: Number(o.sharePercentage) || 100,
              bankAccountVerified: o.bankAccountVerified,
              isMainOwner: o.isMainOwner,
              phone: o.phone || undefined,
            })),
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          }));
        }
      } catch (err) {
        this.logger.warn(`Prisma getAll parcels query failed: ${(err as Error).message}`);
      }
    }

    let items = this.dataStore.getParcels(query);
    if (query?.search) {
      items = items.filter((p) =>
        p.surveyNo.toLowerCase().includes(query.search!.toLowerCase()) ||
        p.parcelNumber.toLowerCase().includes(query.search!.toLowerCase())
      );
    }
    return items;
  }

  async getById(id: string): Promise<LandParcelDto> {
    const parcels = await this.getAll();
    const parcel = parcels.find((p) => p.id === id || p.surveyNo === id || p.parcelNumber === id);
    if (!parcel) {
      throw new NotFoundException(`Land parcel with identifier "${id}" not found`);
    }
    return parcel;
  }

  async getParcel360(id: string): Promise<Parcel360Dto> {
    const parcel360 = this.dataStore.getParcel360(id);
    if (!parcel360) {
      throw new NotFoundException(`Parcel 360 record for "${id}" not found`);
    }
    return parcel360;
  }
}
