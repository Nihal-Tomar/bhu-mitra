import { Injectable, NotFoundException, Optional, Logger } from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { GeoJsonFeatureCollection, SpatialQueryDto } from '@bhumitra/types';

export interface GisLayerDto {
  id: string;
  name: string;
  type: 'VECTOR' | 'RASTER' | 'WMS';
  category: 'CADASTRAL' | 'ALIGNMENT' | 'ENVIRONMENTAL' | 'STATUTORY';
  visible: boolean;
  opacity: number;
  url?: string;
  featuresCount?: number;
}

@Injectable()
export class GisService {
  private readonly logger = new Logger(GisService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  async getParcelsGeoJson(query?: { projectId?: string; state?: string; district?: string }): Promise<GeoJsonFeatureCollection> {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const where: Record<string, any> = {};
        if (query?.projectId) where.projectId = query.projectId;
        if (query?.district) where.district = { name: { contains: query.district, mode: 'insensitive' } };
        if (query?.state) where.state = { code: query.state };

        const dbParcels = await this.prisma.landParcel.findMany({
          where,
          include: { project: true, state: true, district: true, village: true },
        });

        if (dbParcels.length > 0) {
          const features = dbParcels.map((p) => {
            const boundary = (p.boundaryGeoJson as any) || {
              type: 'Polygon',
              coordinates: [
                [
                  [73.1812, 22.3072],
                  [73.1855, 22.3072],
                  [73.1855, 22.3025],
                  [73.1812, 22.3025],
                  [73.1812, 22.3072],
                ],
              ],
            };

            return {
              type: 'Feature' as const,
              id: p.id,
              geometry: boundary,
              properties: {
                id: p.id,
                parcelId: p.id,
                parcelNumber: p.parcelNumber,
                surveyNo: p.surveyNo,
                totalArea: `${p.totalAreaHa} Ha`,
                acquiredArea: `${p.acquiredAreaHa} Ha`,
                classification: p.landCategory,
                stage: p.stage,
                compensationStatus: p.compensationStatus,
                compensationAssessed: p.compensationAssessed,
                rrStatus: p.rrStatus,
                possessionStatus: p.possessionStatus,
                district: p.district?.name || 'Vadodara',
                state: p.state?.name || 'Gujarat',
                projectId: p.projectId,
                projectName: p.project?.name || 'Infrastructure Corridor',
                color: p.color || '#F59E0B',
              },
            };
          });

          return {
            type: 'FeatureCollection',
            features: features as any,
            total: features.length,
          };
        }
      } catch (err) {
        this.logger.warn(`Prisma GIS parcels query failed: ${(err as Error).message}`);
      }
    }

    return this.dataStore.getParcelsGeoJson(query);
  }

  async getParcelSpatial(id: string) {
    const fc = await this.getParcelsGeoJson();
    const feat = fc.features.find((f: any) => f.id === id || f.properties?.parcelId === id);
    if (!feat) {
      throw new NotFoundException(`Spatial geometry for parcel "${id}" not found`);
    }
    return feat;
  }

  getProjectsGeoJson(): GeoJsonFeatureCollection {
    return this.dataStore.getProjectsGeoJson();
  }

  getLayers(): GisLayerDto[] {
    return [
      {
        id: 'layer-cadastral-parcels',
        name: 'Cadastral Boundaries (RoR / Khasra)',
        type: 'VECTOR',
        category: 'CADASTRAL',
        visible: true,
        opacity: 0.85,
        featuresCount: 4280,
      },
      {
        id: 'layer-expressway-alignment',
        name: 'Right-of-Way (RoW) Alignment Centerline',
        type: 'VECTOR',
        category: 'ALIGNMENT',
        visible: true,
        opacity: 1.0,
        featuresCount: 124,
      },
      {
        id: 'layer-section11-buffer',
        name: 'Section 11 Preliminary Notification Buffer (100m)',
        type: 'VECTOR',
        category: 'STATUTORY',
        visible: true,
        opacity: 0.4,
        featuresCount: 1,
      },
      {
        id: 'layer-eco-sensitive',
        name: 'MoEFCC Eco-Sensitive & Forest Corridors',
        type: 'VECTOR',
        category: 'ENVIRONMENTAL',
        visible: false,
        opacity: 0.5,
        featuresCount: 18,
      },
      {
        id: 'layer-survey-geotags',
        name: 'Field Inspection GPS Geo-Tags',
        type: 'VECTOR',
        category: 'CADASTRAL',
        visible: true,
        opacity: 0.9,
        featuresCount: 84,
      },
    ];
  }

  async spatialSearch(query: SpatialQueryDto): Promise<GeoJsonFeatureCollection> {
    const fc = await this.getParcelsGeoJson({
      projectId: query.projectId,
      state: query.state,
    });

    if (query.bbox && query.bbox.length === 4) {
      const [minLon, minLat, maxLon, maxLat] = query.bbox;
      fc.features = fc.features.filter((f) => {
        const coords = (f.geometry as unknown as { coordinates: number[][][] }).coordinates[0];
        if (!coords || !coords[0]) return true;
        const [lon, lat] = coords[0];
        return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat;
      });
      fc.total = fc.features.length;
    }

    return fc;
  }
}
