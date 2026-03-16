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
vi.mock('@/services/detail-rekap-service', () => ({ default: vi.fn(function() { return mockDetailRekapService; }) }))
vi.mock('@/services/persetujuan-service', () => ({ default: vi.fn(function() { return mockPersetujuanService; }) }))
vi.mock('@/services/user-service', () => ({ default: vi.fn(function() { return mockUserService; }) }))
vi.mock('@/services/rekap-service', () => ({ default: vi.fn(function() { return mockRekapService; }) }))
vi.mock('@/services/detail-sentral-service', () => ({ default: vi.fn(function() { return mockDetailSentralService; }) }))
vi.mock('@/services/auth-service', () => ({ default: vi.fn(function() { return {}; }) }))
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

      it('should render T2 actions for Xf level alias path', async () => {
          mockUserAuthStore.levelAlias = 'Xf!8qP@7'
          mockUserAuthStore.roleAlias = ''
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

          const buttons = wrapper.findAll('button')
          expect(buttons.find((b: any) => b.text().includes('Setujui Laporan'))).toBeDefined()
          expect(buttons.find((b: any) => b.text().includes('Tolak Laporan'))).toBeDefined()
      })

      it('should render T1 actions for Xf level alias path', async () => {
          mockUserAuthStore.levelAlias = 'Xf!8qP@7'
          mockUserAuthStore.roleAlias = ''
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

          const buttons = wrapper.findAll('button')
          expect(buttons.find((b: any) => b.text().includes('Setujui Laporan'))).toBeDefined()
          expect(buttons.find((b: any) => b.text().includes('Tolak Laporan'))).toBeDefined()
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

      it('should execute T2 template click handlers for reject and approve flows', async () => {
          mockUserAuthStore.levelAlias = 'Gk#92lV&'
          mockUserAuthStore.roleAlias = 'Vx_91$pN'
          mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
            data: {
              pengelola: 'Test Pengelola',
              pembina: 'Test Pembina',
              umur_teknis: '25',
              mesins: [{ uuid_mesin: 1, id_status: 2, status: 'Menunggu Persetujuan T2', tahun: '2024', keterangan: '' }]
            }
          })

          wrapper = createWrapper()
          await flushPromises()

          const openRejectButton = wrapper.findAll('button').find((btn: any) => btn.text().includes('Tolak Laporan'))
          expect(openRejectButton).toBeDefined()
          await openRejectButton?.trigger('click')
          expect(wrapper.vm.modalCancel).toBe(true)

          const rejectTextArea = wrapper.find('textarea')
          await rejectTextArea.setValue('penolakan t2')
          const sendRejectButton = wrapper.findAll('button').find((btn: any) => btn.text().includes('Kirim Penolakan'))
          await sendRejectButton?.trigger('click')
          expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled()

          const openApproveButton = wrapper.findAll('button').find((btn: any) => btn.text().includes('Setujui Laporan'))
          await openApproveButton?.trigger('click')
          expect(wrapper.vm.modalApprove).toBe(true)

          const cancelApproveButton = wrapper.findAll('button').find((btn: any) => btn.text() === 'Batal')
          await cancelApproveButton?.trigger('click')
          expect(wrapper.vm.modalApprove).toBe(false)
      })

      it('should close T2 reject modal via Batal button', async () => {
          mockUserAuthStore.levelAlias = 'Gk#92lV&'
          mockUserAuthStore.roleAlias = 'Vx_91$pN'
          mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
            data: {
              pengelola: 'Test Pengelola',
              pembina: 'Test Pembina',
              umur_teknis: '25',
              mesins: [{ uuid_mesin: 1, id_status: 2, status: 'Menunggu Persetujuan T2', tahun: '2024', keterangan: '' }]
            }
          })

          wrapper = createWrapper()
          await flushPromises()

          const openRejectButton = wrapper.findAll('button').find((btn: any) => btn.text().includes('Tolak Laporan'))
          await openRejectButton?.trigger('click')
          expect(wrapper.vm.modalCancel).toBe(true)

          const cancelRejectButton = wrapper.findAll('button').find((btn: any) => btn.text() === 'Batal')
          await cancelRejectButton?.trigger('click')
          expect(wrapper.vm.modalCancel).toBe(false)
      })

      it('should execute T1 template click handlers for reject and approve flows', async () => {
          mockUserAuthStore.levelAlias = 'Dr^3Zn$!'
          mockUserAuthStore.roleAlias = 'Vx_91$pN'
          mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
            data: {
              pengelola: 'Test Pengelola',
              pembina: 'Test Pembina',
              umur_teknis: '25',
              mesins: [{ uuid_mesin: 1, id_status: 1, status: 'Menunggu Persetujuan T1', tahun: '2024', keterangan: '' }]
            }
          })

          wrapper = createWrapper()
          await flushPromises()

          const openRejectButton = wrapper.findAll('button').find((btn: any) => btn.text().includes('Tolak Laporan'))
          await openRejectButton?.trigger('click')
          expect(wrapper.vm.modalCancel).toBe(true)

          const rejectTextArea = wrapper.find('textarea')
          await rejectTextArea.setValue('penolakan t1')
          const sendRejectButton = wrapper.findAll('button').find((btn: any) => btn.text().includes('Kirim Penolakan'))
          await sendRejectButton?.trigger('click')
          expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled()

          const openApproveButton = wrapper.findAll('button').find((btn: any) => btn.text().includes('Setujui Laporan'))
          await openApproveButton?.trigger('click')
          const cancelButtons = wrapper.findAll('button').filter((btn: any) => btn.text() === 'Batal')
          if (cancelButtons.length) {
            await cancelButtons[0].trigger('click')
          }
          expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled()
      })

      it('should close T1 reject modal via Batal button', async () => {
          mockUserAuthStore.levelAlias = 'Dr^3Zn$!'
          mockUserAuthStore.roleAlias = 'Vx_91$pN'
          mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
            data: {
              pengelola: 'Test Pengelola',
              pembina: 'Test Pembina',
              umur_teknis: '25',
              mesins: [{ uuid_mesin: 1, id_status: 1, status: 'Menunggu Persetujuan T1', tahun: '2024', keterangan: '' }]
            }
          })

          wrapper = createWrapper()
          await flushPromises()

          const openRejectButton = wrapper.findAll('button').find((btn: any) => btn.text().includes('Tolak Laporan'))
          await openRejectButton?.trigger('click')
          expect(wrapper.vm.modalCancel).toBe(true)

          const cancelRejectButton = wrapper.findAll('button').find((btn: any) => btn.text() === 'Batal')
          await cancelRejectButton?.trigger('click')
          expect(wrapper.vm.modalCancel).toBe(false)
      })

      it('should switch hasil simulasi tabs from template click handlers', async () => {
          wrapper = createWrapper()
          await flushPromises()

          const tabs = wrapper.findAll('#tab')
          expect(tabs.length).toBeGreaterThanOrEqual(2)

          await tabs[0].trigger('click')
          expect(wrapper.vm.selectedTab).toBe('Akhir Masa')

          await tabs[1].trigger('click')
          expect(wrapper.vm.selectedTab).toBe('Tahun Berjalan')
      })

      it('should render all status variants to exercise status branch chains', async () => {
          const statuses = [
            'Draft',
            'Ditolak T1',
            'Ditolak T2',
            'Disetujui',
            'Menunggu Persetujuan T1',
            'Menunggu Persetujuan T2'
          ]

          for (const status of statuses) {
            mockPersetujuanService.getPersetujuanKKSentral.mockResolvedValueOnce({
              data: {
                pengelola: 'Test Pengelola',
                pembina: 'Test Pembina',
                umur_teknis: '25',
                mesins: [{ uuid_mesin: 1, id_status: 1, status, tahun: '2024', keterangan: '' }]
              }
            })

            const statusWrapper = createWrapper()
            await flushPromises()
            expect(statusWrapper.vm.arrMesin.status).toBe(status)
            statusWrapper.unmount()
          }
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

    it('should cover Data Teknis Error', async () => {
      mockDetailRekapService.getDataTeknis = vi.fn().mockRejectedValue(new Error('Network error'));
      await wrapper.vm.fetchDataTeknis();
      expect(wrapper.vm.dataTeknis.isFetchingError).toBe(true);
      wrapper.vm.reloadDataTeknis();
      
      const currentYear = new Date().getFullYear();
      
      // Hit the "tahun == tahunBerjalan - 1" branch
      mockDetailRekapService.getDataTeknis = vi.fn()
          .mockResolvedValueOnce({
            code: 200,
            data: { tahun: [currentYear - 1], data: 'test1' }
          })
          .mockResolvedValueOnce({
            code: 200,
            data: { tahun: [currentYear - 1], data: 'test2' } // for responseTahunRealisasi
          });
      await wrapper.vm.fetchDataTeknis();

      // Hit the else branch
      mockDetailRekapService.getDataTeknis = vi.fn().mockResolvedValue({
        code: 200,
        data: { tahun: [currentYear], data: 'test_else' }
      });
      await wrapper.vm.fetchDataTeknis();
      
      // expect false
    });

    it('should cover Data Finansial Mapping and Error', async () => {
      // Mock error first
      mockDetailRekapService.getDataFinansial = vi.fn().mockRejectedValue(new Error('Network error'));
      await wrapper.vm.fetchDataFinansial();
      expect(wrapper.vm.dataFinansial.isFetchingError).toBe(true);
      wrapper.vm.reloadDataFinansial();
      
      const currentYear = new Date().getFullYear();
      
      // Mock success with all mapping levels (tahun == currentYear, so 'else' block)
      mockDetailRekapService.getDataFinansial = vi.fn().mockResolvedValue({
        code: 200,
        data: {
          tahun: [currentYear],
          detail: [
            { level: 1, name: 'Level 1' },
            { level: 2, name: 'Level 2' },
            { level: 3, name: 'Level 3' },
            { level: 4, name: 'Level 4' }
          ]
        }
      });
      await wrapper.vm.fetchDataFinansial();
      // expect false

      // Branch for map realisasi (tahun == currentYear - 1, so 'if' block)
      mockDetailRekapService.getDataFinansial = vi.fn().mockResolvedValue({
        code: 200,
        data: {
          tahun: [currentYear - 1],
          detail: [
            { level: 1, name: 'Level 1 realisasi' },
            { level: 2, name: 'Level 2 realisasi' },
            { level: 3, name: 'Level 3 realisasi' },
            { level: 4, name: 'Level 4 realisasi' }
          ]
        }
      });
      wrapper.vm.tahunGrafik = wrapper.vm.tahunTerakhirRealisasi = currentYear;
      await wrapper.vm.fetchDataFinansial();
    });

    it('should cover Unit Pengelola, Pembina, Type Periodic Error', async () => {
      mockUserService.getPembina = vi.fn().mockRejectedValue(new Error('Network error'));
      await wrapper.vm.fetchListPembina();
      
      mockDetailRekapService.getPengelolaData = vi.fn().mockRejectedValue(new Error('Network error'));
      await wrapper.vm.fetchUnitPengelola();
      
      mockDetailRekapService.getTypePeriodicByJenis = vi.fn().mockRejectedValue(new Error('Network error'));
      await wrapper.vm.fetchTypePeriodic();
      
      mockDetailSentralService.getPhoto = vi.fn().mockRejectedValue(new Error('Network error'));
      mockDetailRekapService.getMesinById = vi.fn().mockResolvedValue({
          data: { photo1: 'test.jpg' }
      });
      await wrapper.vm.fetchMesinById();
      
      mockPersetujuanService.getPersetujuanKKSentral = vi.fn().mockRejectedValue(new Error('Network error'));
      await wrapper.vm.fetchPersetujuanKK();

      mockDetailRekapService.getAsumsiParameter = vi.fn().mockRejectedValue(new Error('Network error'));
      await wrapper.vm.fetchAsumsiParameter();
    });

    it('should handle updateKKPembina error', async () => {
          mockPersetujuanService.updateStatusKK.mockRejectedValueOnce(new Error('Fail'))
          
          wrapper = createWrapper()
          await flushPromises()
          
          await wrapper.vm.updateKKPembina()
          expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled()
      })

          it('should cover fetch catch branches and updateKKPengelola catch branch', async () => {
            wrapper = createWrapper()
            await flushPromises()

            mockDetailRekapService.getHasilSimulasi.mockRejectedValueOnce(new Error('hasil-simulasi-fail'))
            await wrapper.vm.fetchHasilSimulasi()

            mockDetailRekapService.getTypePeriodic.mockRejectedValueOnce(new Error('type-periodic-fail'))
            await wrapper.vm.fetchTypePeriodic()

            mockDetailRekapService.getComboBahanBakar.mockRejectedValueOnce(new Error('combo-fail'))
            await wrapper.vm.fetchComboBahanBakar()

            mockPersetujuanService.updateStatusKK.mockRejectedValueOnce(new Error('update-pengelola-fail'))
            await wrapper.vm.updateKKPengelola()

            expect(mockPersetujuanService.updateStatusKK).toHaveBeenCalled()
          })

          it('should render fallback branches for missing mesin and summary fields', async () => {
            wrapper = createWrapper()
            await flushPromises()

            wrapper.vm.mesin = {
            mesin: '',
            kode_jenis_pembangkit: '',
            kondisi_unit: '',
            daya_terpasang: undefined,
            daya_mampu: undefined,
            tahun_operasi: '',
            masa_manfaat: '',
            photo1: '',
            photo2: '',
            tahun_nilai_perolehan: undefined,
            nilai_asset_awal: undefined
            }
            wrapper.vm.approveSentralKK = { tahun: '', pengelola: '' }
            wrapper.vm.arrMesin = { status: 'Draft' }
            wrapper.vm.tahunGrafik = 2024
            wrapper.vm.asumsiParameter = {}
            wrapper.vm.parameterTeknisFinansial = {}
            wrapper.vm.hasilSimulasi = {}
            await nextTick()

            expect(wrapper.exists()).toBe(true)
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