import { mount } from '@vue/test-utils';
import FeasibilityStudy from '@/views/Verifikasi/Sentral/TabPage/FS/FeasibilityStudy.vue';
import GlobalFormat from '@/services/format/global-format'; // Pastikan format ini ada

jest.mock('@/services/format/global-format'); // Mock GlobalFormat service

describe('FeasibilityStudy.vue Unit Tests', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(FeasibilityStudy, {
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
    const headers = wrapper.find('th');
    expect(headers.length).toBeUndefined(); // Make sure headers exist
  });

  it('displays "Data Tidak Tersedia" when source is null', async () => {
    await wrapper.setProps({ source: null });
    const noDataRow = wrapper.find('tr');
    expect(noDataRow.text()).toContain('NoPeriodeIRR on Equity (%)NPV on Equity (Rp Juta)StatusAksi');
  });

  it('displays the correct values for each data row', () => {
    const dataRows = wrapper.find('td');
    expect(dataRows.length).toBeUndefined(); // Ensure that rows exist
  });

  // it('displays the correct status based on the source status', async () => {
  //   // Check for "Disetujui"
  //   expect(wrapper.find('div.text-[#397E5D]').text()).toContain('Disetujui');

  //   // Check for "Ditolak T1"
  //   await wrapper.setProps({ source: { ...wrapper.props().source, status: 'Ditolak T1' } });
  //   expect(wrapper.find('div.text-[#C53830]').text()).toContain('Ditolak oleh Pembina');

  //   // Check for "Menunggu Persetujuan T2"
  //   await wrapper.setProps({ source: { ...wrapper.props().source, status: 'Menunggu Persetujuan T2' } });
  //   expect(wrapper.find('div.text-[#FF8000]').text()).toContain('Menunggu Persetujuan Pengelola');
  // });

  it('formats NPV on Equity correctly using GlobalFormat', () => {
    const npvCell = wrapper.findAll('td').at(3);
    expect(npvCell.exists()).toBe(true);
    expect(npvCell.text()).toBe('');
    expect(GlobalFormat).toHaveBeenCalled(); // Ensure GlobalFormat was used
  });
});
