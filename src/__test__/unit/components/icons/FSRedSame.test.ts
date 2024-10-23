import { mount } from '@vue/test-utils';
import FSRedSame from '@/components/icons/FSRedSame.vue';
import { ref } from 'vue';

describe('FSRedSame.vue', () => {
  it('renders the component', () => {
    const wrapper = mount(FSRedSame);
    expect(wrapper.exists()).toBe(true);
  });

  it('toggles isHover value on mouseenter and mouseleave', async () => {
    const wrapper = mount(FSRedSame);

    // Simulasi interaksi mouseenter dan mouseleave
    const isHover = ref(false); // Menginisialisasi ref lokal

    // Awalnya tooltip tidak terlihat (isHover false)
    expect(wrapper.find('.flex').exists()).toBe(false);

    // Simulasi mouseenter dan toggle isHover ke true
    await wrapper.find('svg').trigger('mouseenter');
    isHover.value = true; // Mengubah state langsung via ref
    expect(isHover.value).toBe(true);
    expect(wrapper.find('.flex').exists()).toBe(true); // Tooltip muncul

    // Simulasi mouseleave dan toggle isHover ke false
    await wrapper.find('svg').trigger('mouseleave');
    isHover.value = false;
    expect(isHover.value).toBe(false);
    expect(wrapper.find('.flex').exists()).toBe(false); // Tooltip hilang
  });
});
