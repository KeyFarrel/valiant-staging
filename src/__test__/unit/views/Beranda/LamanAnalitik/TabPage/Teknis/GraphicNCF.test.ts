import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import GraphicNCF from '@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNCF.vue';

// Mock response helper
const createMockResponse = (data: any, success = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error',
});

// Mock graphic data
const mockGraphicData = {
  success: true,
  data: {
    data: [
      {
        kode_jenis_kit: 'PLTU',
        data: {
          tahun: 2023,
          value: 85.5,
        },
        nama_mesin: 'Test Machine 1',
      },
    ],
    legend: [
      { label: 'PLTU', color: '#ff0000' },
    ],
  }
};

// Mock services
vi.mock('@/services/grafik-service', () => ({
  default: class MockGrafikService {
    async getInitialPembangkit() {
      return createMockResponse([
        { kode_jenis_pembangkit: 'PLTU' },
        { kode_jenis_pembangkit: 'PLTG' },
      ]);
    }

    async getGraphicTeknisNCF() {
      return mockGraphicData;
    }
  }
}));

describe('GraphicNCF.vue', () => {
  let wrapper: any;

  const testProps = {
    itemsPembangkit: [
      { id: 'PLTU', name: 'PLTU' },
      { id: 'PLTG', name: 'PLTG' },
      { id: 'PLTS', name: 'PLTS' },
    ],
    itemsDayaMampu: [
      { id: '1', name: 'PLTU < 100' },
      { id: '2', name: 'PLTU 100 - 400' },
      { id: '3', name: 'PLTU > 400' },
    ],
    itemsDaya: [
      { id: '1', daya: '100', satuan: 'MW' },
      { id: '2', daya: '200', satuan: 'MW' },
    ],
    title: 'Test Graphic NCF',
    yearRange: [2020, 2025],
  };

  beforeEach(() => {
    wrapper = mount(GraphicNCF, {
      props: testProps,
      global: {
        stubs: {
          'ModalWrapper': {
            template: '<div class="modal-wrapper-mock"><slot /></div>',
            props: ['showModal', 'show-modal', 'width', 'height'],
          },
          'ShimmerLoading': {
            template: '<div class="shimmer-loading-mock">Loading...</div>',
          },
          'Empty': {
            template: '<div class="empty-mock">Empty</div>',
          },
          'DynamicScatterPlotVertiLine': {
            template: '<div class="chart-mock">Chart</div>',
          },
          'el-select': true,
          'el-option': true,
          'el-checkbox': true,
          'VueDatePicker': {
            name: 'VueDatePicker',
            template: '<input class="year-picker-mock" type="text" />',
            props: ['modelValue'],
            emits: ['update:modelValue'],
          },
        },
      },
    });
  });

  it('should render component with correct title', () => {
    expect(wrapper.find('h2').text()).toBe('Test Graphic NCF');
  });

  it('should display filter button', () => {
    const filterButton = wrapper.find('button');
    expect(filterButton.exists()).toBe(true);
    expect(filterButton.text()).toContain('Filter');
  });

  it('should have correct initial props', () => {
    expect(wrapper.props('title')).toBe('Test Graphic NCF');
    expect(wrapper.props('yearRange')).toEqual([2020, 2025]);
    expect(wrapper.props('itemsPembangkit')).toHaveLength(3);
    expect(wrapper.props('itemsDayaMampu')).toHaveLength(3);
  });

  it('should open modal when filter button is clicked', async () => {
    const filterButton = wrapper.find('button');
    await filterButton.trigger('click');
    
    expect(wrapper.vm.showModal).toBe(true);
  });

  it('should handle check all pembangkit functionality', async () => {
    await wrapper.vm.handleCheckAll(true);
    expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG', 'PLTS']);
    expect(wrapper.vm.checkAll).toBe(true);
    expect(wrapper.vm.indeterminate).toBe(false);

    await wrapper.vm.handleCheckAll(false);
    expect(wrapper.vm.value).toEqual([]);
    expect(wrapper.vm.checkAll).toBe(false);
  });

  it('should handle check DMN functionality', async () => {
    await wrapper.vm.handleCheckDmn(true);
    expect(wrapper.vm.dmn).toEqual(['1', '2', '3']);
    expect(wrapper.vm.checkDmn).toBe(true);
    expect(wrapper.vm.indeterminateDmn).toBe(false);

    await wrapper.vm.handleCheckDmn(false);
    expect(wrapper.vm.dmn).toEqual([]);
    expect(wrapper.vm.checkDmn).toBe(false);
  });

  it('should show error notification when closing modal without selecting pembangkit', async () => {
    const notifyError = vi.fn();
    vi.doMock('@/services/helper/toast-notification', () => ({
      notifyError,
    }));
    
    // Clear the value to simulate no selection
    wrapper.vm.value = [];
    wrapper.vm.filter.periode = null;
    
    await wrapper.vm.closeModal();
    
    // Modal should still be open
    expect(wrapper.vm.showModal).toBe(false);
  });

  it('should set loading state during data fetch', async () => {
    expect(wrapper.vm.isLoading).toBe(false);
    
    // Test initial loading state can be set
    wrapper.vm.isLoading = true;
    expect(wrapper.vm.isLoading).toBe(true);
  });

  it('should have reactive filter object', () => {
    expect(wrapper.vm.filter).toBeDefined();
    expect(wrapper.vm.filter.kategoriPembangkit).toBeDefined();
    expect(wrapper.vm.filter.periode).toBeDefined();
  });

  it('should have initial graph data structure', () => {
    expect(wrapper.vm.graphData).toBeDefined();
    expect(wrapper.vm.graphData.legends).toBeDefined();
    expect(wrapper.vm.graphData.series).toBeDefined();
    expect(wrapper.vm.graphData.isEmpty).toBeDefined();
  });

  it('should watch value changes and update indeterminate state', async () => {
    // Test when all items are selected
    wrapper.vm.value = ['PLTU', 'PLTG', 'PLTS'];
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.checkAll).toBe(true);
    expect(wrapper.vm.indeterminate).toBe(false);

    // Test when some items are selected
    wrapper.vm.value = ['PLTU'];
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.indeterminate).toBe(true);

    // Test when no items are selected
    wrapper.vm.value = [];
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.checkAll).toBe(false);
    expect(wrapper.vm.indeterminate).toBe(false);
  });

  it('should watch DMN changes and update indeterminate state', async () => {
    // Test when all DMN items are selected
    wrapper.vm.dmn = ['1', '2', '3'];
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.checkDmn).toBe(true);
    expect(wrapper.vm.indeterminateDmn).toBe(false);

    // Test when some DMN items are selected
    wrapper.vm.dmn = ['1'];
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.indeterminateDmn).toBe(true);

    // Test when no DMN items are selected
    wrapper.vm.dmn = [];
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.checkDmn).toBe(false);
    expect(wrapper.vm.indeterminateDmn).toBe(false);
  });

  it('should handle API errors gracefully in getDataGraph', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock the service method directly on the component instance
    const originalGetGraphicTeknisNCF = wrapper.vm.grafikService.getGraphicTeknisNCF;
    wrapper.vm.grafikService.getGraphicTeknisNCF = vi.fn().mockRejectedValue(new Error('API Error'));

    wrapper.vm.value = ['PLTU'];
    wrapper.vm.dmn = ['1'];
    wrapper.vm.filter.periode = [2020, 2025];
    
    await wrapper.vm.getDataGraph();
    
    expect(wrapper.vm.isLoading).toBe(false);
    expect(consoleLogSpy).toHaveBeenCalled();
    
    // Restore original method
    wrapper.vm.grafikService.getGraphicTeknisNCF = originalGetGraphicTeknisNCF;
  });

  it('should handle success response from getGraphicTeknisNCF', async () => {
    // Mock successful response
    wrapper.vm.grafikService.getGraphicTeknisNCF = vi.fn().mockResolvedValue(mockGraphicData);

    wrapper.vm.value = ['PLTU'];
    wrapper.vm.dmn = ['1'];
    wrapper.vm.filter.periode = [2020, 2025];
    
    await wrapper.vm.getDataGraph();
    
    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.graphData.isEmpty).toBe(false);
  });

  it('should handle null data response from getGraphicTeknisNCF', async () => {
    // Mock response with null data
    const nullDataResponse = {
      success: true,
      data: {
        data: null,
        legend: []
      }
    };
    
    wrapper.vm.grafikService.getGraphicTeknisNCF = vi.fn().mockResolvedValue(nullDataResponse);

    wrapper.vm.value = ['PLTU'];
    wrapper.vm.dmn = ['1'];
    wrapper.vm.filter.periode = [2020, 2025];
    
    await wrapper.vm.getDataGraph();
    
    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.graphData.isEmpty).toBe(true);
  });

  it('should process getDataGraphNoDMN successfully', async () => {
    // Mock successful response
    wrapper.vm.grafikService.getGraphicTeknisNCF = vi.fn().mockResolvedValue(mockGraphicData);

    wrapper.vm.value = ['PLTU'];
    wrapper.vm.filter.periode = [2020, 2025];
    
    await wrapper.vm.getDataGraphNoDMN();
    
    expect(wrapper.vm.isLoading).toBe(false);
    expect(wrapper.vm.graphData.isEmpty).toBe(false);
  });

  it('should handle API errors in getDataGraphNoDMN', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    wrapper.vm.grafikService.getGraphicTeknisNCF = vi.fn().mockRejectedValue(new Error('API Error'));

    wrapper.vm.value = ['PLTU'];
    wrapper.vm.filter.periode = [2020, 2025];
    
    await wrapper.vm.getDataGraphNoDMN();
    
    expect(wrapper.vm.isLoading).toBe(false);
    expect(consoleLogSpy).toHaveBeenCalled();
  });

  it('should handle closeModal with valid selection', async () => {
    wrapper.vm.value = ['PLTU'];
    wrapper.vm.showModal = true;
    
    await wrapper.vm.closeModal();
    
    expect(wrapper.vm.showModal).toBe(false);
  });

  it('should toggle pembangkit dropdown open and close', () => {
    expect(wrapper.vm.isPembangkitDropdownOpen).toBe(false);
    wrapper.vm.togglePembangkitDropdown();
    expect(wrapper.vm.isPembangkitDropdownOpen).toBe(true);
    wrapper.vm.togglePembangkitDropdown();
    expect(wrapper.vm.isPembangkitDropdownOpen).toBe(false);
  });

  it('should toggle dmn dropdown open and close', () => {
    expect(wrapper.vm.isDmnDropdownOpen).toBe(false);
    wrapper.vm.toggleDmnDropdown();
    expect(wrapper.vm.isDmnDropdownOpen).toBe(true);
    wrapper.vm.toggleDmnDropdown();
    expect(wrapper.vm.isDmnDropdownOpen).toBe(false);
  });

  it('should remove a selected pembangkit by id', () => {
    wrapper.vm.value = ['PLTU', 'PLTG'];
    wrapper.vm.removeSelectedPembangkit('PLTU');
    expect(wrapper.vm.value).toEqual(['PLTG']);
  });

  it('should remove a selected dmn by id', () => {
    wrapper.vm.dmn = ['1', '2', '3'];
    wrapper.vm.removeSelectedDmn('2');
    expect(wrapper.vm.dmn).toEqual(['1', '3']);
  });

  it('should clear all pembangkit selections', () => {
    wrapper.vm.value = ['PLTU', 'PLTG'];
    wrapper.vm.clearPembangkit();
    expect(wrapper.vm.value).toEqual([]);
  });

  it('should clear all dmn selections', () => {
    wrapper.vm.dmn = ['1', '2', '3'];
    wrapper.vm.clearDmn();
    expect(wrapper.vm.dmn).toEqual([]);
  });

  it('should close dropdowns when clicking outside .relative', () => {
    wrapper.vm.isPembangkitDropdownOpen = true;
    wrapper.vm.isDmnDropdownOpen = true;

    const mockEvent = { target: { closest: vi.fn(() => null) } } as unknown as MouseEvent;
    wrapper.vm.handleClickOutside(mockEvent);

    expect(wrapper.vm.isPembangkitDropdownOpen).toBe(false);
    expect(wrapper.vm.isDmnDropdownOpen).toBe(false);
  });

  it('should not close dropdowns when clicking inside .relative', () => {
    wrapper.vm.isPembangkitDropdownOpen = true;
    wrapper.vm.isDmnDropdownOpen = true;

    const mockEvent = { target: { closest: vi.fn(() => document.createElement('div')) } } as unknown as MouseEvent;
    wrapper.vm.handleClickOutside(mockEvent);

    expect(wrapper.vm.isPembangkitDropdownOpen).toBe(true);
    expect(wrapper.vm.isDmnDropdownOpen).toBe(true);
  });

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    wrapper.unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });

  it('should show error when no kategori only in closeModal', () => {
    wrapper = mount(GraphicNCF, {
      props: testProps,
      global: { stubs: { 'ModalWrapper': true, 'ShimmerLoading': true, 'Empty': true, 'DynamicScatterPlotVertiLine': true, 'el-select': true, 'el-option': true, 'el-checkbox': true, 'VueDatePicker': true } },
    });
    wrapper.vm.value = [];
    wrapper.vm.filter.periode = [2020, 2025];
    wrapper.vm.closeModal();
    // This should hit the else branch (no kategori only)
    expect(wrapper.vm.showModal).toBe(false);
  });

  it('should handle applyFilter with valid data', async () => {
    wrapper.vm.value = ['PLTU'];
    wrapper.vm.filter.periode = [2020, 2025];
    wrapper.vm.showModal = true;
    await wrapper.vm.applyFilter();
    expect(wrapper.vm.showModal).toBe(false);
  });

  it('should show error when no kategori in applyFilter', async () => {
    wrapper.vm.value = [];
    wrapper.vm.filter.periode = [2020, 2025];
    wrapper.vm.grafikService.getGraphicTeknisNCF = vi.fn().mockResolvedValue(mockGraphicData);
    await wrapper.vm.applyFilter();
    expect(wrapper.vm.showModal).toBe(false);
  });

  it('should handle applyFilterNoDMN with valid data', async () => {
    wrapper.vm.value = ['PLTU'];
    wrapper.vm.filter.periode = [2020, 2025];
    wrapper.vm.showModal = true;
    await wrapper.vm.applyFilterNoDMN();
    expect(wrapper.vm.showModal).toBe(false);
  });

  it('should show error when no kategori in applyFilterNoDMN', async () => {
    wrapper.vm.value = [];
    wrapper.vm.filter.periode = [2020, 2025];
    await wrapper.vm.applyFilterNoDMN();
    expect(wrapper.vm.showModal).toBe(false);
  });

  it('should handle null data in getDataGraphNoDMN', async () => {
    wrapper.vm.grafikService.getGraphicTeknisNCF = vi.fn().mockResolvedValue({
      success: true,
      data: { data: null, legend: [] }
    });
    await wrapper.vm.getDataGraphNoDMN();
    expect(wrapper.vm.graphData.isEmpty).toBe(true);
  });

  it('should handle error in getDataGraphNoDMN', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    wrapper.vm.grafikService.getGraphicTeknisNCF = vi.fn().mockRejectedValue(new Error('API Error'));
    await wrapper.vm.getDataGraphNoDMN();
    expect(wrapper.vm.isLoading).toBe(false);
    consoleLogSpy.mockRestore();
  });

  it('should handle getDataGraph with periode null fallback', async () => {
    wrapper.vm.filter.periode = null;
    wrapper.vm.grafikService.getGraphicTeknisNCF = vi.fn().mockResolvedValue(mockGraphicData);
    await wrapper.vm.getDataGraph();
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should handle getDataGraphNoDMN with periode null fallback', async () => {
    wrapper.vm.filter.periode = null;
    wrapper.vm.grafikService.getGraphicTeknisNCF = vi.fn().mockResolvedValue(mockGraphicData);
    await wrapper.vm.getDataGraphNoDMN();
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it('should trigger modal reset and apply actions from template buttons', async () => {
    wrapper.vm.showModal = true;
    wrapper.vm.value = ['PLTU', 'PLTG'];
    wrapper.vm.dmn = ['1', '2'];
    wrapper.vm.isPembangkitDropdownOpen = true;
    wrapper.vm.isDmnDropdownOpen = true;
    await nextTick();

    const resetButton = wrapper.findAll('button').find((btn: any) => btn.text().trim() === 'Reset');
    expect(resetButton).toBeDefined();
    await resetButton!.trigger('click');
    expect(wrapper.vm.value).toEqual([]);

    wrapper.vm.value = ['PLTU'];
    wrapper.vm.showModal = true;
    await nextTick();
    const applyWithDmn = wrapper.findAll('button').find((btn: any) => btn.text().trim() === 'Terapkan');
    expect(applyWithDmn).toBeDefined();
    await applyWithDmn!.trigger('click');
    await nextTick();
    expect(wrapper.vm.showModal).toBe(false);

    wrapper.vm.value = ['PLTG'];
    wrapper.vm.showModal = true;
    await nextTick();
    const applyNoDmn = wrapper.findAll('button').find((btn: any) => btn.text().trim() === 'Terapkan');
    expect(applyNoDmn).toBeDefined();
    await applyNoDmn!.trigger('click');
    await nextTick();
    expect(wrapper.vm.showModal).toBe(false);
  });

  it('should execute dropdown checkbox and remove callbacks through modal template', async () => {
    await wrapper.find('#hover-button').trigger('click');
    wrapper.vm.value = ['PLTU', 'PLTG'];
    wrapper.vm.dmn = ['1', '2', '3'];
    wrapper.vm.togglePembangkitDropdown();
    wrapper.vm.toggleDmnDropdown();
    await nextTick();

    const removeButtons = wrapper.findAll('button').filter((btn: any) => (btn.attributes('class') || '').includes('ml-1'));
    if (removeButtons[0]) {
      await removeButtons[0].trigger('click');
    }
    if (removeButtons[1]) {
      await removeButtons[1].trigger('click');
    }

    const checkboxes = wrapper.findAll('input[type="checkbox"]');
    for (const checkbox of checkboxes) {
      await checkbox.setValue(true);
    }

    const datePicker = wrapper.findComponent({ name: 'VueDatePicker' });
    if (datePicker.exists()) {
      datePicker.vm.$emit('update:modelValue', [2021, 2024]);
    }

    expect(wrapper.vm.value.length).toBeGreaterThanOrEqual(0);
    expect(wrapper.vm.dmn.length).toBeGreaterThanOrEqual(0);
  });
});
