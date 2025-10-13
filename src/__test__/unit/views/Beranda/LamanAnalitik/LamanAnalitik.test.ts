import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LamanAnalitik from '@/views/Beranda/LamanAnalitik/LamanAnalitik.vue';

// Mock the child components
vi.mock('@/views/Beranda/LamanAnalitik/TabPage/FinansialTab.vue', () => ({
  default: {
    name: 'FinansialPage',
    template: '<div data-testid="finansial-tab">Finansial Content</div>',
  },
}));

vi.mock('@/views/Beranda/LamanAnalitik/TabPage/TeknisTab.vue', () => ({
  default: {
    name: 'TeknisPage', 
    template: '<div data-testid="teknis-tab">Teknis Content</div>',
  },
}));

describe('LamanAnalitik', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(LamanAnalitik);
  });

  it('should render component correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.flex').exists()).toBe(true);
  });

  it('should render finansial tab by default', () => {
    const finansialButton = wrapper.find('button');
    expect(finansialButton.text()).toBe('Finansial');
    expect(finansialButton.classes()).toContain('text-[#0099AD]');
  });

  it('should show finansial content by default', () => {
    expect(wrapper.vm.currentTab).toBe('finansial');
    expect(wrapper.find('[data-testid="finansial-tab"]').exists()).toBe(true);
  });

  // Additional tests to cover uncovered lines
  it('should switch to teknis tab when teknis button is clicked', async () => {
    const buttons = wrapper.findAll('button');
    const teknisButton = buttons[1]; // Second button is the teknis button
    
    await teknisButton.trigger('click');
    
    expect(wrapper.vm.currentTab).toBe('teknis');
    expect(wrapper.find('[data-testid="teknis-tab"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="finansial-tab"]').exists()).toBe(false);
  });

  it('should call showContent function when clicking buttons', async () => {
    const showContentSpy = vi.spyOn(wrapper.vm, 'showContent');
    const buttons = wrapper.findAll('button');
    
    await buttons[0].trigger('click'); // Finansial button
    expect(showContentSpy).toHaveBeenCalledWith('finansial');
    
    await buttons[1].trigger('click'); // Teknis button  
    expect(showContentSpy).toHaveBeenCalledWith('teknis');
  });

  it('should apply correct CSS classes based on active tab', async () => {
    const buttons = wrapper.findAll('button');
    const finansialButton = buttons[0];
    const teknisButton = buttons[1];

    // Initially finansial should be active
    expect(finansialButton.classes()).toContain('text-[#0099AD]');
    expect(teknisButton.classes()).toContain('text-gray-600');
    expect(teknisButton.classes()).toContain('border-transparent');

    // Switch to teknis tab
    await teknisButton.trigger('click');
    
    expect(teknisButton.classes()).toContain('text-[#0099AD]');
    expect(finansialButton.classes()).toContain('text-gray-600');
    expect(finansialButton.classes()).toContain('border-transparent');
  });
});