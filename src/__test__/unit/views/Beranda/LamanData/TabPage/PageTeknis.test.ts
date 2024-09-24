import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, it, expect } from 'vitest';
import PageTeknis from '@/views/Beranda/LamanData/TabPage/PageTeknis.vue';

describe('PageTeknis.vue', () => {
  it('should render Table Component', () => {
    const pinia = createPinia();

    const wrapper = mount(PageTeknis, {
      global: {
        plugins: [pinia],
      },
    });

    const tableComponent = wrapper.findComponent({ name: 'TableComponent' });
    expect(tableComponent.exists()).toBe(true);
  });
});
