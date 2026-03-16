import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import DetailFSMesin from '@/views/Verifikasi/Sentral/TabPage/FS/DetailFSMesin.vue'
import { nextTick } from 'vue'

// Mock route
const mockRoute = {
  query: { uuid_sentral: 'test-uuid-sentral' },
  params: { id: '1' }
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
    decryptValue: vi.fn().mockReturnValue('1')
  })
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
      photo2: 'photo2.jpg'
    }
  }),
  getTypePeriodic: vi.fn().mockResolvedValue({ data: [] }),
  getPembangkitByKode: vi.fn().mockResolvedValue({
        data: {
            kode_pengelola: 'PENGELOLA01',
            id_pembina: 1,
            mesins: [{}, {}]
        }
    }),
    getPengelolaData: vi.fn().mockResolvedValue({
        data: [
            { kode_pengelola: 'PENGELOLA01', pengelola: 'Test Pengelola' }
        ]
    })
}

const mockPersetujuanService = {
  getPersetujuanFSSentral: vi.fn().mockResolvedValue({
    data: {
      pengelola: 'Test Pengelola',
      pembina: 'Test Pembina',
      mesins: [{
        uuid_mesin: 1, // Matches decrypted-test-id (as number if parsed) but logic compares loosely usually
        id_status: 1,
        status: 'Disetujui',
        keterangan: 'Test keterangan'
      }]
    }
  }),
  updateStatusFS: vi.fn().mockResolvedValue({ data: {} })
}

const mockFeasibilityStudyService = {
  getAsumsiFeasibility: vi.fn().mockResolvedValue({ // Renamed from getAsumsi to match usage
    data: {
      asumsi_makro: {
          corporate_tax_rate: 25,
          discount_rate: 10,
          interest_rate: 8,
          loan_tenor: 15,
          loan_portion: 70,
          equity_portion: 30
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
          electricity_price_d_rp_per_kwh: 1300
      },
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
      fs_irr_project: 10,
      fs_irr_equity: 12,
      fs_npv_equity: 100,
      fs_npv_project: 200,
      fs_average_cf: 50,
      fs_on_project: 8,
      fs_on_equity: 9,
      fs_average_eaf: 80,
      now_fs_irr_project: 11,
      now_fs_irr_equity: 13,
      now_fs_npv_equity: 110,
      now_fs_npv_project: 210,
      now_fs_average_cf: 55,
      now_fs_average_eaf: 85
    }
  }),
  getComboBahanBakar: vi.fn().mockResolvedValue({ data: [] })
}

const mockUserService = {
  getPembina: vi.fn().mockResolvedValue({ data: [{ id_pembina: 1, pembina: 'Test Pembina' }] }),
  getUnitPengelola: vi.fn().mockResolvedValue({ data: [] })
}

const mockRekapService = {
  uploadEvidence: vi.fn().mockResolvedValue({ data: 'path' }),
  updateEvidencePath: vi.fn().mockResolvedValue({ success: true }),
  getEvidencePath: vi.fn().mockResolvedValue({
    data: [{ file_name: 'test.xlsx', dokumen_evidence: 'path' }]
  }),
  downloadEvidence: vi.fn().mockResolvedValue({
    data: new Blob(['test']),
    headers: { 'content-disposition': 'attachment; filename="test.xlsx"' }
  }),
  uploadTemplateAwalFS: vi.fn().mockResolvedValue({}), // Missing in original
  downloadTemplateFS: vi.fn().mockResolvedValue({
     data: new Blob(['test']),
     headers: { 'content-disposition': 'attachment; filename="template.xlsx"' }
  })
}

// Mock Toast
vi.mock("@/services/helper/toast-notification", () => ({
    notifyError: vi.fn(),
    notifySuccess: vi.fn()
}))


// Mock service constructors
vi.mock('@/services/detail-rekap-service', () => ({
  default: vi.fn(function() { return mockDetailRekapService; })
}))

vi.mock('@/services/persetujuan-service', () => ({
  default: vi.fn(function() { return mockPersetujuanService; })
}))

vi.mock('@/services/feasibility-study', () => ({
  default: vi.fn(function() { return mockFeasibilityStudyService; })
}))

vi.mock('@/services/user-service', () => ({
  default: vi.fn(function() { return mockUserService; })
}))

vi.mock('@/services/rekap-service', () => ({
  default: vi.fn(function() { return mockRekapService; })
}))

vi.mock('@/services/detail-sentral-service', () => ({
  default: vi.fn(function() { return mockDetailSentralService; })
}))

vi.mock('@/services/format/global-format', () => ({
  default: vi.fn(function() { return {
    formatCurrency: vi.fn(),
    formatNumber: vi.fn(),
    formatBytes: vi.fn((bytes) => {
        if (bytes === 0) return '0 Bytes';
        return '1 KB';
    }),
    formatNumberFiveDigits: vi.fn((num) => '00001')
  }; })
}))

// Mock Vue3Lottie
vi.mock('vue3-lottie', () => ({
  Vue3Lottie: {
    name: 'Vue3Lottie',
    template: '<div></div>',
    props: ['animationData']
  }
}))

// Mock lottie asset
vi.mock('@/assets/lottie/success.json', () => ({
  default: {}
}))

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:test')
global.URL.revokeObjectURL = vi.fn()


describe('DetailFSMesin.vue', () => {
  let wrapper

  const createWrapper = () => {
    return mount(DetailFSMesin, {
      global: {
        stubs: {
          Loading: true,
          InfoHeader: {
              template: '<div><slot></slot></div>',
              props: ['namaMesin', 'namaPengelola', 'statusMesin', 'kodeJenisPembangkit', 'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'namaPembina', 'kondisiUnit']
          },
          ModalWrapper: {
              template: '<div v-if="showModal"><slot></slot></div>',
              props: ['showModal', 'width', 'height'],
              emits: ['on-escape']
          },
          TabsWrapper: {
              template: '<div><slot></slot></div>',
              props: ['isLihatGrafik', 'photo', 'lamanData', 'idMesin', 'nilaiAssetAwal', 'tahunGrafik', 'tahun', 'irrOnProject', 'irrOnEquity', 'npvOnEquity', 'npvOnProject', 'averageNcf', 'waccOnProject', 'waccOnEquity', 'averageEaf', 'namaMesin', 'namaPengelola', 'namaPembina', 'dayaTerpasang', 'dayaMampu', 'tahunPerolehanData', 'tahunOperasi', 'jumlahMesin', 'statusGrafik']
          },
          Vue3Lottie: true,
          IconFolder: true,
          TableDataTeknis: true,
          TableDataFinansial: true,
          TabItem: {
              template: '<div v-show="false"><slot></slot></div>', // Simplified
              props: ['title']
          },
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

  describe('Component Mounting and Initialization', () => {
    it('should mount successfully and fetch initial data', async () => {
      wrapper = createWrapper()
      await flushPromises() // Wait for onMounted promises

      expect(mockDetailRekapService.getMesinById).toHaveBeenCalled()
      expect(mockDetailSentralService.getPhoto).toHaveBeenCalled()
      expect(mockPersetujuanService.getPersetujuanFSSentral).toHaveBeenCalled()
      expect(mockFeasibilityStudyService.getAsumsiFeasibility).toHaveBeenCalled()
      expect(mockDetailRekapService.getTypePeriodic).toHaveBeenCalled()
      expect(mockDetailRekapService.getPembangkitByKode).toHaveBeenCalled() // fetchUnitPengelola
      expect(mockDetailRekapService.getPengelolaData).toHaveBeenCalled() // fetchUnitPengelola
      expect(mockUserService.getPembina).toHaveBeenCalled() // fetchUnitPengelola
      expect(mockFeasibilityStudyService.getDataTeknis).toHaveBeenCalled()
      expect(mockFeasibilityStudyService.getDataFinansial).toHaveBeenCalled()
      expect(mockFeasibilityStudyService.getHasilSimulasi).toHaveBeenCalled()
      expect(mockFeasibilityStudyService.getComboBahanBakar).toHaveBeenCalled()
      
      expect(wrapper.vm.mesinDataById).toBeDefined()
      expect(wrapper.vm.namaPengelola).toBe('Test Pengelola')
      expect(wrapper.vm.namaPembina).toBe('Test Pembina')
    })
  })

  describe('User Interactions', () => {
      it('should toggle detail button', async () => {
          wrapper = createWrapper()
          await flushPromises()
          
          expect(wrapper.vm.isHover).toBe(true)
          wrapper.vm.toggleButton()
          expect(wrapper.vm.isHover).toBe(false)
          wrapper.vm.toggleButton()
          expect(wrapper.vm.isHover).toBe(true)
      })

      it('should switch tabs', async () => {
          wrapper = createWrapper()
          await flushPromises()
          
          wrapper.find('li#tab').trigger('click')
          await nextTick()
          expect(wrapper.vm.selectedTab).toBe('Akhir Masa')
      })
  })

  describe('File Handling', () => {
      it('should handle FS file selection', async () => {
          wrapper = createWrapper()
          await flushPromises()
          
          const file = new File(['content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          const event = { target: { files: [file] } }
          
          wrapper.vm.handleFileFSChange(event)
          expect(wrapper.vm.selectedFileFS).toEqual(file)

          // Test empty selection
          const emptyEvent = { target: { files: [] } }
          wrapper.vm.handleFileFSChange(emptyEvent)
          expect(wrapper.vm.selectedFileFS).toBeNull()
      })

       it('should handle Evidence file selection', async () => {
          wrapper = createWrapper()
          await flushPromises()
          
          const file = new File(['content'], 'evidence.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
          const event = { target: { files: [file] } }
          
          wrapper.vm.handleFileChangeEvidence(event)
          expect(wrapper.vm.selectedFileEvidence).toEqual(file)

            // Test empty selection
          const emptyEvent = { target: { files: [] } }
          wrapper.vm.handleFileChangeEvidence(emptyEvent)
          expect(wrapper.vm.selectedFileEvidence).toBeNull()
      })
  })

  describe('Actions', () => {
      it('should download template FS', async () => {
          wrapper = createWrapper()
          await flushPromises()
          
          await wrapper.vm.handleDownloadTemplateFS()
          expect(mockRekapService.downloadTemplateFS).toHaveBeenCalled()
      })

      it('should download evidence', async () => {
          wrapper = createWrapper()
          await flushPromises()
          
          await wrapper.vm.downloadEvidence()
          expect(mockRekapService.getEvidencePath).toHaveBeenCalled()
          expect(mockRekapService.downloadEvidence).toHaveBeenCalled()
      })

      it('should handle download evidence error', async () => {
          wrapper = createWrapper()
          await flushPromises()
          mockRekapService.getEvidencePath.mockRejectedValueOnce(new Error('Failed'))
          
          await wrapper.vm.downloadEvidence()
          expect(wrapper.vm.isLoading).toBe(false)
      })

      it('should upload file FS', async () => {
           wrapper = createWrapper()
           await flushPromises()

           const file = new File(['content'], 'test.xlsx')
           wrapper.vm.selectedFileFS = file
           
           await wrapper.vm.uploadFileFS()
           expect(mockRekapService.uploadTemplateAwalFS).toHaveBeenCalled()
           expect(wrapper.vm.isFSUploadSuccess).toBe(false) // Resets after wait
      })

      it('should not upload file FS if no file selected', async () => {
           wrapper = createWrapper()
           await flushPromises()
           wrapper.vm.selectedFileFS = null
           
           await wrapper.vm.uploadFileFS()
           expect(mockRekapService.uploadTemplateAwalFS).not.toHaveBeenCalled()
      })
      
       it('should upload file Evidence', async () => {
           wrapper = createWrapper()
           await flushPromises()

           const file = new File(['content'], 'evidence.xlsx')
           wrapper.vm.selectedFileEvidence = file
           
           await wrapper.vm.uploadFileEvidence()
           expect(mockRekapService.uploadEvidence).toHaveBeenCalled()
           expect(mockRekapService.updateEvidencePath).toHaveBeenCalled()
           expect(wrapper.vm.isEvidenceSuccess).toBe(false) // Resets after wait
      })
      
       it('should update FS status (Kirim Data)', async () => {
           wrapper = createWrapper()
           await flushPromises()
           
           await wrapper.vm.updateFS()
           expect(mockPersetujuanService.updateStatusFS).toHaveBeenCalled()
           expect(wrapper.vm.isSuccess).toBe(false) // Resets after wait
           expect(wrapper.vm.modalApprove).toBe(false)
       })
  })
  
  describe('Rendering States', () => {
      it('should render correct status component based on approval status', async () => {
           mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValueOnce({
            data: {
              pengelola: 'Test Pengelola',
              pembina: 'Test Pembina',
              mesins: [{
                uuid_mesin: 1,
                id_status: 1,
                status: 'Ditolak T1',
                keterangan: 'Reject reason'
              }]
            }
          })
          
          wrapper = createWrapper()
          await flushPromises()
          
          // Force update to verify template sections for Ditolak T1
           expect(wrapper.vm.approveMesinFS.status).toBe('Ditolak T1')
           
           // Verify revisi button visibility logic if possible via snapshot or finding by text/class
           // In this structure, we can check if certain methods are called or state is set correctly
      })
  })
  
  describe('Data Processing', () => {
      it('should process financial data hierarchy correctly', async () => {
           wrapper = createWrapper()
           await flushPromises()
           
           // Verify that dataFinansial is structured correctly (levels nested)
           // The mock returns flat array with levels. The component processes it.
           // We can check if `finansialMappingResult` is populated correctly.
           expect(wrapper.vm.finansialMappingResult.length).toBeGreaterThan(0)
           expect(wrapper.vm.finansialMappingResult[0].level).toBe(1)
           // If logic works, level 2 should be nested in level 1
           expect(wrapper.vm.finansialMappingResult[0].level2).toBeDefined()
      })
  })

  describe('Error Handling', () => {
      it('should handle fetchMesinById error', async () => {
          mockDetailRekapService.getMesinById.mockRejectedValueOnce(new Error('Network error'))
          const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
          
          wrapper = createWrapper()
          await flushPromises()
          
          expect(consoleSpy).toHaveBeenCalledWith('Fetch Mesin By Id Error : ', expect.any(Error))
          consoleSpy.mockRestore()
      })

          it('should handle uploadFileEvidence error branch', async () => {
            wrapper = createWrapper()
            await flushPromises()

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            mockRekapService.uploadEvidence.mockRejectedValueOnce(new Error('upload failed'))
            wrapper.vm.selectedFileEvidence = new File(['x'], 'evidence.xlsx')

            await wrapper.vm.uploadFileEvidence()

            expect(consoleSpy).toHaveBeenCalledWith('Error upload file : ', expect.any(Error))
            expect(wrapper.vm.isLoading).toBe(false)
            consoleSpy.mockRestore()
          })

          it('should handle fetchListPembina error branch', async () => {
            wrapper = createWrapper()
            await flushPromises()

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
            mockUserService.getPembina.mockRejectedValueOnce(new Error('fetch pembina failed'))

            await wrapper.vm.fetchListPembina()

            expect(consoleSpy).toHaveBeenCalledWith('Fetch Pembina Error : ', expect.any(Error))
            consoleSpy.mockRestore()
          })

          it('should execute formatBytes helper branches', async () => {
            wrapper = createWrapper()
            await flushPromises()

            expect(wrapper.vm.formatBytes(0)).toBe('0 Bytes')
            expect(wrapper.vm.formatBytes(2048)).toContain('KB')
          })

          it('should render status-specific action buttons using slot stubs', async () => {
            mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValueOnce({
              data: {
                pengelola: 'Test Pengelola',
                pembina: 'Test Pembina',
                mesins: [{
                  uuid_mesin: 1,
                  id_status: 1,
                  status: 'Draft',
                  keterangan: 'draft'
                }]
              }
            })

            const richWrapper = mount(DetailFSMesin, {
              global: {
                stubs: {
                  Loading: true,
                  InfoHeader: { template: '<div><slot /></div>' },
                  ModalWrapper: { template: '<div><slot /></div>' },
                  TabsWrapper: { template: '<div><slot /></div>' },
                  TabItem: { template: '<div><slot /></div>' },
                  Vue3Lottie: true,
                  IconFolder: true,
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
                  ComponentDraft: true,
                }
              }
            })

            await flushPromises()

            const editButton = richWrapper.findAll('button').find((btn) => btn.text().includes('Edit Data'))
            const kirimDataButton = richWrapper.findAll('button').find((btn) => btn.text().includes('Kirim Data'))

            expect(editButton).toBeDefined()
            expect(kirimDataButton).toBeDefined()

            if (kirimDataButton) {
              await kirimDataButton.trigger('click')
            }

            expect(richWrapper.vm.modalApprove).toBe(true)
            richWrapper.unmount()
          })

            it('should trigger upload modal template handlers via UI', async () => {
              const richWrapper = mount(DetailFSMesin, {
                global: {
                  stubs: {
                    Loading: true,
                    InfoHeader: { template: '<div><slot /></div>' },
                    ModalWrapper: {
                      template: '<div @click="$emit(\'on-escape\')"><slot /></div>',
                      emits: ['on-escape']
                    },
                    TabsWrapper: { template: '<div><slot /></div>' },
                    TabItem: { template: '<div><slot /></div>' },
                    Vue3Lottie: true,
                    IconFolder: true,
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
                    ComponentDraft: true,
                  }
                }
              })

              await flushPromises()

              richWrapper.vm.isModalUnggahFSOpen = true
              await nextTick()

              const resetBtn = richWrapper.findAll('button').find((b) => b.text().includes('Reset'))
              const kirimBtn = richWrapper.findAll('button').find((b) => b.text().trim() === 'Kirim')
              const closeModalBtn = richWrapper.findAll('button').find((b) => b.find('svg').exists())

              if (closeModalBtn) {
                await closeModalBtn.trigger('click')
              }

              richWrapper.vm.selectedFileFS = new File(['x'], 'fs.xlsx')
              richWrapper.vm.selectedFileEvidence = new File(['x'], 'evidence.xlsx')

              if (resetBtn) {
                await resetBtn.trigger('click')
              }

              expect(richWrapper.vm.selectedFileFS).toBeNull()
              expect(richWrapper.vm.selectedFileEvidence).toBeNull()

              richWrapper.vm.selectedFileFS = new File(['x'], 'fs.xlsx')
              richWrapper.vm.selectedFileEvidence = new File(['x'], 'evidence.xlsx')
              if (kirimBtn) {
                await kirimBtn.trigger('click')
              }

              expect(mockRekapService.uploadTemplateAwalFS).toHaveBeenCalled()
              richWrapper.unmount()
            })

            it('should trigger rejected and draft branch handlers from template', async () => {
              mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValueOnce({
                data: {
                  pengelola: 'Test Pengelola',
                  pembina: 'Test Pembina',
                  mesins: [{ uuid_mesin: 1, id_status: 1, status: 'Ditolak T1', keterangan: 'Ditolak' }]
                }
              })

              const richWrapper = mount(DetailFSMesin, {
                global: {
                  stubs: {
                    Loading: true,
                    InfoHeader: { template: '<div><slot /></div>' },
                    ModalWrapper: { template: '<div><slot /></div>' },
                    TabsWrapper: { template: '<div><slot /></div>' },
                    TabItem: { template: '<div><slot /></div>' },
                    Vue3Lottie: true,
                    IconFolder: true,
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
                    ComponentDraft: true,
                  }
                }
              })

              await flushPromises()

              const revisiBtn = richWrapper.findAll('button').find((b) => b.text().includes('Revisi Data'))
              if (revisiBtn) {
                await revisiBtn.trigger('click')
              }

              expect(richWrapper.vm.isModalUnggahFSOpen).toBe(true)
              richWrapper.unmount()
            })

            it('should execute draft modal buttons from template (edit, batal, kirim)', async () => {
              mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValueOnce({
                data: {
                  pengelola: 'Test Pengelola',
                  pembina: 'Test Pembina',
                  mesins: [{ uuid_mesin: 1, id_status: 1, status: 'Draft', keterangan: 'draft' }]
                }
              })

              const richWrapper = mount(DetailFSMesin, {
                global: {
                  stubs: {
                    Loading: true,
                    InfoHeader: { template: '<div><slot /></div>' },
                    ModalWrapper: { template: '<div><slot /></div>' },
                    TabsWrapper: { template: '<div><slot /></div>' },
                    TabItem: { template: '<div><slot /></div>' },
                    Vue3Lottie: true,
                    IconFolder: true,
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
                    ComponentDraft: true,
                  }
                }
              })

              await flushPromises()

              const editBtn = richWrapper.findAll('button').find((b) => b.text().includes('Edit Data'))
              const kirimDataBtn = richWrapper.findAll('button').find((b) => b.text().includes('Kirim Data'))

              if (editBtn) {
                await editBtn.trigger('click')
              }
              expect(richWrapper.vm.isModalUnggahFSOpen).toBe(true)

              richWrapper.vm.isModalUnggahFSOpen = false
              await nextTick()

              if (kirimDataBtn) {
                await kirimDataBtn.trigger('click')
              }
              expect(richWrapper.vm.modalApprove).toBe(true)

              const batalBtn = richWrapper.findAll('button').find((b) => b.text().trim() === 'Batal')
              if (batalBtn) {
                await batalBtn.trigger('click')
              }
              expect(richWrapper.vm.modalApprove).toBe(false)

              if (kirimDataBtn) {
                await kirimDataBtn.trigger('click')
              }

              const kirimModalButtons = richWrapper.findAll('button').filter((b) => b.text().trim() === 'Kirim')
              const kirimModalBtn = kirimModalButtons[kirimModalButtons.length - 1]
              if (kirimModalBtn) {
                await kirimModalBtn.trigger('click')
              }

              expect(mockPersetujuanService.updateStatusFS).toHaveBeenCalled()
              richWrapper.unmount()
            })

            it('should render status sections across all status variants', async () => {
              const statuses = [
                'Ditolak T1',
                'Ditolak T2',
                'Disetujui',
                'Menunggu Persetujuan T1',
                'Menunggu Persetujuan T2',
                'Draft'
              ]

              for (const status of statuses) {
                mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValueOnce({
                  data: {
                    pengelola: 'Test Pengelola',
                    pembina: 'Test Pembina',
                    mesins: [{ uuid_mesin: 1, id_status: 1, status, keterangan: 'status-test' }]
                  }
                })

                const richWrapper = mount(DetailFSMesin, {
                  global: {
                    stubs: {
                      Loading: true,
                      InfoHeader: { template: '<div><slot /></div>' },
                      ModalWrapper: { template: '<div><slot /></div>' },
                      TabsWrapper: { template: '<div><slot /></div>' },
                      TabItem: { template: '<div><slot /></div>' },
                      Vue3Lottie: true,
                      IconFolder: true,
                      TableDataTeknis: true,
                      TableDataFinansial: true,
                      AsumsiMakro: true,
                      ParameterTeknis: true,
                      AkhirMasaManfaat: true,
                      TahunBerjalan: true,
                      ComponentDisetujui: { template: '<div>disetujui-chip</div>' },
                      ComponentDitolakT1: { template: '<div>ditolak-t1-chip</div>' },
                      ComponentDitolakT2: { template: '<div>ditolak-t2-chip</div>' },
                      ComponentWaitingT1: { template: '<div>waiting-t1-chip</div>' },
                      ComponentWaitingT2: { template: '<div>waiting-t2-chip</div>' },
                      ComponentDraft: { template: '<div>draft-chip</div>' },
                    }
                  }
                })

                await flushPromises()
                expect(richWrapper.vm.approveMesinFS.status).toBe(status)
                richWrapper.unmount()
              }
            })

            it('should execute fallback ternary branches with sparse mesin data', async () => {
              mockDetailRekapService.getMesinById.mockResolvedValueOnce({
                data: {
                  uuid_mesin: 1,
                  kode_sentral: 'SENTRAL01',
                  kode_mesin: 'MESIN01',
                  mesin: '',
                  kode_jenis_pembangkit: '',
                  kondisi_unit: '',
                  daya_terpasang: 0,
                  daya_mampu: 0,
                  tahun_operasi: '',
                  masa_manfaat: '',
                  nilai_asset_awal: 0,
                  tahun_nilai_perolehan: '',
                  photo1: '',
                  photo2: ''
                }
              })
              mockPersetujuanService.getPersetujuanFSSentral.mockResolvedValueOnce({
                data: {
                  pengelola: '',
                  pembina: '',
                  mesins: [{ uuid_mesin: 1, id_status: 0, status: 'Unknown', keterangan: '' }]
                }
              })
              mockFeasibilityStudyService.getDataTeknis.mockResolvedValueOnce({
                data: {
                  header: ['Parameter'],
                  tahun: [],
                  detail: []
                }
              })

              const sparseWrapper = mount(DetailFSMesin, {
                global: {
                  stubs: {
                    Loading: true,
                    InfoHeader: { template: '<div><slot /></div>' },
                    ModalWrapper: { template: '<div><slot /></div>' },
                    TabsWrapper: { template: '<div><slot /></div>' },
                    TabItem: { template: '<div><slot /></div>' },
                    Vue3Lottie: true,
                    IconFolder: true,
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
                    ComponentDraft: true,
                  }
                }
              })

              await flushPromises()
              expect(sparseWrapper.vm.approveMesinFS.status).toBe('Unknown')
              sparseWrapper.unmount()
            })
  })
})
