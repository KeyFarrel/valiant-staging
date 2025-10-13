import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AsumsiMakroApprove from '@/components/ui/AsumsiMakroApprove.vue'

// Mock the GlobalFormat class
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatEnergy(value: any) {
      return value?.toString() || '0'
    }
  }
}))

describe('AsumsiMakroApprove', () => {
  const defaultProps = {
    data: 'Test Data',
    status: 'Disetujui',
    tahun: 2024,
    corporateTaxRate: 25,
    discountRate: 10,
    interestRate: 8,
    loanTenor: 15,
    loanPortion: 70,
    equityPortion: 30,
    isFetchingError: false
  }

  it('should render component with all data properly', () => {
    const wrapper = mount(AsumsiMakroApprove, {
      props: defaultProps
    })

    expect(wrapper.find('p').text()).toContain('Asumsi Makro')
    expect(wrapper.text()).toContain('2024')
    expect(wrapper.text()).toContain('Test Data')
    expect(wrapper.text()).toContain('25')
    expect(wrapper.text()).toContain('30')
  })

  it('should display shimmer loading when data is not available', () => {
    const wrapper = mount(AsumsiMakroApprove, {
      props: {
        ...defaultProps,
        corporateTaxRate: '',
        equityPortion: ''
      }
    })

    expect(wrapper.findComponent({ name: 'ShimmerLoading' }).exists()).toBe(true)
  })

  it('should emit onClick event when reload component is clicked', async () => {
    const wrapper = mount(AsumsiMakroApprove, {
      props: {
        ...defaultProps,
        corporateTaxRate: '',
        equityPortion: '',
        isFetchingError: true
      }
    })

    const reloadComponent = wrapper.findComponent({ name: 'ReloadComponent' })
    expect(reloadComponent.exists()).toBe(true)
    
    await reloadComponent.vm.$emit('on-clicks')
    expect(wrapper.emitted('onClick')).toBeTruthy()
  })

  it('should render different status components based on props', () => {
    const statusTests = [
      { status: 'Ditolak T1', component: 'ComponentDitolakT1' },
      { status: 'Ditolak T2', component: 'ComponentDitolakT2' },
      { status: 'Menunggu Persetujuan T1', component: 'ComponentWaitingT1' },
      { status: 'Menunggu Persetujuan T2', component: 'ComponentWaitingT2' },
      { status: 'Draft', component: 'ComponentDraft' }
    ]

    statusTests.forEach(({ status, component }) => {
      const wrapper = mount(AsumsiMakroApprove, {
        props: {
          ...defaultProps,
          status
        }
      })
      
      expect(wrapper.findComponent({ name: component }).exists()).toBe(true)
    })
  })

  it('should emit onKeyDown event when reload component triggers key event', async () => {
    const wrapper = mount(AsumsiMakroApprove, {
      props: {
        ...defaultProps,
        corporateTaxRate: '',
        equityPortion: '',
        isFetchingError: true
      }
    })

    const reloadComponent = wrapper.findComponent({ name: 'ReloadComponent' })
    await reloadComponent.vm.$emit('on-key-down')
    expect(wrapper.emitted('onKeyDown')).toBeTruthy()
  })

  it('should handle dash values properly in display', () => {
    const wrapper = mount(AsumsiMakroApprove, {
      props: {
        ...defaultProps,
        tahun: '-',
        corporateTaxRate: '-',
        discountRate: '-',
        interestRate: '-',
        loanTenor: '-',
        loanPortion: '-',
        equityPortion: '-'
      }
    })

    // Check that dash values are displayed as dash
    expect(wrapper.text()).toContain('-')
    // Component should still render the main structure
    expect(wrapper.find('p').text()).toContain('Asumsi Makro')
  })

  it('should format numbers correctly using GlobalFormat', () => {
    const wrapper = mount(AsumsiMakroApprove, {
      props: {
        ...defaultProps,
        corporateTaxRate: 25.5,
        discountRate: 10.25,
        loanPortion: 70.75
      }
    })

    // Check that numbers are formatted (mocked to return string version)
    expect(wrapper.text()).toContain('25.5')
    expect(wrapper.text()).toContain('10.25')
    expect(wrapper.text()).toContain('70.75')
  })
})