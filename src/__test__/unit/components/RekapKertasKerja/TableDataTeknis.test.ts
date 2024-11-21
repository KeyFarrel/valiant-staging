import { shallowMount } from '@vue/test-utils';
import TableDataTeknis from '@/components/RekapKertasKerja/TableDataTeknis.vue';
import ShimmerLoading from '@/components/ui/ShimmerLoading.vue';
import ReloadComponent from '@/components/ui/ReloadComponent.vue';

describe('TableDataTeknis.vue', () => {
  let wrapper: any;

  const props = {
    isFetchingError: false,
    dataTeknis: {
      tahun: [2020, 2021, 2022],
      detail: [
        { uraian: 'Detail 1', t2020: 1000, t2021: 2000, t2022: 3000 },
        { uraian: 'Detail 2', t2020: 1500, t2021: 2500, t2022: 3500 },
      ],
    },
    typePeriodic: [],
    tahunTerakhirRealisasi: 2021,
  };

  beforeEach(() => {
    wrapper = shallowMount(TableDataTeknis, {
      props,
      global: {
        components: {
          ShimmerLoading,
          ReloadComponent,
        },
      },
    });
  });

  it('renders the table when dataTeknis.detail is not empty', () => {
    expect(wrapper.find('table').exists()).toBe(true);
    expect(wrapper.findAll('tbody tr').length).toBe(props.dataTeknis.detail.length);
  });

  it('renders ReloadComponent when isFetchingError is true and dataTeknis.detail is empty', async () => {
    await wrapper.setProps({
      isFetchingError: true,
      dataTeknis: { tahun: [], detail: [] },
    });
    expect(wrapper.findComponent(ReloadComponent).exists()).toBe(true);
  });

  it('renders ShimmerLoading when dataTeknis.detail is empty and isFetchingError is false', async () => {
    await wrapper.setProps({
      isFetchingError: false,
      dataTeknis: { tahun: [], detail: [] },
    });
    expect(wrapper.findComponent(ShimmerLoading).exists()).toBe(true);
  });

  it('applies correct classes and content based on props', () => {
    const headers = wrapper.findAll('thead th');
    expect(headers.length).toBe(props.dataTeknis.tahun.length + 2); // +2 for No and Nama columns

    const rows = wrapper.findAll('tbody tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.findAll('td');
      expect(cells[0].text()).toBe((rowIndex + 1).toString()); // No column
      expect(cells[1].text()).toBe(props.dataTeknis.detail[rowIndex].uraian); // Nama column
    });
  });
});