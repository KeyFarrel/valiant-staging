import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CardNotification from '@/components/ui/CardNotification.vue';

describe('CardNotification', () => {
  it('should render the component successfully', () => {
    const wrapper = mount(CardNotification);
    expect(wrapper.exists()).toBe(true);
  });

  it('should display the notification content correctly', () => {
    const wrapper = mount(CardNotification);
    const userText = wrapper.find('.text-sm .font-semibold');
    const actionText = wrapper.find('.text-sm');
    
    expect(userText.text()).toBe('User A');
    expect(actionText.text()).toContain('menolak Laporan Kertas Kerja');
  });

  it('should display the date correctly', () => {
    const wrapper = mount(CardNotification);
    const dateText = wrapper.find('.text-xs.text-\\[\\#989899\\]');
    
    expect(dateText.text()).toBe('04/04/2023');
  });
});