import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FeasibilityStudy from '@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudy.vue'
import TableComponent from '@/components/ui/Table.vue'

// Mock the TableComponent
vi.mock('@/components/ui/Table.vue', () => ({
  default: {
    name: 'TableComponent',
    template: `
      <div class="table-component">
        <table>
          <thead>
            <slot name="table-header" />
          </thead>
          <tbody>
            <slot name="table-body" />
          </tbody>
        </table>
      </div>
    `,
  },
}))

// Mock RouterLink
vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    props: ['to'],
    template: '<a><slot /></a>',
  },
}))

// Mock GlobalFormat
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatRupiah(value: number) {
      return `Rp ${value?.toLocaleString('id-ID') || '0'}`
    }
  }
}))

describe('FeasibilityStudy', () => {
  const mockSource = {
    tahun: '2024',
    irr_on_equity: 15.5,
    npv_on_equity: 1000000,
    status: 'Draft',
    uuid_sentral: 'test-uuid-123'
  }

  it('should render component successfully', () => {
    const wrapper = mount(FeasibilityStudy, {
      props: {
        source: mockSource
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent(TableComponent).exists()).toBe(true)
  })

  it('should display data when source is provided', () => {
    const wrapper = mount(FeasibilityStudy, {
      props: {
        source: mockSource
      }
    })

    const tableBody = wrapper.find('tbody')
    expect(tableBody.text()).toContain('2024')
    expect(tableBody.text()).toContain('15.5')
    expect(tableBody.text()).toContain('Draft')
  })

  it('should show "Data Tidak Tersedia" when source is null', () => {
    const wrapper = mount(FeasibilityStudy, {
      props: {
        source: null
      }
    })

    const tableBody = wrapper.find('tbody')
    expect(tableBody.text()).toContain('Data Tidak Tersedia')
    expect(tableBody.text()).toContain('Silahkan lakukan pengisian atau hubungi unit terkait')
  })

  describe('Status rendering', () => {
    it('should display "Ditolak oleh Pembina" for status "Ditolak T1"', () => {
      const wrapper = mount(FeasibilityStudy, {
        props: {
          source: { ...mockSource, status: 'Ditolak T1' }
        }
      })

      expect(wrapper.text()).toContain('Ditolak oleh Pembina')
    })

    it('should display "Ditolak oleh Pengelola" for status "Ditolak T2"', () => {
      const wrapper = mount(FeasibilityStudy, {
        props: {
          source: { ...mockSource, status: 'Ditolak T2' }
        }
      })

      expect(wrapper.text()).toContain('Ditolak oleh Pengelola')
    })

    it('should display "Disetujui" for status "Disetujui"', () => {
      const wrapper = mount(FeasibilityStudy, {
        props: {
          source: { ...mockSource, status: 'Disetujui' }
        }
      })

      expect(wrapper.text()).toContain('Disetujui')
    })

    it('should display "Menunggu Persetujuan Pembina" for status "Menunggu Persetujuan T1"', () => {
      const wrapper = mount(FeasibilityStudy, {
        props: {
          source: { ...mockSource, status: 'Menunggu Persetujuan T1' }
        }
      })

      expect(wrapper.text()).toContain('Menunggu Persetujuan Pembina')
    })

    it('should display "Menunggu Persetujuan Pengelola" for status "Menunggu Persetujuan T2"', () => {
      const wrapper = mount(FeasibilityStudy, {
        props: {
          source: { ...mockSource, status: 'Menunggu Persetujuan T2' }
        }
      })

      expect(wrapper.text()).toContain('Menunggu Persetujuan Pengelola')
    })
  })

  it('should format currency using GlobalFormat', () => {
    const wrapper = mount(FeasibilityStudy, {
      props: {
        source: { ...mockSource, npv_on_equity: 2500000 }
      }
    })

    expect(wrapper.text()).toContain('Rp 2.500.000')
  })

  it('should render RouterLink with correct props', () => {
    const wrapper = mount(FeasibilityStudy, {
      props: {
        source: mockSource
      },
      global: {
        components: {
          RouterLink: {
            name: 'RouterLink',
            props: ['to'],
            template: '<a><slot /></a>',
          }
        }
      }
    })

    const routerLink = wrapper.findComponent({ name: 'RouterLink' })
    expect(routerLink.exists()).toBe(true)
    expect(routerLink.props('to')).toEqual({
      name: 'persetujuan-fs',
      query: { uuid_sentral: 'test-uuid-123' }
    })
  })

  it('should display "-" when tahun is empty or null', () => {
    const wrapper = mount(FeasibilityStudy, {
      props: {
        source: { ...mockSource, tahun: null }
      }
    })

    const tableBody = wrapper.find('tbody')
    expect(tableBody.text()).toContain('-')
  })

  it('should handle pagination elements', () => {
    const wrapper = mount(FeasibilityStudy, {
      props: {
        source: mockSource
      }
    })

    expect(wrapper.text()).toContain('Menampilkan')
    expect(wrapper.text()).toContain('dari 5 data')
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.findAll('button').length).toBeGreaterThan(0)
  })
})