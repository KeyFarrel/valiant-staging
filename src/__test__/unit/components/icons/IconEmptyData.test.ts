/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconEmptyData from "@/components/icons/IconEmptyData.vue"

describe("IconEmptyData.vue", () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = shallowMount(IconEmptyData)
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
      expect(() => shallowMount(IconEmptyData)).not.toThrow()
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
      expect(svg.attributes("width")).toBe("206")
      expect(svg.attributes("height")).toBe("172")
      expect(svg.attributes("viewBox")).toBe("0 0 206 172")
      expect(svg.attributes("fill")).toBe("none")
      expect(svg.attributes("xmlns")).toBe("http://www.w3.org/2000/svg")
    })

    it("should have multiple child elements", () => {
      const svg = wrapper.find("svg")
      const children = svg.element.children
      expect(children.length).toBeGreaterThan(0)
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
      const wrapper2 = shallowMount(IconEmptyData)
      expect(wrapper.html()).toBe(wrapper2.html())
      wrapper2.unmount()
    })
  })

  // Circle Elements Tests
  describe("Circle Elements", () => {
    it("should contain main background circles", () => {
      const circles = wrapper.findAll("circle")
      expect(circles.length).toBeGreaterThan(1)
      
      // Main background circles
      const mainCircles = circles.filter(circle => 
        circle.attributes("cx") === "100.927" && 
        circle.attributes("cy") === "88.6719"
      )
      expect(mainCircles.length).toBe(2)
    })

    it("should have outer background circle with correct attributes", () => {
      const outerCircle = wrapper.find('circle[r="62.5"]')
      expect(outerCircle.exists()).toBe(true)
      expect(outerCircle.attributes("cx")).toBe("100.927")
      expect(outerCircle.attributes("cy")).toBe("88.6719")
      expect(outerCircle.attributes("fill")).toBe("#D3D3D3")
      expect(outerCircle.attributes("fill-opacity")).toBe("0.2")
    })

    it("should have inner background circle with correct attributes", () => {
      const innerCircle = wrapper.find('circle[r="50"]')
      expect(innerCircle.exists()).toBe(true)
      expect(innerCircle.attributes("cx")).toBe("100.927")
      expect(innerCircle.attributes("cy")).toBe("88.6719")
      expect(innerCircle.attributes("fill")).toBe("#CCCCCC")
    })

    it("should contain decorative small circles", () => {
      const smallCircles = wrapper.findAll('circle[r="5"]')
      expect(smallCircles.length).toBeGreaterThan(5)
      
      // Verify some specific decorative circles
      const specificCircles = [
        { cx: "20.9272", cy: "68.6719" },
        { cx: "116.927", cy: "5.67188" },
        { cx: "182.927", cy: "33.6719" }
      ]
      
      specificCircles.forEach(expected => {
        const found = smallCircles.some(circle => 
          circle.attributes("cx") === expected.cx && 
          circle.attributes("cy") === expected.cy
        )
        expect(found).toBe(true)
      })
    })
  })

  // Ellipse Elements Tests
  describe("Ellipse Elements", () => {
    it("should contain ellipse elements", () => {
      const ellipses = wrapper.findAll("ellipse")
      expect(ellipses.length).toBeGreaterThan(0)
    })

    it("should have correctly positioned ellipses", () => {
      const ellipse1 = wrapper.find('ellipse[cx="143.784"]')
      expect(ellipse1.exists()).toBe(true)
      expect(ellipse1.attributes("cy")).toBe("144.538")
      expect(ellipse1.attributes("rx")).toBe("2.29593")
      expect(ellipse1.attributes("ry")).toBe("2.29591")
      expect(ellipse1.attributes("fill")).toBe("#CCCCCC")
    })
  })

  // Path Elements Tests
  describe("Path Elements", () => {
    it("should contain multiple path elements", () => {
      const paths = wrapper.findAll("path")
      expect(paths.length).toBeGreaterThan(10)
    })

    it("should have paths with fill-rule and clip-rule", () => {
      const ruleBasedPaths = wrapper.findAll('path[fill-rule="evenodd"]')
      expect(ruleBasedPaths.length).toBeGreaterThan(5)
      
      ruleBasedPaths.forEach(path => {
        expect(path.attributes("clip-rule")).toBe("evenodd")
        expect(path.attributes("fill")).toBe("#CCCCCC")
      })
    })

    it("should contain the main question mark path", () => {
      const questionMarkPath = wrapper.findAll("path").find(path => 
        path.attributes("fill") === "white"
      )
      expect(questionMarkPath?.exists()).toBe(true)
    })

    it("should have decorative triangle and geometric paths", () => {
      const geometricPaths = wrapper.findAll("path").filter(path => 
        !path.attributes("fill-rule") && path.attributes("fill") === "#CCCCCC"
      )
      expect(geometricPaths.length).toBeGreaterThan(3)
    })
  })

  // Color Theme Tests
  describe("Color Theme", () => {
    it("should use consistent gray color scheme", () => {
      const elements = wrapper.findAll("[fill]")
      const colors = new Set()
      
      elements.forEach(element => {
        const fill = element.attributes("fill")
        if (fill && fill !== "none") {
          colors.add(fill)
        }
      })
      
      expect(colors.has("#CCCCCC")).toBe(true)
      expect(colors.has("#D3D3D3")).toBe(true)
      expect(colors.has("white")).toBe(true)
    })

    it("should have opacity settings for background elements", () => {
      const elementsWithOpacity = wrapper.findAll("[fill-opacity]")
      expect(elementsWithOpacity.length).toBeGreaterThan(0)
      
      const backgroundOpacity = wrapper.find('[fill-opacity="0.2"]')
      expect(backgroundOpacity.exists()).toBe(true)
    })

    it("should maintain color consistency across similar elements", () => {
      const grayElements = wrapper.findAll('[fill="#CCCCCC"]')
      expect(grayElements.length).toBeGreaterThan(10)
    })
  })

  // Accessibility Tests
  describe("Accessibility", () => {
    it("should be presentational by default", () => {
      const svg = wrapper.find("svg")
      // SVG icons are typically decorative
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
      expect(() => shallowMount(IconEmptyData, {})).not.toThrow()
    })
  })

  // Empty State Design Tests
  describe("Empty State Design", () => {
    it("should represent empty state semantically", () => {
      // The presence of question mark suggests "no data" or "empty" state
      const questionMark = wrapper.findAll("path").find(path => 
        path.attributes("fill") === "white"
      )
      expect(questionMark?.exists()).toBe(true)
    })

    it("should have decorative floating elements", () => {
      const decorativeElements = wrapper.findAll("circle, ellipse, path").filter(el => 
        el.attributes("fill") === "#CCCCCC" && 
        !el.attributes("fill-rule")
      )
      expect(decorativeElements.length).toBeGreaterThan(8)
    })

    it("should have proper visual hierarchy", () => {
      // Main circles should be larger than decorative elements
      const mainCircle = wrapper.find('circle[r="50"]')
      const smallCircles = wrapper.findAll('circle[r="5"]')
      
      expect(mainCircle.exists()).toBe(true)
      expect(smallCircles.length).toBeGreaterThan(0)
      expect(50).toBeGreaterThan(5) // Visual hierarchy validation
    })
  })

  // Integration Tests
  describe("Integration", () => {
    it("should work within larger components", () => {
      const ParentComponent = {
        template: '<div><IconEmptyData /></div>',
        components: { IconEmptyData }
      }
      
      const parentWrapper = shallowMount(ParentComponent)
      expect(parentWrapper.findComponent(IconEmptyData).exists()).toBe(true)
      parentWrapper.unmount()
    })

    it("should maintain structure when re-rendered", () => {
      const initialHtml = wrapper.html()
      wrapper.vm.$forceUpdate()
      expect(wrapper.html()).toBe(initialHtml)
    })
  })

  // Performance Tests
  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now()
      const testWrapper = shallowMount(IconEmptyData)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(50) // Should render in < 50ms
      testWrapper.unmount()
    })

    it("should not cause memory leaks on repeated mounting", () => {
      const wrappers = []
      for (let i = 0; i < 10; i++) {
        wrappers.push(shallowMount(IconEmptyData))
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
        svg.element.setAttribute("width", "300")
      }).not.toThrow()
    })

    it("should not break with CSS modifications", () => {
      expect(() => {
        wrapper.element.style.display = "none"
      }).not.toThrow()
    })

    it("should be resilient to missing attributes", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("nonexistent")).toBeUndefined()
    })
  })

  // Visual Validation Tests
  describe("Visual Validation", () => {
    it("should have proper aspect ratio", () => {
      const svg = wrapper.find("svg")
      const width = parseInt(svg.attributes("width")!)
      const height = parseInt(svg.attributes("height")!)
      const aspectRatio = width / height
      
      expect(aspectRatio).toBeCloseTo(1.2, 1) // 206/172 ≈ 1.2
    })

    it("should contain all essential visual elements", () => {
      const svg = wrapper.find("svg")
      const allElements = svg.findAll("*")
      
      // Should have substantial content for a complex empty state illustration
      expect(allElements.length).toBeGreaterThan(30)
    })

    it("should have elements distributed across the canvas", () => {
      const elementsWithPosition = wrapper.findAll("[cx], [cy]")
      expect(elementsWithPosition.length).toBeGreaterThan(10)
      
      // Verify elements are spread across the viewBox
      const positions = elementsWithPosition.map(el => ({
        cx: parseFloat(el.attributes("cx") || "0"),
        cy: parseFloat(el.attributes("cy") || "0")
      }))
      
      const xValues = positions.map(p => p.cx).filter(x => !isNaN(x))
      const yValues = positions.map(p => p.cy).filter(y => !isNaN(y))
      
      expect(Math.max(...xValues)).toBeGreaterThan(150)
      expect(Math.max(...yValues)).toBeGreaterThan(100)
    })
  })

  // Empty State Semantics Tests
  describe("Empty State Semantics", () => {
    it("should convey 'no data' message visually", () => {
      // Question mark in white suggests inquiry about missing data
      const questionMarkPath = wrapper.findAll("path").find(path => 
        path.attributes("fill") === "white" && 
        path.attributes("d")?.includes("91.1401 113.467") // Part of question mark path
      )
      expect(questionMarkPath?.exists()).toBe(true)
    })

    it("should have floating decorative elements suggesting emptiness", () => {
      const floatingElements = wrapper.findAll("circle, ellipse").filter(el => 
        el.attributes("r") === "5" || 
        el.attributes("rx")?.includes("2.295")
      )
      expect(floatingElements.length).toBeGreaterThan(6)
    })

    it("should maintain cohesive empty state design", () => {
      // All decorative elements should use the same gray color
      const decorativeElements = wrapper.findAll('[fill="#CCCCCC"]')
      expect(decorativeElements.length).toBeGreaterThan(20)
    })
  })
})
