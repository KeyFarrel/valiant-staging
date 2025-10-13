import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Proyeksi from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/Proyeksi.vue';

describe('Proyeksi.vue', () => {
  it('should render the component successfully', () => {
    const wrapper = mount(Proyeksi);
    expect(wrapper.exists()).toBe(true);
  });

  it('should render all financial metric cards', () => {
    const wrapper = mount(Proyeksi);
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
    const wrapper = mount(Proyeksi);
    
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
});