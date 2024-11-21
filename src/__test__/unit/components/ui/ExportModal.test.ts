import { shallowMount } from '@vue/test-utils';
import ExportModal from '@/components/ui/ExportModal.vue';

describe('ExportModal.vue', () => {
  it('renders the button with correct classes and text', () => {
    const wrapper = shallowMount(ExportModal);

    // Check if the button is rendered
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);

    // Check if the button has the correct classes
    expect(button.classes()).toContain('relative');
    expect(button.classes()).toContain('float-left');
    expect(button.classes()).toContain('p-3');
    expect(button.classes()).toContain('text-xs');
    expect(button.classes()).toContain('font-medium');
    expect(button.classes()).toContain('text-white');
    expect(button.classes()).toContain('bg-[#0099AD]');
    expect(button.classes()).toContain('rounded-lg');
    expect(button.classes()).toContain('border');
    expect(button.classes()).toContain('border-[#0099AD]');
    expect(button.classes()).toContain('hover:bg-[#007E8F]');

    // Check if the button contains the correct text
    expect(button.find('span').text()).toBe('Export');
  });

  it('renders the SVG with correct attributes', () => {
    const wrapper = shallowMount(ExportModal);

    // Check if the SVG is rendered
    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);

    // Check if the SVG has the correct attributes
    expect(svg.attributes('width')).toBe('16');
    expect(svg.attributes('height')).toBe('12');
    expect(svg.attributes('viewBox')).toBe('0 0 14 10');
    expect(svg.attributes('fill')).toBe('none');
    expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg');
  });

  it('renders the path with correct attributes', () => {
    const wrapper = shallowMount(ExportModal);

    // Check if the path is rendered
    const path = wrapper.find('path');
    expect(path.exists()).toBe(true);

    // Check if the path has the correct attributes
    expect(path.attributes('fill-rule')).toBe('evenodd');
    expect(path.attributes('clip-rule')).toBe('evenodd');
    expect(path.attributes('d')).toBe('M6.12508 1.20829C4.75588 1.20829 3.64591 2.31825 3.64591 3.68746C3.64591 3.84553 3.66063 3.99964 3.68862 4.14863C3.74259 4.43595 3.57555 4.71884 3.2979 4.81034C2.48294 5.07892 1.89591 5.84665 1.89591 6.74996C1.89591 7.87754 2.81 8.79163 3.93758 8.79163H10.5001C11.386 8.79163 12.1042 8.07342 12.1042 7.18746C12.1042 6.50304 11.6754 5.91733 11.0697 5.68719C10.774 5.57484 10.6217 5.2473 10.7264 4.94881C10.7686 4.82865 10.7917 4.69889 10.7917 4.56246C10.7917 3.91813 10.2694 3.39579 9.62508 3.39579C9.49836 3.39579 9.37744 3.41579 9.26468 3.45236C9.11237 3.50175 8.94646 3.48637 8.80583 3.40982C8.6652 3.33327 8.56222 3.20228 8.52102 3.04755C8.23896 1.9881 7.27235 1.20829 6.12508 1.20829ZM2.47925 3.68746C2.47925 1.67392 4.11154 0.041626 6.12508 0.041626C7.62264 0.041626 8.90824 0.944132 9.46959 2.23425C9.52103 2.23085 9.57288 2.22913 9.62508 2.22913C10.9137 2.22913 11.9584 3.27379 11.9584 4.56246C11.9584 4.65018 11.9535 4.73689 11.9441 4.82232C12.7393 5.30885 13.2709 6.18556 13.2709 7.18746C13.2709 8.71775 12.0304 9.95829 10.5001 9.95829H3.93758C2.16567 9.95829 0.729248 8.52187 0.729248 6.74996C0.729248 5.50032 1.44338 4.41866 2.48473 3.88884C2.48109 3.82213 2.47925 3.75499 2.47925 3.68746ZM7.00008 3.10413C7.32225 3.10413 7.58341 3.36529 7.58341 3.68746V6.21667L8.3376 5.46248C8.56541 5.23467 8.93475 5.23467 9.16256 5.46248C9.39037 5.69029 9.39037 6.05963 9.16256 6.28744L7.41256 8.03744C7.18475 8.26524 6.81541 8.26524 6.5876 8.03744L4.8376 6.28744C4.6098 6.05963 4.6098 5.69029 4.8376 5.46248C5.06541 5.23467 5.43475 5.23467 5.66256 5.46248L6.41675 6.21667V3.68746C6.41675 3.36529 6.67791 3.10413 7.00008 3.10413Z');
    expect(path.attributes('fill')).toBe('white');
  });
});