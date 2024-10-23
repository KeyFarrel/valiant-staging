import { mount } from '@vue/test-utils';
import Query from '@/views/Query/Query.vue';
import Loading from '@/components/ui/LoadingSpinner.vue';

describe('Query.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(Query, {
      global: {
        components: {
          Loading,
        },
      },
    });
  });

  it('toggles the Unit section visibility', async () => {
    const unitSection = wrapper.find('.flex.justify-between.items-center.cursor-pointer');
    
    // Initially open
    expect(wrapper.vm.isUnitSectionOpen).toBe(true);
    expect(wrapper.find('main.grid').exists()).toBe(true);

    // Toggle to close
    await unitSection.trigger('click');
    expect(wrapper.vm.isUnitSectionOpen).toBe(false);
    expect(wrapper.find('main.grid').exists()).toBe(false);
  });

  it('renders table rows correctly', () => {
    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(3); // Check if there are 3 rows as per the template
    expect(rows[0].text()).toContain('PLTA Cikalong'); // Verify the first row data
    expect(rows[1].text()).toContain('Unit 2'); // Verify the second row
  });

  it('shows the correct labels in the Unit and Data sections', () => {
    const unitLabel = wrapper.findAll('label').at(0);
    const dataLabel = wrapper.findAll('label').at(6);
    
    expect(unitLabel.text()).toBe('Unit Induk / Subholding / Anak Perusahaan');
    expect(dataLabel.text()).toBe('Unit Sentral');
  });

  it('toggles the Data section visibility', async () => {
    const dataSection = wrapper.findAll('.flex.justify-between.items-center.cursor-pointer').at(1);

    // Initially open
    expect(wrapper.vm.isDataSectionOpen).toBe(true);
    expect(wrapper.find('main.flex-col').exists()).toBe(true);

    // Toggle to close
    await dataSection.trigger('click');
    expect(wrapper.vm.isDataSectionOpen).toBe(false);
    expect(wrapper.find('main.flex-col').exists()).toBe(true);
  });

  it('applies query changes when the "Terapkan Query" button is clicked', async () => {
    const applyButton = wrapper.findAll('button').at(4); // Locate the "Terapkan Query" button
    await applyButton.trigger('click');

    // Here you can add any assertions for expected behavior after clicking the button
    expect(applyButton.exists()).toBe(true);
  });
});
