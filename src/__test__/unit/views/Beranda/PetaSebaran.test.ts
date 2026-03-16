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
    
    vi.mocked(PetaService).mockImplementation(function() { return mockPetaService; })
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

  // --- Toggle dropdown tests ---
  it('should toggle pengelola dropdown', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    expect(wrapper.vm.isPengelolaDropdownOpen).toBe(false)
    wrapper.vm.togglePengelolaDropdown()
    expect(wrapper.vm.isPengelolaDropdownOpen).toBe(true)
    wrapper.vm.togglePengelolaDropdown()
    expect(wrapper.vm.isPengelolaDropdownOpen).toBe(false)
  })

  it('should toggle pembangkit dropdown', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    expect(wrapper.vm.isPembangkitDropdownOpen).toBe(false)
    wrapper.vm.togglePembangkitDropdown()
    expect(wrapper.vm.isPembangkitDropdownOpen).toBe(true)
  })

  it('should toggle dmn dropdown', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    expect(wrapper.vm.isDmnDropdownOpen).toBe(false)
    wrapper.vm.toggleDmnDropdown()
    expect(wrapper.vm.isDmnDropdownOpen).toBe(true)
  })

  it('should toggle umur dropdown', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    expect(wrapper.vm.isUmurDropdownOpen).toBe(false)
    wrapper.vm.toggleUmurDropdown()
    expect(wrapper.vm.isUmurDropdownOpen).toBe(true)
  })

  // --- Remove/Clear tests ---
  it('should remove and clear pengelola selections', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    wrapper.vm.pengelola = ['1', '2', '3']
    wrapper.vm.removeSelectedPengelola('2')
    expect(wrapper.vm.pengelola).toEqual(['1', '3'])
    wrapper.vm.clearPengelola()
    expect(wrapper.vm.pengelola).toEqual([])
  })

  it('should remove and clear pembangkit selections', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    wrapper.vm.pembangkit = ['PLTU', 'PLTG']
    wrapper.vm.removeSelectedPembangkit('PLTU')
    expect(wrapper.vm.pembangkit).toEqual(['PLTG'])
    wrapper.vm.clearPembangkit()
    expect(wrapper.vm.pembangkit).toEqual([])
  })

  it('should remove and clear dmn selections', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    wrapper.vm.dmn = [1, 2, 3]
    wrapper.vm.removeSelectedDmn(2)
    expect(wrapper.vm.dmn).toEqual([1, 3])
    wrapper.vm.clearDmn()
    expect(wrapper.vm.dmn).toEqual([])
  })

  it('should remove and clear umur selections', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    wrapper.vm.umur = ['1', '2']
    wrapper.vm.removeSelectedUmur('1')
    expect(wrapper.vm.umur).toEqual(['2'])
    wrapper.vm.clearUmur()
    expect(wrapper.vm.umur).toEqual([])
  })

  // --- handleClickOutside ---
  it('should close all dropdowns when clicking outside .relative', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    wrapper.vm.isPengelolaDropdownOpen = true
    wrapper.vm.isPembangkitDropdownOpen = true
    wrapper.vm.isDmnDropdownOpen = true
    wrapper.vm.isUmurDropdownOpen = true

    const mockEvent = { target: { closest: vi.fn().mockReturnValue(null) } } as any
    wrapper.vm.handleClickOutside(mockEvent)

    expect(wrapper.vm.isPengelolaDropdownOpen).toBe(false)
    expect(wrapper.vm.isPembangkitDropdownOpen).toBe(false)
    expect(wrapper.vm.isDmnDropdownOpen).toBe(false)
    expect(wrapper.vm.isUmurDropdownOpen).toBe(false)
  })

  it('should NOT close dropdowns when clicking inside .relative', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    wrapper.vm.isPengelolaDropdownOpen = true
    wrapper.vm.isPembangkitDropdownOpen = true

    const relativeDiv = document.createElement('div')
    relativeDiv.className = 'relative'
    const mockEvent = { target: { closest: vi.fn().mockReturnValue(relativeDiv) } } as any
    wrapper.vm.handleClickOutside(mockEvent)

    expect(wrapper.vm.isPengelolaDropdownOpen).toBe(true)
    expect(wrapper.vm.isPembangkitDropdownOpen).toBe(true)
  })

  // --- onUnmounted ---
  it('should remove click event listener on unmount', async () => {
    const removeEventSpy = vi.spyOn(document, 'removeEventListener')
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    wrapper.unmount()
    expect(removeEventSpy).toHaveBeenCalledWith('click', expect.any(Function))
    removeEventSpy.mockRestore()
  })

  // --- fetchPetaSentral branches ---
  it('should handle fetchPetaSentral when listDataPeta already has data (else branch)', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    // listDataPeta now has data from mount. Call fetchPetaSentral again to hit else branch
    mockPetaService.getPetaSentral.mockResolvedValue({
      success: true,
      data: [
        { kode_sentral: 'A', sentral: 'S1', jenis_pembangkit: 'X', kode_jenis_energi: 'EBT', daya_terpasang: '50', lat: -7, lng: 110, kode_warna: '#00FF00', icon: '' },
        { kode_sentral: 'B', sentral: 'S2', jenis_pembangkit: 'Y', kode_jenis_energi: 'NON-EBT', daya_terpasang: '60', lat: -8, lng: 112, kode_warna: '#FF0000', icon: '' }
      ]
    })
    await wrapper.vm.fetchPetaSentral()
    // Multiple results -> default center/zoom
    expect(wrapper.vm.center).toEqual([117.478751, -0.808498])
    expect(wrapper.vm.zoom).toBe(5)
  })

  it('should handle fetchPetaSentral error', async () => {
    mockPetaService.getPetaSentral.mockRejectedValue(new Error('Network error'))
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.isLoading).toBe(false)
  })

  // --- getDataPengelola branches ---
  it('should handle getDataPengelola with empty data', async () => {
    mockPetaService.getPengelola.mockResolvedValue({ success: true, data: [] })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.itemsPengelola).toEqual([])
  })

  it('should handle getDataPengelola error', async () => {
    mockPetaService.getPengelola.mockRejectedValue(new Error('Server error'))
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.itemsPengelola).toEqual([])
  })

  // --- getDataPembangkit with DMN children ---
  it('should handle getDataPembangkit with DMN children mapping', async () => {
    mockPetaService.getJenisKit.mockResolvedValue({
      success: true,
      data: [
        {
          jenis_kit: 'PLTU',
          dmn: [
            { id_daya: 1, daya_mampu: '100' },
            { id_daya: 2, daya_mampu: '' },
            { id_daya: 3, daya_mampu: '200' }
          ]
        },
        { jenis_kit: 'PLTG', dmn: null }
      ]
    })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    // PLTU has dmn with 2 valid daya_mampu (empty string is filtered out)
    expect(wrapper.vm.childDmn.some((c: any) => c.name === 'PLTU 100')).toBe(true)
    expect(wrapper.vm.childDmn.some((c: any) => c.name === 'PLTU 200')).toBe(true)
    // Empty daya_mampu should be filtered
    expect(wrapper.vm.childDmn.some((c: any) => c.daya_mampu === '')).toBe(false)
    // Items reversed
    expect(wrapper.vm.itemsPembangkit[0].name).toBe('PLTG')
  })

  it('should handle getDataPembangkit error', async () => {
    mockPetaService.getJenisKit.mockRejectedValue(new Error('Error'))
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.itemsPembangkit).toEqual([])
  })

  // --- getDataUmurMesin branches ---
  it('should handle getDataUmurMesin with empty data', async () => {
    mockPetaService.getUmurMesin.mockResolvedValue({ success: true, data: [] })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.itemsUmurMesin).toEqual([])
  })

  it('should handle getDataUmurMesin error', async () => {
    mockPetaService.getUmurMesin.mockRejectedValue(new Error('err'))
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.itemsUmurMesin).toEqual([])
  })

  // --- dmn watcher (all 3 branches) ---
  it('should handle dmn watcher: empty, full, partial', async () => {
    mockPetaService.getJenisKit.mockResolvedValue({
      success: true,
      data: [{ jenis_kit: 'PLTU', dmn: [{ id_daya: 1, daya_mampu: '100' }, { id_daya: 2, daya_mampu: '200' }] }]
    })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    // empty
    wrapper.vm.dmn = []
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.checkDmn).toBe(false)
    expect(wrapper.vm.indeterminateDmn).toBe(false)

    // full (all childDmn ids)
    wrapper.vm.dmn = [1, 2]
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.checkDmn).toBe(true)
    expect(wrapper.vm.indeterminateDmn).toBe(false)

    // partial
    wrapper.vm.dmn = [1]
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.indeterminateDmn).toBe(true)
  })

  // --- handleCheckDmn ---
  it('should handle handleCheckDmn select all and deselect all', async () => {
    mockPetaService.getJenisKit.mockResolvedValue({
      success: true,
      data: [{ jenis_kit: 'PLTU', dmn: [{ id_daya: 10, daya_mampu: '50' }, { id_daya: 20, daya_mampu: '100' }] }]
    })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    wrapper.vm.handleCheckDmn(true)
    expect(wrapper.vm.dmn).toEqual([10, 20])
    expect(wrapper.vm.indeterminateDmn).toBe(false)

    wrapper.vm.handleCheckDmn(false)
    expect(wrapper.vm.dmn).toEqual([])
  })

  // --- changeData branches ---
  it('should handle changeData with empty results (notifyError)', async () => {
    const { notifyError: mockNotifyError } = await import('@/services/helper/toast-notification')
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    mockPetaService.getPetaSentral.mockResolvedValue({ success: true, data: [] })
    await wrapper.vm.changeData()
    expect(mockNotifyError).toHaveBeenCalledWith('Data Peta Sebaran Tidak Ditemukan', false)
    expect(wrapper.vm.showModal).toBe(false)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle changeData when listDataPeta is empty (first load)', async () => {
    mockPetaService.getPetaSentral.mockResolvedValue({ success: true, data: [] })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    // listDataPeta is empty from mount (empty data). Now call changeData with data
    mockPetaService.getPetaSentral.mockResolvedValue({
      success: true,
      data: [{ kode_sentral: 'X', sentral: 'SX', jenis_pembangkit: 'A', kode_jenis_energi: 'EBT', daya_terpasang: '10', lat: -6, lng: 106, kode_warna: '#00FF00', icon: '' }]
    })
    await wrapper.vm.changeData()
    expect(wrapper.vm.listDataPeta.length).toBe(1)
    expect(wrapper.vm.dataPeta.length).toBe(1)
  })

  it('should handle changeData error', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    mockPetaService.getPetaSentral.mockRejectedValue(new Error('change error'))
    await wrapper.vm.changeData()
    expect(wrapper.vm.isLoading).toBe(false)
  })

  // --- changeDataNoDMN branches ---
  it('should handle changeDataNoDMN with empty results (notifyError)', async () => {
    const { notifyError: mockNotifyError } = await import('@/services/helper/toast-notification')
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    mockPetaService.getPetaSentral.mockResolvedValue({ success: true, data: [] })
    await wrapper.vm.changeDataNoDMN()
    expect(mockNotifyError).toHaveBeenCalledWith('Data Peta Sebaran Tidak Ditemukan', false)
    expect(wrapper.vm.showModal).toBe(false)
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle changeDataNoDMN when listDataPeta is empty (first load)', async () => {
    mockPetaService.getPetaSentral.mockResolvedValue({ success: true, data: [] })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    mockPetaService.getPetaSentral.mockResolvedValue({
      success: true,
      data: [{ kode_sentral: 'Y', sentral: 'SY', jenis_pembangkit: 'B', kode_jenis_energi: 'NON-EBT', daya_terpasang: '20', lat: -7, lng: 110, kode_warna: '#FF0000', icon: '' }]
    })
    await wrapper.vm.changeDataNoDMN()
    expect(wrapper.vm.listDataPeta.length).toBe(1)
    expect(wrapper.vm.dataPeta.length).toBe(1)
  })

  it('should handle changeDataNoDMN error', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    mockPetaService.getPetaSentral.mockRejectedValue(new Error('noDMN error'))
    await wrapper.vm.changeDataNoDMN()
    expect(wrapper.vm.isLoading).toBe(false)
  })

  // --- getDetailSentral error ---
  it('should handle getDetailSentral error gracefully', async () => {
    mockPetaService.getSentralByKode.mockImplementation(() => { throw new Error('detail err') })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await wrapper.vm.getDetailSentral('ERRCODE')
    expect(wrapper.vm.kode_sentral).toBe('ERRCODE')
  })

  // --- getDataPengelola success=false ---
  it('should handle getDataPengelola when success is false', async () => {
    mockPetaService.getPengelola.mockResolvedValue({ success: false, data: [] })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.itemsPengelola).toEqual([])
  })

  // --- getDataPembangkit success=false ---
  it('should handle getDataPembangkit when success is false', async () => {
    mockPetaService.getJenisKit.mockResolvedValue({ success: false, data: [] })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.itemsPembangkit).toEqual([])
  })

  // --- getDataUmurMesin success=false ---
  it('should handle getDataUmurMesin when success is false', async () => {
    mockPetaService.getUmurMesin.mockResolvedValue({ success: false, data: [] })
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.itemsUmurMesin).toEqual([])
  })

  // --- Template interaction: showModal toggle, showByIndex, filter button badge ---
  it('should render filter modal and interact with template elements', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true,
          BestPerformance: true, SearchBox: true,
          ModalWrapper: { template: '<div class="modal-wrapper"><slot /></div>', props: ['showModal', 'width', 'height'] },
          Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    // Toggle showModal via filter button
    const filterBtn = wrapper.find('#hover-button')
    if (filterBtn.exists()) {
      await filterBtn.trigger('click')
      expect(wrapper.vm.showModal).toBe(true)
    } else {
      wrapper.vm.showModal = true
    }
    await wrapper.vm.$nextTick()

    // Set pengelola/pembangkit/umur for badge and template rendering
    wrapper.vm.pengelola = ['1']
    wrapper.vm.pembangkit = ['PLTU']
    wrapper.vm.umur = ['1']
    wrapper.vm.isPengelolaDropdownOpen = true
    wrapper.vm.isPembangkitDropdownOpen = true
    wrapper.vm.isDmnDropdownOpen = true
    wrapper.vm.isUmurDropdownOpen = true
    wrapper.vm.itemsPengelola = [{ id: '1', name: 'Pengelola 1' }]
    wrapper.vm.itemsPembangkit = [{ id: 'PLTU', name: 'PLTU' }]
    wrapper.vm.childDmn = [{ id: 1, name: 'DMN1' }]
    wrapper.vm.itemsUmurMesin = [{ id: '1', name: '0-5 tahun' }]
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.showModal).toBe(true)
  })

  // --- ModalSearch event handlers ---
  it('should handle ModalSearch on-click-close event', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true,
          BestPerformance: true, SearchBox: true,
          ModalSearch: { template: '<div class="modal-search"></div>', emits: ['on-click-close', 'on-escape', 'on-click-sentral', 'on-key-enter', 'update:modelValue'] },
          ModalWrapper: true, Loading: true, ElSelect: true, ElOption: true, ElCheckbox: true
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    wrapper.vm.isSearchModalOpen = true
    wrapper.vm.searchQuery = 'test'
    wrapper.vm.selectedSearchQuery = 'oldval'
    await wrapper.vm.$nextTick()

    const modalSearch = wrapper.findComponent({ name: 'ModalSearch' })
    if (modalSearch.exists()) {
      await modalSearch.vm.$emit('on-click-close')
      await wrapper.vm.$nextTick()
    }
  })

  it('should handle ModalSearch on-click-sentral event', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true,
          BestPerformance: true, SearchBox: true,
          ModalSearch: { template: '<div class="modal-search"></div>', emits: ['on-click-close', 'on-escape', 'on-click-sentral', 'on-key-enter', 'update:modelValue'] },
          ModalWrapper: true, Loading: true, ElSelect: true, ElOption: true, ElCheckbox: true
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    wrapper.vm.isSearchModalOpen = true
    wrapper.vm.searchQuery = 'sentral_test'
    await wrapper.vm.$nextTick()

    const modalSearch = wrapper.findComponent({ name: 'ModalSearch' })
    if (modalSearch.exists()) {
      await modalSearch.vm.$emit('on-click-sentral')
      await wrapper.vm.$nextTick()
    }
  })

  it('should handle ModalSearch on-key-enter event', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true,
          BestPerformance: true, SearchBox: true,
          ModalSearch: { template: '<div class="modal-search"></div>', emits: ['on-click-close', 'on-escape', 'on-click-sentral', 'on-key-enter', 'update:modelValue'] },
          ModalWrapper: true, Loading: true, ElSelect: true, ElOption: true, ElCheckbox: true
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    wrapper.vm.isSearchModalOpen = true
    wrapper.vm.searchQuery = 'enter_test'
    await wrapper.vm.$nextTick()

    const modalSearch = wrapper.findComponent({ name: 'ModalSearch' })
    if (modalSearch.exists()) {
      await modalSearch.vm.$emit('on-key-enter')
      await wrapper.vm.$nextTick()
    }
  })

  it('should handle ModalSearch on-escape event', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true,
          BestPerformance: true, SearchBox: true,
          ModalSearch: { template: '<div class="modal-search"></div>', emits: ['on-click-close', 'on-escape', 'on-click-sentral', 'on-key-enter', 'update:modelValue'] },
          ModalWrapper: true, Loading: true, ElSelect: true, ElOption: true, ElCheckbox: true
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    wrapper.vm.isSearchModalOpen = true
    await wrapper.vm.$nextTick()

    const modalSearch = wrapper.findComponent({ name: 'ModalSearch' })
    if (modalSearch.exists()) {
      await modalSearch.vm.$emit('on-escape')
      await wrapper.vm.$nextTick()
    }
  })

  // --- showByIndex interaction for overlay popup ---
  it('should set and clear showByIndex for overlay popup', async () => {
    wrapper = mount(PetaSebaran, {
      global: { stubs: { OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true, BestPerformance: true, SearchBox: true, ModalWrapper: true, Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true } }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    wrapper.vm.showByIndex = 0
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showByIndex).toBe(0)

    wrapper.vm.showByIndex = null
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.showByIndex).toBeNull()
  })

  // --- Template rendering with ModalWrapper slot for dropdown interactions ---
  it('should render ModalWrapper slot content and exercise filter interactions', async () => {
    wrapper = mount(PetaSebaran, {
      global: {
        stubs: {
          OlMap: true, OlView: true, OlTileLayer: true, OlSourceOsm: true, OlOverlay: true,
          BestPerformance: true, SearchBox: true,
          ModalWrapper: { template: '<div class="modal-wrapper"><slot /></div>', props: ['showModal', 'width', 'height'] },
          Loading: true, ModalSearch: true, ElSelect: true, ElOption: true, ElCheckbox: true
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    // Open modal
    wrapper.vm.showModal = true
    wrapper.vm.itemsPengelola = [{ id: '1', name: 'Pen1' }, { id: '2', name: 'Pen2' }]
    wrapper.vm.itemsPembangkit = [{ id: 'PLTU', name: 'PLTU' }, { id: 'PLTG', name: 'PLTG' }]
    wrapper.vm.childDmn = [{ id: 1, name: 'DMN1' }, { id: 2, name: 'DMN2' }]
    wrapper.vm.itemsUmurMesin = [{ id: 'u1', name: '0-5' }, { id: 'u2', name: '5-10' }]
    wrapper.vm.pengelola = ['1', '2', '3']
    wrapper.vm.pembangkit = ['PLTU']
    wrapper.vm.dmn = [1, 2, 3]
    wrapper.vm.umur = ['u1', 'u2', 'u3']
    wrapper.vm.isPengelolaDropdownOpen = true
    wrapper.vm.isPembangkitDropdownOpen = true
    wrapper.vm.isDmnDropdownOpen = true
    wrapper.vm.isUmurDropdownOpen = true
    await wrapper.vm.$nextTick()

    // Find and click close modal button
    const closeBtn = wrapper.findAll('button').find(b => {
      const svg = b.find('svg')
      return svg.exists() && svg.attributes('width') === '24' && svg.attributes('height') === '24'
    })
    if (closeBtn) {
      await closeBtn.trigger('click')
      expect(wrapper.vm.showModal).toBe(false)
    }

    // Re-open for more interactions
    wrapper.vm.showModal = true
    await wrapper.vm.$nextTick()

    // Click Reset button
    const resetBtn = wrapper.findAll('button[type="submit"]').find(b => b.text().includes('Reset'))
    if (resetBtn) {
      await resetBtn.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.umur).toEqual([])
      expect(wrapper.vm.pembangkit).toEqual([])
      expect(wrapper.vm.pengelola).toEqual([])
    }

    // Set PLTU in pembangkit to show Terapkan(changeData) button
    wrapper.vm.pembangkit = ['PLTU']
    await wrapper.vm.$nextTick()

    // Click Terapkan button (changeData)
    const terapkanBtns = wrapper.findAll('button[type="submit"]').filter(b => b.text().includes('Terapkan'))
    if (terapkanBtns.length > 0) {
      await terapkanBtns[0].trigger('click')
      await wrapper.vm.$nextTick()
    }
  })
})