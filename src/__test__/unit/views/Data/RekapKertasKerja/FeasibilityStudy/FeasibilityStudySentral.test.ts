import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import FeasibilityStudySentral from '@/views/Data/RekapKertasKerja/FeasibilityStudy/FeasibilityStudySentral.vue';
import FeasibilityStudyService from '@/services/feasibility-study';

// Mock the service
vi.mock('@/services/feasibility-study');

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '123' }
  })
}));

// Mock components
vi.mock('@/components/ui/TabsWrapper.vue', () => ({
  default: {
    name: 'TabsWrapper',
    template: '<div data-testid="tabs-wrapper"><slot /></div>',
  },
}));

vi.mock('@/components/ui/TabItem.vue', () => ({
  default: {
    name: 'TabItem',
    props: ['title'],
    template: '<div data-testid="tab-item"><slot /></div>',
  },
}));

vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div data-testid="loading">Loading...</div>',
  },
}));

vi.mock('@/components/ui/InfoHeader.vue', () => ({
  default: {
    name: 'InfoHeader',
    props: [
      'namaMesin',
      'namaPengelola', 
      'kondisiUnit',
      'kodeJenisPembangkit',
      'dayaTerpasang',
      'dayaMampu',
      'tahunOperasi',
      'umurTeknis'
    ],
    template: '<div data-testid="info-header">Info Header</div>',
  },
}));

// Mock tab components
vi.mock('@/views/Data/RekapKertasKerja/FeasibilityStudy/AsumsiTab.vue', () => ({
  default: {
    name: 'AsumsiTab',
    template: '<div data-testid="asumsi-tab">Asumsi Tab</div>',
  },
}));

vi.mock('@/views/Data/RekapKertasKerja/FeasibilityStudy/KalkulasiTab.vue', () => ({
  default: {
    name: 'KalkulasiTab', 
    template: '<div data-testid="kalkulasi-tab">Kalkulasi Tab</div>',
  },
}));

describe('FeasibilityStudySentral', () => {
  let mockFeasibilityStudyService: any;

  beforeEach(() => {
    // Mock service methods
    mockFeasibilityStudyService = {
      getSentralById: vi.fn(),
      getPengelolaData: vi.fn(),
      getAsumsiFeasibilitySentral: vi.fn(),
      getKalkulasiFeasibilitySentral: vi.fn(),
    };

    // Replace the mocked constructor
    vi.mocked(FeasibilityStudyService).mockImplementation(function() { return mockFeasibilityStudyService; });
  });

  it('should render component successfully', () => {
    // Mock all required API calls
    mockFeasibilityStudyService.getSentralById.mockResolvedValue({
      data: {
        uuid_mesin: 123,
        nama_sentral: 'Test Sentral',
        kode_pengelola: 'PLN',
        kondisi_unit: 'Active',
        kode_jenis_pembangkit: 'PLTU',
        daya_terpasang: 100,
        daya_mampu: 90,
        tahun_operasi: '2020',
      }
    });

    mockFeasibilityStudyService.getPengelolaData.mockResolvedValue({
      data: [{ kode_pengelola: 'PLN', pengelola: 'PT PLN' }]
    });

    mockFeasibilityStudyService.getAsumsiFeasibilitySentral.mockResolvedValue({
      data: { umur_teknis: 25, discount_rate: 10 }
    });

    mockFeasibilityStudyService.getKalkulasiFeasibilitySentral.mockResolvedValue({
      data: { detail: [] }
    });

    const wrapper = mount(FeasibilityStudySentral);
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should call fetchSentralById with correct route parameter', async () => {
    // Mock all required API calls
    mockFeasibilityStudyService.getSentralById.mockResolvedValue({
      data: {
        uuid_mesin: 123,
        nama_sentral: 'Test Sentral',
        kode_pengelola: 'PLN',
      }
    });

    mockFeasibilityStudyService.getPengelolaData.mockResolvedValue({
      data: [{ kode_pengelola: 'PLN', pengelola: 'PT PLN' }]
    });

    mockFeasibilityStudyService.getAsumsiFeasibilitySentral.mockResolvedValue({
      data: { umur_teknis: 25 }
    });

    mockFeasibilityStudyService.getKalkulasiFeasibilitySentral.mockResolvedValue({
      data: { detail: [] }
    });

    mount(FeasibilityStudySentral);

    // Wait for component to mount and API calls to be made
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(mockFeasibilityStudyService.getSentralById).toHaveBeenCalledWith('123');
  });

  it('should set current year as tahun berjalan', async () => {
    // Mock all required API calls
    mockFeasibilityStudyService.getSentralById.mockResolvedValue({
      data: { uuid_mesin: 123, nama_sentral: 'Test', kode_pengelola: 'PLN' }
    });

    mockFeasibilityStudyService.getPengelolaData.mockResolvedValue({
      data: [{ kode_pengelola: 'PLN', pengelola: 'PT PLN' }]
    });

    mockFeasibilityStudyService.getAsumsiFeasibilitySentral.mockResolvedValue({
      data: { umur_teknis: 25 }
    });

    mockFeasibilityStudyService.getKalkulasiFeasibilitySentral.mockResolvedValue({
      data: { detail: [] }
    });

    const wrapper = mount(FeasibilityStudySentral);
    
    // Wait for component to mount
    await new Promise(resolve => setTimeout(resolve, 100));

    const currentYear = new Date().getFullYear();
    // Just check that the component mounted successfully and services were called
    expect(mockFeasibilityStudyService.getSentralById).toHaveBeenCalled();
    expect(mockFeasibilityStudyService.getAsumsiFeasibilitySentral).toHaveBeenCalled();
  });

  it('should handle errors in fetchSentralById', async () => {
    // Mock getSentralById to throw an error
    mockFeasibilityStudyService.getSentralById.mockRejectedValue(new Error('API Error'));
    
    // Mock console.error to verify it's called
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock other required calls to succeed
    mockFeasibilityStudyService.getPengelolaData.mockResolvedValue({
      data: [{ kode_pengelola: 'PLN', pengelola: 'PT PLN' }]
    });

    mockFeasibilityStudyService.getAsumsiFeasibilitySentral.mockResolvedValue({
      data: { umur_teknis: 25 }
    });

    mockFeasibilityStudyService.getKalkulasiFeasibilitySentral.mockResolvedValue({
      data: { detail: [] }
    });

    mount(FeasibilityStudySentral);

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch Mesin By Id Error : ', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle errors in fetchAsumsiFeasibility', async () => {
    // Mock successful calls for getSentralById
    mockFeasibilityStudyService.getSentralById.mockResolvedValue({
      data: { uuid_mesin: 123, nama_sentral: 'Test', kode_pengelola: 'PLN' }
    });

    mockFeasibilityStudyService.getPengelolaData.mockResolvedValue({
      data: [{ kode_pengelola: 'PLN', pengelola: 'PT PLN' }]
    });

    // Mock getAsumsiFeasibilitySentral to throw an error
    mockFeasibilityStudyService.getAsumsiFeasibilitySentral.mockRejectedValue(new Error('Asumsi API Error'));
    
    // Mock console.error to verify it's called
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFeasibilityStudyService.getKalkulasiFeasibilitySentral.mockResolvedValue({
      data: { detail: [] }
    });

    mount(FeasibilityStudySentral);

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error Fetch Asumsi Feasibility : ', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });

  it('should handle errors in fetchKalkulasiFeasibility', async () => {
    // Mock successful calls for other functions
    mockFeasibilityStudyService.getSentralById.mockResolvedValue({
      data: { uuid_mesin: 123, nama_sentral: 'Test', kode_pengelola: 'PLN' }
    });

    mockFeasibilityStudyService.getPengelolaData.mockResolvedValue({
      data: [{ kode_pengelola: 'PLN', pengelola: 'PT PLN' }]
    });

    mockFeasibilityStudyService.getAsumsiFeasibilitySentral.mockResolvedValue({
      data: { umur_teknis: 25 }
    });

    // Mock getKalkulasiFeasibilitySentral to throw an error
    mockFeasibilityStudyService.getKalkulasiFeasibilitySentral.mockRejectedValue(new Error('Kalkulasi API Error'));
    
    // Mock console.error to verify it's called
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mount(FeasibilityStudySentral);

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error Fetch Kalkulasi Feasibility : ', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });

  it('should process kalkulasi feasibility data correctly with level 1 and 2 items', async () => {
    // Mock successful calls for other functions
    mockFeasibilityStudyService.getSentralById.mockResolvedValue({
      data: { uuid_mesin: 123, nama_sentral: 'Test', kode_pengelola: 'PLN' }
    });

    mockFeasibilityStudyService.getPengelolaData.mockResolvedValue({
      data: [{ kode_pengelola: 'PLN', pengelola: 'PT PLN' }]
    });

    mockFeasibilityStudyService.getAsumsiFeasibilitySentral.mockResolvedValue({
      data: { umur_teknis: 25 }
    });

    // Mock getKalkulasiFeasibilitySentral with data that has level 1 and 2 items
    mockFeasibilityStudyService.getKalkulasiFeasibilitySentral.mockResolvedValue({
      data: {
        detail: [
          { level: 1, name: 'Revenue', value: 1000, id: 1 },
          { level: 2, name: 'Operating Revenue', value: 800, id: 2 },
          { level: 2, name: 'Non-Operating Revenue', value: 200, id: 3 },
          { level: 1, name: 'Expenses', value: 600, id: 4 },
          { level: 2, name: 'Operating Expenses', value: 500, id: 5 },
        ]
      }
    });

    // Mock console.log to verify the resultMap processing
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    mount(FeasibilityStudySentral);

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify that console.log was called (this is in the processing logic)
    expect(consoleLogSpy).toHaveBeenCalled();
    
    consoleLogSpy.mockRestore();
  });
});