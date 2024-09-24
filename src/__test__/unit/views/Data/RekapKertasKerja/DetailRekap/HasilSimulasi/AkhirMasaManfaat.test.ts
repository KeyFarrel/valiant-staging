import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AkhirMasaManfaat from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/AkhirMasaManfaat.vue';

describe('AkhirMasaManfaat.vue', () => {
  it('should use default prop values', () => {
    const wrapper = mount(AkhirMasaManfaat);
    
    // Verify default prop values
    expect(wrapper.props().isFetchingError).toBe(false);
  });
});
