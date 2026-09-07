import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GisService } from './gis.service';
import { Public } from '../../common/decorators/public.decorator';
import type { SpatialQueryDto } from '@bhumitra/types';

@ApiTags('GIS & Spatial Alignment')
@Controller('gis')
export class GisController {
  constructor(private readonly gisService: GisService) {}

  @Public()
  @Get('layers')
  @ApiOperation({ summary: 'Get active GIS spatial layer catalogue' })
  @ApiResponse({ status: 200, description: 'List of GIS layers' })
  getLayers() {
    return {
      data: this.gisService.getLayers(),
    };
  }

  @Public()
  @Get('projects')
  @ApiOperation({ summary: 'Get GeoJSON FeatureCollection of project alignment corridors' })
  @ApiResponse({ status: 200, description: 'GeoJSON projects collection' })
  getProjects() {
    return {
      data: this.gisService.getProjectsGeoJson(),
    };
  }

  @Public()
  @Get('parcels')
  @ApiOperation({ summary: 'Get GeoJSON FeatureCollection of cadastral land parcels' })
  @ApiResponse({ status: 200, description: 'GeoJSON parcels collection' })
  async getParcels(@Query() query: { projectId?: string; state?: string; district?: string }) {
    const data = await this.gisService.getParcelsGeoJson(query);
    return { data };
  }

  @Public()
  @Get('parcels/:id')
  @ApiOperation({ summary: 'Get single parcel GeoJSON Feature by ID' })
  @ApiResponse({ status: 200, description: 'GeoJSON single parcel feature' })
  async getParcelById(@Param('id') id: string) {
    const data = await this.gisService.getParcelSpatial(id);
    return { data };
  }

  @Public()
  @Post('spatial-search')
  @ApiOperation({ summary: 'Spatial bounding box and radius query for map viewports' })
  async spatialSearch(@Body() query: SpatialQueryDto) {
    const data = await this.gisService.spatialSearch(query);
    return { data };
  }
}
