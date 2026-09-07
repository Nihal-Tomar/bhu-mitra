import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((_key: string, defaultVal: string) => defaultVal),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should return healthy overall status', async () => {
    const result = await controller.checkHealth();
    expect(result.data.status).toBe('healthy');
    expect(result.data.version).toBe('1.0.0-sih');
  });

  it('should return database health info', async () => {
    const result = await controller.checkDb();
    expect(result.data.status).toBe('healthy');
    expect(result.data.type).toContain('PostgreSQL');
  });
});
