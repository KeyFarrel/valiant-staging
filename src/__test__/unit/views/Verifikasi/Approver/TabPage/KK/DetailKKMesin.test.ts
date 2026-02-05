import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import DetailKKMesin from '@/views/Verifikasi/Approver/TabPage/KK/DetailKKMesin.vue'
import { nextTick } from 'vue'

// Basic mocks
const mockRoute = {
  query: { uuid_sentral: 'test-uuid-sentral', tahun: '2024' },
  params: { id: '1' }
}

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
}

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter
}))

// Mock encrypt storage
vi.mock('@/utils/app-encrypt-storage', () => ({
  encryptStoragePromise: Promise.resolve({
    decryptValue: vi.fn().mockReturnValue('1')
  })
}))

// Mock User Auth Store
const mockUserAuthStore = {
  levelAlias: '',
  roleAlias: ''
}

vi.mock('@/store/storeUserAuth', () => ({
  useUserAuthStore: () => mockUserAuthStore
}))

// Mock services
const mockDetailSentralService = {
    getPhoto: vi.fn().mockResolvedValue({ data: new Blob(['test']) })
}

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
          photo2: 'photo2.jpg',
          tahun_realisasi: '2023'
        }
    }),
    getPembangkitByKode: vi.fn().mockResolvedValue({
        data: {
            kode_pengelola: 'PENGELOLA01',
            uuid_pembina: 1,
            mesins: [{}, {}]
        }
    }),
    getPengelolaData: vi.fn().mockResolvedValue({
        data: [
            { kode_pengelola: 'PENGELOLA01', pengelola: 'Test Pengelola' }
        ]
    }),
    getAsumsiParameter: vi.fn().mockResolvedValue({
        data: {
            asumsi_makro: {
                corporate_tax_rate: 25,
                discount_rate: 10,
                interest_rate: 8,
                loan_tenor: 15,
                loan_portion: 70,
                equity_portion: 30,
                isFetchingError: false,
                bahan_bakars: []
            },
            parameter_teknis_financial: {
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
                isFetchingError: false
            },
            harga_bahan_bakars: []
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
          header: ['Year', 'Value'],
          tahun: [2024, 2025],
          detail: [
              { level: 1, name: 'Level 1' },
              { level: 2, name: 'Level 2' },
              { level: 3, name: 'Level 3' },
              { level: 4, name: 'Level 4' }
          ]
        }
    }),
    getHasilSimulasi: vi.fn().mockResolvedValue({
        data: {
          track_irr_project: 10,
          track_irr_equity: 12,
          track_npv_equity: 100,
          track_npv_project: 200,
          track_average_cf: 50,
          track_average_eaf: 80,
          wacc_on_project: 8,
          wacc_on_equity: 9,
          now_track_irr_project: 11,
          now_track_irr_equity: 13,
          now_track_npv_equity: 110,
          now_track_npv_project: 210,
          now_track_average_cf: 55,
          now_track_average_eaf: 85
        }
    }),
    getTypePeriodic: vi.fn().mockResolvedValue({ data: [] }),
    getComboBahanBakar: vi.fn().mockResolvedValue({ data: [] })
}

const mockPersetujuanService = {
  getPersetujuanKKSentral: vi.fn().mockResolvedValue({
    data: {
      pengelola: 'Test Pengelola',
      pembina: 'Test Pembina',
      umur_teknis: '25',
      mesins: [{
        uuid_mesin: 1, 
        id_status: 1,
        status: 'Menunggu Persetujuan T1',
        keterangan: 'Test keterangan',
        tahun: '2024'
      }]
    }
  }),
  updateStatusKK: vi.fn().mockResolvedValue({ data: { success: true } })
}

const mockUserService = {
  getPembina: vi.fn().mockResolvedValue({ data: [{ uuid_pembina: 1, pembina: 'Test Pembina' }] })
}

const mockRekapService = {
  getEvidencePath: vi.fn().mockResolvedValue({
    data: [{ file_name: 'test.xlsx', dokumen_evidence: 'path' }]
  }),
  downloadEvidence: vi.fn().mockResolvedValue({
    data: new Blob(['test']),
    headers: { 'content-disposition': 'attachment; filename="test.xlsx"' }
  })
}

// Mock service constructors
vi.mock('@/services/detail-rekap-service', () => ({ default: vi.fn(() => mockDetailRekapService) }))
vi.mock('@/services/persetujuan-service', () => ({ default: vi.fn(() => mockPersetujuanService) }))
vi.mock('@/services/user-service', () => ({ default: vi.fn(() => mockUserService) }))
vi.mock('@/services/rekap-service', () => ({ default: vi.fn(() => mockRekapService) }))
vi.mock('@/services/detail-sentral-service', () => ({ default: vi.fn(() => mockDetailSentralService) }))
vi.mock('@/services/auth-service', () => ({ default: vi.fn(() => ({})) }))
vi.mock("@/services/helper/toast-notification", () => ({ notifyError: vi.fn(), notifySuccess: vi.fn() }))

// Mock URL
global.URL.createObjectURL = vi.fn(() => 'blob:test')
global.URL.revokeObjectURL = vi.fn()

// Mock Components
const MockComponents = {
    Loading: { template: '<div>Loading</div>' },
    InfoHeader: { 
        template: '<div data-testid="info-header"><slot></slot></div>',
        props: ['namaMesin', 'namaPengelola', 'statusMesin', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'namaPembina', 'kondisiUnit']
    },
    ModalWrapper: { template: '<div v-if="showModal"><slot></slot></div>', props: ['showModal'] },
    TabsWrapper: { template: '<div><slot></slot></div>' },
    TabItem: { template: '<div><slot></slot></div>', props: ['title'] },
    Vue3Lottie: true,
    ShimmerLoading: true,
    TableDataTeknis: true,
    TableDataFinansial: true,
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

describe('DetailKKMesin.vue', () => {
  let wrapper
  let pinia

  const createWrapper = () => {
    return mount(DetailKKMesin, {
      global: {
        plugins: [pinia],
        stubs: MockComponents
      }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    pinia = createPinia()
    setActivePinia(pinia)
  })

  afterEach(() => {
    if (wrapper) wrapper.unmount()
  })

  it('should initialize and fetch data', async () => {
    wrapper = createWrapper()
    await flushPromises()

    expect(mockDetailRekapService.getMesinById).toHaveBeenCalled()
    expect(mockPersetujuanService.getPersetujuanKKSentral).toHaveBeenCalled()
    expect(mockDetailRekapService.getAsumsiParameter).toHaveBeenCalled() 
    expect(wrapper.vm.mesin).toBeDefined()
  })

  describe('Authorization and Rendering', () => {
      it('should show T1 buttons (Menunggu Persetujuan T1)', async () => {
          mockUserAuthStore.levelAlias = 'Dr^3Zn$!' 
          mockUserAuthStore.roleAlias = 'Vx_91$pN'
          mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
            data: {
              mesins: [{
                uuid_mesin: 1,
                id_status: 1,
                status: 'Menunggu Persetujuan T1',
              }]
            }
          })
          
          wrapper = createWrapper()
          await flushPromises()
          
          expect(wrapper.vm.arrMesin.status).toBe('Menunggu Persetujuan T1')
           // The buttons are inside InfoHeader slot
          const buttons = wrapper.findAll('button')
          const approveBtn = buttons.find(b => b.text().includes('Setujui Laporan'))
          expect(approveBtn).toBeDefined()
      })

      it('should show T2 buttons (Menunggu Persetujuan T2)', async () => {
          mockUserAuthStore.levelAlias = 'Gk#92lV&'
          mockUserAuthStore.roleAlias = 'Vx_91$pN'
          mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
            data: {
              mesins: [{
                uuid_mesin: 1,
                id_status: 1,
                status: 'Menunggu Persetujuan T2',
              }]
            }
          })
          
          wrapper = createWrapper()
          await flushPromises()
          
          expect(wrapper.vm.arrMesin.status).toBe('Menunggu Persetujuan T2')
          const buttons = wrapper.findAll('button')
          const approveBtn = buttons.find(b => b.text().includes('Setujui Laporan'))
          expect(approveBtn).toBeDefined()
      })
  })

  describe('Actions', () => {
      it('should download evidence', async () => {
          wrapper = createWrapper()
          await flushPromises()
          await wrapper.vm.downloadEvidence()
          expect(mockRekapService.getEvidencePath).toHaveBeenCalled()
          expect(mockRekapService.downloadEvidence).toHaveBeenCalled()
      })

      it('should approve T1', async () => {
          mockUserAuthStore.levelAlias = 'Dr^3Zn$!'
          wrapper = createWrapper()
          await flushPromises()
          
          await wrapper.vm.updateKKPembina()
          expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalledWith(expect.objectContaining({
              status_approval: 1,
              uuid_mesin: '1'
          }))
      })

      it('should approve T2', async () => {
          mockUserAuthStore.levelAlias = 'Gk#92lV&'
          wrapper = createWrapper()
          await flushPromises()
          
          await wrapper.vm.updateKKPengelola()
          expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalledWith(expect.objectContaining({
              status_approval: 4,
              uuid_mesin: '1'
          }))
      })

      it('should reject T1 with validation', async () => {
           mockUserAuthStore.levelAlias = 'Dr^3Zn$!'
           wrapper = createWrapper()
           await flushPromises()
           
           // Empty message
           wrapper.vm.pesan = ''
           await wrapper.vm.rejectKKPembina()
           expect(wrapper.vm.error.pesanPenolakan).toBe(true)
           expect(mockPersetujuanService.updateStatusKK).not.toHaveBeenCalled()
           
           // With message
           wrapper.vm.pesan = 'Reject T1'
           await wrapper.vm.rejectKKPembina()
           expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalledWith(expect.objectContaining({
               status_approval: 2,
               keterangan: 'Reject T1',
               uuid_mesin: '1'
           }))
      })

      it('should reject T2 with validation', async () => {
           mockUserAuthStore.levelAlias = 'Gk#92lV&'
           wrapper = createWrapper()
           await flushPromises()
           
           // Test empty message validation
           wrapper.vm.pesan = ''
           await wrapper.vm.rejectKKPengelola()
           expect(wrapper.vm.error.pesanPenolakan).toBe(true)
           
           // Test valid message
           wrapper.vm.pesan = 'Reject T2'
           await wrapper.vm.rejectKKPengelola()
           expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalledWith(expect.objectContaining({
               status_approval: 5,
               keterangan: 'Reject T2',
               uuid_mesin: '1' 
           }))
      })

      it('should handle downloadEvidence error', async () => {
          mockRekapService.getEvidencePath.mockRejectedValueOnce(new Error('Fail'))
          wrapper = createWrapper()
          await flushPromises()
          
          await wrapper.vm.downloadEvidence()
          expect(wrapper.vm.isLoading).toBe(false)
      })
  })

    describe('Data reloading and handling', () => {
        it('should reload data on sub-component events', async () => {
            wrapper = createWrapper()
            await flushPromises()
            
            wrapper.vm.reloadAsumsiParameter()
            expect(mockDetailRekapService.getAsumsiParameter).toHaveBeenCalled()
            
            wrapper.vm.reloadDataTeknis()
            expect(mockDetailRekapService.getDataTeknis).toHaveBeenCalled()
            
            wrapper.vm.reloadDataFinansial()
            expect(mockDetailRekapService.getDataFinansial).toHaveBeenCalled()
            
            wrapper.vm.reloadHasilSimulasi()
            expect(mockDetailRekapService.getHasilSimulasi).toHaveBeenCalled()
        })
    })

    describe('Edge Cases', () => {
        it('should handle updateKKPembina error', async () => {
          mockPersetujuanService.updateStatusKK.mockRejectedValueOnce(new Error('Fail'))
          
          wrapper = createWrapper()
          await flushPromises()
          
          await wrapper.vm.updateKKPembina()
          expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled()
      })

      it('should handle rejectKKPembina error', async () => {
          mockPersetujuanService.updateStatusKK.mockRejectedValueOnce(new Error('Fail'))
          
          wrapper = createWrapper()
          await flushPromises()
          wrapper.vm.pesan = 'Reject Reason'
          
          await wrapper.vm.rejectKKPembina()
          expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled()
      })

      it('should handle rejectKKPengelola error', async () => {
          mockPersetujuanService.updateStatusKK.mockRejectedValueOnce(new Error('Fail'))
          
          wrapper = createWrapper()
          await flushPromises()
          wrapper.vm.pesan = 'Reject Reason'
          
          await wrapper.vm.rejectKKPengelola()
          expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled()
      })

      it('should handle fetch errors gracefully', async () => {
             mockDetailRekapService.getMesinById.mockRejectedValueOnce(new Error('Fail'))
             wrapper = createWrapper()
             await flushPromises()
             // Just ensure it doesn't crash
             expect(wrapper.exists()).toBe(true)
        })
        
        it('should handle financial data with different year logic', async () => {
             // Logic: if (response.data.tahun[last] == tahunBerjalan - 1) fetch realisasi
             const currentYear = new Date().getFullYear()
             mockDetailRekapService.getDataFinansial.mockResolvedValueOnce({
                 data: {
                     tahun: [currentYear - 1],
                     detail: [{ level: 1, name: 'L1' }]
                 }
             })
             
             wrapper = createWrapper()
             await flushPromises()
             // Should verify it called fetch again for realisasi or processed differently
             // Check logic in component: loop runs on responseTahunRealisasi if condition met
        })
    })
})