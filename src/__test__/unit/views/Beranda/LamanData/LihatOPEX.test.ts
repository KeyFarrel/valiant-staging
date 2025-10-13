import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import LihatOPEX from '@/views/Beranda/LamanData/LihatOPEX.vue'

// Mock semua service
vi.mock('@/services/lihat-opex-service', () => ({
  default: vi.fn()
}))

vi.mock('@/services/user-service', () => ({
  default: vi.fn()
}))

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn()
}))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '123' },
    query: { tahun: '2024' }
  })
}))

describe('LihatOPEX.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(LihatOPEX, {
      global: {
        stubs: {
          Loading: true,
          InfoHeader: true
        }
      }
    })
  })

  it('should render component successfully', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should have correct component structure', () => {
    expect(wrapper.vm).toBeDefined()
  })

  it('should initialize with loading state', () => {
    expect(wrapper.vm.isLoading).toBeDefined()
  })
})
