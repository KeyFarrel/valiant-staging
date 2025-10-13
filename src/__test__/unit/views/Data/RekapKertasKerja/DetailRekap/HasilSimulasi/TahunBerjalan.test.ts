import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TahunBerjalan from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/TahunBerjalan.vue';

// Mock GlobalFormat
vi.mock('@/services/format/global-format', () => ({
  default: class MockGlobalFormat {
    formatRupiah(value: any) {
      return value ? value.toString() : '0';
    }
  }
}));

describe('TahunBerjalan.vue', () => {
  const defaultProps = {
    irrOnProject: 22,
    irrOnEquity: 22,
    npvOnEquity: 6948,
    npvOnProject: 7649,
    averageNcf: 7,
    averageEaf: 7,
    isFetchingError: false
  };

  it('should render the component successfully with props', () => {
    const wrapper = mount(TahunBerjalan, {
      props: defaultProps
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('should render all financial metric cards when data is available', () => {
    const wrapper = mount(TahunBerjalan, {
      props: defaultProps
    });
    
    const cards = wrapper.findAll('.border-l-8');
    expect(cards).toHaveLength(4);
    
    // Check if all cards have the correct styling
    cards.forEach(card => {
      expect(card.classes()).toContain('border-l-[#0099AD]');
      expect(card.classes()).toContain('rounded-lg');
      expect(card.classes()).toContain('border');
    });
  });

  it('should display correct financial metrics content', () => {
    const wrapper = mount(TahunBerjalan, {
      props: defaultProps
    });
    
    // Check IRR section
    expect(wrapper.text()).toContain('Internal Rate of Return (IRR)');
    expect(wrapper.text()).toContain('IRR on Project');
    expect(wrapper.text()).toContain('IRR on Equity');
    
    // Check NPV section  
    expect(wrapper.text()).toContain('Net Present Value (NPV)');
    expect(wrapper.text()).toContain('NPV on Equity');
    expect(wrapper.text()).toContain('NPV on Project');
    
    // Check NCF and EAF sections
    expect(wrapper.text()).toContain('Average Net Capacity Factor (NCF)');
    expect(wrapper.text()).toContain('Average Equivalent Availability Factor (EAF)');
  });

  it('should display ReloadComponent when data is missing and fetching error occurs', () => {
    const wrapper = mount(TahunBerjalan, {
      props: {
        irrOnProject: 0,
        irrOnEquity: 0,
        npvOnEquity: 0,
        npvOnProject: 0,
        averageNcf: 0,
        averageEaf: 0,
        isFetchingError: true
      }
    });
    
    expect(wrapper.findComponent({ name: 'ReloadComponent' }).exists()).toBe(true);
  });

  it('should display ShimmerLoading when data is loading', () => {
    const wrapper = mount(TahunBerjalan, {
      props: {
        irrOnProject: 0,
        irrOnEquity: 0,
        npvOnEquity: 0,
        npvOnProject: 0,
        averageNcf: 0,
        averageEaf: 0,
        isFetchingError: false
      }
    });
    
    const shimmerComponents = wrapper.findAllComponents({ name: 'ShimmerLoading' });
    expect(shimmerComponents).toHaveLength(4);
  });

  it('should emit onClick event when ReloadComponent is clicked', async () => {
    const wrapper = mount(TahunBerjalan, {
      props: {
        irrOnProject: 0,
        irrOnEquity: 0,
        npvOnEquity: 0,
        npvOnProject: 0,
        averageNcf: 0,
        averageEaf: 0,
        isFetchingError: true
      }
    });
    
    const reloadComponent = wrapper.findComponent({ name: 'ReloadComponent' });
    await reloadComponent.vm.$emit('on-clicks');
    
    expect(wrapper.emitted('onClick')).toBeTruthy();
  });

  it('should emit onKeyDown event when ReloadComponent key is pressed', async () => {
    const wrapper = mount(TahunBerjalan, {
      props: {
        irrOnProject: 0,
        irrOnEquity: 0,
        npvOnEquity: 0,
        npvOnProject: 0,
        averageNcf: 0,
        averageEaf: 0,
        isFetchingError: true
      }
    });
    
    const reloadComponent = wrapper.findComponent({ name: 'ReloadComponent' });
    await reloadComponent.vm.$emit('on-key-down');
    
    expect(wrapper.emitted('onKeyDown')).toBeTruthy();
  });

  it('should display "NUM" when IRR values are empty strings', () => {
    const wrapper = mount(TahunBerjalan, {
      props: {
        irrOnProject: '',
        irrOnEquity: '',
        npvOnEquity: 6948,
        npvOnProject: 7649,
        averageNcf: 7,
        averageEaf: 7,
        isFetchingError: false
      }
    });
    
    expect(wrapper.text()).toContain('NUM');
  });
});