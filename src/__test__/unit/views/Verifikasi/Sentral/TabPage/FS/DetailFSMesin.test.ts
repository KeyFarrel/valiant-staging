import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DetailFSMesin from '@/views/Verifikasi/Sentral/TabPage/FS/DetailFSMesin.vue'

// Mock route
const mockRoute = {
  query: { uuid_sentral: 'test-uuid-sentral' },
  params: { id: 'test-id-mesin' }
}

// Mock router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn()
}

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter
}))

// Mock encrypt storage
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: vi.fn().mockReturnValue('decrypted-test-id')
  })
}))

// Mock services
const mockDetailRekapService = {
  getMesinById: vi.fn().mockResolvedValue({
    data: {
      uuid_mesin: 1,
      kode_sentral: 'SENTRAL01',
      kode_mesin: 'MESIN01',
      mesin: 'Test Mesin PLTU',
      kode_jenis_pembangkit: 'PLTU',
      kondisi_unit: 'Operasi',
      daya_terpasang: 100,
      daya_mampu: 90,
      tahun_operasi: '2020',
      masa_manfaat: '25',
      nilai_asset_awal: 1000000,
      tahun_nilai_perolehan: '2020',
      photo1: 'photo1.jpg',
      photo2: 'photo2.jpg'
    }
  })
}

const mockPersetujuanService = {
  getPersetujuanFSSentral: vi.fn().mockResolvedValue({
    data: {
      pengelola: 'Test Pengelola',
      pembina: 'Test Pembina',
      mesins: [{
        uuid_mesin: 'decrypted-test-id',
        id_status: 1,
        status: 'approved',
        keterangan: 'Test keterangan'
      }]
    }
  })
}

const mockFeasibilityStudyService = {
  getAsumsi: vi.fn().mockResolvedValue({
    data: {
      corporate_tax_rate: 25,
      discount_rate: 10,
      interest_rate: 8,
      loan_tenor: 15,
      loan_portion: 70,
      equity_portion: 30,
      daya_terpasang: 100,
      daya_mampu_netto_mw: 90,
      auxiliary: 5,
      susut_trafo: 2,
      ps: 3,
      nphr: 2500,
      total_project_cost: 1000000,
      loan: 700000,
      equity: 300000,
      electricity_price_a_rp_per_kwbln: 1000,
      electricity_price_b_rp_per_kwbln: 1100,
      electricity_price_c_rp_per_kwh: 1200,
      electricity_price_d_rp_per_kwh: 1300,
      harga_bahan_bakars: [],
      umur_teknis: 25
    }
  }),
  getDataTeknis: vi.fn().mockResolvedValue({
    data: {
      header: ['Parameter', 'Unit', '2024', '2025'],
      tahun: [2024, 2025],
      detail: []
    }
  }),
  getDataFinansial: vi.fn().mockResolvedValue({
    data: {
      detail: []
    }
  }),
  getHasilSimulasi: vi.fn().mockResolvedValue({
    data: {
      npv: 1000000,
      irr: 15.5,
      payback_period: 7.2,
      lcoe: 8.5
    }
  }),
  downloadTemplateFS: vi.fn().mockResolvedValue({
    data: new Blob(['test']),
    headers: { 'content-disposition': 'attachment; filename="test.xlsx"' }
  }),
  uploadFS: vi.fn().mockResolvedValue({
    success: true,
    message: 'Upload berhasil'
  })
}

const mockUserService = {
  getPembina: vi.fn().mockResolvedValue({ data: [] }),
  getUnitPengelola: vi.fn().mockResolvedValue({ data: [] })
}

const mockRekapService = {
  getTypePeriodic: vi.fn().mockResolvedValue({ data: [] }),
  getComboBahanBakar: vi.fn().mockResolvedValue({ data: [] }),
  uploadEvidence: vi.fn().mockResolvedValue({ data: 'path' }),
  updateEvidencePath: vi.fn().mockResolvedValue({ success: true }),
  getEvidencePath: vi.fn().mockResolvedValue({
    data: [{ file_name: 'test.xlsx', dokumen_evidence: 'path' }]
  }),
  downloadEvidence: vi.fn().mockResolvedValue({
    data: new Blob(['test']),
    headers: { 'content-disposition': 'attachment; filename="test.xlsx"' }
  })
}

// Mock service constructors
vi.mock('@/services/detail-rekap-service', () => ({
  default: vi.fn(() => mockDetailRekapService)
}))

vi.mock('@/services/persetujuan-service', () => ({
  default: vi.fn(() => mockPersetujuanService)
}))

vi.mock('@/services/feasibility-study', () => ({
  default: vi.fn(() => mockFeasibilityStudyService)
}))

vi.mock('@/services/user-service', () => ({
  default: vi.fn(() => mockUserService)
}))

vi.mock('@/services/rekap-service', () => ({
  default: vi.fn(() => mockRekapService)
}))

vi.mock('@/services/detail-sentral-service', () => ({
  default: vi.fn(() => ({}))
}))

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn(() => ({
    formatCurrency: vi.fn(),
    formatNumber: vi.fn()
  }))
}))

// Mock Vue3Lottie
vi.mock('vue3-lottie', () => ({
  Vue3Lottie: {
    name: 'Vue3Lottie',
    template: '<div></div>'
  }
}))

// Mock lottie asset
vi.mock('@/assets/lottie/success.json', () => ({
  default: {}
}))

describe('DetailFSMesin.vue', () => {
  let wrapper

  const createWrapper = () => {
    return mount(DetailFSMesin, {
      global: {
        stubs: {
          Loading: true,
          InfoHeader: true,
          ModalWrapper: true,
          TabsWrapper: true,
          Vue3Lottie: true,
          IconFolder: true,
          TableDataTeknis: true,
          TableDataFinansial: true,
          TabItem: true,
          AsumsiMakro: true,
          ParameterTeknis: true,
          AkhirMasaManfaat: true,
          TahunBerjalan: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentDraft: true
        }
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Component Mounting', () => {
    it('should mount successfully', () => {
      wrapper = createWrapper()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have vm instance', () => {
      wrapper = createWrapper()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Initial State', () => {
    it('should have correct initial data', () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      expect(vm.isLoading).toBe(true) // Component starts with loading true in onMounted
      expect(vm.modalApprove).toBe(false)
      expect(vm.selectedTab).toBe('Akhir Masa')
      expect(vm.data).toBe('Feasibility Study')
      expect(vm.isSuccess).toBe(false)
      expect(vm.isHover).toBe(true)
      expect(vm.isFSUploadSuccess).toBe(false)
      expect(vm.isModalUnggahFSOpen).toBe(false)
      expect(vm.isEvidenceSuccess).toBe(false)
      expect(vm.selectedFileFS).toBe(null)
      expect(vm.selectedFileEvidence).toBe(null)
    })

    it('should calculate current year', () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      const currentYear = new Date().getFullYear()
      expect(vm.tahunBerjalan).toBe(currentYear)
    })
  })

  describe('Utility Methods', () => {
    it('should toggle button state', () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      expect(vm.isHover).toBe(true)
      vm.toggleButton()
      expect(vm.isHover).toBe(false)
      vm.toggleButton()
      expect(vm.isHover).toBe(true)
    })

    it('should format bytes correctly', () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      expect(vm.formatBytes(0)).toBe('0 Bytes')
      expect(vm.formatBytes(1024)).toBe('1 KB')
      expect(vm.formatBytes(1048576)).toBe('1 MB')
      expect(vm.formatBytes(1073741824)).toBe('1 GB')
      expect(vm.formatBytes(2048)).toBe('2 KB')
      expect(vm.formatBytes(512)).toBe('512 Bytes')
    })

    it('should handle wait function', async () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      const start = Date.now()
      await vm.wait(50)
      const end = Date.now()
      
      expect(end - start).toBeGreaterThanOrEqual(40)
    })
  })

  describe('File Handling', () => {
    it('should handle FS file change', () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      const mockFile = new File(['test'], 'test.xlsx')
      const mockEvent = {
        target: { files: [mockFile] }
      }
      
      vm.handleFileFSChange(mockEvent)
      expect(vm.selectedFileFS).toStrictEqual(mockFile)
    })

    it('should handle empty file selection', () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      const mockEvent = {
        target: { files: [] }
      }
      
      vm.handleFileFSChange(mockEvent)
      expect(vm.selectedFileFS).toBe(null)
    })

    it('should handle evidence file change', () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      const mockFile = new File(['evidence'], 'evidence.xlsx')
      const mockEvent = {
        target: { files: [mockFile] }
      }
      
      vm.handleFileChangeEvidence(mockEvent)
      expect(vm.selectedFileEvidence).toStrictEqual(mockFile)
    })
  })

  describe('Service Calls', () => {
    it('should call getMesinById on mount', async () => {
      wrapper = createWrapper()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async operations
      
      expect(mockDetailRekapService.getMesinById).toHaveBeenCalled()
    })

    it('should call getPersetujuanFSSentral on mount', async () => {
      wrapper = createWrapper()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async operations
      
      expect(mockPersetujuanService.getPersetujuanFSSentral).toHaveBeenCalled()
    })

    it('should call getDataTeknis on mount', async () => {
      wrapper = createWrapper()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async operations
      
      expect(mockFeasibilityStudyService.getDataTeknis).toHaveBeenCalled()
    })

    it('should call getDataFinansial on mount', async () => {
      wrapper = createWrapper()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async operations
      
      expect(mockFeasibilityStudyService.getDataFinansial).toHaveBeenCalled()
    })

    it('should call getHasilSimulasi on mount', async () => {
      wrapper = createWrapper()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async operations
      
      expect(mockFeasibilityStudyService.getHasilSimulasi).toHaveBeenCalled()
    })
  })

  describe('Async Methods', () => {
    it('should fetch financial data', async () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      await vm.fetchDataFinansial()
      
      expect(mockFeasibilityStudyService.getDataFinansial).toHaveBeenCalled()
      expect(vm.dataFinansial).toBeDefined()
    })

    it('should handle upload FS file', async () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      const mockFile = new File(['test'], 'test.xlsx')
      vm.selectedFileFS = mockFile
      vm.idGrafik = 'test-id'
      
      await vm.uploadFileFS()
      
      expect(vm.isLoading).toBe(false)
    })

    it('should handle upload evidence file', async () => {
      wrapper = createWrapper()
      const vm = wrapper.vm
      
      const mockFile = new File(['evidence'], 'evidence.xlsx')
      vm.selectedFileEvidence = mockFile
      vm.idGrafik = 'test-id'
      
      await vm.uploadFileEvidence()
      
      expect(mockRekapService.uploadEvidence).toHaveBeenCalled()
    })
  })
})
