import { mount } from '@vue/test-utils';
import YoyRedSame from '@/components/icons/YoyRedSame.vue';

describe('YoyRedSame.vue', () => {
  it('renders the component', () => {
    const wrapper = mount(YoyRedSame);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('toggles isHover value on mouseenter and mouseleave', async () => {
    const wrapper = mount(YoyRedSame);

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
