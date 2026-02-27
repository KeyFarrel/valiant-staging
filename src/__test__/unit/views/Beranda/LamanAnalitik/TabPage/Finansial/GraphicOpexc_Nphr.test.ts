import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import GraphicOpexcNphr from '@/views/Beranda/LamanAnalitik/TabPage/Finansial/GraphicOpexc_Nphr.vue'
import GrafikService from '@/services/grafik-service'
import PetaService from '@/services/peta-service'
import { notifyError } from '@/services/helper/toast-notification'

// Mock services
vi.mock('@/services/grafik-service')
vi.mock('@/services/peta-service')
vi.mock('@/services/helper/toast-notification')

// Mock components
vi.mock('@/components/icons/IconEmptyData.vue', () => ({
  default: { name: 'IconEmptyData', template: '<div data-testid="empty-data">Empty</div>' }
}))
vi.mock('@/components/ui/ShimmerLoading.vue', () => ({
  default: { name: 'ShimmerLoading', template: '<div data-testid="shimmer">Loading</div>' }
}))
vi.mock('@/components/ui/ModalWrapper.vue', () => ({
  default: { name: 'ModalWrapper', props: ['showModal'], template: '<div v-if="showModal"><slot /></div>' }
}))
vi.mock('@/views/Beranda/LamanAnalitik/TabPage/DynamicScatterPlot.vue', () => ({
  default: { name: 'DynamicScatterPlot', template: '<div data-testid="scatter-plot">Chart</div>' }
}))

const mockElSelect = {
  name: 'ElSelect',
  props: ['modelValue', 'multiple'],
  template: '<div><slot /></div>',
  emits: ['update:modelValue']
}
const mockElOption = { name: 'ElOption', props: ['value', 'label'], template: '<div></div>' }
const mockElCheckbox = { name: 'ElCheckbox', props: ['modelValue'], template: '<input type="checkbox" />', emits: ['update:modelValue'] }
const mockVueDatePicker = { name: 'VueDatePicker', props: ['modelValue'], template: '<input type="date" />', emits: ['update:modelValue'] }

describe('GraphicOpexcNphr', () => {
  let mockGrafikService: any
  let wrapper: any

  const defaultProps = {
    itemsPembangkit: [
      { id: 'PLTU', name: 'PLTU' },
      { id: 'PLTG', name: 'PLTG' }
    ],
    itemsDayaMampu: [
      { id: '1', name: 'PLTU < 100' },
      { id: '2', name: 'PLTU 100 - 400' }
    ],
    title: 'Test Chart',
    yearRange: [2020, 2025],
    initialPembangkit: ['PLTU', 'PLTG']
  }

  const mockSuccessResponse = {
    success: true,
    data: [{
      grafik: [{
        kode_jenis_kit: 'PLTU',
        data: { nphr: 2500, value_c: 75 },
        nama_mesin: 'Test Machine'
      }],
      legend: [{ label: 'PLTU', color: '#ff0000' }],
      average_nphr: 2500,
      average_value_c: 75,
      average_ipp_nphr: 2600,
      average_ipp_valuec: 80
    }]
  }

  const mockInitialResponse = {
    data: [{ kode_jenis_pembangkit: 'PLTU' }, { kode_jenis_pembangkit: 'PLTG' }]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockGrafikService = {
      getInitialPembangkit: vi.fn().mockResolvedValue(mockInitialResponse),
      getGraphicOpexC: vi.fn().mockResolvedValue(mockSuccessResponse)
    }
    vi.mocked(GrafikService).mockImplementation(() => mockGrafikService)
  })

  const createWrapper = (props = {}) => {
    return mount(GraphicOpexcNphr, {
      props: { ...defaultProps, ...props },
      global: {
        components: {
          'el-select': mockElSelect,
          'el-option': mockElOption,
          'el-checkbox': mockElCheckbox,
          'VueDatePicker': mockVueDatePicker
        }
      }
    })
  }

  it('should handle component lifecycle and all script functions', async () => {
    wrapper = createWrapper()
    await flushPromises()

    // Test onMounted lifecycle - fetchInitialPembangkit reads from props.initialPembangkit
    expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG'])
    expect(mockGrafikService.getGraphicOpexC).toHaveBeenCalled()
    expect(wrapper.vm.isLoading).toBe(false)

    // Test fetchInitialPembangkit with empty prop fallback
    const wrapperEmpty = createWrapper({ initialPembangkit: undefined })
    await flushPromises()
    expect(wrapperEmpty.vm.value).toEqual([])

    // Test getDataGraph success path
    wrapper.vm.value = ['PLTU']
    wrapper.vm.dmn = [1, 2]
    await wrapper.vm.getDataGraph()
    expect(wrapper.vm.graphData.isEmpty).toBe(false)
    expect(wrapper.vm.graphData.series).toHaveLength(1)

    // Test getDataGraph error path
    mockGrafikService.getGraphicOpexC.mockRejectedValue(new Error('API Error'))
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    await wrapper.vm.getDataGraph()
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(Error))
    expect(wrapper.vm.isLoading).toBe(false)
    consoleLogSpy.mockRestore()

    // Reset mock for getDataGraphNoDMN
    mockGrafikService.getGraphicOpexC.mockResolvedValue(mockSuccessResponse)
    
    // Test getDataGraphNoDMN success path
    await wrapper.vm.getDataGraphNoDMN()
    expect(wrapper.vm.graphData.isEmpty).toBe(false)

    // Test getDataGraphNoDMN error path
    mockGrafikService.getGraphicOpexC.mockRejectedValue(new Error('API Error'))
    const consoleLogSpy2 = vi.spyOn(console, 'log').mockImplementation(() => {})
    await wrapper.vm.getDataGraphNoDMN()
    expect(consoleLogSpy2).toHaveBeenCalledWith(expect.any(Error))
    consoleLogSpy2.mockRestore()

    // Test empty graph data
    const emptyResponse = {
      success: true,
      data: [{
        grafik: null,
        legend: null,
        average_nphr: 0,
        average_value_c: 0,
        average_ipp_nphr: 0,
        average_ipp_valuec: 0
      }]
    }
    mockGrafikService.getGraphicOpexC.mockResolvedValue(emptyResponse)
    await wrapper.vm.getDataGraph()
    expect(wrapper.vm.graphData.isEmpty).toBe(true)
  })

  it('should handle all validation scenarios in filter functions', async () => {
    wrapper = createWrapper()
    await flushPromises()

    // Test closeModal - valid case
    wrapper.vm.value = ['PLTU']
    wrapper.vm.closeModal()
    expect(wrapper.vm.showModal).toBe(false)

    // Test closeModal - no kategori and no year
    wrapper.vm.value = []
    wrapper.vm.filter.tahun = null
    wrapper.vm.closeModal()
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000)

    // Test closeModal - no kategori but has year (will hit else condition)
    vi.clearAllMocks()
    wrapper.vm.value = []
    wrapper.vm.filter.tahun = 2023
    wrapper.vm.closeModal()
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000)

    // Test closeModal - no kategori and no year but simulate different path
    vi.clearAllMocks()
    wrapper.vm.value = []
    wrapper.vm.filter.tahun = null
    wrapper.vm.closeModal()
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000)

    // Test applyFilter scenarios
    vi.clearAllMocks()
    mockGrafikService.getGraphicOpexC.mockResolvedValue(mockSuccessResponse)

    // applyFilter - valid case
    wrapper.vm.value = ['PLTU']
    wrapper.vm.showModal = true
    await wrapper.vm.applyFilter()
    expect(wrapper.vm.showModal).toBe(false)

    // applyFilter - no kategori and no year
    wrapper.vm.value = []
    wrapper.vm.filter.tahun = null
    await wrapper.vm.applyFilter()
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000)

    // applyFilter - has kategori but no year
    wrapper.vm.value = ['PLTU']
    wrapper.vm.filter.tahun = null
    await wrapper.vm.applyFilter()
    expect(wrapper.vm.showModal).toBe(false) // Should still proceed if value.length > 0

    // applyFilter - no kategori but has year
    wrapper.vm.value = []
    wrapper.vm.filter.tahun = 2023
    await wrapper.vm.applyFilter()
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000)

    // Test applyFilterNoDMN scenarios
    vi.clearAllMocks()

    // applyFilterNoDMN - valid case
    wrapper.vm.value = ['PLTU']
    wrapper.vm.showModal = true
    await wrapper.vm.applyFilterNoDMN()
    expect(wrapper.vm.showModal).toBe(false)

    // applyFilterNoDMN - no kategori and no year
    wrapper.vm.value = []
    wrapper.vm.filter.tahun = null
    await wrapper.vm.applyFilterNoDMN()
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit dan pilih 1 tahun!', 5000)

    // applyFilterNoDMN - has kategori but no year
    wrapper.vm.value = ['PLTU']
    wrapper.vm.filter.tahun = null
    await wrapper.vm.applyFilterNoDMN()
    expect(wrapper.vm.showModal).toBe(false) // Should still proceed if value.length > 0

    // applyFilterNoDMN - no kategori but has year
    wrapper.vm.value = []
    wrapper.vm.filter.tahun = 2023
    await wrapper.vm.applyFilterNoDMN()
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih minimal 1 kategori pembangkit!', 5000)
  })

  it('should handle all watcher and checkbox functions', async () => {
    wrapper = createWrapper()
    await flushPromises()

    // Test value watcher - empty
    wrapper.vm.value = []
    await nextTick()
    expect(wrapper.vm.checkAll).toBe(false)
    expect(wrapper.vm.indeterminate).toBe(false)

    // Test value watcher - all selected
    wrapper.vm.value = ['PLTU', 'PLTG']
    await nextTick()
    expect(wrapper.vm.checkAll).toBe(true)
    expect(wrapper.vm.indeterminate).toBe(false)

    // Test value watcher - some selected
    wrapper.vm.value = ['PLTU']
    await nextTick()
    expect(wrapper.vm.indeterminate).toBe(true)

    // Test handleCheckAll - check all
    wrapper.vm.handleCheckAll(true)
    expect(wrapper.vm.value).toEqual(['PLTU', 'PLTG'])
    expect(wrapper.vm.indeterminate).toBe(false)

    // Test handleCheckAll - uncheck all
    wrapper.vm.handleCheckAll(false)
    expect(wrapper.vm.value).toEqual([])
    expect(wrapper.vm.indeterminate).toBe(false)

    // Test dmn watcher - empty
    wrapper.vm.dmn = []
    await nextTick()
    expect(wrapper.vm.checkDmn).toBe(false)
    expect(wrapper.vm.indeterminateDmn).toBe(false)

    // Test dmn watcher - all selected
    wrapper.vm.dmn = ['1', '2']
    await nextTick()
    expect(wrapper.vm.checkDmn).toBe(true)
    expect(wrapper.vm.indeterminateDmn).toBe(false)

    // Test dmn watcher - some selected
    wrapper.vm.dmn = ['1']
    await nextTick()
    expect(wrapper.vm.indeterminateDmn).toBe(true)

    // Test handleCheckDmn - check all
    wrapper.vm.handleCheckDmn(true)
    expect(wrapper.vm.dmn).toEqual(['1', '2'])
    expect(wrapper.vm.indeterminateDmn).toBe(false)

    // Test handleCheckDmn - uncheck all
    wrapper.vm.handleCheckDmn(false)
    expect(wrapper.vm.dmn).toEqual([])
    expect(wrapper.vm.indeterminateDmn).toBe(false)
  })
})
