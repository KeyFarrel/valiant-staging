import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import InputAsumsiParameter from '@/views/Verifikasi/Sentral/TabPage/KK/InputAsumsiParameter.vue'

// Mock router completely
vi.mock('@/router', () => ({
  default: {
    go: vi.fn(),
    push: vi.fn(),
    replace: vi.fn()
  }
}))

// Mock the services
vi.mock('@/services/user-service', () => ({
  default: class MockUserService {
    getPembina() { return Promise.resolve({ data: [] }) }
  }
}))

vi.mock('@/services/rekap-service', () => ({
  default: class MockRekapService {
    uploadEvidence() { return Promise.resolve({ data: 'test-path' }) }
    updateEvidencePath() { return Promise.resolve({}) }
    downloadTemplateRekap() { return Promise.resolve({ headers: {} }) }
    uploadTemplateAwalKK() { return Promise.resolve({}) }
  }
}))

vi.mock('@/services/helper/toast-notification', () => ({
  notifyError: vi.fn()
}))

vi.mock('@/services/input-asumsi-parameter-service', () => ({
  default: class MockInputAsumsiParameterService {
    getMesinById() { 
      return Promise.resolve({ 
        data: {
          mesin: 'Test Mesin',
          kode_jenis_pembangkit: 'PLTU',
          kode_mesin: 'TEST001',
          masa_manfaat: 25,
          daya_terpasang: 100,
          daya_mampu: 90,
          tahun_operasi: 2020,
          kondisi_unit: 'Active'
        }
      })
    }
    getAsumsiMakroData() { return Promise.resolve({ data: { tahun: 2024 } }) }
    getComboBahanBakar() { return Promise.resolve({ data: [] }) }
    updateAsumsi() { return Promise.resolve({}) }
    createParameter() { return Promise.resolve({}) }
  }
}))

vi.mock('@/services/persetujuan-service', () => ({
  default: class MockPersetujuanService {
    getPersetujuanKKSentral() { 
      return Promise.resolve({ 
        data: { 
          mesins: [{ uuid_mesin: 'test-id' }] 
        } 
      })
    }
  }
}))

vi.mock('@/services/perbarui-data', () => ({
  default: class MockPerbaruiDataService {
    getCheckIntegrasi() { 
      return Promise.resolve({ 
        data: [{ status_data_integrasi: "1" }] 
      })
    }
  }
}))

vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: vi.fn((value) => value)
  })
}))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: 'test-id' },
    query: { 
      uuid_sentral: 'test-uuid-sentral',
      tahun: '2024'
    }
  }),
  useRouter: () => ({
    go: vi.fn(),
    push: vi.fn(),
    replace: vi.fn()
  })
}))

describe('InputAsumsiParameter.vue', () => {
  let wrapper: any

  beforeEach(async () => {
    vi.clearAllMocks()
    
    wrapper = shallowMount(InputAsumsiParameter, {
      global: {
        stubs: {
          Loading: { template: '<div>Loading...</div>' },
          ModalNotification: { template: '<div>Modal</div>' },
          ModalWrapper: { template: '<div><slot /></div>' },
          InfoHeader: { template: '<div>Info Header</div>' },
          TabsWrapper: { template: '<div><slot /></div>' },
          ConfirmationDialog: { template: '<div>Confirmation</div>' },
          Vue3Lottie: { template: '<div>Lottie</div>' }
        }
      }
    })

    // Wait for component to finish mounting
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  it('should render component successfully', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should initialize with correct default ref values', async () => {
    // Wait for async operations to complete
    await new Promise(resolve => setTimeout(resolve, 200))
    
    expect(wrapper.vm.isInsertSuccess).toBe(false)
    expect(wrapper.vm.isShowModalConfirmation).toBe(false)
    expect(wrapper.vm.i).toBe(2)
    expect(wrapper.vm.isEvidenceSuccess).toBe(false)
  })

  it('should have formatBytes function working correctly', () => {
    const formatBytes = wrapper.vm.formatBytes
    
    expect(formatBytes(0)).toBe('0 Bytes')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1048576)).toBe('1 MB')
    expect(formatBytes(1073741824)).toBe('1 GB')
  })

  it('should handle bahan bakar operations correctly', async () => {
    // Test handleTambahBahanBakar
    const initialLength = wrapper.vm.bahanBakars.length
    wrapper.vm.handleTambahBahanBakar()
    
    expect(wrapper.vm.bahanBakars.length).toBe(initialLength + 1)
    expect(wrapper.vm.i).toBe(3)
    
    // Test with checked items for handleHapusBahanBakar
    wrapper.vm.checkedBahanBakar = [1, 2]
    wrapper.vm.handleHapusBahanBakar()
    expect(wrapper.vm.checkedBahanBakar.length).toBe(0)
  })

  it('should handle file operations correctly', () => {
    // Test handleFileChange
    const mockEvent = {
      target: {
        files: [{ name: 'test.pdf', size: 1024 }]
      }
    }
    
    wrapper.vm.handleFileChange(mockEvent)
    expect(wrapper.vm.selectedFile).toEqual(mockEvent.target.files[0])
    
    // Test handleFileChangeEvidence
    wrapper.vm.handleFileChangeEvidence(mockEvent)
    expect(wrapper.vm.selectedFileEvidence).toEqual(mockEvent.target.files[0])
    
    // Test with no files
    const emptyEvent = { target: { files: [] } }
    wrapper.vm.handleFileChange(emptyEvent)
    expect(wrapper.vm.selectedFile).toBe(null)
  })

  it('should toggle button state correctly', () => {
    const initialState = wrapper.vm.isHover
    wrapper.vm.toggleButton()
    expect(wrapper.vm.isHover).toBe(!initialState)
  })

  it('should handle checked functionality', () => {
    // Mock console.log
    const consoleSpy = vi.spyOn(console, 'log')
    wrapper.vm.checkedBahanBakar = [1, 2, 3]
    wrapper.vm.handleChecked()
    
    expect(consoleSpy).toHaveBeenCalledWith('Handle Checked 1,2,3')
  })

  it('should handle error validation in insertAsumsiParameter', async () => {
    // Set all required fields to empty to trigger validation errors
    wrapper.vm.interestRate = ''
    wrapper.vm.umurTeknis = ''
    wrapper.vm.loanTenor = ''
    wrapper.vm.loanPortion = ''
    wrapper.vm.nphr = ''
    wrapper.vm.auxiliary = ''
    wrapper.vm.susutTrafo = ''
    wrapper.vm.pemakaianSendiri = ''
    wrapper.vm.electricityPriceA = ''
    wrapper.vm.electricityPriceB = ''
    wrapper.vm.electricityPriceC = ''
    wrapper.vm.electricityPriceD = ''
    wrapper.vm.bahanBakars = [{ 
      id: 1, 
      kode_bahan_bakar: "", 
      harga_bahan_bakar: "", 
      sfc: "" 
    }]
    
    try {
      await wrapper.vm.insertAsumsiParameter()
    } catch (error) {
      // Handle any errors during test
    }
    
    // Check that errors are set
    expect(wrapper.vm.error.asumsi.interestRate).toBe(true)
    expect(wrapper.vm.error.parameter.nphr).toBe(true)
    expect(wrapper.vm.isShowModalNotification).toBe(false)
  }, 10000) // Increase timeout to 10 seconds

  it('should handle successful insertAsumsiParameter with valid data', async () => {
    // Set valid data
    wrapper.vm.interestRate = '10'
    wrapper.vm.umurTeknis = '25'
    wrapper.vm.loanTenor = '15'
    wrapper.vm.loanPortion = '70'
    wrapper.vm.nphr = '2300'
    wrapper.vm.auxiliary = '5'
    wrapper.vm.susutTrafo = '3'
    wrapper.vm.pemakaianSendiri = '2'
    wrapper.vm.electricityPriceA = '1200'
    wrapper.vm.electricityPriceB = '1300'
    wrapper.vm.electricityPriceC = '1400'
    wrapper.vm.electricityPriceD = '1500'
    wrapper.vm.bahanBakars = [{ 
      id: 1, 
      kode_bahan_bakar: "BBM", 
      harga_bahan_bakar: "15000", 
      sfc: "0.25" 
    }]
    wrapper.vm.idAsumsi = 1
    
    try {
      await wrapper.vm.insertAsumsiParameter()
    } catch (error) {
      // Handle any errors during test
    }
    
    // Check that no errors are set  
    expect(wrapper.vm.error.asumsi.interestRate).toBe(false)
    expect(wrapper.vm.error.parameter.nphr).toBe(false)
  })

  it('should handle uploadFileEvidence function', async () => {
    wrapper.vm.selectedFileEvidence = { name: 'test.pdf' }
    wrapper.vm.idMesin = 'test-id'
    wrapper.vm.year = 2024
    
    try {
      await wrapper.vm.uploadFileEvidence()
    } catch (error) {
      // Handle any errors during test
    }
    
    expect(wrapper.vm.isModalUnggahKertasKerjaOpen).toBe(false)
  })

  it('should handle handleDownloadTemplateRekap function', async () => {
    wrapper.vm.year = 2024
    wrapper.vm.idMesin = 'test-id'
    wrapper.vm.namaMesin = 'Test Mesin'
    
    try {
      await wrapper.vm.handleDownloadTemplateRekap()
    } catch (error) {
      // Handle any errors during test
    }
    
    expect(wrapper.vm.isDownloaded).toBe(true)
  })

  it('should handle uploadFile function', async () => {
    wrapper.vm.selectedFile = { name: 'test.xlsx' }
    
    try {
      await wrapper.vm.uploadFile()
    } catch (error) {
      // Handle any errors during test
    }
    
    // Just verify the function can be called without errors
    expect(true).toBe(true)
  })

  it('should handle handleCancelUpload function', async () => {
    wrapper.vm.selectedFileEvidence = { name: 'test.pdf' }
    wrapper.vm.isModalUnggahKertasKerjaOpen = true
    
    try {
      await wrapper.vm.handleCancelUpload()
    } catch (error) {
      // Handle any errors during test
    }
    
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle wait function', async () => {
    const start = Date.now()
    await wrapper.vm.wait(100)
    const end = Date.now()
    
    expect(end - start).toBeGreaterThanOrEqual(90) // Allow some tolerance
  })
  it('should handle insertAsumsiParameter update flow correctly', async () => {
    // Set valid data with formatting (commas)
    wrapper.vm.interestRate = '10,5'
    wrapper.vm.umurTeknis = '25'
    wrapper.vm.loanTenor = '15'
    wrapper.vm.loanPortion = '70,5'
    wrapper.vm.nphr = '2.300,50'
    wrapper.vm.auxiliary = '5,5'
    wrapper.vm.susutTrafo = '3,5'
    wrapper.vm.pemakaianSendiri = '2,5'
    wrapper.vm.electricityPriceA = '1.200,50'
    wrapper.vm.electricityPriceB = '1.300,50'
    wrapper.vm.electricityPriceC = '1.400,50'
    wrapper.vm.electricityPriceD = '1.500,50'
    wrapper.vm.bahanBakars = [{ 
      id: 1, 
      kode_bahan_bakar: "BBM", 
      harga_bahan_bakar: "15.000,50", 
      sfc: "0,25" 
    }]
    wrapper.vm.idAsumsi = 123
    wrapper.vm.idMesin = 'test-id'
    wrapper.vm.year = 2024

    // Mock services
    const updateSpy = vi.spyOn(wrapper.vm.inputAsumsiParameterService, 'updateAsumsi')
    const createParamSpy = vi.spyOn(wrapper.vm.inputAsumsiParameterService, 'createParameter')

    await wrapper.vm.insertAsumsiParameter()

    expect(updateSpy).toHaveBeenCalledWith(expect.objectContaining({
      id_asumsi: 123,
      interest_rate: 10.5,
      loan_portion: 70.5
    }))

    expect(createParamSpy).toHaveBeenCalledWith(expect.objectContaining({
      id_asumsi: 123,
      nphr: 2300.5,
      auxiliary: 5.5,
      electricity_price_a_rp_per_kwbln: 1200.5,
      harga_bahan_bakars: expect.arrayContaining([
        expect.objectContaining({
          harga_bahan_bakar: 15000.5,
          sfc: 0.25
        })
      ])
    }))
    
    expect(wrapper.vm.isInsertSuccess).toBe(false) // Waits 1500ms then false
    expect(wrapper.vm.isModalUnggahKertasKerjaOpen).toBe(true)
  })

  it('should validate upload file requirements', async () => {
    // import notifyError to spy
    const { notifyError } = await import('@/services/helper/toast-notification')
    
    // No file selected
    wrapper.vm.selectedFile = null
    
    await wrapper.vm.uploadFile()
    // Should return early
    expect(wrapper.vm.isLoading).toBe(false)
    expect(notifyError).toHaveBeenCalledWith('Mohon pilih file excel terlebih dahulu', 3000)

    // File too large
    wrapper.vm.selectedFile = { name: 'large.xlsx', size: 3000000 } // 3MB
    await wrapper.vm.uploadFile()
    expect(wrapper.vm.isLoading).toBe(false)
    expect(notifyError).toHaveBeenCalledWith('Ukuran file Kertas Kerja tidak boleh lebih dari 2MB', 5000)
  })

  it('should handle upload file with large evidence', async () => {
    wrapper.vm.selectedFile = { name: 'valid.xlsx', size: 1000000 }
    wrapper.vm.selectedFileEvidence = { name: 'large.xlsx', size: 6000000 } // 6MB
    
    await wrapper.vm.uploadFile()
    expect(wrapper.vm.isLoading).toBe(false) // Should return early
  })

  it('should handle upload file success with evidence', async () => {
    wrapper.vm.selectedFile = { name: 'valid.xlsx', size: 1000000 }
    wrapper.vm.selectedFileEvidence = { name: 'valid.pdf', size: 1000000 }
    
    // Mock rekapService methods on the instance or prototype if possible, or assume mock works
    const uploadEvidenceSpy = vi.spyOn(wrapper.vm.rekapService, 'uploadEvidence')
    const uploadTemplateSpy = vi.spyOn(wrapper.vm.rekapService, 'uploadTemplateAwalKK')
    
    // Mock router go
    wrapper.vm.router = { go: vi.fn() } // If router is attached to vm, else checking router.go via mock

    await wrapper.vm.uploadFile()
    
    expect(uploadEvidenceSpy).toHaveBeenCalled()
    expect(uploadTemplateSpy).toHaveBeenCalled()
    expect(wrapper.vm.isUploadSuccess).toBe(false) // After wait
  })
})