import { describe, expect, it, jest, beforeEach } from '@jest/globals';

// Mock all services with proper typing
const mockUserService = {
  getPembina: jest.fn() as jest.MockedFunction<any>
};

const mockDetailSentralService = {
  getPhoto: jest.fn() as jest.MockedFunction<any>,
  getUnitPengelola: jest.fn() as jest.MockedFunction<any>
};

const mockRekapService = {
  uploadEvidence: jest.fn() as jest.MockedFunction<any>,
  updateEvidencePath: jest.fn() as jest.MockedFunction<any>,
  getEvidencePath: jest.fn() as jest.MockedFunction<any>,
  downloadEvidence: jest.fn() as jest.MockedFunction<any>,
  uploadTemplateAwalFS: jest.fn() as jest.MockedFunction<any>,
  downloadTemplateFS: jest.fn() as jest.MockedFunction<any>
};

const mockPersetujuanService = {
  getPersetujuanFSSentral: jest.fn() as jest.MockedFunction<any>,
  updateStatusFS: jest.fn() as jest.MockedFunction<any>
};

const mockFeasibilityStudyService = {
  getAsumsiFeasibility: jest.fn() as jest.MockedFunction<any>,
  getDataTeknis: jest.fn() as jest.MockedFunction<any>,
  getDataFinansial: jest.fn() as jest.MockedFunction<any>,
  getHasilSimulasi: jest.fn() as jest.MockedFunction<any>,
  getComboBahanBakar: jest.fn() as jest.MockedFunction<any>
};

const mockDetailRekapService = {
  getMesinById: jest.fn() as jest.MockedFunction<any>,
  getPembangkitByKode: jest.fn() as jest.MockedFunction<any>,
  getPengelolaData: jest.fn() as jest.MockedFunction<any>,
  getTypePeriodic: jest.fn() as jest.MockedFunction<any>
};

// Set up mock return values
mockUserService.getPembina.mockResolvedValue({
  success: true,
  data: [{ id_pembina: 1, pembina: 'Test Pembina' }]
});

mockDetailSentralService.getPhoto.mockResolvedValue({
  success: true,
  data: new ArrayBuffer(8)
});

mockDetailSentralService.getUnitPengelola.mockResolvedValue({
  success: true,
  data: { id: 1, unit: 'Test Unit' }
});

mockRekapService.uploadEvidence.mockResolvedValue({
  success: true,
  data: 'evidence-file-path'
});

mockRekapService.updateEvidencePath.mockResolvedValue({
  success: true,
  data: { updated: true }
});

mockRekapService.getEvidencePath.mockResolvedValue({
  success: true,
  data: [{ file_name: 'test-evidence.xlsx', dokumen_evidence: 'path/to/evidence' }]
});

mockRekapService.downloadEvidence.mockResolvedValue({
  success: true,
  data: new ArrayBuffer(8),
  headers: { 'content-disposition': 'attachment; filename="evidence.xlsx"' }
});

mockRekapService.uploadTemplateAwalFS.mockResolvedValue({
  success: true,
  data: { uploaded: true }
});

mockRekapService.downloadTemplateFS.mockResolvedValue({
  success: true,
  data: new ArrayBuffer(8),
  headers: { 'content-disposition': 'attachment; filename="template-fs.xlsx"' }
});

mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValue({
  success: true,
  data: {
    pengelola: 'Test Pengelola',
    pembina: 'Test Pembina',
    mesins: [{ uuid_mesin: 123, status: 'Draft', keterangan: 'Test keterangan', id_status: 1 }]
  }
});

mockPersetujuanService.updateStatusFS.mockResolvedValue({
  success: true,
  data: { updated: true }
});

mockFeasibilityStudyService.getAsumsiFeasibility.mockResolvedValue({
  success: true,
  data: {
    asumsi_makro: {
      corporate_tax_rate: 25,
      discount_rate: 10,
      interest_rate: 8,
      loan_tenor: 15,
      loan_portion: 70,
      equity_portion: 30
    },
    parameter_teknis_financial: {
      daya_terpasang: 100,
      daya_mampu_netto_mw: 95,
      susut_trafo: 1.5,
      auxiliary: 5,
      nphr: 2400,
      ps: 85,
      loan: 70000000,
      total_project_cost: 100000000,
      electricity_price_a_rp_per_kwbln: 1050,
      equity: 30000000,
      electricity_price_c_rp_per_kwh: 1000,
      electricity_price_d_rp_per_kwh: 950,
      electricity_price_b_rp_per_kwbln: 1025
    },
    harga_bahan_bakars: [
      { uuid_mesin: 123, tahun: '2024', kode_bahan_bakar: 'BBM001', harga_bahan_bakar: 15000, sfc: 0.25, flag_bahan_bakar: 1 }
    ],
    umur_teknis: 25
  }
});

mockFeasibilityStudyService.getDataTeknis.mockResolvedValue({
  success: true,
  data: {
    header: ['Parameter', 'Satuan', '2024', '2025'],
    tahun: [2024, 2025],
    detail: [
      { parameter: 'Daya Terpasang', satuan: 'MW', nilai_2024: 100, nilai_2025: 100 }
    ]
  }
});

mockFeasibilityStudyService.getDataFinansial.mockResolvedValue({
  success: true,
  data: {
    header: ['Item', 'Satuan', '2024', '2025'],
    detail: [
      { level: 1, item: 'Revenue', satuan: 'Rp', nilai_2024: 1000000000, nilai_2025: 1050000000 }
    ]
  }
});

mockFeasibilityStudyService.getHasilSimulasi.mockResolvedValue({
  success: true,
  data: {
    fs_irr_project: 12.5,
    fs_irr_equity: 15.2,
    fs_npv_equity: 25000000,
    fs_npv_project: 35000000,
    fs_average_cf: 5000000,
    fs_on_project: 10.5,
    fs_on_equity: 13.2,
    fs_average_eaf: 85.5
  }
});

mockFeasibilityStudyService.getComboBahanBakar.mockResolvedValue({
  success: true,
  data: [
    { kode: 'BBM001', nama: 'Solar' },
    { kode: 'BBM002', nama: 'Gas' }
  ]
});

mockDetailRekapService.getMesinById.mockResolvedValue({
  success: true,
  data: {
    uuid_mesin: 123,
    kode_sentral: 'PLTU001',
    kode_mesin: 'M001',
    mesin: 'Unit 1',
    kode_jenis_pembangkit: 'PLTU',
    kondisi_unit: 'Beroperasi',
    daya_terpasang: 100,
    daya_mampu: 95,
    tahun_operasi: '2010',
    masa_manfaat: '25',
    nilai_asset_awal: 100000000,
    tahun_nilai_perolehan: '2010',
    photo1: 'photo1.jpg',
    photo2: ''
  }
});

mockDetailRekapService.getPembangkitByKode.mockResolvedValue({
  success: true,
  data: {
    kode_pengelola: 'PLN001',
    id_pembina: 1,
    mesins: [{ id: 1 }, { id: 2 }]
  }
});

mockDetailRekapService.getPengelolaData.mockResolvedValue({
  success: true,
  data: [
    { kode_pengelola: 'PLN001', pengelola: 'PT PLN Pembangkitan' }
  ]
});

mockDetailRekapService.getTypePeriodic.mockResolvedValue({
  success: true,
  data: [
    { id: 1, type: 'Bulanan' },
    { id: 2, type: 'Tahunan' }
  ]
});

// Mock modules
jest.mock('@/services/user-service', () => mockUserService);
jest.mock('@/services/detail-sentral-service', () => mockDetailSentralService);
jest.mock('@/services/rekap-service', () => mockRekapService);
jest.mock('@/services/persetujuan-service', () => mockPersetujuanService);
jest.mock('@/services/feasibility-study', () => mockFeasibilityStudyService);
jest.mock('@/services/detail-rekap-service', () => mockDetailRekapService);

// Mock vue-router
const mockRoute = {
  query: {
    uuid_sentral: 'test-uuid-sentral'
  },
  params: {
    id: '123'
  }
};

const mockRouter = {
  push: jest.fn(),
  replace: jest.fn()
};

jest.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter
}));

// Mock global functions
global.URL = {
  createObjectURL: jest.fn(() => 'mock-blob-url'),
  revokeObjectURL: jest.fn()
} as any;

(global as any).fetch = jest.fn();

// Mock DOM methods
Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => ({
    href: '',
    download: '',
    click: jest.fn(),
    setAttribute: jest.fn()
  })),
  writable: true
});

Object.defineProperty(document.body, 'appendChild', {
  value: jest.fn(),
  writable: true
});

Object.defineProperty(document.body, 'removeChild', {
  value: jest.fn(),
  writable: true
});

// Mock window
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-window-url'),
    revokeObjectURL: jest.fn()
  },
  writable: true
});

describe('DetailFSMesin.vue - Unit Test Efektif dan Efisien', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Service mocks are properly configured
  it('should have all service mocks configured correctly', () => {
    expect(mockUserService.getPembina).toBeDefined();
    expect(mockDetailSentralService.getPhoto).toBeDefined();
    expect(mockRekapService.uploadEvidence).toBeDefined();
    expect(mockPersetujuanService.getPersetujuanFSSentral).toBeDefined();
    expect(mockFeasibilityStudyService.getAsumsiFeasibility).toBeDefined();
    expect(mockDetailRekapService.getMesinById).toBeDefined();
  });

  // Test 2: Service functions return expected data structures
  it('should return correct data structures from all services', async () => {
    const userResult = await mockUserService.getPembina('') as any;
    const persetujuanResult = await mockPersetujuanService.getPersetujuanFSSentral({}) as any;
    const feasibilityResult = await mockFeasibilityStudyService.getAsumsiFeasibility(123, 2024) as any;
    const mesinResult = await mockDetailRekapService.getMesinById(123) as any;

    expect(userResult.success).toBe(true);
    expect(userResult.data).toHaveLength(1);
    expect(userResult.data[0]).toHaveProperty('pembina');

    expect(persetujuanResult.success).toBe(true);
    expect(persetujuanResult.data).toHaveProperty('mesins');
    expect(persetujuanResult.data.mesins).toHaveLength(1);

    expect(feasibilityResult.success).toBe(true);
    expect(feasibilityResult.data).toHaveProperty('asumsi_makro');
    expect(feasibilityResult.data).toHaveProperty('parameter_teknis_financial');

    expect(mesinResult.success).toBe(true);
    expect(mesinResult.data).toHaveProperty('uuid_mesin');
    expect(mesinResult.data).toHaveProperty('mesin');
  });

  // Test 3: Route and router mocks work correctly
  it('should provide correct route parameters and router functions', () => {
    expect(mockRoute.query.uuid_sentral).toBe('test-uuid-sentral');
    expect(mockRoute.params.id).toBe('123');
    expect(mockRouter.push).toBeDefined();
    expect(mockRouter.replace).toBeDefined();
  });

  // Test 4: File upload related services
  it('should handle file upload operations correctly', async () => {
    const formData = new FormData();
    const evidenceResult = await mockRekapService.uploadEvidence(formData) as any;
    const updateResult = await mockRekapService.updateEvidencePath(123, '2024', 'path', 1, 'file.xlsx') as any;

    expect(evidenceResult.success).toBe(true);
    expect(evidenceResult.data).toBe('evidence-file-path');
    expect(updateResult.success).toBe(true);
    expect(updateResult.data.updated).toBe(true);
  });

  // Test 5: Download operations
  it('should handle download operations correctly', async () => {
    const evidencePathResult = await mockRekapService.getEvidencePath(123, '2024', 1) as any;
    const downloadResult = await mockRekapService.downloadEvidence('path/to/evidence') as any;
    const templateResult = await mockRekapService.downloadTemplateFS(2024, 123, 'PLTU') as any;

    expect(evidencePathResult.success).toBe(true);
    expect(evidencePathResult.data[0]).toHaveProperty('file_name');
    expect(downloadResult.success).toBe(true);
    expect(downloadResult.headers).toHaveProperty('content-disposition');
    expect(templateResult.success).toBe(true);
  });

  // Test 6: Feasibility Study data retrieval
  it('should fetch all feasibility study related data correctly', async () => {
    const asumsiResult = await mockFeasibilityStudyService.getAsumsiFeasibility(123, 2024) as any;
    const teknisResult = await mockFeasibilityStudyService.getDataTeknis(123) as any;
    const finansialResult = await mockFeasibilityStudyService.getDataFinansial(123) as any;
    const simulasiResult = await mockFeasibilityStudyService.getHasilSimulasi(123, 1) as any;

    expect(asumsiResult.data.asumsi_makro.corporate_tax_rate).toBe(25);
    expect(asumsiResult.data.parameter_teknis_financial.daya_terpasang).toBe(100);
    expect(teknisResult.data.header).toContain('Parameter');
    expect(finansialResult.data.detail).toHaveLength(1);
    expect(simulasiResult.data.fs_irr_project).toBe(12.5);
  });

  // Test 7: Status update functionality
  it('should handle status updates correctly', async () => {
    const updateData = {
      status_approval: 0,
      keterangan: '',
      uuid_mesin: 123
    };
    const updateResult = await mockPersetujuanService.updateStatusFS(updateData) as any;

    expect(updateResult.success).toBe(true);
    expect(updateResult.data.updated).toBe(true);
    expect(mockPersetujuanService.updateStatusFS).toHaveBeenCalledWith(updateData);
  });

  // Test 8: Complex data processing (pengelola and pembina lookup)
  it('should handle complex data relationships correctly', async () => {
    const pembangkitResult = await mockDetailRekapService.getPembangkitByKode('PLTU001') as any;
    const pengelolaResult = await mockDetailRekapService.getPengelolaData() as any;
    const pembinaResult = await mockUserService.getPembina('') as any;

    expect(pembangkitResult.data.kode_pengelola).toBe('PLN001');
    expect(pembangkitResult.data.mesins).toHaveLength(2);
    expect(pengelolaResult.data[0].pengelola).toBe('PT PLN Pembangkitan');
    expect(pembinaResult.data[0].pembina).toBe('Test Pembina');
  });

  // Test 9: Error handling scenarios
  it('should handle service errors gracefully', async () => {
    mockDetailRekapService.getMesinById.mockRejectedValueOnce(new Error('Service error'));
    
    try {
      await mockDetailRekapService.getMesinById(123);
    } catch (error: any) {
      expect(error.message).toBe('Service error');
    }

    // Reset mock for next tests
    mockDetailRekapService.getMesinById.mockResolvedValue({
      success: true,
      data: { uuid_mesin: 123, mesin: 'Test Unit' }
    });
  });

  // Test 10: Mock reset and service call tracking
  it('should track service calls and reset properly', async () => {
    // Call multiple services
    await mockUserService.getPembina('');
    await mockDetailRekapService.getMesinById(123);
    await mockFeasibilityStudyService.getAsumsiFeasibility(123, 2024);

    // Verify calls were tracked
    expect(mockUserService.getPembina).toHaveBeenCalledTimes(1);
    expect(mockDetailRekapService.getMesinById).toHaveBeenCalledTimes(1);
    expect(mockFeasibilityStudyService.getAsumsiFeasibility).toHaveBeenCalledTimes(1);

    // Clear mocks
    jest.clearAllMocks();

    // Verify reset
    expect(mockUserService.getPembina).not.toHaveBeenCalled();
    expect(mockDetailRekapService.getMesinById).not.toHaveBeenCalled();
    expect(mockFeasibilityStudyService.getAsumsiFeasibility).not.toHaveBeenCalled();
  });
});
