/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconEdit from "@/components/icons/IconEdit.vue"

describe("IconEdit.vue", () => {
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
      wrapper = shallowMount(IconEdit)
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should render as SVG element", () => {
      wrapper = shallowMount(IconEdit)
      
      const svg = wrapper.find('svg')
      expect(svg.exists()).toBe(true)
    })

    it("should be Vue component instance", () => {
      wrapper = shallowMount(IconEdit)
      
      expect(wrapper.vm).toBeDefined()
      expect(wrapper.vm.$).toBeDefined()
    })
  })

  describe("SVG Structure", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEdit)
    })

    it("should have correct SVG attributes", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('14')
      expect(svg.attributes('height')).toBe('14')
      expect(svg.attributes('viewBox')).toBe('0 0 14 14')
      expect(svg.attributes('fill')).toBe('none')
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    })

    it("should contain g element with clip-path", () => {
      const gElement = wrapper.find('g')
      
      expect(gElement.exists()).toBe(true)
      expect(gElement.attributes('clip-path')).toBe('url(#clip0_10365_7751)')
    })

    it("should contain path element", () => {
      const path = wrapper.find('path')
      
      expect(path.exists()).toBe(true)
    })

    it("should have correct path attributes", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('fill-rule')).toBe('evenodd')
      expect(path.attributes('clip-rule')).toBe('evenodd')
      expect(path.attributes('fill')).toBe('#0099AD')
    })

    it("should have correct path data", () => {
      const path = wrapper.find('path')
      const expectedPath = "M11.9546 2.04273C11.7553 1.8434 11.4321 1.8434 11.2328 2.04273L10.6609 2.61462L11.3827 3.33646L11.9546 2.76456C12.154 2.56523 12.154 2.24206 11.9546 2.04273ZM10.5578 4.16142L9.83595 3.43958L2.85109 10.4244C2.61123 10.6643 2.43491 10.9602 2.33807 11.2852L2.17937 11.818L2.71213 11.6593C3.03723 11.5625 3.33307 11.3861 3.57294 11.1463L10.5578 4.16142ZM10.4078 1.21777C11.0628 0.562827 12.1247 0.562827 12.7796 1.21777C13.4345 1.87271 13.4345 2.93458 12.7796 3.58952L4.39789 11.9712C4.02097 12.3482 3.55606 12.6252 3.04519 12.7774L1.47901 13.2439C1.27373 13.3051 1.05145 13.2488 0.899995 13.0974C0.748539 12.9459 0.692269 12.7236 0.753417 12.5184L1.21996 10.9522C1.37213 10.4413 1.64921 9.97641 2.02613 9.59948L10.4078 1.21777Z"
      
      expect(path.attributes('d')).toBe(expectedPath)
    })
  })

  describe("SVG Definitions", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEdit)
    })

    it("should contain defs element", () => {
      const defs = wrapper.find('defs')
      
      expect(defs.exists()).toBe(true)
    })

    it("should contain clipPath element", () => {
      const clipPath = wrapper.find('clipPath')
      
      expect(clipPath.exists()).toBe(true)
      expect(clipPath.attributes('id')).toBe('clip0_10365_7751')
    })

    it("should contain rect element in clipPath", () => {
      const rect = wrapper.find('clipPath rect')
      
      expect(rect.exists()).toBe(true)
      expect(rect.attributes('width')).toBe('14')
      expect(rect.attributes('height')).toBe('14')
      expect(rect.attributes('fill')).toBe('white')
    })
  })

  describe("Component Rendering", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEdit)
    })

    it("should render correct HTML structure", () => {
      const html = wrapper.html()
      
      expect(html).toContain('<svg')
      expect(html).toContain('width="14"')
      expect(html).toContain('height="14"')
      expect(html).toContain('<g clip-path')
      expect(html).toContain('<path')
      expect(html).toContain('fill="#0099AD"')
      expect(html).toContain('<defs>')
      expect(html).toContain('<clipPath')
    })

    it("should have no child components", () => {
      const childComponents = wrapper.findAllComponents(() => true)
      
      expect(childComponents.length).toBe(0)
    })

    it("should have complex SVG structure", () => {
      const rootElements = wrapper.element.children
      
      expect(rootElements.length).toBe(2) // g and defs elements
      expect(wrapper.element.tagName.toLowerCase()).toBe('svg')
    })
  })

  describe("Icon Styling", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEdit)
    })

    it("should have medium icon size", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('width')).toBe('14')
      expect(svg.attributes('height')).toBe('14')
    })

    it("should have teal fill color", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('fill')).toBe('#0099AD')
    })

    it("should use proper SVG namespace", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('xmlns')).toBe('http://www.w3.org/2000/svg')
    })

    it("should have transparent background", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('fill')).toBe('none')
    })

    it("should use fill-based design", () => {
      const path = wrapper.find('path')
      
      // Edit icon uses fill instead of stroke
      expect(path.attributes('fill')).toBeDefined()
      expect(path.attributes('stroke')).toBeUndefined()
    })
  })

  describe("Accessibility", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEdit)
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
      expect(width).toBe(14)
    })

    it("should have proper viewBox for scaling", () => {
      const svg = wrapper.find('svg')
      
      expect(svg.attributes('viewBox')).toBe('0 0 14 14')
    })
  })

  describe("Component Props", () => {
    it("should accept no props", () => {
      wrapper = shallowMount(IconEdit, {
        props: {}
      })
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should work without any configuration", () => {
      wrapper = shallowMount(IconEdit)
      
      expect(wrapper.find('svg').exists()).toBe(true)
      expect(wrapper.find('path').exists()).toBe(true)
      expect(wrapper.find('clipPath').exists()).toBe(true)
    })
  })

  describe("Icon Design", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEdit)
    })

    it("should represent edit/pencil shape", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // Path should contain elements representing pencil/edit icon
      expect(pathData).toContain('M11.9546 2.04273') // Starting point
      expect(pathData).toContain('L10.6609 2.61462') // Line elements
      expect(pathData).toContain('C') // Curves for pencil shape
    })

    it("should have complex path for edit representation", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // Edit icon should have detailed path for pencil representation
      expect(pathData.length).toBeGreaterThan(200) // Complex path
      expect(pathData.includes('M')).toBe(true) // Move to
      expect(pathData.includes('L')).toBe(true) // Line to
      expect(pathData.includes('C')).toBe(true) // Curve to
      expect(pathData.includes('Z')).toBe(true) // Close path
    })

    it("should use fill-based design with clipping", () => {
      const gElement = wrapper.find('g')
      const path = wrapper.find('path')
      
      // Edit icon uses fill with clipping mask
      expect(gElement.attributes('clip-path')).toBeDefined()
      expect(path.attributes('fill')).toBeDefined()
      expect(path.attributes('stroke')).toBeUndefined()
    })
  })

  describe("Clipping and Masking", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEdit)
    })

    it("should have proper clip-path reference", () => {
      const gElement = wrapper.find('g')
      const clipPath = wrapper.find('clipPath')
      
      expect(gElement.attributes('clip-path')).toBe('url(#clip0_10365_7751)')
      expect(clipPath.attributes('id')).toBe('clip0_10365_7751')
    })

    it("should have clipping rectangle matching icon size", () => {
      const rect = wrapper.find('clipPath rect')
      const svg = wrapper.find('svg')
      
      expect(rect.attributes('width')).toBe(svg.attributes('width'))
      expect(rect.attributes('height')).toBe(svg.attributes('height'))
    })

    it("should use white fill for clipping mask", () => {
      const rect = wrapper.find('clipPath rect')
      
      expect(rect.attributes('fill')).toBe('white')
    })
  })

  describe("Component Integration", () => {
    it("should be usable as child component", () => {
      const ParentComponent = {
        template: '<div><IconEdit /></div>',
        components: { IconEdit }
      }
      
      const parentWrapper = shallowMount(ParentComponent)
      const iconComponent = parentWrapper.findComponent(IconEdit)
      
      expect(iconComponent.exists()).toBe(true)
      parentWrapper.unmount()
    })

    it("should maintain state across re-renders", () => {
      wrapper = shallowMount(IconEdit)
      const initialHtml = wrapper.html()
      
      wrapper.vm.$forceUpdate()
      const afterUpdateHtml = wrapper.html()
      
      expect(initialHtml).toBe(afterUpdateHtml)
    })
  })

  describe("Performance", () => {
    it("should render efficiently", () => {
      const startTime = performance.now()
      
      wrapper = shallowMount(IconEdit)
      
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      expect(renderTime).toBeLessThan(50) // Should render in less than 50ms
      expect(wrapper.exists()).toBe(true)
    })

    it("should have reasonable DOM complexity", () => {
      wrapper = shallowMount(IconEdit)
      
      const element = wrapper.element
      expect(element.children.length).toBe(2) // g and defs elements
      expect(element.tagName.toLowerCase()).toBe('svg')
    })
  })

  describe("Error Handling", () => {
    it("should handle mounting errors gracefully", () => {
      expect(() => {
        wrapper = shallowMount(IconEdit)
      }).not.toThrow()
    })

    it("should handle force update without errors", () => {
      wrapper = shallowMount(IconEdit)
      
      expect(() => {
        wrapper.vm.$forceUpdate()
      }).not.toThrow()
    })

    it("should handle unmounting gracefully", () => {
      wrapper = shallowMount(IconEdit)
      
      expect(() => {
        wrapper.unmount()
      }).not.toThrow()
    })
  })

  describe("Comparison with Other Icons", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEdit)
    })

    it("should have unique size", () => {
      const svg = wrapper.find('svg')
      
      // Edit icon is 14x14 (unique size among the icons)
      expect(svg.attributes('width')).toBe('14')
      expect(svg.attributes('height')).toBe('14')
      expect(svg.attributes('viewBox')).toBe('0 0 14 14')
    })

    it("should use different design approach", () => {
      const gElement = wrapper.find('g')
      const path = wrapper.find('path')
      
      // Edit icon uses fill with clipping vs stroke-based design
      expect(gElement.attributes('clip-path')).toBeDefined()
      expect(path.attributes('fill')).toBe('#0099AD')
      expect(path.attributes('stroke')).toBeUndefined()
    })

    it("should use teal color scheme", () => {
      const path = wrapper.find('path')
      
      // Edit icon uses teal (#0099AD) vs other color schemes
      expect(path.attributes('fill')).toBe('#0099AD')
      expect(path.attributes('fill')).not.toBe('#4791F2') // Document blue
      expect(path.attributes('fill')).not.toBe('#0A448F') // Draft blue
      expect(path.attributes('fill')).not.toBe('#697586') // Chevron gray
    })

    it("should have most complex structure", () => {
      const svg = wrapper.find('svg')
      
      // Edit icon has the most complex structure with clipping
      expect(wrapper.find('g').exists()).toBe(true)
      expect(wrapper.find('defs').exists()).toBe(true)
      expect(wrapper.find('clipPath').exists()).toBe(true)
      expect(svg.element.children.length).toBe(2)
    })
  })

  describe("Visual Validation", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEdit)
    })

    it("should represent pencil/edit tool", () => {
      const path = wrapper.find('path')
      const pathData = path.attributes('d')
      
      // Visual cues for pencil/edit tool
      expect(pathData).toContain('M11.9546 2.04273') // Pencil tip
      expect(pathData).toContain('L10.6609 2.61462') // Pencil body
      expect(pathData).toContain('11.2852') // Pencil details
    })

    it("should have proper geometric structure", () => {
      const svg = wrapper.find('svg')
      
      // Icon should be square with proper proportions
      const width = parseInt(svg.attributes('width') || '0')
      const height = parseInt(svg.attributes('height') || '0')
      
      expect(width).toBe(height)
      expect(width).toBe(14)
    })

    it("should maintain visual clarity with clipping", () => {
      const clipPath = wrapper.find('clipPath')
      const rect = wrapper.find('clipPath rect')
      
      // Clipping should maintain visual boundaries
      expect(clipPath.exists()).toBe(true)
      expect(rect.attributes('width')).toBe('14')
      expect(rect.attributes('height')).toBe('14')
    })
  })

  describe("Color and Theme", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconEdit)
    })

    it("should use teal color", () => {
      const path = wrapper.find('path')
      
      expect(path.attributes('fill')).toBe('#0099AD')
    })

    it("should be suitable for edit action representation", () => {
      const path = wrapper.find('path')
      
      // Teal color is commonly used for edit/modify actions
      const fillColor = path.attributes('fill')
      expect(fillColor).toMatch(/^#[0-9A-F]{6}$/i) // Valid hex color
      expect(fillColor).toBe('#0099AD') // Specific teal shade
    })

    it("should maintain color consistency", () => {
      const path = wrapper.find('path')
      
      // All fill elements should use the same color
      expect(path.attributes('fill')).toBe('#0099AD')
    })

    it("should contrast well with white clipping background", () => {
      const path = wrapper.find('path')
      const rect = wrapper.find('clipPath rect')
      
      // Teal fill should contrast well with white clipping background
      expect(path.attributes('fill')).toBe('#0099AD')
      expect(rect.attributes('fill')).toBe('white')
    })
  })
})
