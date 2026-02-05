import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import GraphicCapexNcf from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicCapex_Ncf.vue'
import GrafikService from '@/services/grafik-service'
import { notifyError } from '@/services/helper/toast-notification'

// Mock services
vi.mock('@/services/grafik-service')
vi.mock('@/services/peta-service')
vi.mock('@/services/helper/toast-notification')

describe('GraphicCapex_Ncf.vue', () => {
  let wrapper: any
  let mockGrafikService: any

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
    title: 'Test Graphic Capex NCF',
    yearRange: [2020, 2025],
  }

  const mockGraphicData = {
    success: true,
    data: [{
      grafik: [
        {
          kode_jenis_kit: 'PLTU',
          data: { ncf: 80, capex: 1500 },
          nama_mesin: 'Test Machine 1',
        },
        {
          kode_jenis_kit: 'PLTG',
          data: { ncf: 75, capex: 1200 },
          nama_mesin: 'Test Machine 2',
        },
      ],
      legend: [
        { label: 'PLTU', color: '#ff0000' },
        { label: 'PLTG', color: '#00ff00' },
      ],
      average_pln_ncf: 77.5,
      average_pln_capex: 1350,
      average_ipp_ncf: 72,
      average_ipp_capex: 1250,
    }]
  }

  const mockInitialPembangkit = {
    data: [
      { kode_jenis_pembangkit: 'PLTU' },
      { kode_jenis_pembangkit: 'PLTG' }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockGrafikService = {
      getInitialPembangkit: vi.fn().mockResolvedValue(mockInitialPembangkit),
      getGraphicAnalitikCF: vi.fn().mockResolvedValue(mockGraphicData)
    }
    
    vi.mocked(GrafikService).mockImplementation(() => mockGrafikService)

    wrapper = mount(GraphicCapexNcf, {
      props: defaultProps,
      global: {
        stubs: {
          'ShimmerLoading': { template: '<div data-testid="loading">Loading...</div>' },
          'ModalWrapper': { 
            template: '<div data-testid="modal"><slot /></div>',
            props: ['showModal', 'width', 'height']
          },
          'DynamicScatterPlot': { 
            template: '<div data-testid="scatter-plot">Scatter Plot</div>',
            props: ['source', 'series', 'legends', 'pln', 'ipp', 'xData', 'yData', 'dataZoom']
          },
          'Empty': { template: '<div data-testid="empty-state">Empty Data</div>' },
          'el-select': { 
            template: '<select data-testid="select"><slot /></select>',
            props: ['modelValue', 'multiple', 'clearable']
          },
          'el-option': { template: '<option></option>' },
          'el-checkbox': { template: '<input type="checkbox" />' },
          'VueDatePicker': { template: '<input data-testid="date-picker" />' }
        }
      }
    })
  })

  describe('Component Initialization', () => {
    it('should render component with title', () => {
      expect(wrapper.text()).toContain('Test Graphic Capex NCF')
    })

    it('should initialize and fetch data on mount', async () => {
      await nextTick()
      
      expect(mockGrafikService.getInitialPembangkit).toHaveBeenCalled()
      expect(mockGrafikService.getGraphicAnalitikCF).toHaveBeenCalled()
    })

    it('should populate initial pembangkit data', async () => {
      await nextTick()
      
      const vm = wrapper.vm as any
      expect(vm.value).toEqual(['PLTU', 'PLTG'])
    })
  })

  describe('Data Fetching', () => {
    it('should process graph data successfully', async () => {
      const vm = wrapper.vm as any
      await vm.getDataGraph()

      expect(vm.graphData.isEmpty).toBe(false)
      expect(vm.graphData.series).toHaveLength(2)
      expect(vm.graphData.legends).toHaveLength(2)
      expect(vm.graphData.pln.x).toBe(77.5)
      expect(vm.graphData.ipp.x).toBe(72)
    })

    it('should handle empty graph data', async () => {
      mockGrafikService.getGraphicAnalitikCF.mockResolvedValue({
        success: true,
        data: [{ grafik: null, legend: [] }]
      })

      const vm = wrapper.vm as any
      await vm.getDataGraph()

      expect(vm.graphData.isEmpty).toBe(true)
    })

    it('should handle API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      mockGrafikService.getGraphicAnalitikCF.mockRejectedValue(new Error('API Error'))

      const vm = wrapper.vm as any
      await vm.getDataGraph()

      expect(vm.isLoading).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('Filter Functionality', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should validate filter inputs in closeModal', () => {
      const vm = wrapper.vm as any
      
      // Test case: no kategori pembangkit and no tahun
      vm.value = []
      vm.filter.tahun = null
      vm.closeModal()
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 
        5000
      )
    })

    it('should validate kategori pembangkit only in closeModal', () => {
      const vm = wrapper.vm as any
      
      vm.value = []
      vm.filter.tahun = 2024
      vm.closeModal()
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000)
    })

    it('should close modal when validation passes', () => {
      const vm = wrapper.vm as any
      
      vm.value = ['PLTU']
      vm.filter.tahun = 2024
      vm.showModal = true
      vm.closeModal()
      
      expect(vm.showModal).toBe(false)
    })
  })

  describe('Apply Filter Functions', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should show validation error in applyFilter when invalid', async () => {
      const vm = wrapper.vm as any
      
      vm.value = []
      vm.filter.tahun = null
      
      await vm.applyFilter()
      
      expect(notifyError).toHaveBeenCalledWith(
        'Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 
        5000
      )
    })

    it('should show validation error in applyFilterNoDMN when invalid', async () => {
      const vm = wrapper.vm as any
      
      vm.value = []
      vm.filter.tahun = 2024
      
      await vm.applyFilterNoDMN()
      
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000)
    })
  })

  describe('Checkbox Handlers', () => {
    it('should handle check all pembangkit', () => {
      const vm = wrapper.vm as any
      
      vm.handleCheckAll(true)
      expect(vm.value).toEqual(['PLTU', 'PLTG', 'PLTS'])
      expect(vm.indeterminate).toBe(false)
      
      vm.handleCheckAll(false)
      expect(vm.value).toEqual([])
    })

    it('should handle check all DMN', () => {
      const vm = wrapper.vm as any
      
      vm.handleCheckDmn(true)
      expect(vm.dmn).toEqual(['1', '2', '3'])
      expect(vm.indeterminateDmn).toBe(false)
      
      vm.handleCheckDmn(false)
      expect(vm.dmn).toEqual([])
    })
  })

  describe('Watch Effects', () => {
    it('should update checkAll state based on value changes', async () => {
      const vm = wrapper.vm as any
      
      // Empty selection
      vm.value = []
      await nextTick()
      expect(vm.checkAll).toBe(false)
      expect(vm.indeterminate).toBe(false)
      
      // Partial selection
      vm.value = ['PLTU']
      await nextTick()
      expect(vm.indeterminate).toBe(true)
      
      // Full selection
      vm.value = ['PLTU', 'PLTG', 'PLTS']
      await nextTick()
      expect(vm.checkAll).toBe(true)
      expect(vm.indeterminate).toBe(false)
    })

    it('should update DMN checkbox states', async () => {
      const vm = wrapper.vm as any
      
      // Empty DMN
      vm.dmn = []
      await nextTick()
      expect(vm.checkDmn).toBe(false)
      expect(vm.indeterminateDmn).toBe(false)
      
      // Partial DMN
      vm.dmn = [1]
      await nextTick()
      expect(vm.indeterminateDmn).toBe(true)
      
      // Full DMN
      vm.dmn = [1, 2, 3]
      await nextTick()
      expect(vm.checkDmn).toBe(true)
      expect(vm.indeterminateDmn).toBe(false)
    })
  })

  describe('Data Processing', () => {
    it('should correctly map graph data to series', async () => {
      const vm = wrapper.vm as any
      await vm.getDataGraph()

      const series = vm.graphData.series
      expect(series[0].name).toBe('PLTU')
      expect(series[0].type).toBe('scatter')
      expect(series[0].color).toBe('#ff0000')
      expect(series[0].data).toEqual([[80, 1500, 5, 'Test Machine 1']])
      
      expect(series[1].name).toBe('PLTG')
      expect(series[1].data).toEqual([[75, 1200, 5, 'Test Machine 2']])
    })

    it('should populate source data correctly', async () => {
      const vm = wrapper.vm as any
      await vm.getDataGraph()

      expect(vm.graphData.source).toEqual([
        [80, 1500],
        [75, 1200]
      ])
    })
  })

  describe('Error Handling', () => {
    it('should handle fetchInitialPembangkit error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockGrafikService.getInitialPembangkit.mockRejectedValue(new Error('Fetch error'))
      
      const vm = wrapper.vm as any
      await vm.fetchInitialPembangkit()
      
      expect(consoleSpy).toHaveBeenCalledWith(
        'Fetch Initial Pembangkit Error : ', 
        expect.any(Error)
      )
      consoleSpy.mockRestore()
    })

    it('should handle getDataGraphNoDMN error', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      mockGrafikService.getGraphicAnalitikCF.mockRejectedValue(new Error('Graph error'))
      
      const vm = wrapper.vm as any
      await vm.getDataGraphNoDMN()
      
      expect(vm.isLoading).toBe(false)
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('UI Interaction & Event Handling', () => {
    it('should remove selected pembangkit', () => {
      const vm = wrapper.vm as any
      vm.value = ['PLTU', 'PLTG']
      
      vm.removeSelectedPembangkit('PLTU')
      expect(vm.value).toEqual(['PLTG'])
    })

    it('should clear all pembangkit', () => {
      const vm = wrapper.vm as any
      vm.value = ['PLTU', 'PLTG']
      
      vm.clearPembangkit()
      expect(vm.value).toEqual([])
    })

    it('should toggle pembangkit dropdown', () => {
      const vm = wrapper.vm as any
      expect(vm.isPembangkitDropdownOpen).toBe(false)
      
      vm.togglePembangkitDropdown()
      expect(vm.isPembangkitDropdownOpen).toBe(true)
      
      vm.togglePembangkitDropdown()
      expect(vm.isPembangkitDropdownOpen).toBe(false)
    })

    it('should remove selected DMN', () => {
      const vm = wrapper.vm as any
      vm.dmn = ['1', '2']
      
      vm.removeSelectedDmn('1')
      expect(vm.dmn).toEqual(['2'])
    })

    it('should clear all DMN', () => {
      const vm = wrapper.vm as any
      vm.dmn = ['1', '2']
      
      vm.clearDmn()
      expect(vm.dmn).toEqual([])
    })

    it('should toggle DMN dropdown', () => {
      const vm = wrapper.vm as any
      expect(vm.isDmnDropdownOpen).toBe(false)
      
      vm.toggleDmnDropdown()
      expect(vm.isDmnDropdownOpen).toBe(true)
      
      vm.toggleDmnDropdown()
      expect(vm.isDmnDropdownOpen).toBe(false)
    })

    it('should handle click outside to close dropdowns', () => {
      const vm = wrapper.vm as any
      vm.isPembangkitDropdownOpen = true
      vm.isDmnDropdownOpen = true
      
      const target = document.createElement('div')
      target.closest = vi.fn().mockReturnValue(false)
      
      const event = { target } as unknown as MouseEvent
      
      vm.handleClickOutside(event)
      
      expect(vm.isPembangkitDropdownOpen).toBe(false)
      expect(vm.isDmnDropdownOpen).toBe(false)
    })

    it('should NOT close dropdowns when clicking inside', () => {
      const vm = wrapper.vm as any
      vm.isPembangkitDropdownOpen = true
      vm.isDmnDropdownOpen = true
      
      const target = document.createElement('div')
      target.closest = vi.fn().mockImplementation((selector) => selector === '.relative')
      
      const event = { target } as unknown as MouseEvent
      
      vm.handleClickOutside(event)
      
      expect(vm.isPembangkitDropdownOpen).toBe(true)
      expect(vm.isDmnDropdownOpen).toBe(true)
    })
  })

  describe('Comprehensive Validation Logic', () => {
    // Tests for closeModal branches
    it('should close modal if values are selected and year selected', () => {
      const vm = wrapper.vm as any
      vm.value = ['PLTU']
      vm.filter.tahun = 2024
      vm.showModal = true
      
      vm.closeModal()
      expect(vm.showModal).toBe(false)
    })

    it('should error in closeModal if value is empty and year is null', () => {
      const vm = wrapper.vm as any
      vm.value = []
      vm.filter.tahun = null
      
      vm.closeModal()
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000)
    })

    it('should error in closeModal if year is null', () => {
      const vm = wrapper.vm as any
      vm.value = ['PLTU']
      vm.filter.tahun = null
      
      vm.closeModal()
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih 1 tahun!', 5000)
    })

    it('should error in closeModal if value is empty', () => {
      const vm = wrapper.vm as any
      vm.value = []
      vm.filter.tahun = 2024
      
      vm.closeModal()
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000)
    })

    // Tests for applyFilter branches
    it('should apply filter and close modal if values are selected and year selected', async () => {
      const vm = wrapper.vm as any
      vm.value = ['PLTU']
      vm.filter.tahun = 2024
      vm.showModal = true
      
      await vm.applyFilter()
      expect(mockGrafikService.getGraphicAnalitikCF).toHaveBeenCalled()
      expect(vm.showModal).toBe(false)
    })

    it('should error in applyFilter if value is empty and year is null', async () => {
      const vm = wrapper.vm as any
      vm.value = []
      vm.filter.tahun = null
      
      await vm.applyFilter()
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000)
    })

    it('should error in applyFilter if year is null (with value selected)', async () => {
      const vm = wrapper.vm as any
      vm.value = ['PLTU']
      vm.filter.tahun = null
      
      await vm.applyFilter()
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih 1 tahun!', 5000)
    })

    it('should error in applyFilter if value is empty', async () => {
      const vm = wrapper.vm as any
      vm.value = []
      vm.filter.tahun = 2024
      
      await vm.applyFilter()
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000)
    })

    // Tests for applyFilterNoDMN branches
    it('should apply filter no DMN and close modal if values are selected and year selected', async () => {
      const vm = wrapper.vm as any
      vm.value = ['PLTU']
      vm.filter.tahun = 2024
      vm.showModal = true
      
      await vm.applyFilterNoDMN()
      expect(mockGrafikService.getGraphicAnalitikCF).toHaveBeenCalled()
      expect(vm.showModal).toBe(false)
    })

    it('should error in applyFilterNoDMN if value is empty and year is null', async () => {
      const vm = wrapper.vm as any
      vm.value = []
      vm.filter.tahun = null
      
      await vm.applyFilterNoDMN()
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000)
    })

    it('should error in applyFilterNoDMN if year is null', async () => {
      const vm = wrapper.vm as any
      vm.value = ['PLTU']
      vm.filter.tahun = null
      
      await vm.applyFilterNoDMN()
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih 1 tahun!', 5000)
    })

    it('should error in applyFilterNoDMN if value is empty', async () => {
      const vm = wrapper.vm as any
      vm.value = []
      vm.filter.tahun = 2024
      
      await vm.applyFilterNoDMN()
      expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000)
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })
})
