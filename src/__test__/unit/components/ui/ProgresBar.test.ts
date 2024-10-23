import { mount } from '@vue/test-utils';
import ProgressBar from '@/components/ui/ProgresBar.vue';

describe('ProgressBar.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(ProgressBar, {
      props: {
        max: 100,
        current: 50,
        color: '#ff0000' // setting custom color
      }
    });
  });

  it('renders the ProgressBar component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('computes the correct percentage based on props', async () => {
    // current: 50, max: 100 -> percentage should be 50
    expect(wrapper.vm.percentage).toBe(50);
    expect(wrapper.find('.bar').element.style.width).toBe('50%');
  });

  it('sets the correct background color', () => {
    expect(wrapper.find('.bar').element.style.backgroundColor).toBe('rgb(255, 0, 0)'); // #ff0000 converted to RGB
  });

  it('displays 0% when current is 0', async () => {
    await wrapper.setProps({ current: 0 });
    expect(wrapper.vm.percentage).toBe(0);
    expect(wrapper.find('.bar').element.style.width).toBe('0%');
  });

  it('handles maximum progress correctly', async () => {
    await wrapper.setProps({ current: 100, max: 100 });
    expect(wrapper.vm.percentage).toBe(100);
    expect(wrapper.find('.bar').element.style.width).toBe('100%');
  });

  it('handles progress exceeding max', async () => {
    await wrapper.setProps({ current: 150, max: 100 });
    expect(wrapper.vm.percentage).toBe(150); // it still computes based on the input
    expect(wrapper.find('.bar').element.style.width).toBe('150%'); // width exceeds 100%
  });
});
