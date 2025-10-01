import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import FeasibilityStudySentral from '@/views/Data/RekapKertasKerja/FeasibilityStudy/FeasibilityStudySentral.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';
import InfoHeader from '@/components/ui/InfoHeader.vue';
import TabsWrapper from '@/components/ui/TabsWrapper.vue';
import TabItem from '@/components/ui/TabItem.vue';

// Mock FeasibilityStudyService
const mockFeasibilityStudyService = {
  getSentralById: jest.fn(),
  getPengelolaData: jest.fn(),
  getAsumsiFeasibilitySentral: jest.fn(),
  getKalkulasiFeasibilitySentral: jest.fn()
};

jest.mock('@/services/feasibility-study', () => {
  return jest.fn().mockImplementation(() => mockFeasibilityStudyService);
});

// Mock vue-router
const mockRoute = {
  params: { id: '123' }
};

jest.mock('vue-router', () => ({
  useRoute: () => mockRoute
}));

// Mock child components
jest.mock('@/components/ui/LoadingSpinner.vue', () => ({
  name: 'Loading',
  template: '<div data-testid="loading">Loading...</div>'
}));

jest.mock('@/components/ui/InfoHeader.vue', () => ({
  name: 'InfoHeader',
  template: '<div data-testid="info-header">Info Header</div>',
  props: ['namaMesin', 'namaPengelola', 'kondisiUnit', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis']
}));

jest.mock('@/components/ui/TabsWrapper.vue', () => ({
  name: 'TabsWrapper',
  template: '<div data-testid="tabs-wrapper"><slot /></div>'
}));

jest.mock('@/components/ui/TabItem.vue', () => ({
  name: 'TabItem',
  template: '<div data-testid="tab-item"><slot /></div>',
  props: ['title']
}));

// Mock AsumsiTab and KalkulasiTab components
const mockAsumsiTab = {
  name: 'AsumsiTab',
  template: '<div data-testid="asumsi-tab">Asumsi Tab</div>',
  props: ['tahunBerjalan', 'discountRate', 'totalProjectCost', 'umurTeknis', 'interestRate', 'loanPortion', 'equityPortion', 'loan', 'loanTenor', 'principalInterestPayment', 'corporateTaxRate', 'waccOnProject', 'waccOnEquity', 'equity', 'dayaMampuNetto', 'auxiliary', 'susutTrafo', 'electricityPriceA', 'electricityPriceB', 'electricityPriceC', 'electricityPriceD']
};

const mockKalkulasiTab = {
  name: 'KalkulasiTab',
  template: '<div data-testid="kalkulasi-tab">Kalkulasi Tab</div>',
  props: ['kalkulasiFeasibility', 'resultMap']
};

describe('FeasibilityStudySentral.vue', () => {
  let wrapper: any;

  const mockSentralData = {
    data: {
      uuid_mesin: 1,
      kode_sentral: 'S001',
      kode_mesin: 'M001',
      nama_sentral: 'PLTA Test',
      kode_jenis_pembangkit: 'PLTA',
      kondisi_unit: 'Operasi',
      daya_terpasang: 100,
      daya_mampu: 95,
      tahun_operasi: '2020',
      kode_pengelola: 'P001'
    }
  };

  const mockPengelolaData = {
    data: [
      { kode_pengelola: 'P001', pengelola: 'PT Test Pengelola' }
    ]
  };

  const mockAsumsiFeasibilityData = {
    data: {
      uuid_mesin: 1,
      kode_mesin: 'M001',
      mesin: 'PLTA Test',
      tahun_operasi: '2020',
      total_project_cost: 1000000,
      umur_teknis: 25,
      interest_rate: 5.5,
      loan_portion: 70,
      equity_portion: 30,
      loan_tenor: 15,
      daya_mampu_netto_mw: 95,
      auxiliary: 5,
      susut_trafo: 2,
      ps: 80,
      sfc_kg_kwh: 0.3,
      electricity_price_a_rp_per_kwbln: 1000,
      electricity_price_b_rp_per_kwbln: 1200,
      electricity_price_c_rp_per_kwh: 800,
      electricity_price_d_rp_per_kwh: 900,
      kode_bahan_bakar: 'BB001',
      harga_bahan_bakar: 5000,
      loan: 700000,
      principal_interest_payment: 50000,
      wacc_on_project: 7.5,
      wacc_on_equity: 8.5,
      equity: 300000,
      corporate_tax_rate: 25,
      discount_rate: 10,
      nphr: 8500
    }
  };

  const mockKalkulasiData = {
    data: {
      detail: [
        { level: 1, name: 'Revenue', value: 1000000 },
        { level: 2, name: 'Operating Revenue', value: 950000 },
        { level: 2, name: 'Non-Operating Revenue', value: 50000 },
        { level: 1, name: 'Expenses', value: 600000 },
        { level: 2, name: 'Operating Expenses', value: 550000 },
        { level: 2, name: 'Non-Operating Expenses', value: 50000 }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Suppress console.log from component
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Setup default mock implementations
    (mockFeasibilityStudyService.getSentralById as any).mockResolvedValue(mockSentralData);
    (mockFeasibilityStudyService.getPengelolaData as any).mockResolvedValue(mockPengelolaData);
    (mockFeasibilityStudyService.getAsumsiFeasibilitySentral as any).mockResolvedValue(mockAsumsiFeasibilityData);
    (mockFeasibilityStudyService.getKalkulasiFeasibilitySentral as any).mockResolvedValue(mockKalkulasiData);

    wrapper = mount(FeasibilityStudySentral, {
      global: {
        components: {
          Loading,
          InfoHeader,
          TabsWrapper,
          TabItem,
          AsumsiTab: mockAsumsiTab,
          KalkulasiTab: mockKalkulasiTab
        },
        stubs: {
          AsumsiTab: mockAsumsiTab,
          KalkulasiTab: mockKalkulasiTab
        }
      }
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    // Restore console.log
    jest.restoreAllMocks();
  });

  describe('Component Mounting', () => {
    it('should render the component correctly', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('should show loading spinner initially', async () => {
      // Test that loading component can be rendered when isLoading is true
      const freshWrapper = mount(FeasibilityStudySentral, {
        global: {
          components: {
            Loading,
            InfoHeader,
            TabsWrapper,
            TabItem,
            AsumsiTab: mockAsumsiTab,
            KalkulasiTab: mockKalkulasiTab
          }
        }
      });
      
      // Access the ref directly and set it to true
      (freshWrapper.vm as any).isLoading = true;
      await freshWrapper.vm.$nextTick();
      expect(freshWrapper.findComponent(Loading).exists()).toBe(true);
      
      freshWrapper.unmount();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch sentral data by id on mount', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFeasibilityStudyService.getSentralById).toHaveBeenCalledWith('123');
    });

    it('should fetch pengelola data on mount', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFeasibilityStudyService.getPengelolaData).toHaveBeenCalled();
    });

    it('should fetch asumsi feasibility data on mount', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFeasibilityStudyService.getAsumsiFeasibilitySentral).toHaveBeenCalledWith(123);
    });

    it('should fetch kalkulasi feasibility data on mount', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFeasibilityStudyService.getKalkulasiFeasibilitySentral).toHaveBeenCalledWith(123);
    });
  });

  describe('Data Processing', () => {
    it('should set mesin data correctly after fetch', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(wrapper.vm.mesinDataById).toEqual(mockSentralData.data);
    });

    it('should set pengelola name correctly', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(wrapper.vm.namaPengelola).toBe('PT Test Pengelola');
    });

    it('should set asumsi feasibility data correctly', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(wrapper.vm.asumsiFeasibility).toEqual(mockAsumsiFeasibilityData.data);
      expect(wrapper.vm.umurTeknis).toBe('25');
    });

    it('should process kalkulasi data into result map structure', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(wrapper.vm.resultMap).toHaveLength(2);
      expect(wrapper.vm.resultMap[0].name).toBe('Revenue');
      expect(wrapper.vm.resultMap[0].children).toHaveLength(2);
      expect(wrapper.vm.resultMap[1].name).toBe('Expenses');
      expect(wrapper.vm.resultMap[1].children).toHaveLength(2);
    });

    it('should set current year correctly', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      const currentYear = new Date().getFullYear();
      expect(wrapper.vm.tahunBerjalan).toBe(currentYear);
    });
  });

  describe('Component Rendering with Data', () => {
    beforeEach(async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));
      wrapper.vm.isLoading = false;
      await wrapper.vm.$nextTick();
    });

    it('should render InfoHeader when mesin data is available', () => {
      const infoHeader = wrapper.findComponent(InfoHeader);
      expect(infoHeader.exists()).toBe(true);
      expect(infoHeader.props('namaMesin')).toBe('PLTA Test');
      expect(infoHeader.props('namaPengelola')).toBe('PT Test Pengelola');
      expect(infoHeader.props('kondisiUnit')).toBe('Operasi');
      expect(infoHeader.props('dayaTerpasang')).toBe('100');
      expect(infoHeader.props('dayaMampu')).toBe('95');
      expect(infoHeader.props('tahunOperasi')).toBe('2020');
      expect(infoHeader.props('umurTeknis')).toBe('25');
    });

    it('should render TabsWrapper with correct structure', () => {
      const tabsWrapper = wrapper.findComponent(TabsWrapper);
      expect(tabsWrapper.exists()).toBe(true);
      
      const tabItems = wrapper.findAllComponents(TabItem);
      expect(tabItems).toHaveLength(2);
      expect(tabItems[0].props('title')).toBe('Asumsi');
      expect(tabItems[1].props('title')).toBe('Kalkulasi');
    });

    it('should render AsumsiTab with correct props when data is available', () => {
      const asumsiTab = wrapper.find('[data-testid="asumsi-tab"]');
      expect(asumsiTab.exists()).toBe(true);
    });

    it('should render KalkulasiTab with correct props when data is available', () => {
      const kalkulasiTab = wrapper.find('[data-testid="kalkulasi-tab"]');
      expect(kalkulasiTab.exists()).toBe(true);
    });

    it('should not show loading spinner after data is loaded', () => {
      const loading = wrapper.findComponent(Loading);
      expect(loading.exists()).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle getSentralById error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (mockFeasibilityStudyService.getSentralById as any).mockRejectedValueOnce(new Error('API Error'));

      const errorWrapper = mount(FeasibilityStudySentral, {
        global: {
          components: {
            Loading,
            InfoHeader,
            TabsWrapper,
            TabItem,
            AsumsiTab: mockAsumsiTab,
            KalkulasiTab: mockKalkulasiTab
          }
        }
      });

      await errorWrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleErrorSpy).toHaveBeenCalledWith('Fetch Mesin By Id Error : ', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
      errorWrapper.unmount();
    });

    it('should handle getAsumsiFeasibilitySentral error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (mockFeasibilityStudyService.getAsumsiFeasibilitySentral as any).mockRejectedValueOnce(new Error('API Error'));

      const errorWrapper = mount(FeasibilityStudySentral, {
        global: {
          components: {
            Loading,
            InfoHeader,
            TabsWrapper,
            TabItem,
            AsumsiTab: mockAsumsiTab,
            KalkulasiTab: mockKalkulasiTab
          }
        }
      });

      await errorWrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error Fetch Asumsi Feasibility : ', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
      errorWrapper.unmount();
    });

    it('should handle getKalkulasiFeasibilitySentral error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (mockFeasibilityStudyService.getKalkulasiFeasibilitySentral as any).mockRejectedValueOnce(new Error('API Error'));

      const errorWrapper = mount(FeasibilityStudySentral, {
        global: {
          components: {
            Loading,
            InfoHeader,
            TabsWrapper,
            TabItem,
            AsumsiTab: mockAsumsiTab,
            KalkulasiTab: mockKalkulasiTab
          }
        }
      });

      await errorWrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error Fetch Kalkulasi Feasibility : ', expect.any(Error));
      
      consoleErrorSpy.mockRestore();
      errorWrapper.unmount();
    });
  });

  describe('Component Structure', () => {
    it('should have correct main container structure', () => {
      const mainContainer = wrapper.find('.flex.flex-col.p-4.mt-4.bg-white.rounded-lg');
      expect(mainContainer.exists()).toBe(true);
    });

    it('should conditionally render InfoHeader based on mesinDataById', async () => {
      // Initially no data
      wrapper.vm.mesinDataById = null;
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(InfoHeader).exists()).toBe(false);

      // With data
      wrapper.vm.mesinDataById = mockSentralData.data;
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(InfoHeader).exists()).toBe(true);
    });

    it('should conditionally render AsumsiTab based on asumsiFeasibility', async () => {
      // Initially no data
      wrapper.vm.asumsiFeasibility = null;
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[data-testid="asumsi-tab"]').exists()).toBe(false);

      // With data
      wrapper.vm.asumsiFeasibility = mockAsumsiFeasibilityData.data;
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[data-testid="asumsi-tab"]').exists()).toBe(true);
    });

    it('should conditionally render KalkulasiTab based on kalkulasiFeasibility', async () => {
      // Initially no data
      wrapper.vm.kalkulasiFeasibility = null;
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[data-testid="kalkulasi-tab"]').exists()).toBe(false);

      // With data
      wrapper.vm.kalkulasiFeasibility = mockKalkulasiData.data;
      await wrapper.vm.$nextTick();
      expect(wrapper.find('[data-testid="kalkulasi-tab"]').exists()).toBe(true);
    });
  });

  describe('Lifecycle and State Management', () => {
    it('should set loading to false after all data is fetched', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(wrapper.vm.isLoading).toBe(false);
    });

    it('should call all fetch methods in correct sequence on mount', async () => {
      await wrapper.vm.$nextTick();
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockFeasibilityStudyService.getSentralById).toHaveBeenCalled();
      expect(mockFeasibilityStudyService.getPengelolaData).toHaveBeenCalled();
      expect(mockFeasibilityStudyService.getAsumsiFeasibilitySentral).toHaveBeenCalled();
      expect(mockFeasibilityStudyService.getKalkulasiFeasibilitySentral).toHaveBeenCalled();
    });
  });
});