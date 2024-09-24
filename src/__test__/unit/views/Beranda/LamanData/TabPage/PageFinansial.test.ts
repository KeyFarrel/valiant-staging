import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';
import { describe, it, expect } from 'vitest';
import PageFinansial from '@/views/Beranda/LamanData/TabPage/PageFinansial.vue';

describe('PageFinansial.vue', () => {
  it('should render Table Component', () => {
    const pinia = createPinia();

    const wrapper = mount(PageFinansial, {
      global: {
        plugins: [pinia],
      },
    });

    const tableComponent = wrapper.findComponent({ name: 'TableComponent' });
    expect(tableComponent.exists()).toBe(true);
  });
});
