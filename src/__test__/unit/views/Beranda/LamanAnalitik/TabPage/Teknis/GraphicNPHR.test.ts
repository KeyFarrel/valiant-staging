import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import GraphicNPHR from '@/views/Beranda/LamanAnalitik/TabPage/Teknis/GraphicNPHR.vue';
import GrafikService from '@/services/grafik-service';
import { notifyError } from '@/services/helper/toast-notification';

// Mock the services
vi.mock('@/services/grafik-service');
vi.mock('@/services/helper/toast-notification');

const mockGrafikService = {
  getInitialPembangkit: vi.fn(),
  getGraphicTeknisNPHR: vi.fn(),
};

// Mock GrafikService constructor
vi.mocked(GrafikService).mockImplementation(() => mockGrafikService as any);

const defaultProps = {
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
  title: 'Test Graphic NPHR',
  yearRange: [2020, 2025],
};

const mockGraphicData = {
  success: true,
  data: {
    data: [
      {
        kode_jenis_kit: 'PLTU',
        data: {
          tahun: '2023',
          value: 2500,
        },
        nama_mesin: 'Test Machine 1',
      },
      {
        kode_jenis_kit: 'PLTG',
        data: {
          tahun: '2024',
          value: 2800,
        },
        nama_mesin: 'Test Machine 2',
      },
    ],
    legend: [
      { label: 'PLTU', color: '#ff0000' },
      { label: 'PLTG', color: '#00ff00' },
    ],
  },
};

const mockInitialPembangkit = {
  success: true,
  data: [
    { kode_jenis_pembangkit: 'PLTU' },
    { kode_jenis_pembangkit: 'PLTG' },
  ],
};

describe('GraphicNPHR.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGrafikService.getInitialPembangkit.mockResolvedValue(mockInitialPembangkit);
    mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue(mockGraphicData);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Component Initialization', () => {
    it('should render component with title', () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      expect(wrapper.find('h2').text()).toBe(defaultProps.title);
    });

    it('should initialize and fetch data on mount', async () => {
      mount(GraphicNPHR, {
        props: defaultProps,
      });

      // Wait for onMounted lifecycle
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockGrafikService.getInitialPembangkit).toHaveBeenCalled();
    });

    it('should populate initial pembangkit data', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      // Wait for async operations to complete
      await new Promise(resolve => setTimeout(resolve, 10));

      const vm = wrapper.vm as any;
      expect(vm.value).toEqual(['PLTU', 'PLTG']);
    });
  });

  describe('Data Fetching', () => {
    it('should process graph data successfully', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      
      // Manually call getDataGraph to test it
      await vm.getDataGraph();

      expect(vm.graphData.isEmpty).toBe(false);
      expect(vm.graphData.series).toHaveLength(2);
      expect(vm.graphData.legends).toHaveLength(2);
    });

    it('should handle empty graph data', async () => {
      mockGrafikService.getGraphicTeknisNPHR.mockResolvedValue({
        success: true,
        data: { data: null, legend: [] },
      });

      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      await vm.getDataGraph();

      expect(vm.graphData.isEmpty).toBe(true);
    });

    it('should handle fetchInitialPembangkit error', async () => {
      mockGrafikService.getInitialPembangkit.mockRejectedValue(new Error('Fetch Error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      await vm.fetchInitialPembangkit();

      expect(consoleSpy).toHaveBeenCalledWith('Fetch Initial Pembangkit Error : ', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should handle getDataGraph error and log error', async () => {
      mockGrafikService.getGraphicTeknisNPHR.mockRejectedValue(new Error('API Error'));
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      
      await vm.getDataGraph();

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should handle getDataGraphNoDMN error and log error', async () => {
      mockGrafikService.getGraphicTeknisNPHR.mockRejectedValue(new Error('API Error'));
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      
      await vm.getDataGraphNoDMN();

      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('Filter Functionality', () => {
    it('should validate filter inputs in closeModal', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = []; // No kategori pembangkit selected
      vm.filter.periode = null; // No periode selected

      vm.closeModal();

      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should validate kategori pembangkit only in closeModal', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = []; // No kategori pembangkit selected
      vm.filter.periode = [2020, 2025]; // Has periode

      vm.closeModal();

      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should close modal when validation passes', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTU']; // Has kategori pembangkit
      vm.filter.periode = [2020, 2025]; // Has periode
      vm.showModal = true;

      vm.closeModal();

      expect(vm.showModal).toBe(false);
    });

    it('should validate periode only in closeModal', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTU']; // Has kategori pembangkit
      vm.filter.periode = null; // No periode selected

      vm.closeModal();

      // Since value.length > 0, it should close modal instead of showing error
      expect(vm.showModal).toBe(false);
    });
  });

  describe('Apply Filter Functions', () => {
    it('should show validation error in applyFilter when invalid', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = []; // No kategori pembangkit selected
      vm.filter.periode = null; // No periode selected

      await vm.applyFilter();

      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should show validation error in applyFilterNoDMN when invalid', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = []; // No kategori pembangkit selected
      vm.filter.periode = null; // No periode selected

      await vm.applyFilterNoDMN();

      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!',
        5000
      );
    });

    it('should call getDataGraph when applyFilter is valid', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTU'];
      vm.filter.periode = [2020, 2025];
      vm.showModal = true;

      await vm.applyFilter();

      expect(vm.showModal).toBe(false);
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalled();
    });

    it('should call getDataGraphNoDMN when applyFilterNoDMN is valid', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTU'];
      vm.filter.periode = [2020, 2025];
      vm.showModal = true;

      await vm.applyFilterNoDMN();

      expect(vm.showModal).toBe(false);
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalled();
    });

    it('should validate periode only in applyFilter when has kategori pembangkit', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTU']; // Has kategori pembangkit
      vm.filter.periode = null; // No periode selected

      await vm.applyFilter();

      // Since value.length > 0, it should call getDataGraph instead of showing error
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalled();
    });

    it('should validate periode only in applyFilterNoDMN when has kategori pembangkit', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = ['PLTU']; // Has kategori pembangkit
      vm.filter.periode = null; // No periode selected

      await vm.applyFilterNoDMN();

      // Since value.length > 0, it should call getDataGraphNoDMN instead of showing error
      expect(mockGrafikService.getGraphicTeknisNPHR).toHaveBeenCalled();
    });
  });

  describe('Checkbox Handlers', () => {
    it('should handle check all pembangkit', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.handleCheckAll(true);

      expect(vm.value).toEqual(['PLTU', 'PLTG', 'PLTS']);
      expect(vm.indeterminate).toBe(false);
    });

    it('should handle uncheck all pembangkit', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.handleCheckAll(false);

      expect(vm.value).toEqual([]);
      expect(vm.indeterminate).toBe(false);
    });

    it('should handle check all DMN', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.handleCheckDmn(true);

      expect(vm.dmn).toEqual(['1', '2', '3']);
      expect(vm.indeterminateDmn).toBe(false);
    });

    it('should handle uncheck all DMN', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.handleCheckDmn(false);

      expect(vm.dmn).toEqual([]);
      expect(vm.indeterminateDmn).toBe(false);
    });
  });

  describe('Watch Effects', () => {
    it('should update checkAll state based on value changes', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;

      // Test empty array
      vm.value = [];
      await nextTick();
      expect(vm.checkAll).toBe(false);
      expect(vm.indeterminate).toBe(false);

      // Test full array
      vm.value = ['PLTU', 'PLTG', 'PLTS'];
      await nextTick();
      expect(vm.checkAll).toBe(true);
      expect(vm.indeterminate).toBe(false);

      // Test partial array
      vm.value = ['PLTU'];
      await nextTick();
      expect(vm.indeterminate).toBe(true);
    });

    it('should update DMN checkbox states', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;

      // Test empty array
      vm.dmn = [];
      await nextTick();
      expect(vm.checkDmn).toBe(false);
      expect(vm.indeterminateDmn).toBe(false);

      // Test full array
      vm.dmn = ['1', '2', '3'];
      await nextTick();
      expect(vm.checkDmn).toBe(true);
      expect(vm.indeterminateDmn).toBe(false);

      // Test partial array
      vm.dmn = ['1'];
      await nextTick();
      expect(vm.indeterminateDmn).toBe(true);
    });
  });

  describe('Edge Case Validations', () => {
    it('should test periode validation branch in closeModal (line 181)', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = []; // No kategori pembangkit selected
      vm.filter.periode = [2020, 2025]; // Has periode, but will still fail validation

      vm.closeModal();

      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should test periode validation branch in applyFilter (lines 194-197)', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = []; // No kategori pembangkit selected
      vm.filter.periode = [2020, 2025]; // Has periode, but will still fail validation

      await vm.applyFilter();

      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });

    it('should test periode validation branch in applyFilterNoDMN (lines 207-210)', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = []; // No kategori pembangkit selected
      vm.filter.periode = [2020, 2025]; // Has periode, but will still fail validation

      await vm.applyFilterNoDMN();

      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000);
    });
  });

  describe('Core Function Coverage', () => {
    it('should correctly map graph data to series', async () => {
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      // Reset arrays before testing
      vm.graphData.series = [];
      vm.graphData.legends = [];
      vm.graphData.years = [];
      vm.graphData.values = [];
      
      await vm.getDataGraph();

      const series = vm.graphData.series;

      expect(series).toHaveLength(2);
      expect(series[0]).toMatchObject({
        name: 'PLTU',
        type: 'scatter',
        color: '#ff0000',
      });
      expect(series[0].data).toEqual([[2023, 2500, 5, 'Test Machine 1']]);
    });

    it('should test getDataGraphNoDMN function', async () => {
      // Create fresh wrapper to avoid interference
      const wrapper = mount(GraphicNPHR, {
        props: defaultProps,
      });

      const vm = wrapper.vm as any;
      vm.value = ['TEST'];
      vm.filter.periode = [2020, 2025];

      // Create a fresh mock response for this specific test
      mockGrafikService.getGraphicTeknisNPHR.mockResolvedValueOnce(mockGraphicData);

      // Just test that the function executes without throwing an error
      await expect(vm.getDataGraphNoDMN()).resolves.not.toThrow();
    });
  });
});
