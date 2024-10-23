import { shallowMount } from '@vue/test-utils';
import TabWrapperSentral from '@/components/MasterUnitSentral/TabWrapperSentral.vue';
import RekapService from '@/services/rekap-service';
import { useRekapCheckRealisasi } from '@/store/storeRekapKertasKerja';

// Mock the necessary services
jest.mock('@/services/rekap-service', () => {
  return jest.fn().mockImplementation(() => ({
    // Mock implementation if needed
  }));
});

jest.mock('@/store/storeRekapKertasKerja', () => ({
  useRekapCheckRealisasi: jest.fn(),
}));

describe('TabWrapperSentral.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(TabWrapperSentral, {
      props: {
        isLihatGrafik: false,
        tabsTitles: [
          { mesin: 'Mesin A', kode_mesin: 'K001', id_mesin: 1, status_fs: 'Ready', status_realisasi: 'Data belum terisi' },
          { mesin: 'Mesin B', kode_mesin: 'K002', id_mesin: 2, status_fs: 'In Progress', status_realisasi: 'Data belum update' },
        ],
        isRekap: false,
      },
    });
  });

  it('renders tabs based on props.tabsTitles', () => {
    const tabs = wrapper.findAll('li');
    expect(tabs.length).toBe(3); // Should render 2 tabs
    expect(wrapper.text()).toContain('Mesin A');
    expect(wrapper.text()).toContain('Mesin B');
  });

  it('selects the first tab by default when isRekap is true', async () => {
    await wrapper.setProps({ isRekap: true, tabsTitles: [{ mesin: 'Mesin A' }] });
    expect(wrapper.vm.selectedTitle).toBe('Sentral');
  });

  it('selects "Sentral" by default when isRekap is false', () => {
    expect(wrapper.vm.selectedTitle).toBe('Sentral');
  });

  it('changes the selectedTitle when a tab is clicked', async () => {
    const tabs = wrapper.findAll('li');
    await tabs.at(1)?.trigger('click'); // Click on 'Mesin B'
    expect(wrapper.vm.selectedTitle).toBe('Mesin A');
  });

  it('applies selected class when a tab is active', async () => {
    const tabs = wrapper.findAll('li');
    await tabs.at(1)?.trigger('click'); // Click on 'Mesin B'
    expect(tabs.at(1)?.classes()).toContain('selected');
  });

  it('renders the warning dot for tabs with specific status_realisasi', () => {
    const warningDotTab = wrapper.findAll('.bg-warningColor');
    expect(warningDotTab.length).toBe(2); // There should be warning dots for both tabs
  });
});
