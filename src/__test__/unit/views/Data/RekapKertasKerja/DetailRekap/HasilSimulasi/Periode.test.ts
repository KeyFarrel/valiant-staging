import { shallowMount } from '@vue/test-utils';
import Periode from '@/views/Data/RekapKertasKerja/DetailRekap/HasilSimulasi/Periode.vue';
import VueDatePicker from '@vuepic/vue-datepicker';

describe('Periode.vue', () => {
  it('renders the component correctly', () => {
    const wrapper = shallowMount(Periode, {
      global: {
        components: {
          VueDatePicker
        }
      }
    });

    // Check if the main div is rendered
    expect(wrapper.find('div').exists()).toBe(true);

    // Check if the title is rendered correctly
    expect(wrapper.find('h3').text()).toBe('Periode');

    // Check if VueDatePicker is rendered
    expect(wrapper.findComponent(VueDatePicker).exists()).toBe(true);

    // Check if IRR section is rendered correctly
    const irrSection = wrapper.findAll('.border-l-8')[0];
    expect(irrSection.find('p').text()).toBe('Internal Rate of Return (IRR)');
    expect(irrSection.findAll('p')[1].text()).toContain('IRR on Project');
    expect(irrSection.findAll('p')[2].text()).toContain('22 %');
    expect(irrSection.findAll('p')[3].text()).toContain('IRR on Equity');
    expect(irrSection.findAll('p')[4].text()).toContain('22 %');

    // Check if NPV section is rendered correctly
    const npvSection = wrapper.findAll('.border-l-8')[1];
    expect(npvSection.find('p').text()).toBe('Net Present Value (NPV)');
    expect(npvSection.findAll('p')[1].text()).toContain('NPV on Equity');
    expect(npvSection.findAll('p')[2].text()).toContain('6,948 Rp (Juta)');
    expect(npvSection.findAll('p')[3].text()).toContain('NPV on Project');
    expect(npvSection.findAll('p')[4].text()).toContain('7,649 Rp (Juta)');

    // Check if NCF section is rendered correctly
    const ncfSection = wrapper.findAll('.border-l-8')[2];
    expect(ncfSection.find('p').text()).toBe('Average Net Capacity Factor (NCF)');
    expect(ncfSection.findAll('p')[1].text()).toContain('7 %');

    // Check if EAF section is rendered correctly
    const eafSection = wrapper.findAll('.border-l-8')[3];
    expect(eafSection.find('p').text()).toBe('Average Equivalent Availability Factor (EAF)');
    expect(eafSection.findAll('p')[1].text()).toContain('7 %');
  });
});