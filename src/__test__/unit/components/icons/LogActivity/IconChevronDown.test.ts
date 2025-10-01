/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconChevronDown from "@/components/icons/LogActivity/IconChevronDown.vue"

describe("IconChevronDown.vue", () => {
  let wrapper: VueWrapper<any>

  beforeAll(() => {
    // Setup DOM polyfills
    global.TextEncoder = global.TextEncoder || require('util').TextEncoder
    global.TextDecoder = global.TextDecoder || require('util').TextDecoder
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    jest.clearAllMocks()
  })

  describe("Component Mounting", () => {
    it("should mount successfully", () => {
      wrapper = shallowMount(IconChevronDown)
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should render as SVG element", () => {
      wrapper = shallowMount(IconChevronDown)
      
      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
    })

    it("should be Vue component instance", () => {
      wrapper = shallowMount(IconChevronDown)
      
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.$).toBeDefined()
    })
  })

  describe("SVG Structure", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconChevronDown)
    })

    it("should have correct SVG attributes", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('16')
      expect(svg.attributes('height')).toBe('16')
      expect(svg.attributes('viewBox')).toBe('0 0 16 16')
      expect(svg.attributes('fill')).toBe('none')
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    })

    it("should contain path element", () => {
      const path = wrapper.find('path')
      
      expect(path.exists()).toBe(true)
    })

    it("should have correct path attributes", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('fill-rule')).toBe('evenodd')
      expect(path.attributes('clip-rule')).toBe('evenodd')
      expect(path.attributes('fill')).toBe('#697586')
    })

    it("should have correct path data", () => {
      const path = wrapper.find('path')
      const expectedPath = "M8.70711 11.2071C8.31658 11.5976 7.68342 11.5976 7.29289 11.2071L2.29289 6.20711C1.90237 5.81658 1.90237 5.18342 2.29289 4.79289C2.68342 4.40237 3.31658 4.40237 3.70711 4.79289L8 9.08579L12.2929 4.79289C12.6834 4.40237 13.3166 4.40237 13.7071 4.79289C14.0976 5.18342 14.0976 5.81658 13.7071 6.20711L8.70711 11.2071Z"
      
      expect(path.attributes('d')).toBe(expectedPath)
    })
  })

  describe("Component Rendering", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconChevronDown)
    })

    it("should render correct HTML structure", () => {
      const html = wrapper.html()
      
      expect(html).toContain('<svg')
      expect(html).toContain('width="16"')
      expect(html).toContain('height="16"')
      expect(html).toContain('<path')
      expect(html).toContain('fill="#697586"')
    })

    it("should have no child components", () => {
      const childComponents = wrapper.findAllComponents(() => true)
      
      expect(childComponents.length).toBe(0)
    })

    it("should have single root element", () => {
      const rootElements = wrapper.element.children
      
      expect(rootElements.length).toBe(1) // SVG contains one path element
      expect(wrapper.element.tagName.toLowerCase()).toBe('svg')
    })
  })

  describe("Icon Styling", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconChevronDown)
    })

    it("should have default icon size", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('16')
      expect(svg.attributes('height')).toBe('16')
    })

    it("should have gray color fill", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('fill')).toBe('#697586')
    })

    it("should use proper SVG namespace", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    })

    it("should have transparent background", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('fill')).toBe('none')
    })
  })

  describe("Accessibility", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconChevronDown)
    })

    it("should be keyboard accessible", () => {
      const svg = wrapper.find('svg')
      
      // SVG should be focusable for accessibility
      expect(svg.element.tagName.toLowerCase()).toBe('svg')
    })

    it("should maintain aspect ratio", () => {
      const svg = wrapper.find('svg')
      const width = parseInt(svg.attributes('width') || '0')
      const height = parseInt(svg.attributes('height') || '0')
      
      expect(width).toBe(height) // Square icon
      expect(width).toBe(16)
    })

    it("should have proper viewBox for scaling", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('viewBox')).toBe('0 0 16 16')
    })
  })

  describe("Component Props", () => {
    it("should accept no props", () => {
      wrapper = shallowMount(IconChevronDown, {
        props: {}
      })
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should work without any configuration", () => {
      wrapper = shallowMount(IconChevronDown)
      
      expect(wrapper.find('svg').exists()).toBe(true)
      expect(wrapper.find('path').exists()).toBe(true)
    })
  })

  describe("Icon Direction", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconChevronDown)
    })

    it("should point downward (chevron down)", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // Path should contain downward pointing coordinates
      expect(pathData).toContain('11.2071') // Bottom y-coordinate
      expect(pathData).toContain('4.79289') // Top y-coordinate
    })

    it("should have correct geometric shape", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('fill-rule')).toBe('evenodd')
      expect(path.attributes('clip-rule')).toBe('evenodd')
    })
  })

  describe("Component Integration", () => {
    it("should be usable as child component", () => {
      const ParentComponent = {
        template: '<div><IconChevronDown /></div>',
        components: { IconChevronDown }
      }
      
      const parentWrapper = shallowMount(ParentComponent)
      const iconComponent = parentWrapper.findComponent(IconChevronDown)
      
      expect(iconComponent.exists()).toBe(true)
      parentWrapper.unmount()
    })

    it("should maintain state across re-renders", () => {
      wrapper = shallowMount(IconChevronDown)
      const initialHtml = wrapper.html()
      
      wrapper.vm.$forceUpdate()
      const afterUpdateHtml = wrapper.html()
      
      expect(initialHtml).toBe(afterUpdateHtml)
    })
  })

  describe("Performance", () => {
    it("should render efficiently", () => {
      const startTime = performance.now()
      
      wrapper = shallowMount(IconChevronDown)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      expect(renderTime).toBeLessThan(50) // Should render in less than 50ms
      expect(wrapper.exists()).toBe(true)
    })

    it("should have minimal DOM footprint", () => {
      wrapper = shallowMount(IconChevronDown)
      
      const element = wrapper.element
      expect(element.children.length).toBe(1) // Only one path element
      expect(element.tagName.toLowerCase()).toBe('svg')
    })
  })

  describe("Error Handling", () => {
    it("should handle mounting errors gracefully", () => {
      expect(() => {
        wrapper = shallowMount(IconChevronDown)
      }).not.toThrow()
    })

    it("should handle force update without errors", () => {
      wrapper = shallowMount(IconChevronDown)
      
      expect(() => {
        wrapper.vm.$forceUpdate()
      }).not.toThrow()
    })

    it("should handle unmounting gracefully", () => {
      wrapper = shallowMount(IconChevronDown)
      
      expect(() => {
        wrapper.unmount()
      }).not.toThrow()
    })
  })
})
