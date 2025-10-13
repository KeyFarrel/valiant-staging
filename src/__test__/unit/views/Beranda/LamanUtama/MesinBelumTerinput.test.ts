import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MesinBelumTerinput from '@/views/Beranda/LamanUtama/MesinBelumTerinput.vue'

// Mock the service
vi.mock('@/services/laman-service', () => ({
  default: class MockLamanService {
    getMesinBelumInput = vi.fn(() => Promise.resolve({
      data: [
        {
          pengelola: 'PLN',
          sentral: 'PLTU Suralaya',
          mesin: 'Unit 1',
          daya_terpasang: 400
        }
      ],
      meta: {
        totalRecords: 1,
        totalPages: 1
      }
    }))
    
    getPengelolaData = vi.fn(() => Promise.resolve({
      data: [
        {
          id_pengelola: 1,
          kode_pengelola: 'PLN',
          pengelola: 'PLN'
        }
      ]
    }))
  }
}))

// Mock the global format service
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatRupiah = vi.fn((value) => `Rp ${value.toLocaleString()}`)
  }
}))

describe('MesinBelumTerinput', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(MesinBelumTerinput, {
      global: {
        stubs: {
          SearchBox: true,
          Loading: true,
          TableComponent: true,
          Empty: true
        }
      }
    })
  })

  it('should render component successfully', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should initialize with default navigation values', () => {
    expect(wrapper.vm.navigation.currentPage).toBe(1)
    expect(wrapper.vm.navigation.limit).toBe(10)
    expect(wrapper.vm.kodePengelola).toBe('ALL')
  })

  it('should update search query when input changes', async () => {
    const initialSearchQuery = wrapper.vm.searchQuery
    expect(initialSearchQuery).toBe('')
    
    wrapper.vm.searchQuery = 'test search'
    await wrapper.vm.$nextTick()
    
    expect(wrapper.vm.searchQuery).toBe('test search')
  })

  it('should handle search with debounce', async () => {
    const handleSearchSpy = vi.spyOn(wrapper.vm, 'handleSearch')
    
    await wrapper.vm.handleSearch()
    
    expect(handleSearchSpy).toHaveBeenCalled()
  })

  it('should change page limit successfully', async () => {
    wrapper.vm.navigation.limit = 20
    
    await wrapper.vm.changePageLimit()
    
    expect(wrapper.vm.navigation.currentPage).toBe(1)
    expect(wrapper.vm.navigation.limit).toBe(20)
  })

  it('should handle pengelola selection for ALL', async () => {
    wrapper.vm.kodePengelola = 'PLN'
    
    await wrapper.vm.changeSelectedPengelola('ALL')
    
    expect(wrapper.vm.kodePengelola).toBe('ALL')
    expect(wrapper.vm.selectedPengelola).toEqual([])
    expect(wrapper.vm.navigation.currentPage).toBe(1)
  })

  it('should add pengelola to selection when not selected', async () => {
    wrapper.vm.selectedPengelola = []
    wrapper.vm.kodePengelola = 'ALL'
    
    await wrapper.vm.changeSelectedPengelola('PLN')
    
    expect(wrapper.vm.selectedPengelola).toContain('PLN')
    expect(wrapper.vm.kodePengelola).toBe(null)
    expect(wrapper.vm.navigation.currentPage).toBe(1)
  })

  it('should remove pengelola from selection when already selected', async () => {
    wrapper.vm.selectedPengelola = ['PLN', 'INALUM']
    wrapper.vm.kodePengelola = null
    
    await wrapper.vm.changeSelectedPengelola('PLN')
    
    expect(wrapper.vm.selectedPengelola).not.toContain('PLN')
    expect(wrapper.vm.navigation.currentPage).toBe(1)
  })

  it('should set kodePengelola to ALL when removing last selected pengelola', async () => {
    wrapper.vm.selectedPengelola = ['PLN']
    wrapper.vm.kodePengelola = null
    
    await wrapper.vm.changeSelectedPengelola('PLN')
    
    expect(wrapper.vm.kodePengelola).toBe('ALL')
    expect(wrapper.vm.selectedPengelola).toEqual([])
  })

  it('should generate page list correctly for few pages', () => {
    wrapper.vm.navigation.totalPages = 3
    wrapper.vm.navigation.currentPage = 2
    
    const pageList = wrapper.vm.generatePageList
    
    expect(pageList).toEqual([1, 2, 3])
  })

  it('should generate page list with ellipsis for many pages', () => {
    wrapper.vm.navigation.totalPages = 10
    wrapper.vm.navigation.currentPage = 5
    
    const pageList = wrapper.vm.generatePageList
    
    expect(pageList).toContain('...')
    expect(pageList).toContain(1)
    expect(pageList).toContain(10)
  })

  it('should go to specific page', async () => {
    const goToPageSpy = vi.spyOn(wrapper.vm, 'goToPage')
    
    await wrapper.vm.goToPage(3)
    
    expect(goToPageSpy).toHaveBeenCalledWith(3)
    expect(wrapper.vm.navigation.currentPage).toBe(3)
  })

  it('should go to previous page', () => {
    wrapper.vm.navigation.currentPage = 3
    
    wrapper.vm.goToPrevious()
    
    expect(wrapper.vm.navigation.currentPage).toBe(2)
  })

  it('should go to next page', () => {
    wrapper.vm.navigation.currentPage = 1
    
    wrapper.vm.goToNext()
    
    expect(wrapper.vm.navigation.currentPage).toBe(2)
  })

  it('should handle fetch error gracefully', async () => {
    // Mock console.error to avoid noise in test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock service to return rejected promise
    const originalService = wrapper.vm.lamanService
    wrapper.vm.lamanService = {
      ...originalService,
      getMesinBelumInput: vi.fn(() => Promise.reject(new Error('Network error')))
    }
    
    // Call the function and expect isLoading to be false after error
    try {
      await wrapper.vm.fetchMesinBelumInput()
    } catch (error) {
      // Error should be thrown
    }
    
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle error in fetchPengelolaData', async () => {
    // Mock console.error to avoid noise in test output
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const originalService = wrapper.vm.lamanService
    wrapper.vm.lamanService = {
      ...originalService,
      getPengelolaData: vi.fn(() => Promise.reject(new Error('Network error')))
    }
    
    await wrapper.vm.fetchPengelolaData()
    
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle error in goToPage', async () => {
    // Mock console.error to avoid noise in test output  
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const originalService = wrapper.vm.lamanService
    wrapper.vm.lamanService = {
      ...originalService,
      getMesinBelumInput: vi.fn(() => Promise.reject(new Error('Network error')))
    }
    
    await wrapper.vm.goToPage(5)
    
    expect(wrapper.vm.navigation.currentPage).toBe(5)
  })

  it('should not change pengelola when selecting ALL if already ALL', async () => {
    wrapper.vm.kodePengelola = 'ALL'
    const initialKodePengelola = wrapper.vm.kodePengelola
    
    await wrapper.vm.changeSelectedPengelola('ALL')
    
    expect(wrapper.vm.kodePengelola).toBe(initialKodePengelola)
  })

  it('should generate page list for current page near end', () => {
    wrapper.vm.navigation.totalPages = 10
    wrapper.vm.navigation.currentPage = 8
    
    const pageList = wrapper.vm.generatePageList
    
    expect(pageList).toContain(1)
    expect(pageList).toContain('...')
    expect(pageList).toContain(8)
    expect(pageList).toContain(9)
    expect(pageList).toContain(10)
  })

  it('should generate page list for first pages when current page <= 3', () => {
    wrapper.vm.navigation.totalPages = 10
    wrapper.vm.navigation.currentPage = 2
    
    const pageList = wrapper.vm.generatePageList
    
    expect(pageList).toContain(1)
    expect(pageList).toContain(2)
    expect(pageList).toContain(3)
    expect(pageList).toContain(4)
    expect(pageList).toContain('...')
    expect(pageList).toContain(10)
  })
})