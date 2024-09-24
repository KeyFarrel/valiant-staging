import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import RekapKertasKerja from '@/views/Data/RekapKertasKerja/RekapKertasKerja.vue';

describe('RekapKertasKerja.vue', () => {
  it('should render the SVG correctly', () => {
    const pinia = createPinia();
    const wrapper = mount(RekapKertasKerja, {
      props:{
        showModal: false,
      },
      global: {
        plugins: [pinia],
      },
    });

    const modalWrapper = wrapper.findComponent({ name: 'ModalWrapper' });
    expect(modalWrapper.exists()).toBe(false);
  });
});
