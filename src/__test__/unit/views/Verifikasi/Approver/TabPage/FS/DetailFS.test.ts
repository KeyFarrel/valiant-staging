import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import DetailFS from '@/views/Verifikasi/Approver/TabPage/FS/DetailFS.vue'
import PersetujuanService from '@/services/persetujuan-service'

// Mock PersetujuanService
vi.mock('@/services/persetujuan-service')

// Mock vue-router
const mockRoute = {
  query: {
    uuid_sentral: 'test-uuid-123'
  }
}

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute
}))

// Mock components
vi.mock('@/components/ui/LoadingSpinner.vue', () => ({
  default: {
    name: 'Loading',
    template: '<div data-testid="loading">Loading...</div>'
  }
}))

vi.mock('@/components/ui/InfoHeader.vue', () => ({
  default: {
    name: 'InfoHeader',
    props: [
      'namaMesin', 'namaPengelola', 'namaPembina', 'kodeJenisPembangkit',
      'dayaTerpasang', 'dayaMampu', 'tahunOperasi', 'umurTeknis', 'kondisiUnit'
    ],
    template: '<div data-testid="info-header">Info Header</div>'
  }
}))

describe('DetailFS.vue', () => {
  let persetujuanServiceMock: any

  beforeEach(() => {
    persetujuanServiceMock = {
      getPersetujuanFSSentral: vi.fn()
    }
    vi.mocked(PersetujuanService).mockImplementation(function() { return persetujuanServiceMock; })
  })

  it('should render component successfully', () => {
    const wrapper = mount(DetailFS)
    expect(wrapper.exists()).toBe(true)
  })

  it('should call fetchPersetujuanFS on mount', async () => {
    persetujuanServiceMock.getPersetujuanFSSentral.mockResolvedValue({
      data: {
        sentral: 'Test Sentral'
      }
    })

    mount(DetailFS)
    await nextTick()
    
    expect(persetujuanServiceMock.getPersetujuanFSSentral).toHaveBeenCalledWith({
      uuid_sentral: 'test-uuid-123'
    })
  })

  it('should have download evidence button', async () => {
    persetujuanServiceMock.getPersetujuanFSSentral.mockResolvedValue({
      data: {
        sentral: 'Test Sentral',
        pengelola: 'Test Pengelola',
        pembina: 'Test Pembina',
        jenis_kit: 'PLTU',
        daya_terpasang: '100',
        daya_mampu: '90',
        tahun_operasi: '2020',
        umur_teknis: '25',
        kondisi_unit: 'Baik'
      }
    })

    const wrapper = mount(DetailFS)
    await nextTick()
    await wrapper.vm.$nextTick()
    
    const downloadButton = wrapper.find('button')
    expect(downloadButton.exists()).toBe(true)
    expect(downloadButton.text()).toContain('Download Evidence')
  })
})