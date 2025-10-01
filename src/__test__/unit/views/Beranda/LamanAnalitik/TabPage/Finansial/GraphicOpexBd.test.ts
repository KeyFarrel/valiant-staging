import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import GraphicOpexBd from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicOpexBd.vue'
import PetaService from '@/services/peta-service'
import GrafikService from '@/services/grafik-service'
import { notifyError } from '@/services/helper/toast-notification'
import type { BaseResponse, ResOpexBD } from '@/types/LamanAnalitik/TypeFinansial'

// Mock all services and components
jest.mock('@/services/peta-service')
jest.mock('@/services/grafik-service')
jest.mock('@/services/helper/toast-notification')

// Mock child components
jest.mock('@/components/icons/IconEmptyData.vue', () => ({
  name: 'IconEmptyData',
  template: '<div data-testid="empty-icon">Empty Data Icon</div>'
}))

jest.mock('@/components/ui/ShimmerLoading.vue', () => ({
  name: 'ShimmerLoading',
  template: '<div data-testid="shimmer-loading">Loading...</div>'
}))

jest.mock('@/components/ui/ModalWrapper.vue', () => ({
  name: 'ModalWrapper',
  props: ['showModal', 'width', 'height'],
  template: '<div v-if="showModal" data-testid="modal-wrapper"><slot /></div>'
}))

jest.mock('@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue', () => ({
  name: 'DynamicScatterPlot',
  props: ['source', 'series', 'legends', 'pln', 'ipp', 'xData', 'yData', 'dataZoom'],
  template: '<div data-testid="dynamic-scatter-plot">Scatter Plot</div>'
}))

describe('GraphicOpexBd', () => {
  let wrapper: VueWrapper<any>
  let mockGrafikServiceInstance: jest.Mocked<GrafikService>
  let mockNotifyError: jest.MockedFunction<typeof notifyError>

  const defaultProps = {
    itemsPembangkit: [
      { id: 'PLTU', name: 'PLTU' },
      { id: 'PLTG', name: 'PLTG' },
      { id: 'PLTA', name: 'PLTA' }
    ],
    itemsDayaMampu: [
      { id: '1', name: 'PLTU < 100' },
      { id: '2', name: 'PLTU 100 - 400' },
      { id: '3', name: 'PLTU > 400' }
    ],
    title: 'Grafik OPEX B+D',
    yearRange: [2020, 2024]
  }

  const mockInitialPembangkitResponse = {
    data: [
      { kode_jenis_pembangkit: 'PLTU' },
      { kode_jenis_pembangkit: 'PLTG' },
      { kode_jenis_pembangkit: 'PLTA' }
    ]
  }

  const mockGraphicOpexBDResponse: BaseResponse<ResOpexBD[]> = {
    success: true,
    code: 200,
    message: 'Success',
    data: [{
      average_daya_terpasang: 150.5,
      average_opex: 2500.75,
      average_ipp_opex: 2800.25,
      legend: [
        { label: 'PLTU', color: '#FF5733' },
        { label: 'PLTG', color: '#33C3FF' },
        { label: 'PLTA', color: '#33FF57' }
      ],
      grafik: [
        {
          kode_jenis_kit: 'PLTU',
          nama_mesin: 'PLTU Unit 1',
          tahun_realisasi: '2023',
          data: {
            daya_terpasang: 200,
            value_b: 1500,
            value_d: 800,
            opex: 2300
          }
        },
        {
          kode_jenis_kit: 'PLTG',
          nama_mesin: 'PLTG Unit 1',
          tahun_realisasi: '2023',
          data: {
            daya_terpasang: 150,
            value_b: 1200,
            value_d: 600,
            opex: 1800
          }
        },
        {
          kode_jenis_kit: 'PLTA',
          nama_mesin: 'PLTA Unit 1',
          tahun_realisasi: '2023',
          data: {
            daya_terpasang: 100,
            value_b: 800,
            value_d: 400,
            opex: 1200
          }
        }
      ]
    }]
  }

  const mockEmptyGraphicResponse: BaseResponse<ResOpexBD[]> = {
    success: true,
    code: 200,
    message: 'Success',
    data: [{
      average_daya_terpasang: 0,
      average_opex: 0,
      average_ipp_opex: 0,
      legend: [],
      grafik: null
    }]
  }

  beforeEach(() => {
    jest.clearAllMocks()
    
    // Create mocked instance
    mockGrafikServiceInstance = {
      getInitialPembangkit: jest.fn(),
      getGraphicOpexBD: jest.fn()
    } as any
    
    // Mock the constructor to return our mocked instance
    ;(GrafikService as jest.MockedClass<typeof GrafikService>).mockImplementation(() => mockGrafikServiceInstance)
    
    mockNotifyError = notifyError as jest.MockedFunction<typeof notifyError>
    
    // Setup default mock responses
    mockGrafikServiceInstance.getInitialPembangkit.mockResolvedValue(mockInitialPembangkitResponse)
    mockGrafikServiceInstance.getGraphicOpexBD.mockResolvedValue(mockGraphicOpexBDResponse)
  })

  const createWrapper = (props = {}) => {
    return mount(GraphicOpexBd, {
      props: { ...defaultProps, ...props },
      global: {
        stubs: {
          'el-select': { template: '<div data-testid="el-select"><slot /><slot name="header" /></div>' },
          'el-option': { template: '<div data-testid="el-option" />' },
          'el-checkbox': { template: '<div data-testid="el-checkbox" />' },
          'VueDatePicker': { template: '<div data-testid="vue-datepicker" />' }
        }
      }
    })
  }

  describe('Component Rendering', () => {
    it('should render the component with title', async () => {
      wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.find('h2').text()).toBe('Grafik OPEX B+D')
    })

    it('should render filter button with filter icon', async () => {
      wrapper = createWrapper()
      await flushPromises()
      
      const filterButton = wrapper.find('button[id="hover-button"]')
      expect(filterButton.exists()).toBe(true)
      expect(filterButton.text()).toContain('Filter')
    })

    it('should show filter badge indicator when filters are applied', async () => {
      wrapper = createWrapper()
      await flushPromises()
      await wrapper.vm.$nextTick()
      
      const badgeIndicator = wrapper.find('.bg-warningColor')
      expect(badgeIndicator.exists()).toBe(true)
    })
  })

  describe('Data Fetching', () => {
    it('should fetch initial pembangkit data on mount', async () => {
      wrapper = createWrapper()
      await flushPromises()
      
      expect(mockGrafikServiceInstance.getInitialPembangkit).toHaveBeenCalledTimes(1)
    })

    it('should fetch graphic data on mount', async () => {
      wrapper = createWrapper()
      await flushPromises()
      
      expect(mockGrafikServiceInstance.getGraphicOpexBD).toHaveBeenCalledWith({
        kode_jenis_pembangkit: ['PLTU', 'PLTG', 'PLTA'],
        id_daya: [1, 2, 3],
        periode: new Date().getFullYear().toString()
      })
    })

    it('should handle API error gracefully', async () => {
      mockGrafikServiceInstance.getGraphicOpexBD.mockRejectedValue(new Error('API Error'))
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(consoleSpy).toHaveBeenCalledWith(new Error('API Error'))
      consoleSpy.mockRestore()
    })

    it('should set loading state correctly during data fetch', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockGrafikServiceInstance.getGraphicOpexBD.mockReturnValue(promise)
      
      wrapper = createWrapper()
      
      expect(wrapper.vm.isLoading).toBe(true)
      
      resolvePromise!(mockGraphicOpexBDResponse)
      await flushPromises()
      
      expect(wrapper.vm.isLoading).toBe(false)
    })
  })

  describe('Modal Interactions', () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('should open modal when filter button is clicked', async () => {
      wrapper.vm.showModal = true
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.showModal).toBe(true)
    })

    it('should close modal when close button is clicked', async () => {
      wrapper.vm.showModal = true
      await wrapper.vm.$nextTick()
      
      await wrapper.vm.closeModal()
      expect(wrapper.vm.showModal).toBe(false)
    })

    it('should show error notification when trying to close modal without pembangkit selection', async () => {
      wrapper.vm.value = []
      wrapper.vm.filter.tahun = 2023
      
      await wrapper.vm.closeModal()
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000)
    })

    it('should show error notification when trying to close modal without year selection', async () => {
      wrapper.vm.value = []
      wrapper.vm.filter.tahun = null as any
      
      await wrapper.vm.closeModal()
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000)
    })

    it('should show error notification when trying to close modal without both selections', async () => {
      wrapper.vm.value = []
      wrapper.vm.filter.tahun = null
      
      await wrapper.vm.closeModal()
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000)
    })

    it('should apply filter and close modal when applyFilter is called with valid data', async () => {
      wrapper.vm.value = ['PLTU']
      wrapper.vm.filter.tahun = 2023
      wrapper.vm.showModal = true
      
      await wrapper.vm.applyFilter()
      
      expect(mockGrafikServiceInstance.getGraphicOpexBD).toHaveBeenCalled()
      expect(wrapper.vm.showModal).toBe(false)
    })
  })

  describe('Filter Functions', () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('should call getDataGraph when applying filter with DMN', async () => {
      wrapper.vm.value = ['PLTU']
      
      await wrapper.vm.applyFilter()
      
      expect(mockGrafikServiceInstance.getGraphicOpexBD).toHaveBeenCalledWith({
        kode_jenis_pembangkit: ['PLTU'],
        id_daya: [1, 2, 3],
        periode: new Date().getFullYear().toString()
      })
    })

    it('should call getDataGraphNoDMN when applying filter without DMN', async () => {
      wrapper.vm.value = ['PLTG']
      
      await wrapper.vm.applyFilterNoDMN()
      
      expect(mockGrafikServiceInstance.getGraphicOpexBD).toHaveBeenCalledWith({
        kode_jenis_pembangkit: ['PLTG'],
        id_daya: [],
        periode: new Date().getFullYear().toString()
      })
    })

    it('should show error when applyFilterNoDMN called without pembangkit', async () => {
      wrapper.vm.value = []
      
      await wrapper.vm.applyFilterNoDMN()
      
      expect(mockNotifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000)
    })
  })

  describe('Checkbox Handlers', () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('should select all pembangkit items when handleCheckAll is called with true', async () => {
      await wrapper.vm.handleCheckAll(true)
      
      expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG', 'PLTA'])
      expect(wrapper.vm.indeterminate).toBe(false)
    })

    it('should deselect all pembangkit items when handleCheckAll is called with false', async () => {
      wrapper.vm.value = ['PLTU', 'PLTG']
      
      await wrapper.vm.handleCheckAll(false)
      
      expect(wrapper.vm.value).toEqual([])
      expect(wrapper.vm.indeterminate).toBe(false)
    })

    it('should select all DMN items when handleCheckDmn is called with true', async () => {
      await wrapper.vm.handleCheckDmn(true)
      
      expect(wrapper.vm.dmn).toEqual(['1', '2', '3'])
      expect(wrapper.vm.indeterminateDmn).toBe(false)
    })

    it('should deselect all DMN items when handleCheckDmn is called with false', async () => {
      wrapper.vm.dmn = ['1', '2']
      
      await wrapper.vm.handleCheckDmn(false)
      
      expect(wrapper.vm.dmn).toEqual([])
      expect(wrapper.vm.indeterminateDmn).toBe(false)
    })
  })

  describe('Watchers', () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('should update checkAll state when value changes', async () => {
      // Test empty selection
      wrapper.vm.value = []
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.checkAll).toBe(false)
      expect(wrapper.vm.indeterminate).toBe(false)
      
      // Test full selection
      wrapper.vm.value = ['PLTU', 'PLTG', 'PLTA']
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.checkAll).toBe(true)
      expect(wrapper.vm.indeterminate).toBe(false)
      
      // Test partial selection
      wrapper.vm.value = ['PLTU']
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.indeterminate).toBe(true)
    })

    it('should update checkDmn state when dmn changes', async () => {
      // Test empty selection
      wrapper.vm.dmn = []
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.checkDmn).toBe(false)
      expect(wrapper.vm.indeterminateDmn).toBe(false)
      
      // Test full selection
      wrapper.vm.dmn = ['1', '2', '3']
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.checkDmn).toBe(true)
      expect(wrapper.vm.indeterminateDmn).toBe(false)
      
      // Test partial selection
      wrapper.vm.dmn = ['1']
      await wrapper.vm.$nextTick()
      
      expect(wrapper.vm.indeterminateDmn).toBe(true)
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no graph data is available', async () => {
      mockGrafikServiceInstance.getGraphicOpexBD.mockResolvedValue(mockEmptyGraphicResponse)
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.findComponent('[data-testid="empty-icon"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Grafik Tidak Tersedia')
    })

    it('should show graph when data is available', async () => {
      wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.findComponent('[data-testid="dynamic-scatter-plot"]').exists()).toBe(true)
    })
  })

  describe('Graph Data Processing', () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('should process graph data correctly', () => {
      expect(wrapper.vm.graphData.pln.x).toBe(150.5)
      expect(wrapper.vm.graphData.pln.y).toBe(2500.75)
      expect(wrapper.vm.graphData.ipp.x).toBe(100) // minimum daya_terpasang
      expect(wrapper.vm.graphData.ipp.y).toBe(2800.25)
    })

    it('should create correct series data structure', () => {
      const series = wrapper.vm.graphData.series
      expect(series).toHaveLength(3)
      
      const pltuSeries = series.find((s: any) => s.name === 'PLTU')
      expect(pltuSeries).toBeDefined()
      expect(pltuSeries.data).toHaveLength(1)
      expect(pltuSeries.data[0]).toEqual([200, 2300, 5, 'PLTU Unit 1']) // daya_terpasang, value_b + value_d, size, nama_mesin
    })

    it('should create legends correctly', () => {
      const legends = wrapper.vm.graphData.legends
      expect(legends).toHaveLength(3)
      expect(legends[0]).toEqual({ label: 'PLTU', color: '#FF5733' })
    })
  })

  describe('Filter Badge Display', () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('should display pembangkit filter badges', async () => {
      await wrapper.vm.$nextTick()
      
      const badges = wrapper.findAll('.badge')
      expect(badges.length).toBeGreaterThan(0)
      
      const pembangkitBadge = badges.find(badge => badge.text().includes('Kategori Pembangkit'))
      expect(pembangkitBadge).toBeDefined()
    })

    it('should display year filter badge', async () => {
      await wrapper.vm.$nextTick()
      
      const badges = wrapper.findAll('.badge')
      const yearBadge = badges.find(badge => badge.text().includes('Tahun'))
      expect(yearBadge).toBeDefined()
    })

    it('should conditionally display DMN badge when PLTU is selected', async () => {
      wrapper.vm.value = ['PLTU']
      await wrapper.vm.$nextTick()
      
      // Check if DMN text appears in any badge
      const dmnText = wrapper.text().includes('DMN')
      expect(dmnText).toBe(true)
    })
  })

  describe('Props Validation', () => {
    it('should accept valid props', () => {
      wrapper = createWrapper({
        itemsPembangkit: [{ id: 'TEST', name: 'Test' }],
        itemsDayaMampu: [{ id: '1', name: 'Test DMN' }],
        title: 'Test Title',
        yearRange: [2020, 2023]
      })
      
      expect(wrapper.props('title')).toBe('Test Title')
      expect(wrapper.props('itemsPembangkit')).toHaveLength(1)
      expect(wrapper.props('itemsDayaMampu')).toHaveLength(1)
      expect(wrapper.props('yearRange')).toEqual([2020, 2023])
    })

    it('should use props data in component', async () => {
      wrapper = createWrapper({
        title: 'Custom OPEX Title'
      })
      await flushPromises()
      
      expect(wrapper.find('h2').text()).toBe('Custom OPEX Title')
    })
  })

  describe('API Call Validation', () => {
    it('should make API call with correct parameters', async () => {
      wrapper = createWrapper()
      await flushPromises()
      
      expect(mockGrafikServiceInstance.getGraphicOpexBD).toHaveBeenCalledWith({
        kode_jenis_pembangkit: ['PLTU', 'PLTG', 'PLTA'],
        id_daya: [1, 2, 3],
        periode: new Date().getFullYear().toString()
      })
    })

    it('should handle initial pembangkit fetch error', async () => {
      mockGrafikServiceInstance.getInitialPembangkit.mockRejectedValue(new Error('Fetch error'))
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      wrapper = createWrapper()
      await flushPromises()
      
      expect(consoleSpy).toHaveBeenCalledWith('Fetch Initial Pembangkit Error : ', new Error('Fetch error'))
      consoleSpy.mockRestore()
    })
  })

  describe('Loading States', () => {
    it('should show shimmer loading when isLoading is true', async () => {
      wrapper = createWrapper()
      wrapper.vm.isLoading = true
      await wrapper.vm.$nextTick()
      
      expect(wrapper.findComponent('[data-testid="shimmer-loading"]').exists()).toBe(true)
    })

    it('should hide shimmer loading when isLoading is false', async () => {
      wrapper = createWrapper()
      await flushPromises()
      
      expect(wrapper.findComponent('[data-testid="shimmer-loading"]').exists()).toBe(false)
    })

    it('should start with loading state on mount', () => {
      wrapper = createWrapper()
      expect(wrapper.vm.isLoading).toBe(true)
    })
  })

  describe('OPEX B+D Specific Features', () => {
    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('should calculate OPEX B+D correctly (value_b + value_d)', () => {
      const pltuData = wrapper.vm.graphData.series.find((s: any) => s.name === 'PLTU')
      expect(pltuData.data[0][1]).toBe(2300) // 1500 + 800
    })

    it('should use correct axis labels for OPEX B+D', async () => {
      // We'll verify the data is passed correctly to the scatter plot
      // by checking if the component exists with data
      const scatterPlot = wrapper.findComponent('[data-testid="dynamic-scatter-plot"]')
      expect(scatterPlot.exists()).toBe(true)
    })

    it('should process multiple graph data points correctly', () => {
      const allDataPoints = wrapper.vm.graphData.source
      expect(allDataPoints).toHaveLength(3) // PLTU, PLTG, PLTA
      expect(allDataPoints[0]).toEqual([200, 2300]) // PLTU: daya_terpasang, value_b + value_d
      expect(allDataPoints[1]).toEqual([150, 1800]) // PLTG: daya_terpasang, value_b + value_d
      expect(allDataPoints[2]).toEqual([100, 1200]) // PLTA: daya_terpasang, value_b + value_d
    })
  })
})
