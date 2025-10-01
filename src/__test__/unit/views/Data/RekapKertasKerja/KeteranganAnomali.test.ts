import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from '@jest/globals';
import KeteranganAnomali from '@/components/RekapKertasKerja/KeteranganAnomali.vue';
import WarningIcon from '@/components/icons/WarningIcon.vue';
import CheckIcon from '@/components/icons/CheckIcon.vue';

describe('KeteranganAnomali', () => {
  let wrapper: any;

  const createWrapper = (props = {}) => {
    return mount(KeteranganAnomali, {
      props,
      global: {
        components: {
          WarningIcon,
          CheckIcon
        }
      }
    });
  };

  beforeEach(() => {
    wrapper?.unmount();
  });

  describe('Props & Default Values', () => {
    it('should render with default value of 0', () => {
      wrapper = createWrapper();
      expect(wrapper.vm.value).toBe(0);
    });

    it('should accept custom value prop', () => {
      const testValue = 12;
      wrapper = createWrapper({ value: testValue });
      expect(wrapper.vm.value).toBe(testValue);
    });
  });

  describe('Icon Rendering Logic', () => {
    it('should render CheckIcon when value is between 9 and 14 (exclusive)', async () => {
      // Test boundary values and middle values
      const normalValues = [10, 11, 12, 13];
      
      for (const value of normalValues) {
        wrapper = createWrapper({ value });
        await wrapper.vm.$nextTick();
        
        expect(wrapper.findComponent(CheckIcon).exists()).toBe(true);
        expect(wrapper.findComponent(WarningIcon).exists()).toBe(false);
      }
    });

    it('should render WarningIcon when value is NOT between 9 and 14 (exclusive)', async () => {
      // Test boundary and edge cases
      const anomalyValues = [0, 5, 9, 14, 15, 20, -5];
      
      for (const value of anomalyValues) {
        wrapper = createWrapper({ value });
        await wrapper.vm.$nextTick();
        
        expect(wrapper.findComponent(WarningIcon).exists()).toBe(true);
        expect(wrapper.findComponent(CheckIcon).exists()).toBe(false);
      }
    });
  });

  describe('Hover Functionality', () => {
    beforeEach(() => {
      wrapper = createWrapper({ value: 15 });
    });

    it('should initially hide tooltip', () => {
      expect(wrapper.vm.isHover).toBe(false);
      expect(wrapper.find('#tooltipContent').exists()).toBe(false);
    });

    it('should show tooltip when toggleButtonActive is called', async () => {
      wrapper.vm.toggleButtonActive();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.isHover).toBe(true);
      expect(wrapper.find('#tooltipContent').exists()).toBe(true);
    });

    it('should hide tooltip when toggleButtonDisabled is called', async () => {
      // Show tooltip first
      wrapper.vm.toggleButtonActive();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isHover).toBe(true);
      
      // Then hide it
      wrapper.vm.toggleButtonDisabled();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.isHover).toBe(false);
    });

    it('should toggle tooltip state correctly', async () => {
      // Initially false
      expect(wrapper.vm.isHover).toBe(false);
      
      // Toggle to true
      wrapper.vm.toggleButtonActive();
      expect(wrapper.vm.isHover).toBe(true);
      
      // Toggle to false
      wrapper.vm.toggleButtonDisabled();
      expect(wrapper.vm.isHover).toBe(false);
    });
  });

  describe('Tooltip Content', () => {
    beforeEach(async () => {
      wrapper = createWrapper({ value: 8 });
      wrapper.vm.toggleButtonActive();
      await wrapper.vm.$nextTick();
    });

    it('should display correct tooltip content structure', () => {
      const tooltip = wrapper.find('#tooltipContent');
      expect(tooltip.exists()).toBe(true);
      
      // Check if tooltip has correct classes
      expect(tooltip.classes()).toContain('bg-white');
      expect(tooltip.classes()).toContain('absolute');
      expect(tooltip.classes()).toContain('rounded-lg');
      expect(tooltip.classes()).toContain('border');
    });

    it('should display anomaly information correctly', () => {
      const tooltip = wrapper.find('#tooltipContent');
      const anomalyText = tooltip.text();
      
      expect(anomalyText).toContain('Anomali');
      expect(anomalyText).toContain(': 9% > IRR > 14%');
    });

    it('should display normal information correctly', () => {
      const tooltip = wrapper.find('#tooltipContent');
      const normalText = tooltip.text();
      
      expect(normalText).toContain('Normal');
      expect(normalText).toContain(': IRR 9% - 14%');
    });

    it('should have warning and normal indicator elements', () => {
      const tooltip = wrapper.find('#tooltipContent');
      
      // Check for warning icon (SVG)
      expect(tooltip.find('svg').exists()).toBe(true);
      
      // Check for normal indicator (green dot)
      expect(tooltip.find('.bg-green-500.rounded-lg').exists()).toBe(true);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should have correct container classes', () => {
      wrapper = createWrapper();
      const container = wrapper.find('.flex.flex-col.items-center');
      
      expect(container.exists()).toBe(true);
      expect(container.classes()).toContain('flex');
      expect(container.classes()).toContain('flex-col');
      expect(container.classes()).toContain('items-center');
    });

    it('should have cursor-pointer class on icons', async () => {
      // Test with CheckIcon
      wrapper = createWrapper({ value: 12 });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(CheckIcon).classes()).toContain('cursor-pointer');
      
      // Test with WarningIcon
      wrapper = createWrapper({ value: 8 });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(WarningIcon).classes()).toContain('cursor-pointer');
    });
  });

  describe('Transition Behavior', () => {
    beforeEach(() => {
      wrapper = createWrapper({ value: 5 });
    });

    it('should handle transition states correctly', async () => {
      // Initially hidden
      expect(wrapper.find('#tooltipContent').exists()).toBe(false);
      
      // Show tooltip
      wrapper.vm.toggleButtonActive();
      await wrapper.vm.$nextTick();
      
      const tooltip = wrapper.find('#tooltipContent');
      expect(tooltip.exists()).toBe(true);
      
      // Hide tooltip
      wrapper.vm.toggleButtonDisabled();
      await wrapper.vm.$nextTick();
      
      expect(wrapper.vm.isHover).toBe(false);
    });

    it('should maintain v-if reactivity', async () => {
      expect(wrapper.vm.isHover).toBe(false);
      expect(wrapper.find('#tooltipContent').exists()).toBe(false);
      
      wrapper.vm.isHover = true;
      await wrapper.vm.$nextTick();
      
      expect(wrapper.find('#tooltipContent').exists()).toBe(true);
      
      wrapper.vm.isHover = false;
      await wrapper.vm.$nextTick();
      
      expect(wrapper.find('#tooltipContent').exists()).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined/null values gracefully', () => {
      wrapper = createWrapper({ value: undefined });
      expect(() => wrapper.vm.$nextTick()).not.toThrow();
      
      wrapper = createWrapper({ value: null });
      expect(() => wrapper.vm.$nextTick()).not.toThrow();
    });

    it('should handle negative values', async () => {
      wrapper = createWrapper({ value: -10 });
      await wrapper.vm.$nextTick();
      
      expect(wrapper.findComponent(WarningIcon).exists()).toBe(true);
      expect(wrapper.findComponent(CheckIcon).exists()).toBe(false);
    });

    it('should handle very large values', async () => {
      wrapper = createWrapper({ value: 1000 });
      await wrapper.vm.$nextTick();
      
      expect(wrapper.findComponent(WarningIcon).exists()).toBe(true);
      expect(wrapper.findComponent(CheckIcon).exists()).toBe(false);
    });

    it('should handle decimal values', async () => {
      // Normal range
      wrapper = createWrapper({ value: 12.5 });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(CheckIcon).exists()).toBe(true);
      
      // Anomaly range
      wrapper = createWrapper({ value: 8.5 });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(WarningIcon).exists()).toBe(true);
    });
  });

  describe('Component Integration', () => {
    it('should properly integrate with imported icon components', () => {
      wrapper = createWrapper({ value: 12 });
      
      const checkIcon = wrapper.findComponent(CheckIcon);
      expect(checkIcon.exists()).toBe(true);
      expect(checkIcon.vm).toBeDefined();
    });

    it('should maintain reactivity when props change', async () => {
      wrapper = createWrapper({ value: 8 });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(WarningIcon).exists()).toBe(true);
      
      await wrapper.setProps({ value: 12 });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(CheckIcon).exists()).toBe(true);
      expect(wrapper.findComponent(WarningIcon).exists()).toBe(false);
    });
  });

  afterEach(() => {
    wrapper?.unmount();
  });
});
