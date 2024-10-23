import { mount } from '@vue/test-utils';
import KeteranganAnomali from '@/components/RekapKertasKerja/KeteranganAnomali.vue';

describe('KeteranganAnomali.vue', () => {
  it('shows tooltip on mouse enter and hides on mouse leave', async () => {
    const wrapper = mount(KeteranganAnomali, {
      props: {
        value: 10, // Set a value that shows the CheckIcon
      },
    });

    const container = wrapper.find('.flex');

    // Initially, the tooltip should not exist
    expect(wrapper.find('#tooltipContent').exists()).toBe(false);

    // Trigger mouseenter to show the tooltip
    await container.trigger('mouseenter');
    expect(wrapper.find('#tooltipContent').exists()).toBe(true);

    // Check if the tooltip is visible
    expect(wrapper.find('#tooltipContent').isVisible()).toBe(true);

    // Trigger mouseleave to hide the tooltip
    await container.trigger('mouseleave');
    expect(wrapper.find('#tooltipContent').exists()).toBe(false);
  });
});
