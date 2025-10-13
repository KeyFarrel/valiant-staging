import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProgresBar from '@/components/ui/ProgresBar.vue';

describe('ProgresBar.vue', () => {
    it('renders progress bar with default props', () => {
        const wrapper = mount(ProgresBar);
        expect(wrapper.find('.progress-bar').exists()).toBe(true);
        expect(wrapper.find('.bar').exists()).toBe(true);
    });

    it('calculates percentage correctly with given values', () => {
        const wrapper = mount(ProgresBar, {
            props: {
                max: 100,
                current: 50
            }
        });
        expect(wrapper.vm.percentage).toBe(50);
    });

    it('applies custom color to progress bar', () => {
        const customColor = '#ff0000';
        const wrapper = mount(ProgresBar, {
            props: {
                color: customColor,
                current: 30
            }
        });
        const bar = wrapper.find('.bar');
        expect(bar.attributes('style')).toContain(`background-color: ${customColor}`);
    });
});
