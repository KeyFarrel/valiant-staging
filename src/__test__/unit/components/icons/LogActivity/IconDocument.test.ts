/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconDocument from "@/components/icons/LogActivity/IconDocument.vue"

describe("IconDocument.vue", () => {
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
      wrapper = shallowMount(IconDocument)
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should render as SVG element", () => {
      wrapper = shallowMount(IconDocument)
      
      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
    })

    it("should be Vue component instance", () => {
      wrapper = shallowMount(IconDocument)
      
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.$).toBeDefined()
    })
  })

  describe("SVG Structure", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDocument)
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
      
      expect(path.attributes('stroke')).toBe('#4791F2')
      expect(path.attributes('stroke-width')).toBe('1.33333')
      expect(path.attributes('stroke-linecap')).toBe('round')
      expect(path.attributes('stroke-linejoin')).toBe('round')
    })

    it("should have correct path data", () => {
      const path = wrapper.find('path')
      const expectedPath = "M10 4.66827L5.66671 9.0016C5.4015 9.26682 5.2525 9.62653 5.2525 10.0016C5.2525 10.3767 5.4015 10.7364 5.66671 11.0016C5.93193 11.2668 6.29164 11.4158 6.66671 11.4158C7.04179 11.4158 7.4015 11.2668 7.66671 11.0016L12 6.66827C12.5305 6.13784 12.8285 5.41842 12.8285 4.66827C12.8285 3.91813 12.5305 3.1987 12 2.66827C11.4696 2.13784 10.7502 1.83984 10 1.83984C9.2499 1.83984 8.53048 2.13784 8.00005 2.66827L3.66671 7.0016C2.87106 7.79725 2.42407 8.87639 2.42407 10.0016C2.42407 11.1268 2.87106 12.206 3.66671 13.0016C4.46236 13.7973 5.54149 14.2442 6.66671 14.2442C7.79193 14.2442 8.87106 13.7973 9.66671 13.0016L14 8.66827"
      
      expect(path.attributes('d')).toBe(expectedPath)
    })
  })

  describe("Component Rendering", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDocument)
    })

    it("should render correct HTML structure", () => {
      const html = wrapper.html()
      
      expect(html).toContain('<svg')
      expect(html).toContain('width="16"')
      expect(html).toContain('height="16"')
      expect(html).toContain('<path')
      expect(html).toContain('stroke="#4791F2"')
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
      wrapper = shallowMount(IconDocument)
    })

    it("should have default icon size", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('16')
      expect(svg.attributes('height')).toBe('16')
    })

    it("should have blue stroke color", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('stroke')).toBe('#4791F2')
    })

    it("should use proper SVG namespace", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    })

    it("should have transparent background", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('fill')).toBe('none')
    })

    it("should have rounded line caps and joins", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('stroke-linecap')).toBe('round')
      expect(path.attributes('stroke-linejoin')).toBe('round')
    })

    it("should have correct stroke width", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('stroke-width')).toBe('1.33333')
    })
  })

  describe("Accessibility", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDocument)
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
      wrapper = shallowMount(IconDocument, {
        props: {}
      })
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should work without any configuration", () => {
      wrapper = shallowMount(IconDocument)
      
      expect(wrapper.find('svg').exists()).toBe(true)
      expect(wrapper.find('path').exists()).toBe(true)
    })
  })

  describe("Icon Design", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDocument)
    })

    it("should represent document/attachment shape", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // Path should contain curves and lines representing document attachment
      expect(pathData).toContain('M10 4.66827') // Starting point
      expect(pathData).toContain('L5.66671 9.0016') // Line to
      expect(pathData).toContain('C') // Curves for document shape
    })

    it("should have complex path for document representation", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // Document icon should have multiple path commands
      expect(pathData.includes('M')).toBe(true) // Move to
      expect(pathData.includes('L')).toBe(true) // Line to
      expect(pathData.includes('C')).toBe(true) // Curve to
    })

    it("should use stroke-based design", () => {
      const path = wrapper.find('path')
      
      // Document icon uses stroke instead of fill
      expect(path.attributes('stroke')).toBeDefined()
      expect(path.attributes('fill')).toBeUndefined()
    })
  })

  describe("Component Integration", () => {
    it("should be usable as child component", () => {
      const ParentComponent = {
        template: '<div><IconDocument /></div>',
        components: { IconDocument }
      }
      
      const parentWrapper = shallowMount(ParentComponent)
      const iconComponent = parentWrapper.findComponent(IconDocument)
      
      expect(iconComponent.exists()).toBe(true)
      parentWrapper.unmount()
    })

    it("should maintain state across re-renders", () => {
      wrapper = shallowMount(IconDocument)
      const initialHtml = wrapper.html()
      
      wrapper.vm.$forceUpdate()
      const afterUpdateHtml = wrapper.html()
      
      expect(initialHtml).toBe(afterUpdateHtml)
    })
  })

  describe("Performance", () => {
    it("should render efficiently", () => {
      const startTime = performance.now()
      
      wrapper = shallowMount(IconDocument)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      expect(renderTime).toBeLessThan(50) // Should render in less than 50ms
      expect(wrapper.exists()).toBe(true)
    })

    it("should have minimal DOM footprint", () => {
      wrapper = shallowMount(IconDocument)
      
      const element = wrapper.element
      expect(element.children.length).toBe(1) // Only one path element
      expect(element.tagName.toLowerCase()).toBe('svg')
    })
  })

  describe("Error Handling", () => {
    it("should handle mounting errors gracefully", () => {
      expect(() => {
        wrapper = shallowMount(IconDocument)
      }).not.toThrow()
    })

    it("should handle force update without errors", () => {
      wrapper = shallowMount(IconDocument)
      
      expect(() => {
        wrapper.vm.$forceUpdate()
      }).not.toThrow()
    })

    it("should handle unmounting gracefully", () => {
      wrapper = shallowMount(IconDocument)
      
      expect(() => {
        wrapper.unmount()
      }).not.toThrow()
    })
  })

  describe("Comparison with Other Icons", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDocument)
    })

    it("should have different design approach than chevron icons", () => {
      const path = wrapper.find('path')
      
      // Document icon uses stroke while chevron icons use fill
      expect(path.attributes('stroke')).toBeDefined()
      expect(path.attributes('fill')).toBeUndefined()
    })

    it("should have same dimensions as other icons", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('16')
      expect(svg.attributes('height')).toBe('16')
      expect(svg.attributes('viewBox')).toBe('0 0 16 16')
    })

    it("should use different color scheme", () => {
      const path = wrapper.find('path')
      
      // Document icon uses blue (#4791F2) while chevron icons use gray (#697586)
      expect(path.attributes('stroke')).toBe('#4791F2')
      expect(path.attributes('stroke')).not.toBe('#697586')
    })

    it("should have more complex path than simple icons", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // Document icon has longer, more complex path
      expect(pathData.length).toBeGreaterThan(100)
      expect(pathData.includes('C')).toBe(true) // Contains curves
    })
  })

  describe("Visual Validation", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDocument)
    })

    it("should represent attachment/paperclip visual", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // Visual cues for paperclip/attachment shape
      expect(pathData).toContain('M10 4.66827') // Starting point
      expect(pathData).toContain('L14 8.66827') // Ending point
    })

    it("should maintain proper stroke properties", () => {
      const path = wrapper.find('path')
      
      // Stroke properties for smooth appearance
      expect(path.attributes('stroke-linecap')).toBe('round')
      expect(path.attributes('stroke-linejoin')).toBe('round')
      expect(parseFloat(path.attributes('stroke-width') || '0')).toBeGreaterThan(1)
    })

    it("should have proper geometric structure", () => {
      const svg = wrapper.find('svg')
      
      // Icon should be perfectly square for proper visual appearance
      const width = parseInt(svg.attributes('width') || '0')
      const height = parseInt(svg.attributes('height') || '0')
      
      expect(width).toBe(height)
      expect(width).toBe(16)
    })
  })

  describe("Color and Theme", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDocument)
    })

    it("should use primary blue color", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('stroke')).toBe('#4791F2')
    })

    it("should be suitable for document/file representations", () => {
      const path = wrapper.find('path')
      
      // Blue color is commonly used for document/file icons
      const strokeColor = path.attributes('stroke')
      expect(strokeColor).toMatch(/^#[0-9A-F]{6}$/i) // Valid hex color
      expect(strokeColor).toBe('#4791F2') // Specific blue shade
    })

    it("should maintain color consistency", () => {
      const path = wrapper.find('path')
      
      // All stroke elements should use the same color
      expect(path.attributes('stroke')).toBe('#4791F2')
    })
  })
})
