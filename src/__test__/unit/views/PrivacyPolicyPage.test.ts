import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import PrivacyPolicyPage from '@/views/PrivacyPolicyPage.vue';

vi.mock('vue-router', () => ({
  RouterLink: {
    name: 'RouterLink',
    template: '<a><slot /></a>',
    props: ['to'],
  },
}));

describe('PrivacyPolicyPage.vue', () => {
  it('renders the privacy policy page', () => {
    const wrapper = mount(PrivacyPolicyPage, {
      global: {
        stubs: {
          RouterLink: {
            name: 'RouterLink',
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('displays the Kebijakan Privasi heading', () => {
    const wrapper = mount(PrivacyPolicyPage, {
      global: {
        stubs: {
          RouterLink: {
            name: 'RouterLink',
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    });
    expect(wrapper.text()).toContain('Kebijakan Privasi');
  });

  it('contains all required privacy policy sections', () => {
    const wrapper = mount(PrivacyPolicyPage, {
      global: {
        stubs: {
          RouterLink: {
            name: 'RouterLink',
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    });
    const text = wrapper.text();
    expect(text).toContain('Pendahuluan');
    expect(text).toContain('Penggunaan Layanan');
    expect(text).toContain('Kebijakan Privasi');
    expect(text).toContain('Informasi Kontak');
    expect(text).toContain('valiant@pln.co.id');
  });

  it('has a back-to-login link pointing to /login', () => {
    const wrapper = mount(PrivacyPolicyPage, {
      global: {
        stubs: {
          RouterLink: {
            name: 'RouterLink',
            template: '<a :href="to"><slot /></a>',
            props: ['to'],
          },
        },
      },
    });
    const link = wrapper.find('a[href="/login"]');
    expect(link.exists()).toBe(true);
    expect(link.text()).toContain('Kembali ke Login');
  });
});
