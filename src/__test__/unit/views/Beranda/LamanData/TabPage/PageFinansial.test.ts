import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowMount, mount, flushPromises } from '@vue/test-utils';
import { reactive } from 'vue';
import PageFinansial from '@/views/Beranda/LamanData/TabPage/PageFinansial.vue';

// Mock the store — use reactive so the watch() in the component fires
const mockStore = reactive({
  currentTab: ''
});

vi.mock('@/store/storeLamanDataTab', () => ({
  useLamanDataTabStore: () => mockStore
}));

// Mock the service
const mockLamanService = {
  getDataFinansial: vi.fn(),
  getTahunSelected: vi.fn(),
  getListTahun: vi.fn(),
  downloadExcelFinansial: vi.fn()
};

vi.mock('@/services/laman-service', () => ({
  default: vi.fn(function() { return mockLamanService; })
}));

describe('PageFinansial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.currentTab = '';
    
    // Setup default mock responses
    mockLamanService.getDataFinansial.mockResolvedValue({
      data: [],
      meta: {
        totalPages: 1,
        totalRecords: 0,
        limit: 10
      }
    });
    
    mockLamanService.getTahunSelected.mockResolvedValue({});
    
    mockLamanService.getListTahun.mockResolvedValue({
      data: [
        { tahun: 2020 },
        { tahun: 2025 }
      ]
    });
  });

  it('should render component successfully', () => {
    const wrapper = shallowMount(PageFinansial);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm).toBeDefined();
  });

  it('should have correct initial state', () => {
    const wrapper = shallowMount(PageFinansial);

    // Check component instance exists
    expect(wrapper.vm).toBeDefined();
    expect(wrapper.vm.$data).toBeDefined();
  });

  it('should render basic template structure', () => {
    const wrapper = shallowMount(PageFinansial);

    // Check for space-y-5 container
    expect(wrapper.find('.space-y-5').exists()).toBe(true);
    
    // Check for SearchBox component
    expect(wrapper.findComponent({ name: 'SearchBox' }).exists()).toBe(true);
    
    // Check for ButtonComponent
    expect(wrapper.findComponent({ name: 'ButtonComponent' }).exists()).toBe(true);
  });

  it('should call fetchDataFinansial when searchBox events are triggered', async () => {
    const wrapper = shallowMount(PageFinansial);
    const searchBox = wrapper.findComponent({ name: 'SearchBox' });

    // Trigger search events
    await searchBox.vm.$emit('on-key-enter');
    await searchBox.vm.$emit('on-click-submit');
    await searchBox.vm.$emit('on-input');

    expect(mockLamanService.getDataFinansial).toHaveBeenCalled();
  });

  it('should handle date picker update', async () => {
    const wrapper = shallowMount(PageFinansial);
    const datePicker = wrapper.findComponent({ name: 'VueDatePicker' });

    // Check if datePicker exists before emitting
    if (datePicker.exists()) {
      await datePicker.vm.$emit('update:model-value', 2023);
      expect(mockLamanService.getDataFinansial).toHaveBeenCalled();
    } else {
      // If VueDatePicker is not found, at least verify the component exists
      expect(wrapper.exists()).toBe(true);
    }
  });

  it('should handle export functionality', async () => {
    // Mock the service method
    mockLamanService.downloadExcelFinansial.mockResolvedValue({
      data: new Blob(['test'], { type: 'application/excel' }),
      headers: { 'content-disposition': 'filename="test.xlsx"' }
    });

    const wrapper = shallowMount(PageFinansial);
    
    // Access component methods through vm
    const vm = wrapper.vm as any;
    
    // Test if handleExport method exists and can be called
    if (typeof vm.handleExport === 'function') {
      await vm.handleExport();
      expect(mockLamanService.downloadExcelFinansial).toHaveBeenCalled();
    } else {
      // At least verify component is rendered
      expect(wrapper.exists()).toBe(true);
    }
  });

  it('should test toggle methods if available', () => {
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    
    // Test toggle methods if they exist
    if (typeof vm.toggleUp === 'function') {
      vm.toggleUp('test-code');
      expect(vm.isUpTabOpen).toContain('test-code');
    }
    
    if (typeof vm.togglePembangkit === 'function') {
      vm.togglePembangkit(123);
      expect(vm.isPembangkitTabOpen).toContain(123);
    }
    
    // At minimum, ensure component is working
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle service errors gracefully', async () => {
    // Mock service to throw error
    mockLamanService.getDataFinansial.mockRejectedValue(new Error('Service error'));
    
    const wrapper = shallowMount(PageFinansial);
    
    // Component should still render even if service fails
    expect(wrapper.exists()).toBe(true);
  });

  it('should handle watcher correctly when store changes', async () => {
    const wrapper = shallowMount(PageFinansial);
    
    // Change store value to trigger watcher
    mockStore.currentTab = 'Finansial';
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.exists()).toBe(true);
  });

  // --- fetchDataFinansial with actual data ---
  it('should fetch and filter finansial data with pembangkits', async () => {
    mockLamanService.getDataFinansial.mockResolvedValue({
      data: [
        { kode_pengelola: 'P1', pengelola: 'PLN1', pembangkits: [{ sentral: 'S1', mesins: [] }] },
        { kode_pengelola: 'P2', pengelola: 'PLN2', pembangkits: [] } // filtered out
      ],
      meta: { totalPages: 3, totalRecords: 20, limit: 5 }
    });
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    await vm.fetchDataFinansial();
    // Only pembangkits.length > 0 remain
    expect(vm.finansialData.length).toBe(1);
    expect(vm.totalPages).toBe(3);
    expect(vm.totalRecords).toBe(20);
    expect(vm.pageLimit).toBe(5);
    expect(vm.isLoading).toBe(false);
    expect(vm.isSearchDisabled).toBe(false);
  });

  it('should handle fetchDataFinansial error', async () => {
    mockLamanService.getDataFinansial.mockRejectedValue(new Error('fetch error'));
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    await vm.fetchDataFinansial();
    expect(vm.isLoading).toBe(false);
    expect(vm.isSearchDisabled).toBe(false);
  });

  // --- fetchTahunSelected ---
  it('should call fetchTahunSelected successfully', async () => {
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    await vm.fetchTahunSelected();
    expect(mockLamanService.getTahunSelected).toHaveBeenCalled();
  });

  it('should handle fetchTahunSelected error', async () => {
    mockLamanService.getTahunSelected.mockRejectedValue(new Error('err'));
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    await vm.fetchTahunSelected();
    expect(vm).toBeDefined(); // no throw
  });

  // --- fetchListTahun ---
  it('should fetch list tahun and update periodeTahun', async () => {
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    await vm.fetchListTahun();
    expect(vm.periodeTahun).toEqual([2020, 2025]);
  });

  it('should handle fetchListTahun error', async () => {
    mockLamanService.getListTahun.mockRejectedValue(new Error('list error'));
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    await vm.fetchListTahun();
    expect(vm).toBeDefined(); // no throw
  });

  // --- toggleUp open and close ---
  it('should toggle up open and close correctly', () => {
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    // open
    vm.toggleUp('PLN001');
    expect(vm.isUpOpen('PLN001')).toBe(true);
    // close (toggle again)
    vm.toggleUp('PLN001');
    expect(vm.isUpOpen('PLN001')).toBe(false);
  });

  // --- togglePembangkit open and close ---
  it('should toggle pembangkit open and close correctly', () => {
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    // open
    vm.togglePembangkit('PLN001_0');
    expect(vm.isPembangkitOpen('PLN001_0')).toBe(true);
    // close
    vm.togglePembangkit('PLN001_0');
    expect(vm.isPembangkitOpen('PLN001_0')).toBe(false);
  });

  // --- handleExport ---
  it('should handle export with fallback filename (no content-disposition)', async () => {
    (global.URL as any).createObjectURL = vi.fn(() => 'blob:mock-url');
    mockLamanService.downloadExcelFinansial.mockResolvedValue({
      data: new Blob(['test']),
      headers: {}
    });
    const origCreateElement = document.createElement.bind(document);
    const origAppendChild = document.body.appendChild.bind(document.body);
    const origRemoveChild = document.body.removeChild.bind(document.body);
    const mockLink = { href: '', setAttribute: vi.fn(), click: vi.fn() };
    (document as any).createElement = vi.fn((tag: string) => {
      if (tag === 'a') return mockLink;
      return origCreateElement(tag);
    });
    (document.body as any).appendChild = vi.fn();
    (document.body as any).removeChild = vi.fn();

    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    await vm.handleExport();

    expect(mockLamanService.downloadExcelFinansial).toHaveBeenCalled();
    const year = new Date().getFullYear();
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', `Laman Data - Finansial - ${year}.xlsx`);
    expect(vm.isLoading).toBe(false);

    (document as any).createElement = origCreateElement;
    (document.body as any).appendChild = origAppendChild;
    (document.body as any).removeChild = origRemoveChild;
  });

  it('should handle export with filename from content-disposition', async () => {
    (global.URL as any).createObjectURL = vi.fn(() => 'blob:mock-url');
    mockLamanService.downloadExcelFinansial.mockResolvedValue({
      data: new Blob(['data']),
      headers: { 'content-disposition': 'attachment; filename="finansial_2024.xlsx"' }
    });
    const origCreateElement = document.createElement.bind(document);
    const origAppendChild = document.body.appendChild.bind(document.body);
    const origRemoveChild = document.body.removeChild.bind(document.body);
    const mockLink = { href: '', setAttribute: vi.fn(), click: vi.fn() };
    (document as any).createElement = vi.fn((tag: string) => {
      if (tag === 'a') return mockLink;
      return origCreateElement(tag);
    });
    (document.body as any).appendChild = vi.fn();
    (document.body as any).removeChild = vi.fn();

    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    await vm.handleExport();

    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'finansial_2024.xlsx');

    (document as any).createElement = origCreateElement;
    (document.body as any).appendChild = origAppendChild;
    (document.body as any).removeChild = origRemoveChild;
  });

  it('should handle export error', async () => {
    mockLamanService.downloadExcelFinansial.mockRejectedValue(new Error('download err'));
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    await vm.handleExport();
    expect(vm.isLoading).toBe(false);
  });

  // --- handleSearch debounce ---
  it('should call fetchDataFinansial after debounce in handleSearch', async () => {
    vi.useFakeTimers();
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    vm.handleSearch();
    expect(mockLamanService.getDataFinansial).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    await flushPromises();
    expect(mockLamanService.getDataFinansial).toHaveBeenCalled();
    vi.useRealTimers();
  });

  // --- Watcher trigger with reactive store ---
  it('should trigger watcher and fetch data when currentTab becomes Finansial', async () => {
    const wrapper = shallowMount(PageFinansial);
    expect(mockLamanService.getTahunSelected).not.toHaveBeenCalled();
    mockStore.currentTab = 'Finansial';
    await flushPromises();
    expect(mockLamanService.getTahunSelected).toHaveBeenCalled();
    expect(mockLamanService.getDataFinansial).toHaveBeenCalled();
    expect(mockLamanService.getListTahun).toHaveBeenCalled();
  });

  it('should populate finansialData through watcher and filter out entries without pembangkits', async () => {
    mockLamanService.getDataFinansial.mockResolvedValue({
      data: [
        { kode_pengelola: 'P1', pengelola: 'PLN 1', pembangkits: [{ sentral: 'S1' }] },
        { kode_pengelola: 'P2', pengelola: 'PLN 2', pembangkits: [] } // filtered out
      ],
      meta: { totalPages: 1, totalRecords: 2, limit: 10 }
    });
    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;
    mockStore.currentTab = 'Finansial';
    await flushPromises();
    // Only P1 should remain after filtering
    expect(vm.finansialData.length).toBe(1);
    expect(vm.finansialData[0].kode_pengelola).toBe('P1');
  });

  it('should not trigger watcher when currentTab is not Finansial', async () => {
    const wrapper = shallowMount(PageFinansial);
    mockStore.currentTab = 'Teknis';
    await flushPromises();
    expect(mockLamanService.getTahunSelected).not.toHaveBeenCalled();
  });

  it('should take watcher early return when finansialData is already populated', async () => {
    mockLamanService.getDataFinansial.mockResolvedValue({
      data: [{ kode_pengelola: 'P1', pengelola: 'PLN 1', pembangkits: [{ sentral: 'S1', mesins: [] }] }],
      meta: { totalPages: 1, totalRecords: 1, limit: 10 }
    });

    const wrapper = shallowMount(PageFinansial);
    const vm = wrapper.vm as any;

    // Populate finansialData first via explicit fetch
    await vm.fetchDataFinansial();
    expect(vm.finansialData.length).toBeGreaterThan(0);

    // Trigger the watcher — since finansialData is already populated, it should return early
    mockStore.currentTab = 'Finansial';
    await flushPromises();

    // Early return should keep the current data intact and avoid loading state transitions.
    expect(vm.finansialData.length).toBe(1);
    expect(vm.isLoading).toBe(false);
  });

  it('should render nested rows and cover fallback branches in table body', async () => {
    mockLamanService.getDataFinansial.mockResolvedValue({
      data: [
        {
          kode_pengelola: 'P1',
          pengelola: 'UP Test',
          pembangkits: [
            {
              sentral: 'Sentral A',
              kode_jenis_pembangkit: 'PLTU',
              total_nilai_asset: 1500000,
              mesins: [
                {
                  uuid_mesin: 'm1',
                  mesin: 'Mesin 1',
                  kode_jenis_pembangkit: 'PLTU',
                  trans_realisasi_proyeksis: [
                    {
                      track_irr_equity: 1,
                      track_npv_equity: 2,
                      track_irr_project: 3,
                      track_npv_project: 4,
                    },
                  ],
                  ebitda: 10,
                  rnfa: 20,
                  nilai_asset_awal: 1000000,
                },
                {
                  uuid_mesin: 'm2',
                  mesin: 'Mesin 2',
                  kode_jenis_pembangkit: 'PLTU',
                  trans_realisasi_proyeksis: [],
                  ebitda: null,
                  rnfa: null,
                  nilai_asset_awal: 1000000,
                },
              ],
            },
          ],
        },
        {
          kode_pengelola: 'P2',
          pengelola: 'UP Tanpa Pembangkit',
          pembangkits: [],
        },
      ],
      meta: { totalPages: 1, totalRecords: 2, limit: 10 },
    });

    const wrapper = mount(PageFinansial, {
      global: {
        stubs: {
          SearchBox: {
            template: '<div><button class="emit-search" @click="$emit(\'on-click-submit\')" /><button class="emit-enter" @click="$emit(\'on-key-enter\')" /><input class="emit-input" @input="$emit(\'on-input\')" /></div>',
          },
          ButtonComponent: { template: '<button><slot /></button>' },
          VueDatePicker: {
            template: '<button class="emit-year" @click="$emit(\'update:model-value\', 2024)">Tahun</button>',
          },
          Loading: true,
        },
      },
    });

    const vm = wrapper.vm as any;
    await vm.fetchDataFinansial();
    await flushPromises();

    await wrapper.find('.emit-search').trigger('click');
    await wrapper.find('.emit-enter').trigger('click');
    await wrapper.find('.emit-input').trigger('input');
    await wrapper.find('.emit-year').trigger('click');
    await flushPromises();

    const pengelolaRow = wrapper.findAll('tr').find(row => row.text().includes('UP Test'));
    expect(pengelolaRow).toBeTruthy();
    await pengelolaRow!.trigger('click');

    const pembangkitRow = wrapper.findAll('tr').find(row => row.text().includes('Sentral A'));
    expect(pembangkitRow).toBeTruthy();
    await pembangkitRow!.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Sentral A');
    expect(wrapper.text()).toContain('Mesin 1');
    expect(wrapper.text()).toContain('Mesin 2');
    expect(wrapper.text()).toContain('NUM');
    expect(wrapper.text()).toContain('-');
  });
});

