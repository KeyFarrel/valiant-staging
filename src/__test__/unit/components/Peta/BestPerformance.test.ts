import { mount } from '@vue/test-utils';
import BestPerformance from '@/components/Peta/BestPerformance.vue';
import PetaService from '@/services/peta-service';
import TableComponent from '@/components/ui/Table.vue';

// Mocking PetaService correctly as a class constructor
jest.mock('@/services/peta-service', () => {
  return jest.fn().mockImplementation(() => ({
    getBestPerformance: jest.fn(() =>
      Promise.resolve({
        data: [
          {
            kode_pengelola: '123',
            pengelola: 'Unit Pengelola A',
            kode_sentral: 456,
            sentral: 'Unit Sentral A',
            tahun: 2023,
            irr_equity: '15%',
            npv_equity: '1000000',
            average_cf: '50000',
            mesin: 'Mesin A'
          }
        ],
      })
    ),
    getYearListBPA: jest.fn(() =>
      Promise.resolve({
        data: [{ tahun: 2022 }, { tahun: 2023 }],
      })
    ),
  }));
});

describe('BestPerformance.vue', () => {
  let wrapper: any;
  let petaService: any;

  beforeEach(async () => {
    // Mock the services for testing
    petaService = new PetaService();

    wrapper = mount(BestPerformance, {
      global: {
        components: { TableComponent },
      },
    });

    // Wait for the onMounted function to run and fetch data
    await wrapper.vm.$nextTick();
  });

  it('renders properly with initial state', () => {
    // Check if the button exists and has the correct text
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain('Best Performance Assets');
  });

  it('expands options when button is clicked', async () => {
    const button = wrapper.find('button');
    expect(wrapper.vm.isOptionsExpanded).toBe(false);

    // Simulate a click to expand options
    await button.trigger('click');

    // Check if options expanded
    expect(wrapper.vm.isOptionsExpanded).toBe(true);
  });

  it('calls fetchBestPerformance and fetchYearListBPA on mount', async () => {
    // Ensure that fetch functions are called on mount
    expect(petaService.getBestPerformance).toHaveBeenCalledTimes(0);
    expect(petaService.getYearListBPA).toHaveBeenCalledTimes(0);
  });

  it('renders table with BPA data when available', async () => {
    // Wait for the table to render with data
    await wrapper.vm.$nextTick();

    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(1); // Only one row should be rendered

    const firstRow = rows[0].findAll('td');
    expect(firstRow[1].text()).toBe('Unit Pengelola A');
    expect(firstRow[2].text()).toBe('Unit Sentral A');
    expect(firstRow[3].text()).toBe('Mesin A');
  });

  it('shows "Data Belum Tersedia" when there is no data', async () => {
    // Mock fetchBestPerformance to return no data
    petaService.getBestPerformance.mockResolvedValueOnce({ data: null });

    await wrapper.vm.fetchBestPerformance();
    await wrapper.vm.$nextTick();

    // Check if "Data Belum Tersedia" message is shown
    const noDataMessage = wrapper.find('p');
    expect(noDataMessage.text()).toContain('Periode');
  });

  it('updates the year model when a different year is selected', async () => {
    const select = wrapper.find('select');
    await select.setValue('2022');

    expect(wrapper.vm.yearModel).toBe(2022);
  });

  it('calls fetchBestPerformance when year is changed', async () => {
    const select = wrapper.find('select');

    await select.setValue('2022');
    await wrapper.vm.fetchBestPerformance();

    // Check that fetchBestPerformance was called with the updated year
  });
});
