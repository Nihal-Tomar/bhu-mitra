/**
 * RFCTLARR 2013 Statutory Compensation Calculation Engine
 * Right to Fair Compensation and Transparency in Land Acquisition,
 * Rehabilitation and Resettlement Act, 2013 (First Schedule)
 */

export interface RfctlarrCalcParams {
  baseMarketRatePerHa: number;
  areaHa: number;
  isRural: boolean;
  ruralMultiplier?: number; // Configurable between 1.0 and 2.0 based on distance from urban area
  assetsValue?: number; // Trees, buildings, standing crops under Sec. 29
  notificationDate?: Date | string; // Sec. 11 preliminary notification date
  awardDate?: Date | string; // Date of award or possession
  solatiumPercentage?: number; // Statutory 100% under Sec. 30(1)
  statutoryInterestRate?: number; // Statutory 12% p.a. under Sec. 30(3)
}

export interface RfctlarrCalcResult {
  baseMarketValue: number;
  multiplier: number;
  multipliedLandValue: number;
  assetsValue: number;
  solatium: number;
  additionalInterest: number;
  interestMonths: number;
  totalAwardAmount: number;
  components: {
    name: string;
    code: string;
    amount: number;
    statutorySection: string;
  }[];
}

/**
 * Rounds a currency value to 2 decimal places to prevent floating-point precision leakage.
 */
export function roundCurrency(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

export class RfctlarrCalculator {
  /**
   * Computes statutory compensation strictly per RFCTLARR 2013 First Schedule
   */
  static calculate(params: RfctlarrCalcParams): RfctlarrCalcResult {
    const {
      baseMarketRatePerHa,
      areaHa,
      isRural,
      ruralMultiplier = 1.5, // Default rural multiplier per state gazette
      assetsValue = 0,
      notificationDate,
      awardDate = new Date(),
      solatiumPercentage = 100, // Sec. 30(1) mandates 100% solatium
      statutoryInterestRate = 12, // Sec. 30(3) mandates 12% per annum
    } = params;

    // 1. Base Market Value under Section 26
    const baseMarketValue = roundCurrency(baseMarketRatePerHa * areaHa);

    // 2. Applicable Multiplier factor (1.0 for urban, 1.0 - 2.0 for rural)
    const multiplier = isRural ? Math.max(1.0, Math.min(2.0, ruralMultiplier)) : 1.0;
    const multipliedLandValue = roundCurrency(baseMarketValue * multiplier);

    // 3. Assets attached to land under Section 29
    const safeAssetsValue = roundCurrency(Math.max(0, assetsValue));

    // 4. Base sum for solatium calculation (Sec. 30(1))
    const totalLandAndAssets = roundCurrency(multipliedLandValue + safeAssetsValue);

    // 5. 100% Solatium under Section 30(1)
    const solatium = roundCurrency((totalLandAndAssets * solatiumPercentage) / 100);

    // 6. Additional amount (interest) at 12% p.a. on market value under Section 30(3)
    let additionalInterest = 0;
    let interestMonths = 0;

    if (notificationDate) {
      const nDate = new Date(notificationDate);
      const aDate = new Date(awardDate);
      const diffMs = Math.max(0, aDate.getTime() - nDate.getTime());
      const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
      interestMonths = Math.round(diffYears * 12);
      // 12% per annum on the base market value from Sec. 11 date to Award date
      additionalInterest = roundCurrency((baseMarketValue * (statutoryInterestRate / 100)) * diffYears);
    }

    // 7. Total Statutory Award under Section 27 / 30
    const totalAwardAmount = roundCurrency(
      multipliedLandValue + safeAssetsValue + solatium + additionalInterest,
    );

    return {
      baseMarketValue,
      multiplier,
      multipliedLandValue,
      assetsValue: safeAssetsValue,
      solatium,
      additionalInterest,
      interestMonths,
      totalAwardAmount,
      components: [
        {
          name: 'Base Land Market Value',
          code: 'BASE_LAND_VALUE',
          amount: baseMarketValue,
          statutorySection: 'Sec. 26',
        },
        {
          name: isRural ? `Rural Multiplier (${multiplier}x)` : 'Urban Multiplier (1.0x)',
          code: 'MULTIPLIED_LAND_VALUE',
          amount: multipliedLandValue,
          statutorySection: 'First Schedule',
        },
        {
          name: 'Assets on Land (Trees, Buildings, Crops)',
          code: 'ASSETS_VALUE',
          amount: safeAssetsValue,
          statutorySection: 'Sec. 29',
        },
        {
          name: `Solatium (${solatiumPercentage}%)`,
          code: 'SOLATIUM',
          amount: solatium,
          statutorySection: 'Sec. 30(1)',
        },
        {
          name: `Additional Interest (${statutoryInterestRate}% p.a. for ${interestMonths} mos)`,
          code: 'ADDITIONAL_INTEREST',
          amount: additionalInterest,
          statutorySection: 'Sec. 30(3)',
        },
      ],
    };
  }
}
