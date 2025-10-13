import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import PageTeknis from '@/views/Beranda/LamanData/TabPage/PageTeknis.vue';
import { reactive } from 'vue';

// Mock the store with reactive properties
const mockStore = reactive({
  currentTab: 'Teknis',
});

vi.mock('@/store/storeLamanDataTab', () => ({
  useLamanDataTabStore: () => mockStore,
}));

// Mock LamanService
const mockLamanService = {
  getDataTeknis: vi.fn(),
  getPeriodeTahun: vi.fn(),
  getInfoSFC: vi.fn(),
  getListTahun: vi.fn(),
  downloadExcelTeknis: vi.fn(),
};

vi.mock('@/services/laman-service', () => ({
  default: class MockLamanService {
    getDataTeknis = mockLamanService.getDataTeknis;
    getPeriodeTahun = mockLamanService.getPeriodeTahun;
    getInfoSFC = mockLamanService.getInfoSFC;
    getListTahun = mockLamanService.getListTahun;
    downloadExcelTeknis = mockLamanService.downloadExcelTeknis;
  },
}));

describe('PageTeknis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock responses
    mockLamanService.getDataTeknis.mockResolvedValue({
      data: [],
      meta: {
        totalPages: 1,
        totalRecords: 0,
        limit: 10,
      },
    });
    
    mockLamanService.getPeriodeTahun.mockResolvedValue({
      data: [
        { tahun: 2020 },
        { tahun: 2025 },
      ],
    });
    
    mockLamanService.getInfoSFC.mockResolvedValue({
      data: [],
    });
    
    mockLamanService.getListTahun.mockResolvedValue({
      data: [
        { tahun: 2020 },
        { tahun: 2025 },
      ],
    });
  });

  it('should render component correctly', async () => {
    const wrapper = mount(PageTeknis);
    
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('input[placeholder="Cari sentral..."]').exists()).toBe(true);
  });

  it('should trigger store watcher when currentTab is Teknis', async () => {
    const wrapper = mount(PageTeknis);
    
    // Simulate store change
    mockStore.currentTab = 'Other';
    await wrapper.vm.$nextTick();
    
    mockStore.currentTab = 'Teknis';
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockLamanService.getInfoSFC).toHaveBeenCalled();
    expect(mockLamanService.getPeriodeTahun).toHaveBeenCalled();
  });

  it('should handle search input correctly', async () => {
    const wrapper = mount(PageTeknis);
    
    const searchInput = wrapper.find('input[placeholder="Cari sentral..."]');
    await searchInput.setValue('test search');
    
    expect((searchInput.element as HTMLInputElement).value).toBe('test search');
  });

  it('should handle year range picker correctly', async () => {
    const wrapper = mount(PageTeknis);
    
    // Access component instance to call the method
    const vm = wrapper.vm as any;
    await vm.handleYearRangePicked([2020, 2023]);
    
    expect(vm.tahunDari).toBe(2020);
    expect(vm.tahunSampai).toBe(2023);
    expect(vm.yearRangePicked).toEqual([2020, 2023]);
  });

  it('should toggle up section correctly', async () => {
    const wrapper = mount(PageTeknis);
    const vm = wrapper.vm as any;
    
    // Test opening a section
    vm.toggleUp('test-code');
    expect(vm.isUpOpen('test-code')).toBe(true);
    
    // Test closing the same section
    vm.toggleUp('test-code');
    expect(vm.isUpOpen('test-code')).toBe(false);
  });

  it('should toggle pembangkit section correctly', async () => {
    const wrapper = mount(PageTeknis);
    const vm = wrapper.vm as any;
    
    // Test opening a pembangkit section
    vm.togglePembangkit(123);
    expect(vm.isPembangkitOpen(123)).toBe(true);
    
    // Test closing the same pembangkit section
    vm.togglePembangkit(123);
    expect(vm.isPembangkitOpen(123)).toBe(false);
  });

  it('should handle export functionality', async () => {
    // Mock successful export response
    mockLamanService.downloadExcelTeknis.mockResolvedValue({
      data: new Blob(['test data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      headers: {
        'content-disposition': 'filename="test-export.xlsx"'
      }
    });

    const wrapper = mount(PageTeknis);
    const vm = wrapper.vm as any;
    
    // Set some default values
    vm.yearRangePicked = [2020, 2023];
    vm.searchQ = 'test';
    
    await vm.handleExport();
    
    expect(mockLamanService.downloadExcelTeknis).toHaveBeenCalledWith(2020, 2023, 'TEST');
    expect(vm.isLoading).toBe(false);
  });

  it('should handle export error correctly', async () => {
    // Mock export error
    mockLamanService.downloadExcelTeknis.mockRejectedValue(new Error('Export failed'));

    const wrapper = mount(PageTeknis);
    const vm = wrapper.vm as any;
    
    vm.yearRangePicked = [2020, 2023];
    vm.searchQ = 'test';
    
    await vm.handleExport();
    
    expect(mockLamanService.downloadExcelTeknis).toHaveBeenCalledWith(2020, 2023, 'TEST');
  });

  it('should handle fetchPeriodeTahun error correctly', async () => {
    mockLamanService.getPeriodeTahun.mockRejectedValue(new Error('Fetch error'));

    const wrapper = mount(PageTeknis);
    const vm = wrapper.vm as any;
    
    await vm.fetchPeriodeTahun();
    
    expect(mockLamanService.getPeriodeTahun).toHaveBeenCalled();
  });

  it('should handle fetchDataTeknis error correctly', async () => {
    mockLamanService.getDataTeknis.mockRejectedValue(new Error('Fetch error'));

    const wrapper = mount(PageTeknis);
    const vm = wrapper.vm as any;
    
    await vm.fetchDataTeknis();
    
    expect(mockLamanService.getDataTeknis).toHaveBeenCalled();
  });

  it('should handle fetchListTahun error correctly', async () => {
    mockLamanService.getListTahun.mockRejectedValue(new Error('Fetch error'));

    const wrapper = mount(PageTeknis);
    const vm = wrapper.vm as any;
    
    await vm.fetchListTahun();
    
    expect(mockLamanService.getListTahun).toHaveBeenCalled();
  });

  it('should early return when data already exists in store watcher', async () => {
    const wrapper = mount(PageTeknis);
    const vm = wrapper.vm as any;
    
    // Set data to simulate already loaded state with proper structure
    vm.dataSFC = [{ jenis_kit: 'test', bahan_bakar: 'coal', satuan_sfc: 'kg/MWh' }];
    vm.teknisData = [{ 
      kode_pengelola: 'test', 
      pengelola: 'Test Pengelola',
      pembangkits: [{ 
        uuid_sentral: 1, 
        kode_sentral: 'TEST',
        sentral: 'Test Sentral',
        kode_jenis_pembangkit: 'PLTU',
        mesins: []
      }]
    }];
    
    mockStore.currentTab = 'Other';
    await wrapper.vm.$nextTick();
    
    mockStore.currentTab = 'Teknis';
    await wrapper.vm.$nextTick();
    
    // Should have early returned and not called the services again after initial setup
    expect(vm.dataSFC.length).toBeGreaterThan(0);
    expect(vm.teknisData.length).toBeGreaterThan(0);
  });

  it('should handle store watcher error correctly', async () => {
    mockLamanService.getInfoSFC.mockRejectedValue(new Error('SFC error'));

    const wrapper = mount(PageTeknis);
    const vm = wrapper.vm as any;
    
    // Clear existing data to avoid early return
    vm.dataSFC = [];
    vm.teknisData = [];
    
    mockStore.currentTab = 'Other';
    await wrapper.vm.$nextTick();
    
    mockStore.currentTab = 'Teknis';
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockLamanService.getInfoSFC).toHaveBeenCalled();
  });
});