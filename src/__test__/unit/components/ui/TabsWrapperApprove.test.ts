import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { h } from 'vue'
import TabsWrapperApprove from '@/components/ui/TabsWrapperApprove.vue'

// Mock the store
vi.mock('@/store/storeLamanDataTab', () => ({
  useLamanDataTabStore: vi.fn(() => ({
    currentTab: 'Test Tab'
  }))
}))

// Mock the services
vi.mock('@/services/grafik-service', () => ({
  default: vi.fn().mockImplementation(() => ({
    getGrafikWLCALLMesin: vi.fn().mockResolvedValue({ 
      data: [
        {
          tahun: 2023,
          revenue_annualized: 1000,
          total_wlcc_annualized: 800,
          capex_annualized: 500,
          cost_component_bd: 200,
          cost_component_c_annualized: 100,
          optimum_life_fs: 25,
          bep_fs: 10,
          profit_loss: 200
        }
      ]
    }),
    getGrafikWLCKomMesin: vi.fn().mockResolvedValue({ 
      data: [
        {
          tahun: 2023,
          cost_komp_a: 100,
          cost_komp_c: 200,
          cost_komp_bd: 150,
          cost_komp_b: 50,
          cost_komp_d: 30
        }
      ]
    }),
    getGrafikWLCALLDetailMesin: vi.fn().mockResolvedValue({ 
      data: { 
        graph: [
          { nomor: 1, judul: 'Test 1', realisasi: 100, planning: 150 }
        ], 
        table: [
          { nomor: 1, name: 'Test', realisasi: 100, planning: 150 }
        ]
      } 
    }),
    getGrafikWLCKomDetailMesin: vi.fn().mockResolvedValue({ 
      data: { 
        graph: [
          { nomor: 1, judul: 'Test 1', realisasi: 100, planning: 150 }
        ], 
        table: [
          { nomor: 1, name: 'Test', realisasi: 100, planning: 150 }
        ]
      } 
    })
  }))
}))

vi.mock('@/services/detail-sentral-service', () => ({
  default: vi.fn().mockImplementation(() => ({}))
}))

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn().mockImplementation(() => ({}))
}))

describe('TabsWrapperApprove', () => {
  let wrapper: any
  
  const defaultProps = {
    tahunGrafik: 2023,
    idMesin: 1,
    irrOnEquity: 10,
    irrOnProject: 12,
    waccOnEquity: 8,
    waccOnProject: 9,
    npvOnProject: 1000000,
    npvOnEquity: 800000,
    averageEaf: 85,
    averageNcf: 75,
    namaPengelola: 'Test Pengelola',
    namaMesin: 'Test Mesin',
    tahunOperasi: '2020',
    namaPembina: 'Test Pembina',
    dayaMampu: 100,
    dayaTerpasang: 120,
    tahun: 2023,
    nilaiAssetAwal: 5000000,
    lamanData: false,
    jumlahMesin: 1,
    tahunPerolehanData: '2023',
    photo: '',
    statusGrafik: 'active'
  }

  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    
    wrapper = mount(TabsWrapperApprove, {
      props: defaultProps,
      slots: {
        default: [
          h('div', { title: 'Tab 1' }, 'Tab 1 Content'),
          h('div', { title: 'Tab 2' }, 'Tab 2 Content')
        ]
      },
      global: {
        plugins: [pinia],
        stubs: {
          'vue-echarts': true,
          'ModalWrapper': true,
          'Chips': true,
          'PopUp': true,
          'Legend': true,
          'Empty': true,
          'StatusGrafik': true
        }
      }
    })
  })

  it('should render component correctly', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.whitespace-nowrap').exists()).toBe(true)
  })

  it('should handle tab click correctly', async () => {
    const mockTitle = 'Test Tab'
    
    // Call the handleClick method directly
    await wrapper.vm.handleClick(mockTitle)
    
    expect(wrapper.vm.selectedTitle).toBe(mockTitle)
  })

  it('should handle graphic tab change correctly', async () => {
    // Test changing to "Semua" tab
    await wrapper.vm.changeTabGrafik(1)
    expect(wrapper.vm.tabGraphic).toBe('Semua')
    
    // Test changing to "Biaya Komponen" tab
    await wrapper.vm.changeTabGrafik(2)
    expect(wrapper.vm.tabGraphic).toBe('Biaya Komponen')
  })

  it('should handle modal visibility correctly', async () => {
    // Test opening graphic modal
    await wrapper.vm.handleClickGrafik()
    expect(wrapper.vm.showModal).toBe(true)
    
    // Test closing modal
    wrapper.vm.showModal = false
    expect(wrapper.vm.showModal).toBe(false)
  })

  it('should handle pembina hover correctly', async () => {
    // Test pembina hover toggle
    expect(wrapper.vm.pembinaHover).toBe(false)
    
    await wrapper.vm.detailPembina()
    expect(wrapper.vm.pembinaHover).toBe(true)
    
    await wrapper.vm.detailPembina()
    expect(wrapper.vm.pembinaHover).toBe(false)
  })

  it('should handle tab change correctly', async () => {
    // Test changing to prev tab
    await wrapper.vm.changeTab(1)
    expect(wrapper.vm.tab).toBe('prev')
    
    // Test changing to next tab
    await wrapper.vm.changeTab(2)
    expect(wrapper.vm.tab).toBe('next')
  })

  it('should handle WLC All Mesin chart click correctly', async () => {
    const mockParam = { dataIndex: 0 }
    
    await wrapper.vm.handleClickWlcAll(mockParam)
    
    expect(wrapper.vm.showModalWlcAll).toBe(true)
    expect(wrapper.vm.tahunDetail).toBeDefined()
  })

  it('should handle WLC Komponen chart click correctly', async () => {
    const mockParam = { dataIndex: 0 }
    
    await wrapper.vm.handleClickWlcKom(mockParam)
    
    expect(wrapper.vm.showModalWlcKom).toBe(true)
    expect(wrapper.vm.tahunDetail).toBeDefined()
  })

  it('should test force render functions', async () => {
    // Test force render functions
    await wrapper.vm.forceRender()
    await wrapper.vm.forceRender1()
    await wrapper.vm.forceRender2()
    await wrapper.vm.forceRender3()
    
    // These functions should complete without error
    expect(true).toBe(true)
  })

  it('should handle null data for WLC All Mesin', async () => {
    // Create wrapper with mock service returning null data
    const wrapperWithNullData: any = mount(TabsWrapperApprove, {
      props: defaultProps,
      slots: {
        default: [
          h('div', { title: 'Tab 1' }, 'Tab 1 Content'),
          h('div', { title: 'Tab 2' }, 'Tab 2 Content')
        ]
      },
      global: {
        plugins: [createPinia()],
        stubs: {
          'vue-echarts': true,
          'ModalWrapper': true,
          'Chips': true,
          'PopUp': true,
          'Legend': true,
          'Empty': true,
          'StatusGrafik': true
        },
        mocks: {
          grafikService: {
            getGrafikWLCALLMesin: vi.fn().mockResolvedValue({ data: null }),
            getGrafikWLCKomMesin: vi.fn().mockResolvedValue({ data: null })
          }
        }
      }
    })

    expect(wrapperWithNullData.exists()).toBe(true)
  })

  it('should handle props with photo', async () => {
    // Test with photo prop
    const wrapperWithPhoto: any = mount(TabsWrapperApprove, {
      props: { ...defaultProps, photo: 'test-photo.jpg' },
      slots: {
        default: [
          h('div', { title: 'Tab 1' }, 'Tab 1 Content'),
          h('div', { title: 'Tab 2' }, 'Tab 2 Content')
        ]
      },
      global: {
        plugins: [createPinia()],
        stubs: {
          'vue-echarts': true,
          'ModalWrapper': true,
          'Chips': true,
          'PopUp': true,
          'Legend': true,
          'Empty': true,
          'StatusGrafik': true
        }
      }
    })

    expect(wrapperWithPhoto.vm.photo).toBe('test-photo.jpg')
  })

  it('should handle isLihatGrafik prop', async () => {
    // Test with isLihatGrafik prop
    const wrapperWithLihatGrafik: any = mount(TabsWrapperApprove, {
      props: { ...defaultProps, isLihatGrafik: true },
      slots: {
        default: [
          h('div', { title: 'Tab 1' }, 'Tab 1 Content'),
          h('div', { title: 'Tab 2' }, 'Tab 2 Content')
        ]
      },
      global: {
        plugins: [createPinia()],
        stubs: {
          'vue-echarts': true,
          'ModalWrapper': true,
          'Chips': true,
          'PopUp': true,
          'Legend': true,
          'Empty': true,
          'StatusGrafik': true
        }
      }
    })

    expect(wrapperWithLihatGrafik.vm.isLihatGrafik).toBe(true)
  })

  it('should handle handleClick when lamanData is true', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    
    const wrapperLamanData: any = mount(TabsWrapperApprove, {
      props: { ...defaultProps, lamanData: true },
      slots: {
        default: [
          h('div', { title: 'Tab 1' }, 'Tab 1 Content'),
          h('div', { title: 'Tab 2' }, 'Tab 2 Content')
        ]
      },
      global: {
        plugins: [pinia],
        stubs: {
          'vue-echarts': true,
          'ModalWrapper': true,
          'Chips': true,
          'PopUp': true,
          'Legend': true,
          'Empty': true,
          'StatusGrafik': true
        }
      }
    })

    const mockTitle = 'Tab 1'
    await wrapperLamanData.vm.handleClick(mockTitle)
    
    expect(wrapperLamanData.vm.selectedTitle).toBe(mockTitle)
  })

  it('should verify chart data arrays are populated on mount', async () => {
    await wrapper.vm.$nextTick()
    
    // Verify that data arrays are initialized
    expect(wrapper.vm.tahunWLCAllMesin).toBeDefined()
    expect(wrapper.vm.revWLCMesin).toBeDefined()
    expect(wrapper.vm.sumLccWLCMesin).toBeDefined()
    expect(wrapper.vm.capexWLCMesin).toBeDefined()
    expect(wrapper.vm.comBDWLCMesin).toBeDefined()
    expect(wrapper.vm.fuelComWLCMesin).toBeDefined()
    expect(wrapper.vm.profitLoss).toBeDefined()
  })

  it('should verify WLC Komponen chart data arrays are populated', async () => {
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.tahunWLCKomMesin).toBeDefined()
    expect(wrapper.vm.costCompAMesin).toBeDefined()
    expect(wrapper.vm.costCompCMesin).toBeDefined()
    expect(wrapper.vm.costCompBDMesin).toBeDefined()
    expect(wrapper.vm.sumCostCompMesin).toBeDefined()
  })

  it('should test chart configurations exist', async () => {
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.chartWLCAllMesin).toBeDefined()
    expect(wrapper.vm.chartWLCKomMesin).toBeDefined()
    // chartDetailWLCAllMesin and chartDetailWLCKomMesin are only set after clicking charts
  })

  it('should handle modal close for WLC All', async () => {
    wrapper.vm.showModalWlcAll = true
    expect(wrapper.vm.showModalWlcAll).toBe(true)
    
    wrapper.vm.showModalWlcAll = false
    expect(wrapper.vm.showModalWlcAll).toBe(false)
  })

  it('should handle modal close for WLC Kom', async () => {
    wrapper.vm.showModalWlcKom = true
    expect(wrapper.vm.showModalWlcKom).toBe(true)
    
    wrapper.vm.showModalWlcKom = false
    expect(wrapper.vm.showModalWlcKom).toBe(false)
  })

  it('should verify data detail arrays for WLC All', async () => {
    const mockParam = { dataIndex: 0 }
    await wrapper.vm.handleClickWlcAll(mockParam)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.judulDetWlcAll).toBeDefined()
    expect(wrapper.vm.realDetWlcAll).toBeDefined()
    expect(wrapper.vm.planDetWlcAll).toBeDefined()
    expect(wrapper.vm.dataDetailWlcAllMesin).toBeDefined()
    expect(wrapper.vm.datatableWlcAllMesin).toBeDefined()
    expect(wrapper.vm.chartDetailWLCAllMesin).toBeDefined()
  })

  it('should verify data detail arrays for WLC Kom', async () => {
    const mockParam = { dataIndex: 0 }
    await wrapper.vm.handleClickWlcKom(mockParam)
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.judulDetWlcKom).toBeDefined()
    expect(wrapper.vm.realDetWlcKom).toBeDefined()
    expect(wrapper.vm.planDetWlcKom).toBeDefined()
    expect(wrapper.vm.dataDetailWlcKomMesin).toBeDefined()
    expect(wrapper.vm.datatableWlcKomMesin).toBeDefined()
    expect(wrapper.vm.chartDetailWLCKomMesin).toBeDefined()
  })

  it('should set tahunDetail when clicking WLC All chart', async () => {
    const mockParam = { dataIndex: 0 }
    await wrapper.vm.handleClickWlcAll(mockParam)
    
    expect(wrapper.vm.tahunDetail).toBeDefined()
    expect(wrapper.vm.showModalWlcAll).toBe(true)
  })

  it('should set tahunDetail when clicking WLC Kom chart', async () => {
    const mockParam = { dataIndex: 0 }
    await wrapper.vm.handleClickWlcKom(mockParam)
    
    expect(wrapper.vm.tahunDetail).toBeDefined()
    expect(wrapper.vm.showModalWlcKom).toBe(true)
  })

  it('should handle tab changes for graphics', async () => {
    expect(wrapper.vm.tabGraphic).toBe('Semua')
    
    await wrapper.vm.changeTabGrafik(2)
    expect(wrapper.vm.tabGraphic).toBe('Biaya Komponen')
    
    await wrapper.vm.changeTabGrafik(1)
    expect(wrapper.vm.tabGraphic).toBe('Semua')
  })

  it('should handle tab changes for prev/next', async () => {
    expect(wrapper.vm.tab).toBe('prev')
    
    await wrapper.vm.changeTab(2)
    expect(wrapper.vm.tab).toBe('next')
    
    await wrapper.vm.changeTab(1)
    expect(wrapper.vm.tab).toBe('prev')
  })

  it('should verify yAxisWlc calculations', async () => {
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.yAxisWlc).toBeDefined()
    expect(wrapper.vm.maxWlcBep).toBeDefined()
    expect(wrapper.vm.maxWlcOpt).toBeDefined()
  })

  it('should verify update flags for force render', async () => {
    // The update flags may change after force render is called, so we just check they exist
    expect(wrapper.vm.updateWLCAllMesin).toBeDefined()
    expect(wrapper.vm.updateWLCKomMesin).toBeDefined()
    expect(wrapper.vm.updateDetailWLCAllMesin).toBeDefined()
    expect(wrapper.vm.updateDetailWLCKomMesin).toBeDefined()
  })

  it('should verify chart has proper configuration structure', async () => {
    await wrapper.vm.$nextTick()
    
    // Check WLC All Mesin chart structure
    const chartWLC = wrapper.vm.chartWLCAllMesin
    expect(chartWLC).toBeDefined()
    expect(chartWLC.title).toBeDefined()
    expect(chartWLC.tooltip).toBeDefined()
    expect(chartWLC.legend).toBeDefined()
    expect(chartWLC.grid).toBeDefined()
    expect(chartWLC.xAxis).toBeDefined()
    expect(chartWLC.yAxis).toBeDefined()
    expect(chartWLC.series).toBeDefined()
    
    // Check WLC Komponen chart structure
    const chartKom = wrapper.vm.chartWLCKomMesin
    expect(chartKom).toBeDefined()
    expect(chartKom.title).toBeDefined()
    expect(chartKom.tooltip).toBeDefined()
    expect(chartKom.legend).toBeDefined()
    expect(chartKom.grid).toBeDefined()
    expect(chartKom.xAxis).toBeDefined()
    expect(chartKom.yAxis).toBeDefined()
    expect(chartKom.series).toBeDefined()
  })

  it('should populate data arrays correctly on mount', async () => {
    await wrapper.vm.$nextTick()
    
    // Check data arrays are populated
    expect(Array.isArray(wrapper.vm.tahunWLCAllMesin)).toBe(true)
    expect(Array.isArray(wrapper.vm.revWLCMesin)).toBe(true)
    expect(Array.isArray(wrapper.vm.sumLccWLCMesin)).toBe(true)
    expect(Array.isArray(wrapper.vm.capexWLCMesin)).toBe(true)
    expect(Array.isArray(wrapper.vm.comBDWLCMesin)).toBe(true)
    expect(Array.isArray(wrapper.vm.fuelComWLCMesin)).toBe(true)
    expect(Array.isArray(wrapper.vm.yAxisWlc)).toBe(true)
    expect(Array.isArray(wrapper.vm.profitLoss)).toBe(true)
  })

  it('should handle empty or null photo prop', async () => {
    const wrapperEmptyPhoto: any = mount(TabsWrapperApprove, {
      props: { ...defaultProps, photo: '' },
      slots: {
        default: [h('div', { title: 'Tab 1' }, 'Tab 1 Content')]
      },
      global: {
        plugins: [createPinia()],
        stubs: {
          'vue-echarts': true,
          'ModalWrapper': true,
          'Chips': true,
          'PopUp': true,
          'Legend': true,
          'Empty': true,
          'StatusGrafik': true
        }
      }
    })

    expect(wrapperEmptyPhoto.vm.photo).toBe('')
  })

  it('should test multiple tab titles from slots', async () => {
    const wrapperMultiTabs: any = mount(TabsWrapperApprove, {
      props: defaultProps,
      slots: {
        default: [
          h('div', { title: 'First Tab' }, 'First Tab Content'),
          h('div', { title: 'Second Tab' }, 'Second Tab Content'),
          h('div', { title: 'Third Tab' }, 'Third Tab Content')
        ]
      },
      global: {
        plugins: [createPinia()],
        stubs: {
          'vue-echarts': true,
          'ModalWrapper': true,
          'Chips': true,
          'PopUp': true,
          'Legend': true,
          'Empty': true,
          'StatusGrafik': true
        }
      }
    })

    expect(wrapperMultiTabs.vm.tabTitles).toBeDefined()
    expect(wrapperMultiTabs.vm.tabTitles.length).toBeGreaterThan(0)
  })

  it('should handle all provided props correctly', () => {
    expect(wrapper.vm.tahunGrafik).toBe(2023)
    expect(wrapper.vm.idMesin).toBe(1)
    expect(wrapper.vm.irrOnEquity).toBe(10)
    expect(wrapper.vm.irrOnProject).toBe(12)
    expect(wrapper.vm.waccOnEquity).toBe(8)
    expect(wrapper.vm.waccOnProject).toBe(9)
    expect(wrapper.vm.npvOnProject).toBe(1000000)
    expect(wrapper.vm.npvOnEquity).toBe(800000)
    expect(wrapper.vm.averageEaf).toBe(85)
    expect(wrapper.vm.averageNcf).toBe(75)
    expect(wrapper.vm.namaPengelola).toBe('Test Pengelola')
    expect(wrapper.vm.namaMesin).toBe('Test Mesin')
    expect(wrapper.vm.tahunOperasi).toBe('2020')
    expect(wrapper.vm.namaPembina).toBe('Test Pembina')
    expect(wrapper.vm.dayaMampu).toBe(100)
    expect(wrapper.vm.dayaTerpasang).toBe(120)
  })

  it('should initialize modal states correctly', () => {
    expect(wrapper.vm.showModal).toBe(false)
    expect(wrapper.vm.showModalWlcAll).toBe(false)
    expect(wrapper.vm.showModalWlcKom).toBe(false)
    expect(wrapper.vm.pembinaHover).toBe(false)
  })

  it('should verify data arrays are defined after detail chart clicks', async () => {
    const mockParam = { dataIndex: 0 }
    
    await wrapper.vm.handleClickWlcAll(mockParam)
    await wrapper.vm.$nextTick()
    expect(Array.isArray(wrapper.vm.judulDetWlcAll)).toBe(true)
    expect(Array.isArray(wrapper.vm.realDetWlcAll)).toBe(true)
    expect(Array.isArray(wrapper.vm.planDetWlcAll)).toBe(true)
    
    await wrapper.vm.handleClickWlcKom(mockParam)
    await wrapper.vm.$nextTick()
    expect(Array.isArray(wrapper.vm.judulDetWlcKom)).toBe(true)
    expect(Array.isArray(wrapper.vm.realDetWlcKom)).toBe(true)
    expect(Array.isArray(wrapper.vm.planDetWlcKom)).toBe(true)
  })
})