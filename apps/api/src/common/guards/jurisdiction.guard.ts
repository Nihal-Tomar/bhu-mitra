import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import type { UserSession } from '@bhumitra/types';

@Injectable()
export class JurisdictionGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserSession;

    if (!user) {
      return true;
    }

    // National oversight roles have unrestricted national jurisdiction
    if (
      user.role === 'SUPER_ADMIN' ||
      user.role === 'CENTRAL_MINISTRY_ADMIN' ||
      user.role === 'CENTRAL_MINISTRY_VIEWER' ||
      user.jurisdiction?.toLowerCase().includes('national') ||
      user.jurisdiction?.toLowerCase().includes('central')
    ) {
      return true;
    }

    const targetDistrict =
      request.query?.district ||
      request.query?.districtName ||
      request.body?.districtName ||
      request.body?.districtId ||
      request.params?.districtId;

    const targetState =
      request.query?.state ||
      request.query?.stateCode ||
      request.body?.stateCode;

    if (targetState && user.stateCode && user.stateCode.toLowerCase() !== String(targetState).toLowerCase()) {
      throw new ForbiddenException(
        `Jurisdiction violation: Officer jurisdiction (${user.stateCode}) does not permit operations in state (${targetState})`,
      );
    }

    if (targetDistrict && user.districtName) {
      const userDist = user.districtName.toLowerCase().replace(/district/g, '').trim();
      const targetDist = String(targetDistrict).toLowerCase().replace(/district/g, '').trim();
      if (userDist && targetDist && !userDist.includes(targetDist) && !targetDist.includes(userDist)) {
        throw new ForbiddenException(
          `Jurisdiction violation: Officer jurisdiction (${user.districtName}) does not permit operations in district (${targetDistrict})`,
        );
      }
    }

    return true;
  }
}
