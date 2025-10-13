import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import AsumsiInfoBox from '@/views/Data/RekapKertasKerja/PerbaruiData/AsumsiInfoBox.vue';

const mockProps = {
  simulasiAsumsiMakro: {
    corporate_tax_rate: 25,
    discount_rate: 8.5,
    interest_rate: 12,
    loan_tenor: 15,
    loan_portion: 70,
    equity_portion: 30
  },
  periode: '2024-2025'
};

describe('AsumsiInfoBox', () => {
  it('should render the component successfully', () => {
    const wrapper = mount(AsumsiInfoBox, {
      props: mockProps
    });
    
    expect(wrapper.exists()).toBe(true);
  });

  it('should display the correct periode in header', () => {
    const wrapper = mount(AsumsiInfoBox, {
      props: mockProps
    });
    
    const periodeElement = wrapper.find('.text-primaryColor');
    expect(periodeElement.text()).toBe('2024-2025');
  });

  it('should display Asumsi Makro title', () => {
    const wrapper = mount(AsumsiInfoBox, {
      props: mockProps
    });
    
    const titleElement = wrapper.find('.text-base.font-bold');
    expect(titleElement.text()).toBe('Asumsi Makro');
  });
});