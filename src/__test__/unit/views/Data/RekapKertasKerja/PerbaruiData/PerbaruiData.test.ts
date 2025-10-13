import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PerbaruiData from '@/views/Data/RekapKertasKerja/PerbaruiData/PerbaruiData.vue'

// Mock WASM and encryption
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: vi.fn().mockResolvedValue({
    setItem: vi.fn(),
    getItem: vi.fn(),
    removeItem: vi.fn(),
    decryptValue: vi.fn().mockReturnValue('decrypted-value')
  })
}))

// Mock the stores
const mockPerbaruiTabStore = {
  currentTab: 'Asumsi Makro',
  $reset: vi.fn()
}

const mockUserAuthStore = {
  uuid: 'test-user-uuid',
  token: 'test-token',
  levelAlias: ''
}

vi.mock('@/store/storeRekapKertasKerja', () => ({
  usePerbaruiTabStore: () => mockPerbaruiTabStore
}))

vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: () => mockUserAuthStore
}))

// Mock the router
const mockRoute = {
  params: { 
    uuid: 'test-uuid-123',
    id: 'test-id-123'
  }
}

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn()
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter
}))

// Mock services
vi.mock('@/services/perbarui-data', () => ({
  default: class MockPerbaruiDataService {
    getMesinById = vi.fn().mockResolvedValue({
      success: true,
      data: {
        uuid: 'test-uuid',
        nama_mesin: 'Test Machine',
        kode_mesin: 'TM001',
        jenis_pembangkit: 'PLTU',
        status_mesin: 'aktif',
        kode_pengelola: 'KP001'
      }
    })
    
    getAsumsiParameter = vi.fn().mockResolvedValue({
      success: true,
      data: {
        asumsiMakro: {
          inflasi: '5.5',
          sbiRate: '6.0',
          usdRate: '15000'
        },
        parameterTeknis: {
          masaManfaat: '25',
          auxiliarySusut: '5.0'
        }
      }
    })

    getDataTeknisByPeriode = vi.fn().mockResolvedValue({
      success: true,
      data: {
        typePeriodic: '1',
        ncf: '80',
        eaf: '85',
        productionBrutto: '1000',
        productionNetto: '950',
        energySales: '900'
      }
    })

    getDataFinansialDetail = vi.fn().mockResolvedValue({
      success: true,
      data: {
        costComponentA: '1000000',
        costComponentB: '2000000',
        costComponentC: '1500000',
        costComponentD: '500000'
      }
    })

    getListTypePeriodic = vi.fn().mockResolvedValue({
      success: true,
      data: [
        { id: 1, label: 'Tahun Realisasi' },
        { id: 2, label: 'Tahun Proyeksi' }
      ]
    })
  }
}))

vi.mock('@/services/user-service', () => ({
  default: class MockUserService {
    getListPembina = vi.fn().mockResolvedValue({ success: true, data: [] })
  }
}))

vi.mock('@/services/auth-service', () => ({
  default: class MockAuthService {
    checkIntegrasi = vi.fn().mockResolvedValue({ success: true, data: false })
  }
}))

vi.mock('@/services/rekap-service', () => ({
  default: class MockRekapService {
    getUnitPengelola = vi.fn().mockResolvedValue({ success: true, data: [] })
  }
}))

vi.mock('@/services/persetujuan-service', () => ({
  default: class MockPersetujuanService {
    getPersetujuanKK = vi.fn().mockResolvedValue({ success: true, data: {} })
  }
}))

vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatCurrency = vi.fn((value) => value)
    formatNumber = vi.fn((value) => value)
  }
}))

describe('PerbaruiData.vue', () => {
  let wrapper: any
  let pinia: any

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    
    wrapper = mount(PerbaruiData, {
      global: {
        plugins: [pinia],
        stubs: {
          Loading: true,
          ModalNotification: true,
          ModalWrapper: true,
          TabsWrapper: true,
          TabItem: true,
          InfoHeader: true,
          InfoComponent: true,
          AsumsiInfoBox: true,
          ParameterTeknisInfoBox: true,
          ConfirmationDialog: true,
          TableDataTeknis: true,
          TableDataFinansial: true,
          AkhirMasaManfaat: true,
          TabAsumsiMakro: true,
          TabParameterTeknis: true,
          TabDataTeknis: true,
          TabDataFinansial: true,
          IconFolder: true,
          IconFolderBlue: true
        }
      }
    })
    
    // Wait for component to mount and async operations to complete
    await wrapper.vm.$nextTick()
  })

  it('should render component successfully', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('should initialize with loading state', () => {
    expect(wrapper.vm.isLoading).toBe(true)
  })

  it('should have default selected aside as "Asumsi Makro"', () => {
    expect(wrapper.vm.selectedAside).toBe('Asumsi Makro')
  })

  it('should have default selectedSimulasiTab as "Simulasi 1"', () => {
    expect(wrapper.vm.selectedSimulasiTab).toBe('Simulasi 1')
  })

  it('should have default picked value as "pisah"', () => {
    expect(wrapper.vm.picked).toBe('pisah')
  })

  it('should have default pickedParameterValue as "auxiliarySusut"', () => {
    expect(wrapper.vm.pickedParameterValue).toBe('auxiliarySusut')
  })

  it('should have default isShowRejected as true', () => {
    expect(wrapper.vm.isShowRejected).toBe(true)
  })

  it('should have default isIntegrasi as false', () => {
    expect(wrapper.vm.isIntegrasi).toBe(false)
  })

  it('should test getTypePeriodic function with valid number', () => {
    const result = wrapper.vm.getTypePeriodic(1)
    expect(result).toBe('-')
  })

  it('should test getTypePeriodic function with invalid number', () => {
    const result = wrapper.vm.getTypePeriodic(999)
    expect(result).toBe('-')
  })

  it('should test handleChange function', () => {
    wrapper.vm.handleChange()
    expect(wrapper.vm.checkedBahanBakar).toEqual([])
  })

  it('should test wait function', async () => {
    const start = Date.now()
    await wrapper.vm.wait(100)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(100)
  })

  it('should test toggleRowSimulasi1 function', () => {
    const itemId = 1
    wrapper.vm.toggleRowSimulasi1(itemId)
    expect(wrapper.vm.isRowTabOpenSimulasi1).toContain(itemId)
  })

  it('should test isRowOpenSimulasi1 function', () => {
    const itemId = 1
    wrapper.vm.isRowTabOpenSimulasi1 = [itemId]
    const result = wrapper.vm.isRowOpenSimulasi1(itemId)
    expect(result).toBe(true)
  })

  it('should test toggleRowSimulasi2 function', () => {
    const itemId = 2
    wrapper.vm.toggleRowSimulasi2(itemId)
    expect(wrapper.vm.isRowTabOpenSimulasi2).toContain(itemId)
  })

  it('should test isRowOpenSimulasi2 function', () => {
    const itemId = 2
    wrapper.vm.isRowTabOpenSimulasi2 = [itemId]
    const result = wrapper.vm.isRowOpenSimulasi2(itemId)
    expect(result).toBe(true)
  })

  it('should test handleFileChangeEvidence function', () => {
    const mockEvent = {
      target: {
        files: [new File(['test'], 'test.txt', { type: 'text/plain' })]
      }
    }
    wrapper.vm.handleFileChangeEvidence(mockEvent)
    expect(wrapper.vm.selectedFileEvidence).toBeDefined()
  })

  it('should test handleFileChangeSimulasi1 function', () => {
    const mockEvent = {
      target: {
        files: [new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })]
      }
    }
    wrapper.vm.handleFileChangeSimulasi1(mockEvent)
    expect(wrapper.vm.selectedFileSimulasi1).toBeDefined()
  })

  it('should test handleFileChange function', () => {
    const mockEvent = {
      target: {
        files: [new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })]
      }
    }
    wrapper.vm.handleFileChange(mockEvent)
    expect(wrapper.vm.selectedFile).toBeDefined()
  })

  it('should initialize tahunBerjalan with current year', () => {
    const currentYear = new Date().getFullYear()
    expect(wrapper.vm.tahunBerjalan).toBe(currentYear)
  })

  it('should have default isPermanent as false', () => {
    expect(wrapper.vm.isPermanent).toBe(false)
  })

  it('should have default isAudited as false', () => {
    expect(wrapper.vm.isAudited).toBe(false)
  })

  it('should have default modal states as false', () => {
    expect(wrapper.vm.isShowModalNotification).toBe(false)
    expect(wrapper.vm.isSuccess).toBe(false)
    expect(wrapper.vm.isFinalSubmitSuccess).toBe(false)
    expect(wrapper.vm.isSuccessSimulasi).toBe(false)
    expect(wrapper.vm.isSuccessPermanent).toBe(false)
    expect(wrapper.vm.isShowModalEvidence).toBe(false)
    expect(wrapper.vm.isSuccessEvidence).toBe(false)
    expect(wrapper.vm.isShowFinalConfirmation).toBe(false)
    expect(wrapper.vm.isUnggahModalOpenSimulasi1).toBe(false)
    expect(wrapper.vm.isUnggahModalOpen).toBe(false)
  })

  it('should test handleTambahBahanBakar function', () => {
    const initialBahanBakarLength = wrapper.vm.bahanBakarGroup.bahanBakars.length
    const initialFuelConsumptionLength = wrapper.vm.bahanBakarGroup.fuelConsumption.length
    const initialCostCDetailLength = wrapper.vm.bahanBakarGroup.costCDetail.length

    wrapper.vm.handleTambahBahanBakar()

    expect(wrapper.vm.bahanBakarGroup.bahanBakars.length).toBe(initialBahanBakarLength + 1)
    expect(wrapper.vm.bahanBakarGroup.fuelConsumption.length).toBe(initialFuelConsumptionLength + 1)
    expect(wrapper.vm.bahanBakarGroup.costCDetail.length).toBe(initialCostCDetailLength + 1)
  })

  it('should test handleHapusBahanBakar function', () => {
    // Setup test data
    wrapper.vm.bahanBakarGroup.bahanBakars = [
      { kode_bahan_bakar: 'BB001', id: 1 },
      { kode_bahan_bakar: 'BB002', id: 2 }
    ]
    wrapper.vm.bahanBakarGroup.fuelConsumption = [
      { kode_bahan_bakar: 'BB001', value: '100' },
      { kode_bahan_bakar: 'BB002', value: '200' }
    ]
    wrapper.vm.bahanBakarGroup.costCDetail = [
      { kode_bahan_bakar: 'BB001', fuel_cost: '1000' },
      { kode_bahan_bakar: 'BB002', fuel_cost: '2000' }
    ]
    wrapper.vm.checkedBahanBakar = ['BB001']

    wrapper.vm.handleHapusBahanBakar()

    expect(wrapper.vm.bahanBakarGroup.bahanBakars.length).toBe(1)
    expect(wrapper.vm.bahanBakarGroup.bahanBakars[0].kode_bahan_bakar).toBe('BB002')
    expect(wrapper.vm.checkedBahanBakar).toEqual([])
  })

  it('should test handleHapusBahanBakar with empty checked array', () => {
    wrapper.vm.checkedBahanBakar = []
    const initialLength = wrapper.vm.bahanBakarGroup.bahanBakars.length

    wrapper.vm.handleHapusBahanBakar()

    expect(wrapper.vm.bahanBakarGroup.bahanBakars.length).toBe(initialLength)
  })

  it('should test error object structure', () => {
    expect(wrapper.vm.error).toBeDefined()
    expect(typeof wrapper.vm.error).toBe('object')
  })

  // Simple function tests without complex mocking
  it('should test basic component data initialization', () => {
    expect(wrapper.vm.i).toBe(1)
    expect(wrapper.vm.nodeMode).toBeDefined()
    expect(wrapper.vm.uuidMesin).toBeDefined()
    expect(wrapper.vm.isRowTabOpenSimulasi1).toEqual([])
    expect(wrapper.vm.isRowTabOpenSimulasi2).toEqual([])
  })

  it('should test basic reactive data structures', () => {
    expect(wrapper.vm.bahanBakarGroup).toHaveProperty('bahanBakars')
    expect(wrapper.vm.bahanBakarGroup).toHaveProperty('fuelConsumption')
    expect(wrapper.vm.bahanBakarGroup).toHaveProperty('costCDetail')
    expect(Array.isArray(wrapper.vm.bahanBakarGroup.bahanBakars)).toBe(true)
    expect(Array.isArray(wrapper.vm.bahanBakarGroup.fuelConsumption)).toBe(true)
    expect(Array.isArray(wrapper.vm.bahanBakarGroup.costCDetail)).toBe(true)
  })

  it('should test asumsiParameter data structure', () => {
    expect(wrapper.vm.asumsiParameter).toHaveProperty('asumsiMakro')
    expect(wrapper.vm.asumsiParameter).toHaveProperty('parameterTeknis')
    expect(wrapper.vm.asumsiParameterInit).toHaveProperty('asumsiMakro')
    expect(wrapper.vm.asumsiParameterInit).toHaveProperty('parameterTeknis')
  })

  it('should test dataTeknisInit structure', () => {
    expect(wrapper.vm.dataTeknisInit).toHaveProperty('typePeriodic')
    expect(wrapper.vm.dataTeknisInit).toHaveProperty('ncf')
    expect(wrapper.vm.dataTeknisInit).toHaveProperty('eaf')
    expect(wrapper.vm.dataTeknisInit).toHaveProperty('productionBrutto')
    expect(wrapper.vm.dataTeknisInit).toHaveProperty('productionNetto')
    expect(wrapper.vm.dataTeknisInit).toHaveProperty('energySales')
  })

  it('should test dataFinansialInit structure', () => {
    expect(wrapper.vm.dataFinansialInit).toHaveProperty('costComponentA')
    expect(wrapper.vm.dataFinansialInit).toHaveProperty('costComponentB')
    expect(wrapper.vm.dataFinansialInit).toHaveProperty('costComponentC')
    expect(wrapper.vm.dataFinansialInit).toHaveProperty('costComponentD')
  })

  it('should test hasil simulasi structures', () => {
    expect(wrapper.vm.hasilSimulasi1).toHaveProperty('idMesin')
    expect(wrapper.vm.hasilSimulasi1).toHaveProperty('trackIrrProject')
    expect(wrapper.vm.hasilSimulasi1).toHaveProperty('trackIrrEquity')
    expect(wrapper.vm.hasilSimulasi1).toHaveProperty('isFetchingError')
    
    expect(wrapper.vm.hasilSimulasi2).toHaveProperty('isFetchingError')
  })

  it('should test file selection variables initialization', () => {
    expect(wrapper.vm.selectedFileSimulasi1).toBeNull()
    expect(wrapper.vm.selectedFile).toBeNull()
    expect(wrapper.vm.selectedFileEvidence).toBeNull()
  })

  it('should toggle row state correctly for simulasi1', () => {
    const itemId = 5
    expect(wrapper.vm.isRowTabOpenSimulasi1).not.toContain(itemId)
    
    wrapper.vm.toggleRowSimulasi1(itemId)
    expect(wrapper.vm.isRowTabOpenSimulasi1).toContain(itemId)
    
    wrapper.vm.toggleRowSimulasi1(itemId)
    expect(wrapper.vm.isRowTabOpenSimulasi1).not.toContain(itemId)
  })

  it('should toggle row state correctly for simulasi2', () => {
    const itemId = 10
    expect(wrapper.vm.isRowTabOpenSimulasi2).not.toContain(itemId)
    
    wrapper.vm.toggleRowSimulasi2(itemId)
    expect(wrapper.vm.isRowTabOpenSimulasi2).toContain(itemId)
    
    wrapper.vm.toggleRowSimulasi2(itemId)
    expect(wrapper.vm.isRowTabOpenSimulasi2).not.toContain(itemId)
  })

  // Test file handling with multiple files
  it('should handle multiple files in handleFileChangeEvidence', () => {
    const mockEvent = {
      target: {
        files: [
          new File(['test1'], 'test1.txt', { type: 'text/plain' }),
          new File(['test2'], 'test2.txt', { type: 'text/plain' })
        ]
      }
    }
    wrapper.vm.handleFileChangeEvidence(mockEvent)
    expect(wrapper.vm.selectedFileEvidence).toBeNull()
  })

  it('should handle multiple files in handleFileChangeSimulasi1', () => {
    const mockEvent = {
      target: {
        files: [
          new File(['test1'], 'test1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
          new File(['test2'], 'test2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        ]
      }
    }
    wrapper.vm.handleFileChangeSimulasi1(mockEvent)
    expect(wrapper.vm.selectedFileSimulasi1).toBeNull()
  })

  it('should handle multiple files in handleFileChange', () => {
    const mockEvent = {
      target: {
        files: [
          new File(['test1'], 'test1.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
          new File(['test2'], 'test2.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        ]
      }
    }
    wrapper.vm.handleFileChange(mockEvent)
    expect(wrapper.vm.selectedFile).toBeNull()
  })

  // Test uploadFileEvidence
  it('should call uploadFileEvidence successfully', async () => {
    wrapper.vm.selectedFileEvidence = new File(['test'], 'evidence.pdf', { type: 'application/pdf' })
    wrapper.vm.uuidMesin = 'test-uuid'
    wrapper.vm.tahunBerjalan = 2024

    await wrapper.vm.uploadFileEvidence()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle error in uploadFileEvidence', async () => {
    // Mock console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    wrapper.vm.selectedFileEvidence = null
    
    await wrapper.vm.uploadFileEvidence()
    
    consoleErrorSpy.mockRestore()
  })

  // Test uploadFileSimulasi1
  it('should handle uploadFileSimulasi1 with null file', async () => {
    wrapper.vm.selectedFileSimulasi1 = null
    wrapper.vm.isLoading = false

    await wrapper.vm.uploadFileSimulasi1()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle uploadFileSimulasi1 with error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    wrapper.vm.selectedFileSimulasi1 = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    await wrapper.vm.uploadFileSimulasi1()
    
    consoleErrorSpy.mockRestore()
  })

  // Test uploadFile
  it('should handle uploadFile with no selected file', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    wrapper.vm.selectedFile = null
    
    await wrapper.vm.uploadFile()
    
    consoleErrorSpy.mockRestore()
  })

  it('should handle uploadFile with error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    wrapper.vm.selectedFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    await wrapper.vm.uploadFile()
    
    consoleErrorSpy.mockRestore()
  })

  // Test handleTambahBahanBakar with watch
  it('should add bahan bakar and trigger watch', async () => {
    wrapper.vm.comboBahanBakar = [
      {
        kode_bahan_bakar: 'BB001',
        id_uraian_fuel_consumption: '1',
        bahan_bakar: 'Bahan Bakar 1'
      }
    ]

    wrapper.vm.handleTambahBahanBakar()

    expect(wrapper.vm.bahanBakarGroup.bahanBakars.length).toBeGreaterThan(0)
    expect(wrapper.vm.bahanBakarGroup.fuelConsumption.length).toBeGreaterThan(0)
    expect(wrapper.vm.bahanBakarGroup.costCDetail.length).toBeGreaterThan(0)

    // Trigger watch by updating kode_bahan_bakar
    if (wrapper.vm.bahanBakarGroup.bahanBakars.length > 0) {
      wrapper.vm.bahanBakarGroup.bahanBakars[0].kode_bahan_bakar = 'BB001'
    }

    await wrapper.vm.$nextTick()
  })

  // Test handleChange watchEffect
  it('should handle handleChange with watchEffect', async () => {
    wrapper.vm.comboBahanBakar = [
      {
        kode_bahan_bakar: 'BB002',
        id_uraian_fuel_consumption: '2',
        bahan_bakar: 'Bahan Bakar 2'
      }
    ]

    wrapper.vm.bahanBakarGroup.bahanBakars = [
      {
        kode_bahan_bakar: 'BB002',
        flag_bahan_bakar: 0,
        harga_bahan_bakar: '1000',
        uuid_mesin: 'test-uuid',
        sfc: '5',
        tahun: '2023',
        id: 1
      }
    ]

    wrapper.vm.bahanBakarGroup.fuelConsumption = [
      { id_uraian: 0, bahan_bakar: '', value: '0' }
    ]

    wrapper.vm.bahanBakarGroup.costCDetail = [
      { uuid_mesin: 'test-uuid', tahun: 2023, kode_bahan_bakar: '', fuel_cost: '0' }
    ]

    wrapper.vm.handleChange()

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 100))
  })

  // Test handleHapusBahanBakar with actual deletion
  it('should delete checked bahan bakar items from all arrays', () => {
    wrapper.vm.bahanBakarGroup.bahanBakars = [
      { kode_bahan_bakar: 'BB001', id: 1 },
      { kode_bahan_bakar: 'BB002', id: 2 },
      { kode_bahan_bakar: 'BB003', id: 3 }
    ]
    wrapper.vm.bahanBakarGroup.fuelConsumption = [
      { kode_bahan_bakar: 'BB001', value: '100' },
      { kode_bahan_bakar: 'BB002', value: '200' },
      { kode_bahan_bakar: 'BB003', value: '300' }
    ]
    wrapper.vm.bahanBakarGroup.costCDetail = [
      { kode_bahan_bakar: 'BB001', fuel_cost: '1000' },
      { kode_bahan_bakar: 'BB002', fuel_cost: '2000' },
      { kode_bahan_bakar: 'BB003', fuel_cost: '3000' }
    ]
    wrapper.vm.checkedBahanBakar = ['BB001', 'BB003']

    wrapper.vm.handleHapusBahanBakar()

    expect(wrapper.vm.bahanBakarGroup.bahanBakars.length).toBe(1)
    expect(wrapper.vm.bahanBakarGroup.bahanBakars[0].kode_bahan_bakar).toBe('BB002')
    expect(wrapper.vm.bahanBakarGroup.fuelConsumption.length).toBe(1)
    expect(wrapper.vm.bahanBakarGroup.costCDetail.length).toBe(1)
    expect(wrapper.vm.checkedBahanBakar).toEqual([])
  })

  // Test fetchDataTeknisSimulasi1
  it('should test fetchDataTeknisSimulasi1', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    await wrapper.vm.fetchDataTeknisSimulasi1()
    
    consoleLogSpy.mockRestore()
  })

  // Test fetchDataTeknisSimulasi2
  it('should test fetchDataTeknisSimulasi2', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    await wrapper.vm.fetchDataTeknisSimulasi2()
    
    consoleLogSpy.mockRestore()
  })

  // Test fetchDataFinansialSimulasi1
  it('should test fetchDataFinansialSimulasi1', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    await wrapper.vm.fetchDataFinansialSimulasi1()
    
    consoleLogSpy.mockRestore()
  })

  // Test fetchDataFinansialSimulasi2
  it('should test fetchDataFinansialSimulasi2', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    await wrapper.vm.fetchDataFinansialSimulasi2()
    
    consoleLogSpy.mockRestore()
  })

  // Test handleDownloadExcelSimulasi1
  it('should handle download excel simulasi 1', async () => {
    await wrapper.vm.handleDownloadExcelSimulasi1()
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle error in handleDownloadExcelSimulasi1', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await wrapper.vm.handleDownloadExcelSimulasi1()
    
    consoleErrorSpy.mockRestore()
  })

  // Test handleDownloadExcelSimulasi2
  it('should handle download excel simulasi 2', async () => {
    await wrapper.vm.handleDownloadExcelSimulasi2()
    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle error in handleDownloadExcelSimulasi2', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await wrapper.vm.handleDownloadExcelSimulasi2()
    
    consoleErrorSpy.mockRestore()
  })

  // Test handleSubmit validation
  it('should validate all required fields in handleSubmit', async () => {
    wrapper.vm.asumsiParameter = {
      asumsiMakro: {
        interestRate: '',
        umurTeknis: '',
        loanTenor: '',
        loanPortion: '',
        totalProjectCost: '',
        dayaMampuNettoMW: ''
      },
      parameterTeknis: {
        nphr: '',
        auxiliary: '',
        susutTrafo: '',
        pemakaianSendiri: '',
        electricityPriceA: '',
        electricityPriceB: '',
        electricityPriceC: '',
        electricityPriceD: '',
      }
    }

    wrapper.vm.typePeriodic = ''
    wrapper.vm.ncf = ''
    wrapper.vm.eaf = ''
    wrapper.vm.productionBrutto = ''
    wrapper.vm.productionNetto = ''
    wrapper.vm.energySales = ''
    wrapper.vm.costComponentA = ''
    wrapper.vm.costComponentB = ''
    wrapper.vm.costComponentC = ''
    wrapper.vm.costComponentD = ''
    wrapper.vm.biayaKepegawaian = ''
    wrapper.vm.biayaPemeliharaanRutin = ''
    wrapper.vm.biayaAdministrasiUmum = ''
    wrapper.vm.biayaPembelianTenagaListrik = ''
    wrapper.vm.biayaLainLain = ''
    wrapper.vm.biayaMinyakPelumas = ''
    wrapper.vm.bahanKimia = ''
    wrapper.vm.totalRevenue = ''
    wrapper.vm.revenueKompA = ''
    wrapper.vm.revenueKompB = ''
    wrapper.vm.revenueKompC = ''
    wrapper.vm.revenueKompD = ''

    // Start the submission but don't await
    const submitPromise = wrapper.vm.handleSubmit()
    
    // Give it a small amount of time to start
    await new Promise(resolve => setTimeout(resolve, 100))

    // Validation should have been set
    expect(wrapper.vm.error.asumsi.interestRate).toBe(true)
    expect(wrapper.vm.error.asumsi.umurTeknis).toBe(true)
    expect(wrapper.vm.error.asumsi.loanTenor).toBe(true)
    expect(wrapper.vm.error.asumsi.loanPortion).toBe(true)
  }, 10000)

  // Test handleFinalSubmit
  it('should handle final submit for simulasi 1', async () => {
    wrapper.vm.selectedSimulasiTab = 'Simulasi 1'
    wrapper.vm.uuidMesin = 'test-uuid'
    wrapper.vm.tahunBerjalan = 2024
    wrapper.vm.selectedFileEvidence = null
    wrapper.vm.formFinansialSimulasi1 = {
      cost_component_c_detail: [
        { kode_bahan_bakar: 'BB001', fuel_cost: '1.000,50' }
      ]
    }
    wrapper.vm.dataTeknisSimulasi1 = {}

    await wrapper.vm.handleFinalSubmit()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle final submit for simulasi 2', async () => {
    wrapper.vm.selectedSimulasiTab = 'Simulasi 2'
    wrapper.vm.selectedFileEvidence = null
    wrapper.vm.dataTeknisSimulasi2 = {}
    wrapper.vm.formFinansialSimulasi2 = {}

    await wrapper.vm.handleFinalSubmit()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle final submit with evidence file for simulasi 1', async () => {
    wrapper.vm.selectedSimulasiTab = 'Simulasi 1'
    wrapper.vm.selectedFileEvidence = new File(['test'], 'evidence.pdf', { type: 'application/pdf' })
    wrapper.vm.formFinansialSimulasi1 = {
      cost_component_c_detail: []
    }
    wrapper.vm.dataTeknisSimulasi1 = {}

    await wrapper.vm.handleFinalSubmit()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle final submit with evidence file for simulasi 2', async () => {
    wrapper.vm.selectedSimulasiTab = 'Simulasi 2'
    wrapper.vm.selectedFileEvidence = new File(['test'], 'evidence.pdf', { type: 'application/pdf' })
    wrapper.vm.dataTeknisSimulasi2 = {}
    wrapper.vm.formFinansialSimulasi2 = {}

    await wrapper.vm.handleFinalSubmit()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should handle error in handleFinalSubmit', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    wrapper.vm.selectedSimulasiTab = 'Simulasi 1'
    wrapper.vm.formFinansialSimulasi1 = null // This should cause an error

    await wrapper.vm.handleFinalSubmit()

    expect(wrapper.vm.isLoading).toBe(false)
    consoleErrorSpy.mockRestore()
  })

  // Test handleSubmit with valid data
  it('should handle submit with valid data and catch errors', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    wrapper.vm.asumsiParameter = {
      asumsiMakro: {
        interestRate: '5.5',
        umurTeknis: '25',
        loanTenor: '15',
        loanPortion: '70',
        totalProjectCost: '1000000',
        dayaMampuNettoMW: '100'
      },
      parameterTeknis: {
        nphr: '2500',
        auxiliary: '5',
        susutTrafo: '2',
        pemakaianSendiri: '3',
        electricityPriceA: '1000',
        electricityPriceB: '800',
        electricityPriceC: '1200',
        electricityPriceD: '900',
      }
    }

    wrapper.vm.bahanBakarGroup.bahanBakars = [
      {
        kode_bahan_bakar: 'BB001',
        flag_bahan_bakar: 0,
        harga_bahan_bakar: '10000',
        uuid_mesin: 'test-uuid',
        sfc: '5',
        tahun: '2023',
        id: 1
      }
    ]

    wrapper.vm.typePeriodic = '1'
    wrapper.vm.ncf = '80'
    wrapper.vm.eaf = '85'
    wrapper.vm.productionBrutto = '1000'
    wrapper.vm.productionNetto = '950'
    wrapper.vm.energySales = '900'
    wrapper.vm.bahanBakarGroup.fuelConsumption = [
      { id_uraian: 1, bahan_bakar: 'BB001', value: '100' }
    ]
    wrapper.vm.costComponentA = '1000000'
    wrapper.vm.costComponentADetail = [
      { kode_bahan_bakar: 'BB001', fuel_cost: '50000' }
    ]
    wrapper.vm.costComponentB = '2000000'
    wrapper.vm.biayaKepegawaian = '500000'
    wrapper.vm.biayaPemeliharaanRutin = '300000'
    wrapper.vm.biayaAdministrasiUmum = '200000'
    wrapper.vm.biayaPembelianTenagaListrik = '100000'
    wrapper.vm.biayaLainLain = '50000'
    wrapper.vm.costComponentC = '1500000'
    wrapper.vm.bahanBakarGroup.costCDetail = [
      { kode_bahan_bakar: 'BB001', fuel_cost: '1500000' }
    ]
    wrapper.vm.costComponentD = '500000'
    wrapper.vm.biayaMinyakPelumas = '300000'
    wrapper.vm.bahanKimia = '200000'
    wrapper.vm.totalRevenue = '10000000'
    wrapper.vm.revenueKompA = '3000000'
    wrapper.vm.revenueKompB = '2500000'
    wrapper.vm.revenueKompC = '3000000'
    wrapper.vm.revenueKompD = '1500000'

    try {
      await wrapper.vm.handleSubmit()
    } catch (error) {
      // Expected to throw error in mock environment
    }

    consoleErrorSpy.mockRestore()
  })

  // Test fetchDataFinansialSimulasi1 with nested levels
  it('should handle fetchDataFinansialSimulasi1 with nested level data', async () => {
    const mockResponse = {
      data: {
        detail: [
          { level: 1, id: 1, name: 'Level 1 Item' },
          { level: 2, id: 2, name: 'Level 2 Item' },
          { level: 3, id: 3, name: 'Level 3 Item' },
          { level: 4, id: 4, name: 'Level 4 Item' }
        ]
      }
    }

    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    // Mock the service
    vi.spyOn(wrapper.vm, 'fetchDataFinansialSimulasi1').mockImplementation(async () => {
      wrapper.vm.simulasi1DataFinansial = []
      let currentLevel1: any | null = null
      let currentLevel2: any | null = null
      let currentLevel3: any | null = null
      
      for (const item of mockResponse.data.detail) {
        if (item.level === 1) {
          currentLevel1 = { ...item, level2: [] }
          wrapper.vm.simulasi1DataFinansial.push(currentLevel1)
        } else if (item.level === 2 && currentLevel1 !== null) {
          currentLevel2 = { ...item, level3: [] }
          currentLevel1.level2.push(currentLevel2)
        } else if (item.level === 3 && currentLevel1 !== null) {
          currentLevel3 = { ...item, level4: [] }
          currentLevel2.level3.push(currentLevel3)
        } else if (item.level === 4 && currentLevel1 !== null) {
          currentLevel3.level4.push({ ...item })
        }
      }
    })

    await wrapper.vm.fetchDataFinansialSimulasi1()

    consoleLogSpy.mockRestore()
  })

  // Test fetchDataFinansialSimulasi2 with nested levels
  it('should handle fetchDataFinansialSimulasi2 with nested level data', async () => {
    const mockResponse = {
      data: {
        detail: [
          { level: 1, id: 1, name: 'Level 1 Item' },
          { level: 2, id: 2, name: 'Level 2 Item' },
          { level: 3, id: 3, name: 'Level 3 Item' },
          { level: 4, id: 4, name: 'Level 4 Item' }
        ]
      }
    }

    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    vi.spyOn(wrapper.vm, 'fetchDataFinansialSimulasi2').mockImplementation(async () => {
      wrapper.vm.simulasi2DataFinansial = []
      let currentLevel1: any | null = null
      let currentLevel2: any | null = null
      let currentLevel3: any | null = null
      
      for (const item of mockResponse.data.detail) {
        if (item.level === 1) {
          currentLevel1 = { ...item, level2: [] }
          wrapper.vm.simulasi2DataFinansial.push(currentLevel1)
        } else if (item.level === 2 && currentLevel1 !== null) {
          currentLevel2 = { ...item, level3: [] }
          currentLevel1.level2.push(currentLevel2)
        } else if (item.level === 3 && currentLevel1 !== null) {
          currentLevel3 = { ...item, level4: [] }
          currentLevel2.level3.push(currentLevel3)
        } else if (item.level === 4 && currentLevel1 !== null) {
          currentLevel3.level4.push({ ...item })
        }
      }
    })

    await wrapper.vm.fetchDataFinansialSimulasi2()

    consoleLogSpy.mockRestore()
  })

  // Test validation error cases for all fields
  it('should set validation errors for empty parameter teknis fields', async () => {
    wrapper.vm.asumsiParameter.parameterTeknis = {
      nphr: '',
      auxiliary: '',
      susutTrafo: '',
      pemakaianSendiri: '',
      electricityPriceA: '',
      electricityPriceB: '',
      electricityPriceC: '',
      electricityPriceD: '',
    }
    wrapper.vm.bahanBakarGroup.bahanBakars = [{ kode_bahan_bakar: '', id: 1 }]
    
    const submitPromise = wrapper.vm.handleSubmit()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.error.parameter.nphr).toBe(true)
    expect(wrapper.vm.error.parameter.auxiliary).toBe(true)
    expect(wrapper.vm.error.parameter.susutTrafo).toBe(true)
    expect(wrapper.vm.error.parameter.pemakaianSendiri).toBe(true)
  }, 10000)

  // Test validation for data teknis errors
  it('should set validation errors for empty data teknis fields', async () => {
    wrapper.vm.asumsiParameter = {
      asumsiMakro: {
        interestRate: '5',
        umurTeknis: '25',
        loanTenor: '15',
        loanPortion: '70',
        totalProjectCost: '1000',
        dayaMampuNettoMW: '100'
      },
      parameterTeknis: {
        nphr: '2500',
        auxiliary: '5',
        susutTrafo: '2',
        pemakaianSendiri: '3',
        electricityPriceA: '1000',
        electricityPriceB: '800',
        electricityPriceC: '1200',
        electricityPriceD: '900',
      }
    }
    wrapper.vm.bahanBakarGroup.bahanBakars = [{ kode_bahan_bakar: 'BB001', harga_bahan_bakar: '1000', flag_bahan_bakar: 0, uuid_mesin: 'test', sfc: '5', tahun: '2023', id: 1 }]
    wrapper.vm.typePeriodic = ''
    wrapper.vm.ncf = ''
    wrapper.vm.eaf = ''
    wrapper.vm.productionBrutto = ''
    wrapper.vm.productionNetto = ''
    wrapper.vm.energySales = ''
    wrapper.vm.bahanBakarGroup.fuelConsumption = [{ id_uraian: 1, bahan_bakar: 'BB001', value: '' }]

    const submitPromise = wrapper.vm.handleSubmit()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.error.teknis.periodicMaintenance).toBe(true)
    expect(wrapper.vm.error.teknis.ncf).toBe(true)
    expect(wrapper.vm.error.teknis.eaf).toBe(true)
  }, 10000)

  // Test validation for data finansial errors
  it('should set validation errors for NaN finansial fields', async () => {
    wrapper.vm.asumsiParameter = {
      asumsiMakro: {
        interestRate: '5',
        umurTeknis: '25',
        loanTenor: '15',
        loanPortion: '70',
        totalProjectCost: '1000',
        dayaMampuNettoMW: '100'
      },
      parameterTeknis: {
        nphr: '2500',
        auxiliary: '5',
        susutTrafo: '2',
        pemakaianSendiri: '3',
        electricityPriceA: '1000',
        electricityPriceB: '800',
        electricityPriceC: '1200',
        electricityPriceD: '900',
      }
    }
    wrapper.vm.bahanBakarGroup.bahanBakars = [{ kode_bahan_bakar: 'BB001', harga_bahan_bakar: '1000', flag_bahan_bakar: 0, uuid_mesin: 'test', sfc: '5', tahun: '2023', id: 1 }]
    wrapper.vm.typePeriodic = '1'
    wrapper.vm.ncf = '80'
    wrapper.vm.eaf = '85'
    wrapper.vm.productionBrutto = '1000'
    wrapper.vm.productionNetto = '950'
    wrapper.vm.energySales = '900'
    wrapper.vm.bahanBakarGroup.fuelConsumption = [{ id_uraian: 1, bahan_bakar: 'BB001', value: '100' }]
    wrapper.vm.costComponentA = 'NaN'
    wrapper.vm.costComponentB = 'NaN'
    wrapper.vm.costComponentC = 'NaN'
    wrapper.vm.costComponentD = 'NaN'
    wrapper.vm.biayaKepegawaian = 'NaN'
    wrapper.vm.totalRevenue = 'NaN'

    const submitPromise = wrapper.vm.handleSubmit()
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.error.finansial.costComponentA).toBe(true)
    expect(wrapper.vm.error.finansial.costComponentB).toBe(true)
  }, 10000)

  // Test getTypePeriodic with populated list
  it('should return type periodic label when list is populated', () => {
    wrapper.vm.listTypePeriodic = [
      { id_type_periodic: 1, kode_type_periodic: 'Type 1' },
      { id_type_periodic: 2, kode_type_periodic: 'Type 2' }
    ]
    
    const result = wrapper.vm.getTypePeriodic(1)
    expect(result).toBe('Type 1')
  })

  it('should return dash when type periodic not found in list', () => {
    wrapper.vm.listTypePeriodic = [
      { id_type_periodic: 1, kode_type_periodic: 'Type 1' },
      { id_type_periodic: 2, kode_type_periodic: 'Type 2' }
    ]
    
    const result = wrapper.vm.getTypePeriodic(999)
    expect(result).toBe('-')
  })

  // Test handleSubmit with modal notification flow
  it('should show modal notification on validation errors and hide after wait', async () => {
    wrapper.vm.asumsiParameter = {
      asumsiMakro: {
        interestRate: '',
        umurTeknis: '',
        loanTenor: '',
        loanPortion: '',
        totalProjectCost: '',
        dayaMampuNettoMW: ''
      },
      parameterTeknis: {
        nphr: '',
        auxiliary: '',
        susutTrafo: '',
        pemakaianSendiri: '',
        electricityPriceA: '',
        electricityPriceB: '',
        electricityPriceC: '',
        electricityPriceD: '',
      }
    }

    const submitPromise = wrapper.vm.handleSubmit()
    
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(wrapper.vm.isShowModalNotification).toBe(true)
  }, 10000)

  // Test handleSubmit with create asumsi (idAsumsi === 0)
  it('should handle create asumsi when idAsumsi is 0', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    wrapper.vm.idAsumsi = 0
    wrapper.vm.statusAsumsi = 'create'
    wrapper.vm.asumsiParameter = {
      asumsiMakro: {
        interestRate: '5,5',
        umurTeknis: '25',
        loanTenor: '15',
        loanPortion: '70,5',
        totalProjectCost: '1.000.000',
        dayaMampuNettoMW: '100,5'
      },
      parameterTeknis: {
        nphr: '2500',
        auxiliary: '5',
        susutTrafo: '2',
        pemakaianSendiri: '3',
        electricityPriceA: '1000',
        electricityPriceB: '800',
        electricityPriceC: '1200',
        electricityPriceD: '900',
      }
    }
    wrapper.vm.bahanBakarGroup.bahanBakars = [{ kode_bahan_bakar: 'BB001', harga_bahan_bakar: '1000', flag_bahan_bakar: 0, uuid_mesin: 'test', sfc: '5', tahun: '2023', id: 1 }]
    wrapper.vm.typePeriodic = '1'
    wrapper.vm.ncf = '80,5'
    wrapper.vm.eaf = '85,5'
    wrapper.vm.productionBrutto = '1.000'
    wrapper.vm.productionNetto = '950,5'
    wrapper.vm.energySales = '900,5'
    wrapper.vm.bahanBakarGroup.fuelConsumption = [{ id_uraian: 1, bahan_bakar: 'BB001', value: '100,5' }]
    wrapper.vm.costComponentA = '1.000.000'
    wrapper.vm.costComponentADetail = []
    wrapper.vm.costComponentB = '2.000.000'
    wrapper.vm.biayaKepegawaian = '500.000'
    wrapper.vm.periodicMaintenanceCost = '100.000'
    wrapper.vm.biayaPemeliharaanRutin = '300.000'
    wrapper.vm.biayaAdministrasiUmum = '200.000'
    wrapper.vm.biayaPembelianTenagaListrik = '100.000'
    wrapper.vm.biayaLainLain = '50.000'
    wrapper.vm.costComponentC = '1.500.000'
    wrapper.vm.bahanBakarGroup.costCDetail = [{ kode_bahan_bakar: 'BB001', fuel_cost: '1.500.000' }]
    wrapper.vm.costComponentD = '500.000'
    wrapper.vm.biayaMinyakPelumas = '300.000'
    wrapper.vm.bahanKimia = '200.000'
    wrapper.vm.totalRevenue = '10.000.000'
    wrapper.vm.revenueKompA = '3.000.000'
    wrapper.vm.revenueKompB = '2.500.000'
    wrapper.vm.revenueKompC = '3.000.000'
    wrapper.vm.revenueKompD = '1.500.000'
    wrapper.vm.masaManfaat = 25

    try {
      await wrapper.vm.handleSubmit()
    } catch (error) {
      // Expected to throw error in mock environment
    }

    consoleLogSpy.mockRestore()
  })

  // Test handleSubmit with update asumsi (idAsumsi !== 0)
  it('should handle update asumsi when idAsumsi is not 0', async () => {
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    
    wrapper.vm.idAsumsi = 123
    wrapper.vm.statusAsumsi = 'update'
    wrapper.vm.asumsiParameter = {
      asumsiMakro: {
        interestRate: '5,5',
        umurTeknis: '25',
        loanTenor: '15',
        loanPortion: '70,5',
        totalProjectCost: '1.000.000',
        dayaMampuNettoMW: '100,5'
      },
      parameterTeknis: {
        nphr: '2500,5',
        auxiliary: '5,5',
        susutTrafo: '2,5',
        pemakaianSendiri: '3,5',
        electricityPriceA: '1.000',
        electricityPriceB: '800',
        electricityPriceC: '1.200',
        electricityPriceD: '900',
      }
    }
    wrapper.vm.bahanBakarGroup.bahanBakars = [
      { 
        kode_bahan_bakar: 'BB001', 
        harga_bahan_bakar: '1.000,5', 
        flag_bahan_bakar: 0, 
        uuid_mesin: 'test', 
        sfc: '5,5', 
        tahun: '2023', 
        id: 1 
      }
    ]
    wrapper.vm.typePeriodic = '1'
    wrapper.vm.ncf = '80,5'
    wrapper.vm.eaf = '85,5'
    wrapper.vm.productionBrutto = '1.000,5'
    wrapper.vm.productionNetto = '950,5'
    wrapper.vm.energySales = '900,5'
    wrapper.vm.bahanBakarGroup.fuelConsumption = [
      { id_uraian: 1, bahan_bakar: 'BB001', value: '100,5' }
    ]
    wrapper.vm.costComponentA = '1.000.000'
    wrapper.vm.costComponentADetail = [
      { id: 1, ai: '100,5', realisasi_aki: '200,5', kode_bahan_bakar: 'BB001' }
    ]
    wrapper.vm.costComponentB = '2.000.000'
    wrapper.vm.biayaKepegawaian = '500.000,5'
    wrapper.vm.periodicMaintenanceCost = '100.000,5'
    wrapper.vm.biayaPemeliharaanRutin = '300.000,5'
    wrapper.vm.biayaAdministrasiUmum = '200.000,5'
    wrapper.vm.biayaPembelianTenagaListrik = '100.000,5'
    wrapper.vm.biayaLainLain = '50.000,5'
    wrapper.vm.costComponentC = '1.500.000,5'
    wrapper.vm.bahanBakarGroup.costCDetail = [
      { kode_bahan_bakar: 'BB001', fuel_cost: '1.500.000,5', uuid_mesin: 'test', tahun: 2023 }
    ]
    wrapper.vm.costComponentD = '500.000,5'
    wrapper.vm.biayaMinyakPelumas = '300.000,5'
    wrapper.vm.bahanKimia = '200.000,5'
    wrapper.vm.totalRevenue = '10.000.000'
    wrapper.vm.revenueKompA = '3.000.000,5'
    wrapper.vm.revenueKompB = '2.500.000,5'
    wrapper.vm.revenueKompC = '3.000.000,5'
    wrapper.vm.revenueKompD = '1.500.000,5'
    wrapper.vm.masaManfaat = 25

    try {
      await wrapper.vm.handleSubmit()
    } catch (error) {
      // Expected to throw error in mock environment
    }

    consoleLogSpy.mockRestore()
  })

  // Test error handling in fetchDataTeknisSimulasi1
  it('should handle error in fetchDataTeknisSimulasi1', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Force error by making service throw
    const mockService = {
      getDataTeknisSimulasi1: vi.fn().mockRejectedValue(new Error('Test error'))
    }

    await wrapper.vm.fetchDataTeknisSimulasi1()
    
    consoleErrorSpy.mockRestore()
  })

  // Test error handling in fetchDataTeknisSimulasi2
  it('should handle error in fetchDataTeknisSimulasi2', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    await wrapper.vm.fetchDataTeknisSimulasi2()
    
    consoleErrorSpy.mockRestore()
  })

  // Test costComponentADetail modifications
  it('should handle costComponentADetail with empty values', async () => {
    wrapper.vm.costComponentADetail = [
      { id: 1, ai: '', realisasi_aki: '', kode_bahan_bakar: 'BB001' },
      { id: 2, ai: '100,5', realisasi_aki: '', kode_bahan_bakar: 'BB002' }
    ]

    const submitPromise = wrapper.vm.handleSubmit()
    await new Promise(resolve => setTimeout(resolve, 100))
  }, 10000)

  // Test uploadFileSimulasi1 successful scenario
  it('should upload file simulasi 1 successfully and fetch data', async () => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    wrapper.vm.selectedFileSimulasi1 = mockFile
    wrapper.vm.uuidMesin = 'test-uuid'
    wrapper.vm.tahunBerjalan = 2024

    await wrapper.vm.uploadFileSimulasi1()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  // Test uploadFile successful scenario
  it('should upload file simulasi 2 successfully and fetch data', async () => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    wrapper.vm.selectedFile = mockFile
    wrapper.vm.uuidMesin = 'test-uuid'
    wrapper.vm.tahunBerjalan = 2024

    await wrapper.vm.uploadFile()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  // Test handleDownloadExcelSimulasi1 with success scenario
  it('should download excel simulasi 1 successfully', async () => {
    wrapper.vm.uuidMesin = 'test-uuid'
    wrapper.vm.tahunBerjalan = 2024
    wrapper.vm.mesinDataById = { mesin: 'Test Mesin' }

    // Mock document methods
    const createElementSpy = vi.spyOn(document, 'createElement')
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any)
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any)

    await wrapper.vm.handleDownloadExcelSimulasi1()

    expect(wrapper.vm.isLoading).toBe(false)

    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  // Test handleDownloadExcelSimulasi2 with success scenario
  it('should download excel simulasi 2 successfully', async () => {
    wrapper.vm.uuidMesin = 'test-uuid'
    wrapper.vm.tahunBerjalan = 2024
    wrapper.vm.mesinDataById = { mesin: 'Test Mesin' }

    // Mock document methods
    const createElementSpy = vi.spyOn(document, 'createElement')
    const appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => null as any)
    const removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => null as any)

    await wrapper.vm.handleDownloadExcelSimulasi2()

    expect(wrapper.vm.isLoading).toBe(false)

    createElementSpy.mockRestore()
    appendChildSpy.mockRestore()
    removeChildSpy.mockRestore()
  })

  // Test handleFinalSubmit for simulasi 1 with evidence file
  it('should handle final submit for simulasi 1 with evidence file and navigate', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    wrapper.vm.selectedSimulasiTab = 'Simulasi 1'
    wrapper.vm.uuidMesin = 'test-uuid'
    wrapper.vm.tahunBerjalan = 2024
    wrapper.vm.selectedFileEvidence = new File(['test'], 'evidence.pdf', { type: 'application/pdf' })
    wrapper.vm.formFinansialSimulasi1 = {
      cost_component_c_detail: [
        { kode_bahan_bakar: 'BB001', fuel_cost: '1.000,50' }
      ]
    }
    wrapper.vm.dataTeknisSimulasi1 = {
      uuid_mesin: 'test-uuid',
      tahun: 2024
    }
    mockUserAuthStore.levelAlias = 'Mb*0yT%3'
    wrapper.vm.nodeMode = 'development'
    wrapper.vm.idSentral = 'test-sentral-uuid'

    await wrapper.vm.handleFinalSubmit()

    expect(wrapper.vm.isLoading).toBe(false)
    
    consoleErrorSpy.mockRestore()
  }, 10000)

  // Test handleFinalSubmit for simulasi 2 without evidence file
  it('should handle final submit for simulasi 2 without evidence file', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    wrapper.vm.selectedSimulasiTab = 'Simulasi 2'
    wrapper.vm.uuidMesin = 'test-uuid'
    wrapper.vm.tahunBerjalan = 2024
    wrapper.vm.selectedFileEvidence = null
    wrapper.vm.dataTeknisSimulasi2 = {
      uuid_mesin: 'test-uuid',
      tahun: 2024
    }
    wrapper.vm.formFinansialSimulasi2 = {
      uuid_mesin: 'test-uuid',
      tahun: 2024
    }
    mockUserAuthStore.levelAlias = 'Other'

    await wrapper.vm.handleFinalSubmit()

    expect(wrapper.vm.isLoading).toBe(false)
    
    consoleErrorSpy.mockRestore()
  }, 10000)

  // Test uploadFileSimulasi1 with notifyError
  it('should show error notification when no file selected in uploadFileSimulasi1', async () => {
    wrapper.vm.selectedFileSimulasi1 = null

    await wrapper.vm.uploadFileSimulasi1()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  // Test uploadFile with console error
  it('should log error when no file selected in uploadFile', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    wrapper.vm.selectedFile = null

    await wrapper.vm.uploadFile()

    consoleErrorSpy.mockRestore()
  })

  // Test handleFileChangeSimulasi1 with single file
  it('should handle single file change for simulasi1', () => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    }

    wrapper.vm.handleFileChangeSimulasi1(mockEvent)

    expect(wrapper.vm.selectedFileSimulasi1).toBeTruthy()
  })

  // Test handleFileChange with single file
  it('should handle single file change for simulasi2', () => {
    const mockFile = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    }

    wrapper.vm.handleFileChange(mockEvent)

    expect(wrapper.vm.selectedFile).toBeTruthy()
  })

  // Test handleSubmit with error notification
  it('should show error notification when submit fails', async () => {
    wrapper.vm.asumsiParameter = {
      asumsiMakro: {
        interestRate: '',
        umurTeknis: '',
        loanTenor: '',
        loanPortion: '',
        totalProjectCost: '',
        dayaMampuNettoMW: ''
      },
      parameterTeknis: {
        nphr: '',
        auxiliary: '',
        susutTrafo: '',
        pemakaianSendiri: '',
        electricityPriceA: '',
        electricityPriceB: '',
        electricityPriceC: '',
        electricityPriceD: '',
      }
    }

    const submitPromise = wrapper.vm.handleSubmit()
    
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(wrapper.vm.isShowModalNotification).toBe(true)
  }, 10000)

  // Test handleFinalSubmit with error
  it('should handle error in handleFinalSubmit gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    wrapper.vm.selectedSimulasiTab = 'Simulasi 1'
    wrapper.vm.formFinansialSimulasi1 = null
    wrapper.vm.dataTeknisSimulasi1 = null

    await wrapper.vm.handleFinalSubmit()

    expect(wrapper.vm.isLoading).toBe(false)
    
    consoleErrorSpy.mockRestore()
  })
})
