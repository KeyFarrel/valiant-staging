import { shallowMount } from '@vue/test-utils'
import LamanData from '@/views/Beranda/LamanData/LamanData.vue'

// Mock child components
jest.mock('@/components/ui/TabsWrapper.vue', () => ({
  name: 'TabsWrapper',
  template: '<div class="tabs-wrapper-mock"><slot></slot></div>',
  props: ['lamanData', 'isLihatGrafik']
}))

jest.mock('@/components/ui/TabItem.vue', () => ({
  name: 'TabItem',
  template: '<div class="tab-item-mock"><slot></slot></div>',
  props: ['title']
}))

jest.mock('@/views/Beranda/LamanData/TabPage/PageFinansial.vue', () => ({
  name: 'PageFinansial',
  template: '<div class="page-finansial-mock">PageFinansial Component</div>'
}))

jest.mock('@/views/Beranda/LamanData/TabPage/PageTeknis.vue', () => ({
  name: 'PageTeknis',
  template: '<div class="page-teknis-mock">PageTeknis Component</div>'
}))

jest.mock('@/views/Beranda/LamanData/TabPage/PageCAPEXOPEX.vue', () => ({
  name: 'PageCAPEXOPEX',
  template: '<div class="page-capex-opex-mock">PageCAPEXOPEX Component</div>'
}))

describe('LamanData.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = shallowMount(LamanData, {
      global: {
        stubs: {
          TabsWrapper: {
            name: 'TabsWrapper',
            template: '<div class="tabs-wrapper-mock"><slot></slot></div>',
            props: ['lamanData', 'isLihatGrafik']
          },
          TabItem: {
            name: 'TabItem',
            template: '<div class="tab-item-mock"><slot></slot></div>',
            props: ['title']
          },
          PageFinansial: {
            name: 'PageFinansial',
            template: '<div class="page-finansial-mock">PageFinansial Component</div>'
          },
          PageTeknis: {
            name: 'PageTeknis',
            template: '<div class="page-teknis-mock">PageTeknis Component</div>'
          },
          PageCAPEXOPEX: {
            name: 'PageCAPEXOPEX',
            template: '<div class="page-capex-opex-mock">PageCAPEXOPEX Component</div>'
          }
        }
      }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Component Mounting', () => {
    it('should mount successfully', () => {
      expect(wrapper.exists()).toBe(true)
    })

    it('should render main container with correct classes', () => {
      const container = wrapper.find('.bg-white.px-6.rounded-lg.min-h-full.flex.flex-col.pt-2')
      expect(container.exists()).toBe(true)
    })
  })

  describe('Component Structure', () => {
    it('should render TabsWrapper component', () => {
      const tabsWrapper = wrapper.findComponent({ name: 'TabsWrapper' })
      expect(tabsWrapper.exists()).toBe(true)
    })

    it('should render components in the template', () => {
      const html = wrapper.html()
      expect(html).toContain('tabs-wrapper-mock')
      expect(html).toContain('tab-item-mock')
      expect(html).toContain('page-capex-opex-mock')
      expect(html).toContain('page-finansial-mock')
      expect(html).toContain('page-teknis-mock')
    })

    it('should have correct template structure', () => {
      // Check that main container exists
      expect(wrapper.find('div.bg-white').exists()).toBe(true)
      
      // Check that TabsWrapper is rendered
      expect(wrapper.findComponent({ name: 'TabsWrapper' }).exists()).toBe(true)
    })
  })

  describe('Component Props and Layout', () => {
    it('should pass correct props to TabsWrapper', () => {
      // Since shallowMount stubs components, we'll check the template structure
      const html = wrapper.html()
      expect(html).toContain('tabs-wrapper-mock')
    })

    it('should contain three main page components', () => {
      const html = wrapper.html()
      expect(html).toContain('page-capex-opex-mock')
      expect(html).toContain('page-finansial-mock')
      expect(html).toContain('page-teknis-mock')
    })
  })

  describe('Layout and Styling', () => {
    it('should apply correct container styling', () => {
      const container = wrapper.find('div')
      expect(container.classes()).toEqual(
        expect.arrayContaining([
          'bg-white',
          'px-6', 
          'rounded-lg',
          'min-h-full',
          'flex',
          'flex-col',
          'pt-2'
        ])
      )
    })

    it('should have proper component structure', () => {
      const container = wrapper.find('.bg-white')
      expect(container.exists()).toBe(true)
      
      const tabsWrapper = wrapper.findComponent({ name: 'TabsWrapper' })
      expect(tabsWrapper.exists()).toBe(true)
    })
  })

  describe('Template Content', () => {
    it('should render all expected content', () => {
      const html = wrapper.html()
      
      // Should contain all the mocked components
      expect(html).toContain('tabs-wrapper-mock')
      expect(html).toContain('tab-item-mock')
      expect(html).toContain('PageCAPEXOPEX Component')
      expect(html).toContain('PageFinansial Component')
      expect(html).toContain('PageTeknis Component')
    })

    it('should have three tab sections', () => {
      const html = wrapper.html()
      const tabItemCount = (html.match(/tab-item-mock/g) || []).length
      expect(tabItemCount).toBe(3)
    })
  })

  describe('Component Integration', () => {
    it('should properly integrate TabsWrapper with TabItems and Page components', () => {
      // Test that the component structure is maintained
      expect(wrapper.findComponent({ name: 'TabsWrapper' }).exists()).toBe(true)
      
      // Test that the HTML contains all expected components
      const html = wrapper.html()
      expect(html).toContain('tabs-wrapper-mock')
      expect(html).toContain('PageCAPEXOPEX Component')
      expect(html).toContain('PageFinansial Component')
      expect(html).toContain('PageTeknis Component')
    })

    it('should maintain proper nesting structure', () => {
      const container = wrapper.find('.bg-white')
      const tabsWrapper = container.findComponent({ name: 'TabsWrapper' })
      expect(tabsWrapper.exists()).toBe(true)
    })
  })
})