import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ParameterTeknisApprove from '@/components/ui/ParameterTeknisApprove.vue'

describe('ParameterTeknisApprove', () => {
  let wrapper: any
  
  const mockProps = {
    data: 'Test Data',
    status: 'Disetujui',
    tahun: 2024,
    dayaTerpasang: 1000000,
    dayaMampuNetto: 950,
    auxiliary: 5.5,
    susutTrafo: 2.0,
    pemakaianSendiri: 7.5,
    netPlantHeatRate: 8500,
    totalProjectCost: 5000000,
    loan: 3000000,
    equity: 2000000,
    electricityPriceA: 850,
    electricityPriceB: 900,
    electricityPriceC: 1200,
    electricityPriceD: 1250,
    comboBahanBakar: [
      {
        kode_bahan_bakar: 'BB001',
        bahan_bakar: 'Batubara',
        satuan_harga_bahan_bakar: 'Rupiah/ton',
        satuan_sfc: 'kg/kWh'
      }
    ],
    isFetchingError: false,
    bahanBakars: [
      {
        kode_bahan_bakar: 'BB001',
        harga_bahan_bakar: 800000,
        sfc: 0.45,
        flag_bahan_bakar: 1
      }
    ]
  }

  beforeEach(() => {
    wrapper = mount(ParameterTeknisApprove, {
      props: mockProps,
      global: {
        stubs: {
          ComponentDisetujui: true,
          ComponentDitolakT1: true,
          ComponentDitolakT2: true,
          ComponentWaitingT1: true,
          ComponentWaitingT2: true,
          ComponentDraft: true,
          ShimmerLoading: true,
          ReloadComponent: true
        }
      }
    })
  })

  it('should render component with correct title and periode data', () => {
    expect(wrapper.find('p').text()).toContain('Parameter Teknis & Finansial')
    expect(wrapper.text()).toContain('2024')
    expect(wrapper.text()).toContain('Test Data')
  })

  it('should display formatted technical data correctly', () => {
    expect(wrapper.text()).toContain('1.000,00 MW') // Daya Terpasang formatted
    expect(wrapper.text()).toContain('950,00 MW') // Daya Mampu Netto
    expect(wrapper.text()).toContain('5,50 %') // Auxiliary
  })

  it('should show fuel data when bahanBakars prop is provided', () => {
    expect(wrapper.text()).toContain('Bahan Bakar')
    expect(wrapper.text()).toContain('Batubara')
    expect(wrapper.text()).toContain('800.000')
  })
})