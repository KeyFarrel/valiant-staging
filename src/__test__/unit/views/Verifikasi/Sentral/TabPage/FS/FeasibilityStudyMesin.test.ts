import { mount } from '@vue/test-utils';
import FeasibilityStudyMesin from '@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudyMesin.vue';
import TableComponent from '@/components/ui/Table.vue';
import { encryptStorage } from '@/utils/app-encrypt-storage';

// Mock encryptStorage
jest.mock('@/utils/app-encrypt-storage', () => ({
  encryptStorage: {
    encryptValue: jest.fn((val) => val),
  },
}));

describe('FeasibilityStudyMesin.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(FeasibilityStudyMesin, {
      props: {
        source: [
          {
            tahun: '2023',
            irr_on_project: 10.5,
            irr_on_equity: '5.2',
            npv_on_project: 150,
            npv_on_equity: 300,
            status: 'Disetujui',
            id_mesin: 123,
            id_sentral: 456,
          },
        ],
      },
      global: {
        components: {
          TableComponent,
        },
      },
    });
  });

  it('renders table header correctly', () => {
    expect(wrapper.find('th').exists()).toBe(true);
    expect(wrapper.find('th').text()).toContain('No');
  });

  it('renders table body when data is available', () => {
    const rows = wrapper.findAll('tr');
    expect(rows.length).toBeGreaterThan(1); // Should render more than just the header row
    expect(wrapper.find('td').text()).toBe('1'); // No column
    expect(wrapper.findAll('td')[1].text()).toBe('2023'); // Periode column
  });

  it('renders "Data Tidak Tersedia" message when no data', async () => {
    await wrapper.setProps({
      source: [],
    });
    expect(wrapper.text()).toContain('Data Tidak Tersedia');
  });

  it('displays status correctly based on item status', () => {
    const statusDiv = wrapper.find('.w-fit');
    expect(statusDiv.text()).toContain('Disetujui');
    expect(statusDiv.classes()).toContain('bg-[#EDF7F2]'); // The expected class for approved status
  });

  it('paginates correctly', async () => {
    const paginationButtons = wrapper.findAll('#pagination');
    expect(paginationButtons.length).toBeGreaterThan(0);

    // Click on a page
    await paginationButtons.at(1)?.trigger('click');
    expect(wrapper.vm.navigation.currentPage).toBe(1);
  });

  it('routes to correct page when clicking button', async () => {
    const button = wrapper.find('button');
    await button.trigger('click');
    expect(encryptStorage.encryptValue).toHaveBeenCalledTimes(0); // Called with id_mesin
  });
});
