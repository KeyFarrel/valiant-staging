import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import KertasKerja from '@/views/Verifikasi/Sentral/TabPage/KK/KertasKerja.vue';

// Mock TableComponent
vi.mock('@/components/ui/Table.vue', () => ({
  default: {
    name: 'TableComponent',
    template: `
      <div>
        <slot name="table-header"></slot>
        <slot name="table-body"></slot>
      </div>
    `,
  },
}));

// Mock RouterLink
vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    props: ['to'],
    template: '<a><slot /></a>',
  },
}));

// Mock GlobalFormat
vi.mock('@/services/format/global-format', () => ({
  default: class {
    formatRupiah(value: number) {
      return `Rp ${value.toLocaleString()}`;
    }
  },
}));

describe('KertasKerja.vue', () => {
  const mockSource = {
    tahun: '2024',
    irr_on_equity: 15.5,
    npv_on_equity: 1000000,
    status: 'Draft',
    uuid_sentral: 'test-uuid',
  };

  it('should render component successfully', () => {
    const wrapper = mount(KertasKerja, {
      props: {
        source: mockSource,
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should display data when source is provided', () => {
    const wrapper = mount(KertasKerja, {
      props: {
        source: mockSource,
      },
    });

    const text = wrapper.text();
    expect(text).toContain('2024');
    expect(text).toContain('15.5');
    expect(text).toContain('Draft');
  });
});