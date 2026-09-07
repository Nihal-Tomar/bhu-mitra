import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { DataStoreService } from '../../common/data-store/data-store.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        DataStoreService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mock-jwt-token-sih-2026'),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((_key: string, defaultVal: string) => defaultVal),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should authenticate official officer preset GJ-DM-VD-0042', async () => {
    const result = await authService.login({
      userId: 'GJ-DM-VD-0042',
      password: 'Bhumitra@2026',
    });

    expect(result.accessToken).toBe('mock-jwt-token-sih-2026');
    expect(result.user.officerId).toBe('GJ-DM-VD-0042');
    expect(result.user.name).toContain('Rajesh Sharma');
    expect(result.user.role).toBe('DISTRICT_COLLECTOR');
  });

  it('should reject invalid password', async () => {
    await expect(
      authService.login({
        userId: 'GJ-DM-VD-0042',
        password: 'WrongPassword@123',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should reject non-existent officer ID', async () => {
    await expect(
      authService.login({
        userId: 'NON-EXISTENT-999',
        password: 'Bhumitra@2026',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
