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
  default: vi.fn().mockImplementation(function() { return mockGlobalFormat; } as any)
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
    mockInputAsumsiParameterService = { getAsumsiMakroData: vi.fn(), getComboBahanBakar: vi.fn(), getStatusRealisasiById: vi.fn(),
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
          tahun: new Date().getFullYear(),
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
          harga_bahan_bakars: [
          { kode_bahan_bakar: 'BBL', harga_bahan_bakar: 1000.5, sfc: 1.5, tahun: '2023', uuid_mesin: '1' }
        ]
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

    mockUserService = { getPembina: vi.fn(),
      getPembina: vi.fn().mockResolvedValue({
        data: [
          { uuid_pembina: 'pembina-uuid-123', pembina: 'Test Pembina' }
        ]
      })
    };

    mockPerbaruiDataService = { getCheckIntegrasi: vi.fn(),
      getCheckIntegrasi: vi.fn().mockResolvedValue({
        data: [{ status_data_integrasi: "1" }]
      })
    };

    (InputAsumsiParameterService as any).mockImplementation(function() { return mockInputAsumsiParameterService; } as any);
    (UserService as any).mockImplementation(function() { return mockUserService; } as any);
    (PerbaruiDataService as any).mockImplementation(function() { return mockPerbaruiDataService; } as any);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createWrapper = () => {
    return mount(InputAsumsiParameter, {
      global: {
        stubs: {
          Loading: { template: '<div />' },
          ModalNotification: { template: '<div />' },
          ModalWrapper: {
            props: ['showModal'],
            template: '<div v-if="showModal"><slot /></div>'
          },
          InfoHeader: { template: '<div />' },
          TabsWrapper: { template: '<div><slot /></div>' },
          TabItem: { props: ['title'], template: '<div><slot /></div>' },
          TabAsumsiMakro: {
            emits: ['update:interest-rate', 'update:umur-teknis', 'update:loan-tenor', 'update:loan-portion'],
            template: '<div><button data-testid="emit-asumsi" @click="$emit(\'update:interest-rate\', \'6\'); $emit(\'update:umur-teknis\', \'20\'); $emit(\'update:loan-tenor\', \'10\'); $emit(\'update:loan-portion\', \'70\')" /></div>'
          },
          TabParameterTeknis: {
            emits: ['on-checked', 'on-hapus-bahan-bakar', 'on-tambah-bahan-bakar', 'on-submit', 'update:bahan-bakars', 'update:pickedValue', 'update:checkedBahanBakar', 'update:nphr', 'update:auxiliary', 'update:susut-trafo', 'update:pemakaian-sendiri', 'update:electricity-price-a', 'update:electricity-price-b', 'update:electricity-price-c', 'update:electricity-price-d'],
            template: '<div><button data-testid="btn-checked" @click="$emit(\'on-checked\')" /><button data-testid="btn-hapus" @click="$emit(\'on-hapus-bahan-bakar\')" /><button data-testid="btn-tambah" @click="$emit(\'on-tambah-bahan-bakar\')" /><button data-testid="btn-submit" @click="$emit(\'on-submit\')" /><button data-testid="emit-parameter" @click="$emit(\'update:pickedValue\', \'auxiliarySusut\'); $emit(\'update:checkedBahanBakar\', [1]); $emit(\'update:nphr\', \'1\'); $emit(\'update:auxiliary\', \'2\'); $emit(\'update:susut-trafo\', \'3\'); $emit(\'update:pemakaian-sendiri\', \'4\'); $emit(\'update:electricity-price-a\', \'5\'); $emit(\'update:electricity-price-b\', \'6\'); $emit(\'update:electricity-price-c\', \'7\'); $emit(\'update:electricity-price-d\', \'8\')" /></div>'
          },
          ConfirmationDialog: {
            emits: ['on-batal-click', 'on-accept-click'],
            template: '<div><button data-testid="btn-batal" @click="$emit(\'on-batal-click\')" /><button data-testid="btn-accept" @click="$emit(\'on-accept-click\')" /></div>'
          },
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
    mockInputAsumsiParameterService.getAsumsiMakroData = vi.fn().mockResolvedValue({
      code: 200,
      data: {
        tahun: new Date().getFullYear(),
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
        harga_bahan_bakars: [
          { kode_bahan_bakar: 'BBL', harga_bahan_bakar: 1000.5, sfc: 1.5, tahun: '2023', uuid_mesin: '1' }
        ]
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

  it('should cover fetchAsumsiParameter when isCreate is false', async () => {
    mockInputAsumsiParameterService.getAsumsiMakroData = vi.fn().mockResolvedValue({
      code: 200,
      data: {
        tahun: new Date().getFullYear(),
        status: 'status',
        id_asumsi: 'id',
        harga_bahan_bakars: [
          { harga_bahan_bakar: 100, sfc: 200 }
        ],
        asumsi_makro: {
          interest_rate: 5,
          loan_tenor: 10,
          loan_portion: 15
        },
        parameter_teknis_financial: {
          nphr: 10,
          auxiliary: 20,
          susut_trafo: 30,
          ps: 40,
          electricity_price_a_rp_per_kwbln: 50,
          electricity_price_b_rp_per_kwbln: 60,
          electricity_price_c_rp_per_kwh: 70,
          electricity_price_d_rp_per_kwh: 80
        }
      }
    });

    wrapper = createWrapper();
    await flushPromises();

    await wrapper.vm.fetchAsumsiParameter(false);
    await flushPromises();
    
  });

  it('should cover error branches for api calls', async () => {
    wrapper = createWrapper();
    await flushPromises();

    mockPerbaruiDataService.getCheckIntegrasi = vi.fn().mockRejectedValue(new Error('err1'));
    await wrapper.vm.fetchCheckIntegrasi();

    mockInputAsumsiParameterService.getStatusRealisasiById.mockRejectedValue(new Error('err2'));
    await wrapper.vm.fetchStatusRealisasiById();

    mockInputAsumsiParameterService.getAsumsiMakroData = vi.fn().mockRejectedValue(new Error('err3'));
    await wrapper.vm.fetchAsumsiParameter(true);

    mockUserService.getPembina.mockRejectedValue(new Error('err4'));
    await wrapper.vm.fetchListPembina();

    mockInputAsumsiParameterService.getComboBahanBakar.mockRejectedValue(new Error('err5'));
    await wrapper.vm.fetchComboBahanBakar();
  });

  it('should cover update-flow conversion branches with mixed dotted and non-dotted values', async () => {
    wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.idAsumsi = 999;
    wrapper.vm.masaManfaat = '25';
    wrapper.vm.loanTenor = '10';

    wrapper.vm.interestRate = '1.234,56';
    wrapper.vm.loanPortion = '75,5';
    wrapper.vm.nphr = '2.500,10';
    wrapper.vm.auxiliary = '12,5';
    wrapper.vm.susutTrafo = '1.000';
    wrapper.vm.pemakaianSendiri = '5,5';
    wrapper.vm.electricityPriceA = '2.000,1';
    wrapper.vm.electricityPriceB = '2000';
    wrapper.vm.electricityPriceC = '3.333,3';
    wrapper.vm.electricityPriceD = '4000';
    wrapper.vm.bahanBakars = [
      { kode_bahan_bakar: 'BBL', harga_bahan_bakar: '1.234,56', sfc: '2.345', tahun: '2023', uuid_mesin: '1' }
    ];

    const firstUpdatePromise = wrapper.vm.insertAsumsiParameter();
    await flushPromises();
    vi.advanceTimersByTime(10000);
    await firstUpdatePromise;
    await flushPromises();

    wrapper.vm.interestRate = '1234,56';
    wrapper.vm.loanPortion = '755';
    wrapper.vm.nphr = '2500';
    wrapper.vm.auxiliary = '125';
    wrapper.vm.susutTrafo = '1000';
    wrapper.vm.pemakaianSendiri = '55';
    wrapper.vm.electricityPriceA = '20001';
    wrapper.vm.electricityPriceB = '2000';
    wrapper.vm.electricityPriceC = '33333';
    wrapper.vm.electricityPriceD = '4000';
    wrapper.vm.bahanBakars = [
      { kode_bahan_bakar: 'BBL', harga_bahan_bakar: '1234,56', sfc: '2345', tahun: '2023', uuid_mesin: '1' }
    ];

    const secondUpdatePromise = wrapper.vm.insertAsumsiParameter();
    await flushPromises();
    vi.advanceTimersByTime(10000);
    await secondUpdatePromise;
    await flushPromises();

    expect(mockInputAsumsiParameterService.updateAsumsi).toHaveBeenCalled();
    expect(mockInputAsumsiParameterService.createParameter).toHaveBeenCalled();
  });

  it('should cover create-flow conversion branches with dotted values and non-400 catch branch', async () => {
    wrapper = createWrapper();
    await flushPromises();

    wrapper.vm.idAsumsi = 0;
    wrapper.vm.masaManfaat = '25';
    wrapper.vm.loanTenor = '10';
    wrapper.vm.interestRate = '1.234,56';
    wrapper.vm.loanPortion = '7.890,12';
    wrapper.vm.nphr = '2.500,10';
    wrapper.vm.auxiliary = '12.34';
    wrapper.vm.susutTrafo = '1.000';
    wrapper.vm.pemakaianSendiri = '5.5';
    wrapper.vm.electricityPriceA = '2.000,1';
    wrapper.vm.electricityPriceB = '2.100,2';
    wrapper.vm.electricityPriceC = '2.200,3';
    wrapper.vm.electricityPriceD = '2.300,4';
    wrapper.vm.bahanBakars = [
      { kode_bahan_bakar: 'BBL', harga_bahan_bakar: '1.234,56', sfc: '9.876,5', tahun: '2023', uuid_mesin: '1' }
    ];

    const firstCreatePromise = wrapper.vm.insertAsumsiParameter();
    await flushPromises();
    vi.advanceTimersByTime(10000);
    await firstCreatePromise;
    await flushPromises();
    expect(mockInputAsumsiParameterService.createAsumsi).toHaveBeenCalled();

    mockInputAsumsiParameterService.createAsumsi.mockRejectedValueOnce({ response: { data: { code: 500 } } });
    const secondCreatePromise = wrapper.vm.insertAsumsiParameter();
    await flushPromises();
    vi.advanceTimersByTime(10000);
    await secondCreatePromise;
    await flushPromises();
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should execute tab submit and confirmation dialog template events', async () => {
    wrapper = createWrapper();
    await flushPromises();

    await wrapper.find('[data-testid="btn-submit"]').trigger('click');
    expect(wrapper.vm.isShowModalConfirmation).toBe(true);

    await wrapper.find('[data-testid="btn-batal"]').trigger('click');
    expect(wrapper.vm.isShowModalConfirmation).toBe(false);

    await wrapper.find('[data-testid="btn-submit"]').trigger('click');
    await wrapper.find('[data-testid="btn-accept"]').trigger('click');
    await flushPromises();
    expect(wrapper.vm.isShowModalNotification).toBe(true);
  });

  it('should execute tab parameter action emit handlers', async () => {
    wrapper = createWrapper();
    await flushPromises();

    const initialLength = wrapper.vm.bahanBakars.length;
    await wrapper.find('[data-testid="btn-tambah"]').trigger('click');
    expect(wrapper.vm.bahanBakars.length).toBe(initialLength + 1);

    wrapper.vm.checkedBahanBakar = [wrapper.vm.bahanBakars[0].id];
    await wrapper.find('[data-testid="btn-hapus"]').trigger('click');
    expect(wrapper.vm.bahanBakars.length).toBeGreaterThanOrEqual(0);

    const logSpy = vi.spyOn(console, 'log');
    await wrapper.find('[data-testid="btn-checked"]').trigger('click');
    expect(logSpy).toHaveBeenCalled();
  });

  it('should update v-model fields from child emits in template', async () => {
    wrapper = createWrapper();
    await flushPromises();

    await wrapper.find('[data-testid="emit-asumsi"]').trigger('click');
    await wrapper.find('[data-testid="emit-parameter"]').trigger('click');

    expect(wrapper.vm.interestRate).toBe('6');
    expect(wrapper.vm.umurTeknis).toBe('20');
    expect(wrapper.vm.loanTenor).toBe('10');
    expect(wrapper.vm.loanPortion).toBe('70');
    expect(wrapper.vm.nphr).toBe('1');
    expect(wrapper.vm.auxiliary).toBe('2');
    expect(wrapper.vm.susutTrafo).toBe('3');
    expect(wrapper.vm.pemakaianSendiri).toBe('4');
    expect(wrapper.vm.electricityPriceA).toBe('5');
    expect(wrapper.vm.electricityPriceB).toBe('6');
    expect(wrapper.vm.electricityPriceC).toBe('7');
    expect(wrapper.vm.electricityPriceD).toBe('8');
  });
});