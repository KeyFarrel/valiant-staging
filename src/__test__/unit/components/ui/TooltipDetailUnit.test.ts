import { shallowMount } from '@vue/test-utils';
import TooltipDetailUnit from '@/components/ui/TooltipDetailUnit.vue';
import IconInfo from '@/components/icons/IconInfo.vue';

describe('TooltipDetailUnit.vue', () => {
  it('renders the component correctly', () => {
    const wrapper = shallowMount(TooltipDetailUnit);

    // Check if the main div is rendered
    expect(wrapper.find('div').exists()).toBe(true);

    // Check if IconInfo component is rendered
    expect(wrapper.findComponent(IconInfo).exists()).toBe(true);

    // Check if the tooltip content is not visible initially
    expect(wrapper.find('#tooltipContent').exists()).toBe(false);
  });

  it('shows tooltip content on mouse enter and hides on mouse leave', async () => {
    const wrapper = shallowMount(TooltipDetailUnit);

    // Trigger mouseenter event
    await wrapper.trigger('mouseenter');
    expect(wrapper.find('#tooltipContent').exists()).toBe(true);

    // Trigger mouseleave event
    await wrapper.trigger('mouseleave');
    expect(wrapper.find('#tooltipContent').exists()).toBe(false);
  });
});