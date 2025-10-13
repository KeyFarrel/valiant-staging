import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import TooltipLamanData from '@/components/ui/TooltipLamanData.vue';

describe('TooltipLamanData.vue', () => {
  let pinia: any;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);
  });

  it('should render the component correctly', () => {
    const wrapper = mount(TooltipLamanData, {
      props: {
        idMesin: 1,
        tahun: 2024
      },
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: true,
          IconView: true
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('should toggle tooltip visibility when button is clicked', async () => {
    const wrapper = mount(TooltipLamanData, {
      props: {
        idMesin: 1,
        tahun: 2024
      },
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: true,
          IconView: true
        }
      }
    });

    // Initially tooltip should be hidden
    expect(wrapper.find('#tooltipContent').exists()).toBe(false);

    // Click button to show tooltip
    await wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('#tooltipContent').exists()).toBe(true);

    // Click again to hide tooltip
    await wrapper.find('button').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('#tooltipContent').exists()).toBe(false);
  });

  it('should pass correct props to component', () => {
    const testIdMesin = 123;
    const testTahun = 2025;
    
    const wrapper = mount(TooltipLamanData, {
      props: {
        idMesin: testIdMesin,
        tahun: testTahun
      },
      global: {
        plugins: [pinia],
        stubs: {
          RouterLink: true,
          IconView: true
        }
      }
    });

    expect(wrapper.props('idMesin')).toBe(testIdMesin);
    expect(wrapper.props('tahun')).toBe(testTahun);
  });
});
