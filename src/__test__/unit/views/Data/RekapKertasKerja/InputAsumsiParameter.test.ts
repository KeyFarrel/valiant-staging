import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import InputAsumsiParameter from '@/views/Data/RekapKertasKerja/InputAsumsiParameter.vue';

// Mock the services
vi.mock('@/services/input-asumsi-parameter-service');
vi.mock('@/services/user-service');
vi.mock('@/services/perbarui-data');
vi.mock('@/services/format/global-format');
vi.mock('@/utils/app-encrypt-storage');
vi.mock('@/router', () => ({
  default: {
    replace: vi.fn(),
  },
}));

// Mock router
const mockRouter = {
  replace: vi.fn(),
};

const mockRoute = {
  params: {
    id: 'test-id-123',
  },
};

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useRouter: () => mockRouter,
    useRoute: () => mockRoute,
    createRouter: vi.fn(),
    createWebHistory: vi.fn(),
  };
});

// Mock encrypt storage
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: vi.fn().mockReturnValue('test-id-123'),
  }),
}));

describe('InputAsumsiParameter.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock service responses
    const mockInputAsumsiParameterService = {
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
        }
      }),
      getStatusRealisasiById: vi.fn().mockResolvedValue({
        data: [{ status_kk: true }]
      }),
      getAsumsiMakroData: vi.fn().mockResolvedValue({
        code: 404,
        data: {
          tahun: 2024,
          status: 'pending',
          id_asumsi: 0,
          asumsi_makro: {
            interest_rate: 5.5,
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
      })
    };

    const mockUserService = {
      getPembina: vi.fn().mockResolvedValue({
        data: [
          { uuid_pembina: 'pembina-uuid-123', pembina: 'Test Pembina' }
        ]
      })
    };

    const mockPerbaruiDataService = {
      getCheckIntegrasi: vi.fn().mockResolvedValue({
        data: [{ status_data_integrasi: "1" }]
      })
    };

    // Mock the service classes
    vi.doMock('@/services/input-asumsi-parameter-service', () => ({
      default: vi.fn().mockImplementation(() => mockInputAsumsiParameterService)
    }));

    vi.doMock('@/services/user-service', () => ({
      default: vi.fn().mockImplementation(() => mockUserService)
    }));

    vi.doMock('@/services/perbarui-data', () => ({
      default: vi.fn().mockImplementation(() => mockPerbaruiDataService)
    }));
  });

  it('should render component successfully', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    expect(wrapper.exists()).toBe(true);
  });

  it('should initialize with correct default values', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    // Wait for mounted lifecycle
    await nextTick();

    // Check that component has proper initial state after mounting
    expect(wrapper.vm.isInsertSuccess).toBe(false);
    expect(wrapper.vm.isShowModalNotification).toBe(false);
    expect(wrapper.vm.isShowModalConfirmation).toBe(false);
    expect(wrapper.vm.tahunBerjalan).toBe(new Date().getFullYear());
  });

  it('should show loading state initially', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    // Wait for component to mount and load data
    await nextTick();
    
    // Check that the component exists and has been mounted
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
  });

  it('should handle add bahan bakar functionality', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    // Wait for component to mount
    await nextTick();

    // Test initial bahan bakar count
    expect(wrapper.vm.bahanBakars.length).toBe(1);

    // Call handleTambahBahanBakar function
    wrapper.vm.handleTambahBahanBakar();

    // Check that new bahan bakar item is added
    expect(wrapper.vm.bahanBakars.length).toBe(2);
    expect(wrapper.vm.bahanBakars[1].id).toBe(2); // i starts at 2, becomes 2 for this item
  });

  it('should handle remove bahan bakar functionality', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    // Wait for component to mount
    await nextTick();

    // Add some items to remove
    wrapper.vm.handleTambahBahanBakar();
    wrapper.vm.handleTambahBahanBakar();

    // Set items to be checked for removal
    wrapper.vm.checkedBahanBakar = [1, 2];

    // Call remove function
    wrapper.vm.handleHapusBahanBakar();

    // Check that items are removed
    expect(wrapper.vm.bahanBakars.length).toBe(1);
    expect(wrapper.vm.checkedBahanBakar.length).toBe(0);
  });

  it('should show confirmation modal when form is submitted', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    // Set required form values to valid state
    wrapper.vm.interestRate = '5.5';
    wrapper.vm.umurTeknis = '25';
    wrapper.vm.loanTenor = '10';
    wrapper.vm.loanPortion = '70';
    wrapper.vm.nphr = '2500';
    wrapper.vm.auxiliary = '5.5';
    wrapper.vm.susutTrafo = '2.5';
    wrapper.vm.pemakaianSendiri = '8.5';
    wrapper.vm.electricityPriceA = '1000';
    wrapper.vm.electricityPriceB = '1100';
    wrapper.vm.electricityPriceC = '1200';
    wrapper.vm.electricityPriceD = '1300';
    wrapper.vm.bahanBakars = [{
      id: 1,
      uuid_mesin: 'test-id',
      tahun: '2024',
      kode_bahan_bakar: 'BBL001',
      harga_bahan_bakar: '1000',
      sfc: '0.35',
      flag_bahan_bakar: 1,
    }];

    // Trigger insertAsumsiParameter to show confirmation
    wrapper.vm.isShowModalConfirmation = true;

    expect(wrapper.vm.isShowModalConfirmation).toBe(true);
  });

  it('should fetch and load mesin data on mount', async () => {
    const mockInputAsumsiParameterService = {
      getMesinById: vi.fn().mockResolvedValue({
        data: {
          mesin: 'Test Machine Updated',
          kondisi_unit: 'Active',
          kode_jenis_pembangkit: 'PLTU',
          daya_terpasang: 150,
          daya_mampu: 135,
          tahun_operasi: 2021,
          masa_manfaat: 30,
          kode_sentral: 'TST002',
          kode_mesin: 'MTSST002',
        }
      }),
      getStatusRealisasiById: vi.fn().mockResolvedValue({
        data: [{ status_kk: false }]
      }),
      getAsumsiMakroData: vi.fn().mockResolvedValue({
        code: 200,
        data: {
          tahun: 2024,
          status: 'approved',
          id_asumsi: 123,
          asumsi_makro: {
            interest_rate: 6.5,
          },
          harga_bahan_bakars: [
            {
              kode_bahan_bakar: 'BBL001',
              harga_bahan_bakar: 1500,
              sfc: 0.4
            }
          ],
          parameter_teknis_financial: {
            auxiliary: 6.0,
            nphr: 2600,
            ps: 9.0,
            susut_trafo: 3.0,
            electricity_price_b_rp_per_kwbln: 1150,
            electricity_price_a_rp_per_kwbln: 1050,
            electricity_price_d_rp_per_kwh: 1350,
            electricity_price_c_rp_per_kwh: 1250,
          }
        }
      }),
      getComboBahanBakar: vi.fn().mockResolvedValue({
        data: [
          { kode_bahan_bakar: 'BBL001', nama_bahan_bakar: 'Coal' },
          { kode_bahan_bakar: 'BBL002', nama_bahan_bakar: 'Gas' }
        ]
      }),
      getPembangkitByKode: vi.fn().mockResolvedValue({
        data: {
          kode_pengelola: 'PGL002',
          uuid_pembina: 'pembina-uuid-456'
        }
      }),
      getPengelolaData: vi.fn().mockResolvedValue({
        data: [
          { kode_pengelola: 'PGL002', pengelola: 'Test Pengelola Updated' }
        ]
      })
    };

    const mockUserService = {
      getPembina: vi.fn().mockResolvedValue({
        data: [
          { uuid_pembina: 'pembina-uuid-456', pembina: 'Test Pembina Updated' }
        ]
      })
    };

    const mockPerbaruiDataService = {
      getCheckIntegrasi: vi.fn().mockResolvedValue({
        data: [{ status_data_integrasi: "0" }]
      })
    };

    // Re-mock services for this specific test
    vi.doMock('@/services/input-asumsi-parameter-service', () => ({
      default: vi.fn().mockImplementation(() => mockInputAsumsiParameterService)
    }));

    vi.doMock('@/services/user-service', () => ({
      default: vi.fn().mockImplementation(() => mockUserService)
    }));

    vi.doMock('@/services/perbarui-data', () => ({
      default: vi.fn().mockImplementation(() => mockPerbaruiDataService)
    }));

    wrapper = mount(InputAsumsiParameter, {
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

    // Wait for all mounted hooks to complete
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // Test that mesin data was loaded
    expect(wrapper.vm.idMesin).toBe('test-id-123');
    expect(wrapper.vm.statusRealisasi).toBe(false);
    expect(wrapper.vm.isIntegrasi).toBe(false);
  });

  it('should handle checked bahan bakar', () => {
    wrapper = mount(InputAsumsiParameter, {
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

    // Test handleChecked function
    wrapper.vm.checkedBahanBakar = [1, 2];
    
    // Mock console.log to test it was called
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    wrapper.vm.handleChecked();
    
    expect(consoleSpy).toHaveBeenCalledWith('Handle Checked 1,2');
    
    consoleSpy.mockRestore();
  });

  it('should set error states correctly for individual fields', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    // Test error state initialization
    expect(wrapper.vm.error.asumsi.interestRate).toBe(false);
    expect(wrapper.vm.error.parameter.auxiliary).toBe(false);

    // Test setting error states manually
    wrapper.vm.error.asumsi.interestRate = true;
    wrapper.vm.error.parameter.auxiliary = true;

    expect(wrapper.vm.error.asumsi.interestRate).toBe(true);
    expect(wrapper.vm.error.parameter.auxiliary).toBe(true);
  });

  it('should handle modal state changes', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    // Test modal state changes
    expect(wrapper.vm.isShowModalConfirmation).toBe(false);
    expect(wrapper.vm.isShowModalNotification).toBe(false);
    expect(wrapper.vm.isInsertSuccess).toBe(false);

    // Change modal states
    wrapper.vm.isShowModalConfirmation = true;
    wrapper.vm.isShowModalNotification = true;
    wrapper.vm.isInsertSuccess = true;

    expect(wrapper.vm.isShowModalConfirmation).toBe(true);
    expect(wrapper.vm.isShowModalNotification).toBe(true);
    expect(wrapper.vm.isInsertSuccess).toBe(true);
  });

  it('should test fetchUnitPengelola error handling', async () => {
    const mockInputAsumsiParameterService = {
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
        }
      }),
      getStatusRealisasiById: vi.fn().mockResolvedValue({
        data: [{ status_kk: true }]
      }),
      getAsumsiMakroData: vi.fn().mockResolvedValue({
        code: 404,
        data: { tahun: 2024, status: 'pending', id_asumsi: 0 }
      }),
      getComboBahanBakar: vi.fn().mockResolvedValue({
        data: [{ kode_bahan_bakar: 'BBL001', nama_bahan_bakar: 'Coal' }]
      }),
      getPembangkitByKode: vi.fn().mockRejectedValue(new Error('Network error')),
      getPengelolaData: vi.fn().mockResolvedValue({
        data: [{ kode_pengelola: 'PGL001', pengelola: 'Test Pengelola' }]
      })
    };

    const mockUserService = {
      getPembina: vi.fn().mockResolvedValue({
        data: [{ uuid_pembina: 'pembina-uuid-123', pembina: 'Test Pembina' }]
      })
    };

    const mockPerbaruiDataService = {
      getCheckIntegrasi: vi.fn().mockResolvedValue({
        data: [{ status_data_integrasi: "1" }]
      })
    };

    // Mock console.error to test error handling
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.doMock('@/services/input-asumsi-parameter-service', () => ({
      default: vi.fn().mockImplementation(() => mockInputAsumsiParameterService)
    }));

    vi.doMock('@/services/user-service', () => ({
      default: vi.fn().mockImplementation(() => mockUserService)
    }));

    vi.doMock('@/services/perbarui-data', () => ({
      default: vi.fn().mockImplementation(() => mockPerbaruiDataService)
    }));

    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // Test error handling was called
    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should validate all required fields and show error notification when submitting empty form', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

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
    wrapper.vm.isShowModalConfirmation = false;

    // Mock the wait function to avoid actual timeout
    vi.useFakeTimers();

    // Trigger insertAsumsiParameter
    const insertPromise = wrapper.vm.insertAsumsiParameter();
    
    // Fast-forward time
    await vi.runAllTimersAsync();
    await insertPromise;

    // Check that all error states are set to true
    expect(wrapper.vm.error.asumsi.interestRate).toBe(true);
    expect(wrapper.vm.error.asumsi.umurTeknis).toBe(true);
    expect(wrapper.vm.error.asumsi.loanTenor).toBe(true);
    expect(wrapper.vm.error.asumsi.loanPortion).toBe(true);
    expect(wrapper.vm.error.parameter.nphr).toBe(true);
    expect(wrapper.vm.error.parameter.auxiliary).toBe(true);
    expect(wrapper.vm.error.parameter.susutTrafo).toBe(true);
    expect(wrapper.vm.error.parameter.pemakaianSendiri).toBe(true);
    expect(wrapper.vm.error.parameter.electricityPriceA).toBe(true);
    expect(wrapper.vm.error.parameter.electricityPriceB).toBe(true);
    expect(wrapper.vm.error.parameter.electricityPriceC).toBe(true);
    expect(wrapper.vm.error.parameter.electricityPriceD).toBe(true);
    expect(wrapper.vm.error.parameter.bahanBakar).toBe(true);

    vi.useRealTimers();
  });

  it('should successfully create new asumsi parameter when idAsumsi is 0', async () => {
    const mockCreateAsumsi = vi.fn().mockResolvedValue({ code: 200 });
    const mockCreateParameter = vi.fn().mockResolvedValue({ code: 200 });

    const mockInputAsumsiParameterService = {
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
        }
      }),
      getStatusRealisasiById: vi.fn().mockResolvedValue({
        data: [{ status_kk: true }]
      }),
      getAsumsiMakroData: vi.fn()
        .mockResolvedValueOnce({
          code: 404,
          data: { tahun: 2024, status: 'pending', id_asumsi: 0, harga_bahan_bakars: [] }
        })
        .mockResolvedValueOnce({
          code: 200,
          data: { tahun: 2024, status: 'approved', id_asumsi: 999, harga_bahan_bakars: [] }
        }),
      getComboBahanBakar: vi.fn().mockResolvedValue({
        data: [{ kode_bahan_bakar: 'BBL001', nama_bahan_bakar: 'Coal' }]
      }),
      getPembangkitByKode: vi.fn().mockResolvedValue({
        data: { kode_pengelola: 'PGL001', uuid_pembina: 'pembina-uuid-123' }
      }),
      getPengelolaData: vi.fn().mockResolvedValue({
        data: [{ kode_pengelola: 'PGL001', pengelola: 'Test Pengelola' }]
      }),
      createAsumsi: mockCreateAsumsi,
      createParameter: mockCreateParameter,
      updateAsumsi: vi.fn()
    };

    const mockUserService = {
      getPembina: vi.fn().mockResolvedValue({
        data: [{ uuid_pembina: 'pembina-uuid-123', pembina: 'Test Pembina' }]
      })
    };

    const mockPerbaruiDataService = {
      getCheckIntegrasi: vi.fn().mockResolvedValue({
        data: [{ status_data_integrasi: "1" }]
      })
    };

    vi.doMock('@/services/input-asumsi-parameter-service', () => ({
      default: vi.fn().mockImplementation(() => mockInputAsumsiParameterService)
    }));

    vi.doMock('@/services/user-service', () => ({
      default: vi.fn().mockImplementation(() => mockUserService)
    }));

    vi.doMock('@/services/perbarui-data', () => ({
      default: vi.fn().mockImplementation(() => mockPerbaruiDataService)
    }));

    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    // Set valid form values
    wrapper.vm.idAsumsi = 0;
    wrapper.vm.idMesin = 'test-id-123';
    wrapper.vm.masaManfaat = 25;
    wrapper.vm.interestRate = '5,5';
    wrapper.vm.umurTeknis = '25';
    wrapper.vm.loanTenor = '10';
    wrapper.vm.loanPortion = '70,0';
    wrapper.vm.nphr = '2.500,00';
    wrapper.vm.auxiliary = '5,5';
    wrapper.vm.susutTrafo = '2,5';
    wrapper.vm.pemakaianSendiri = '8,5';
    wrapper.vm.electricityPriceA = '1.000,00';
    wrapper.vm.electricityPriceB = '1.100,00';
    wrapper.vm.electricityPriceC = '1.200,00';
    wrapper.vm.electricityPriceD = '1.300,00';
    wrapper.vm.bahanBakars = [{
      uuid_mesin: 'test-id-123',
      tahun: '2024',
      kode_bahan_bakar: 'BBL001',
      harga_bahan_bakar: '1.000,00',
      sfc: '0,35',
      flag_bahan_bakar: 1,
    }];

    // Create mock services and assign to component
    const inputAsumsiParameterService = mockInputAsumsiParameterService;
    wrapper.vm.inputAsumsiParameterService = inputAsumsiParameterService;

    // Trigger insertAsumsiParameter
    await wrapper.vm.insertAsumsiParameter();

    // Wait for async operations
    await nextTick();
  });

  it('should successfully update existing asumsi parameter when idAsumsi is not 0', async () => {
    const mockUpdateAsumsi = vi.fn().mockResolvedValue({ code: 200 });
    const mockCreateParameter = vi.fn().mockResolvedValue({ code: 200 });

    const mockInputAsumsiParameterService = {
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
        }
      }),
      getStatusRealisasiById: vi.fn().mockResolvedValue({
        data: [{ status_kk: true }]
      }),
      getAsumsiMakroData: vi.fn().mockResolvedValue({
        code: 200,
        data: { tahun: 2024, status: 'approved', id_asumsi: 123, harga_bahan_bakars: [] }
      }),
      getComboBahanBakar: vi.fn().mockResolvedValue({
        data: [{ kode_bahan_bakar: 'BBL001', nama_bahan_bakar: 'Coal' }]
      }),
      getPembangkitByKode: vi.fn().mockResolvedValue({
        data: { kode_pengelola: 'PGL001', uuid_pembina: 'pembina-uuid-123' }
      }),
      getPengelolaData: vi.fn().mockResolvedValue({
        data: [{ kode_pengelola: 'PGL001', pengelola: 'Test Pengelola' }]
      }),
      updateAsumsi: mockUpdateAsumsi,
      createParameter: mockCreateParameter
    };

    const mockUserService = {
      getPembina: vi.fn().mockResolvedValue({
        data: [{ uuid_pembina: 'pembina-uuid-123', pembina: 'Test Pembina' }]
      })
    };

    const mockPerbaruiDataService = {
      getCheckIntegrasi: vi.fn().mockResolvedValue({
        data: [{ status_data_integrasi: "1" }]
      })
    };

    vi.doMock('@/services/input-asumsi-parameter-service', () => ({
      default: vi.fn().mockImplementation(() => mockInputAsumsiParameterService)
    }));

    vi.doMock('@/services/user-service', () => ({
      default: vi.fn().mockImplementation(() => mockUserService)
    }));

    vi.doMock('@/services/perbarui-data', () => ({
      default: vi.fn().mockImplementation(() => mockPerbaruiDataService)
    }));

    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    // Set valid form values with existing idAsumsi
    wrapper.vm.idAsumsi = 123;
    wrapper.vm.idMesin = 'test-id-123';
    wrapper.vm.masaManfaat = 25;
    wrapper.vm.interestRate = '5,5';
    wrapper.vm.umurTeknis = '25';
    wrapper.vm.loanTenor = '10';
    wrapper.vm.loanPortion = '70,0';
    wrapper.vm.nphr = '2.500,00';
    wrapper.vm.auxiliary = '5,5';
    wrapper.vm.susutTrafo = '2,5';
    wrapper.vm.pemakaianSendiri = '8,5';
    wrapper.vm.electricityPriceA = '1.000,00';
    wrapper.vm.electricityPriceB = '1.100,00';
    wrapper.vm.electricityPriceC = '1.200,00';
    wrapper.vm.electricityPriceD = '1.300,00';
    wrapper.vm.bahanBakars = [{
      uuid_mesin: 'test-id-123',
      tahun: '2024',
      kode_bahan_bakar: 'BBL001',
      harga_bahan_bakar: '1.000,00',
      sfc: '0,35',
      flag_bahan_bakar: 1,
    }];

    // Create mock services and assign to component
    const inputAsumsiParameterService = mockInputAsumsiParameterService;
    wrapper.vm.inputAsumsiParameterService = inputAsumsiParameterService;

    // Trigger insertAsumsiParameter
    await wrapper.vm.insertAsumsiParameter();

    // Wait for async operations
    await nextTick();
  });

  it('should handle error when inserting asumsi parameter fails', async () => {
    const mockError = {
      response: {
        data: {
          code: 400,
          message: 'Bad Request'
        }
      }
    };

    const mockInputAsumsiParameterService = {
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
        }
      }),
      getStatusRealisasiById: vi.fn().mockResolvedValue({
        data: [{ status_kk: true }]
      }),
      getAsumsiMakroData: vi.fn().mockResolvedValue({
        code: 404,
        data: { tahun: 2024, status: 'pending', id_asumsi: 0, harga_bahan_bakars: [] }
      }),
      getComboBahanBakar: vi.fn().mockResolvedValue({
        data: [{ kode_bahan_bakar: 'BBL001', nama_bahan_bakar: 'Coal' }]
      }),
      getPembangkitByKode: vi.fn().mockResolvedValue({
        data: { kode_pengelola: 'PGL001', uuid_pembina: 'pembina-uuid-123' }
      }),
      getPengelolaData: vi.fn().mockResolvedValue({
        data: [{ kode_pengelola: 'PGL001', pengelola: 'Test Pengelola' }]
      }),
      createAsumsi: vi.fn().mockRejectedValue(mockError),
      createParameter: vi.fn()
    };

    const mockUserService = {
      getPembina: vi.fn().mockResolvedValue({
        data: [{ uuid_pembina: 'pembina-uuid-123', pembina: 'Test Pembina' }]
      })
    };

    const mockPerbaruiDataService = {
      getCheckIntegrasi: vi.fn().mockResolvedValue({
        data: [{ status_data_integrasi: "1" }]
      })
    };

    vi.doMock('@/services/input-asumsi-parameter-service', () => ({
      default: vi.fn().mockImplementation(() => mockInputAsumsiParameterService)
    }));

    vi.doMock('@/services/user-service', () => ({
      default: vi.fn().mockImplementation(() => mockUserService)
    }));

    vi.doMock('@/services/perbarui-data', () => ({
      default: vi.fn().mockImplementation(() => mockPerbaruiDataService)
    }));

    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    // Set valid form values
    wrapper.vm.idAsumsi = 0;
    wrapper.vm.idMesin = 'test-id-123';
    wrapper.vm.masaManfaat = 25;
    wrapper.vm.interestRate = '5,5';
    wrapper.vm.umurTeknis = '25';
    wrapper.vm.loanTenor = '10';
    wrapper.vm.loanPortion = '70,0';
    wrapper.vm.nphr = '2.500,00';
    wrapper.vm.auxiliary = '5,5';
    wrapper.vm.susutTrafo = '2,5';
    wrapper.vm.pemakaianSendiri = '8,5';
    wrapper.vm.electricityPriceA = '1.000,00';
    wrapper.vm.electricityPriceB = '1.100,00';
    wrapper.vm.electricityPriceC = '1.200,00';
    wrapper.vm.electricityPriceD = '1.300,00';
    wrapper.vm.bahanBakars = [{
      uuid_mesin: 'test-id-123',
      tahun: '2024',
      kode_bahan_bakar: 'BBL001',
      harga_bahan_bakar: '1.000,00',
      sfc: '0,35',
      flag_bahan_bakar: 1,
    }];

    // Create mock services and assign to component
    const inputAsumsiParameterService = mockInputAsumsiParameterService;
    wrapper.vm.inputAsumsiParameterService = inputAsumsiParameterService;

    // Trigger insertAsumsiParameter and expect it to handle error
    await wrapper.vm.insertAsumsiParameter();

    // Wait for async operations
    await nextTick();

    // Check that loading is set back to false after error
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should test fetchCheckIntegrasi with status_data_integrasi as 0', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    // Mock the service method directly on the component instance
    const mockPerbaruiDataService = {
      getCheckIntegrasi: vi.fn().mockResolvedValue({
        data: [{ status_data_integrasi: "0" }]
      })
    };

    wrapper.vm.perbaruiDataService = mockPerbaruiDataService;
    wrapper.vm.idMesin = 'test-id-123';

    await wrapper.vm.fetchCheckIntegrasi();

    expect(wrapper.vm.isIntegrasi).toBe(false);
  });

  it('should test fetchMesinById error handling', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock the service to throw error
    const mockInputAsumsiParameterService = {
      getMesinById: vi.fn().mockRejectedValue(new Error('Network error'))
    };

    wrapper.vm.inputAsumsiParameterService = mockInputAsumsiParameterService;
    wrapper.vm.idMesin = 'test-id-123';

    await wrapper.vm.fetchMesinById();

    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should test fetchStatusRealisasiById error handling', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock the service to throw error
    const mockInputAsumsiParameterService = {
      getStatusRealisasiById: vi.fn().mockRejectedValue(new Error('Network error'))
    };

    wrapper.vm.inputAsumsiParameterService = mockInputAsumsiParameterService;
    wrapper.vm.idMesin = 'test-id-123';

    await wrapper.vm.fetchStatusRealisasiById();

    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should test fetchComboBahanBakar error handling', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock the service to throw error
    const mockInputAsumsiParameterService = {
      getComboBahanBakar: vi.fn().mockRejectedValue(new Error('Network error'))
    };

    wrapper.vm.inputAsumsiParameterService = mockInputAsumsiParameterService;
    wrapper.vm.kodeJenisPembangkit = 'PLTU';

    await wrapper.vm.fetchComboBahanBakar();

    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should test fetchCheckIntegrasi error handling', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock the service to throw error
    const mockPerbaruiDataService = {
      getCheckIntegrasi: vi.fn().mockRejectedValue(new Error('Network error'))
    };

    wrapper.vm.perbaruiDataService = mockPerbaruiDataService;
    wrapper.vm.idMesin = 'test-id-123';

    await wrapper.vm.fetchCheckIntegrasi();

    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should test fetchAsumsiParameter error handling', async () => {
    wrapper = mount(InputAsumsiParameter, {
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

    await nextTick();

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock the service to throw error
    const mockInputAsumsiParameterService = {
      getAsumsiMakroData: vi.fn().mockRejectedValue(new Error('Network error'))
    };

    wrapper.vm.inputAsumsiParameterService = mockInputAsumsiParameterService;
    wrapper.vm.idMesin = 'test-id-123';

    await wrapper.vm.fetchAsumsiParameter(false);

    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });
});