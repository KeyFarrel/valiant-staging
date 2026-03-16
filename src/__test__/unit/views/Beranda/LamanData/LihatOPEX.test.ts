import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import LihatOPEX from '@/views/Beranda/LamanData/LihatOPEX.vue'

// Mock data for components B, C, D to prevent undefined errors during render
const mockKomponenB = {
  cost_component_b: 1000,
  biaya_kepegawaian: 200,
  biaya_pemeliharaan_rutin: 300,
  biaya_administrasi_umum: 100,
  biaya_pembelian_tenaga_listrik: 150,
  biaya_lain_lain: 50,
  biaya_pelumas: 30,
  biaya_bahan_kimia: 20
}

const mockKomponenC = {
  total_component_c: { cost_component_c: 2000 },
  detail_component_c: [
    { bahan_bakar: 'Batubara', harga_bahan_bakar: 1500 },
    { bahan_bakar: 'HSD', harga_bahan_bakar: 500 }
  ]
}

const mockKomponenD = {
  cost_component_d: 500,
  biaya_pelumas: 300,
  biaya_lain_lain: 200
}

const mockMesinData = {
  mesin: 'Test Mesin',
  kondisi_unit: 'Baik',
  kode_jenis_pembangkit: 'PLTU',
  daya_terpasang: 100,
  daya_mampu: 90,
  tahun_operasi: '2010',
  masa_manfaat: 20,
  kode_sentral: 'SENTRAL001'
}

const mockPembangkitData = {
  kode_pengelola: 'PENGELOLA001',
  uuid_pembina: 'PEMBINA001'
}

const mockPengelolaData = [
  { kode_pengelola: 'PENGELOLA001', pengelola: 'PT Test Pengelola' }
]

const mockPembinaData = [
  { uuid_pembina: 'PEMBINA001', pembina: 'Test Pembina' }
]

const mockAsumsiData = {
  asumsi_makro: { umur_teknis: 10 }
}

// Mock services - all mocks return synchronously resolved promises
vi.mock('@/services/lihat-opex-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getMesinById: vi.fn().mockResolvedValue({ data: mockMesinData }),
    getPembangkitByKode: vi.fn().mockResolvedValue({ data: mockPembangkitData }),
    getPengelolaData: vi.fn().mockResolvedValue({ data: mockPengelolaData }),
    getAsumsiParameterData: vi.fn().mockResolvedValue({ data: mockAsumsiData }),
    getOPEXKomponenB: vi.fn().mockResolvedValue({ data: mockKomponenB }),
    getOPEXKomponenC: vi.fn().mockResolvedValue({ data: mockKomponenC }),
    getOPEXKomponenD: vi.fn().mockResolvedValue({ data: mockKomponenD })
  }; })
}))

vi.mock('@/services/user-service', () => ({
  default: vi.fn().mockImplementation(function() { return {
    getPembina: vi.fn().mockResolvedValue({ data: mockPembinaData })
  }; })
}))

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn().mockImplementation(function() { return {
    formatRupiah: vi.fn((val) => val != null ? `Rp ${val}` : 'Rp 0')
  }; })
}))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '123' },
    query: { tahun: '2024' }
  })
}))

describe('LihatOPEX.vue', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should render component successfully and fetch data', async () => {
    const wrapper = shallowMount(LihatOPEX, {
      global: {
        stubs: {
          Loading: true,
          InfoHeader: true
        }
      }
    })
    
    await flushPromises()
    
    // Component should exist
    expect(wrapper.exists()).toBe(true)
    
    // Should have correct component structure
    expect(wrapper.vm).toBeDefined()
    
    // Loading should be complete
    expect(wrapper.vm.isLoading).toBe(false)
    
    // Data should be populated
    expect(wrapper.vm.mesinDataById).toEqual(mockMesinData)
    expect(wrapper.vm.opexKomponenB).toEqual(mockKomponenB)
    expect(wrapper.vm.opexKomponenC).toEqual(mockKomponenC)
    expect(wrapper.vm.opexKomponenD).toEqual(mockKomponenD)
  })
})
