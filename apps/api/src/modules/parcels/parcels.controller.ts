import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ParcelsService } from './parcels.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Land Parcels & Parcel 360')
@Controller('parcels')
export class ParcelsController {
  constructor(private readonly parcelsService: ParcelsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all cadastral land parcels (filtered by project or location)' })
  @ApiResponse({ status: 200, description: 'List of land parcels' })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'state', required: false })
  @ApiQuery({ name: 'district', required: false })
  @ApiQuery({ name: 'stage', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAll(
    @Query() query: {
      projectId?: string;
      state?: string;
      district?: string;
      stage?: string;
      search?: string;
    },
  ) {
    const items = await this.parcelsService.getAll(query);
    return {
      data: items,
      meta: {
        total: items.length,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get parcel by ID or Survey Number' })
  @ApiResponse({ status: 200, description: 'Parcel detail' })
  @ApiResponse({ status: 404, description: 'Parcel not found' })
  async getById(@Param('id') id: string) {
    const data = await this.parcelsService.getById(id);
    return { data };
  }

  @Public()
  @Get(':id/360')
  @ApiOperation({ summary: 'Consolidated Parcel 360 view (spatial, ownership, valuation, award, R&R, grievances, audit)' })
  @ApiResponse({ status: 200, description: 'Consolidated Parcel 360 dossier' })
  @ApiResponse({ status: 404, description: 'Parcel record not found' })
  async getParcel360(@Param('id') id: string) {
    const data = await this.parcelsService.getParcel360(id);
    return { data };
  }
}
