import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AkhirMasaManfaat from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue'

// Mock GlobalFormat
vi.mock('@/services/format/global-format', () => ({
  default: class {
    formatRupiah(value: number | string) {
      return value.toString()
    }
  }
}))

describe('AkhirMasaManfaat', () => {
  const defaultProps = {
    irrOnProject: 10.5,
    irrOnEquity: 12.3,
    npvOnEquity: 1000000,
    npvOnProject: 1500000,
    averageNcf: 85.2,
    averageEaf: 90.1,
    isFetchingError: false,
    idMesin: 1
  }

  it('should render component successfully with all props', () => {
    const wrapper = mount(AkhirMasaManfaat, {
      props: defaultProps
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.grid-cols-2').exists()).toBe(true)
  })

  it('should display IRR values correctly', () => {
    const wrapper = mount(AkhirMasaManfaat, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Internal Rate of Return (IRR)')
    expect(wrapper.text()).toContain('IRR on Project')
    expect(wrapper.text()).toContain('IRR on Equity')
  })

  it('should display NPV values correctly', () => {
    const wrapper = mount(AkhirMasaManfaat, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Net Present Value (NPV)')
    expect(wrapper.text()).toContain('NPV on Project')
    expect(wrapper.text()).toContain('NPV on Equity')
  })

  it('should show ReloadComponent when there is fetching error and missing required data', () => {
    const wrapper = mount(AkhirMasaManfaat, {
      props: {
        ...defaultProps,
        isFetchingError: true,
        irrOnEquity: '', // missing data
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0
      }
    })

    expect(wrapper.findComponent({ name: 'ReloadComponent' }).exists()).toBe(true)
  })

  it('should emit onClick and onKeyDown events from ReloadComponent', async () => {
    const wrapper = mount(AkhirMasaManfaat, {
      props: {
        ...defaultProps,
        isFetchingError: true,
        irrOnEquity: '', // missing data
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0
      }
    })

    const reloadComponent = wrapper.findComponent({ name: 'ReloadComponent' })
    
    // Test onClick emit
    await reloadComponent.vm.$emit('on-clicks')
    expect(wrapper.emitted('onClick')).toBeTruthy()

    // Test onKeyDown emit
    await reloadComponent.vm.$emit('on-key-down')
    expect(wrapper.emitted('onKeyDown')).toBeTruthy()
  })

  it('should show ShimmerLoading when data is loading (no error and missing data)', () => {
    const wrapper = mount(AkhirMasaManfaat, {
      props: {
        ...defaultProps,
        isFetchingError: false,
        irrOnEquity: '', // missing data but no error
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0
      }
    })

    const shimmerComponents = wrapper.findAllComponents({ name: 'ShimmerLoading' })
    expect(shimmerComponents.length).toBe(4) // Should have 4 shimmer loading components
  })

  it('should display "NUM" when IRR values are empty strings', () => {
    const wrapper = mount(AkhirMasaManfaat, {
      props: {
        ...defaultProps,
        irrOnProject: '',
        irrOnEquity: ''
      }
    })

    expect(wrapper.text()).toContain('NUM')
  })
})