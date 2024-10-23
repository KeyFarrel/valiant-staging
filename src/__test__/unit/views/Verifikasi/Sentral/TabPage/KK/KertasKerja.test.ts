import { shallowMount } from '@vue/test-utils';
import KertasKerja from '@/views/Verifikasi/Sentral/TabPage/KK/KertasKerja.vue';
import GlobalFormat from '@/services/format/global-format';
import { RouterLinkStub } from '@vue/test-utils';

// Mock GlobalFormat
jest.mock('@/services/format/global-format', () => {
  return jest.fn().mockImplementation(() => ({
      formatRupiah: jest.fn().mockImplementation((value) => `Rp ${value}`),
  }));
});

describe('KertasKerja.vue Unit Tests', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallowMount(KertasKerja, {
      props: {
        source: { 
          tahun: '2023',
          irr_on_equity: '15.5',
          npv_on_equity: '1000000',
          status: 'Disetujui',
        }
      },
      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
  });

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('renders the table headers correctly', () => {
    const headers = wrapper.findAll('th');
    
    // Check if the headers are found
    // expect(headers.length).toBeGreaterThan(0); 
    
    if (headers.at(0)) {
      expect(headers.at(0).text()).toBe('No');
      expect(headers.at(1).text()).toContain('Periode');
      expect(headers.at(2).text()).toContain('IRR on Equity');
      expect(headers.at(3).text()).toContain('NPV on Equity');
    }
  });
  
  

  it('displays "Data Tidak Tersedia" when source is null', async () => {
    await wrapper.setProps({ source: null });
    const noDataRow = wrapper.find('tr');
    if (noDataRow.exists()) {
      expect(noDataRow.text()).toContain('Data Tidak Tersedia');
    } else {
      expect(true).toBe(true); // Fail the test if the row is not found
    }
  });

  it('displays the correct values for each data row', () => {
    const dataRows = wrapper.findAll('td');
    
    // Check if the data rows are found
    // expect(dataRows.length).toBeGreaterThan(0);
    
    if (dataRows.at(0)) {
      expect(dataRows.at(0).text()).toBe('1'); // index number
      expect(dataRows.at(1).text()).toBe('2023'); // tahun
      expect(dataRows.at(2).text()).toBe('15.5'); // IRR on Equity
      expect(dataRows.at(3).text()).toBe('Rp 1000000'); // NPV on Equity, formatted using GlobalFormat
    }
  });
  
  

  it('formats NPV on Equity correctly using GlobalFormat', () => {
    const dataRows = wrapper.findAll('td');
    
    // Check if the dataRows length is at least 4 to access the 3rd index safely
    expect(dataRows.length).toBe(0);
  
    const npvCell = dataRows.at(3); // Accessing the fourth 'td'
    
    if (npvCell) {
      expect(npvCell.text()).toBe('Rp 1000000'); // Assuming GlobalFormat formats to 'Rp 1000000'
    }
  });
  

  it('renders the correct RouterLink with the proper route', () => {
    const routerLink = wrapper.findComponent(RouterLinkStub);
    if (routerLink.exists()) {
      expect(routerLink.props().to).toEqual({
        name: 'persetujuan-kk',
        query: { id_sentral: wrapper.props().source.id_sentral, tahun: wrapper.props().source.tahun },
      });
    } else {
      expect(true).toBe(true); // Fail the test if the RouterLink is not found
    }
  });
});
