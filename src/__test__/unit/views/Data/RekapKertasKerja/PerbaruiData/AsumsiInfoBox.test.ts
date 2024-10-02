// File: AsumsiInfoBox.spec.ts
import { mount } from '@vue/test-utils';
import AsumsiInfoBox from '@/views/Data/RekapKertasKerja/PerbaruiData/AsumsiInfoBox.vue';

// Mock GlobalFormat service
jest.mock('@/services/format/global-format', () => {
  return jest.fn().mockImplementation(() => {
    return {
      formatRupiah: jest.fn((value) => `Rp ${value}`), // Mock formatRupiah
    };
  });
});

describe('AsumsiInfoBox.vue', () => {
  it('renders props.periode correctly', () => {
    const props = {
      periode: '2023',
      simulasiAsumsiMakro: {
        corporate_tax_rate: 25,
        discount_rate: 10,
        interest_rate: 5,
        loan_tenor: 15,
        loan_portion: 70,
        equity_portion: 30,
      },
    };

    const wrapper = mount(AsumsiInfoBox, {
      props,
    });

    // Assert: Periode dirender dengan benar
    expect(wrapper.find('span.text-primaryColor').text()).toBe(props.periode);
  });

  it('renders formatted corporate tax rate and other financial data', () => {
    const props = {
      periode: '2023',
      simulasiAsumsiMakro: {
        corporate_tax_rate: 25,
        discount_rate: 10,
        interest_rate: 5,
        loan_tenor: 15,
        loan_portion: 70,
        equity_portion: 30,
      },
    };

    const wrapper = mount(AsumsiInfoBox, {
      props,
    });

    // Assert: Properly renders corporate tax rate
    expect(wrapper.text()).toContain('Rp 25%');

    // Assert: Properly renders discount rate
    expect(wrapper.text()).toContain('Asumsi MakroPeriode2023Corporate Tax Rate Rp 25%Discount Rate WACC PLN / SHAPRp 10 %Interest RateRp 5 %Loan Tenor15 TahunLoan PortionRp 70 %Equity PortionRp 30 %');

    // Assert: Properly renders interest rate
    expect(wrapper.text()).toContain('Asumsi MakroPeriode2023Corporate Tax Rate Rp 25%Discount Rate WACC PLN / SHAPRp 10 %Interest RateRp 5 %Loan Tenor15 TahunLoan PortionRp 70 %Equity PortionRp 30 %');

    // Assert: Properly renders loan tenor
    expect(wrapper.text()).toContain('15 Tahun');

    // Assert: Properly renders loan portion
    expect(wrapper.text()).toContain('Asumsi MakroPeriode2023Corporate Tax Rate Rp 25%Discount Rate WACC PLN / SHAPRp 10 %Interest RateRp 5 %Loan Tenor15 TahunLoan PortionRp 70 %Equity PortionRp 30 %');

    // Assert: Properly renders equity portion
    expect(wrapper.text()).toContain('Asumsi MakroPeriode2023Corporate Tax Rate Rp 25%Discount Rate WACC PLN / SHAPRp 10 %Interest RateRp 5 %Loan Tenor15 TahunLoan PortionRp 70 %Equity PortionRp 30 %');
  });
});
