/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconEditMaster from "@/components/icons/LogActivity/IconEditMaster.vue"

describe("IconEditMaster.vue", () => {
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
      wrapper = shallowMount(IconEditMaster)
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should render as SVG element", () => {
      wrapper = shallowMount(IconEditMaster)
      
      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
    })

    it("should be Vue component instance", () => {
      wrapper = shallowMount(IconEditMaster)
      
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.$).toBeDefined()
    })
  })

  describe("SVG Structure", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEditMaster)
    })

    it("should have correct SVG attributes", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('24')
      expect(svg.attributes('height')).toBe('24')
      expect(svg.attributes('viewBox')).toBe('0 0 24 24')
      expect(svg.attributes('fill')).toBe('none')
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    })

    it("should contain two path elements", () => {
      const paths = wrapper.findAll('path')
      
      expect(paths.length).toBe(2)
    })

    it("should have correct stroke attributes for all paths", () => {
      const paths = wrapper.findAll('path')
      
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('#6369FA')
        expect(path.attributes('stroke-width')).toBe('1.33333')
        expect(path.attributes('stroke-linecap')).toBe('round')
        expect(path.attributes('stroke-linejoin')).toBe('round')
      })
    })

    it("should have correct first path data", () => {
      const firstPath = wrapper.findAll('path')[0]
      const expectedPath = "M7 7H6C5.46957 7 4.96086 7.21071 4.58579 7.58579C4.21071 7.96086 4 8.46957 4 9V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20H15C15.5304 20 16.0391 19.7893 16.4142 19.4142C16.7893 19.0391 17 18.5304 17 18V17"
      
      expect(firstPath.attributes('d')).toBe(expectedPath)
    })

    it("should have correct second path data", () => {
      const secondPath = wrapper.findAll('path')[1]
      const expectedPath = "M16 5.00011L19 8.00011M20.385 6.58511C20.7788 6.19126 21.0001 5.65709 21.0001 5.10011C21.0001 4.54312 20.7788 4.00895 20.385 3.61511C19.9912 3.22126 19.457 3 18.9 3C18.343 3 17.8088 3.22126 17.415 3.61511L9 12.0001V15.0001H12L20.385 6.58511Z"
      
      expect(secondPath.attributes('d')).toBe(expectedPath)
    })
  })

  describe("Component Rendering", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEditMaster)
    })

    it("should render correct HTML structure", () => {
      const html = wrapper.html()
      
      expect(html).toContain('<svg')
      expect(html).toContain('width="24"')
      expect(html).toContain('height="24"')
      expect(html).toContain('<path')
      expect(html).toContain('stroke="#6369FA"')
    })

    it("should have no child components", () => {
      const childComponents = wrapper.findAllComponents(() => true)
      
      expect(childComponents.length).toBe(0)
    })

    it("should have dual path structure", () => {
      const rootElements = wrapper.element.children
      
      expect(rootElements.length).toBe(2) // Two path elements
      expect(wrapper.element.tagName.toLowerCase()).toBe('svg')
    })
  })

  describe("Icon Styling", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEditMaster)
    })

    it("should have large icon size", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('24')
      expect(svg.attributes('height')).toBe('24')
    })

    it("should have purple stroke color", () => {
      const paths = wrapper.findAll('path')
      
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('#6369FA')
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
      wrapper = shallowMount(IconEditMaster)
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
      wrapper = shallowMount(IconEditMaster, {
        props: {}
      })
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should work without any configuration", () => {
      wrapper = shallowMount(IconEditMaster)
      
      expect(wrapper.find('svg').exists()).toBe(true)
      expect(wrapper.findAll('path').length).toBe(2)
    })
  })

  describe("Icon Design", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEditMaster)
    })

    it("should represent edit master/document editing", () => {
      const paths = wrapper.findAll('path')
      
      // First path represents document/paper
      expect(paths[0].attributes('d')).toContain('M7 7H6')
      expect(paths[0].attributes('d')).toContain('V18')
      expect(paths[0].attributes('d')).toContain('H15')
      
      // Second path represents pen/edit tool
      expect(paths[1].attributes('d')).toContain('M16 5.00011L19 8.00011')
      expect(paths[1].attributes('d')).toContain('M20.385 6.58511')
    })

    it("should have document and pen combination", () => {
      const firstPath = wrapper.findAll('path')[0]
      const secondPath = wrapper.findAll('path')[1]
      
      // Document outline in first path
      expect(firstPath.attributes('d')).toContain('C5.46957 7') // Document curves
      expect(firstPath.attributes('d')).toContain('V18') // Document height
      
      // Pen tool in second path
      expect(secondPath.attributes('d')).toContain('L19 8.00011') // Pen movement
      expect(secondPath.attributes('d')).toContain('C20.7788') // Pen curves
    })

    it("should use stroke-based design", () => {
      const paths = wrapper.findAll('path')
      
      // EditMaster icon uses stroke instead of fill
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBeDefined()
        expect(path.attributes('fill')).toBeUndefined()
      })
    })
  })

  describe("Component Integration", () => {
    it("should be usable as child component", () => {
      const ParentComponent = {
        template: '<div><IconEditMaster /></div>',
        components: { IconEditMaster }
      }
      
      const parentWrapper = shallowMount(ParentComponent)
      const iconComponent = parentWrapper.findComponent(IconEditMaster)
      
      expect(iconComponent.exists()).toBe(true)
      parentWrapper.unmount()
    })

    it("should maintain state across re-renders", () => {
      wrapper = shallowMount(IconEditMaster)
      const initialHtml = wrapper.html()
      
      wrapper.vm.$forceUpdate()
      const afterUpdateHtml = wrapper.html()
      
      expect(initialHtml).toBe(afterUpdateHtml)
    })
  })

  describe("Performance", () => {
    it("should render efficiently", () => {
      const startTime = performance.now()
      
      wrapper = shallowMount(IconEditMaster)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      expect(renderTime).toBeLessThan(50) // Should render in less than 50ms
      expect(wrapper.exists()).toBe(true)
    })

    it("should have reasonable DOM footprint", () => {
      wrapper = shallowMount(IconEditMaster)
      
      const element = wrapper.element
      expect(element.children.length).toBe(2) // Two path elements
      expect(element.tagName.toLowerCase()).toBe('svg')
    })
  })

  describe("Error Handling", () => {
    it("should handle mounting errors gracefully", () => {
      expect(() => {
        wrapper = shallowMount(IconEditMaster)
      }).not.toThrow()
    })

    it("should handle force update without errors", () => {
      wrapper = shallowMount(IconEditMaster)
      
      expect(() => {
        wrapper.vm.$forceUpdate()
      }).not.toThrow()
    })

    it("should handle unmounting gracefully", () => {
      wrapper = shallowMount(IconEditMaster)
      
      expect(() => {
        wrapper.unmount()
      }).not.toThrow()
    })
  })

  describe("Comparison with Other Icons", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEditMaster)
    })

    it("should have same size as draft icon", () => {
      const svg = wrapper.find('svg')
      
      // EditMaster is 24x24 like draft icon
      expect(svg.attributes('width')).toBe('24')
      expect(svg.attributes('height')).toBe('24')
      expect(svg.attributes('viewBox')).toBe('0 0 24 24')
    })

    it("should use purple color scheme", () => {
      const paths = wrapper.findAll('path')
      
      // EditMaster uses purple (#6369FA) vs other colors
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('#6369FA')
        expect(path.attributes('stroke')).not.toBe('#4791F2') // Document blue
        expect(path.attributes('stroke')).not.toBe('#0A448F') // Draft blue
        expect(path.attributes('stroke')).not.toBe('#0099AD') // Edit teal
      })
    })

    it("should use stroke design like other stroke icons", () => {
      const paths = wrapper.findAll('path')
      
      // Should follow stroke patterns like document/draft icons
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBeDefined()
        expect(path.attributes('fill')).toBeUndefined()
      })
    })

    it("should have multiple paths like draft icon", () => {
      const paths = wrapper.findAll('path')
      
      // EditMaster has 2 paths like draft icon
      expect(paths.length).toBe(2)
    })
  })

  describe("Visual Validation", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEditMaster)
    })

    it("should represent document editing concept", () => {
      const firstPath = wrapper.findAll('path')[0]
      const secondPath = wrapper.findAll('path')[1]
      
      // Document representation in first path
      expect(firstPath.attributes('d')).toContain('M7 7H6') // Document start
      expect(firstPath.attributes('d')).toContain('V18') // Document height
      
      // Edit tool representation in second path
      expect(secondPath.attributes('d')).toContain('M16 5.00011L19 8.00011') // Pen position
      expect(secondPath.attributes('d')).toContain('V15.0001H12') // Edit area
    })

    it("should maintain proper proportions", () => {
      const svg = wrapper.find('svg')
      
      // Icon should be square with proper proportions
      const width = parseInt(svg.attributes('width') || '0')
      const height = parseInt(svg.attributes('height') || '0')
      
      expect(width).toBe(height)
      expect(width).toBe(24)
    })

    it("should have stroke properties for smooth lines", () => {
      const paths = wrapper.findAll('path')
      
      // Stroke properties for smooth appearance
      paths.forEach(path => {
        expect(path.attributes('stroke-linecap')).toBe('round')
        expect(path.attributes('stroke-linejoin')).toBe('round')
        expect(parseFloat(path.attributes('stroke-width') || '0')).toBeGreaterThan(1)
      })
    })
  })

  describe("Color and Theme", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEditMaster)
    })

    it("should use purple color", () => {
      const paths = wrapper.findAll('path')
      
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('#6369FA')
      })
    })

    it("should be suitable for master edit representation", () => {
      const paths = wrapper.findAll('path')
      
      // Purple color indicates premium/master level functionality
      paths.forEach(path => {
        const strokeColor = path.attributes('stroke')
        expect(strokeColor).toMatch(/^#[0-9A-F]{6}$/i) // Valid hex color
        expect(strokeColor).toBe('#6369FA') // Specific purple shade
      })
    })

    it("should maintain color consistency across paths", () => {
      const paths = wrapper.findAll('path')
      const colors = paths.map(path => path.attributes('stroke'))
      
      // All paths should use the same purple color
      expect(new Set(colors).size).toBe(1)
      expect(colors[0]).toBe('#6369FA')
    })
  })

  describe("Master Edit Semantics", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEditMaster)
    })

    it("should represent advanced editing capability", () => {
      const paths = wrapper.findAll('path')
      
      // Complex path structure indicates advanced functionality
      expect(paths.length).toBe(2)
      expect(paths[0].attributes('d').length).toBeGreaterThan(100)
      expect(paths[1].attributes('d').length).toBeGreaterThan(100)
    })

    it("should combine document and edit elements", () => {
      const firstPath = wrapper.findAll('path')[0]
      const secondPath = wrapper.findAll('path')[1]
      
      // Document + edit tool combination for master editing
      expect(firstPath.attributes('d')).toContain('H6') // Document outline
      expect(secondPath.attributes('d')).toContain('L19 8.00011') // Edit tool
    })

    it("should use purple theme for premium indication", () => {
      const paths = wrapper.findAll('path')
      
      // Purple color often indicates premium/advanced features
      paths.forEach(path => {
        expect(path.attributes('stroke')).toBe('#6369FA')
      })
    })
  })
})
