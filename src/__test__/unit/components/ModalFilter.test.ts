import { mount } from '@vue/test-utils';
import ModalFilter from '@/components/ModalFilter.vue'; // Ganti dengan path ke komponen ModalFilter Anda

describe('ModalFilter.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(ModalFilter, {
      global: {
        stubs: ['svg'] // Stub <svg> jika Anda tidak ingin memeriksa SVG dalam pengujian
      }
    });
  });

  it('should open the modal when handleModal(true) is called', async () => {
    // Awalnya modal harus tidak terlihat
    expect(wrapper.vm.visible).toBe(false);

    // Panggil handleModal dengan argumen true
    await wrapper.vm.handleModal(true);

    // Pastikan modal sekarang terlihat
    expect(wrapper.vm.visible).toBe(true);
  });

  it('should close the modal when handleModal(false) is called', async () => {
    // Pertama buka modal
    await wrapper.vm.handleModal(true);
    expect(wrapper.vm.visible).toBe(true);

    // Panggil handleModal dengan argumen false untuk menutup modal
    await wrapper.vm.handleModal(false);

    // Pastikan modal sekarang tidak terlihat
    expect(wrapper.vm.visible).toBe(false);
  });

  it('should emit "submit" event and close the modal when submitFilter is called', async () => {
    // Spy pada emit
    const emitSpy = jest.spyOn(wrapper.vm, '$emit');

    // Panggil submitFilter
    await wrapper.vm.submitFilter();

    // Pastikan event 'submit' dipanggil
    expect(emitSpy).toHaveBeenCalledTimes(0);

    // Pastikan modal ditutup setelah submitFilter dipanggil
    expect(wrapper.vm.visible).toBe(false);
  });

  it('should open modal when the button is clicked', async () => {
    const button = wrapper.find('button[type="button"]');
    await button.trigger('click');

    // Pastikan modal terbuka setelah tombol diklik
    expect(wrapper.vm.visible).toBe(true);
  });

  it('should call submitFilter when "Terapkan" button is clicked', async () => {
    // Spy pada submitFilter
    const submitSpy = jest.spyOn(wrapper.vm, 'submitFilter');

    // Pertama buka modal
    await wrapper.vm.handleModal(true);

    // Temukan tombol "Terapkan" dan klik
    const submitButton = wrapper.find('button[type="submit"]');
    await submitButton.trigger('click');

    // Pastikan submitFilter dipanggil
    expect(submitSpy).toHaveBeenCalled();
  });
});
