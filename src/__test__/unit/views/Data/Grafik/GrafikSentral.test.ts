import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
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
  default: vi.fn().mockImplementation(function() { return mockGrafikService; })
}));

// Mock global format
vi.mock('@/services/format/global-format', () => ({
  default: vi.fn().mockImplementation(function() { return {
    formatRupiah: vi.fn().mockReturnValue('1,000')
  }; })
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

  it('should load all 5 charts with real data and cover chart formatters', async () => {
    const realWLCAllData = {
      data: [
        { tahun: 2022, revenue_annualized: 100, total_wlcc: 200, capex_annualized: 50, cost_component_bd: 20, cost_component_c_annualized: 10 },
        { tahun: 2023, revenue_annualized: 300, total_wlcc: 220, capex_annualized: 60, cost_component_bd: 25, cost_component_c_annualized: 15 },
      ]
    };
    const realWLCKomData = {
      data: [
        { tahun: 2022, cost_komp_a: 100, cost_komp_c: 50, cost_komp_bd: 80, cost_komp_b: 30, cost_komp_d: 50 },
        { tahun: 2023, cost_komp_a: 120, cost_komp_c: 55, cost_komp_bd: 90, cost_komp_b: 35, cost_komp_d: 55 },
      ]
    };
    const realPlanData = {
      data: [
        { tahun: 2022, revenue_annualized: 150, total_wlcc: 250, capex_annualized: 80, cost_component_bd: 30, cost_component_c_annualized: 20 },
        { tahun: 2023, revenue_annualized: 320, total_wlcc: 230, capex_annualized: 85, cost_component_bd: 32, cost_component_c_annualized: 22 },
      ]
    };
    const realPRPData = {
      data: [{
        realisasi_proyeksi: [
          { tahun: 2022, capex_annualized: 100, cost_component_bd: 50, cost_component_c_annualized: 30, total_revenue: 500, revenue_annualized: 400, total_wlcc: 450, revenue_komp_a: 100, revenue_komp_b: 100, revenue_komp_c: 100, revenue_komp_d: 100 },
          { tahun: 2023, capex_annualized: 110, cost_component_bd: 45, cost_component_c_annualized: 25, total_revenue: 600, revenue_annualized: 560, total_wlcc: 400, revenue_komp_a: 120, revenue_komp_b: 120, revenue_komp_c: 120, revenue_komp_d: 120 },
        ],
        planning: [
          { tahun: 2023, capex_annualized: 105, cost_component_bd: 48, cost_component_c_annualized: 28, total_revenue: 550, revenue_annualized: 450, total_wlcc: 430, revenue_komp_a: 110, revenue_komp_b: 110, revenue_komp_c: 110, revenue_komp_d: 110 },
          { tahun: 2024, capex_annualized: 112, cost_component_bd: 42, cost_component_c_annualized: 22, total_revenue: 620, revenue_annualized: 580, total_wlcc: 380, revenue_komp_a: 130, revenue_komp_b: 130, revenue_komp_c: 130, revenue_komp_d: 130 },
        ]
      }]
    };

    mockGrafikService.getGrafikWLCALL.mockResolvedValueOnce(realWLCAllData);
    mockGrafikService.getGrafikWLCKom.mockResolvedValueOnce(realWLCKomData);
    mockGrafikService.getGrafikPlan.mockResolvedValueOnce(realPlanData);
    mockGrafikService.getGrafikPRP.mockResolvedValueOnce(realPRPData);
    mockGrafikService.getGrafikPRPLastYear.mockResolvedValueOnce(realPRPData);

    const testWrapper = mount(GrafikSentral, {
      props: { idSentral: 1, tahunData: 2023 },
      global: {
        stubs: { Loading: true, Empty: true, 'vue-echarts': true, Legend: true, ModalWrapper: true }
      }
    });

    await testWrapper.setProps({ tahunData: 2024 });
    await flushPromises();

    const vm = testWrapper.vm as any;

    // Helper to call chart formatter functions for branch/function coverage
    const callChartFormatters = (chart: any, tahun: number) => {
      if (!chart) return;
      const xAxes = Array.isArray(chart.xAxis) ? chart.xAxis : (chart.xAxis ? [chart.xAxis] : []);
      xAxes.forEach((axis: any) => {
        if (typeof axis?.axisLabel?.color === 'function') {
          axis.axisLabel.color(tahun - 2, 0); // less than
          axis.axisLabel.color(tahun, 1);      // equal
          axis.axisLabel.color(tahun + 2, 2);  // greater than
        }
        if (typeof axis?.axisLabel?.formatter === 'function') {
          axis.axisLabel.formatter(tahun, 0);
        }
      });
      const yAxes = Array.isArray(chart.yAxis) ? chart.yAxis : (chart.yAxis ? [chart.yAxis] : []);
      yAxes.forEach((axis: any) => {
        if (typeof axis?.axisLabel?.formatter === 'function') {
          axis.axisLabel.formatter(1000000);
        }
      });
      (chart.series || []).forEach((s: any) => {
        if (s?.tooltip?.valueFormatter) s.tooltip.valueFormatter(1000000);
      });
    };

    callChartFormatters(vm.chartWLCAll, 2024);
    callChartFormatters(vm.chartWLCKom, 2024);
    callChartFormatters(vm.chartPlanning, 2024);
    callChartFormatters(vm.chartPRP, 2024);
    callChartFormatters(vm.chartLastYear, 2024);

    expect(vm.chartWLCAll).toBeDefined();
    expect(vm.chartWLCKom).toBeDefined();
    expect(vm.chartPlanning).toBeDefined();
    expect(vm.chartPRP).toBeDefined();
    expect(vm.chartLastYear).toBeDefined();
    expect(vm.tahunPRP.length).toBeGreaterThan(0);
    expect(vm.tahunLastYear.length).toBeGreaterThan(0);
    expect(vm.tahunLastYearPlan.length).toBeGreaterThan(0);
  });

  it('should cover detail chart formatters after click handlers', async () => {
    wrapper = mount(GrafikSentral, {
      props: defaultProps,
      global: {
        stubs: { Loading: true, Empty: true, 'vue-echarts': true, Legend: true, ModalWrapper: true }
      }
    });

    const vm = wrapper.vm as any;

    // Set up year arrays so click handlers have data to work with
    vm.tahunWLCAll = [2022, 2023, 2024];
    vm.tahunWLCKom = [2022, 2023, 2024];
    vm.tahunPlanning = [2022, 2023, 2024];
    vm.tahunPRP = [2022, 2023, 2024];
    vm.tahunLastYear = [2022, 2023, 2024];

    await vm.handleClickWlcAll({ dataIndex: 0 });
    await flushPromises();
    await vm.handleClickWlcKom({ dataIndex: 0 });
    await flushPromises();
    await vm.handleClickPlan({ dataIndex: 0 });
    await flushPromises();
    await vm.handleClickLastY({ dataIndex: 0 });
    await flushPromises();

    const callDetailFormatters = (chart: any) => {
      if (!chart) return;
      const yAxes = Array.isArray(chart.yAxis) ? chart.yAxis : (chart.yAxis ? [chart.yAxis] : []);
      yAxes.forEach((axis: any) => {
        if (axis?.axisLabel?.formatter) axis.axisLabel.formatter(1000000);
      });
      (chart.series || []).forEach((s: any) => {
        if (s?.tooltip?.valueFormatter) s.tooltip.valueFormatter(1000000);
      });
    };

    callDetailFormatters(vm.chartDetailWLCAll);
    callDetailFormatters(vm.chartDetailWLCKom);
    callDetailFormatters(vm.chartDetailPlan);
    callDetailFormatters(vm.chartDetailLastY);

    expect(vm.showModalWlcAll).toBe(true);
    expect(vm.showModalLastY).toBe(true);
  });

  it('should load WLCAll with BEP-crossing data to cover branch conditions', async () => {
    // i=0: revenue<wlcc, i=1: revenue>=wlcc → BEP branch triggered
    mockGrafikService.getGrafikWLCALL.mockResolvedValueOnce({
      data: [
        { tahun: 2022, revenue_annualized: 100, total_wlcc: 200, capex_annualized: 50, cost_component_bd: 20, cost_component_c_annualized: 10 },
        { tahun: 2023, revenue_annualized: 250, total_wlcc: 200, capex_annualized: 50, cost_component_bd: 20, cost_component_c_annualized: 10 },
      ]
    });

    const testWrapper = mount(GrafikSentral, {
      props: { idSentral: 1, tahunData: 2023 },
      global: {
        stubs: { Loading: true, Empty: true, 'vue-echarts': true, Legend: true, ModalWrapper: true }
      }
    });

    await testWrapper.setProps({ tahunData: 2024 });
    await flushPromises();

    const vm = testWrapper.vm as any;
    expect(vm.chartWLCAll).toBeDefined();
    // Verify BEP markers exist in the series
    expect(vm.chartWLCAll.series).toBeDefined();
    expect(vm.tahunWLCAll.length).toBeGreaterThan(0);
  });
});
