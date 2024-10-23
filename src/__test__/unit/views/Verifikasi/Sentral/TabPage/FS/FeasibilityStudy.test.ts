import { shallowMount } from '@vue/test-utils';
import FeasibilityStudy from '@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudy.vue';
import GlobalFormat from '@/services/format/global-format'; // Pastikan format ini ada

jest.mock('@/services/format/global-format'); // Mock GlobalFormat service

describe('FeasibilityStudy.vue Unit Tests', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(FeasibilityStudy, {
      props: {
        source: {
          tahun: '2023',
          irr_on_equity: '15.5',
          npv_on_equity: '1000000',
          status: 'Disetujui',
          id_sentral: '12345',
        },
      },
    });
  });

  it('renders the table headers correctly', () => {
    const headers = wrapper.findAll('th');
    expect(headers.length).toBeGreaterThan(0); // Make sure headers exist

    expect(headers.at(0).text()).toBe('No');
    expect(headers.at(1).text()).toContain('Periode');
    expect(headers.at(2).text()).toContain('IRR on Equity');
    expect(headers.at(3).text()).toContain('NPV on Equity');
    expect(headers.at(4).text()).toContain('Status');
    expect(headers.at(5).text()).toBe('Aksi');
  });

  it('displays "Data Tidak Tersedia" when source is null', async () => {
    await wrapper.setProps({ source: null });
    const noDataRow = wrapper.find('tr');
    expect(noDataRow.text()).toContain('Data Tidak Tersedia');
  });

  it('displays the correct values for each data row', () => {
    const dataRows = wrapper.findAll('td');
    expect(dataRows.length).toBeGreaterThan(0); // Ensure that rows exist

    expect(dataRows.at(0).text()).toBe('1'); // index number
    expect(dataRows.at(1).text()).toBe('2023'); // tahun
    expect(dataRows.at(2).text()).toBe('15.5'); // IRR on Equity
    expect(dataRows.at(3).text()).toBe('Rp 1000000'); // NPV on Equity, formatted using GlobalFormat
  });

  it('displays the correct status based on the source status', async () => {
    // Check for "Disetujui"
    expect(wrapper.find('div.text-[#397E5D]').text()).toContain('Disetujui');

    // Check for "Ditolak T1"
    await wrapper.setProps({ source: { ...wrapper.props().source, status: 'Ditolak T1' } });
    expect(wrapper.find('div.text-[#C53830]').text()).toContain('Ditolak oleh Pembina');

    // Check for "Menunggu Persetujuan T2"
    await wrapper.setProps({ source: { ...wrapper.props().source, status: 'Menunggu Persetujuan T2' } });
    expect(wrapper.find('div.text-[#FF8000]').text()).toContain('Menunggu Persetujuan Pengelola');
  });

  it('formats NPV on Equity correctly using GlobalFormat', () => {
    const npvCell = wrapper.findAll('td').at(3);
    expect(npvCell.exists()).toBe(true);
    expect(npvCell.text()).toBe('Rp 1000000');
    expect(GlobalFormat).toHaveBeenCalled(); // Ensure GlobalFormat was used
  });

  it('renders the correct RouterLink with the proper route', () => {
    const routerLink = wrapper.findComponent({ name: 'RouterLink' });
    expect(routerLink.exists()).toBe(true);
    expect(routerLink.props().to).toEqual({
      name: 'persetujuan-fs',
      query: { id_sentral: '12345' },
    });
  });
});
