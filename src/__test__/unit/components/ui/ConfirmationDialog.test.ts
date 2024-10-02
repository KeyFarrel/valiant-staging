// File: ConfirmationDialog.spec.ts
import { mount } from '@vue/test-utils';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog.vue';

describe('ConfirmationDialog.vue', () => {
  it('renders title and subtitle correctly', () => {
    // Arrange: Props yang akan diteruskan ke komponen
    const props = {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      buttonTitle: 'Accept',
    };

    // Act: Render komponen menggunakan mount dan beri props
    const wrapper = mount(ConfirmationDialog, {
      props,
    });

    // Assert: Periksa apakah title dan subtitle dirender dengan benar
    expect(wrapper.find('p.text-xl').text()).toBe(props.title);
    expect(wrapper.find('p.text-base').html()).toContain(props.subtitle);
  });

  it('emits onBatalClick when Batal button is clicked', async () => {
    const props = {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      buttonTitle: 'Accept',
    };

    const wrapper = mount(ConfirmationDialog, {
      props,
    });

    // Act: Klik tombol "Batal"
    await wrapper.find('button:first-child').trigger('click');

    // Assert: Periksa apakah event 'onBatalClick' sudah diemit
    expect(wrapper.emitted('onBatalClick')).toBeTruthy();
  });

  it('emits onAcceptClick when Accept button is clicked', async () => {
    const props = {
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      buttonTitle: 'Accept',
    };

    const wrapper = mount(ConfirmationDialog, {
      props,
    });

    // Act: Klik tombol "Accept"
    await wrapper.find('button:last-child').trigger('click');

    // Assert: Periksa apakah event 'onAcceptClick' sudah diemit
    expect(wrapper.emitted('onAcceptClick')).toBeTruthy();
  });
});
