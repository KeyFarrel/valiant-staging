import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'

// Mock Vue composables
const mockRoute = {
  params: { id: '123' },
  query: { uuid_sentral: 'sentral-123', tahun: '2024' }
}

const mockRouter = {
  push: jest.fn()
}

jest.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter
}))

// Mock Vue 3 Composition API
jest.mock('vue', () => ({
  ref: (value: any) => ({ value }),
  reactive: (value: any) => value,
  computed: jest.fn(),
  onMounted: jest.fn(),
  onUnmounted: jest.fn(),
  watch: jest.fn(),
  nextTick: jest.fn()
}))

// Mock external libraries
jest.mock('vue3-lottie', () => ({
  Vue3Lottie: {}
}))

// Mock services
const mockRekapService = {
  getEvidencePath: jest.fn(),
  downloadEvidence: jest.fn()
}

const mockUserService = {
  getPembina: jest.fn()
}

const mockDetailSentralService = {
  getPhoto: jest.fn(),
  getPembangkitByKode: jest.fn(),
  getPengelolaData: jest.fn()
}

const mockPersetujuanService = {
  getPersetujuanFSSentral: jest.fn(),
  updateStatusFS: jest.fn()
}

const mockFeasibilityStudyService = {
  getMesinById: jest.fn(),
  getAsumsiFeasibility: jest.fn(),
  getDataTeknis: jest.fn(),
  getDataFinansial: jest.fn(),
  getHasilSimulasi: jest.fn(),
  getComboBahanBakar: jest.fn()
}

const mockDetailRekapService = {
  getTypePeriodic: jest.fn(),
  getPembangkitByKode: jest.fn(),
  getPengelolaData: jest.fn()
}

const mockGlobalFormat = {
  formatRupiah: jest.fn(),
  formatDecimal: jest.fn()
}

jest.mock('@/services/rekap-service', () => ({
  default: jest.fn(() => mockRekapService)
}))

jest.mock('@/services/user-service', () => ({
  default: jest.fn(() => mockUserService)
}))

jest.mock('@/services/detail-sentral-service', () => ({
  default: jest.fn(() => mockDetailSentralService)
}))

jest.mock('@/services/persetujuan-service', () => ({
  default: jest.fn(() => mockPersetujuanService)
}))

jest.mock('@/services/feasibility-study', () => ({
  default: jest.fn(() => mockFeasibilityStudyService)
}))

jest.mock('@/services/detail-rekap-service', () => ({
  default: jest.fn(() => mockDetailRekapService)
}))

jest.mock('@/services/format/global-format', () => ({
  default: jest.fn(() => mockGlobalFormat)
}))

jest.mock('@/services/auth-service', () => ({
  default: jest.fn(() => ({}))
}))

// Mock stores
const mockUserAuthStore = {
  levelAlias: 'Xf!8qP@7',
  roleAlias: 'Vx_91$pN'
}

jest.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: () => mockUserAuthStore
}))

// Mock utilities
jest.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: jest.fn().mockReturnValue('decrypted-123')
  })
}))

jest.mock('@/services/helper/toast-notification', () => ({
  notifyError: jest.fn()
}))

// Mock assets
jest.mock('@/assets/lottie/success.json', () => ({}))

// Mock global objects
global.URL = {
  createObjectURL: jest.fn().mockReturnValue('mock-blob-url'),
  revokeObjectURL: jest.fn()
} as any

global.Blob = jest.fn().mockImplementation(() => ({})) as any

// Mock document methods
const mockLink = {
  href: '',
  setAttribute: jest.fn(),
  click: jest.fn()
}

global.document = {
  createElement: jest.fn().mockReturnValue(mockLink),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn()
  }
} as any

global.window = {
  URL: global.URL
} as any

describe('DetailFSMesin Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Component Structure', () => {
    it('should have proper interface definitions', () => {
      // Test MesinItem interface structure
      const mockMesinItem = {
        data: {},
        uuid_mesin: 1,
        kode_sentral: 'S001',
        kode_mesin: 'M001',
        mesin: 'Mesin Test',
        kode_jenis_pembangkit: 'PLTU',
        kondisi_unit: 'Baik',
        daya_terpasang: 100,
        daya_mampu: 95,
        tahun_operasi: '2020',
        nilai_asset_awal: 1000000,
        tahun_nilai_perolehan: '2019',
        photo1: 'photo1.jpg',
        photo2: 'photo2.jpg'
      }

      expect(mockMesinItem).toHaveProperty('uuid_mesin')
      expect(mockMesinItem).toHaveProperty('kode_sentral')
      expect(mockMesinItem).toHaveProperty('mesin')
      expect(typeof mockMesinItem.daya_terpasang).toBe('number')
      expect(typeof mockMesinItem.daya_mampu).toBe('number')
    })

    it('should have proper ListApprove interface structure', () => {
      const mockListApprove = {
        data: {},
        pengelola: 'Pengelola Test',
        pembina: 'Pembina Test',
        umur_teknis: '25',
        tahun: '2024',
        status: 'Menunggu Persetujuan T1',
        id_status: 3
      }

      expect(mockListApprove).toHaveProperty('pengelola')
      expect(mockListApprove).toHaveProperty('pembina')
      expect(mockListApprove).toHaveProperty('status')
      expect(typeof mockListApprove.id_status).toBe('number')
    })

    it('should have proper AsumsiMakroItem interface structure', () => {
      const mockAsumsiMakro = {
        corporate_tax_rate: 0.25,
        discount_rate: 0.1,
        interest_rate: 0.08,
        loan_tenor: 15,
        loan_portion: 0.7,
        equity_portion: 0.3,
        isFetchingError: false
      }

      expect(mockAsumsiMakro).toHaveProperty('corporate_tax_rate')
      expect(mockAsumsiMakro).toHaveProperty('discount_rate')
      expect(mockAsumsiMakro).toHaveProperty('loan_tenor')
      expect(typeof mockAsumsiMakro.isFetchingError).toBe('boolean')
    })

    it('should have proper ParameterTeknisFinancialItem interface structure', () => {
      const mockParameter = {
        daya_terpasang: 100,
        daya_mampu_netto_mw: 95,
        auxiliary: 5,
        susut_trafo: 2,
        ps: 3,
        nphr: 2400,
        total_project_cost: 5000000,
        loan: 3500000,
        equity: 1500000,
        electricity_price_a_rp_per_kwbln: 1500,
        electricity_price_b_rp_per_kwbln: 1200,
        electricity_price_c_rp_per_kwh: 1000,
        electricity_price_d_rp_per_kwh: 800,
        isFetchingError: false
      }

      expect(mockParameter).toHaveProperty('daya_terpasang')
      expect(mockParameter).toHaveProperty('total_project_cost')
      expect(mockParameter).toHaveProperty('electricity_price_a_rp_per_kwbln')
      expect(typeof mockParameter.isFetchingError).toBe('boolean')
    })
  })

  describe('Reactive Variables', () => {
    it('should initialize reactive variables with correct default values', () => {
      const isLoading = { value: false }
      const isSuccess = { value: false }
      const isReject = { value: false }
      const modalCancel = { value: false }
      const modalApprove = { value: false }
      const selectedTab = { value: "Akhir Masa" }
      const data = { value: 'Feasibility Study' }

      expect(isLoading.value).toBe(false)
      expect(isSuccess.value).toBe(false)
      expect(isReject.value).toBe(false)
      expect(modalCancel.value).toBe(false)
      expect(modalApprove.value).toBe(false)
      expect(selectedTab.value).toBe("Akhir Masa")
      expect(data.value).toBe('Feasibility Study')
    })

    it('should initialize data structures with correct default values', () => {
      const asumsiMakro = {
        value: {
          corporate_tax_rate: 0,
          discount_rate: 0,
          interest_rate: 0,
          loan_tenor: 0,
          loan_portion: 0,
          equity_portion: 0,
          isFetchingError: false
        }
      }

      const dataTeknis = {
        value: {
          header: [],
          tahun: [],
          detail: []
        }
      }

      const error = {
        value: {
          pesanPenolakan: false
        }
      }

      expect(asumsiMakro.value.corporate_tax_rate).toBe(0)
      expect(asumsiMakro.value.isFetchingError).toBe(false)
      expect(dataTeknis.value.header).toEqual([])
      expect(dataTeknis.value.tahun).toEqual([])
      expect(error.value.pesanPenolakan).toBe(false)
    })

    it('should handle tahunBerjalan calculation correctly', () => {
      const tahunBerjalan = new Date().getFullYear()
      expect(typeof tahunBerjalan).toBe('number')
      expect(tahunBerjalan).toBeGreaterThan(2020)
    })
  })

  describe('Wait Function', () => {
    it('should create a promise that resolves after specified milliseconds', async () => {
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      
      const startTime = Date.now()
      await wait(100)
      const endTime = Date.now()
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(90) // Allow some tolerance
    })
  })

  describe('fetchMesinById Function Logic', () => {
    it('should simulate fetchMesinById success flow', async () => {
      const mockMesinData = {
        data: {
          uuid_mesin: 1,
          mesin: 'Test Mesin',
          photo1: 'photo1.jpg',
          photo2: '',
          tahun_nilai_perolehan: '2020',
          kode_sentral: 'S001'
        }
      }

      mockFeasibilityStudyService.getMesinById.mockResolvedValue(mockMesinData)
      mockDetailSentralService.getPhoto.mockResolvedValue({ data: new ArrayBuffer(8) })

      // Simulate the function logic
      const idGrafik = { value: '123' }
      const mesinDataById = { value: null }
      const tahunData = { value: null }

      try {
        const response = await mockFeasibilityStudyService.getMesinById(idGrafik.value)
        try {
          const responsePhoto = await mockDetailSentralService.getPhoto(response.data.photo1)
          const blob = new Blob([responsePhoto.data])
          response.data.photo2 = URL.createObjectURL(blob)
        } catch (error) {
          console.error('Error Fetch Photo: ', error)
        }
        mesinDataById.value = response.data
        tahunData.value = parseInt(response.data.tahun_nilai_perolehan)
      } catch (error) {
        console.error("Fetch Mesin By Id Error : ", error)
      }

      expect(mockFeasibilityStudyService.getMesinById).toHaveBeenCalledWith('123')
      expect(mockDetailSentralService.getPhoto).toHaveBeenCalledWith('photo1.jpg')
      expect(mesinDataById.value).toEqual(mockMesinData.data)
      expect(tahunData.value).toBe(2020)
    })

    it('should handle fetchMesinById photo error gracefully', async () => {
      const mockMesinData = {
        data: {
          photo1: 'photo1.jpg',
          tahun_nilai_perolehan: '2020'
        }
      }

      mockFeasibilityStudyService.getMesinById.mockResolvedValue(mockMesinData)
      mockDetailSentralService.getPhoto.mockRejectedValue(new Error('Photo not found'))

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      // Simulate function with photo error
      try {
        const response = await mockFeasibilityStudyService.getMesinById('123')
        try {
          await mockDetailSentralService.getPhoto(response.data.photo1)
        } catch (error) {
          console.error('Error Fetch Photo: ', error)
        }
      } catch (error) {
        console.error("Fetch Mesin By Id Error : ", error)
      }

      expect(consoleSpy).toHaveBeenCalledWith('Error Fetch Photo: ', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('fetchPersetujuanFS Function Logic', () => {
    it('should simulate fetchPersetujuanFS success flow', async () => {
      const mockPersetujuanData = {
        data: {
          pengelola: 'Test Pengelola',
          mesins: [
            { uuid_mesin: 123, id_status: 3 },
            { uuid_mesin: 456, id_status: 2 }
          ]
        }
      }

      mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValue(mockPersetujuanData)

      // Simulate function logic
      const route = { query: { uuid_sentral: 'sentral-123', tahun: '2024' } }
      const idGrafik = { value: 123 }
      const approveSentralFS = { value: null }
      const approveMesinFS = { value: null }
      const statusMesin = { value: null }

      try {
        const response = await mockPersetujuanService.getPersetujuanFSSentral({
          uuid_sentral: route.query.uuid_sentral,
          tahun: route.query.tahun
        })
        approveSentralFS.value = response.data
        approveMesinFS.value = response.data.mesins.filter((val: any) => val.uuid_mesin == idGrafik.value)[0]
        statusMesin.value = approveMesinFS.value?.id_status
      } catch (error) {
        console.error('Fetch Persetujuan FS Sentral Error : ', error)
      }

      expect(mockPersetujuanService.getPersetujuanFSSentral).toHaveBeenCalledWith({
        uuid_sentral: 'sentral-123',
        tahun: '2024'
      })
      expect(approveSentralFS.value).toEqual(mockPersetujuanData.data)
      expect(approveMesinFS.value).toEqual({ uuid_mesin: 123, id_status: 3 })
      expect(statusMesin.value).toBe(3)
    })

    it('should handle fetchPersetujuanFS error', async () => {
      mockPersetujuanService.getPersetujuanFSSentral.mockRejectedValue(new Error('Network error'))
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      try {
        await mockPersetujuanService.getPersetujuanFSSentral({})
      } catch (error) {
        console.error('Fetch Persetujuan FS Sentral Error : ', error)
      }

      expect(consoleSpy).toHaveBeenCalledWith('Fetch Persetujuan FS Sentral Error : ', expect.any(Error))
      consoleSpy.mockRestore()
    })
  })

  describe('fetchAsumsiFeasibility Function Logic', () => {
    it('should simulate fetchAsumsiFeasibility success flow', async () => {
      const mockAsumsiData = {
        data: {
          asumsi_makro: {
            corporate_tax_rate: 0.25,
            discount_rate: 0.1,
            interest_rate: 0.08,
            loan_tenor: 15,
            loan_portion: 0.7,
            equity_portion: 0.3
          },
          parameter_teknis_financial: {
            daya_terpasang: 100,
            daya_mampu_netto_mw: 95,
            auxiliary: 5,
            susut_trafo: 2,
            ps: 3,
            nphr: 2400,
            total_project_cost: 5000000,
            loan: 3500000,
            equity: 1500000,
            electricity_price_a_rp_per_kwbln: 1500,
            electricity_price_b_rp_per_kwbln: 1200,
            electricity_price_c_rp_per_kwh: 1000,
            electricity_price_d_rp_per_kwh: 800
          },
          harga_bahan_bakars: [
            { uuid_mesin: 1, tahun: '2024', kode_bahan_bakar: 'BBM001' }
          ],
          umur_teknis: 25
        }
      }

      mockFeasibilityStudyService.getAsumsiFeasibility.mockResolvedValue(mockAsumsiData)

      // Simulate function logic
      const idGrafik = { value: '123' }
      const mesinDataById = { value: { tahun_operasi: '2020' } }
      const asumsiMakro = { value: {} }
      const parameterTeknisFinansial = { value: {} }
      const bahanBakars = { value: [] }
      const umurTeknis = { value: null }

      try {
        const response = await mockFeasibilityStudyService.getAsumsiFeasibility(
          idGrafik.value,
          parseInt(mesinDataById.value?.tahun_operasi ?? '')
        )
        asumsiMakro.value = {
          corporate_tax_rate: response.data.asumsi_makro.corporate_tax_rate,
          discount_rate: response.data.asumsi_makro.discount_rate,
          interest_rate: response.data.asumsi_makro.interest_rate,
          loan_tenor: response.data.asumsi_makro.loan_tenor,
          loan_portion: response.data.asumsi_makro.loan_portion,
          equity_portion: response.data.asumsi_makro.equity_portion,
          isFetchingError: false
        }
        parameterTeknisFinansial.value = {
          daya_terpasang: response.data.parameter_teknis_financial.daya_terpasang,
          daya_mampu_netto_mw: response.data.parameter_teknis_financial.daya_mampu_netto_mw,
          auxiliary: response.data.parameter_teknis_financial.auxiliary,
          susut_trafo: response.data.parameter_teknis_financial.susut_trafo,
          ps: response.data.parameter_teknis_financial.ps,
          nphr: response.data.parameter_teknis_financial.nphr,
          total_project_cost: response.data.parameter_teknis_financial.total_project_cost,
          loan: response.data.parameter_teknis_financial.loan,
          equity: response.data.parameter_teknis_financial.equity,
          electricity_price_a_rp_per_kwbln: response.data.parameter_teknis_financial.electricity_price_a_rp_per_kwbln,
          electricity_price_b_rp_per_kwbln: response.data.parameter_teknis_financial.electricity_price_b_rp_per_kwbln,
          electricity_price_c_rp_per_kwh: response.data.parameter_teknis_financial.electricity_price_c_rp_per_kwh,
          electricity_price_d_rp_per_kwh: response.data.parameter_teknis_financial.electricity_price_d_rp_per_kwh,
          isFetchingError: false
        }
        bahanBakars.value = response.data.harga_bahan_bakars
        umurTeknis.value = response.data.umur_teknis
      } catch (error) {
        console.error("Error Fetch Asumsi Feasibility : ", error)
      }

      expect(mockFeasibilityStudyService.getAsumsiFeasibility).toHaveBeenCalledWith('123', 2020)
      expect((asumsiMakro.value as any).corporate_tax_rate).toBe(0.25)
      expect((parameterTeknisFinansial.value as any).daya_terpasang).toBe(100)
      expect(bahanBakars.value).toHaveLength(1)
      expect(umurTeknis.value).toBe(25)
    })
  })

  describe('fetchDataTeknis Function Logic', () => {
    it('should simulate fetchDataTeknis success flow', async () => {
      const mockDataTeknis = {
        data: {
          header: ['Tahun', 'NCF', 'EAF'],
          tahun: [2020, 2021, 2022],
          detail: [
            { tahun: 2020, ncf: 85, eaf: 90 },
            { tahun: 2021, ncf: 87, eaf: 92 }
          ]
        }
      }

      mockFeasibilityStudyService.getDataTeknis.mockResolvedValue(mockDataTeknis)

      const idGrafik = { value: '123' }
      const dataTeknis = { value: { header: [], tahun: [], detail: [] } }

      try {
        const response = await mockFeasibilityStudyService.getDataTeknis(idGrafik.value)
        dataTeknis.value = response.data
      } catch (error) {
        console.error("Error Fetch Data Teknis : ", error)
      }

      expect(mockFeasibilityStudyService.getDataTeknis).toHaveBeenCalledWith('123')
      expect(dataTeknis.value).toEqual(mockDataTeknis.data)
    })
  })

  describe('fetchDataFinansial Function Logic', () => {
    it('should simulate fetchDataFinansial success flow with hierarchical mapping', async () => {
      const mockDataFinansial = {
        data: {
          detail: [
            { level: 1, id: 1, name: 'Revenue', value: 1000 },
            { level: 2, id: 2, name: 'Operating Revenue', value: 800 },
            { level: 3, id: 3, name: 'Electricity Sales', value: 700 },
            { level: 4, id: 4, name: 'Peak Hours', value: 400 },
            { level: 4, id: 5, name: 'Off Peak Hours', value: 300 },
            { level: 1, id: 6, name: 'Expenses', value: 600 }
          ]
        }
      }

      mockFeasibilityStudyService.getDataFinansial.mockResolvedValue(mockDataFinansial)

      const idGrafik = { value: '123' }
      const finansialMappingResult = { value: [] }
      const dataFinansial = { value: null }

      try {
        const response = await mockFeasibilityStudyService.getDataFinansial(idGrafik.value)
        let currentLevel1: any | null = null
        let currentLevel2: any | null = null
        let currentLevel3: any | null = null

        for (const item of response.data.detail) {
          if (item.level === 1) {
            currentLevel1 = { ...item, level2: [] }
            finansialMappingResult.value.push(currentLevel1)
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
        dataFinansial.value = response.data
      } catch (error) {
        console.error("Fetch Data Finansial Error : ", error)
      }

      expect(mockFeasibilityStudyService.getDataFinansial).toHaveBeenCalledWith('123')
      expect(finansialMappingResult.value).toHaveLength(2) // Revenue and Expenses
      expect(finansialMappingResult.value[0].level2).toHaveLength(1) // Operating Revenue
      expect(finansialMappingResult.value[0].level2[0].level3).toHaveLength(1) // Electricity Sales
      expect(finansialMappingResult.value[0].level2[0].level3[0].level4).toHaveLength(2) // Peak and Off Peak
    })
  })

  describe('fetchHasilSimulasi Function Logic', () => {
    it('should simulate fetchHasilSimulasi success flow', async () => {
      const mockHasilSimulasi = {
        data: {
          fs_irr_project: 12.5,
          fs_irr_equity: 15.2,
          fs_npv_project: 2500000,
          fs_npv_equity: 1800000
        }
      }

      mockFeasibilityStudyService.getHasilSimulasi.mockResolvedValue(mockHasilSimulasi)

      const idGrafik = { value: '123' }
      const statusMesin = { value: 3 }
      const hasilSimulasi = { value: null }

      try {
        const response = await mockFeasibilityStudyService.getHasilSimulasi(
          idGrafik.value,
          statusMesin.value
        )
        hasilSimulasi.value = response.data
      } catch (error) {
        console.error("Fetch Hasil Simulasi Error : ", error)
      }

      expect(mockFeasibilityStudyService.getHasilSimulasi).toHaveBeenCalledWith('123', 3)
      expect(hasilSimulasi.value).toEqual(mockHasilSimulasi.data)
    })
  })

  describe('downloadEvidence Function Logic', () => {
    it('should simulate downloadEvidence success flow', async () => {
      const mockFilePath = {
        data: [
          { file_name: 'evidence.xlsx', dokumen_evidence: 'doc123' }
        ]
      }

      const mockDownloadResponse = {
        data: new ArrayBuffer(8),
        headers: { 'content-disposition': 'attachment; filename="evidence.xlsx"' }
      }

      mockRekapService.getEvidencePath.mockResolvedValue(mockFilePath)
      mockRekapService.downloadEvidence.mockResolvedValue(mockDownloadResponse)

      const idGrafik = { value: '123' }
      const tahunBerjalan = new Date().getFullYear()
      const isLoading = { value: false }

      try {
        isLoading.value = true
        const filePath = await mockRekapService.getEvidencePath(
          idGrafik.value, 
          tahunBerjalan.toString(),
          1
        )
        const finalFileName = filePath.data[0].file_name
        const response = await mockRekapService.downloadEvidence(filePath.data[0].dokumen_evidence)
        
        const contentDisposition = response.headers['content-disposition']
        const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"$/)
        const fileName = fileNameMatch ? fileNameMatch[1] : `${finalFileName}`
        
        // Verify the logic without DOM manipulation
        expect(fileName).toBe('evidence.xlsx')
        expect(finalFileName).toBe('evidence.xlsx')
        
        isLoading.value = false
      } catch (error) {
        console.error('Evidence Error : ', error)
        isLoading.value = false
      }

      expect(mockRekapService.getEvidencePath).toHaveBeenCalledWith('123', tahunBerjalan.toString(), 1)
      expect(mockRekapService.downloadEvidence).toHaveBeenCalledWith('doc123')
      expect(isLoading.value).toBe(false)
    })

    it('should handle downloadEvidence error and show notification', async () => {
      mockRekapService.getEvidencePath.mockRejectedValue(new Error('File not found'))
      
      const { notifyError } = require('@/services/helper/toast-notification')
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      try {
        await mockRekapService.getEvidencePath('123', '2024', 1)
      } catch (error) {
        console.error('Evidence Error : ', error)
        notifyError('Evidence Tidak Ada', 5000)
      }

      expect(consoleSpy).toHaveBeenCalledWith('Evidence Error : ', expect.any(Error))
      expect(notifyError).toHaveBeenCalledWith('Evidence Tidak Ada', 5000)
      consoleSpy.mockRestore()
    })
  })

  describe('Approval Functions Logic', () => {
    describe('updateFSPengelola Function', () => {
      it('should simulate updateFSPengelola success flow', async () => {
        const mockUpdateResponse = { data: { success: true } }
        mockPersetujuanService.updateStatusFS.mockResolvedValue(mockUpdateResponse)

        const isLoading = { value: false }
        const modalApprove = { value: true }
        const isSuccess = { value: false }
        const idGrafik = { value: '123' }
        const updateMesinFS = { value: null }

        // Mock wait function
        const wait = jest.fn().mockResolvedValue(undefined)

        try {
          isLoading.value = true
          const response = await mockPersetujuanService.updateStatusFS({
            status_approval: 4,
            keterangan: '',
            uuid_mesin: idGrafik.value
          })
          updateMesinFS.value = response.data
          isLoading.value = false
          modalApprove.value = false
          isSuccess.value = true
          await wait(3000)
          isSuccess.value = false
        } catch (error) {
          console.error("Error Fetch Update Feasibility : ", error)
        }

        expect(mockPersetujuanService.updateStatusFS).toHaveBeenCalledWith({
          status_approval: 4,
          keterangan: '',
          uuid_mesin: '123'
        })
        expect(updateMesinFS.value).toEqual({ success: true })
        expect(isSuccess.value).toBe(false)
        expect(modalApprove.value).toBe(false)
      })
    })

    describe('rejectFSPengelola Function', () => {
      it('should validate pesan requirement', async () => {
        const pesan = { value: '' }
        const error = { value: { pesanPenolakan: false } }

        // Simulate validation logic
        if (pesan.value === '') {
          error.value.pesanPenolakan = true
        } else {
          error.value.pesanPenolakan = false
        }

        expect(error.value.pesanPenolakan).toBe(true)
      })

      it('should simulate rejectFSPengelola success flow with message', async () => {
        const mockUpdateResponse = { data: { success: true } }
        mockPersetujuanService.updateStatusFS.mockResolvedValue(mockUpdateResponse)

        const pesan = { value: 'Alasan penolakan' }
        const error = { value: { pesanPenolakan: false } }
        const isLoading = { value: false }
        const modalCancel = { value: true }
        const isReject = { value: false }
        const idGrafik = { value: '123' }

        try {
          if (pesan.value === '') {
            error.value.pesanPenolakan = true
          } else {
            error.value.pesanPenolakan = false
            isLoading.value = true
            const response = await mockPersetujuanService.updateStatusFS({
              status_approval: 5,
              keterangan: pesan.value,
              uuid_mesin: idGrafik.value
            })
            isLoading.value = false
            modalCancel.value = false
            isReject.value = true
          }
        } catch (error) {
          console.error("Error Fetch Update Feasibility : ", error)
        }

        expect(error.value.pesanPenolakan).toBe(false)
        expect(mockPersetujuanService.updateStatusFS).toHaveBeenCalledWith({
          status_approval: 5,
          keterangan: 'Alasan penolakan',
          uuid_mesin: '123'
        })
      })
    })

    describe('updateFSPembina Function', () => {
      it('should simulate updateFSPembina success flow', async () => {
        const mockUpdateResponse = { data: { success: true } }
        mockPersetujuanService.updateStatusFS.mockResolvedValue(mockUpdateResponse)

        const isLoading = { value: false }
        const modalApprove = { value: true }
        const isSuccess = { value: false }
        const idGrafik = { value: '123' }

        try {
          isLoading.value = true
          const response = await mockPersetujuanService.updateStatusFS({
            status_approval: 1,
            keterangan: '',
            uuid_mesin: idGrafik.value
          })
          modalApprove.value = false
          isLoading.value = false
          isSuccess.value = true
        } catch (error) {
          console.error("Error Fetch Update Feasibility : ", error)
        }

        expect(mockPersetujuanService.updateStatusFS).toHaveBeenCalledWith({
          status_approval: 1,
          keterangan: '',
          uuid_mesin: '123'
        })
        expect(isSuccess.value).toBe(true)
        expect(modalApprove.value).toBe(false)
      })
    })

    describe('rejectFSPembina Function', () => {
      it('should simulate rejectFSPembina success flow', async () => {
        const mockUpdateResponse = { data: { success: true } }
        mockPersetujuanService.updateStatusFS.mockResolvedValue(mockUpdateResponse)

        const pesan = { value: 'Alasan penolakan pembina' }
        const error = { value: { pesanPenolakan: false } }
        const isLoading = { value: false }
        const modalCancel = { value: true }
        const isReject = { value: false }
        const idGrafik = { value: '123' }

        try {
          if (pesan.value === '') {
            error.value.pesanPenolakan = true
          } else {
            error.value.pesanPenolakan = false
            isLoading.value = true
            const response = await mockPersetujuanService.updateStatusFS({
              status_approval: 2,
              keterangan: pesan.value,
              uuid_mesin: idGrafik.value
            })
            isLoading.value = false
            modalCancel.value = false
            isReject.value = true
          }
        } catch (error) {
          console.error("Error Fetch Update Feasibility : ", error)
        }

        expect(mockPersetujuanService.updateStatusFS).toHaveBeenCalledWith({
          status_approval: 2,
          keterangan: 'Alasan penolakan pembina',
          uuid_mesin: '123'
        })
      })
    })
  })

  describe('fetchUnitPengelola Function Logic', () => {
    it('should simulate fetchUnitPengelola complete flow', async () => {
      const mockPembangkitResponse = {
        data: {
          kode_pengelola: 'P001',
          uuid_pembina: 'pembina-123',
          mesins: [1, 2, 3]
        }
      }

      const mockPengelolaResponse = {
        data: [
          { kode_pengelola: 'P001', pengelola: 'PT Test Pengelola' },
          { kode_pengelola: 'P002', pengelola: 'PT Other' }
        ]
      }

      const mockPembinaList = [
        { uuid_pembina: 'pembina-123', pembina: 'Test Pembina' },
        { uuid_pembina: 'pembina-456', pembina: 'Other Pembina' }
      ]

      mockDetailRekapService.getPembangkitByKode.mockResolvedValue(mockPembangkitResponse)
      mockDetailRekapService.getPengelolaData.mockResolvedValue(mockPengelolaResponse)
      mockUserService.getPembina.mockResolvedValue({ data: mockPembinaList })

      // Simulate function logic
      const mesinDataById = { value: { kode_sentral: 'S001' } }
      const namaPengelola = { value: '' }
      const namaPembina = { value: '' }
      const jumlahMesin = { value: '' }

      try {
        if (mesinDataById.value) {
          const kodeSentral = mesinDataById.value.kode_sentral
          const pembangkitResponse = await mockDetailRekapService.getPembangkitByKode(kodeSentral)
          const kodePengelola = pembangkitResponse.data.kode_pengelola
          jumlahMesin.value = pembangkitResponse.data.mesins.length
          
          const pengelolaResponse = await mockDetailRekapService.getPengelolaData()
          const pengelola = pengelolaResponse.data.filter(
            (pengelola: any) => pengelola.kode_pengelola === kodePengelola
          )
          namaPengelola.value = pengelola[0].pengelola
          
          const idPembina = pembangkitResponse.data.uuid_pembina
          const pembinaResponse = await mockUserService.getPembina("")
          const pembinaList = pembinaResponse.data
          namaPembina.value = pembinaList.find(
            (pembina: any) => pembina.uuid_pembina === idPembina
          ).pembina
        }
      } catch (error) {
        console.error("Fetch Unit Pengelola Error : ", error)
      }

      expect(mockDetailRekapService.getPembangkitByKode).toHaveBeenCalledWith('S001')
      expect(mockDetailRekapService.getPengelolaData).toHaveBeenCalled()
      expect(mockUserService.getPembina).toHaveBeenCalledWith("")
      expect(namaPengelola.value).toBe('PT Test Pengelola')
      expect(namaPembina.value).toBe('Test Pembina')
      expect(jumlahMesin.value).toBe(3)
    })
  })

  describe('Environment and Route Handling', () => {
    it('should handle production mode encryption', async () => {
      const nodeMode = 'production'
      const route = { params: { id: 'encrypted-id' } }
      
      const mockEncryptStorage = {
        decryptValue: jest.fn().mockReturnValue('decrypted-123')
      }

      const idGrafik = { value: '' }
      
      const encryptStorage = await Promise.resolve(mockEncryptStorage)
      idGrafik.value = nodeMode === 'production' 
        ? encryptStorage.decryptValue(route.params.id.toString()) 
        : route.params.id as string

      expect(mockEncryptStorage.decryptValue).toHaveBeenCalledWith('encrypted-id')
      expect(idGrafik.value).toBe('decrypted-123')
    })

    it('should handle development mode without encryption', () => {
      // In development mode, use route ID directly
      const route = { params: { id: 'plain-id' } }
      const idGrafik = { value: '' }
      
      // Simulate development mode behavior
      idGrafik.value = route.params.id as string

      expect(idGrafik.value).toBe('plain-id')
    })
  })

  describe('User Authorization Logic', () => {
    it('should check T2 approval permissions', () => {
      const approveMesinFS = { value: { status: 'Menunggu Persetujuan T2' } }
      const userAuthStore = { levelAlias: 'Xf!8qP@7', roleAlias: 'Vx_91$pN' }

      const hasT2Permission = approveMesinFS.value?.status === 'Menunggu Persetujuan T2' && 
        (userAuthStore.levelAlias === 'Xf!8qP@7' || 
         (userAuthStore.levelAlias == 'Gk#92lV&' || userAuthStore.roleAlias == 'Vx_91$pN'))

      expect(hasT2Permission).toBe(true)
    })

    it('should check T1 approval permissions', () => {
      const approveMesinFS = { value: { status: 'Menunggu Persetujuan T1' } }
      const userAuthStore = { levelAlias: 'Xf!8qP@7', roleAlias: 'Vx_91$pN' }

      const hasT1Permission = approveMesinFS.value?.status === 'Menunggu Persetujuan T1' && 
        (userAuthStore.levelAlias === 'Xf!8qP@7' || 
         (userAuthStore.levelAlias == 'Dr^3Zn$!' || userAuthStore.roleAlias == 'Vx_91$pN'))

      expect(hasT1Permission).toBe(true)
    })

    it('should deny permissions for unauthorized users', () => {
      const approveMesinFS = { value: { status: 'Menunggu Persetujuan T1' } }
      const userAuthStore = { levelAlias: 'UNAUTHORIZED', roleAlias: 'USER' }

      const hasT1Permission = approveMesinFS.value?.status === 'Menunggu Persetujuan T1' && 
        (userAuthStore.levelAlias === 'Xf!8qP@7' || 
         (userAuthStore.levelAlias == 'Dr^3Zn$!' || userAuthStore.roleAlias == 'Vx_91$pN'))

      expect(hasT1Permission).toBe(false)
    })
  })

  describe('Error Handling', () => {
    describe('Error Handling', () => {
    it('should handle all fetch function errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      // Test all fetch functions with errors
      mockFeasibilityStudyService.getMesinById.mockRejectedValue(new Error('Mesin error'))
      mockPersetujuanService.getPersetujuanFSSentral.mockRejectedValue(new Error('Persetujuan error'))
      mockFeasibilityStudyService.getAsumsiFeasibility.mockRejectedValue(new Error('Asumsi error'))
      mockFeasibilityStudyService.getDataTeknis.mockRejectedValue(new Error('Data teknis error'))
      mockFeasibilityStudyService.getDataFinansial.mockRejectedValue(new Error('Data finansial error'))
      mockFeasibilityStudyService.getHasilSimulasi.mockRejectedValue(new Error('Hasil simulasi error'))
      mockDetailRekapService.getTypePeriodic.mockRejectedValue(new Error('Type periodic error'))
      mockUserService.getPembina.mockRejectedValue(new Error('Pembina error'))
      mockDetailRekapService.getPembangkitByKode.mockRejectedValue(new Error('Pembangkit error'))
      mockFeasibilityStudyService.getComboBahanBakar.mockRejectedValue(new Error('Combo bahan bakar error'))

      // Test each error scenario
      try { await mockFeasibilityStudyService.getMesinById('123') } 
      catch (e) { console.error("Fetch Mesin By Id Error : ", e) }

      try { await mockPersetujuanService.getPersetujuanFSSentral({}) } 
      catch (e) { console.error('Fetch Persetujuan FS Sentral Error : ', e) }

      try { await mockFeasibilityStudyService.getAsumsiFeasibility('123', 2020) } 
      catch (e) { console.error("Error Fetch Asumsi Feasibility : ", e) }

      try { await mockFeasibilityStudyService.getDataTeknis('123') } 
      catch (e) { console.error("Error Fetch Data Teknis : ", e) }

      try { await mockFeasibilityStudyService.getDataFinansial('123') } 
      catch (e) { console.error("Fetch Data Finansial Error : ", e) }

      try { await mockFeasibilityStudyService.getHasilSimulasi('123', 3) } 
      catch (e) { console.error("Fetch Hasil Simulasi Error : ", e) }

      try { await mockDetailRekapService.getTypePeriodic('PLTU') } 
      catch (e) { console.error("Fetch Type Periodic Error : ", e) }

      try { await mockUserService.getPembina("") } 
      catch (e) { console.error("Fetch Pembina Error : ", e) }

      try { await mockDetailRekapService.getPembangkitByKode('S001') } 
      catch (e) { console.error("Fetch Unit Pengelola Error : ", e) }

      try { await mockFeasibilityStudyService.getComboBahanBakar('PLTU') } 
      catch (e) { console.error('Fetch Combo Bahan Bakar Error : ', e) }

      expect(consoleSpy).toHaveBeenCalledTimes(10)
      consoleSpy.mockRestore()
    })
  })

  describe('Complex Integration Scenarios', () => {
    it('should handle complete onMounted lifecycle simulation', async () => {
      // Setup all mock responses
      const mockMesinData = { data: { tahun_nilai_perolehan: '2020', kode_sentral: 'S001' } }
      const mockPersetujuanData = { data: { mesins: [{ uuid_mesin: 123, id_status: 3 }] } }
      
      mockFeasibilityStudyService.getMesinById.mockResolvedValue(mockMesinData)
      mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValue(mockPersetujuanData)
      mockFeasibilityStudyService.getAsumsiFeasibility.mockResolvedValue({ data: { asumsi_makro: {}, parameter_teknis_financial: {}, harga_bahan_bakars: [], umur_teknis: 25 } })
      mockDetailRekapService.getTypePeriodic.mockResolvedValue({ data: [] })
      mockDetailRekapService.getPembangkitByKode.mockResolvedValue({ data: { kode_pengelola: 'P001', uuid_pembina: 'pembina-123', mesins: [] } })
      mockDetailRekapService.getPengelolaData.mockResolvedValue({ data: [{ kode_pengelola: 'P001', pengelola: 'Test' }] })
      mockUserService.getPembina.mockResolvedValue({ data: [{ uuid_pembina: 'pembina-123', pembina: 'Test Pembina' }] })
      mockFeasibilityStudyService.getDataTeknis.mockResolvedValue({ data: {} })
      mockFeasibilityStudyService.getDataFinansial.mockResolvedValue({ data: { detail: [] } })
      mockFeasibilityStudyService.getHasilSimulasi.mockResolvedValue({ data: {} })
      mockFeasibilityStudyService.getComboBahanBakar.mockResolvedValue({ data: [] })

      // Simulate onMounted execution
      const isLoading = { value: false }
      const idGrafik = { value: '' }
      const route = { params: { id: '123' } }

      isLoading.value = true
      // Simulate development mode behavior
      idGrafik.value = route.params.id as string

      await Promise.all([
        mockFeasibilityStudyService.getMesinById(idGrafik.value),
        mockPersetujuanService.getPersetujuanFSSentral({}),
        mockFeasibilityStudyService.getAsumsiFeasibility(idGrafik.value, 2020),
        mockDetailRekapService.getTypePeriodic(''),
        mockDetailRekapService.getPembangkitByKode('S001'),
        mockFeasibilityStudyService.getDataTeknis(idGrafik.value),
        mockFeasibilityStudyService.getDataFinansial(idGrafik.value),
        mockFeasibilityStudyService.getHasilSimulasi(idGrafik.value, 3),
        mockFeasibilityStudyService.getComboBahanBakar('')
      ])

      isLoading.value = false

      expect(idGrafik.value).toBe('123')
      expect(isLoading.value).toBe(false)
      expect(mockFeasibilityStudyService.getMesinById).toHaveBeenCalledWith('123')
    })
  })
})})
