import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Periode from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/Periode.vue';

describe('Periode.vue', () => {
  it('should render the component successfully', () => {
    const wrapper = mount(Periode);
    expect(wrapper.exists()).toBe(true);
  });

  it('should display the correct title', () => {
    const wrapper = mount(Periode);
    const title = wrapper.find('h3');
    expect(title.text()).toBe('Periode');
    expect(title.classes()).toContain('text-lg');
    expect(title.classes()).toContain('font-semibold');
  });

  it('should render all financial metric cards', () => {
    const wrapper = mount(Periode);
    const cards = wrapper.findAll('.border-l-8');
    expect(cards).toHaveLength(4);
    
    // Check if all cards have the correct styling
    cards.forEach(card => {
      expect(card.classes()).toContain('border-l-[#0099AD]');
      expect(card.classes()).toContain('rounded-lg');
      expect(card.classes()).toContain('border');
    });
  });
});