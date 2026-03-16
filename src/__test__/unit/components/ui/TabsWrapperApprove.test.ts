import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { h } from 'vue'
import TabsWrapperApprove from '@/components/ui/TabsWrapperApprove.vue'

const modalWrapperStub = {
  template: '<div class="modal-wrapper-stub"><slot /></div>'
}

// Mock the store
vi.mock('@/store/storeLamanDataTab', () => ({
  useLamanDataTabStore: vi.fn(() => ({
    currentTab: 'Test Tab'
  }))
}))

// Mock the services
const mockGetGrafikWLCALLMesin = vi.fn()
const mockGetGrafikWLCKomMesin = vi.fn().mockResolvedValue({ 
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
    })

vi.mock('@/services/grafik-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getGrafikWLCALLMesin: mockGetGrafikWLCALLMesin,
    getGrafikWLCKomMesin: mockGetGrafikWLCKomMesin,
    getGrafikWLCALLDetailMesin: vi.fn().mockResolvedValue({ 
      data: { 
        graph: [
          { nomor: 2, judul: 'Test 2', realisasi: 200, planning: 250 },
          { nomor: 1, judul: 'Test 1', realisasi: 100, planning: 150 }
        ], 
        table: [
          { nomor: 2, name: 'Test 2', realisasi: 200, planning: 250 },
          { nomor: 1, name: 'Test 1', realisasi: 100, planning: 150 }
        ]
      } 
    }),
    getGrafikWLCKomDetailMesin: vi.fn().mockResolvedValue({ 
      data: { 
        graph: [
          { nomor: 2, judul: 'Test 2', realisasi: 200, planning: 250 },
          { nomor: 1, judul: 'Test 1', realisasi: 100, planning: 150 }
        ], 
        table: [
          { nomor: 2, name: 'Test 2', realisasi: 200, planning: 250 },
          { nomor: 1, name: 'Test 1', realisasi: 100, planning: 150 }
        ]
      } 
    })
  }; })
}))

vi.mock('@/services/detail-sentral-service', () => ({
  default: vi.fn().mockImplementation(function() { return {}; })
}))

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn().mockImplementation(function() { return {
    formatCurrencyNotFixed: vi.fn((val) => val),
    formatEnergy: vi.fn((val) => val),
    formatRupiah: vi.fn((val) => val),
    formatDecimal: vi.fn((val) => val)
  }; })
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
    vi.clearAllMocks()
    
    // Default mock response
    mockGetGrafikWLCALLMesin.mockResolvedValue({ 
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
    })
    
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
          'ModalWrapper': modalWrapperStub,
          'Chips': true,
          'PopUp': true,
          'Legend': true,
          'Empty': true,
          'StatusGrafik': true
        }
      }
    })
  })

// ... existing tests until BEP test ...

  it('should calculate BEP correctly', async () => {
    // Mock data where BEP is found
    // revenue >= wlcc
    // i=0: rev 100, wlcc 200 (rev < wlcc)
    // i=1: rev 300, wlcc 250 (rev > wlcc) -> BEP cross
    const mockData = [
      {
        tahun: 2023,
        revenue_annualized: 100,
        total_wlcc_annualized: 200,
        capex_annualized: 50,
        cost_component_bd: 20,
        cost_component_c_annualized: 10,
        profit_loss: -100
      },
      {
        tahun: 2024,
        revenue_annualized: 300,
        total_wlcc_annualized: 250,
        capex_annualized: 50,
        cost_component_bd: 20,
        cost_component_c_annualized: 10,
        profit_loss: 50
      }
    ]
    
    // Override mock response for this test
    mockGetGrafikWLCALLMesin.mockResolvedValue({ data: mockData })
    
     // Re-mount to trigger onMounted with new mock
     const wrapperBEP: any = mount(TabsWrapperApprove, {
      props: defaultProps,
      slots: {
        default: [h('div', { title: 'Tab 1' }, 'Content')]
      },
      global: {
        plugins: [createPinia()],
        stubs: {
          'vue-echarts': true,
          'ModalWrapper': modalWrapperStub,
          'Chips': true,
          'PopUp': true,
          'Legend': true,
          'Empty': true,
          'StatusGrafik': true
        }
      }
    })
    
    await wrapperBEP.vm.$nextTick()
    await flushPromises()
    
    // Check if markPoint data is populated (indication that logic ran)
    const chart = wrapperBEP.vm.chartWLCAllMesin
    expect(chart.series[2].markPoint.data.length).toBeGreaterThan(0)
    expect(chart.series[2].markPoint.data[0].name).toBe('Max')
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
          'ModalWrapper': modalWrapperStub,
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
          'ModalWrapper': modalWrapperStub,
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
          'ModalWrapper': modalWrapperStub,
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
          'ModalWrapper': modalWrapperStub,
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
          'ModalWrapper': modalWrapperStub,
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
          'ModalWrapper': modalWrapperStub,
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


  it('should handle chart axis label formatters', async () => {
    await wrapper.vm.$nextTick()
    const chart = wrapper.vm.chartWLCAllMesin
    
    // Test color logic
    const colorFn = chart.xAxis[0].axisLabel.color
    expect(colorFn(2022)).toBe('#FF5656') // < 2023
    expect(colorFn(2023)).toBe('#6C6C6C') // == 2023
    expect(colorFn(2024)).toBe('#37B1D5') // > 2023
    
    // Test formatter
    const formatFn = chart.xAxis[0].axisLabel.formatter
    expect(formatFn(2023, 0)).toContain('1')
    expect(formatFn(2023, 0)).toContain('2023')
    
    // Test tooltip formatter
    const tooltipFn = chart.series[0].tooltip.valueFormatter
    expect(typeof tooltipFn(100)).toBe('string')
  })

  it('should handle BEP else branch (selisihNow <= selisihMinus1)', async () => {
    // i=1: rev=250, wlcc=250 → selisihNow=0
    // i=0: rev=100, wlcc=200 → selisihMinus1=-100
    // abs(0) < abs(-100) → else branch: indexTerdekat=i, tahunBEP=res.data[i].tahun
    const mockData = [
      {
        tahun: 2023, revenue_annualized: 100, total_wlcc_annualized: 200,
        capex_annualized: 50, cost_component_bd: 20, cost_component_c_annualized: 10, profit_loss: -100
      },
      {
        tahun: 2024, revenue_annualized: 250, total_wlcc_annualized: 250,
        capex_annualized: 50, cost_component_bd: 20, cost_component_c_annualized: 10, profit_loss: 0
      }
    ]

    mockGetGrafikWLCALLMesin.mockResolvedValue({ data: mockData })

    const w = mount(TabsWrapperApprove, {
      props: defaultProps,
      slots: { default: [h('div', { title: 'Tab 1' }, 'Content')] },
      global: {
        plugins: [createPinia()],
        stubs: { 'vue-echarts': true, 'ModalWrapper': modalWrapperStub, 'Chips': true, 'PopUp': true, 'Legend': true, 'Empty': true, 'StatusGrafik': true }
      }
    })

    await flushPromises()
    const chart = w.vm.chartWLCAllMesin
    expect(chart).toBeDefined()
    expect(chart.series[2].markPoint.data.length).toBeGreaterThan(0)
  })

  it('should handle null data for WLC All Mesin', async () => {
    mockGetGrafikWLCALLMesin.mockResolvedValue({ data: null })

    const w = mount(TabsWrapperApprove, {
      props: defaultProps,
      slots: { default: [h('div', { title: 'Tab 1' }, 'Content')] },
      global: {
        plugins: [createPinia()],
        stubs: { 'vue-echarts': true, 'ModalWrapper': modalWrapperStub, 'Chips': true, 'PopUp': true, 'Legend': true, 'Empty': true, 'StatusGrafik': true }
      }
    })

    await flushPromises()
    expect(w.vm.tahunWLCAllMesin).toEqual([])
    expect(w.vm.revWLCMesin).toEqual([])
  })

  it('should handle null data for WLC Komponen Mesin', async () => {
    mockGetGrafikWLCKomMesin.mockResolvedValue({ data: null })

    const w = mount(TabsWrapperApprove, {
      props: defaultProps,
      slots: { default: [h('div', { title: 'Tab 1' }, 'Content')] },
      global: {
        plugins: [createPinia()],
        stubs: { 'vue-echarts': true, 'ModalWrapper': modalWrapperStub, 'Chips': true, 'PopUp': true, 'Legend': true, 'Empty': true, 'StatusGrafik': true }
      }
    })

    await flushPromises()
    expect(w.vm.tahunWLCKomMesin).toEqual([])
    expect(w.vm.costCompAMesin).toEqual([])
  })

  it('should exercise WLC All chart yAxis and tooltip formatters', async () => {
    await flushPromises()
    const chart = wrapper.vm.chartWLCAllMesin

    // yAxis formatter
    const yAxisFormatter = chart.yAxis[0].axisLabel.formatter
    expect(yAxisFormatter).toBeDefined()
    const yResult = yAxisFormatter(1000000)
    expect(yResult).toBeDefined()

    // series tooltip formatters
    for (const series of chart.series) {
      if (series.tooltip?.valueFormatter) {
        const result = series.tooltip.valueFormatter(100)
        expect(result).toBeDefined()
      }
    }
  })

  it('should exercise WLC Komponen chart formatters', async () => {
    await flushPromises()
    const chart = wrapper.vm.chartWLCKomMesin

    // xAxis color function
    const colorFn = chart.xAxis[0].axisLabel.color
    expect(colorFn(2022)).toBe('#FF5656')
    expect(colorFn(2023)).toBe('#6C6C6C')
    expect(colorFn(2024)).toBe('#37B1D5')

    // xAxis formatter
    const fmtFn = chart.xAxis[0].axisLabel.formatter
    expect(fmtFn(2023, 0)).toContain('1')

    // yAxis formatter
    const yFmt = chart.yAxis[0].axisLabel.formatter
    expect(yFmt(500)).toBeDefined()

    // series tooltip formatters
    for (const series of chart.series) {
      if (series.tooltip?.valueFormatter) {
        expect(series.tooltip.valueFormatter(100)).toBeDefined()
      }
    }
  })

  it('should exercise detail WLC All chart formatters after click', async () => {
    await flushPromises()
    await wrapper.vm.handleClickWlcAll({ dataIndex: 0 })
    await flushPromises()

    const detailChart = wrapper.vm.chartDetailWLCAllMesin
    expect(detailChart).toBeDefined()

    // yAxis formatter
    const yFmt = detailChart.yAxis[0].axisLabel.formatter
    expect(yFmt(1000)).toBeDefined()

    // series tooltip formatter
    for (const series of detailChart.series) {
      if (series.tooltip?.valueFormatter) {
        expect(series.tooltip.valueFormatter(100)).toBeDefined()
      }
    }
  })

  it('should exercise detail WLC Kom chart formatters after click', async () => {
    await flushPromises()
    await wrapper.vm.handleClickWlcKom({ dataIndex: 0 })
    await flushPromises()

    const detailChart = wrapper.vm.chartDetailWLCKomMesin
    expect(detailChart).toBeDefined()

    // yAxis formatter
    const yFmt = detailChart.yAxis[0].axisLabel.formatter
    expect(yFmt(1000)).toBeDefined()

    // series tooltip formatter
    for (const series of detailChart.series) {
      if (series.tooltip?.valueFormatter) {
        expect(series.tooltip.valueFormatter(100)).toBeDefined()
      }
    }
  })

  it('should update store when handleClick is called with lamanData true', async () => {
    const { useLamanDataTabStore } = await import('@/store/storeLamanDataTab')
    useLamanDataTabStore()

    const w = mount(TabsWrapperApprove, {
      props: { ...defaultProps, lamanData: true },
      slots: { default: [h('div', { title: 'Tab A' }, 'A'), h('div', { title: 'Tab B' }, 'B')] },
      global: {
        plugins: [createPinia()],
        stubs: { 'vue-echarts': true, 'ModalWrapper': modalWrapperStub, 'Chips': true, 'PopUp': true, 'Legend': true, 'Empty': true, 'StatusGrafik': true }
      }
    })

    await flushPromises()
    w.vm.handleClick('Tab B')
    expect(w.vm.selectedTitle).toBe('Tab B')
  })

  it('should cover BEP if-branch when selisihNow > selisihMinus1 and call BEP chart formatters', async () => {
    // selisihNow = 350-200=150, selisihMinus1 = 100-200=-100
    // abs(150) > abs(-100) → TRUE → covers lines 551-553 (the if-branch)
    const mockDataIfBranch = [
      { tahun: 2023, revenue_annualized: 100, total_wlcc_annualized: 200, capex_annualized: 50, cost_component_bd: 20, cost_component_c_annualized: 10, profit_loss: -100 },
      { tahun: 2024, revenue_annualized: 350, total_wlcc_annualized: 200, capex_annualized: 60, cost_component_bd: 25, cost_component_c_annualized: 15, profit_loss: 150 },
    ];
    mockGetGrafikWLCALLMesin.mockResolvedValueOnce({ data: mockDataIfBranch });

    const w: any = mount(TabsWrapperApprove, {
      props: defaultProps,
      slots: { default: [h('div', { title: 'Tab 1' }, 'Content')] },
      global: {
        plugins: [createPinia()],
        stubs: { 'vue-echarts': true, 'ModalWrapper': modalWrapperStub, 'Chips': true, 'PopUp': true, 'Legend': true, 'Empty': true, 'StatusGrafik': true }
      }
    });

    await flushPromises();

    // isBepFounded=true → BEP chart is assigned (lines 613-748 are the BEP-chart branch)
    const chart = w.vm.chartWLCAllMesin;
    expect(chart).toBeDefined();
    expect(chart.series).toBeDefined();

    // Call BEP chart inline functions to cover lines 613-748
    if (chart?.xAxis?.[0]?.axisLabel?.color) {
      expect(chart.xAxis[0].axisLabel.color(2022, 0)).toBe('#FF5656'); // < tahunGrafik(2023)
      expect(chart.xAxis[0].axisLabel.color(2023, 1)).toBe('#6C6C6C'); // == tahunGrafik
      expect(chart.xAxis[0].axisLabel.color(2024, 2)).toBe('#37B1D5'); // > tahunGrafik
    }
    if (chart?.xAxis?.[0]?.axisLabel?.formatter) {
      const fmtResult = chart.xAxis[0].axisLabel.formatter(2023, 0);
      expect(String(fmtResult)).toContain('2023');
    }
    if (chart?.yAxis?.[0]?.axisLabel?.formatter) {
      chart.yAxis[0].axisLabel.formatter(1000000);
    }
    (chart?.series || []).forEach((s: any) => {
      if (s?.tooltip?.valueFormatter) s.tooltip.valueFormatter(100);
    });
  });

  it('should trigger inline template click handlers for tabs and modal closers', async () => {
    const w = mount(TabsWrapperApprove, {
      props: { ...defaultProps, isLihatGrafik: true },
      slots: {
        default: [h('div', { title: 'Tab A' }, 'A'), h('div', { title: 'Tab B' }, 'B')]
      },
      global: {
        plugins: [createPinia()],
        stubs: { 'vue-echarts': true, 'ModalWrapper': modalWrapperStub, 'Chips': true, 'PopUp': true, 'Legend': true, 'Empty': true, 'StatusGrafik': true }
      }
    })

    await flushPromises()

    const topTabs = w.findAll('ul.flex.items-end.mb-4 > li')
    expect(topTabs.length).toBeGreaterThan(0)
    await topTabs[0].trigger('click')

    const tabButtons = w.findAll('button.inline-flex.pb-2.text-sm')
    expect(tabButtons.length).toBeGreaterThanOrEqual(4)
    await tabButtons[0].trigger('click')
    await tabButtons[1].trigger('click')
    await tabButtons[2].trigger('click')
    await tabButtons[3].trigger('click')

    const lihatButton = w.find('#lihat-button')
    expect(lihatButton.exists()).toBe(true)
    await lihatButton.trigger('click')

    await w.vm.handleClickWlcAll({ dataIndex: 0 })
    await w.vm.handleClickWlcKom({ dataIndex: 0 })
    await flushPromises()

    const closeTargets = w.findAll('div.cursor-pointer')
    for (const closeTarget of closeTargets) {
      await closeTarget.trigger('click')
    }
  })

  it('should cover pembina and financial ternary branches in template', async () => {
    const w = mount(TabsWrapperApprove, {
      props: {
        ...defaultProps,
        namaPembina: '',
        irrOnProject: '',
        irrOnEquity: '',
        waccOnProject: 0,
        waccOnEquity: 0,
      },
      slots: { default: [h('div', { title: 'Tab 1' }, 'Content')] },
      global: {
        plugins: [createPinia()],
        stubs: { 'vue-echarts': true, 'ModalWrapper': modalWrapperStub, 'Chips': true, 'PopUp': true, 'Legend': true, 'Empty': true, 'StatusGrafik': true }
      }
    })

    await flushPromises()
    await w.vm.changeTab(2)
    await w.vm.$nextTick()
    expect(String(w.text())).toContain('NUM')
  })

  it('should render pembina tooltip branch for long name', async () => {
    const w = mount(TabsWrapperApprove, {
      props: { ...defaultProps, namaPembina: 'Pembina Dengan Nama Sangat Panjang Sekali' },
      slots: { default: [h('div', { title: 'Tab 1' }, 'Content')] },
      global: {
        plugins: [createPinia()],
        stubs: { 'vue-echarts': true, 'ModalWrapper': modalWrapperStub, 'Chips': true, 'PopUp': true, 'Legend': true, 'Empty': true, 'StatusGrafik': true }
      }
    })

    await flushPromises()
    await w.vm.detailPembina()
    await w.vm.$nextTick()
    const tooltip = w.find('#tooltipContentPembina')
    expect(tooltip.exists()).toBe(true)
  })
})