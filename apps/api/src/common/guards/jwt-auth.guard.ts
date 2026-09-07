import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { DataStoreService } from '../data-store/data-store.service';
import { PrismaService } from '../prisma/prisma.service';
import type { UserSession, RoleCode, PermissionCode } from '@bhumitra/types';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
    private dataStore: DataStoreService,
    @Optional() private prisma?: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    const secret =
      this.configService.get<string>('JWT_SECRET') ||
      'bhumitra_dev_jwt_secret_change_in_production_si2026';

    try {
      const payload = this.jwtService.verify(token, { secret });

      // Check PostgreSQL via Prisma if connected
      if (this.prisma && this.prisma.isDbConnected) {
        const dbUser = await this.prisma.user.findUnique({
          where: { id: payload.sub },
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

        if (dbUser && dbUser.isActive) {
          const permissions =
            dbUser.role?.permissions?.map((p: any) => p.permission?.code as PermissionCode).filter(Boolean) || [];
          const session: UserSession = {
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
          request.user = session;
          return true;
        }
      }

      // In-memory resilient fallback
      const user = await this.dataStore.findUserById(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User account is inactive or not found');
      }

      const session: UserSession = this.dataStore.getUserSession(user);
      request.user = session;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired authentication token');
    }
  }
}
