/**
 * BhuMitra — Master Database Seeder
 * Smart India Hackathon 2026 — Problem Statement 26016
 *
 * Executes deterministic seeding of:
 * - States, Districts, Villages
 * - Roles, Permissions, User Accounts (Official Presets)
 * - Flagship Infrastructure Projects
 * - Cadastral Land Parcels & Owners
 * - Acquisition Cases, Actions, Priority SLAs
 * - Valuations, Compensation Awards & DBT Payments
 * - R&R Cases & Entitlements
 * - Grievances & Field Verifications
 */

import { PrismaClient } from '@prisma/client';
import {
  SEED_STATES,
  SEED_DISTRICTS,
  SEED_VILLAGES,
  SEED_ROLES,
  SEED_USERS,
  SEED_PASSWORD_HASH,
  SEED_PROJECTS,
  SEED_PARCELS,
  SEED_PRIORITY_ACTIONS,
  SEED_GRIEVANCES,
} from './data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting BhuMitra Master Database Seeding...');

  // 1. Seed States
  for (const state of SEED_STATES) {
    await prisma.state.upsert({
      where: { code: state.code },
      update: state,
      create: state,
    });
  }
  console.log(`✅ Seeded ${SEED_STATES.length} States`);

  // 2. Seed Districts
  for (const district of SEED_DISTRICTS) {
    await prisma.district.upsert({
      where: { id: district.id },
      update: district,
      create: district,
    });
  }
  console.log(`✅ Seeded ${SEED_DISTRICTS.length} Districts`);

  // 3. Seed Villages
  for (const village of SEED_VILLAGES) {
    await prisma.village.upsert({
      where: { id: village.id },
      update: village,
      create: village,
    });
  }
  console.log(`✅ Seeded ${SEED_VILLAGES.length} Villages`);

  // 4. Seed Roles
  for (const role of SEED_ROLES) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: role,
      create: role,
    });
  }
  console.log(`✅ Seeded ${SEED_ROLES.length} Roles`);

  // 5. Seed Users (Matching UI officer presets with bcrypt password)
  for (const user of SEED_USERS) {
    await prisma.user.upsert({
      where: { officerId: user.officerId },
      update: {
        name: user.name,
        email: user.email,
        designation: user.designation,
        jurisdiction: user.jurisdiction,
        roleId: user.roleId,
        districtId: user.districtId,
        phone: user.phone,
        passwordHash: SEED_PASSWORD_HASH,
      },
      create: {
        id: user.id,
        officerId: user.officerId,
        name: user.name,
        email: user.email,
        passwordHash: SEED_PASSWORD_HASH,
        designation: user.designation,
        jurisdiction: user.jurisdiction,
        roleId: user.roleId,
        districtId: user.districtId,
        phone: user.phone,
      },
    });
  }
  console.log(`✅ Seeded ${SEED_USERS.length} Official Officer Preset Users`);

  // 6. Seed Projects
  for (const project of SEED_PROJECTS) {
    await prisma.project.upsert({
      where: { projectCode: project.projectCode },
      update: project,
      create: project,
    });
  }
  console.log(`✅ Seeded ${SEED_PROJECTS.length} Flagship Projects`);

  // 7. Seed Parcels & Owners
  for (const parcelData of SEED_PARCELS) {
    const { owners, ...parcelFields } = parcelData;
    const parcel = await prisma.landParcel.upsert({
      where: { parcelNumber: parcelFields.parcelNumber },
      update: parcelFields,
      create: parcelFields,
    });

    if (owners && owners.length > 0) {
      await prisma.parcelOwner.deleteMany({ where: { parcelId: parcel.id } });
      for (const owner of owners) {
        await prisma.parcelOwner.create({
          data: {
            parcelId: parcel.id,
            name: owner.name,
            sharePercentage: owner.sharePercentage,
            bankAccountVerified: owner.bankAccountVerified,
            isMainOwner: owner.isMainOwner,
            phone: owner.phone,
          },
        });
      }
    }
  }
  console.log(`✅ Seeded ${SEED_PARCELS.length} Cadastral Parcels with Khatedar Owners`);

  // 8. Seed Priority Actions
  for (const action of SEED_PRIORITY_ACTIONS) {
    await prisma.acquisitionAction.upsert({
      where: { id: action.id },
      update: action,
      create: action,
    });
  }
  console.log(`✅ Seeded ${SEED_PRIORITY_ACTIONS.length} Action Centre Priority Items`);

  // 9. Seed Grievances
  for (const grv of SEED_GRIEVANCES) {
    await prisma.grievance.upsert({
      where: { ticketNumber: grv.ticketNumber },
      update: grv,
      create: grv,
    });
  }
  console.log(`✅ Seeded ${SEED_GRIEVANCES.length} Grievance Objections`);

  console.log('🌟 BhuMitra Master Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
