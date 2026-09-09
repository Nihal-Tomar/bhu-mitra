import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { DataStoreService } from '../data-store/data-store.service';
import type { UserSession } from '@bhumitra/types';

@Injectable()
export class JurisdictionGuard implements CanActivate {
  constructor(private readonly dataStore: DataStoreService) {}

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

    // Deep Resource Check (IDOR prevention): Project ID
    const projectId =
      request.body?.projectId ||
      request.query?.projectId ||
      request.params?.projectId ||
      (request.baseUrl?.includes('/projects') ? request.params?.id : undefined);

    if (projectId) {
      const project = this.dataStore.getProjectById(projectId);
      if (project) {
        if (project.stateCode && user.stateCode && project.stateCode.toLowerCase() !== user.stateCode.toLowerCase()) {
          throw new ForbiddenException(
            `Jurisdiction violation (IDOR): Project "${project.name}" (${project.stateCode}) is outside officer's jurisdiction (${user.stateCode})`,
          );
        }
        if (user.districtName && project.district) {
          const userDist = user.districtName.toLowerCase().replace(/district/g, '').trim();
          const projDist = project.district.toLowerCase().replace(/district/g, '').trim();
          if (userDist && projDist && !userDist.includes(projDist) && !projDist.includes(userDist)) {
            throw new ForbiddenException(
              `Jurisdiction violation (IDOR): Project district (${project.district}) is outside officer's assigned district (${user.districtName})`,
            );
          }
        }
      }
    }

    // Deep Resource Check (IDOR prevention): Parcel ID
    const parcelId =
      request.body?.parcelId ||
      request.query?.parcelId ||
      request.params?.parcelId ||
      (request.baseUrl?.includes('/parcels') ? request.params?.id : undefined);

    if (parcelId) {
      const parcel = this.dataStore.getParcelById(parcelId);
      if (parcel && parcel.district && user.districtName) {
        const userDist = user.districtName.toLowerCase().replace(/district/g, '').trim();
        const pDist = parcel.district.toLowerCase().replace(/district/g, '').trim();
        if (userDist && pDist && !userDist.includes(pDist) && !pDist.includes(userDist)) {
          throw new ForbiddenException(
            `Jurisdiction violation (IDOR): Land parcel "${parcel.parcelNumber}" (${parcel.district}) is outside officer's jurisdiction (${user.districtName})`,
          );
        }
      }
    }

    return true;
  }
}
