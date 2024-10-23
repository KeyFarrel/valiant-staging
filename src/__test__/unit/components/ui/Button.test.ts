// File: Button.spec.ts
import { mount } from '@vue/test-utils';
import Button from '@/components/ui/Button.vue';

describe('Button.vue', () => {
  it('renders button with correct text and classes', () => {
    // Arrange: Props yang akan diteruskan ke komponen
    const props = {
      text: 'Click Me',
      iconPosition: 'Left',
      bgColor: 'bg-blue-500',
      hoverBgColor: 'hover:bg-blue-700',
      borderColor: 'border-blue-500',
      hoverBorderColor: 'hover:border-blue-700',
      textColor: 'text-white',
      hoverTextColor: 'hover:text-gray-200',
    };

    // Act: Render komponen menggunakan mount dan beri props
    const wrapper = mount(Button, {
      props,
    });

    // Assert: Pastikan button memiliki teks yang benar
    expect(wrapper.find('span').text()).toBe(props.text);

    // Assert: Pastikan class diterapkan dengan benar pada elemen <button>
    const button = wrapper.find('button');
    expect(button.classes()).toContain('bg-blue-500');
    expect(button.classes()).toContain('border-blue-500');
    expect(button.classes()).toContain('duration-300');

    // Assert: Pastikan class diterapkan dengan benar pada elemen <span>
    const span = wrapper.find('span');
    expect(span.classes()).toContain('text-white');
  });

  // Test lainnya tetap sama
});
