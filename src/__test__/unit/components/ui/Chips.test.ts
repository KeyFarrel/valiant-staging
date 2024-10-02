// File: Chips.spec.ts
import { mount } from '@vue/test-utils';
import Chips from '@/components/ui/Chips.vue';

describe('Chips.vue', () => {
  it('renders title and content correctly (with string content)', () => {
    // Arrange: Props yang akan diteruskan ke komponen
    const props = {
      title: 'Test Title',
      content: 'Test Content',
    };

    // Act: Render komponen menggunakan mount dan beri props
    const wrapper = mount(Chips, {
      props,
    });

    // Assert: Pastikan title dan content dirender dengan benar
    expect(wrapper.find('span').text()).toContain(`${props.title} :`);
    expect(wrapper.find('span.font-bold').text()).toBe(props.content);
  });

  it('renders content correctly when content is a number', () => {
    const props = {
      title: 'Test Title',
      content: 12345, // Content sebagai angka
    };

    const wrapper = mount(Chips, {
      props,
    });

    // Assert: Pastikan content (number) dirender dengan benar
    expect(wrapper.find('span.font-bold').text()).toBe(String(props.content)); // Convert number to string
  });
});
