import { RfctlarrCalculator, roundCurrency } from './rfctlarr.calculator';

describe('RfctlarrCalculator', () => {
  describe('roundCurrency', () => {
    it('should round to 2 decimal places', () => {
      expect(roundCurrency(100.125)).toBe(100.13);
      expect(roundCurrency(100.124)).toBe(100.12);
      expect(roundCurrency(0)).toBe(0);
      expect(roundCurrency(999999.999)).toBe(1000000);
    });
  });

  describe('calculate', () => {
    it('should compute correct statutory compensation for rural land', () => {
      const result = RfctlarrCalculator.calculate({
        baseMarketRatePerHa: 2000000,
        landAreaHa: 1.5,
        isRural: true,
        ruralMultiplierFactor: 1.5,
        assetsValueTreesStructures: 500000,
        monthsFromSec11ToAward: 12,
      });

      // Base: 1.5 * 2,000,000 = 3,000,000
      expect(result.baseMarketValue).toBe(3000000);
      // Multiplied: 3,000,000 * 1.5 = 4,500,000
      expect(result.multipliedLandValue).toBe(4500000);
      // Solatium: 100% of 4,500,000 = 4,500,000
      expect(result.solatium).toBe(4500000);
      // Interest: 12% per annum on 4,500,000 for 1 year = 540,000
      expect(result.additionalInterest).toBe(540000);
      // Assets: 500,000
      expect(result.assetsValue).toBe(500000);
      // Total: 4,500,000 + 500,000 + 4,500,000 + 540,000 = 10,040,000
      expect(result.totalAwardAmount).toBe(10040000);
      expect(result.totalCompensation).toBe(10040000);
    });

    it('should use multiplier of 1.0 for urban land', () => {
      const result = RfctlarrCalculator.calculate({
        baseMarketRatePerHa: 5000000,
        areaHa: 1.0,
        isRural: false,
      });

      expect(result.multiplier).toBe(1.0);
      expect(result.multipliedLandValue).toBe(5000000);
      // Solatium 100% of multiplied = 5,000,000
      expect(result.solatium).toBe(5000000);
      // Total: 5,000,000 + 5,000,000 = 10,000,000
      expect(result.totalAwardAmount).toBe(10000000);
    });

    it('should clamp rural multiplier to range [1.0, 2.0]', () => {
      const result = RfctlarrCalculator.calculate({
        baseMarketRatePerHa: 1000000,
        landAreaHa: 1.0,
        isRural: true,
        ruralMultiplier: 3.0, // exceeds max
      });

      expect(result.multiplier).toBe(2.0);
    });

    it('should handle zero area gracefully', () => {
      const result = RfctlarrCalculator.calculate({
        baseMarketRatePerHa: 2000000,
        landAreaHa: 0,
        isRural: true,
      });

      expect(result.baseMarketValue).toBe(0);
      expect(result.totalAwardAmount).toBe(0);
    });

    it('should produce correct component breakdown', () => {
      const result = RfctlarrCalculator.calculate({
        baseMarketRatePerHa: 1000000,
        areaHa: 1.0,
        isRural: false,
      });

      expect(result.components).toHaveLength(5);
      expect(result.components[0].code).toBe('BASE_LAND_VALUE');
      expect(result.components[0].statutorySection).toBe('Sec. 26');
      expect(result.components[3].code).toBe('SOLATIUM');
      expect(result.components[3].statutorySection).toBe('Sec. 30(1)');
      expect(result.components[4].code).toBe('ADDITIONAL_INTEREST');
      expect(result.components[4].statutorySection).toBe('Sec. 30(3)');
    });

    it('should compute interest when monthsFromSec11ToAward is provided', () => {
      const result = RfctlarrCalculator.calculate({
        baseMarketRatePerHa: 1000000,
        areaHa: 1.0,
        isRural: false,
        monthsFromSec11ToAward: 24, // 2 years
      });

      // Interest: 12% * 1,000,000 * 2 = 240,000
      expect(result.interestMonths).toBe(24);
      expect(result.additionalInterest).toBe(240000);
    });

    it('should default assets to zero when not provided', () => {
      const result = RfctlarrCalculator.calculate({
        baseMarketRatePerHa: 1000000,
        areaHa: 1.0,
        isRural: false,
      });

      expect(result.assetsValue).toBe(0);
    });

    it('should accept both areaHa and landAreaHa aliases', () => {
      const r1 = RfctlarrCalculator.calculate({
        baseMarketRatePerHa: 1000000,
        areaHa: 2.0,
        isRural: false,
      });
      const r2 = RfctlarrCalculator.calculate({
        baseMarketRatePerHa: 1000000,
        landAreaHa: 2.0,
        isRural: false,
      });

      expect(r1.baseMarketValue).toBe(r2.baseMarketValue);
      expect(r1.totalAwardAmount).toBe(r2.totalAwardAmount);
    });
  });
});
