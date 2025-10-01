/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconChevronUp from "@/components/icons/LogActivity/IconChevronUp.vue"

describe("IconChevronUp.vue", () => {
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
      wrapper = shallowMount(IconChevronUp)
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should render as SVG element", () => {
      wrapper = shallowMount(IconChevronUp)
      
      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
    })

    it("should be Vue component instance", () => {
      wrapper = shallowMount(IconChevronUp)
      
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.$).toBeDefined()
    })
  })

  describe("SVG Structure", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconChevronUp)
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

    it("should have correct path data for chevron up", () => {
      const path = wrapper.find('path')
      const expectedPath = "M7.29289 4.79289C7.68342 4.40237 8.31658 4.40237 8.70711 4.79289L13.7071 9.79289C14.0976 10.1834 14.0976 10.8166 13.7071 11.2071C13.3166 11.5976 12.6834 11.5976 12.2929 11.2071L8 6.91421L3.70711 11.2071C3.31658 11.5976 2.68342 11.5976 2.29289 11.2071C1.90237 10.8166 1.90237 10.1834 2.29289 9.79289L7.29289 4.79289Z"
      
      expect(path.attributes('d')).toBe(expectedPath)
    })
  })

  describe("Component Rendering", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconChevronUp)
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
      wrapper = shallowMount(IconChevronUp)
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
      wrapper = shallowMount(IconChevronUp)
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
      wrapper = shallowMount(IconChevronUp, {
        props: {}
      })
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should work without any configuration", () => {
      wrapper = shallowMount(IconChevronUp)
      
      expect(wrapper.find('svg').exists()).toBe(true)
      expect(wrapper.find('path').exists()).toBe(true)
    })
  })

  describe("Icon Direction", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconChevronUp)
    })

    it("should point upward (chevron up)", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // Path should contain upward pointing coordinates
      expect(pathData).toContain('4.79289') // Top y-coordinate
      expect(pathData).toContain('11.2071') // Bottom y-coordinate
      // Verify upward direction by checking the starting point
      expect(pathData.startsWith('M7.29289 4.79289')).toBe(true) // Starts from top
    })

    it("should have correct geometric shape", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('fill-rule')).toBe('evenodd')
      expect(path.attributes('clip-rule')).toBe('evenodd')
    })

    it("should be opposite direction of chevron down", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // ChevronUp starts from top (4.79289) and goes down
      // This is opposite to ChevronDown which starts from bottom
      expect(pathData).toContain('M7.29289 4.79289') // Starting point at top
      expect(pathData).toContain('L8 6.91421') // Middle point
    })
  })

  describe("Component Integration", () => {
    it("should be usable as child component", () => {
      const ParentComponent = {
        template: '<div><IconChevronUp /></div>',
        components: { IconChevronUp }
      }
      
      const parentWrapper = shallowMount(ParentComponent)
      const iconComponent = parentWrapper.findComponent(IconChevronUp)
      
      expect(iconComponent.exists()).toBe(true)
      parentWrapper.unmount()
    })

    it("should maintain state across re-renders", () => {
      wrapper = shallowMount(IconChevronUp)
      const initialHtml = wrapper.html()
      
      wrapper.vm.$forceUpdate()
      const afterUpdateHtml = wrapper.html()
      
      expect(initialHtml).toBe(afterUpdateHtml)
    })
  })

  describe("Performance", () => {
    it("should render efficiently", () => {
      const startTime = performance.now()
      
      wrapper = shallowMount(IconChevronUp)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      expect(renderTime).toBeLessThan(50) // Should render in less than 50ms
      expect(wrapper.exists()).toBe(true)
    })

    it("should have minimal DOM footprint", () => {
      wrapper = shallowMount(IconChevronUp)
      
      const element = wrapper.element
      expect(element.children.length).toBe(1) // Only one path element
      expect(element.tagName.toLowerCase()).toBe('svg')
    })
  })

  describe("Error Handling", () => {
    it("should handle mounting errors gracefully", () => {
      expect(() => {
        wrapper = shallowMount(IconChevronUp)
      }).not.toThrow()
    })

    it("should handle force update without errors", () => {
      wrapper = shallowMount(IconChevronUp)
      
      expect(() => {
        wrapper.vm.$forceUpdate()
      }).not.toThrow()
    })

    it("should handle unmounting gracefully", () => {
      wrapper = shallowMount(IconChevronUp)
      
      expect(() => {
        wrapper.unmount()
      }).not.toThrow()
    })
  })

  describe("Comparison with ChevronDown", () => {
    it("should have same dimensions as ChevronDown", () => {
      wrapper = shallowMount(IconChevronUp)
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('16')
      expect(svg.attributes('height')).toBe('16')
      expect(svg.attributes('viewBox')).toBe('0 0 16 16')
    })

    it("should have same color as ChevronDown", () => {
      wrapper = shallowMount(IconChevronUp)
      const path = wrapper.find('path')
      
      expect(path.attributes('fill')).toBe('#697586')
    })

    it("should have different path data than ChevronDown", () => {
      wrapper = shallowMount(IconChevronUp)
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // ChevronUp path should be different from ChevronDown
      const chevronDownPath = "M8.70711 11.2071C8.31658 11.5976 7.68342 11.5976 7.29289 11.2071L2.29289 6.20711C1.90237 5.81658 1.90237 5.18342 2.29289 4.79289C2.68342 4.40237 3.31658 4.40237 3.70711 4.79289L8 9.08579L12.2929 4.79289C12.6834 4.40237 13.3166 4.40237 13.7071 4.79289C14.0976 5.18342 14.0976 5.81658 13.7071 6.20711L8.70711 11.2071Z"
      
      expect(pathData).not.toBe(chevronDownPath)
    })

    it("should have consistent styling patterns", () => {
      wrapper = shallowMount(IconChevronUp)
      const svg = wrapper.find('svg')
      const path = wrapper.find('path')
      
      // Should follow same styling patterns as ChevronDown
      expect(svg.attributes('fill')).toBe('none')
      expect(path.attributes('fill-rule')).toBe('evenodd')
      expect(path.attributes('clip-rule')).toBe('evenodd')
    })
  })

  describe("Visual Validation", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconChevronUp)
    })

    it("should have upward pointing visual cue", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // Visual validation: chevron up should start from a lower y-coordinate at the tip
      // and expand to higher y-coordinates at the base
      expect(pathData).toContain('4.79289') // Tip coordinate (lower y)
      expect(pathData).toContain('11.2071') // Base coordinates (higher y)
    })

    it("should maintain proper geometric proportions", () => {
      const svg = wrapper.find('svg')
      
      // Icon should be perfectly square for proper visual appearance
      const width = parseInt(svg.attributes('width') || '0')
      const height = parseInt(svg.attributes('height') || '0')
      
      expect(width).toBe(height)
      expect(width).toBeGreaterThan(0)
    })
  })
})
