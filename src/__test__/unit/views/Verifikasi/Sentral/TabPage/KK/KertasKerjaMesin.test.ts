import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import KertasKerjaMesin from '@/views/Verifikasi/Sentral/TabPage/KK/KertasKerjaMesin.vue';

describe('KertasKerjaMesin.vue', () => {
  it('should render TableComponent', () => {
    const wrapper = mount(KertasKerjaMesin, {
      props: {
        source: []
      },
    });

    const tableComponent = wrapper.findComponent({ name: 'TableComponent' });
    expect(tableComponent.exists()).toBe(true);
  });
});