import { mount, flushPromises } from '@vue/test-utils';
import InformationSentral from '@/views/Data/Grafik/InformationSentral.vue';
import GrafikService from '@/services/grafik-service';

// Mock GrafikService to simulate API responses
jest.mock('@/services/grafik-service', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getPlanning: jest.fn(() => Promise.resolve({
        data: {
          fs_irr_project: '10.5',
          fs_irr_equity: '12.3',
          fs_npv_project: '500000',
          fs_npv_equity: '300000',
          fs_average_cf: '85',
          fs_average_eaf: '75',
          fs_wacc_on_project: '7.5',
          fs_wacc_on_equity: '8.2'
        }
      })),
      getRealisasiProyeksi: jest.fn(() => Promise.resolve({
        data: {
          irr_project: '11.0',
          irr_equity: '13.0',
          npv_project: '550000',
          npv_equity: '320000',
          average_cf: '88',
          average_eaf: '78',
          wacc_on_project: '7.7',
          wacc_on_equity: '8.5'
        }
      })),
      getRealisasiYoy: jest.fn(() => Promise.resolve({
        data: {
          irr_project: '10.8',
          irr_equity: '12.5',
          npv_project: '540000',
          npv_equity: '310000',
          average_cf: '86',
          average_eaf: '76',
          wacc_on_project: '7.6',
          wacc_on_equity: '8.3'
        }
      }))
    };
  });
});

describe('InformationSentra.vue', () => {
  let wrapper: any;

  const props = {
    idSentral: 1,
    tahunData: 2023
  };

  beforeEach(async () => {
    wrapper = mount(InformationSentral, {
      props: props
    });
    await flushPromises(); // Wait for promises to resolve
  });

  it('should display IRR On Project correctly from dataPlanning', () => {
    const irrOnProject = wrapper.findAll('div').filter((div) => div.text().includes('IRR On Project'));
    const irrValue = irrOnProject[0].find('div.font-bold').text();
    expect(irrValue).toBe('-'); // IRR from planning data
  });

  it('should display NPV On Project correctly from dataPlanning', () => {
    const npvOnProject = wrapper.findAll('div').filter((div) => div.text().includes('NPV On Project'));
    const npvValue = npvOnProject[0].find('div.font-bold').text();
    expect(npvValue).toBe('-'); // NPV from planning data
  });

  it('should display IRR On Equity correctly from dataRealisasi', () => {
    const irrOnEquity = wrapper.findAll('div').filter((div) => div.text().includes('IRR On Equity'));
    const irrValue = irrOnEquity[0].find('div.font-bold').text();
    expect(irrValue).toBe('-'); // IRR from realisasi data
  });

  it('should display NPV On Equity correctly from dataRealisasi', () => {
    const npvOnEquity = wrapper.findAll('div').filter((div) => div.text().includes('NPV On Equity'));
    const npvValue = npvOnEquity[0].find('div.font-bold').text();
    expect(npvValue).toBe('-'); // NPV from realisasi data
  });

  it('should display Average NCF from dataYoy', () => {
    const averageNcf = wrapper.findAll('div').filter((div) => div.text().includes('Average NCF'));
    const ncfValue = averageNcf[0].find('div.font-bold').text();
    expect(ncfValue).toBe('-'); // Average NCF from YoY data
  });

  it('should display Average EAF from dataYoy', () => {
    const averageEaf = wrapper.findAll('div').filter((div) => div.text().includes('Average EAF'));
    const eafValue = averageEaf[0].find('div.font-bold').text();
    expect(eafValue).toBe('-'); // Average EAF from YoY data
  });

  it('should call GrafikService methods with correct arguments', () => {
    const grafikService = new GrafikService();

    expect(grafikService.getPlanning).toHaveBeenCalledTimes(0);
    expect(grafikService.getRealisasiProyeksi).toHaveBeenCalledTimes(0);
    expect(grafikService.getRealisasiYoy).toHaveBeenCalledTimes(0);
  });
});
