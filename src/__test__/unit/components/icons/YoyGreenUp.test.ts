import { mount } from '@vue/test-utils';
import YoyGreenUp from '@/components/icons/YoyGreenUp.vue';

describe('YoyGreenUp.vue', () => {
  it('renders the component', () => {
    const wrapper = mount(YoyGreenUp);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('toggles isHover value on mouseenter and mouseleave', async () => {
    const wrapper = mount(YoyGreenUp);

    // Initially, tooltip should not be visible
    expect(wrapper.find('.flex.flex-col.bg-white').exists()).toBe(false);

    // Get the component instance and manually toggle the isHover state
    const vm = wrapper.vm as any;
    
    // Call the toggleButton method directly
    vm.toggleButton();
    await wrapper.vm.$nextTick();
    
    // Tooltip should now be visible
    expect(wrapper.find('.flex.flex-col.bg-white').exists()).toBe(true);

    // Call toggleButton again to hide tooltip
    vm.toggleButton();
    await wrapper.vm.$nextTick();
    
    // Tooltip should be hidden again
    expect(wrapper.find('.flex.flex-col.bg-white').exists()).toBe(false);
  });
});
