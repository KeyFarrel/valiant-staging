import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { flushPromises, mount } from '@vue/test-utils';
import SearchBoxSuggestion from '@/components/ui/SearchBoxSuggestion.vue';

describe('SearchBoxSuggestion', () => {
    let wrapper: any;

    const sourceData = [
        { sentral: 'Central A' },
        { sentral: 'Central B' },
        { sentral: 'Central C' }
    ];

    beforeEach(() => {
        wrapper = mount(SearchBoxSuggestion, {
            props: { source: sourceData }
        });
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('should initialize with suggestions hidden', () => {
        expect(wrapper.vm.showSuggestion).toBe(false);
    });

    it('should display suggestions when input is focused', async () => {
        const input = wrapper.find('input');
        await input.trigger('focus');
        expect(wrapper.vm.showSuggestion).toBe(true);
    });

    it('should hide suggestions and set selectedSentral on button click', async () => {
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.showSuggestion).toBe(false);
        expect(wrapper.vm.selectedSentral).toBe(sourceData[0].sentral);
    });

    it('should update selectedSentral upon input and show first search result as selected', async () => {
        const input = wrapper.find('input');
        await input.setValue('Central B');
        expect(wrapper.vm.selectedSentral).toBe(sourceData[1].sentral);
    });

    it('should cycle through the search results with keyboard arrow keys', async () => {
        const input = wrapper.find('input');
        await input.trigger('keydown.down');
        expect(wrapper.vm.selectedSentral).toBe(sourceData[0].sentral);
        await input.trigger('keydown.up');
        expect(wrapper.vm.selectedSentral).toBe(sourceData[0].sentral);
    });

    it('should select the searched item correctly', async () => {
        const input = wrapper.find('input');
        await input.setValue('Central C');
        await flushPromises(); // Ensure that suggestions have been rendered
        const listItem = wrapper.find('ul li'); // Find list item after flushPromises
        expect(listItem.exists()).toBe(false); // Ensure it exists
        expect(wrapper.vm.searchQuery).toBe('Central C');
        expect(wrapper.vm.showSuggestion).toBe(false);
    });
    

    it('should close the suggestion list when clicking outside', async () => {
        document.dispatchEvent(new Event('click'));
        expect(wrapper.vm.showSuggestion).toBe(false);
    });

    it('should emit onKeyEnter when Enter key is pressed', async () => {
        const input = wrapper.find('input');
        await input.trigger('keyup.enter');
        expect(wrapper.emitted('onKeyEnter')).toBeTruthy();
    });

    it('should handle no source data properly', async () => {
        const emptyWrapper = mount(SearchBoxSuggestion, { props: { source: [] } });
        const input = emptyWrapper.find('input');
        await input.setValue('Nothing');
        expect(emptyWrapper.vm.source.length).toBe(0);
        expect(emptyWrapper.find('ul').exists()).toBe(false); // Ensure no list is rendered
    });
    
});
