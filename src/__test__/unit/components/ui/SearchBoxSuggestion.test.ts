import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { shallowMount } from '@vue/test-utils';
import SearchBoxSuggestion from '@/components/ui/SearchBoxSuggestion.vue';

describe('SearchBoxSuggestion', () => {
    let wrapper: any;

    const sourceData = [
        { sentral: 'Central A', nama_sentral: 'Central A' },
        { sentral: 'Central B', nama_sentral: 'Central B' },
        { sentral: 'Central C', nama_sentral: 'Central C' }
    ];

    beforeEach(() => {
        // Use shallowMount to avoid rendering child components that may cause issues
        wrapper = shallowMount(SearchBoxSuggestion, {
            props: { source: sourceData },
            global: {
                // Mock any global dependencies
                stubs: {
                    'router-link': true
                }
            }
        });
        
        // Initialize searchQuery to prevent undefined errors
        if (wrapper.vm && wrapper.vm.searchQuery !== undefined) {
            wrapper.vm.searchQuery = '';
        }
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
    });

    it('should render the component without errors', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should accept source prop', () => {
        expect(wrapper.props('source')).toEqual(sourceData);
    });

    it('should have basic functionality', () => {
        // Test basic component existence and structure
        expect(wrapper.exists()).toBe(true);
        expect(wrapper.props('source')).toEqual(sourceData);
    });
});
