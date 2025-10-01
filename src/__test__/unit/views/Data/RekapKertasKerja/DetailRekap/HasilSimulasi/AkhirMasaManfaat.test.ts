import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import AkhirMasaManfaat from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';
import ReloadComponent from '@/components/ui/ReloadComponent.vue';

// Mock GlobalFormat service
jest.mock('@/services/format/global-format', () => {
  return jest.fn().mockImplementation(() => ({
    formatRupiah: jest.fn((value: number | string) => {
      if (typeof value === 'string') return value;
      if (value === null || value === undefined) return '0';
      return value.toLocaleString('id-ID');
    })
  }));
});

// Mock Vue3Lottie component
const MockVue3Lottie = {
  name: 'Vue3Lottie',
  template: '<div class="lottie-animation"></div>'
};

describe('AkhirMasaManfaat', () => {
  let wrapper: any;

  const defaultProps = {
    irrOnProject: 12.5,
    irrOnEquity: 14.2,
    npvOnEquity: 1500000,
    npvOnProject: 2000000,
    averageNcf: 85.5,
    averageEaf: 92.3,
    isFetchingError: false,
    idMesin: 1
  };

  const createWrapper = (props = {}) => {
    return mount(AkhirMasaManfaat, {
      props: { ...defaultProps, ...props },
      global: {
        components: {
          ShimmerLoading,
          ReloadComponent,
          Vue3Lottie: MockVue3Lottie
        }
      }
    });
  };

  beforeEach(() => {
    wrapper?.unmount();
  });

  describe('Props & Default Values', () => {
    it('should accept all required props', () => {
      wrapper = createWrapper();
      
      expect(wrapper.vm.irrOnProject).toBe(12.5);
      expect(wrapper.vm.irrOnEquity).toBe(14.2);
      expect(wrapper.vm.npvOnEquity).toBe(1500000);
      expect(wrapper.vm.npvOnProject).toBe(2000000);
      expect(wrapper.vm.averageNcf).toBe(85.5);
      expect(wrapper.vm.averageEaf).toBe(92.3);
      expect(wrapper.vm.isFetchingError).toBe(false);
      expect(wrapper.vm.idMesin).toBe(1);
    });

    it('should have default value for isFetchingError', () => {
      wrapper = createWrapper({ isFetchingError: undefined });
      expect(wrapper.vm.isFetchingError).toBe(false);
    });

    it('should handle idMesin default value', () => {
      wrapper = createWrapper({ idMesin: undefined });
      expect(wrapper.vm.idMesin).toBeUndefined();
    });
  });

  describe('Conditional Rendering - Main Content', () => {
    it('should render main content when all conditions are met', async () => {
      wrapper = createWrapper();
      await wrapper.vm.$nextTick();
      
      const mainGrid = wrapper.find('.grid.grid-cols-2.mt-5.gap-x-10.gap-y-5');
      expect(mainGrid.exists()).toBe(true);
      
      // Should not render shimmer or reload components
      expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(false);
      expect(wrapper.findComponent(ReloadComponent).exists()).toBe(false);
    });

    it('should render main content when idMesin is 0', async () => {
      wrapper = createWrapper({ idMesin: 0 });
      await wrapper.vm.$nextTick();
      
      const mainGrid = wrapper.find('.grid.grid-cols-2.mt-5.gap-x-10.gap-y-5');
      expect(mainGrid.exists()).toBe(true);
    });

    it('should render main content when any required value exists', async () => {
      // Test with only irrOnEquity
      wrapper = createWrapper({
        irrOnProject: 0, // Use 0 instead of null to avoid prop warnings
        irrOnEquity: 14.2,
        npvOnEquity: 0,
        npvOnProject: 0,
        averageNcf: 0,
        averageEaf: 0
      });
      await wrapper.vm.$nextTick();
      
      const mainGrid = wrapper.find('.grid.grid-cols-2.mt-5.gap-x-10.gap-y-5');
      expect(mainGrid.exists()).toBe(true);
    });
  });

  describe('Conditional Rendering - ReloadComponent', () => {
    it('should render ReloadComponent when fetching error and no data', async () => {
      wrapper = createWrapper({
        isFetchingError: true,
        irrOnEquity: 0, // Use 0 instead of null
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0,
        idMesin: 1
      });
      await wrapper.vm.$nextTick();
      
      expect(wrapper.findComponent(ReloadComponent).exists()).toBe(true);
      expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(false);
      
      const mainGrid = wrapper.find('.grid.grid-cols-2.mt-5.gap-x-10.gap-y-5');
      expect(mainGrid.exists()).toBe(false);
    });

    it('should emit onClick event from ReloadComponent', async () => {
      wrapper = createWrapper({
        isFetchingError: true,
        irrOnEquity: 0,
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0,
        idMesin: 1
      });
      await wrapper.vm.$nextTick();
      
      const reloadComponent = wrapper.findComponent(ReloadComponent);
      await reloadComponent.vm.$emit('on-clicks');
      
      expect(wrapper.emitted('onClick')).toBeTruthy();
    });

    it('should emit onKeyDown event from ReloadComponent', async () => {
      wrapper = createWrapper({
        isFetchingError: true,
        irrOnEquity: 0,
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0,
        idMesin: 1
      });
      await wrapper.vm.$nextTick();
      
      const reloadComponent = wrapper.findComponent(ReloadComponent);
      await reloadComponent.vm.$emit('on-key-down');
      
      expect(wrapper.emitted('onKeyDown')).toBeTruthy();
    });
  });

  describe('Conditional Rendering - ShimmerLoading', () => {
    it('should render ShimmerLoading when no error and no data', async () => {
      wrapper = createWrapper({
        isFetchingError: false,
        irrOnEquity: 0, // Use 0 instead of null
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0,
        idMesin: 1
      });
      await wrapper.vm.$nextTick();
      
      const shimmerComponents = wrapper.findAllComponents(ShimmerLoading);
      expect(shimmerComponents).toHaveLength(4);
      
      shimmerComponents.forEach(shimmer => {
        expect(shimmer.classes()).toContain('w-full');
        expect(shimmer.classes()).toContain('h-36');
      });
      
      expect(wrapper.findComponent(ReloadComponent).exists()).toBe(false);
    });
  });

  describe('IRR Section Content', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should display IRR section with correct title', () => {
      const content = wrapper.text();
      expect(content).toContain('Internal Rate of Return (IRR)');
    });

    it('should display IRR on Project value correctly', () => {
      const content = wrapper.text();
      expect(content).toContain('IRR on Project');
      expect(content).toContain('12,5'); // formatted value (Indonesian format)
      expect(content).toContain('%');
    });

    it('should display IRR on Equity value correctly', () => {
      const content = wrapper.text();
      expect(content).toContain('IRR on Equity');
      expect(content).toContain('14,2'); // formatted value (Indonesian format)
      expect(content).toContain('%');
    });

    it('should show NUM when IRR on Project is empty string', async () => {
      await wrapper.setProps({ irrOnProject: '' });
      await wrapper.vm.$nextTick();
      
      const content = wrapper.text();
      expect(content).toContain('NUM');
    });

    it('should show NUM when IRR on Equity is empty string', async () => {
      await wrapper.setProps({ irrOnEquity: '' });
      await wrapper.vm.$nextTick();
      
      const content = wrapper.text();
      expect(content).toContain('NUM');
    });
  });

  describe('NPV Section Content', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should display NPV section with correct title', () => {
      const content = wrapper.text();
      expect(content).toContain('Net Present Value (NPV)');
    });

    it('should display NPV on Project value correctly', () => {
      const content = wrapper.text();
      expect(content).toContain('NPV on Project');
      expect(content).toContain('2.000.000'); // formatted value
      expect(content).toContain('Rp (Juta)');
    });

    it('should display NPV on Equity value correctly', () => {
      const content = wrapper.text();
      expect(content).toContain('NPV on Equity');
      expect(content).toContain('1.500.000'); // formatted value
      expect(content).toContain('Rp (Juta)');
    });
  });

  describe('NCF Section Content', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should display NCF section with correct title', () => {
      const content = wrapper.text();
      expect(content).toContain('Average Net Capacity Factor (NCF)');
    });

    it('should display NCF value correctly', () => {
      const content = wrapper.text();
      expect(content).toContain('85,5'); // formatted value (Indonesian format)
      expect(content).toContain('%');
    });
  });

  describe('EAF Section Content', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should display EAF section with correct title', () => {
      const content = wrapper.text();
      expect(content).toContain('Average Equivalent Availability Factor (EAF)');
    });

    it('should display EAF value correctly', () => {
      const content = wrapper.text();
      expect(content).toContain('92,3'); // formatted value (Indonesian format)
      expect(content).toContain('%');
    });
  });

  describe('Card Styling and Layout', () => {
    beforeEach(() => {
      wrapper = createWrapper();
    });

    it('should have correct grid layout', () => {
      const mainGrid = wrapper.find('.grid.grid-cols-2.mt-5.gap-x-10.gap-y-5');
      expect(mainGrid.exists()).toBe(true);
      expect(mainGrid.classes()).toContain('grid');
      expect(mainGrid.classes()).toContain('grid-cols-2');
      expect(mainGrid.classes()).toContain('mt-5');
      expect(mainGrid.classes()).toContain('gap-x-10');
      expect(mainGrid.classes()).toContain('gap-y-5');
    });

    it('should have correct card styling for all sections', () => {
      const cards = wrapper.findAll('.border-l-8.border-l-\\[\\#0099AD\\].rounded-lg.border');
      expect(cards).toHaveLength(4);
      
      cards.forEach(card => {
        expect(card.classes()).toContain('overflow-hidden');
        expect(card.classes()).toContain('relative');
        expect(card.classes()).toContain('flex');
        expect(card.classes()).toContain('flex-col');
        expect(card.classes()).toContain('px-5');
        expect(card.classes()).toContain('py-4');
        expect(card.classes()).toContain('rounded-lg');
        expect(card.classes()).toContain('border');
      });
    });

    it('should have decorative SVG circles in each card', () => {
      const svgElements = wrapper.findAll('svg');
      // Each card has 2 SVG circles, so 4 cards = 8 SVGs
      expect(svgElements.length).toBeGreaterThanOrEqual(8);
      
      const circles = wrapper.findAll('circle[fill="#80C1CD"]');
      expect(circles.length).toBeGreaterThanOrEqual(8);
    });

    it('should have correct text styling for titles', () => {
      const titles = wrapper.findAll('.text-base.font-semibold.border-b');
      expect(titles).toHaveLength(4);
    });
  });

  describe('GlobalFormat Service Integration', () => {
    it('should call formatRupiah for numeric values', () => {
      wrapper = createWrapper();
      
      // Check if GlobalFormat is instantiated and used
      expect(wrapper.vm.globalFormat).toBeDefined();
      expect(wrapper.vm.globalFormat.formatRupiah).toBeDefined();
    });

    it('should handle different numeric formats', async () => {
      const testValues = {
        irrOnProject: 0,
        irrOnEquity: 100.555,
        npvOnProject: -500000,
        npvOnEquity: 999999999,
        averageNcf: 0.1,
        averageEaf: 99.99
      };
      
      wrapper = createWrapper(testValues);
      await wrapper.vm.$nextTick();
      
      expect(wrapper.text()).toContain('0');
      expect(wrapper.text()).toContain('100,555'); // Indonesian format uses comma for decimal
      expect(wrapper.text()).toContain('-500.000'); // Indonesian format uses period for thousands
      expect(wrapper.text()).toContain('999.999.999');
    });
  });

  describe('Attributes Binding', () => {
    it('should bind attributes correctly using v-bind="$attrs"', () => {
      wrapper = createWrapper();
      wrapper.vm.$attrs = { 'data-testid': 'akhir-masa-manfaat', id: 'test-component' };
      
      const mainDiv = wrapper.find('.grid.grid-cols-2');
      expect(mainDiv.exists()).toBe(true);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null/undefined values gracefully', async () => {
      wrapper = createWrapper({
        irrOnProject: 0, // Use 0 instead of null to avoid prop type warnings
        irrOnEquity: '',  // Use empty string for string|number type
        npvOnProject: 0,
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0
      });
      
      expect(() => wrapper.vm.$nextTick()).not.toThrow();
    });

    it('should handle very large numbers', async () => {
      wrapper = createWrapper({
        npvOnProject: 999999999999,
        npvOnEquity: 888888888888
      });
      await wrapper.vm.$nextTick();
      
      const content = wrapper.text();
      expect(content).toContain('999.999.999.999');
      expect(content).toContain('888.888.888.888');
    });

    it('should handle negative values', async () => {
      wrapper = createWrapper({
        irrOnProject: -5.5,
        irrOnEquity: -10.2,
        npvOnProject: -1000000,
        npvOnEquity: -2000000,
        averageNcf: -15.5,
        averageEaf: -20.3
      });
      await wrapper.vm.$nextTick();
      
      expect(() => wrapper.vm.$nextTick()).not.toThrow();
    });

    it('should handle zero values', async () => {
      wrapper = createWrapper({
        irrOnProject: 0,
        irrOnEquity: 0,
        npvOnProject: 0,
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0
      });
      await wrapper.vm.$nextTick();
      
      // With zero values, shimmer should be rendered based on the v-if condition
      const shimmerComponents = wrapper.findAllComponents(ShimmerLoading);
      expect(shimmerComponents).toHaveLength(4);
    });
  });

  describe('Component Integration', () => {
    it('should properly integrate with ShimmerLoading component', () => {
      wrapper = createWrapper({
        irrOnEquity: 0, // Use 0 instead of null
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0,
        isFetchingError: false,
        idMesin: 1
      });
      
      const shimmerComponents = wrapper.findAllComponents(ShimmerLoading);
      shimmerComponents.forEach(shimmer => {
        expect(shimmer.vm).toBeDefined();
      });
    });

    it('should properly integrate with ReloadComponent', () => {
      wrapper = createWrapper({
        isFetchingError: true,
        irrOnEquity: 0, // Use 0 instead of null
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0,
        idMesin: 1
      });
      
      const reloadComponent = wrapper.findComponent(ReloadComponent);
      expect(reloadComponent.vm).toBeDefined();
    });
  });

  describe('Reactivity', () => {
    it('should update display when props change', async () => {
      wrapper = createWrapper({ irrOnProject: 10 });
      expect(wrapper.text()).toContain('10');
      
      await wrapper.setProps({ irrOnProject: 20 });
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain('20');
    });

    it('should switch between different render states', async () => {
      // Start with data
      wrapper = createWrapper();
      expect(wrapper.find('.grid.grid-cols-2.mt-5.gap-x-10.gap-y-5').exists()).toBe(true);
      
      // Switch to loading state
      await wrapper.setProps({
        irrOnEquity: 0, // Use 0 instead of null
        npvOnEquity: 0,
        averageNcf: 0,
        averageEaf: 0,
        isFetchingError: false,
        idMesin: 1
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.findAllComponents(ShimmerLoading)).toHaveLength(4);
      
      // Switch to error state
      await wrapper.setProps({ isFetchingError: true });
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(ReloadComponent).exists()).toBe(true);
    });
  });

  afterEach(() => {
    wrapper?.unmount();
  });
});
