import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Platform health status' })
  @ApiResponse({ status: 200, description: 'Overall system health check' })
  async checkHealth() {
    const health = await this.healthService.getOverallHealth();
    return {
      data: health,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get('db')
  @ApiOperation({ summary: 'Database health status' })
  @ApiResponse({ status: 200, description: 'Database connectivity status' })
  async checkDb() {
    const db = await this.healthService.getDatabaseHealth();
    return {
      data: db,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get('redis')
  @ApiOperation({ summary: 'Redis cache health status' })
  @ApiResponse({ status: 200, description: 'Redis connectivity status' })
  checkRedis() {
    return {
      data: this.healthService.getRedisHealth(),
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get('storage')
  @ApiOperation({ summary: 'MinIO object storage health status' })
  @ApiResponse({ status: 200, description: 'Storage connectivity status' })
  checkStorage() {
    return {
      data: this.healthService.getStorageHealth(),
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}
