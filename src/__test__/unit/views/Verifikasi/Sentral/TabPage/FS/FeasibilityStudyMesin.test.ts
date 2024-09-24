import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import FeasibilityStudyMesin from '@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudyMesin.vue';

describe('FeasibilityStudyMesin.vue', () => {
  it('should render TableComponent', () => {
    const wrapper = mount(FeasibilityStudyMesin, {
      props: {
        source: []
      },
    });

    const tableComponent = wrapper.findComponent({ name: 'TableComponent' });
    expect(tableComponent.exists()).toBe(true);
  });
});