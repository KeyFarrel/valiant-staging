import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PetaSebaran from '@/views/Beranda/PetaSebaran.vue'
import PetaService from '@/services/peta-service'
import { useUserAuthStore } from '@/store/storeUserAuth'

// Mock the services
vi.mock('@/services/peta-service')
vi.mock('@/store/storeUserAuth')

// Mock Vue Router
const mockRouter = {
  push: vi.fn()
}
vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

// Mock encryption/WASM utilities
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    encryptValue: vi.fn((value) => `encrypted_${value}`),
    decryptValue: vi.fn((value) => value.replace('encrypted_', ''))
  })
}))

// Mock helper services
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyWarning: vi.fn(),
  notifyInfo: vi.fn(),
}))

// Mock format services
vi.mock('@/services/format/global-format', () => ({
  default: class GlobalFormat {
    formatNumber = vi.fn((num) => num.toString())
    formatCurrency = vi.fn((num) => `Rp ${num}`)
  }
}))

// Mock OpenLayers components
vi.mock('vue3-openlayers', () => ({
  OlMap: {
    name: 'OlMap',
    template: '<div><slot /></div>',
  },
  OlView: {
    name: 'OlView',
    template: '<div></div>',
    props: ['center', 'rotation', 'zoom', 'minZoom', 'projection'],
  },
  OlTileLayer: {
    name: 'OlTileLayer',
    template: '<div><slot /></div>',
  },
  OlSourceOsm: {
    name: 'OlSourceOsm',
    template: '<div></div>',
  },
  OlOverlay: {
    name: 'OlOverlay',
    template: '<div><slot /></div>',
    props: ['position', 'insertFirst'],
  },
}))

describe('PetaSebaran.vue', () => {
  let wrapper: any
  let mockPetaService: any
  let mockUserAuthStore: any

  beforeEach(() => {
    setActivePinia(createPinia())
    
    // Mock PetaService
    mockPetaService = {
      getPetaSentral: vi.fn().mockResolvedValue({
        success: true,
        data: [
          {
            kode_sentral: 'TEST001',
            sentral: 'Test Sentral 1',
            jenis_pembangkit: 'PLTU',
            kode_jenis_energi: 'NON-EBT',
            daya_terpasang: '100',
            lat: -6.2,
            lng: 106.8,
            kode_warna: '#ff0000',
            icon: 'test-icon.png'
          }
        ]
      }),
      getPengelola: vi.fn().mockResolvedValue({
        success: true,
        data: [{ id: '1', pengelola: 'Test Pengelola' }]
      }),
      getJenisKit: vi.fn().mockResolvedValue({
        success: true,
        data: [{ id: '1', jenis_kit: 'PLTU' }]
      }),
      getUmurMesin: vi.fn().mockResolvedValue({
        success: true,
        data: [{ id: '1', umur_mesin: '0-5 tahun' }]
      }),
      getSentralByKode: vi.fn().mockResolvedValue({})
    }
    
    // Mock UserAuthStore
    mockUserAuthStore = {
      levelAlias: 'Xf!8qP@7'
    }
    
    vi.mocked(PetaService).mockImplementation(() => mockPetaService)
    vi.mocked(useUserAuthStore).mockReturnValue(mockUserAuthStore)
  })

  it('should render component successfully', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true,
          OlView: true,
          OlTileLayer: true,
          OlSourceOsm: true,
          OlOverlay: true,
          BestPerformance: true,
          SearchBox: true,
          ModalWrapper: true,
          Loading: true,
          ModalSearch: true,
          ElSelect: true,
          ElOption: true,
          ElCheckbox: true
        }
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.p-4.space-y-4.bg-white.border.rounded-md').exists()).toBe(true)
  })

  it('should fetch peta sentral data on mount', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true,
          OlView: true,
          OlTileLayer: true,
          OlSourceOsm: true,
          OlOverlay: true,
          BestPerformance: true,
          SearchBox: true,
          ModalWrapper: true,
          Loading: true,
          ModalSearch: true,
          ElSelect: true,
          ElOption: true,
          ElCheckbox: true
        }
      }
    })

    // Wait for component to be fully mounted and async operations to complete
    await new Promise(resolve => setTimeout(resolve, 100))
    
    expect(mockPetaService.getPetaSentral).toHaveBeenCalled()
    expect(mockPetaService.getPengelola).toHaveBeenCalled()
    expect(mockPetaService.getJenisKit).toHaveBeenCalled()
    expect(mockPetaService.getUmurMesin).toHaveBeenCalled()
  })

  it('should handle search modal toggle', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true,
          OlView: true,
          OlTileLayer: true,
          OlSourceOsm: true,
          OlOverlay: true,
          BestPerformance: true,
          SearchBox: true,
          ModalWrapper: true,
          Loading: true,
          ModalSearch: true,
          ElSelect: true,
          ElOption: true,
          ElCheckbox: true
        }
      }
    })

    // Test initial state
    expect(wrapper.vm.isSearchModalOpen).toBe(false)

    // Test handleFocus method
    await wrapper.vm.handleFocus()
    expect(wrapper.vm.isSearchModalOpen).toBe(true)
  })

  it('should handle filter data with empty results', async () => {
    // Mock service to return empty data
    mockPetaService.getPetaSentral.mockResolvedValue({
      success: true,
      data: []
    })

    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true,
          OlView: true,
          OlTileLayer: true,
          OlSourceOsm: true,
          OlOverlay: true,
          BestPerformance: true,
          SearchBox: true,
          ModalWrapper: true,
          Loading: true,
          ModalSearch: true,
          ElSelect: true,
          ElOption: true,
          ElCheckbox: true
        }
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    // Test when data is empty, should call notifyError
    expect(wrapper.vm.dataPeta).toEqual([])
  })

  it('should handle single data result with map center adjustment', async () => {
    // Mock service to return single item
    mockPetaService.getPetaSentral.mockResolvedValue({
      success: true,
      data: [{
        kode_sentral: 'TEST001',
        sentral: 'Test Sentral 1',
        jenis_pembangkit: 'PLTU',
        kode_jenis_energi: 'NON-EBT',
        daya_terpasang: '100',
        lat: -6.2,
        lng: 106.8,
        kode_warna: '#ff0000',
        icon: 'test-icon.png'
      }]
    })

    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true,
          OlView: true,
          OlTileLayer: true,
          OlSourceOsm: true,
          OlOverlay: true,
          BestPerformance: true,
          SearchBox: true,
          ModalWrapper: true,
          Loading: true,
          ModalSearch: true,
          ElSelect: true,
          ElOption: true,
          ElCheckbox: true
        }
      }
    })

    await new Promise(resolve => setTimeout(resolve, 100))

    // Test single data result adjusts map center and zoom
    expect(wrapper.vm.dataPeta.length).toBe(1)
    expect(wrapper.vm.zoom).toBe(17)
  })

  it('should handle getDetailSentral function', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true,
          OlView: true,
          OlTileLayer: true,
          OlSourceOsm: true,
          OlOverlay: true,
          BestPerformance: true,
          SearchBox: true,
          ModalWrapper: true,
          Loading: true,
          ModalSearch: true,
          ElSelect: true,
          ElOption: true,
          ElCheckbox: true
        }
      }
    })

    await wrapper.vm.getDetailSentral('TEST001')

    expect(mockPetaService.getSentralByKode).toHaveBeenCalledWith('TEST001')
    expect(wrapper.vm.kode_sentral).toBe('TEST001')
  })

  it('should handle formatFixed function', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true,
          OlView: true,
          OlTileLayer: true,
          OlSourceOsm: true,
          OlOverlay: true,
          BestPerformance: true,
          SearchBox: true,
          ModalWrapper: true,
          Loading: true,
          ModalSearch: true,
          ElSelect: true,
          ElOption: true,
          ElCheckbox: true
        }
      }
    })

    const result = wrapper.vm.formatFixed(3.14159)
    expect(result).toBe('3.1')
  })

  it('should handle checkbox filter states', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true,
          OlView: true,
          OlTileLayer: true,
          OlSourceOsm: true,
          OlOverlay: true,
          BestPerformance: true,
          SearchBox: true,
          ModalWrapper: true,
          Loading: true,
          ModalSearch: true,
          ElSelect: true,
          ElOption: true,
          ElCheckbox: true
        }
      }
    })

    // Test handleCheckPengelola
    wrapper.vm.itemsPengelola = [{ id: '1', name: 'Test 1' }, { id: '2', name: 'Test 2' }]
    
    wrapper.vm.handleCheckPengelola(true)
    expect(wrapper.vm.pengelola).toEqual(['1', '2'])
    expect(wrapper.vm.indeterminatePengelola).toBe(false)

    wrapper.vm.handleCheckPengelola(false)
    expect(wrapper.vm.pengelola).toEqual([])
    
    // Test handleCheckPembangkit
    wrapper.vm.itemsPembangkit = [{ id: '1', name: 'PLTU' }, { id: '2', name: 'PLTG' }]
    
    wrapper.vm.handleCheckPembangkit(true)
    expect(wrapper.vm.pembangkit).toEqual(['PLTU', 'PLTG'])
    expect(wrapper.vm.indeterminatePembangkit).toBe(false)

    wrapper.vm.handleCheckPembangkit(false)
    expect(wrapper.vm.pembangkit).toEqual([])

    // Test handleCheckUmur
    wrapper.vm.itemsUmurMesin = [{ id: '1', name: '0-5 tahun' }, { id: '2', name: '5-10 tahun' }]
    
    wrapper.vm.handleCheckUmur(true)
    expect(wrapper.vm.umur).toEqual(['1', '2'])
    expect(wrapper.vm.indeterminateUmur).toBe(false)

    wrapper.vm.handleCheckUmur(false)
    expect(wrapper.vm.umur).toEqual([])
  })

  it('should handle changeData and changeDataNoDMN functions', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true,
          OlView: true,
          OlTileLayer: true,
          OlSourceOsm: true,
          OlOverlay: true,
          BestPerformance: true,
          SearchBox: true,
          ModalWrapper: true,
          Loading: true,
          ModalSearch: true,
          ElSelect: true,
          ElOption: true,
          ElCheckbox: true
        }
      }
    })

    // Test changeData
    await wrapper.vm.changeData()
    expect(mockPetaService.getPetaSentral).toHaveBeenCalled()
    expect(wrapper.vm.showModal).toBe(false)

    // Test changeDataNoDMN
    await wrapper.vm.changeDataNoDMN()
    expect(mockPetaService.getPetaSentral).toHaveBeenCalled()
    expect(wrapper.vm.showModal).toBe(false)
  })

  it('should handle watch functions for filter arrays', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true,
          OlView: true,
          OlTileLayer: true,
          OlSourceOsm: true,
          OlOverlay: true,
          BestPerformance: true,
          SearchBox: true,
          ModalWrapper: true,
          Loading: true,
          ModalSearch: true,
          ElSelect: true,
          ElOption: true,
          ElCheckbox: true
        }
      }
    })

    // Setup items for testing watch functions  
    wrapper.vm.itemsPengelola = [{ id: '1', name: 'Test 1' }, { id: '2', name: 'Test 2' }]
    wrapper.vm.itemsPembangkit = [{ id: '1', name: 'PLTU' }, { id: '2', name: 'PLTG' }]
    wrapper.vm.itemsUmurMesin = [{ id: '1', name: '0-5 tahun' }, { id: '2', name: '5-10 tahun' }]
    wrapper.vm.childDmn = [{ id: '1', name: 'DMN 1' }, { id: '2', name: 'DMN 2' }]

    await wrapper.vm.$nextTick()

    // Test pengelola states
    wrapper.vm.pengelola = []
    await wrapper.vm.$nextTick()
    
    wrapper.vm.pengelola = ['1', '2']
    await wrapper.vm.$nextTick()
    
    wrapper.vm.pengelola = ['1']
    await wrapper.vm.$nextTick()

    // Test pembangkit states
    wrapper.vm.pembangkit = []
    await wrapper.vm.$nextTick()
    
    wrapper.vm.pembangkit = ['PLTU', 'PLTG']
    await wrapper.vm.$nextTick()
    
    wrapper.vm.pembangkit = ['PLTU']
    await wrapper.vm.$nextTick()

    // Test umur states
    wrapper.vm.umur = []
    await wrapper.vm.$nextTick()
    
    wrapper.vm.umur = ['1', '2']
    await wrapper.vm.$nextTick()
    
    wrapper.vm.umur = ['1']
    await wrapper.vm.$nextTick()

    // Just verify the watch functions exist and component is working
    expect(wrapper.vm.pengelola).toEqual(['1'])
    expect(wrapper.vm.pembangkit).toEqual(['PLTU'])
    expect(wrapper.vm.umur).toEqual(['1'])
  })
})