import { DataStoreService } from './data-store.service';

describe('DataStoreService', () => {
  let dataStore: DataStoreService;

  beforeEach(() => {
    dataStore = new DataStoreService();
  });

  describe('Initialization', () => {
    it('should load 6 seeded projects', () => {
      const projects = dataStore.getProjects();
      expect(projects.length).toBeGreaterThanOrEqual(6);
    });

    it('should load 4 cadastral parcels', () => {
      const parcels = dataStore.getParcels();
      expect(parcels.length).toBeGreaterThanOrEqual(4);
    });

    it('should load action centre items', () => {
      const actions = dataStore.getActionCentre();
      expect(actions.urgentOverdue.length + actions.dueToday.length + actions.upcoming.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('getProjectById', () => {
    it('should find existing project', () => {
      const project = dataStore.getProjectById('proj-0084');
      expect(project).toBeDefined();
      expect(project?.name).toContain('Bharatmala');
    });

    it('should return null for non-existent project', () => {
      const project = dataStore.getProjectById('proj-nonexistent');
      expect(project).toBeNull();
    });
  });

  describe('findUserByEmail', () => {
    it('should find District Collector by email', async () => {
      const user = await dataStore.findUserByEmail('rajesh.sharma@ias.gov.in');
      expect(user).toBeDefined();
    });

    it('should return null for non-existent email', async () => {
      const user = await dataStore.findUserByEmail('nobody@gov.in');
      expect(user).toBeNull();
    });
  });

  describe('findUserByOfficerId', () => {
    it('should find Tehsildar by officerId', async () => {
      const user = await dataStore.findUserByOfficerId('UP-TEH-LKO-551');
      expect(user).toBeDefined();
    });

    it('should be case-insensitive', async () => {
      const user = await dataStore.findUserByOfficerId('up-teh-lko-551');
      expect(user).toBeDefined();
    });
  });

  describe('Grievances', () => {
    it('should create a new grievance preserving id and ticketNumber', () => {
      const grv = dataStore.createGrievance({
        id: 'grv-test-001',
        ticketNumber: 'GRV-2026-TEST',
        complainantName: 'Test Citizen',
        category: 'COMPENSATION_DISPUTE',
        description: 'Test grievance',
      });

      expect(grv.id).toBe('grv-test-001');
      expect(grv.ticketNumber).toBe('GRV-2026-TEST');
      expect(grv.status).toBe('SUBMITTED');
    });

    it('should generate id and ticketNumber if not provided', () => {
      const grv = dataStore.createGrievance({
        complainantName: 'Another Citizen',
        category: 'COMPENSATION_DISPUTE',
        description: 'Another test',
      });

      expect(grv.id).toMatch(/^grv-/);
      expect(grv.ticketNumber).toMatch(/^GRV-2026-/);
    });
  });

  describe('Awards', () => {
    it('should add and retrieve an award', () => {
      const award = {
        id: 'awd-test-1',
        awardNumber: 'AWD-TEST-001',
        parcelId: 'parcel-103-10',
        projectId: 'proj-0084',
        awardDate: new Date().toISOString(),
        totalAwardAmount: 5000000,
        solatiumAmount: 2500000,
        additionalInterest: 300000,
        approvedBy: 'Test Officer',
        status: 'APPROVED' as const,
      };

      dataStore.addAward(award);
      const awards = dataStore.getAwards();
      expect(awards.find((a) => a.id === 'awd-test-1')).toBeDefined();
    });
  });

  describe('Payments', () => {
    it('should add and retrieve a payment', () => {
      const payment = {
        id: 'pay-test-1',
        awardId: 'awd-test-1',
        parcelId: 'parcel-103-10',
        beneficiaryName: 'Test Beneficiary',
        beneficiaryAccountMasked: '••••1234',
        bankName: 'SBI',
        ifscCode: 'SBIN0001234',
        amount: 1000000,
        paymentMethod: 'PFMS_DBT' as const,
        paymentDate: new Date().toISOString(),
        transactionRef: 'UTR-TEST-001',
        status: 'COMPLETED' as const,
        remarks: 'Test payment',
      };

      dataStore.addPayment(payment);
      const payments = dataStore.getPayments();
      expect(payments.find((p) => p.transactionRef === 'UTR-TEST-001')).toBeDefined();
    });
  });

  describe('Audit Logs', () => {
    it('should add and retrieve audit log entries', () => {
      dataStore.addAuditLog('user-001', 'Test Officer', 'CREATE', 'PROJECT', 'proj-001', 'Test audit entry');
      const logs = dataStore.getAuditLogs();
      expect(logs.length).toBeGreaterThan(0);
      expect(logs.some((l) => l.remarks?.includes('Test audit entry'))).toBe(true);
    });
  });

  describe('GIS / GeoJSON', () => {
    it('should return GeoJSON FeatureCollection with Polygon geometry', () => {
      const fc = dataStore.getParcelsGeoJson();
      expect(fc.type).toBe('FeatureCollection');
      expect(fc.features.length).toBeGreaterThan(0);
      expect(fc.features[0].geometry.type).toBe('Polygon');
    });
  });
});
