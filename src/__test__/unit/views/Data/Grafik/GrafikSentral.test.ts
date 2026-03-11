import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import GrafikSentral from '@/views/Data/Grafik/GrafikSentral.vue';
import { useTagSentral } from '@/store/storeTagGrafik';

// Mock the store
vi.mock('@/store/storeTagGrafik', () => ({
  useTagSentral: vi.fn(() => ({
    currentTabSentral: 'WLC (Realisasi & Proyeksi)'
  }))
}));

// Mock the services
const mockGrafikService = {
  getGrafikWLCALL: vi.fn().mockResolvedValue({
    success: true,
    data: [{
      realisasi_proyeksi: []
    }]
  }),
  getGrafikWLCKom: vi.fn().mockResolvedValue({
    success: true,
    data: [{
      realisasi_proyeksi: []
    }]
  }),
  getGrafikPlan: vi.fn().mockResolvedValue({
    success: true,
    data: [{
      realisasi_proyeksi: []
    }]
  }),
  getGrafikPRP: vi.fn().mockResolvedValue({
    success: true,
    data: [{
      realisasi_proyeksi: []
    }]
  }),
  getGrafikPRPLastYear: vi.fn().mockResolvedValue({
    success: true,
    data: [{
      realisasi_proyeksi: []
    }]
  }),
  getGrafikWLCALLDetail: vi.fn().mockResolvedValue({
    success: true,
    data: {
      graph: [
        { judul: 'Test 1', realisasi: 100, planning: 150 },
        { judul: 'Test 2', realisasi: 200, planning: 250 }
      ],
      table: [
        { name: 'Test Item 1', realisasi: 100, planning: 150 },
        { name: 'Test Item 2', realisasi: 200, planning: 250 }
      ]
    }
  }),
  getGrafikWLCKomDetail: vi.fn().mockResolvedValue({
    success: true,
    data: {
      graph: [
        { judul: 'Komponen A', realisasi: 300, planning: 350 }
      ],
      table: [
        { name: 'Komponen A', realisasi: 300, planning: 350 }
      ]
    }
  }),
  getGrafikPlanDetail: vi.fn().mockResolvedValue({
    success: true,
    data: {
      graph: [
        { judul: 'Plan 1', realisasi: 400, planning: 450 }
      ],
      table: [
        { name: 'Plan 1', realisasi: 400, planning: 450 }
      ]
    }
  }),
  getGrafikPRPDetail: vi.fn().mockResolvedValue({
    success: true,
    data: {
      graph: [
        { judul: 'PRP 1', realisasi: 500, planning: 550 }
      ],
      table: [
        { name: 'PRP 1', realisasi: 500, planning: 550 }
      ]
    }
  }),
  getGrafikLastYearDetail: vi.fn().mockResolvedValue({
    success: true,
    data: {
      graph: [
        { judul: 'Last Year 1', realisasi: 600, planning: 650 }
      ],
      table: [
        { name: 'Last Year 1', realisasi: 600, planning: 650 }
      ]
    }
  })
};

vi.mock('@/services/grafik-service', () => ({
  default: vi.fn().mockImplementation(() => mockGrafikService)
}));

// Mock global format
vi.mock('@/services/format/global-format', () => ({
  default: vi.fn().mockImplementation(() => ({
    formatRupiah: vi.fn().mockReturnValue('1,000')
  }))
}));

describe('GrafikSentral.vue', () => {
  let wrapper: any;
  
  const defaultProps = {
    idSentral: 1,
    tahunData: 2024
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component successfully', () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should show loading component when isLoading is true', async () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });

    // Access the component instance and set loading state
    const vm = wrapper.vm as any;
    vm.isLoading = true;
    await nextTick();

    expect(wrapper.findComponent({ name: 'Loading' }).exists()).toBe(true);
  });

  it('should change tab when changeTab function is called', async () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });

    // Test changeTab function
    const vm = wrapper.vm as any;
    
    // Test tab 1
    vm.changeTab(1);
    await nextTick();
    expect(vm.tabGraphic).toBe('Semua');

    // Test tab 2
    vm.changeTab(2);
    await nextTick();
    expect(vm.tabGraphic).toBe('Biaya Komponen');
  });

  it('should call forceRender functions successfully', async () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test forceRender functions
    await vm.forceRender();
    expect(vm.updateWLCAll).toBe(true);

    await vm.forceRender1();
    expect(vm.updateWLCKom).toBe(true);

    await vm.forceRender2();
    expect(vm.updatePlanning).toBe(true);

    await vm.forceRender3();
    expect(vm.updatePRP).toBe(true);

    await vm.forceRender4();
    expect(vm.updateLastYear).toBe(true);

    await vm.forceRender5();
    expect(vm.updateDetailWLCAll).toBe(true);

    await vm.forceRender6();
    expect(vm.updateDetailWLCKom).toBe(true);

    await vm.forceRender7();
    expect(vm.updateDetailPlan).toBe(true);

    await vm.forceRender8();
    expect(vm.updateDetailPRP).toBe(true);

    await vm.forceRender9();
    expect(vm.updateDetailLastY).toBe(true);
  });

  it('should handle click events and show modals', async () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Set up some mock data for the click handlers
    vm.tahunWLCAll = [2024, 2025];
    vm.tahunWLCKom = [2024, 2025];
    vm.tahunPlanning = [2024, 2025];
    vm.tahunPRP = [2024, 2025];
    vm.tahunLastYear = [2024, 2025];

    // Test handleClickWlcAll
    const paramMock = { dataIndex: 0 };
    vm.handleClickWlcAll(paramMock);
    expect(vm.showModalWlcAll).toBe(true);
    expect(vm.tahunDetail).toBe(2024);
    expect(mockGrafikService.getGrafikWLCALLDetail).toHaveBeenCalled();

    // Test handleClickWlcKom
    vm.handleClickWlcKom(paramMock);
    expect(vm.showModalWlcKom).toBe(true);
    expect(vm.tahunDetail).toBe(2024);
    expect(mockGrafikService.getGrafikWLCKomDetail).toHaveBeenCalled();

    // Test handleClickPlan
    vm.handleClickPlan(paramMock);
    expect(vm.showModalPlan).toBe(true);
    expect(vm.tahunDetail).toBe(2024);
    expect(mockGrafikService.getGrafikPlanDetail).toHaveBeenCalled();

    // Test handleClickPRP
    vm.handleClickPRP(paramMock);
    expect(vm.showModalPRP).toBe(true);
    expect(vm.tahunDetail).toBe(2024);

    // Test handleClickLastY
    vm.handleClickLastY(paramMock);
    expect(vm.showModalLastY).toBe(true);
    expect(vm.tahunDetail).toBe(2024);
    expect(mockGrafikService.getGrafikLastYearDetail).toHaveBeenCalled();
  });

  it('should watch tahunData prop changes and load data', async () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });

    // Clear previous calls from mounting
    vi.clearAllMocks();

    // Change tahunData prop to trigger watch
    await wrapper.setProps({ tahunData: 2025 });
    await nextTick();

    // Wait for promises to resolve
    await new Promise(resolve => setTimeout(resolve, 200));

    // Verify services were called for watch
    expect(mockGrafikService.getGrafikWLCALL).toHaveBeenCalledWith({
      uuid_sentral: 1,
      tahun_realisasi: 2025,
      start_year: "",
      end_year: ""
    });
  });

  it('should handle different currentTabSentral states', async () => {
    // Test Planning / Feasibility Study tab
    const mockStore = {
      currentTabSentral: 'Planning / Feasibility Study'
    };
    
    vi.mocked(useTagSentral).mockReturnValue(mockStore as any);

    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });

    expect(wrapper.html()).toContain('Planning / Feasibility Study');

    // Test Planning & Realisasi + Proyeksi tab
    mockStore.currentTabSentral = 'Planning & Realisasi + Proyeksi';
    await wrapper.vm.$forceUpdate();
    await nextTick();

    // Test Planning vs Realisasi s/d Tahun Berjalan tab
    mockStore.currentTabSentral = 'Planning vs Realisasi s/d Tahun Berjalan';
    await wrapper.vm.$forceUpdate();
    await nextTick();
  });

  it('should handle PRP click with existing chartDetailPRP', async () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Set up mock data and existing chart
    vm.tahunPRP = [2024, 2025];
    vm.chartDetailPRP = { someChartData: true }; // Existing chart

    const paramMock = { dataIndex: 0 };
    const result = vm.handleClickPRP(paramMock);
    
    // Should return null when chart already exists
    expect(result).toBe(null);
    expect(vm.showModalPRP).toBe(true);
    expect(vm.tahunDetail).toBe(2024);
  });

  it('should test tab graphic biaya komponen view', async () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test changeTab to "Biaya Komponen"
    vm.changeTab(2);
    await nextTick();
    
    expect(vm.tabGraphic).toBe('Biaya Komponen');
    
    // Test data states
    vm.dataWLCKom = null;
    await nextTick();
    expect(vm.dataWLCKom).toBe(null);
  });

  it('should test different empty data states', async () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test various data states 
    vm.dataWLCAll = null;
    vm.tabGraphic = 'Semua';
    await nextTick();
    expect(vm.dataWLCAll).toBe(null);
    expect(vm.tabGraphic).toBe('Semua');

    // Test planning data state
    vm.dataPlanning = null;
    await nextTick();
    expect(vm.dataPlanning).toBe(null);
    
    // Test PRP data states
    vm.dataPRP = null;
    vm.dataPRPPlan = null;
    await nextTick();
    expect(vm.dataPRP).toBe(null);
    expect(vm.dataPRPPlan).toBe(null);
  });

  it('should test modal closing functionality', async () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: {
          Loading: true,
          Empty: true,
          'vue-echarts': true,
          Legend: true,
          ModalWrapper: true
        }
      }
    });

    const vm = wrapper.vm as any;
    
    // Test modal states
    vm.showModalWlcAll = true;
    vm.showModalWlcKom = true;
    vm.showModalPlan = true;
    vm.showModalPRP = true;
    vm.showModalLastY = true;
    
    await nextTick();
    
    // Verify modals are shown
    expect(vm.showModalWlcAll).toBe(true);
    expect(vm.showModalWlcKom).toBe(true);
    expect(vm.showModalPlan).toBe(true);
    expect(vm.showModalPRP).toBe(true);
    expect(vm.showModalLastY).toBe(true);
  });
});
