import { shallowMount } from '@vue/test-utils';
import TabWrapperSentral from '@/components/MasterUnitSentral/TabWrapperSentral.vue';
import RekapService from '@/services/rekap-service';
import { useRekapCheckRealisasi } from '@/store/storeRekapKertasKerja';

jest.mock('@/services/rekap-service', () => {
  return jest.fn().mockImplementation(() => ({
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
          { mesin: 'Mesin A', kode_mesin: 'K001', uuid_mesin: 1, status_fs: 'Ready', status_realisasi: 'Data belum terisi' },
          { mesin: 'Mesin B', kode_mesin: 'K002', uuid_mesin: 2, status_fs: 'In Progress', status_realisasi: 'Data belum update' },
        ],
        isRekap: false,
      },
    });
  });

  it('renders tabs based on props.tabsTitles', () => {
    const tabs = wrapper.findAll('li');
    expect(tabs.length).toBe(3);
    expect(wrapper.text()).toContain('Mesin A');
    expect(wrapper.text()).toContain('Mesin B');
  });

  it('selects the first tab by default when isRekap is true', async () => {
    const newWrapper = shallowMount(TabWrapperSentral, {
      props: {
        isLihatGrafik: false,
        tabsTitles: [{ mesin: 'Mesin A', kode_mesin: 'K001', uuid_mesin: 1, status_fs: 'Ready', status_realisasi: 'Data belum terisi' }],
        isRekap: true,
      },
    });
    
    await newWrapper.vm.$nextTick();
    const tabs = newWrapper.findAll('li');
    const mesinATab = tabs.find(tab => tab.text().includes('Mesin A'));
    expect(mesinATab?.classes()).toContain('selected');
  });

  it('selects "Sentral" by default when isRekap is false', () => {
    const tabs = wrapper.findAll('li');
    const sentralTab = tabs.find(tab => tab.text().includes('Sentral'));
    expect(sentralTab?.classes()).toContain('selected');
  });

  it('changes the selectedTitle when a tab is clicked', async () => {
    const tabs = wrapper.findAll('li');
    
    const sentralTab = tabs.find(tab => tab.text().includes('Sentral'));
    expect(sentralTab?.classes()).toContain('selected');
    
    const mesinATab = tabs.find(tab => tab.text().includes('Mesin A'));
    expect(mesinATab?.exists()).toBe(true);
  });

  it('applies selected class when a tab is active', async () => {
    const tabs = wrapper.findAll('li');
    const sentralTab = tabs.find(tab => tab.text().includes('Sentral'));
    expect(sentralTab?.classes()).toContain('selected');
    
    const mesinATab = tabs.find(tab => tab.text().includes('Mesin A'));
    expect(mesinATab?.classes()).not.toContain('selected');
  });

  it('renders the warning dot for tabs with specific status_realisasi', () => {
    const warningDotTab = wrapper.findAll('.bg-warningColor');
    expect(warningDotTab.length).toBe(2);
  });
});
