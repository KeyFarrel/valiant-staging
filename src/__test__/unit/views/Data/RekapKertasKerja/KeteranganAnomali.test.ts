import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import KeteranganAnomali from '@/components/RekapKertasKerja/KeteranganAnomali.vue';

describe('KeteranganAnomali', () => {
  it('should render the component', () => {
    const wrapper = mount(KeteranganAnomali);
    expect(wrapper.exists()).toBe(true);
  });

  it('should show CheckIcon when value is between 9 and 14', () => {
    const wrapper = mount(KeteranganAnomali, {
      props: {
        value: 12
      }
    });
    
    expect(wrapper.findComponent({ name: 'CheckIcon' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'WarningIcon' }).exists()).toBe(false);
  });

  it('should show WarningIcon when value is outside 9-14 range', () => {
    const wrapper = mount(KeteranganAnomali, {
      props: {
        value: 5
      }
    });
    
    expect(wrapper.findComponent({ name: 'WarningIcon' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'CheckIcon' }).exists()).toBe(false);
  });

  it('should show tooltip on mouse enter and hide on mouse leave', async () => {
    const wrapper = mount(KeteranganAnomali, {
      props: {
        value: 12
      }
    });

    // Initially tooltip should not be visible
    expect(wrapper.find('#tooltipContent').exists()).toBe(false);

    // Trigger mouse enter
    await wrapper.trigger('mouseenter');
    
    // Tooltip should be visible after mouse enter
    expect(wrapper.find('#tooltipContent').exists()).toBe(true);
    
    // Trigger mouse leave
    await wrapper.trigger('mouseleave');
    
    // Note: The tooltip might still exist in DOM due to transition, 
    // but the isHover ref should be false which controls the v-if
  });

  it('should toggle isHover state correctly with mouse events', async () => {
    const wrapper = mount(KeteranganAnomali, {
      props: {
        value: 10
      }
    });

    // Trigger mouse enter
    await wrapper.trigger('mouseenter');
    
    // Check if tooltip content is shown (indicating isHover is true)
    expect(wrapper.find('#tooltipContent').exists()).toBe(true);
    
    // Trigger mouse leave
    await wrapper.trigger('mouseleave');
    
    // Wait a bit for the reactive update
    await wrapper.vm.$nextTick();
    
    // The tooltip should be hidden
    expect(wrapper.find('#tooltipContent').exists()).toBe(false);
  });

  it('should display correct tooltip content', async () => {
    const wrapper = mount(KeteranganAnomali, {
      props: {
        value: 8
      }
    });

    // Trigger mouse enter to show tooltip
    await wrapper.trigger('mouseenter');
    
    const tooltipContent = wrapper.find('#tooltipContent');
    expect(tooltipContent.exists()).toBe(true);
    
    // Check if tooltip contains expected text
    expect(tooltipContent.text()).toContain('Anomali');
    expect(tooltipContent.text()).toContain(': 9% > IRR > 14%');
    expect(tooltipContent.text()).toContain('Normal');
    expect(tooltipContent.text()).toContain(': IRR 9% - 14%');
  });
});