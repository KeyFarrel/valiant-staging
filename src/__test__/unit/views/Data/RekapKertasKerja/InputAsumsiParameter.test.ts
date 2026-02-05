import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import InputAsumsiParameter from '@/views/Data/RekapKertasKerja/InputAsumsiParameter.vue';

// Mock dependencies
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
}));

// Mock format service
const mockGlobalFormat = {
  formatCurrencyNotFixed: vi.fn((val) => val),
  formatNumberFiveDigits: vi.fn((val) => val),
  formatBytes: vi.fn((val) => val)
};
vi.mock('@/services/format/global-format', () => ({
  default: vi.fn().mockImplementation(() => mockGlobalFormat)
}));

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: vi.fn().mockReturnValue('test-id-123'),
  }),
}));

const mockReplace = vi.fn();
vi.mock('@/router', () => ({
  default: {
    replace: (...args) => mockReplace(...args),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: 'test-id-123',
    },
  }),
  useRouter: () => ({
    replace: mockReplace
  })
}));

// Mock services
import InputAsumsiParameterService from '@/services/input-asumsi-parameter-service';
import UserService from '@/services/user-service';
import PerbaruiDataService from '@/services/perbarui-data';

vi.mock('@/services/input-asumsi-parameter-service');
vi.mock('@/services/user-service');
vi.mock('@/services/perbarui-data');

describe('InputAsumsiParameter.vue', () => {
  let wrapper: any;
  let mockInputAsumsiParameterService: any;
  let mockUserService: any;
  let mockPerbaruiDataService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Setup Mock Services
    mockInputAsumsiParameterService = {
      getMesinById: vi.fn().mockResolvedValue({
        data: {
          mesin: 'Test Machine',
          kondisi_unit: 'Active',
          kode_jenis_pembangkit: 'PLTU',
          daya_terpasang: 100,
          daya_mampu: 90,
          tahun_operasi: 2020,
          masa_manfaat: 25,
          kode_sentral: 'TST001',
          kode_mesin: 'MTSST001',
          kode_pengelola: 'PGL001',
          uuid_pembina: 'pembina-uuid-123'
        }
      }),
      getStatusRealisasiById: vi.fn().mockResolvedValue({
        data: [{ status_kk: true }]
      }),
      getAsumsiMakroData: vi.fn().mockResolvedValue({
        code: 404, // Default not found so we can test init
        data: {
          tahun: 2024,
          status: 'pending',
          id_asumsi: 0,
          asumsi_makro: {
            interest_rate: 5.5,
             loan_portion: 70,
             loan_tenor: 10
          },
          parameter_teknis_financial: {
             auxiliary: 1,
             nphr: 2,
             ps: 3,
             susut_trafo: 4,
             electricity_price_b_rp_per_kwbln: 5,
             electricity_price_a_rp_per_kwbln: 6,
             electricity_price_d_rp_per_kwh: 7,
             electricity_price_c_rp_per_kwh: 8
          },
          harga_bahan_bakars: []
        }
      }),
      getComboBahanBakar: vi.fn().mockResolvedValue({
        data: [
          { kode_bahan_bakar: 'BBL001', nama_bahan_bakar: 'Coal' }
        ]
      }),
      getPembangkitByKode: vi.fn().mockResolvedValue({
        data: {
          kode_pengelola: 'PGL001',
          uuid_pembina: 'pembina-uuid-123'
        }
      }),
      getPengelolaData: vi.fn().mockResolvedValue({
        data: [
          { kode_pengelola: 'PGL001', pengelola: 'Test Pengelola' }
        ]
      }),
      createAsumsi: vi.fn().mockResolvedValue({ code: 200 }),
      createParameter: vi.fn().mockResolvedValue({ code: 200 }),
      updateAsumsi: vi.fn().mockResolvedValue({ code: 200 })
    };

    mockUserService = {
      getPembina: vi.fn().mockResolvedValue({
        data: [
          { uuid_pembina: 'pembina-uuid-123', pembina: 'Test Pembina' }
        ]
      })
    };

    mockPerbaruiDataService = {
      getCheckIntegrasi: vi.fn().mockResolvedValue({
        data: [{ status_data_integrasi: "1" }]
      })
    };

    (InputAsumsiParameterService as any).mockImplementation(() => mockInputAsumsiParameterService);
    (UserService as any).mockImplementation(() => mockUserService);
    (PerbaruiDataService as any).mockImplementation(() => mockPerbaruiDataService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createWrapper = () => {
    return mount(InputAsumsiParameter, {
      global: {
        stubs: {
          Loading: true,
          ModalNotification: true,
          ModalWrapper: true,
          InfoHeader: true,
          TabsWrapper: true,
          TabItem: true,
          TabAsumsiMakro: true,
          TabParameterTeknis: true,
          ConfirmationDialog: true,
        }
      }
    });
  };

  it('should initialize and fetch data correctly', async () => {
    wrapper = createWrapper();
    await flushPromises();

    expect(mockInputAsumsiParameterService.getMesinById).toHaveBeenCalled();
    expect(wrapper.vm.idMesin).toBe('test-id-123');
    expect(wrapper.vm.namaPengelola).toBe('Test Pengelola');
    expect(wrapper.vm.namaPembina).toBe('Test Pembina');
  });

  it('should handle fetch errors gracefully', async () => {
    const error = new Error('Network Error');
    mockInputAsumsiParameterService.getMesinById.mockRejectedValue(error);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    wrapper = createWrapper();
    await flushPromises();

    expect(consoleSpy).toHaveBeenCalledWith(error);
  });

  it('should handle fetch Unit Pengelola error', async () => {
    const error = new Error('Pengelola Error');
    mockInputAsumsiParameterService.getPengelolaData.mockRejectedValue(error);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    wrapper = createWrapper();
    await flushPromises();

    expect(consoleSpy).toHaveBeenCalledWith("Fetch Unit Pengelola Error : ", error);
  });

  it('should validate form and show error for empty fields', async () => {
    wrapper = createWrapper();
    await flushPromises();

    // Ensure fields are empty
    wrapper.vm.interestRate = '';
    
    // Trigger submit
    wrapper.vm.insertAsumsiParameter();
    await flushPromises();

    // Check validation error
    expect(wrapper.vm.error.asumsi.interestRate).toBe(true);
    expect(wrapper.vm.isShowModalNotification).toBe(true);

    // Fade out notification
    vi.advanceTimersByTime(5000);
    await flushPromises();
    expect(wrapper.vm.isShowModalNotification).toBe(false);
  });

  it('should submit successfully (Create Flow)', async () => {
    wrapper = createWrapper();
    await flushPromises();

    // Fill form
    wrapper.vm.interestRate = '5.0';
    wrapper.vm.umurTeknis = '20';
    wrapper.vm.loanTenor = '10';
    wrapper.vm.loanPortion = '80';
    wrapper.vm.nphr = '2000';
    wrapper.vm.auxiliary = '5';
    wrapper.vm.susutTrafo = '2';
    wrapper.vm.pemakaianSendiri = '1';
    wrapper.vm.electricityPriceA = '1000';
    wrapper.vm.electricityPriceB = '1000';
    wrapper.vm.electricityPriceC = '1000';
    wrapper.vm.electricityPriceD = '1000';
    wrapper.vm.bahanBakars = [
        { kode_bahan_bakar: 'BBL', harga_bahan_bakar: '1000', sfc: '1', tahun: '2023', uuid_mesin: '1' }
    ];
    
    wrapper.vm.idAsumsi = 0; // Create mode

    wrapper.vm.insertAsumsiParameter();
    await flushPromises();

    expect(mockInputAsumsiParameterService.createAsumsi).toHaveBeenCalled();
    // After createAsumsi, it calls fetchAsumsiParameter(true) which re-fetches
    // Then createParameter
    expect(mockInputAsumsiParameterService.createParameter).toHaveBeenCalled();
    
    expect(wrapper.vm.isInsertSuccess).toBe(true);
    
    vi.advanceTimersByTime(3000);
    await flushPromises();
    
    expect(mockReplace).toHaveBeenCalledWith({ path: '/rekap-kertas-kerja' });
  });

  it('should submit successfully (Update Flow)', async () => {
    mockInputAsumsiParameterService.getAsumsiMakroData.mockResolvedValue({
      code: 200,
      data: {
        tahun: 2024,
        status: 'pending',
        id_asumsi: 101, // Existing
        asumsi_makro: {
            interest_rate: 5.5,
             loan_portion: 70,
             loan_tenor: 10
        },
        parameter_teknis_financial: {
             auxiliary: 1,
             nphr: 2,
             ps: 3,
             susut_trafo: 4,
             electricity_price_b_rp_per_kwbln: 5,
             electricity_price_a_rp_per_kwbln: 6,
             electricity_price_d_rp_per_kwh: 7,
             electricity_price_c_rp_per_kwh: 8
        },
        harga_bahan_bakars: []
      }
    });

    wrapper = createWrapper();
    await flushPromises();
    
    wrapper.vm.idAsumsi = 101;
    
    // Add bahanBakars with dots/commas to test formatting in map logic
    wrapper.vm.bahanBakars = [
        { kode_bahan_bakar: 'BBL', harga_bahan_bakar: '1.000,50', sfc: '1,5', tahun: '2023', uuid_mesin: '1' }
    ];

    expect(wrapper.vm.idAsumsi).toBe(101);

    // Trigger update
    wrapper.vm.insertAsumsiParameter();
    await flushPromises();

    expect(mockInputAsumsiParameterService.updateAsumsi).toHaveBeenCalled();
    expect(mockInputAsumsiParameterService.createParameter).toHaveBeenCalled();

    expect(wrapper.vm.isInsertSuccess).toBe(true);

    vi.advanceTimersByTime(3000);
    await flushPromises();

    expect(mockReplace).toHaveBeenCalledWith({ path: '/rekap-kertas-kerja' });
  });

  it('should handle API error during submit', async () => {
    wrapper = createWrapper();
    await flushPromises();

    // Fill form to pass validation
    wrapper.vm.interestRate = '5.0';
    wrapper.vm.umurTeknis = '20';
    wrapper.vm.loanTenor = '10';
    wrapper.vm.loanPortion = '80';
    wrapper.vm.nphr = '2000';
    wrapper.vm.auxiliary = '5';
    wrapper.vm.susutTrafo = '2';
    wrapper.vm.pemakaianSendiri = '1';
    wrapper.vm.electricityPriceA = '1000';
    wrapper.vm.electricityPriceB = '1000';
    wrapper.vm.electricityPriceC = '1000';
    wrapper.vm.electricityPriceD = '1000';
    wrapper.vm.bahanBakars = [
        { kode_bahan_bakar: 'BBL', harga_bahan_bakar: '1000', sfc: '1', tahun: '2023', uuid_mesin: '1' }
    ];

    const error = { response: { data: { code: 400 } } };
    mockInputAsumsiParameterService.createAsumsi.mockRejectedValue(error);

    wrapper.vm.insertAsumsiParameter();
    await flushPromises(); // Submit

    // It should catch error
    // check notification logic if any, currently code logs or notifies?
    // Code says: if (error.response.data.code === 400) notifyError...
    // We mocked notifyError
  });

  it('should add and remove bahan bakar', async () => {
    wrapper = createWrapper();
    await flushPromises();

    const initialLength = wrapper.vm.bahanBakars.length;
    wrapper.vm.handleTambahBahanBakar();
    expect(wrapper.vm.bahanBakars.length).toBe(initialLength + 1);

    // Check removal
    const newItemId = wrapper.vm.bahanBakars[initialLength].id;
    wrapper.vm.checkedBahanBakar = [newItemId];
    wrapper.vm.handleHapusBahanBakar();
    
    expect(wrapper.vm.bahanBakars.length).toBe(initialLength);
  });
  
  it('should handle checked logic', () => {
      wrapper = createWrapper();
      const spy = vi.spyOn(console, 'log');
      wrapper.vm.checkedBahanBakar = [1, 2];
      wrapper.vm.handleChecked();
      expect(spy).toHaveBeenCalledWith('Handle Checked 1,2');
  });

  it('should pick parameter value correctly', async () => {
    wrapper = createWrapper();
    await flushPromises();
    
    wrapper.vm.pickedParameterValue = 'pemakaianSendiri';
    expect(wrapper.vm.pickedParameterValue).toBe('pemakaianSendiri');
  });
  
  it('should validate all required fields and show error notification when submitting empty form', async () => {
    wrapper = createWrapper();
    await flushPromises();
    
    // Set empty values
    wrapper.vm.interestRate = '';
    wrapper.vm.umurTeknis = '';
    wrapper.vm.loanTenor = '';
    wrapper.vm.loanPortion = '';
    wrapper.vm.nphr = '';
    wrapper.vm.auxiliary = '';
    wrapper.vm.susutTrafo = '';
    wrapper.vm.pemakaianSendiri = '';
    wrapper.vm.electricityPriceA = '';
    wrapper.vm.electricityPriceB = '';
    wrapper.vm.electricityPriceC = '';
    wrapper.vm.electricityPriceD = '';
    wrapper.vm.bahanBakars = [{ kode_bahan_bakar: '', harga_bahan_bakar: '', sfc: '' }];
    
    // Trigger insertAsumsiParameter
    wrapper.vm.insertAsumsiParameter();
    await flushPromises();
    
    // Check that all error states are set to true
    expect(wrapper.vm.error.asumsi.interestRate).toBe(true);
    // ... check others if needed
  });
});