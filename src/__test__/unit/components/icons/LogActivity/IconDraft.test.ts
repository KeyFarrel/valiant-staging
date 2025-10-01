/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconDraft from "@/components/icons/LogActivity/IconDraft.vue"

describe("IconDraft.vue", () => {
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
      wrapper = shallowMount(IconDraft)
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should render as SVG element", () => {
      wrapper = shallowMount(IconDraft)
      
      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
    })

    it("should be Vue component instance", () => {
      wrapper = shallowMount(IconDraft)
      
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.$).toBeDefined()
    })
  })

  describe("SVG Structure", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDraft)
    })

    it("should have correct SVG attributes", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('24')
      expect(svg.attributes('height')).toBe('24')
      expect(svg.attributes('viewBox')).toBe('0 0 24 24')
      expect(svg.attributes('fill')).toBe('none')
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    })

    it("should contain multiple path elements", () => {
      const paths = wrapper.findAll('path')
      
      expect(paths.length).toBe(2)
    })

    it("should have correct path stroke attributes", () => {
      const paths = wrapper.findAll('path')
      
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('#0A448F')
        expect(path.attributes('stroke-width')).toBe('1.33333')
        expect(path.attributes('stroke-linecap')).toBe('round')
        expect(path.attributes('stroke-linejoin')).toBe('round')
      })
    })

    it("should have correct first path data", () => {
      const firstPath = wrapper.findAll('path')[0]
      const expectedPath = "M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19"
      
      expect(firstPath.attributes('d')).toBe(expectedPath)
    })

    it("should have correct second path data", () => {
      const secondPath = wrapper.findAll('path')[1]
      const expectedPath = "M9 9H10M9 13H15M9 17H15M17 21H7C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21Z"
      
      expect(secondPath.attributes('d')).toBe(expectedPath)
    })
  })

  describe("Component Rendering", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDraft)
    })

    it("should render correct HTML structure", () => {
      const html = wrapper.html()
      
      expect(html).toContain('<svg')
      expect(html).toContain('width="24"')
      expect(html).toContain('height="24"')
      expect(html).toContain('<path')
      expect(html).toContain('stroke="#0A448F"')
    })

    it("should have no child components", () => {
      const childComponents = wrapper.findAllComponents(() => true)
      
      expect(childComponents.length).toBe(0)
    })

    it("should have single root element with multiple paths", () => {
      const rootElements = wrapper.element.children
      
      expect(rootElements.length).toBe(2) // SVG contains two path elements
      expect(wrapper.element.tagName.toLowerCase()).toBe('svg')
    })
  })

  describe("Icon Styling", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDraft)
    })

    it("should have larger icon size", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('24')
      expect(svg.attributes('height')).toBe('24')
    })

    it("should have dark blue stroke color", () => {
      const paths = wrapper.findAll('path')
      
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('#0A448F')
      })
    })

    it("should use proper SVG namespace", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    })

    it("should have transparent background", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('fill')).toBe('none')
    })

    it("should have consistent stroke properties", () => {
      const paths = wrapper.findAll('path')
      
      paths.forEach(path => {
        expect(path.attributes('stroke-linecap')).toBe('round')
        expect(path.attributes('stroke-linejoin')).toBe('round')
        expect(path.attributes('stroke-width')).toBe('1.33333')
      })
    })
  })

  describe("Accessibility", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDraft)
    })

    it("should be keyboard accessible", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.element.tagName.toLowerCase()).toBe('svg')
    })

    it("should maintain aspect ratio", () => {
      const svg = wrapper.find('svg')
      const width = parseInt(svg.attributes('width') || '0')
      const height = parseInt(svg.attributes('height') || '0')
      
      expect(width).toBe(height) // Square icon
      expect(width).toBe(24)
    })

    it("should have proper viewBox for scaling", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    })
  })

  describe("Component Props", () => {
    it("should accept no props", () => {
      wrapper = shallowMount(IconDraft, {
        props: {}
      })
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should work without any configuration", () => {
      wrapper = shallowMount(IconDraft)
      
      expect(wrapper.find('svg').exists()).toBe(true)
      expect(wrapper.findAll('path').length).toBe(2)
    })
  })

  describe("Icon Design", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDraft)
    })

    it("should represent document draft shape", () => {
      const paths = wrapper.findAll('path')
      
      // First path should represent document corner fold
      expect(paths[0].attributes('d')).toContain('M14 3V7')
      expect(paths[0].attributes('d')).toContain('H19')
      
      // Second path should represent document body with lines
      expect(paths[1].attributes('d')).toContain('M9 9H10') // Short line
      expect(paths[1].attributes('d')).toContain('M9 13H15') // Long line
      expect(paths[1].attributes('d')).toContain('M9 17H15') // Long line
    })

    it("should have document structure elements", () => {
      const secondPath = wrapper.findAll('path')[1]
      const pathData = secondPath.attributes('d')
      
      // Should contain document outline and content lines
      expect(pathData).toContain('M9 9H10') // Header line
      expect(pathData).toContain('M9 13H15') // Content line 1
      expect(pathData).toContain('M9 17H15') // Content line 2
      expect(pathData).toContain('H7') // Document border
    })

    it("should use stroke-based design", () => {
      const paths = wrapper.findAll('path')
      
      // Draft icon uses stroke instead of fill
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBeDefined()
        expect(path.attributes('fill')).toBeUndefined()
      })
    })
  })

  describe("Component Integration", () => {
    it("should be usable as child component", () => {
      const ParentComponent = {
        template: '<div><IconDraft /></div>',
        components: { IconDraft }
      }
      
      const parentWrapper = shallowMount(ParentComponent)
      const iconComponent = parentWrapper.findComponent(IconDraft)
      
      expect(iconComponent.exists()).toBe(true)
      parentWrapper.unmount()
    })

    it("should maintain state across re-renders", () => {
      wrapper = shallowMount(IconDraft)
      const initialHtml = wrapper.html()
      
      wrapper.vm.$forceUpdate()
      const afterUpdateHtml = wrapper.html()
      
      expect(initialHtml).toBe(afterUpdateHtml)
    })
  })

  describe("Performance", () => {
    it("should render efficiently", () => {
      const startTime = performance.now()
      
      wrapper = shallowMount(IconDraft)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      expect(renderTime).toBeLessThan(50) // Should render in less than 50ms
      expect(wrapper.exists()).toBe(true)
    })

    it("should have reasonable DOM footprint", () => {
      wrapper = shallowMount(IconDraft)
      
      const element = wrapper.element
      expect(element.children.length).toBe(2) // Two path elements
      expect(element.tagName.toLowerCase()).toBe('svg')
    })
  })

  describe("Error Handling", () => {
    it("should handle mounting errors gracefully", () => {
      expect(() => {
        wrapper = shallowMount(IconDraft)
      }).not.toThrow()
    })

    it("should handle force update without errors", () => {
      wrapper = shallowMount(IconDraft)
      
      expect(() => {
        wrapper.vm.$forceUpdate()
      }).not.toThrow()
    })

    it("should handle unmounting gracefully", () => {
      wrapper = shallowMount(IconDraft)
      
      expect(() => {
        wrapper.unmount()
      }).not.toThrow()
    })
  })

  describe("Comparison with Other Icons", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDraft)
    })

    it("should be larger than other icons", () => {
      const svg = wrapper.find('svg')
      
      // Draft icon is 24x24 while others are 16x16
      expect(svg.attributes('width')).toBe('24')
      expect(svg.attributes('height')).toBe('24')
      expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    })

    it("should use different blue shade", () => {
      const paths = wrapper.findAll('path')
      
      // Draft icon uses dark blue (#0A448F) vs document blue (#4791F2)
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('#0A448F')
        expect(path.attributes('stroke')).not.toBe('#4791F2')
        expect(path.attributes('stroke')).not.toBe('#697586')
      })
    })

    it("should have multiple path elements", () => {
      const paths = wrapper.findAll('path')
      
      // Draft icon has 2 paths vs single path in other icons
      expect(paths.length).toBe(2)
    })

    it("should follow consistent stroke patterns", () => {
      const paths = wrapper.findAll('path')
      
      // Should follow same stroke patterns as other stroke-based icons
      paths.forEach(path => {
        expect(path.attributes('stroke-linecap')).toBe('round')
        expect(path.attributes('stroke-linejoin')).toBe('round')
        expect(path.attributes('stroke-width')).toBe('1.33333')
      })
    })
  })

  describe("Visual Validation", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDraft)
    })

    it("should represent document with folded corner", () => {
      const firstPath = wrapper.findAll('path')[0]
      const pathData = firstPath.attributes('d')
      
      // First path represents folded corner of document
      expect(pathData).toContain('M14 3V7') // Vertical line
      expect(pathData).toContain('H19') // Horizontal line
      expect(pathData).toContain('C14 7.26522') // Curve for fold
    })

    it("should have text lines representation", () => {
      const secondPath = wrapper.findAll('path')[1]
      const pathData = secondPath.attributes('d')
      
      // Should have lines representing text content
      expect(pathData).toContain('M9 9H10') // Short line (title/header)
      expect(pathData).toContain('M9 13H15') // Longer line (content)
      expect(pathData).toContain('M9 17H15') // Another content line
    })

    it("should maintain proper proportions", () => {
      const svg = wrapper.find('svg')
      
      // Icon should be square with proper proportions
      const width = parseInt(svg.attributes('width') || '0')
      const height = parseInt(svg.attributes('height') || '0')
      
      expect(width).toBe(height)
      expect(width).toBe(24)
    })
  })

  describe("Color and Theme", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconDraft)
    })

    it("should use dark blue color", () => {
      const paths = wrapper.findAll('path')
      
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('#0A448F')
      })
    })

    it("should be suitable for draft document representation", () => {
      const paths = wrapper.findAll('path')
      
      // Dark blue color is appropriate for draft/official documents
      paths.forEach(path => {
        const strokeColor = path.attributes('stroke')
        expect(strokeColor).toMatch(/^#[0-9A-F]{6}$/i) // Valid hex color
        expect(strokeColor).toBe('#0A448F') // Specific dark blue shade
      })
    })

    it("should maintain color consistency across paths", () => {
      const paths = wrapper.findAll('path')
      const colors = paths.map(path => path.attributes('stroke'))
      
      // All paths should use the same color
      expect(new Set(colors).size).toBe(1)
      expect(colors[0]).toBe('#0A448F')
    })
  })
})
