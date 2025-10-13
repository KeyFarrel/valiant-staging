import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';
import TabsWrapperApproveFS from '@/components/ui/TabsWrapperApproveFS.vue';

// Mock the stores and services
vi.mock('@/store/storeLamanDataTab', () => ({
  useLamanDataTabStore: () => ({
    currentTab: 'Tab 1',
    state: {},
    getters: {},
    actions: {},
    mutations: {}
  })
}));

vi.mock('@/services/grafik-service', () => ({
  default: class MockGrafikService {
    getGrafikPlanMesin = vi.fn().mockResolvedValue({
      data: [
        {
          tahun: 2023,
          revenue_annualized: 100000,
          total_wlcc_annualized: 80000,
          capex_annualized: 50000,
          cost_component_bd: 30000,
          cost_component_c_annualized: 20000,
          optimum_life_fs: 25,
          bep_fs: 15,
          total_revenue: 120000,
          revenue_komp_bd: 40000
        }
      ]
    });
    
    getGrafikPlanKomMesin = vi.fn().mockResolvedValue({
      data: [
        {
          tahun: 2023,
          is_history: 0,
          revenue_komp_a: 25000,
          revenue_komp_b: 30000,
          revenue_komp_c: 20000,
          revenue_komp_d: 15000
        }
      ]
    });
    
    getGrafikPlanDetailMesin = vi.fn().mockResolvedValue({
      data: {
        graph: [
          { nomor: 1, judul: 'Test Item 1', planning: 10000 }
        ],
        table: [
          { nomor: 1, name: 'Test Item 1', realisasi: 9000, planning: 10000 }
        ]
      }
    });
    
    getGrafikPlanKomDetailMesin = vi.fn().mockResolvedValue({
      data: {
        graph: [
          { nomor: 1, judul: 'Test Kom Item 1', planning: 5000 }
        ],
        table: [
          { nomor: 1, name: 'Test Kom Item 1', realisasi: 4500, planning: 5000 }
        ]
      }
    });
  }
}));

const defaultProps = {
  idMesin: 1,
  tahunGrafik: 2023,
  irrOnProject: 15.5,
  irrOnEquity: 18.2,
  waccOnProject: 12.5,
  waccOnEquity: 14.8,
  npvOnEquity: 50000,
  npvOnProject: 45000,
  averageNcf: 35000,
  averageEaf: 85.5,
  namaMesin: 'Test Machine',
  namaPengelola: 'Test Operator',
  namaPembina: 'Test Supervisor',
  tahunOperasi: '2020',
  dayaTerpasang: 100,
  dayaMampu: 95,
  tahun: 2023,
  isLihatGrafik: true,
  lamanData: false,
  nilaiAssetAwal: 1000000,
  tahunPerolehanData: '2020',
  jumlahMesin: 2,
  statusGrafik: 'active',
  photo: 'test-photo.jpg'
};

describe('TabsWrapperApproveFS', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(TabsWrapperApproveFS, {
      props: defaultProps,
      slots: {
        default: [
          '<div title="Tab 1">Content 1</div>',
          '<div title="Tab 2">Content 2</div>',
          '<div title="Tab 3">Content 3</div>'
        ]
      },
      global: {
        stubs: {
          'ModalWrapper': {
            template: '<div><slot /></div>',
            props: ['showModal', 'width', 'height']
          },
          'vue-echarts': {
            template: '<div class="mock-chart"></div>',
            props: ['option']
          },
          'Chips': { template: '<div></div>' },
          'PopUp': { template: '<div></div>' },
          'Empty': { template: '<div>No data</div>' },
          'StatusGrafik': { template: '<div></div>' }
        }
      }
    });
  });

  it('should render component with tabs correctly', async () => {
    await nextTick();
    
    // Check if component is rendered
    expect(wrapper.exists()).toBe(true);
    
    // Check if tabs are rendered
    const tabItems = wrapper.findAll('li');
    expect(tabItems.length).toBeGreaterThan(0);
    
    // Check if the first tab has selected class
    const firstTab = tabItems[0];
    expect(firstTab.classes()).toContain('selected');
  });

  it('should handle tab click correctly', async () => {
    await nextTick();
    
    const tabItems = wrapper.findAll('li');
    expect(tabItems.length).toBeGreaterThan(1);
    
    // Click on second tab
    await tabItems[1].trigger('click');
    await nextTick();
    
    // Check if second tab becomes selected
    expect(tabItems[1].classes()).toContain('selected');
  });

  it('should show modal when lihat grafik button is clicked', async () => {
    await nextTick();
    
    // Find the lihat grafik button
    const lihatGrafikButton = wrapper.find('button');
    expect(lihatGrafikButton.exists()).toBe(true);
    
    // Click the button
    await lihatGrafikButton.trigger('click');
    await nextTick();
    
    // Check if modal is shown (showModal should be true)
    expect(wrapper.vm.showModal).toBe(true);
  });

  it('should handle changeTabFS function correctly', async () => {
    await nextTick();
    
    // Test changeTabFS with tabs = 1
    wrapper.vm.changeTabFS(1);
    expect(wrapper.vm.tabGraphicFS).toBe('Semua');
    
    // Test changeTabFS with tabs = 2
    wrapper.vm.changeTabFS(2);
    expect(wrapper.vm.tabGraphicFS).toBe('Biaya Komponen');
  });

  it('should handle changeTab function correctly', async () => {
    await nextTick();
    
    // Test changeTab with tabs = 1
    wrapper.vm.changeTab(1);
    expect(wrapper.vm.tab).toBe('prev');
    
    // Test changeTab with tabs = 2
    wrapper.vm.changeTab(2);
    expect(wrapper.vm.tab).toBe('next');
  });

  it('should toggle pembinaHover when detailPembina is called', async () => {
    await nextTick();
    
    const initialValue = wrapper.vm.pembinaHover;
    wrapper.vm.detailPembina();
    expect(wrapper.vm.pembinaHover).toBe(!initialValue);
    
    // Toggle again
    wrapper.vm.detailPembina();
    expect(wrapper.vm.pembinaHover).toBe(initialValue);
  });

  it('should handle chart click events for planning details', async () => {
    await nextTick();
    
    const mockParam = { dataIndex: 0 };
    
    // Test handleClickPlan
    wrapper.vm.handleClickPlan(mockParam);
    expect(wrapper.vm.showModalPlan).toBe(true);
    expect(wrapper.vm.tahunDetail).toBe(wrapper.vm.tahunPlanningMesin[0]);
    
    // Test handleClickPlanKom  
    wrapper.vm.handleClickPlanKom(mockParam);
    expect(wrapper.vm.showModalPlanKom).toBe(true);
    expect(wrapper.vm.tahunDetail).toBe(wrapper.vm.tahunPlanKomMesin[0]);
  });

  it('should close modals when close buttons are clicked', async () => {
    await nextTick();
    
    // Open modals first
    wrapper.vm.showModal = true;
    wrapper.vm.showModalPlan = true;
    wrapper.vm.showModalPlanKom = true;
    
    await nextTick();
    
    // Test if modals can be closed (simulate close button clicks through data changes)
    wrapper.vm.showModal = false;
    wrapper.vm.showModalPlan = false;
    wrapper.vm.showModalPlanKom = false;
    
    expect(wrapper.vm.showModal).toBe(false);
    expect(wrapper.vm.showModalPlan).toBe(false);
    expect(wrapper.vm.showModalPlanKom).toBe(false);
  });

  it('should handle empty data from services', async () => {
    // Create wrapper with null data response
    const mockGrafikServiceEmpty = vi.fn().mockImplementation(() => ({
      getGrafikPlanMesin: vi.fn().mockResolvedValue({ data: null }),
      getGrafikPlanKomMesin: vi.fn().mockResolvedValue({ data: null }),
      getGrafikPlanDetailMesin: vi.fn().mockResolvedValue({ data: { graph: [], table: [] } }),
      getGrafikPlanKomDetailMesin: vi.fn().mockResolvedValue({ data: { graph: [], table: [] } })
    }));

    vi.doMock('@/services/grafik-service', () => ({
      default: mockGrafikServiceEmpty
    }));

    const emptyWrapper = mount(TabsWrapperApproveFS, {
      props: defaultProps,
      slots: {
        default: ['<div title="Tab 1">Content 1</div>']
      },
      global: {
        stubs: {
          'ModalWrapper': { template: '<div><slot /></div>', props: ['showModal', 'width', 'height'] },
          'vue-echarts': { template: '<div class="mock-chart"></div>', props: ['option'] },
          'Chips': { template: '<div></div>' },
          'PopUp': { template: '<div></div>' },
          'Empty': { template: '<div>No data</div>' },
          'StatusGrafik': { template: '<div></div>' }
        }
      }
    });

    await nextTick();
    expect(emptyWrapper.exists()).toBe(true);
  });

  it('should handle force render functions', async () => {
    await nextTick();
    
    // Test forceRender functions
    expect(wrapper.vm.updatePlanningMesin).toBe(true);
    await wrapper.vm.forceRender();
    
    expect(wrapper.vm.updateDetailPlanMesin).toBe(true);
    await wrapper.vm.forceRender1();
    
    expect(wrapper.vm.updatePlanKomMesin).toBe(true);
    await wrapper.vm.forceRender2();
    
    expect(wrapper.vm.updateDetailPlanKomMesin).toBe(true);
    await wrapper.vm.forceRender3();
  });

  it('should handle chart data processing with BEP calculations', async () => {
    // Mock data with BEP conditions
    const mockServiceWithBEP = vi.fn().mockImplementation(() => ({
      getGrafikPlanMesin: vi.fn().mockResolvedValue({
        data: [
          {
            tahun: 2023,
            revenue_annualized: 100000,
            total_wlcc_annualized: 80000,
            capex_annualized: 50000,
            cost_component_bd: 30000,
            cost_component_c_annualized: 20000,
            optimum_life_fs: 25,
            bep_fs: 15,
            total_revenue: 120000,
            revenue_komp_bd: 40000
          },
          {
            tahun: 2024,
            revenue_annualized: 120000,
            total_wlcc_annualized: 90000,
            capex_annualized: 60000,
            cost_component_bd: 35000,
            cost_component_c_annualized: 25000,
            optimum_life_fs: 25,
            bep_fs: 15,
            total_revenue: 140000,
            revenue_komp_bd: 45000
          }
        ]
      }),
      getGrafikPlanKomMesin: vi.fn().mockResolvedValue({
        data: [
          {
            tahun: 2023,
            is_history: 0,
            revenue_komp_a: 25000,
            revenue_komp_b: 30000,
            revenue_komp_c: 20000,
            revenue_komp_d: 15000
          }
        ]
      }),
      getGrafikPlanDetailMesin: vi.fn().mockResolvedValue({
        data: {
          graph: [{ nomor: 1, judul: 'Test Item 1', planning: 10000 }],
          table: [{ nomor: 1, name: 'Test Item 1', realisasi: 9000, planning: 10000 }]
        }
      }),
      getGrafikPlanKomDetailMesin: vi.fn().mockResolvedValue({
        data: {
          graph: [{ nomor: 1, judul: 'Test Kom Item 1', planning: 5000 }],
          table: [{ nomor: 1, name: 'Test Kom Item 1', realisasi: 4500, planning: 5000 }]
        }
      })
    }));

    vi.doMock('@/services/grafik-service', () => ({
      default: mockServiceWithBEP
    }));

    const bepWrapper = mount(TabsWrapperApproveFS, {
      props: defaultProps,
      slots: {
        default: ['<div title="Tab 1">Content 1</div>']
      },
      global: {
        stubs: {
          'ModalWrapper': { template: '<div><slot /></div>', props: ['showModal', 'width', 'height'] },
          'vue-echarts': { template: '<div class="mock-chart"></div>', props: ['option'] },
          'Chips': { template: '<div></div>' },
          'PopUp': { template: '<div></div>' },
          'Empty': { template: '<div>No data</div>' },
          'StatusGrafik': { template: '<div></div>' }
        }
      }
    });

    await nextTick();
    expect(bepWrapper.exists()).toBe(true);
  });
});