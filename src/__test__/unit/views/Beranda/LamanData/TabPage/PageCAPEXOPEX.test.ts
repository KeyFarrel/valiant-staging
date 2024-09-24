import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, it, expect } from 'vitest';
import PageCAPEXOPEX from '@/views/Beranda/LamanData/TabPage/PageCAPEXOPEX.vue';

describe('PageCAPEXOPEX.vue', () => {
  it('should render Table Component', () => {
    const pinia = createPinia();

    const wrapper = mount(PageCAPEXOPEX, {
      global: {
        plugins: [pinia],
      },
    });

    const tableComponent = wrapper.findComponent({ name: 'TableComponent' });
    expect(tableComponent.exists()).toBe(true);
  });
});
