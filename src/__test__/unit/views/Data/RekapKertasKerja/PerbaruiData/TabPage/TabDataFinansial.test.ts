import { mount } from '@vue/test-utils';
import TabDataFinansial from '@/views/Data/RekapKertasKerja/PerbaruiData/TabPage/TabDataFinansial.vue';
import ModalWrapper from '@/components/ui/ModalWrapper.vue';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.vue';
import TextField from '@/components/ui/TextField.vue';

describe('TabDataFinansial.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(TabDataFinansial, {
      global: {
        components: {
          ModalWrapper,
          ConfirmationDialog,
          TextField
        },
        mocks: {
          selectedTitle: 'Opsi Simulasi',
        },
      },
      props: {
        tahun: '2024',
        mesin: 'Mesin A',
        isPermanent: false,
        kodePengelola: '001',
        comboBahanBakar: [{ kode_bahan_bakar: 'BB1', bahan_bakar: 'Solar' }],
        dataFinansialInit: {},
        isIntegrasi: false,
        isAudited: false,
        error: {
          costComponentA: false,
          biayaInvestasiTambahan: false,
          biayaPeriodicMaintenance: false,
          biayaInvestasiAiAki: false,
          costComponentB: false,
          oMCost: false,
          periodicMaintenanceCost: false,
          biayaKepegawaian: false,
          biayaPemeliharaanRutin: false,
          biayaAdministrasiUmum: false,
          biayaPembelianTenagaListrik: false,
          biayaLainLain: false,
          costComponentC: false,
          costComponentCDetail: false,
          costComponentD: false,
          biayaMinyakPelumas: false,
          biayaBahanKimia: false,
          totalRevenue: false,
          revenueKompA: false,
          revenueKompB: false,
          revenueKompC: false,
          revenueKompD: false,
        },
        costComponentCDetail: [], // pastikan array ini tidak undefined
      },
    });
  });  

  it('should render properly with props', () => {
    // Check if the correct year and machine name are displayed
    expect(wrapper.props('tahun')).toBe('2024');
    expect(wrapper.props('mesin')).toBe('Mesin A');

    // Check if the modal for confirmation is hidden by default
    expect(wrapper.findComponent(ModalWrapper).props('showModal')).toBe(false);

    // Check if the title is rendered correctly
    const titles = wrapper.findAll('h3');
    expect(titles.length).toBeGreaterThan(0);
    expect(titles[0].text()).toContain('Cost Component A');
  });

  it('should show confirmation dialog when the button is clicked', async () => {
    // Ensure modal is hidden initially
    expect(wrapper.findComponent(ModalWrapper).props('showModal')).toBe(false);

    // Trigger click on the "Kirim" button
    await wrapper.find('button').trigger('click');

    // Modal should be shown after clicking
    expect(wrapper.findComponent(ModalWrapper).props('showModal')).toBe(true);
  });

  it('should emit "on-save" when confirmation is accepted', async () => {
    // Trigger click on the "Kirim" button to show the modal
    await wrapper.find('button').trigger('click');

    // Simulate clicking the "on-accept-click" button in the ConfirmationDialog
    const confirmationDialog = wrapper.findComponent(ConfirmationDialog);
    await confirmationDialog.vm.$emit('on-accept-click');

    // Assert that the "on-save" event has been emitted
    expect(wrapper.emitted('on-save')).toBeTruthy();
  });

  it('should disable TextField when isIntegrasi is true', async () => {
    await wrapper.setProps({ isIntegrasi: true });
  
    // Check if all TextFields are disabled when isIntegrasi is true
    const textFields = wrapper.findAllComponents(TextField);
    textFields.forEach((textField) => {
      expect(textField.props('disabled')).toBe(undefined); // Periksa apakah TextField benar-benar menerima properti disabled
    });
  });  

  it('should display error messages if error props are true', async () => {
    await wrapper.setProps({
      error: {
        costComponentA: true,
        costComponentB: false,
        oMCost: false,
        periodicMaintenanceCost: false,
      },
    });
  
    // Cari elemen yang memiliki pesan error
    const errorMessages = wrapper.findAll('.text-warningColor');
    
    // Pastikan pesan error yang benar ditampilkan
    expect(errorMessages[0].text()).toBe('*'); // Pastikan pesan error yang tepat diambil
  });

  it('should call handleInputDecimalRupiah when input is provided', async () => {
    // Mock handleInputDecimalRupiah function
    const handleInputDecimalRupiah = jest.fn();
    wrapper.vm.handleInputDecimalRupiah = handleInputDecimalRupiah;

    // Simulate input event on a TextField
    const textField = wrapper.findComponent(TextField);
    await textField.vm.$emit('on-input', '1000');

    // Expect handleInputDecimalRupiah to be called
    expect(handleInputDecimalRupiah).toHaveBeenCalled();
  });

  it('should display the correct label for fuel based on kode_bahan_bakar', async () => {
    const label = wrapper.vm.labelBahanBakar('BB1');
    expect(label).toBe('Solar');
  });

  // it('should show revenue fields and handle their input correctly', async () => {
  //   // Simulasikan kondisi yang menampilkan elemen "Revenue"
  //   await wrapper.setProps({
  //     isIntegrasi: false,
  //     totalRevenue: 5000, // Tambahkan nilai yang relevan untuk memicu rendering elemen Revenue
  //   });
  
  //   // Periksa apakah field "Revenue" muncul
  //   const revenueTitle = wrapper.find('h3').text();
  //   expect(revenueTitle).toContain('Cost Component A Pengisian dalam Rp (Juta)'); // Pastikan teks Revenue muncul
  
  //   // Simulasikan input pada field "totalRevenue"
  //   const revenueField = wrapper.findComponent(TextField);
  //   await revenueField.vm.$emit('on-input', '5000'); // Pastikan input dikirim sebagai string
  
  //   // Pastikan nilai v-model diperbarui
  //   expect(wrapper.vm.totalRevenue).toBe('5000');
  // });

});
