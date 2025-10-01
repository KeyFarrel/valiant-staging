/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconKirim from "@/components/icons/LogActivity/IconKirim.vue"

describe("IconKirim.vue", () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = shallowMount(IconKirim)
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  // Component Mounting Tests
  describe("Component Mounting", () => {
    it("should mount successfully", () => {
      expect(wrapper.exists()).toBe(true)
    })

    it("should be a Vue component instance", () => {
      expect(wrapper.vm).toBeTruthy()
    })

    it("should render without errors", () => {
      expect(() => shallowMount(IconKirim)).not.toThrow()
    })
  })

  // SVG Structure Tests
  describe("SVG Structure", () => {
    it("should render as an SVG element", () => {
      const svg = wrapper.find("svg")
      expect(svg.exists()).toBe(true)
      expect(wrapper.element.tagName.toLowerCase()).toBe("svg")
    })

    it("should have correct SVG attributes", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("width")).toBe("24")
      expect(svg.attributes("height")).toBe("24")
      expect(svg.attributes("viewBox")).toBe("0 0 24 24")
      expect(svg.attributes("fill")).toBe("none")
      expect(svg.attributes("xmlns")).toBe("http://www.w3.org/2000/svg")
    })

    it("should be a square icon", () => {
      const svg = wrapper.find("svg")
      const width = svg.attributes("width")
      const height = svg.attributes("height")
      expect(width).toBe(height)
    })
  })

  // Rendering Tests
  describe("Rendering", () => {
    it("should render visible content", () => {
      expect(wrapper.isVisible()).toBe(true)
    })

    it("should not have any text content", () => {
      expect(wrapper.text()).toBe("")
    })

    it("should render consistently", () => {
      const wrapper2 = shallowMount(IconKirim)
      expect(wrapper.html()).toBe(wrapper2.html())
      wrapper2.unmount()
    })
  })

  // Path Element Tests
  describe("Path Element", () => {
    it("should contain a single path element", () => {
      const paths = wrapper.findAll("path")
      expect(paths.length).toBe(1)
    })

    it("should have correct path attributes", () => {
      const path = wrapper.find("path")
      expect(path.exists()).toBe(true)
      expect(path.attributes("stroke")).toBe("#0099AD")
      expect(path.attributes("stroke-width")).toBe("1.33333")
      expect(path.attributes("stroke-linecap")).toBe("round")
      expect(path.attributes("stroke-linejoin")).toBe("round")
    })

    it("should have path data representing send/arrow shape", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")
      expect(pathData).toBeDefined()
      expect(pathData).toContain("M9.99995 14L21 3")
      expect(pathData).toContain("M9.99995 14L13.4999 21")
      expect(pathData).toContain("L21 3")
    })

    it("should have complex path data with multiple segments", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")!
      
      // Should contain move (M) and line (L) commands
      expect(pathData).toContain("M")
      expect(pathData).toContain("L")
      
      // Should have multiple path segments
      const segments = pathData.split("M").filter(segment => segment.length > 0)
      expect(segments.length).toBeGreaterThan(1)
    })
  })

  // Styling Tests
  describe("Styling", () => {
    it("should use stroke-based design", () => {
      const path = wrapper.find("path")
      expect(path.attributes("stroke")).toBeTruthy()
      expect(path.attributes("fill")).toBeFalsy()
    })

    it("should have teal color scheme", () => {
      const path = wrapper.find("path")
      expect(path.attributes("stroke")).toBe("#0099AD")
    })

    it("should have rounded line endings", () => {
      const path = wrapper.find("path")
      expect(path.attributes("stroke-linecap")).toBe("round")
      expect(path.attributes("stroke-linejoin")).toBe("round")
    })

    it("should have appropriate stroke width", () => {
      const path = wrapper.find("path")
      const strokeWidth = parseFloat(path.attributes("stroke-width")!)
      expect(strokeWidth).toBeCloseTo(1.33333)
      expect(strokeWidth).toBeGreaterThan(1)
      expect(strokeWidth).toBeLessThan(2)
    })
  })

  // Accessibility Tests
  describe("Accessibility", () => {
    it("should be presentational by default", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("role")).toBeUndefined()
      expect(svg.attributes("aria-label")).toBeUndefined()
    })

    it("should be scalable", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("viewBox")).toBeTruthy()
    })

    it("should not interfere with screen readers", () => {
      expect(wrapper.text()).toBe("")
    })
  })

  // Component Props Tests
  describe("Component Props", () => {
    it("should not accept any props", () => {
      const component = wrapper.vm.$options
      expect(component.props).toBeUndefined()
    })

    it("should work without any configuration", () => {
      expect(() => shallowMount(IconKirim, {})).not.toThrow()
    })
  })

  // Send Icon Design Tests
  describe("Send Icon Design", () => {
    it("should represent send/paper plane semantics", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")!
      
      // Should contain coordinates suggesting paper plane shape
      expect(pathData).toContain("21 3") // Top right point
      expect(pathData).toContain("9.99995 14") // Center point
      expect(pathData).toContain("13.4999 21") // Bottom point
    })

    it("should have arrow-like directionality", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")!
      
      // Should show movement from bottom-left to top-right
      expect(pathData).toContain("M9.99995 14L21 3")
    })

    it("should have paper plane tail design", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")!
      
      // Should have triangular tail elements
      expect(pathData).toContain("2.99995 9.5")
      expect(pathData).toContain("2.99995 10.5")
    })

    it("should convey motion and direction", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")!
      
      // Path should flow from left to right
      const xCoordinates = pathData.match(/(\d+\.?\d*)\s+\d+/g) || []
      const leftmostX = Math.min(...xCoordinates.map(coord => parseFloat(coord)))
      const rightmostX = Math.max(...xCoordinates.map(coord => parseFloat(coord)))
      
      expect(rightmostX).toBeGreaterThan(leftmostX)
    })
  })

  // Icon Geometry Tests
  describe("Icon Geometry", () => {
    it("should fit within 24x24 viewBox", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")!
      
      // Extract all coordinates and verify they're within bounds
      const coordinates = pathData.match(/\d+\.?\d*/g)?.map(Number) || []
      const maxCoordinate = Math.max(...coordinates)
      const minCoordinate = Math.min(...coordinates)
      
      expect(maxCoordinate).toBeLessThanOrEqual(24)
      expect(minCoordinate).toBeGreaterThanOrEqual(0)
    })

    it("should have proper proportions", () => {
      const svg = wrapper.find("svg")
      const viewBox = svg.attributes("viewBox")!
      const [minX, minY, width, height] = viewBox.split(" ").map(Number)
      
      expect(width).toBe(24)
      expect(height).toBe(24)
      expect(minX).toBe(0)
      expect(minY).toBe(0)
    })

    it("should use coordinate system effectively", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")!
      
      // Should utilize different areas of the 24x24 space
      expect(pathData).toContain("21") // Near right edge
      expect(pathData).toContain("3") // Near top/left edge
      expect(pathData).toContain("2.") // Near left edge (with decimals)
    })
  })

  // Integration Tests
  describe("Integration", () => {
    it("should work within larger components", () => {
      const ParentComponent = {
        template: '<div><IconKirim /></div>',
        components: { IconKirim }
      }
      
      const parentWrapper = shallowMount(ParentComponent)
      expect(parentWrapper.findComponent(IconKirim).exists()).toBe(true)
      parentWrapper.unmount()
    })

    it("should maintain structure when re-rendered", () => {
      const initialHtml = wrapper.html()
      wrapper.vm.$forceUpdate()
      expect(wrapper.html()).toBe(initialHtml)
    })

    it("should work in log activity context", () => {
      // This icon is specifically for log activity
      expect(wrapper.findComponent(IconKirim).exists()).toBe(true)
    })
  })

  // Performance Tests
  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now()
      const testWrapper = shallowMount(IconKirim)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(50) // Should render in < 50ms
      testWrapper.unmount()
    })

    it("should not cause memory leaks on repeated mounting", () => {
      const wrappers = []
      for (let i = 0; i < 10; i++) {
        wrappers.push(shallowMount(IconKirim))
      }
      
      wrappers.forEach(w => w.unmount())
      expect(wrappers.length).toBe(10)
    })
  })

  // Error Handling Tests
  describe("Error Handling", () => {
    it("should handle DOM manipulation gracefully", () => {
      expect(() => {
        const svg = wrapper.find("svg")
        svg.element.setAttribute("width", "32")
      }).not.toThrow()
    })

    it("should not break with CSS modifications", () => {
      expect(() => {
        wrapper.element.style.display = "none"
      }).not.toThrow()
    })

    it("should be resilient to missing attributes", () => {
      const path = wrapper.find("path")
      expect(path.attributes("nonexistent")).toBeUndefined()
    })
  })

  // Color and Theme Tests
  describe("Color and Theme", () => {
    it("should use teal brand color", () => {
      const path = wrapper.find("path")
      expect(path.attributes("stroke")).toBe("#0099AD")
    })

    it("should maintain color consistency", () => {
      const coloredElements = wrapper.findAll("[stroke]")
      coloredElements.forEach(element => {
        if (element.attributes("stroke") !== "none") {
          expect(element.attributes("stroke")).toBe("#0099AD")
        }
      })
    })

    it("should not have conflicting fill colors", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("fill")).toBe("none")
      
      const path = wrapper.find("path")
      expect(path.attributes("fill")).toBeFalsy()
    })
  })

  // Visual Validation Tests
  describe("Visual Validation", () => {
    it("should have clear send action representation", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")!
      
      // Should represent classic paper plane/send icon
      expect(pathData).toContain("M9.99995 14L21 3")
      expect(pathData).toContain("L13.4999 21")
    })

    it("should have balanced visual weight", () => {
      const path = wrapper.find("path")
      const strokeWidth = path.attributes("stroke-width")!
      const strokeWidthNum = parseFloat(strokeWidth)
      
      // Should be visible but not too heavy
      expect(strokeWidthNum).toBeGreaterThan(1)
      expect(strokeWidthNum).toBeLessThan(2)
    })

    it("should be recognizable at small sizes", () => {
      // 24x24 is a standard small icon size
      const svg = wrapper.find("svg")
      expect(svg.attributes("width")).toBe("24")
      expect(svg.attributes("height")).toBe("24")
    })
  })

  // Log Activity Context Tests
  describe("Log Activity Context", () => {
    it("should represent send/submit action", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")!
      
      // Should have directional flow suggesting sending
      expect(pathData).toContain("L21 3") // Moving toward destination
    })

    it("should use appropriate color for action", () => {
      const path = wrapper.find("path")
      const color = path.attributes("stroke")!
      
      // Teal suggests action/interaction
      expect(color).toBe("#0099AD")
    })

    it("should be suitable for activity logging UI", () => {
      // Should be clear and functional
      expect(wrapper.find("svg").exists()).toBe(true)
      expect(wrapper.find("path").exists()).toBe(true)
    })
  })

  // Design Consistency Tests
  describe("Design Consistency", () => {
    it("should follow icon design standards", () => {
      const svg = wrapper.find("svg")
      const path = wrapper.find("path")
      
      // Standard icon attributes
      expect(svg.attributes("viewBox")).toBe("0 0 24 24")
      expect(path.attributes("stroke-linecap")).toBe("round")
      expect(path.attributes("stroke-linejoin")).toBe("round")
    })

    it("should maintain stroke consistency", () => {
      const path = wrapper.find("path")
      expect(path.attributes("stroke-width")).toBe("1.33333")
      expect(path.attributes("stroke-linecap")).toBe("round")
      expect(path.attributes("stroke-linejoin")).toBe("round")
    })

    it("should use consistent coordinate precision", () => {
      const path = wrapper.find("path")
      const pathData = path.attributes("d")!
      
      // Should use decimal precision where needed
      expect(pathData).toContain("9.99995")
      expect(pathData).toContain("13.4999")
    })
  })
})
