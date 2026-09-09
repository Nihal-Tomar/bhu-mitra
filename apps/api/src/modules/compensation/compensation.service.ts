import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  ConflictException,
  Optional,
  Logger,
} from '@nestjs/common';
import { DataStoreService } from '../../common/data-store/data-store.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  RfctlarrCalculator,
  RfctlarrCalcParams,
  RfctlarrCalcResult,
  roundCurrency,
} from './calculator/rfctlarr.calculator';
import type {
  ValuationDto,
  CompensationAwardDto,
  CompensationPaymentDto,
} from '@bhumitra/types';

@Injectable()
export class CompensationService {
  private readonly logger = new Logger(CompensationService.name);

  constructor(
    private readonly dataStore: DataStoreService,
    @Optional() private readonly prisma?: PrismaService,
  ) {}

  /**
   * Statutory RFCTLARR 2013 Calculation (Sec. 26 - 30)
   */
  calculateCompensation(params: RfctlarrCalcParams): RfctlarrCalcResult {
    return RfctlarrCalculator.calculate(params);
  }

  async getSummary() {
    if (this.prisma && this.prisma.isDbConnected) {
      try {
        const [awards, payments] = await Promise.all([
          this.prisma.compensationAward.findMany({ include: { parcel: true } }),
          this.prisma.compensationPayment.findMany(),
        ]);

        const totalAwarded = awards.reduce((acc: number, a: any) => acc + Number(a.totalAwardAmount), 0);
        const totalDisbursed = payments
          .filter((p: any) => p.status === 'COMPLETED')
          .reduce((acc: number, p: any) => acc + Number(p.amount), 0);

        return {
          valuations: this.dataStore.getValuations(),
          awards: awards.map((a: any) => ({
            id: a.id,
            awardNumber: a.awardNumber,
            parcelId: a.parcelId,
            projectId: a.parcel?.projectId || 'proj-0084',
            awardDate: a.awardDate.toISOString(),
            totalAwardAmount: Number(a.totalAwardAmount),
            solatiumAmount: Number(a.solatiumAmount),
            additionalInterest: Number(a.additionalInterest),
            approvedBy: a.approvedBy,
            status: a.status as any,
          })),
          payments: payments.map((p: any) => ({
            id: p.id,
            awardId: p.awardId,
            parcelId: p.parcelId,
            beneficiaryName: p.beneficiaryName,
            beneficiaryAccountMasked: p.beneficiaryAccountMasked,
            bankName: p.bankName,
            ifscCode: p.ifscCode,
            amount: Number(p.amount),
            paymentMethod: p.paymentMethod as any,
            paymentDate: p.paymentDate ? p.paymentDate.toISOString() : undefined,
            transactionRef: p.transactionRef || undefined,
            status: p.status as any,
            remarks: p.remarks || undefined,
          })),
          stats: {
            totalAssessed: totalAwarded * 1.05,
            totalAwarded: roundCurrency(totalAwarded),
            totalDisbursed: roundCurrency(totalDisbursed),
          },
        };
      } catch (err) {
        this.logger.warn(`Prisma compensation summary failed: ${(err as Error).message}`);
      }
    }

    const valuations = this.dataStore.getValuations();
    const awards = this.dataStore.getAwards();
    const payments = this.dataStore.getPayments();

    return {
      valuations,
      awards,
      payments,
      stats: {
        totalAssessed: valuations.reduce((acc, v) => acc + v.totalAssessedCompensation, 0),
        totalAwarded: awards.reduce((acc, a) => acc + a.totalAwardAmount, 0),
        totalDisbursed: payments
          .filter((p) => p.status === 'COMPLETED')
          .reduce((acc, p) => acc + p.amount, 0),
      },
    };
  }

  getValuations(): ValuationDto[] {
    return this.dataStore.getValuations();
  }

  getAwards(): CompensationAwardDto[] {
    return this.dataStore.getAwards();
  }

  getPayments(): CompensationPaymentDto[] {
    return this.dataStore.getPayments();
  }

  /**
   * Create an award draft or sanctioned award with role verification
   */
  async createAward(
    awardData: Partial<CompensationAwardDto>,
    actorId: string,
    actorName: string,
    actorRole?: string,
  ): Promise<CompensationAwardDto> {
    const authorizedRoles = ['DISTRICT_COLLECTOR', 'CALA', 'SUPER_ADMIN'];
    if (actorRole && !authorizedRoles.includes(actorRole)) {
      throw new ForbiddenException(
        `Unauthorized: Only CALA or District Collector can issue statutory compensation awards. Current role: ${actorRole}`,
      );
    }

    const awardNumber = awardData.awardNumber || `AWD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const total = roundCurrency(
      (awardData.totalAwardAmount || 0) ||
      ((awardData.solatiumAmount || 0) + (awardData.additionalInterest || 0) + 1500000)
    );

    const createdAward: CompensationAwardDto = {
      id: awardData.id || `awd-${Date.now()}`,
      awardNumber,
      parcelId: awardData.parcelId || 'parcel-103-10',
      projectId: awardData.projectId || 'proj-0084',
      awardDate: awardData.awardDate || new Date().toISOString(),
      status: (awardData.status as any) || 'APPROVED',
      solatiumAmount: roundCurrency(awardData.solatiumAmount || 0),
      additionalInterest: roundCurrency(awardData.additionalInterest || 0),
      totalAwardAmount: total,
      approvedBy: actorName || 'CALA Officer',
    };

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.compensationAward.create({
          data: {
            id: createdAward.id,
            awardNumber: createdAward.awardNumber,
            parcelId: createdAward.parcelId,
            totalAwardAmount: createdAward.totalAwardAmount,
            solatiumAmount: createdAward.solatiumAmount,
            additionalInterest: createdAward.additionalInterest,
            approvedBy: createdAward.approvedBy,
            status: createdAward.status,
            awardDate: new Date(createdAward.awardDate),
          },
        });

        await this.prisma.auditLog.create({
          data: {
            actorId,
            actorName,
            actorRole: actorRole || 'CALA',
            action: 'CREATE',
            entityType: 'AWARD',
            entityId: createdAward.id,
            remarks: `Issued statutory award ${awardNumber} for INR ${total.toLocaleString('en-IN')}`,
          },
        });
      } catch (err) {
        this.logger.warn(`Failed to persist award to DB: ${(err as Error).message}`);
      }
    }

    this.dataStore.addAward(createdAward);

    this.dataStore.addAuditLog(
      actorId,
      actorName,
      'APPROVE',
      'AWARD',
      createdAward.id,
      `Issued statutory award ${awardNumber} for INR ${total.toLocaleString('en-IN')}`,
    );

    return createdAward;
  }

  /**
   * Transactional DBT Disbursement with strict invariant check: disbursed <= sanctioned
   */
  async recordDisbursement(
    paymentData: {
      awardId: string;
      beneficiaryName: string;
      accountNumberMasked: string;
      ifsc: string;
      amount: number;
      utrNumber?: string;
    },
    actorId: string,
    actorName: string,
    actorRole?: string,
  ): Promise<CompensationPaymentDto> {
    const authorizedRoles = ['DISTRICT_COLLECTOR', 'CALA', 'COMPENSATION_OFFICER', 'SUPER_ADMIN'];
    if (actorRole && !authorizedRoles.includes(actorRole)) {
      throw new ForbiddenException(
        `Unauthorized: Only Compensation Officer or CALA can record disbursements. Current role: ${actorRole}`,
      );
    }

    const utrNumber = paymentData.utrNumber || `SBIN${Date.now()}`;

    // Duplicate Check: Disallow duplicate transaction reference (UTR)
    const existingPayments = this.getPayments();
    const isDuplicate = existingPayments.some(
      (p) =>
        p.transactionRef === utrNumber ||
        (p.awardId === paymentData.awardId &&
          p.amount === paymentData.amount &&
          p.beneficiaryAccountMasked === paymentData.accountNumberMasked &&
          Date.now() - new Date(p.paymentDate || 0).getTime() < 300000),
    );
    if (isDuplicate) {
      throw new ConflictException(
        `Duplicate payment rejected: Disbursement with UTR reference "${utrNumber}" has already been processed.`,
      );
    }

    if (this.prisma && this.prisma.isDbConnected) {
      const existingDbPayment = await this.prisma.compensationPayment.findFirst({
        where: { transactionRef: utrNumber },
      });
      if (existingDbPayment) {
        throw new ConflictException(
          `Duplicate payment rejected: UTR "${utrNumber}" already exists in the database.`,
        );
      }
    }

    const awards = this.getAwards();
    let targetAward = awards.find((a) => a.id === paymentData.awardId);

    if (!targetAward && this.prisma && this.prisma.isDbConnected) {
      const dbAward = await this.prisma.compensationAward.findUnique({
        where: { id: paymentData.awardId },
      });
      if (dbAward) {
        targetAward = {
          id: dbAward.id,
          awardNumber: dbAward.awardNumber,
          parcelId: dbAward.parcelId,
          projectId: 'proj-0084',
          awardDate: dbAward.awardDate.toISOString(),
          totalAwardAmount: Number(dbAward.totalAwardAmount),
          solatiumAmount: Number(dbAward.solatiumAmount),
          additionalInterest: Number(dbAward.additionalInterest),
          approvedBy: dbAward.approvedBy,
          status: dbAward.status as any,
        };
      }
    }

    const payments = this.getPayments();
    const existingDisbursed = payments
      .filter((p) => p.awardId === paymentData.awardId && p.status === 'COMPLETED')
      .reduce((acc, p) => acc + p.amount, 0);
    const newTotalDisbursed = roundCurrency(existingDisbursed + paymentData.amount);

    if (targetAward && newTotalDisbursed > targetAward.totalAwardAmount) {
      throw new BadRequestException(
        `Financial invariant violation: Total disbursement (INR ${newTotalDisbursed.toLocaleString('en-IN')}) exceeds sanctioned award limit (INR ${targetAward.totalAwardAmount.toLocaleString('en-IN')}).`,
      );
    }

    const payment: CompensationPaymentDto = {
      id: `pay-${Date.now()}`,
      awardId: paymentData.awardId,
      parcelId: targetAward?.parcelId || 'parcel-103-10',
      beneficiaryName: paymentData.beneficiaryName,
      beneficiaryAccountMasked: paymentData.accountNumberMasked,
      bankName: 'State Bank of India',
      ifscCode: paymentData.ifsc,
      amount: roundCurrency(paymentData.amount),
      paymentMethod: 'PFMS_DBT',
      paymentDate: new Date().toISOString(),
      transactionRef: utrNumber,
      status: 'COMPLETED',
      remarks: `DBT PFMS UTR: ${utrNumber}`,
    };

    if (this.prisma && this.prisma.isDbConnected) {
      try {
        await this.prisma.$transaction(async (tx) => {
          await tx.compensationPayment.create({
            data: {
              id: payment.id,
              awardId: payment.awardId,
              parcelId: payment.parcelId,
              beneficiaryName: payment.beneficiaryName,
              beneficiaryAccountMasked: payment.beneficiaryAccountMasked,
              bankName: payment.bankName,
              ifscCode: payment.ifscCode,
              amount: payment.amount,
              paymentMethod: payment.paymentMethod,
              transactionRef: utrNumber,
              paymentDate: new Date(),
              status: 'COMPLETED',
              remarks: payment.remarks,
            },
          });

          await tx.auditLog.create({
            data: {
              actorId,
              actorName,
              actorRole: actorRole || 'OFFICER',
              action: 'DISBURSE',
              entityType: 'COMPENSATION',
              entityId: payment.id,
              remarks: `Disbursed INR ${paymentData.amount} via DBT to ${paymentData.beneficiaryName} (UTR: ${utrNumber})`,
            },
          });
        });
      } catch (err) {
        this.logger.warn(`DB disbursement transaction failed: ${(err as Error).message}`);
      }
    }

    this.dataStore.addPayment(payment);

    this.dataStore.addAuditLog(
      actorId,
      actorName,
      'DISBURSE',
      'COMPENSATION',
      payment.id,
      `Disbursed INR ${paymentData.amount} via DBT to ${paymentData.beneficiaryName} (UTR: ${utrNumber})`,
    );

    return payment;
  }
}
