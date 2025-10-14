import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RekapKertasKerjaV1 from '@/views/Data/RekapKertasKerjaV1/RekapKertasKerjaV1.vue'

// Mock the stores
const mockRekapSearchStore = {
  searchRekapQuery: '',
  selectedRekapSearchQuery: ''
}

const mockRekapNavigationStore = {
  currentPage: 1,
  pageLimit: 10,
  scrollPosition: { top: 0 }
}

vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: () => ({
    levelAlias: 'Xf!8qP@7'
  })
}))

vi.mock('@/store/storeRekapKertasKerja', () => ({
  useRekapSearchStore: () => mockRekapSearchStore,
  useRekapNavigationStore: () => mockRekapNavigationStore
}))

// Mock services with more detailed responses
const mockRekapService = {
  getSentralData: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [
      {
        uuid_sentral: 'test-uuid-1',
        sentral: 'Test Sentral 1',
        kode_sentral: 'TS001',
        jenis_pembangkit: 'PLTU',
        mesins: []
      }
    ], 
    meta: { 
      limit: 10, 
      totalRecords: 1, 
      totalPages: 1 
    } 
  })),
  getSuggestionSentral: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [
      { sentral: 'Test Sentral 1' },
      { sentral: 'Test Sentral 2' }
    ] 
  })),
  getPengelolaData: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [
      { id_pengelola: 1, kode_pengelola: 'PG001', pengelola: 'Pengelola 1' }
    ] 
  })),
  getComboKategoriPembangkit: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [
      { jenis_kit: 'PLTU', dmn: [{ id_daya: 1, daya_mampu: '< 100' }] }
    ] 
  })),
  getComboUmurMesin: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [
      { umur_mesin: '< 5 tahun' }
    ] 
  })),
  getComboKondisiMesin: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [
      { kondisi_unit: 'Baik' }
    ] 
  })),
  getComboIRR: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [
      { nilai_irr: '> 10%' }
    ] 
  })),
  getNilaiSentral: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [] 
  })),
  getNilaiMesin: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [] 
  })),
  getStatusFSSentral: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [] 
  })),
  getStatusFSMesin: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [] 
  })),
  getStatusRealisasiSentral: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [] 
  })),
  getStatusRealisasiMesin: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [] 
  })),
  getCheckInputAsumsiSentral: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [] 
  })),
  getCheckInputAsumsiMesin: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [] 
  })),
  getMesinByIdSentral: vi.fn(() => Promise.resolve({ 
    success: true, 
    data: [
      { id: 1, nama_mesin: 'Test Mesin', photo1: '' }
    ] 
  })),
  downloadTemplateRekap: vi.fn(() => Promise.resolve({
    data: new ArrayBuffer(8),
    headers: { 'content-disposition': 'attachment; filename="template-rekap.xlsx"' }
  })),
  downloadTemplateFS: vi.fn(() => Promise.resolve({
    data: new ArrayBuffer(8),
    headers: { 'content-disposition': 'attachment; filename="template-fs.xlsx"' }
  })),
  uploadEvidence: vi.fn(() => Promise.resolve({
    success: true,
    data: 'evidence-path.pdf'
  })),
  updateEvidencePath: vi.fn(() => Promise.resolve({ success: true })),
  uploadTemplateAwalKK: vi.fn(() => Promise.resolve({ success: true })),
  uploadTemplateAwalFS: vi.fn(() => Promise.resolve({ success: true }))
}

vi.mock('@/services/rekap-service', () => ({
  default: class {
    getSentralData = mockRekapService.getSentralData
    getSuggestionSentral = mockRekapService.getSuggestionSentral
    getPengelolaData = mockRekapService.getPengelolaData
    getComboKategoriPembangkit = mockRekapService.getComboKategoriPembangkit
    getComboUmurMesin = mockRekapService.getComboUmurMesin
    getComboKondisiMesin = mockRekapService.getComboKondisiMesin
    getComboIRR = mockRekapService.getComboIRR
    getNilaiSentral = mockRekapService.getNilaiSentral
    getNilaiMesin = mockRekapService.getNilaiMesin
    getStatusFSSentral = mockRekapService.getStatusFSSentral
    getStatusFSMesin = mockRekapService.getStatusFSMesin
    getStatusRealisasiSentral = mockRekapService.getStatusRealisasiSentral
    getStatusRealisasiMesin = mockRekapService.getStatusRealisasiMesin
    getCheckInputAsumsiSentral = mockRekapService.getCheckInputAsumsiSentral
    getCheckInputAsumsiMesin = mockRekapService.getCheckInputAsumsiMesin
    getMesinByIdSentral = mockRekapService.getMesinByIdSentral
    downloadTemplateRekap = mockRekapService.downloadTemplateRekap
    downloadTemplateFS = mockRekapService.downloadTemplateFS
    uploadEvidence = mockRekapService.uploadEvidence
    updateEvidencePath = mockRekapService.updateEvidencePath
    uploadTemplateAwalKK = mockRekapService.uploadTemplateAwalKK
    uploadTemplateAwalFS = mockRekapService.uploadTemplateAwalFS
  }
}))

vi.mock('@/services/auth-service', () => ({
  default: class {
    checkSession() { return Promise.resolve({ success: true }) }
  }
}))

vi.mock('@/services/detail-sentral-service', () => ({
  default: class {
    getPhoto() { return Promise.resolve({ data: new ArrayBuffer(8) }) }
  }
}))

// Mock GlobalFormat
vi.mock('@/services/format/global-format', () => ({
  default: class {
    formatNumberFiveDigits(num: number) {
      return String(num).padStart(5, '0')
    }
  }
}))

// Mock toast notifications
vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn()
}))

// Mock router
const mockRouter = {
  push: vi.fn()
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

// Mock other dependencies
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({})
}))

vi.mock('@vueuse/core', () => ({
  useWindowScroll: () => ({ x: { value: 0 }, y: { value: 0 } })
}))

describe('RekapKertasKerjaV1', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  const getWrapper = () => {
    return mount(RekapKertasKerjaV1, {
      global: {
        stubs: {
          Loading: true,
          SearchBoxSuggestion: true,
          ShimmerLoading: true,
          ModalWrapper: true,
          TabWrapperSentral: true,
          TabItem: true,
          ComponentDraft: true,
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentNotInput: true,
          ComponentNotUpdate: true,
          KeteranganAnomali: true,
          IconEmptyData: true,
          ConfirmationDialog: true,
          IconFolder: true,
          Vue3Lottie: true,
          'el-select': true,
          'el-option': true,
          'el-checkbox': true
        }
      }
    })
  }

  it('should render component successfully', async () => {
    const wrapper = getWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('should initialize with loading state as false after mount', async () => {
    const wrapper = getWrapper()
    
    // Wait for component to be mounted and all async operations to complete
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect((wrapper.vm as any).isLoading).toBe(false)
  })

  it('should have correct initial data values', () => {
    const wrapper = getWrapper()

    expect((wrapper.vm as any).sentralData).toEqual([])
    expect((wrapper.vm as any).pengelolaData).toEqual([])
    expect((wrapper.vm as any).selectedKategoriPembangkit).toEqual([])
    expect((wrapper.vm as any).showModal).toBe(false)
    expect((wrapper.vm as any).tahunBerjalan).toBe(new Date().getFullYear())
  })

  it('should call fetch functions on mounted', async () => {
    const wrapper = getWrapper()
    
    // Wait for all async operations in onMounted to complete
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 200))

    expect(mockRekapService.getSentralData).toHaveBeenCalled()
    expect(mockRekapService.getSuggestionSentral).toHaveBeenCalled()
    expect(mockRekapService.getPengelolaData).toHaveBeenCalled()
    expect(mockRekapService.getComboKategoriPembangkit).toHaveBeenCalled()
  })

  it('should handle wait function correctly', async () => {
    const wrapper = getWrapper()
    const startTime = Date.now()
    
    await (wrapper.vm as any).wait(100)
    
    const endTime = Date.now()
    expect(endTime - startTime).toBeGreaterThanOrEqual(90) // Allow some tolerance
  })

  it('should fetch suggestion sentral data successfully', async () => {
    const wrapper = getWrapper()
    
    await (wrapper.vm as any).fetchSuggestionSentral()
    
    expect(mockRekapService.getSuggestionSentral).toHaveBeenCalled()
    expect((wrapper.vm as any).listSuggestionSentral).toEqual([
      { sentral: 'Test Sentral 1' },
      { sentral: 'Test Sentral 2' }
    ])
  })

  it('should fetch sentral data successfully', async () => {
    const wrapper = getWrapper()
    
    await (wrapper.vm as any).fetchSentralData()
    
    expect(mockRekapService.getSentralData).toHaveBeenCalled()
    expect((wrapper.vm as any).sentralData).toHaveLength(1)
    expect((wrapper.vm as any).totalRecords).toBe(1)
    expect((wrapper.vm as any).totalPages).toBe(1)
  })

  it('should fetch pengelola data successfully', async () => {
    const wrapper = getWrapper()
    
    await (wrapper.vm as any).fetchPengelolaData()
    
    expect(mockRekapService.getPengelolaData).toHaveBeenCalled()
    expect((wrapper.vm as any).pengelolaData).toHaveLength(2) // Original data + ALL option
    expect((wrapper.vm as any).pengelolaData[0].kode_pengelola).toBe('ALL')
  })

  it('should fetch combo kategori pembangkit data successfully', async () => {
    const wrapper = getWrapper()
    
    await (wrapper.vm as any).fetchComboKategoriPembangkit()
    
    expect(mockRekapService.getComboKategoriPembangkit).toHaveBeenCalled()
    expect((wrapper.vm as any).kategoriPembangkitData).toHaveLength(1)
    expect((wrapper.vm as any).childDmn).toHaveLength(1)
  })

  it('should fetch combo umur mesin data successfully', async () => {
    const wrapper = getWrapper()
    
    await (wrapper.vm as any).fetchComboUmurMesin()
    
    expect(mockRekapService.getComboUmurMesin).toHaveBeenCalled()
    expect((wrapper.vm as any).comboUmurMesin).toHaveLength(1)
  })

  it('should check if pembangkit is open', () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).isPembangkitTabOpen = ['test-id-1']
    
    expect((wrapper.vm as any).isPembangkitOpen('test-id-1')).toBe(true)
    expect((wrapper.vm as any).isPembangkitOpen('test-id-2')).toBe(false)
  })

  it('should handle file change correctly', () => {
    const wrapper = getWrapper()
    
    const mockFile = new File(['content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const event = {
      target: {
        files: [mockFile]
      }
    }
    
    ;(wrapper.vm as any).handleFileChange(event)
    expect((wrapper.vm as any).selectedFile).toEqual(mockFile)
    
    // Test with no files
    const emptyEvent = {
      target: {
        files: []
      }
    }
    
    ;(wrapper.vm as any).handleFileChange(emptyEvent)
    expect((wrapper.vm as any).selectedFile).toBe(null)
  })

  it('should handle checkbox functions correctly', () => {
    const wrapper = getWrapper()
    
    // Setup test data
    ;(wrapper.vm as any).kategoriPembangkitData = [
      { id: 'PLTU', name: 'PLTU' },
      { id: 'PLTG', name: 'PLTG' }
    ]
    
    // Test handleCheckPembangkit
    ;(wrapper.vm as any).handleCheckPembangkit(true)
    expect((wrapper.vm as any).selectedKategoriPembangkit).toEqual(['PLTU', 'PLTG'])
    
    ;(wrapper.vm as any).handleCheckPembangkit(false)
    expect((wrapper.vm as any).selectedKategoriPembangkit).toEqual([])
  })

  it('should check input asumsi correctly', () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).listStatusInputAsumsiMesin = [
      { uuid_mesin: 'test-mesin-1', status_kk: true },
      { uuid_mesin: 'test-mesin-2', status_kk: false }
    ]
    
    expect((wrapper.vm as any).checkInputAsumsi('test-mesin-1')).toBe(true)
    expect((wrapper.vm as any).checkInputAsumsi('test-mesin-2')).toBe(false)
  })

  it('should check unggah required props correctly', () => {
    const wrapper = getWrapper()
    
    // Test incomplete data
    expect((wrapper.vm as any).checkUnggahRequiredProp('-', '', '0')).toBe(true)
    
    // Test complete data
    expect((wrapper.vm as any).checkUnggahRequiredProp('100000', '2023', '25')).toBe(false)
  })

  it('should generate page list correctly', () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).totalPages = 3
    mockRekapNavigationStore.currentPage = 2
    
    const pageList = (wrapper.vm as any).generatePageList
    expect(Array.isArray(pageList)).toBe(true)
  })

  it('should handle navigation functions correctly', async () => {
    const wrapper = getWrapper()
    
    // Test goToPrevious
    mockRekapNavigationStore.currentPage = 3
    await (wrapper.vm as any).goToPrevious()
    expect(mockRekapService.getSentralData).toHaveBeenCalled()
    
    // Test goToNext
    await (wrapper.vm as any).goToNext()
    expect(mockRekapService.getSentralData).toHaveBeenCalled()
    
    // Test goToPage
    await (wrapper.vm as any).goToPage(1)
    expect(mockRekapService.getSentralData).toHaveBeenCalled()
  })

  it('should handle search functionality', async () => {
    const wrapper = getWrapper()
    
    await (wrapper.vm as any).handleSearch()
    
    expect(mockRekapService.getSentralData).toHaveBeenCalled()
    expect(mockRekapNavigationStore.currentPage).toBe(1)
  })

  it('should handle change page limit', async () => {
    const wrapper = getWrapper()
    
    await (wrapper.vm as any).changePageLimit()
    
    expect(mockRekapService.getSentralData).toHaveBeenCalled()
    expect(mockRekapNavigationStore.currentPage).toBe(1)
  })

  it('should handle change selected pengelola', async () => {
    const wrapper = getWrapper()
    
    // Test with ALL option
    ;(wrapper.vm as any).kodePengelola = 'PG001'
    await (wrapper.vm as any).changeSelectedPengelola('ALL')
    expect((wrapper.vm as any).kodePengelola).toBe('ALL')
    
    // Test with specific pengelola not included
    ;(wrapper.vm as any).selectedPengelola = []
    await (wrapper.vm as any).changeSelectedPengelola('PG001')
    expect((wrapper.vm as any).selectedPengelola).toContain('PG001')
    
    // Test with pengelola already selected
    ;(wrapper.vm as any).selectedPengelola = ['PG001']
    await (wrapper.vm as any).changeSelectedPengelola('PG001')
    expect((wrapper.vm as any).selectedPengelola).toEqual([])
  })

  it('should handle toggle pembangkit correctly', async () => {
    const wrapper = getWrapper()
    
    // Setup test data
    ;(wrapper.vm as any).isPembangkitTabOpen = []
    ;(wrapper.vm as any).statusFSMesin = [
      { uuid_mesin: 'mesin-1', status: 'approved' }
    ]
    ;(wrapper.vm as any).statusRealisasiMesin = [
      { uuid_mesin: 'mesin-1', status: 'completed' }
    ]
    
    await (wrapper.vm as any).togglePembangkit('test-uuid-1')
    
    expect(mockRekapService.getMesinByIdSentral).toHaveBeenCalledWith('test-uuid-1')
    expect((wrapper.vm as any).isPembangkitTabOpen).toContain('test-uuid-1')
  })

  it('should handle file change for evidence correctly', () => {
    const wrapper = getWrapper()
    
    const mockFile = new File(['evidence content'], 'evidence.pdf', { type: 'application/pdf' })
    const event = {
      target: {
        files: [mockFile]
      }
    }
    
    ;(wrapper.vm as any).handleFileChangeEvidence(event)
    expect((wrapper.vm as any).selectedFileEvidence).toEqual(mockFile)
    
    // Test with no files
    const emptyEvent = {
      target: {
        files: []
      }
    }
    
    ;(wrapper.vm as any).handleFileChangeEvidence(emptyEvent)
    expect((wrapper.vm as any).selectedFileEvidence).toBe(null)
  })

  it('should handle file change for FS correctly', () => {
    const wrapper = getWrapper()
    
    const mockFile = new File(['fs content'], 'fs.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const event = {
      target: {
        files: [mockFile]
      }
    }
    
    ;(wrapper.vm as any).handleFileFSChange(event)
    expect((wrapper.vm as any).selectedFileFS).toEqual(mockFile)
    
    // Test with no files
    const emptyEvent = {
      target: {
        files: []
      }
    }
    
    ;(wrapper.vm as any).handleFileFSChange(emptyEvent)
    expect((wrapper.vm as any).selectedFileFS).toBe(null)
  })

  it('should handle other checkbox functions correctly', () => {
    const wrapper = getWrapper()
    
    // Test handleCheckDmn
    ;(wrapper.vm as any).childDmn = [
      { id: 'dmn-1', name: 'DMN 1' },
      { id: 'dmn-2', name: 'DMN 2' }
    ]
    
    ;(wrapper.vm as any).handleCheckDmn(true)
    expect((wrapper.vm as any).dmn).toEqual(['dmn-1', 'dmn-2'])
    
    ;(wrapper.vm as any).handleCheckDmn(false)
    expect((wrapper.vm as any).dmn).toEqual([])
    
    // Test handleCheckUmurMesin
    ;(wrapper.vm as any).comboUmurMesin = [
      { id: 'umur-1', name: 'Umur 1' },
      { id: 'umur-2', name: 'Umur 2' }
    ]
    
    ;(wrapper.vm as any).handleCheckUmurMesin(true)
    expect((wrapper.vm as any).selectedUmurMesin).toEqual(['umur-1', 'umur-2'])
    
    ;(wrapper.vm as any).handleCheckUmurMesin(false)
    expect((wrapper.vm as any).selectedUmurMesin).toEqual([])
    
    // Test handleCheckKondisiMesin
    ;(wrapper.vm as any).comboKondisiMesin = [
      { id: 'kondisi-1', name: 'Kondisi 1' },
      { id: 'kondisi-2', name: 'Kondisi 2' }
    ]
    
    ;(wrapper.vm as any).handleCheckKondisiMesin(true)
    expect((wrapper.vm as any).selectedKondisiMesin).toEqual(['kondisi-1', 'kondisi-2'])
    
    ;(wrapper.vm as any).handleCheckKondisiMesin(false)
    expect((wrapper.vm as any).selectedKondisiMesin).toEqual([])
  })

  it('should handle focus correctly', () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).handleFocus()
    expect((wrapper.vm as any).isSearchModalOpen).toBe(true)
  })

  it('should handle change sentral data correctly', async () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).selectedKategoriPembangkit = ['PLTU', 'PLTG']
    
    await (wrapper.vm as any).changeSentralData()
    
    expect(mockRekapService.getSentralData).toHaveBeenCalled()
    expect((wrapper.vm as any).showModal).toBe(false)
  })

  // Additional tests for uncovered lines

  it('should handle downloadTemplateRekap with content-disposition header', async () => {
    const wrapper = getWrapper()
    
    // Setup required values
    ;(wrapper.vm as any).tahunBerjalan = 2024
    ;(wrapper.vm as any).currentIdMesin = '123'
    ;(wrapper.vm as any).currentNamaMesin = 'Test Mesin'
    
    // Mock DOM methods
    const mockLink = {
      href: '',
      setAttribute: vi.fn(),
      click: vi.fn()
    }
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
    
    await (wrapper.vm as any).handleDownloadTemplateRekap()
    
    expect(mockRekapService.downloadTemplateRekap).toHaveBeenCalledWith(2024, 2023, '123')
    expect(createElementSpy).toHaveBeenCalledWith('a')
    
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('should handle downloadTemplateRekap without content-disposition header', async () => {
    const wrapper = getWrapper()
    
    // Mock service without content-disposition
    mockRekapService.downloadTemplateRekap.mockResolvedValueOnce({
      data: new ArrayBuffer(8),
      headers: { 'content-disposition': '' }
    })
    
    ;(wrapper.vm as any).tahunBerjalan = 2024
    ;(wrapper.vm as any).currentIdMesin = '123'
    ;(wrapper.vm as any).currentNamaMesin = 'Test Mesin'
    
    const mockLink = {
      href: '',
      setAttribute: vi.fn(),
      click: vi.fn()
    }
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
    
    await (wrapper.vm as any).handleDownloadTemplateRekap()
    
    expect(mockLink.setAttribute).toHaveBeenCalledWith('download', expect.stringContaining('Test Mesin'))
    
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('should handle downloadTemplateFS successfully', async () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).tahunBerjalan = 2024
    ;(wrapper.vm as any).currentIdMesin = '123'
    ;(wrapper.vm as any).currentNamaMesin = 'Test Mesin'
    ;(wrapper.vm as any).currentKodeJenisPembangkit = 'PLTU'
    
    const mockLink = {
      href: '',
      setAttribute: vi.fn(),
      click: vi.fn()
    }
    const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any)
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any)
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any)
    
    await (wrapper.vm as any).handleDownloadTemplateFS()
    
    expect(mockRekapService.downloadTemplateFS).toHaveBeenCalledWith(2024, '123', 'PLTU')
    
    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  it('should handle uploadFileEvidence successfully', async () => {
    const wrapper = getWrapper()
    
    const mockFile = new File(['evidence'], 'evidence.pdf', { type: 'application/pdf' })
    ;(wrapper.vm as any).selectedFileEvidence = mockFile
    ;(wrapper.vm as any).currentIdMesin = '123'
    ;(wrapper.vm as any).tahunBerjalan = 2024
    
    await (wrapper.vm as any).uploadFileEvidence(0)
    
    expect(mockRekapService.uploadEvidence).toHaveBeenCalled()
    expect(mockRekapService.updateEvidencePath).toHaveBeenCalledWith('123', '2024', 'evidence-path.pdf', 0, 'evidence.pdf')
    expect(mockRekapService.getStatusRealisasiSentral).toHaveBeenCalled()
    expect(mockRekapService.getStatusRealisasiMesin).toHaveBeenCalled()
  })

  it('should handle uploadFile without selectedFile', async () => {
    const wrapper = getWrapper()
    const { notifyError } = await import('@/services/helper/toast-notification')
    
    ;(wrapper.vm as any).selectedFile = null
    
    await (wrapper.vm as any).uploadFile()
    
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih file excel terlebih dahulu', 3000)
  })

  it('should handle uploadFile with file size exceeding 2MB', async () => {
    const wrapper = getWrapper()
    const { notifyError } = await import('@/services/helper/toast-notification')
    
    // Create a mock file larger than 2MB
    const largeFile = new File(['x'.repeat(2000001)], 'large.xlsx')
    Object.defineProperty(largeFile, 'size', { value: 2000001 })
    
    ;(wrapper.vm as any).selectedFile = largeFile
    
    await (wrapper.vm as any).uploadFile()
    
    expect(notifyError).toHaveBeenCalledWith('Ukuran file Kertas Kerja tidak boleh lebih dari 2MB', 5000)
  })

  it('should handle uploadFile with evidence file exceeding 5MB', async () => {
    const wrapper = getWrapper()
    const { notifyError } = await import('@/services/helper/toast-notification')
    
    const normalFile = new File(['content'], 'test.xlsx')
    Object.defineProperty(normalFile, 'size', { value: 1000000 })
    
    const largeEvidenceFile = new File(['x'.repeat(5000001)], 'large-evidence.pdf')
    Object.defineProperty(largeEvidenceFile, 'size', { value: 5000001 })
    
    ;(wrapper.vm as any).selectedFile = normalFile
    ;(wrapper.vm as any).selectedFileEvidence = largeEvidenceFile
    
    await (wrapper.vm as any).uploadFile()
    
    expect(notifyError).toHaveBeenCalledWith('Ukuran file Evidence tidak boleh lebih dari 5MB', 5000)
  })

  it('should handle uploadFile successfully with evidence', async () => {
    const wrapper = getWrapper()
    
    const normalFile = new File(['content'], 'test.xlsx')
    Object.defineProperty(normalFile, 'size', { value: 1000000 })
    
    const evidenceFile = new File(['evidence'], 'evidence.pdf')
    Object.defineProperty(evidenceFile, 'size', { value: 1000000 })
    
    ;(wrapper.vm as any).selectedFile = normalFile
    ;(wrapper.vm as any).selectedFileEvidence = evidenceFile
    ;(wrapper.vm as any).currentIdMesin = '123'
    ;(wrapper.vm as any).currentIdSentral = 'sentral-uuid'
    ;(wrapper.vm as any).tahunBerjalan = 2024
    
    await (wrapper.vm as any).uploadFile()
    
    expect(mockRekapService.uploadEvidence).toHaveBeenCalled()
    expect(mockRekapService.uploadTemplateAwalKK).toHaveBeenCalled()
    expect((wrapper.vm as any).selectedFileEvidence).toBe(null)
  })

  it('should handle uploadFileFS without selectedFileFS', async () => {
    const wrapper = getWrapper()
    const { notifyError } = await import('@/services/helper/toast-notification')
    
    ;(wrapper.vm as any).selectedFileFS = null
    
    await (wrapper.vm as any).uploadFileFS()
    
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih file excel terlebih dahulu', 3000)
  })

  it('should handle uploadFileFS with file size exceeding 2MB', async () => {
    const wrapper = getWrapper()
    const { notifyError } = await import('@/services/helper/toast-notification')
    
    const largeFile = new File(['x'.repeat(2000001)], 'large-fs.xlsx')
    Object.defineProperty(largeFile, 'size', { value: 2000001 })
    
    ;(wrapper.vm as any).selectedFileFS = largeFile
    
    await (wrapper.vm as any).uploadFileFS()
    
    expect(notifyError).toHaveBeenCalledWith('Ukuran file Feasibility Study tidak boleh lebih dari 2MB', 5000)
  })

  it('should handle uploadFileFS with evidence file exceeding 5MB', async () => {
    const wrapper = getWrapper()
    const { notifyError } = await import('@/services/helper/toast-notification')
    
    const normalFile = new File(['content'], 'test.xlsx')
    Object.defineProperty(normalFile, 'size', { value: 1000000 })
    
    const largeEvidenceFile = new File(['x'.repeat(5000001)], 'large-evidence.pdf')
    Object.defineProperty(largeEvidenceFile, 'size', { value: 5000001 })
    
    ;(wrapper.vm as any).selectedFileFS = normalFile
    ;(wrapper.vm as any).selectedFileEvidence = largeEvidenceFile
    
    await (wrapper.vm as any).uploadFileFS()
    
    expect(notifyError).toHaveBeenCalledWith('Ukuran file Evidence tidak boleh lebih dari 5MB', 5000)
  })

  it('should handle uploadFileFS successfully with evidence', async () => {
    const wrapper = getWrapper()
    
    const normalFile = new File(['content'], 'test.xlsx')
    Object.defineProperty(normalFile, 'size', { value: 1000000 })
    
    const evidenceFile = new File(['evidence'], 'evidence.pdf')
    Object.defineProperty(evidenceFile, 'size', { value: 1000000 })
    
    ;(wrapper.vm as any).selectedFileFS = normalFile
    ;(wrapper.vm as any).selectedFileEvidence = evidenceFile
    ;(wrapper.vm as any).currentIdMesin = '123'
    ;(wrapper.vm as any).currentIdSentral = 'sentral-uuid'
    
    await (wrapper.vm as any).uploadFileFS()
    
    expect(mockRekapService.uploadEvidence).toHaveBeenCalled()
    expect(mockRekapService.uploadTemplateAwalFS).toHaveBeenCalled()
    expect((wrapper.vm as any).selectedFileEvidence).toBe(null)
  })

  it('should handle changeSelectedPengelola when already selected (single item)', async () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).selectedPengelola = ['PG001']
    ;(wrapper.vm as any).kodePengelola = null
    
    await (wrapper.vm as any).changeSelectedPengelola('PG001')
    
    expect((wrapper.vm as any).kodePengelola).toBe('ALL')
    expect((wrapper.vm as any).selectedPengelola).toEqual([])
  })

  it('should clear dmn when PLTU not in selectedKategoriPembangkit', async () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).selectedKategoriPembangkit = ['PLTG']
    ;(wrapper.vm as any).dmn = ['dmn-1', 'dmn-2']
    
    await (wrapper.vm as any).changeSentralData()
    
    expect((wrapper.vm as any).dmn).toEqual([])
  })

  it('should handle fetchSentralData with null response', async () => {
    const wrapper = getWrapper()
    
    mockRekapService.getSentralData.mockResolvedValueOnce({
      success: true,
      data: null,
      meta: { limit: 10, totalRecords: 0, totalPages: 0 }
    })
    
    await (wrapper.vm as any).fetchSentralData()
    
    expect((wrapper.vm as any).sentralData).toEqual([])
  })

  it('should handle fetchSentralData with existing listSentralData', async () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).listSentralData = [{ uuid_sentral: 'existing-1' }]
    
    await (wrapper.vm as any).fetchSentralData()
    
    expect((wrapper.vm as any).sentralData).toHaveLength(1)
  })

  it('should handle fetchMesinByIdSentral with photo1', async () => {
    const wrapper = getWrapper()
    
    mockRekapService.getMesinByIdSentral.mockResolvedValueOnce({
      success: true,
      data: [
        { id: 1, nama_mesin: 'Test Mesin', photo1: 'photo-path.jpg' }
      ]
    })
    
    ;(wrapper.vm as any).sentralData = [
      { uuid_sentral: 'test-uuid', mesins: [] }
    ]
    
    await (wrapper.vm as any).fetchMesinByIdSentral('test-uuid')
    
    expect(mockRekapService.getMesinByIdSentral).toHaveBeenCalledWith('test-uuid')
  })

  it('should handle fetchStatusFSSentral with null data', async () => {
    const wrapper = getWrapper()
    
    mockRekapService.getStatusFSSentral.mockResolvedValueOnce({
      success: true,
      data: null
    })
    
    await (wrapper.vm as any).fetchStatusFSSentral()
    
    expect((wrapper.vm as any).statusFSSentral).toEqual([])
  })

  it('should handle fetchNilaiSentral with null data', async () => {
    const wrapper = getWrapper()
    
    mockRekapService.getNilaiSentral.mockResolvedValueOnce({
      success: true,
      data: null
    })
    
    await (wrapper.vm as any).fetchNilaiSentral()
    
    expect((wrapper.vm as any).sentralAssetIRRNPV).toEqual([])
  })

  it('should handle fetchComboKategoriPembangkit with dmn data', async () => {
    const wrapper = getWrapper()
    
    mockRekapService.getComboKategoriPembangkit.mockResolvedValueOnce({
      success: true,
      data: [
        { 
          jenis_kit: 'PLTU', 
          dmn: [
            { id_daya: 1, daya_mampu: '< 100' },
            { id_daya: 2, daya_mampu: '100-200' }
          ] 
        }
      ]
    })
    
    await (wrapper.vm as any).fetchComboKategoriPembangkit()
    
    expect((wrapper.vm as any).childDmn.length).toBeGreaterThan(0)
  })

  it('should handle generatePageList with various scenarios', () => {
    const wrapper = getWrapper()
    
    // Test with totalPages <= 5
    ;(wrapper.vm as any).totalPages = 3
    mockRekapNavigationStore.currentPage = 2
    let pageList = (wrapper.vm as any).generatePageList
    expect(pageList).toEqual([1, 2, 3])
    
    // Test with currentPage <= 3
    ;(wrapper.vm as any).totalPages = 10
    mockRekapNavigationStore.currentPage = 2
    pageList = (wrapper.vm as any).generatePageList
    expect(pageList.length).toBeGreaterThan(0)
    
    // Test with currentPage >= totalPages - 2
    mockRekapNavigationStore.currentPage = 9
    pageList = (wrapper.vm as any).generatePageList
    expect(pageList).toContain(1)
    expect(pageList).toContain('...')
    
    // Test middle scenario
    mockRekapNavigationStore.currentPage = 5
    pageList = (wrapper.vm as any).generatePageList
    expect(pageList).toContain('...')
  })

  it('should handle error cases in fetch functions', async () => {
    const wrapper = getWrapper()
    
    // Test error in fetchSuggestionSentral
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockRekapService.getSuggestionSentral.mockRejectedValueOnce(new Error('Network error'))
    
    await (wrapper.vm as any).fetchSuggestionSentral()
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Fetch Suggestion Sentral Error'), expect.any(Error))
    
    consoleErrorSpy.mockRestore()
  })

  it('should toggle pembangkit when already open', async () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).isPembangkitTabOpen = ['test-uuid-1']
    ;(wrapper.vm as any).sentralData = [
      { uuid_sentral: 'test-uuid-1', mesins: [[{ id: 1 }]] }
    ]
    
    await (wrapper.vm as any).togglePembangkit('test-uuid-1')
    
    expect((wrapper.vm as any).isPembangkitTabOpen).not.toContain('test-uuid-1')
  })

  it('should watch totalPages and update totalPagesRef', async () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).totalPages = 5
    
    await wrapper.vm.$nextTick()
    
    expect((wrapper.vm as any).totalPagesRef).toBe(5)
  })

  it('should watch isLoading and change body overflow', async () => {
    const wrapper = getWrapper()
    
    ;(wrapper.vm as any).isLoading = true
    await wrapper.vm.$nextTick()
    
    expect(document.body.style.overflow).toBe('hidden')
    
    ;(wrapper.vm as any).isLoading = false
    await wrapper.vm.$nextTick()
    
    expect(document.body.style.overflow).toBe('auto')
  })

  it('should watch store and trigger search when searchRekapQuery is empty', async () => {
    const wrapper = getWrapper()
    
    mockRekapSearchStore.searchRekapQuery = 'test'
    await wrapper.vm.$nextTick()
    
    mockRekapSearchStore.searchRekapQuery = ''
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 50))
    
    expect(mockRekapService.getSentralData).toHaveBeenCalled()
  })

})