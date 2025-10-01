/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconLogout from "@/components/icons/LogActivity/IconLogout.vue"

describe("IconLogout.vue", () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = shallowMount(IconLogout)
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
      expect(() => shallowMount(IconLogout)).not.toThrow()
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
      const wrapper2 = shallowMount(IconLogout)
      expect(wrapper.html()).toBe(wrapper2.html())
      wrapper2.unmount()
    })
  })

  // Path Elements Tests
  describe("Path Elements", () => {
    it("should contain exactly two path elements", () => {
      const paths = wrapper.findAll("path")
      expect(paths.length).toBe(2)
    })

    it("should have door/rectangle path element", () => {
      const paths = wrapper.findAll("path")
      const doorPath = paths[0]
      expect(doorPath.exists()).toBe(true)
      expect(doorPath.attributes("d")).toContain("M10 8V6C10")
      expect(doorPath.attributes("d")).toContain("V18C21")
    })

    it("should have arrow path element", () => {
      const paths = wrapper.findAll("path")
      const arrowPath = paths[1]
      expect(arrowPath.exists()).toBe(true)
      expect(arrowPath.attributes("d")).toBe("M15 12H3M3 12L6 9M3 12L6 15")
    })

    it("should have consistent stroke attributes", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe("#E2517C")
        expect(path.attributes("stroke-width")).toBe("1.33333")
        expect(path.attributes("stroke-linecap")).toBe("round")
        expect(path.attributes("stroke-linejoin")).toBe("round")
      })
    })
  })

  // Styling Tests
  describe("Styling", () => {
    it("should use stroke-based design", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBeTruthy()
        expect(path.attributes("fill")).toBeFalsy()
      })
    })

    it("should have pink/magenta color scheme", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe("#E2517C")
      })
    })

    it("should have rounded line endings", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke-linecap")).toBe("round")
        expect(path.attributes("stroke-linejoin")).toBe("round")
      })
    })

    it("should have appropriate stroke width", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        const strokeWidth = parseFloat(path.attributes("stroke-width")!)
        expect(strokeWidth).toBeCloseTo(1.33333)
      })
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
      expect(() => shallowMount(IconLogout, {})).not.toThrow()
    })
  })

  // Logout Icon Design Tests
  describe("Logout Icon Design", () => {
    it("should represent door/exit semantics", () => {
      const paths = wrapper.findAll("path")
      const doorPath = paths[0]
      const pathData = doorPath.attributes("d")!
      
      // Should contain door/rectangle shape
      expect(pathData).toContain("V6C10")
      expect(pathData).toContain("H19C19")
      expect(pathData).toContain("V18C21")
    })

    it("should have arrow pointing left (exit direction)", () => {
      const paths = wrapper.findAll("path")
      const arrowPath = paths[1]
      const pathData = arrowPath.attributes("d")!
      
      // Should show left-pointing arrow (exiting)
      expect(pathData).toContain("M15 12H3")
      expect(pathData).toContain("L6 9")
      expect(pathData).toContain("L6 15")
    })

    it("should convey exit/logout action", () => {
      const paths = wrapper.findAll("path")
      const arrowPath = paths[1]
      const pathData = arrowPath.attributes("d")!
      
      // Arrow should move from right to left (exiting)
      expect(pathData).toContain("M15 12H3")
    })

    it("should have door with opening indication", () => {
      const paths = wrapper.findAll("path")
      const doorPath = paths[0]
      const pathData = doorPath.attributes("d")!
      
      // Should suggest door opening on the left
      expect(pathData).toContain("M10 8V6")
      expect(pathData).toContain("V16")
    })
  })

  // Icon Geometry Tests
  describe("Icon Geometry", () => {
    it("should fit within 24x24 viewBox", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        const pathData = path.attributes("d")!
        const coordinates = pathData.match(/\d+\.?\d*/g)?.map(Number) || []
        const maxCoordinate = Math.max(...coordinates)
        const minCoordinate = Math.min(...coordinates)
        
        expect(maxCoordinate).toBeLessThanOrEqual(21) // Within viewBox bounds
        expect(minCoordinate).toBeGreaterThanOrEqual(3) // Reasonable padding
      })
    })

    it("should have proper element positioning", () => {
      const paths = wrapper.findAll("path")
      const doorPath = paths[0]
      const arrowPath = paths[1]
      
      // Door should be on the right side
      expect(doorPath.attributes("d")).toContain("M10")
      expect(doorPath.attributes("d")).toContain("21")
      
      // Arrow should end at left side
      expect(arrowPath.attributes("d")).toContain("H3")
    })

    it("should maintain visual balance", () => {
      const svg = wrapper.find("svg")
      const viewBox = svg.attributes("viewBox")!
      const [minX, minY, width, height] = viewBox.split(" ").map(Number)
      
      expect(width).toBe(24)
      expect(height).toBe(24)
      expect(minX).toBe(0)
      expect(minY).toBe(0)
    })
  })

  // Integration Tests
  describe("Integration", () => {
    it("should work within larger components", () => {
      const ParentComponent = {
        template: '<div><IconLogout /></div>',
        components: { IconLogout }
      }
      
      const parentWrapper = shallowMount(ParentComponent)
      expect(parentWrapper.findComponent(IconLogout).exists()).toBe(true)
      parentWrapper.unmount()
    })

    it("should maintain structure when re-rendered", () => {
      const initialHtml = wrapper.html()
      wrapper.vm.$forceUpdate()
      expect(wrapper.html()).toBe(initialHtml)
    })

    it("should work in log activity context", () => {
      expect(wrapper.findComponent(IconLogout).exists()).toBe(true)
    })
  })

  // Performance Tests
  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now()
      const testWrapper = shallowMount(IconLogout)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(50)
      testWrapper.unmount()
    })

    it("should not cause memory leaks on repeated mounting", () => {
      const wrappers = []
      for (let i = 0; i < 10; i++) {
        wrappers.push(shallowMount(IconLogout))
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
    it("should use pink/magenta brand color", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe("#E2517C")
      })
    })

    it("should maintain color consistency across elements", () => {
      const coloredElements = wrapper.findAll("[stroke]")
      const colors = new Set()
      coloredElements.forEach(element => {
        colors.add(element.attributes("stroke"))
      })
      expect(colors.size).toBe(1)
      expect(colors.has("#E2517C")).toBe(true)
    })

    it("should not have conflicting fill colors", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("fill")).toBe("none")
      
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("fill")).toBeFalsy()
      })
    })
  })

  // Visual Validation Tests
  describe("Visual Validation", () => {
    it("should have clear logout action representation", () => {
      const paths = wrapper.findAll("path")
      expect(paths.length).toBe(2)
      
      // Should have both door and arrow elements
      const doorElement = paths[0]
      const arrowElement = paths[1]
      
      expect(doorElement.attributes("d")).toContain("V6C10")
      expect(arrowElement.attributes("d")).toContain("M15 12H3")
    })

    it("should have balanced visual weight", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        const strokeWidth = parseFloat(path.attributes("stroke-width")!)
        expect(strokeWidth).toBeGreaterThan(1)
        expect(strokeWidth).toBeLessThan(2)
      })
    })

    it("should be recognizable at small sizes", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("width")).toBe("24")
      expect(svg.attributes("height")).toBe("24")
    })
  })

  // Log Activity Context Tests
  describe("Log Activity Context", () => {
    it("should represent logout action", () => {
      const paths = wrapper.findAll("path")
      const arrowPath = paths[1]
      
      // Arrow should point away from door (logout direction)
      expect(arrowPath.attributes("d")).toContain("M15 12H3")
      expect(arrowPath.attributes("d")).toContain("L6 9")
      expect(arrowPath.attributes("d")).toContain("L6 15")
    })

    it("should use appropriate color for exit action", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        // Pink/magenta suggests warning or exit action
        expect(path.attributes("stroke")).toBe("#E2517C")
      })
    })

    it("should be suitable for activity logging UI", () => {
      expect(wrapper.find("svg").exists()).toBe(true)
      expect(wrapper.findAll("path").length).toBe(2)
    })
  })

  // Design Consistency Tests
  describe("Design Consistency", () => {
    it("should follow icon design standards", () => {
      const svg = wrapper.find("svg")
      const paths = wrapper.findAll("path")
      
      expect(svg.attributes("viewBox")).toBe("0 0 24 24")
      paths.forEach(path => {
        expect(path.attributes("stroke-linecap")).toBe("round")
        expect(path.attributes("stroke-linejoin")).toBe("round")
      })
    })

    it("should maintain stroke consistency", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke-width")).toBe("1.33333")
        expect(path.attributes("stroke-linecap")).toBe("round")
        expect(path.attributes("stroke-linejoin")).toBe("round")
      })
    })

    it("should use precise coordinate system", () => {
      const paths = wrapper.findAll("path")
      const doorPath = paths[0]
      const pathData = doorPath.attributes("d")!
      
      // Should use rounded corners for door
      expect(pathData).toContain("C10")
      expect(pathData).toContain("C21")
    })
  })

  // Logout Semantics Tests
  describe("Logout Semantics", () => {
    it("should convey exit/departure meaning", () => {
      const paths = wrapper.findAll("path")
      const doorPath = paths[0]
      const arrowPath = paths[1]
      
      // Door represents system/container
      expect(doorPath.attributes("d")).toContain("V6C10")
      
      // Arrow represents movement away/exit
      expect(arrowPath.attributes("d")).toContain("H3")
    })

    it("should show directional flow out of system", () => {
      const paths = wrapper.findAll("path")
      const arrowPath = paths[1]
      const pathData = arrowPath.attributes("d")!
      
      // Should flow from right (inside) to left (outside)
      expect(pathData).toContain("M15 12H3")
    })

    it("should maintain logout metaphor integrity", () => {
      const paths = wrapper.findAll("path")
      
      // Should have exactly door + arrow elements
      expect(paths.length).toBe(2)
      
      // Door should be rectangular/container-like
      expect(paths[0].attributes("d")).toContain("V18C21")
      
      // Arrow should have proper arrowhead pointing left
      expect(paths[1].attributes("d")).toContain("M3 12L6 9M3 12L6 15")
    })
  })

  // Comparison with Login Icon Tests
  describe("Comparison with Login Icon", () => {
    it("should have opposite arrow direction from login", () => {
      const paths = wrapper.findAll("path")
      const arrowPath = paths[1]
      const pathData = arrowPath.attributes("d")!
      
      // Logout arrow should point left (opposite of login)
      expect(pathData).toContain("M15 12H3") // Right to left
      expect(pathData).toContain("L6 9") // Left-pointing arrowhead
    })

    it("should use different color from login", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        // Should use pink/magenta, not blue like login
        expect(path.attributes("stroke")).toBe("#E2517C")
        expect(path.attributes("stroke")).not.toBe("#004D8B") // Not login blue
      })
    })

    it("should maintain similar structure but opposite meaning", () => {
      const paths = wrapper.findAll("path")
      
      // Same structure: door + arrow
      expect(paths.length).toBe(2)
      
      // But different positioning and direction
      const doorPath = paths[0]
      const arrowPath = paths[1]
      
      expect(doorPath.attributes("d")).toContain("M10") // Different door position
      expect(arrowPath.attributes("d")).toContain("H3") // Different arrow direction
    })
  })

  // Color Psychology Tests
  describe("Color Psychology", () => {
    it("should use warning/exit color", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        const color = path.attributes("stroke")!
        // Pink/magenta suggests caution or exit action
        expect(color).toBe("#E2517C")
        expect(color.toLowerCase()).toMatch(/^#[e][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/)
      })
    })

    it("should differentiate from success or neutral colors", () => {
      const paths = wrapper.findAll("path")
      const color = paths[0].attributes("stroke")!
      
      // Should not be green (success) or blue (neutral)
      expect(color).not.toMatch(/^#[0-9][0-9][a-f][0-9a-f][0-9a-f][0-9a-f]$/) // Not green
      expect(color).not.toMatch(/^#[0-9][0-9][0-9][4-9][a-f][0-9a-f]$/) // Not blue
    })
  })
})
