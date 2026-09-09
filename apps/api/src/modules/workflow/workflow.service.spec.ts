import { STATUTORY_STAGE_SEQUENCE, STAGE_ROLE_GATES } from './workflow.service';

describe('Workflow State Machine (RFCTLARR 2013)', () => {
  describe('STATUTORY_STAGE_SEQUENCE', () => {
    it('should define exactly 10 stages', () => {
      expect(Object.keys(STATUTORY_STAGE_SEQUENCE)).toHaveLength(10);
    });

    it('should allow SIA -> SEC_11_PRELIMINARY only', () => {
      expect(STATUTORY_STAGE_SEQUENCE.SIA).toEqual(['SEC_11_PRELIMINARY']);
    });

    it('should allow SEC_11_PRELIMINARY -> SEC_15_HEARING only', () => {
      expect(STATUTORY_STAGE_SEQUENCE.SEC_11_PRELIMINARY).toEqual(['SEC_15_HEARING']);
    });

    it('should allow SEC_15_HEARING -> SEC_19_DECLARATION only', () => {
      expect(STATUTORY_STAGE_SEQUENCE.SEC_15_HEARING).toEqual(['SEC_19_DECLARATION']);
    });

    it('should allow SEC_19_DECLARATION -> VALUATION only', () => {
      expect(STATUTORY_STAGE_SEQUENCE.SEC_19_DECLARATION).toEqual(['VALUATION']);
    });

    it('should allow VALUATION -> SEC_23_AWARD only', () => {
      expect(STATUTORY_STAGE_SEQUENCE.VALUATION).toEqual(['SEC_23_AWARD']);
    });

    it('should allow SEC_23_AWARD -> COMPENSATION_DISBURSED only', () => {
      expect(STATUTORY_STAGE_SEQUENCE.SEC_23_AWARD).toEqual(['COMPENSATION_DISBURSED']);
    });

    it('should allow COMPENSATION_DISBURSED -> R_AND_R or SEC_38_POSSESSION', () => {
      expect(STATUTORY_STAGE_SEQUENCE.COMPENSATION_DISBURSED).toEqual(['R_AND_R', 'SEC_38_POSSESSION']);
    });

    it('should allow R_AND_R -> SEC_38_POSSESSION only', () => {
      expect(STATUTORY_STAGE_SEQUENCE.R_AND_R).toEqual(['SEC_38_POSSESSION']);
    });

    it('should allow SEC_38_POSSESSION -> COMPLETED only', () => {
      expect(STATUTORY_STAGE_SEQUENCE.SEC_38_POSSESSION).toEqual(['COMPLETED']);
    });

    it('COMPLETED should have no further transitions', () => {
      expect(STATUTORY_STAGE_SEQUENCE.COMPLETED).toEqual([]);
    });

    it('should NOT allow backward transitions (SIA -> POSSESSION)', () => {
      expect(STATUTORY_STAGE_SEQUENCE.SIA).not.toContain('SEC_38_POSSESSION');
    });

    it('should NOT allow SIA -> SEC_23_AWARD (skipping stages)', () => {
      expect(STATUTORY_STAGE_SEQUENCE.SIA).not.toContain('SEC_23_AWARD');
    });
  });

  describe('STAGE_ROLE_GATES', () => {
    it('should gate SEC_19_DECLARATION behind Collector/JointSecretary/Admin', () => {
      expect(STAGE_ROLE_GATES.SEC_19_DECLARATION).toContain('DISTRICT_COLLECTOR');
      expect(STAGE_ROLE_GATES.SEC_19_DECLARATION).toContain('SUPER_ADMIN');
    });

    it('should gate SEC_23_AWARD behind Collector/CALA/Admin', () => {
      expect(STAGE_ROLE_GATES.SEC_23_AWARD).toContain('DISTRICT_COLLECTOR');
      expect(STAGE_ROLE_GATES.SEC_23_AWARD).toContain('CALA');
    });

    it('should gate SEC_38_POSSESSION behind Collector/Admin only', () => {
      expect(STAGE_ROLE_GATES.SEC_38_POSSESSION).toContain('DISTRICT_COLLECTOR');
      expect(STAGE_ROLE_GATES.SEC_38_POSSESSION).not.toContain('TEHSILDAR');
    });

    it('should NOT allow TEHSILDAR to gate any critical stage', () => {
      Object.values(STAGE_ROLE_GATES).forEach((roles) => {
        expect(roles).not.toContain('TEHSILDAR');
      });
    });
  });
});
