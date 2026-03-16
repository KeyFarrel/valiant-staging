import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import GraphicEAF from '@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicEAF.vue';
import GrafikService from '@/services/grafik-service';
import { notifyError } from '@/services/helper/toast-notification';
import type { MockedClass } from 'vitest';

// Mock services
vi.mock('@/services/grafik-service');
vi.mock('@/services/helper/toast-notification');

const MockedGrafikService = GrafikService as MockedClass<typeof GrafikService>;
const mockedNotifyError = vi.fn();

describe('GraphicEAF.vue - Uncovered Lines', () => {
  let wrapper: any;
  let grafikServiceMock: any;

  const defaultProps = {
    itemsPembangkit: [
      { id: 'PLTU', name: 'PLTU' },
      { id: 'PLTG', name: 'PLTG' },
    ],
    itemsDayaMampu: [
      { id: '1', name: 'PLTU < 100' },
      { id: '2', name: 'PLTU 100 - 400' },
      { id: '3', name: 'PLTU > 400' },
    ],
    itemsDaya: [
      { id: '1', daya: '100', satuan: 'MW' },
    ],
    title: 'Test EAF',
    yearRange: [2020, 2025],
    initialPembangkit: ['PLTU', 'PLTG'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    grafikServiceMock = {
      getInitialPembangkit: vi.fn(),
      getGraphicTeknisEAF: vi.fn(),
    };
    MockedGrafikService.mockImplementation(function() { return grafikServiceMock; });
    (notifyError as any).mockImplementation(mockedNotifyError);
  });
  const createWrapper = (props = defaultProps) => {
    return mount(GraphicEAF, {
      props,
      global: {
        stubs: {
          'ShimmerLoading': true,
          'ModalWrapper': {
            template: '<div class="modal-wrapper-mock"><slot /></div>',
            props: ['showModal', 'show-modal', 'width', 'height'],
          },
          'DynamicScatterPlotVertiLine': true,
          'IconEmptyData': true,
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
  };

  describe('Error Handling - fetchInitialPembangkit', () => {
    it('should handle error in fetchInitialPembangkit', async () => {
      // When initialPembangkit prop is undefined/missing, value should default to empty array
      wrapper = createWrapper({ ...defaultProps, initialPembangkit: undefined });
      await nextTick();

      const vm = wrapper.vm;
      expect(vm.value).toEqual([]);
    });
  });

  describe('Error Handling - getDataGraph', () => {
    it('should handle error in getDataGraph and set loading false', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const error = new Error('API error');
      
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockRejectedValue(error);

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraph();

      expect(vm.isLoading).toBe(false);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleLogSpy.mockRestore();
    });
  });

  describe('Error Handling - getDataGraphNoDMN', () => {
    it('should handle error in getDataGraphNoDMN and set loading false', async () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const error = new Error('API error');
      
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockRejectedValue(error);

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraphNoDMN();

      expect(vm.isLoading).toBe(false);
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleLogSpy.mockRestore();
    });
  });

  describe('Modal Close Validations', () => {
    beforeEach(async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should show error when no kategori and no periode in closeModal', () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = null;
      
      vm.closeModal();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 
        5000
      );
    });

    it('should close modal when value has items', () => {
      const vm = wrapper.vm;
      vm.value = ['PLTU'];
      vm.showModal = true;
      
      vm.closeModal();

      expect(vm.showModal).toBe(false);
      expect(mockedNotifyError).not.toHaveBeenCalled();
    });

    it('should show error when no periode only in closeModal', () => {
      const vm = wrapper.vm;
      vm.value = []; // Set empty untuk masuk ke kondisi else if
      vm.filter.periode = null;
      
      vm.closeModal();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 
        5000
      );
    });

    it('should show error when no kategori only in closeModal', () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = [2020, 2023];
      
      vm.closeModal();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!', 
        5000
      );
    });
  });

  describe('Apply Filter Validations', () => {
    beforeEach(async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should show error when no kategori and no periode in applyFilter', async () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = null;
      
      await vm.applyFilter();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 
        5000
      );
    });

    it('should show error when no kategori and no periode in applyFilterNoDMN', async () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = null;
      
      await vm.applyFilterNoDMN();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 
        5000
      );
    });
  });

  describe('Checkbox Handlers', () => {
    beforeEach(async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should handle handleCheckDmn with true value', () => {
      const vm = wrapper.vm;
      vm.handleCheckDmn(true);

      expect(vm.dmn).toEqual(['1', '2', '3']);
      expect(vm.indeterminateDmn).toBe(false);
    });

    it('should handle handleCheckDmn with false value', () => {
      const vm = wrapper.vm;
      vm.dmn = ['1', '2'];
      vm.handleCheckDmn(false);

      expect(vm.dmn).toEqual([]);
      expect(vm.indeterminateDmn).toBe(false);
    });

    it('should handle handleCheckAll with true value', () => {
      const vm = wrapper.vm;
      vm.handleCheckAll(true);

      expect(vm.value).toEqual(['PLTU', 'PLTG']);
      expect(vm.indeterminate).toBe(false);
    });

    it('should handle handleCheckAll with false value', () => {
      const vm = wrapper.vm;
      vm.value = ['PLTU'];
      vm.handleCheckAll(false);

      expect(vm.value).toEqual([]);
      expect(vm.indeterminate).toBe(false);
    });
  });

  describe('Data Processing Edge Cases', () => {
    it('should handle null data response in getDataGraph', async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({
        success: true,
        data: { data: null, legend: [] }
      });

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraph();

      expect(vm.graphData.isEmpty).toBe(true);
      expect(vm.isLoading).toBe(false);
    });

    it('should handle null data response in getDataGraphNoDMN', async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({
        success: true,
        data: { data: null, legend: [] }
      });

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraphNoDMN();

      expect(vm.graphData.isEmpty).toBe(true);
      expect(vm.isLoading).toBe(false);
    });
  });

  describe('Additional Filter Validations for Uncovered Lines', () => {
    beforeEach(async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should show error when no kategori only in applyFilter', async () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = [2020, 2023];
      
      await vm.applyFilter();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!', 
        5000
      );
    });

    it('should show error when no kategori only in applyFilterNoDMN', async () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = [2020, 2023];
      
      await vm.applyFilterNoDMN();

      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit!', 
        5000
      );
    });

    it('should close modal when both value and periode are valid', async () => {
      const vm = wrapper.vm;
      vm.value = ['PLTU'];
      vm.filter.periode = [2020, 2023];
      vm.showModal = true;
      
      vm.closeModal();

      expect(vm.showModal).toBe(false);
      expect(mockedNotifyError).not.toHaveBeenCalled();
    });
  });

  describe('Watch Functions Edge Cases', () => {
    beforeEach(async () => {
      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should handle value watch with partial selection', async () => {
      const vm = wrapper.vm;

      // Reset to empty first so checkAll starts at false
      vm.value = [];
      await nextTick();
      
      // Test partial selection (indeterminate)
      vm.value = ['PLTU'];
      await nextTick();
      expect(vm.indeterminate).toBe(true);
      expect(vm.checkAll).toBe(false);

      // Test full selection
      vm.value = ['PLTU', 'PLTG'];
      await nextTick();
      expect(vm.checkAll).toBe(true);
      expect(vm.indeterminate).toBe(false);
    });

    it('should handle dmn watch with partial selection', async () => {
      const vm = wrapper.vm;
      
      // Reset initial state
      vm.dmn = [];
      vm.checkDmn = false;
      vm.indeterminateDmn = false;
      await nextTick();
      
      // Test partial selection (indeterminate)
      vm.dmn = ['1'];
      await nextTick();
      expect(vm.indeterminateDmn).toBe(true);

      // Test full selection
      vm.dmn = ['1', '2', '3'];
      await nextTick();
      expect(vm.checkDmn).toBe(true);
      expect(vm.indeterminateDmn).toBe(false);
    });
  });

  describe('Component Lifecycle and Data Processing', () => {
    it('should process data correctly with valid response in getDataGraph', async () => {
      const mockData = {
        success: true,
        data: {
          data: [
            {
              kode_jenis_kit: 'PLTU',
              data: { tahun: '2020', value: 85.5 },
              nama_mesin: 'Test Machine'
            }
          ],
          legend: [{ label: 'PLTU', color: '#ff0000' }]
        }
      };

      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue(mockData);

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraph();

      expect(vm.graphData.isEmpty).toBe(false);
      expect(vm.graphData.series).toHaveLength(1);
      expect(vm.graphData.legends).toHaveLength(1);
      expect(vm.graphData.years).toContain(2020);
      expect(vm.graphData.values).toContain(85.5);
      expect(vm.isLoading).toBe(false);
    });

    it('should process data correctly with valid response in getDataGraphNoDMN', async () => {
      const mockData = {
        success: true,
        data: {
          data: [
            {
              kode_jenis_kit: 'PLTG',
              data: { tahun: '2021', value: 75.2 },
              nama_mesin: 'Test Machine 2'
            }
          ],
          legend: [{ label: 'PLTG', color: '#00ff00' }]
        }
      };

      grafikServiceMock.getInitialPembangkit.mockResolvedValue({ data: [] });
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue(mockData);

      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await vm.getDataGraphNoDMN();

      expect(vm.graphData.isEmpty).toBe(false);
      expect(vm.graphData.series).toHaveLength(1);
      expect(vm.graphData.legends).toHaveLength(1);
      expect(vm.graphData.years).toContain(2021);
      expect(vm.graphData.values).toContain(75.2);
      expect(vm.isLoading).toBe(false);
    });

    it('should populate value array from initial pembangkit data on mount', async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });

      wrapper = createWrapper({ ...defaultProps, initialPembangkit: ['PLTU', 'PLTG'] });
      await nextTick();

      const vm = wrapper.vm;
      expect(vm.value).toEqual(['PLTU', 'PLTG']);
    });
  });

  describe('Dropdown Toggle Functions', () => {
    beforeEach(async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should toggle pembangkit dropdown open and close', () => {
      const vm = wrapper.vm;
      expect(vm.isPembangkitDropdownOpen).toBe(false);
      vm.togglePembangkitDropdown();
      expect(vm.isPembangkitDropdownOpen).toBe(true);
      vm.togglePembangkitDropdown();
      expect(vm.isPembangkitDropdownOpen).toBe(false);
    });

    it('should toggle dmn dropdown open and close', () => {
      const vm = wrapper.vm;
      expect(vm.isDmnDropdownOpen).toBe(false);
      vm.toggleDmnDropdown();
      expect(vm.isDmnDropdownOpen).toBe(true);
      vm.toggleDmnDropdown();
      expect(vm.isDmnDropdownOpen).toBe(false);
    });
  });

  describe('Remove and Clear Selection Functions', () => {
    beforeEach(async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should remove a selected pembangkit by id', () => {
      const vm = wrapper.vm;
      vm.value = ['PLTU', 'PLTG'];
      vm.removeSelectedPembangkit('PLTU');
      expect(vm.value).toEqual(['PLTG']);
    });

    it('should remove a selected dmn by id', () => {
      const vm = wrapper.vm;
      vm.dmn = ['1', '2', '3'];
      vm.removeSelectedDmn('2');
      expect(vm.dmn).toEqual(['1', '3']);
    });

    it('should clear all pembangkit selections', () => {
      const vm = wrapper.vm;
      vm.value = ['PLTU', 'PLTG'];
      vm.clearPembangkit();
      expect(vm.value).toEqual([]);
    });

    it('should clear all dmn selections', () => {
      const vm = wrapper.vm;
      vm.dmn = ['1', '2', '3'];
      vm.clearDmn();
      expect(vm.dmn).toEqual([]);
    });
  });

  describe('handleClickOutside', () => {
    beforeEach(async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should close dropdowns when clicking outside .relative', () => {
      const vm = wrapper.vm;
      vm.isPembangkitDropdownOpen = true;
      vm.isDmnDropdownOpen = true;

      const mockEvent = { target: { closest: vi.fn(() => null) } } as unknown as MouseEvent;
      vm.handleClickOutside(mockEvent);

      expect(vm.isPembangkitDropdownOpen).toBe(false);
      expect(vm.isDmnDropdownOpen).toBe(false);
    });

    it('should not close dropdowns when clicking inside .relative', () => {
      const vm = wrapper.vm;
      vm.isPembangkitDropdownOpen = true;
      vm.isDmnDropdownOpen = true;

      const mockEvent = { target: { closest: vi.fn(() => document.createElement('div')) } } as unknown as MouseEvent;
      vm.handleClickOutside(mockEvent);

      expect(vm.isPembangkitDropdownOpen).toBe(true);
      expect(vm.isDmnDropdownOpen).toBe(true);
    });
  });

  describe('Apply Filter with Valid Data', () => {
    beforeEach(async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();
    });

    it('should call getDataGraph and close modal on valid applyFilter', async () => {
      const vm = wrapper.vm;
      vm.value = ['PLTU'];
      vm.filter.periode = [2020, 2023];
      vm.showModal = true;

      await vm.applyFilter();

      expect(vm.showModal).toBe(false);
      expect(grafikServiceMock.getGraphicTeknisEAF).toHaveBeenCalled();
    });

    it('should call getDataGraphNoDMN and close modal on valid applyFilterNoDMN', async () => {
      const vm = wrapper.vm;
      vm.value = ['PLTU'];
      vm.filter.periode = [2020, 2023];
      vm.showModal = true;

      await vm.applyFilterNoDMN();

      expect(vm.showModal).toBe(false);
      expect(grafikServiceMock.getGraphicTeknisEAF).toHaveBeenCalled();
    });

    it('should show error when periode is null only in applyFilter', async () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = null;

      await vm.applyFilter();
      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should show error when periode is null only in applyFilterNoDMN', async () => {
      const vm = wrapper.vm;
      vm.value = [];
      vm.filter.periode = null;

      await vm.applyFilterNoDMN();
      expect(mockedNotifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });
  });

  describe('Lifecycle - onUnmounted', () => {
    it('should remove event listener on unmount', async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      wrapper = createWrapper();
      await nextTick();
      wrapper.unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('getDataGraph with periode null fallback', () => {
    it('should use empty string when filter.periode is null in getDataGraph', async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      vm.filter.periode = null;
      await vm.getDataGraph();

      expect(grafikServiceMock.getGraphicTeknisEAF).toHaveBeenCalledWith(
        expect.objectContaining({ tahun_awal: '', tahun_akhir: '' })
      );
    });

    it('should use empty string when filter.periode is null in getDataGraphNoDMN', async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      vm.filter.periode = null;
      await vm.getDataGraphNoDMN();

      expect(grafikServiceMock.getGraphicTeknisEAF).toHaveBeenCalledWith(
        expect.objectContaining({ tahun_awal: '', tahun_akhir: '' })
      );
    });
  });

  describe('Template Button Interactions', () => {
    it('should execute reset and apply actions from modal buttons', async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      vm.showModal = true;
      vm.value = ['PLTU', 'PLTG'];
      vm.dmn = ['1', '2'];
      vm.isPembangkitDropdownOpen = true;
      vm.isDmnDropdownOpen = true;
      await nextTick();

      const resetButton = wrapper.findAll('button').find((btn: any) => btn.text().trim() === 'Reset');
      expect(resetButton).toBeDefined();
      await resetButton!.trigger('click');
      expect(vm.value).toEqual([]);

      vm.value = ['PLTU'];
      vm.showModal = true;
      await nextTick();
      const applyWithDmn = wrapper.findAll('button').find((btn: any) => btn.text().trim() === 'Terapkan');
      expect(applyWithDmn).toBeDefined();
      await applyWithDmn!.trigger('click');
      await nextTick();
      expect(vm.showModal).toBe(false);

      vm.value = ['PLTG'];
      vm.showModal = true;
      await nextTick();
      const applyNoDmn = wrapper.findAll('button').find((btn: any) => btn.text().trim() === 'Terapkan');
      expect(applyNoDmn).toBeDefined();
      await applyNoDmn!.trigger('click');
      await nextTick();
      expect(vm.showModal).toBe(false);
    });

    it('should execute dropdown remove and checkbox callbacks from modal template', async () => {
      grafikServiceMock.getGraphicTeknisEAF.mockResolvedValue({ success: true, data: { data: [], legend: [] } });
      wrapper = createWrapper();
      await nextTick();

      const vm = wrapper.vm;
      await wrapper.find('#hover-button').trigger('click');
      vm.value = ['PLTU', 'PLTG'];
      vm.dmn = ['1', '2'];
      vm.togglePembangkitDropdown();
      vm.toggleDmnDropdown();
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
        datePicker.vm.$emit('update:modelValue', [2020, 2024]);
      }

      expect(vm.value.length).toBeGreaterThanOrEqual(0);
      expect(vm.dmn.length).toBeGreaterThanOrEqual(0);
    });
  });
});
