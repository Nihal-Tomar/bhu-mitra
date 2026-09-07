import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Optional,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { LoginDto, AuthResponse, UserSession, RoleCode, PermissionCode } from '@bhumitra/types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  private getJwtSecret(): string {
    return (
      this.configService.get<string>('JWT_SECRET') ||
      'bhumitra_dev_jwt_secret_change_in_production_si2026'
    );
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const identifier = loginDto.userId || loginDto.email;
    if (!identifier) {
      throw new BadRequestException('Officer ID or Email is required for authentication');
    }

    let session: UserSession | null = null;
    let userId = '';
    let userName = '';
    let userPasswordHash = '';

    // 1. Try PostgreSQL via Prisma if connected
    if (this.prisma && this.prisma.isDbConnected) {
      const dbUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ officerId: identifier }, { email: identifier }],
          isActive: true,
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
          district: true,
        },
      });

      if (dbUser) {
        userId = dbUser.id;
        userName = dbUser.name;
        userPasswordHash = dbUser.passwordHash;
        const permissions =
          dbUser.role?.permissions?.map((p: any) => p.permission?.code as PermissionCode).filter(Boolean) || [];
        session = {
          id: dbUser.id,
          officerId: dbUser.officerId,
          name: dbUser.name,
          email: dbUser.email,
          role: (dbUser.role?.code as RoleCode) || 'PUBLIC',
          roleLabel: dbUser.role?.name || 'Officer',
          designation: dbUser.designation,
          jurisdiction: dbUser.jurisdiction,
          districtName: dbUser.district?.name,
          permissions: permissions as PermissionCode[],
        };
      }
    }

    // 2. Fallback to in-memory resilient store if not found in DB
    if (!session) {
      let user = await this.dataStore.findUserByOfficerId(identifier);
      if (!user) {
        user = await this.dataStore.findUserByEmail(identifier);
      }
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid Officer Credentials or Identifier');
      }
      userId = user.id;
      userName = user.name;
      userPasswordHash = user.passwordHash;
      session = this.dataStore.getUserSession(user);
    }

    // Password validation (skipped only for statutory demo SSO mode)
    if (loginDto.authMode !== 'sso') {
      const password = loginDto.password || '';
      const isValid = await this.dataStore.verifyPassword(password, userPasswordHash);
      if (!isValid) {
        // Record failed attempt audit log
        this.logAudit(userId, userName, 'FAILED_LOGIN', 'USER', userId, 'Failed authentication attempt');
        throw new UnauthorizedException('Invalid Password for the specified officer account');
      }
    }

    const secret = this.getJwtSecret();

    const payload = {
      sub: session.id,
      officerId: session.officerId,
      name: session.name,
      email: session.email,
      role: session.role,
      permissions: session.permissions,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: session.id, type: 'refresh' },
      { secret, expiresIn: '7d' },
    );

    // Audit successful login
    this.logAudit(
      session.id,
      session.name,
      'LOGIN',
      'USER',
      session.id,
      `Officer login via ${loginDto.authMode || 'credentials'} gateway`,
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 mins
      user: session,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string; expiresIn: number }> {
    if (!token) {
      throw new BadRequestException('Refresh token is required');
    }

    const secret = this.getJwtSecret();
    try {
      const payload = this.jwtService.verify(token, { secret });
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type for refresh');
      }

      // Check user exists
      let session: UserSession | null = null;
      if (this.prisma && this.prisma.isDbConnected) {
        const dbUser = await this.prisma.user.findUnique({
          where: { id: payload.sub, isActive: true },
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
            district: true,
          },
        });
        if (dbUser) {
          const permissions =
            dbUser.role?.permissions?.map((p: any) => p.permission?.code as PermissionCode).filter(Boolean) || [];
          session = {
            id: dbUser.id,
            officerId: dbUser.officerId,
            name: dbUser.name,
            email: dbUser.email,
            role: (dbUser.role?.code as RoleCode) || 'PUBLIC',
            roleLabel: dbUser.role?.name || 'Officer',
            designation: dbUser.designation,
            jurisdiction: dbUser.jurisdiction,
            districtName: dbUser.district?.name,
            permissions: permissions as PermissionCode[],
          };
        }
      }

      if (!session) {
        const user = await this.dataStore.findUserById(payload.sub);
        if (!user || !user.isActive) {
          throw new UnauthorizedException('User account not found or inactive');
        }
        session = this.dataStore.getUserSession(user);
      }

      const newAccessToken = this.jwtService.sign(
        {
          sub: session.id,
          officerId: session.officerId,
          name: session.name,
          email: session.email,
          role: session.role,
          permissions: session.permissions,
        },
        { secret, expiresIn: '15m' },
      );

      return { accessToken: newAccessToken, expiresIn: 900 };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async changePassword(
    userId: string,
    currentPass: string,
    newPass: string,
  ): Promise<{ message: string }> {
    if (!newPass || newPass.length < 8) {
      throw new BadRequestException('New password must be at least 8 characters');
    }

    let userHash = '';
    let userName = '';

    if (this.prisma && this.prisma.isDbConnected) {
      const dbUser = await this.prisma.user.findUnique({ where: { id: userId } });
      if (dbUser) {
        userHash = dbUser.passwordHash;
        userName = dbUser.name;
      }
    }

    if (!userHash) {
      const memUser = await this.dataStore.findUserById(userId);
      if (memUser) {
        userHash = memUser.passwordHash;
        userName = memUser.name;
      }
    }

    if (!userHash) {
      throw new BadRequestException('User not found');
    }

    const isValid = await bcrypt.compare(currentPass, userHash);
    if (!isValid) {
      throw new UnauthorizedException('Current password does not match');
    }

    const newHash = await bcrypt.hash(newPass, 10);

    if (this.prisma && this.prisma.isDbConnected) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      });
    }

    // Also update in-memory store for fallback parity
    this.dataStore.updateUserPassword(userId, newHash);

    this.logAudit(userId, userName, 'UPDATE', 'USER', userId, 'Officer password updated successfully');
    return { message: 'Password updated successfully' };
  }

  async getCurrentUser(userSession: UserSession): Promise<UserSession> {
    return userSession;
  }

  private async logAudit(
    actorId: string,
    actorName: string,
    action: string,
    entityType: string,
    entityId: string,
    remarks: string,
  ) {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.auditLog.create({
          data: {
            actorId,
            actorName,
            actorRole: 'OFFICER',
            action,
            entityType,
            entityId,
            remarks,
          },
        });
      } catch (err) {
        this.logger.warn(`Audit log to DB failed: ${(err as Error).message}`);
      }
    }
    this.dataStore.addAuditLog(actorId, actorName, action as any, entityType as any, entityId, remarks);
  }
}
