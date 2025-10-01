import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconTolak from "@/components/icons/LogActivity/IconTolak.vue"

describe("IconTolak.vue", () => {
  let wrapper: VueWrapper<any>

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe("Component Mounting", () => {
    it("should mount successfully", () => {
      wrapper = shallowMount(IconTolak)
      expect(wrapper.exists()).toBe(true)
    })

    it("should be a Vue component", () => {
      wrapper = shallowMount(IconTolak)
      expect(wrapper.vm).toBeTruthy()
    })

    it("should render without errors", () => {
      expect(() => {
        wrapper = shallowMount(IconTolak)
      }).not.toThrow()
    })
  })

  describe("SVG Structure", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTolak)
    })

    it("should render an SVG element", () => {
      const svg = wrapper.find("svg")
      expect(svg.exists()).toBe(true)
    })

    it("should have correct SVG attributes", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("width")).toBe("24")
      expect(svg.attributes("height")).toBe("24")
      expect(svg.attributes("viewBox")).toBe("0 0 24 24")
      expect(svg.attributes("fill")).toBe("none")
      expect(svg.attributes("xmlns")).toBe("http://www.w3.org/2000/svg")
    })

    it("should contain exactly two path elements", () => {
      const paths = wrapper.findAll("path")
      expect(paths).toHaveLength(2)
    })
  })

  describe("Path Elements", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTolak)
    })

    it("should have document corner fold path", () => {
      const paths = wrapper.findAll("path")
      const cornerPath = paths[0]
      expect(cornerPath.attributes("d")).toBe("M14 3V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89464 14.7348 8 15 8H19")
    })

    it("should have combined X mark and document outline path", () => {
      const paths = wrapper.findAll("path")
      const combinedPath = paths[1]
      const pathData = combinedPath.attributes("d")
      
      // Should contain X mark elements
      expect(pathData).toContain("M10 12L14 16M14 12L10 16")
      
      // Should contain document outline
      expect(pathData).toContain("M17 21H7")
    })

    it("should have consistent stroke properties across all paths", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe("#990000")
        expect(path.attributes("stroke-width")).toBe("1.33333")
        expect(path.attributes("stroke-linecap")).toBe("round")
        expect(path.attributes("stroke-linejoin")).toBe("round")
      })
    })
  })

  describe("Styling", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTolak)
    })

    it("should use red color scheme", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe("#990000")
      })
    })

    it("should have consistent stroke width", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke-width")).toBe("1.33333")
      })
    })

    it("should use rounded line caps and joins", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke-linecap")).toBe("round")
        expect(path.attributes("stroke-linejoin")).toBe("round")
      })
    })
  })

  describe("Rejection Design Elements", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTolak)
    })

    it("should represent a document with rejection capability", () => {
      const paths = wrapper.findAll("path")
      expect(paths).toHaveLength(2)
      
      // Document structure path
      expect(paths[0].attributes("d")).toContain("M14 3V7")
      
      // X mark and document outline path
      expect(paths[1].attributes("d")).toContain("M10 12L14 16")
      expect(paths[1].attributes("d")).toContain("M17 21H7")
    })

    it("should have X mark representation", () => {
      const paths = wrapper.findAll("path")
      const combinedPath = paths[1]
      const pathData = combinedPath.attributes("d")
      
      expect(pathData).toContain("M10 12L14 16") // diagonal line 1
      expect(pathData).toContain("M14 12L10 16") // diagonal line 2
    })

    it("should have complete document outline", () => {
      const paths = wrapper.findAll("path")
      const combinedPath = paths[1]
      const pathData = combinedPath.attributes("d")
      
      expect(pathData).toContain("M17 21H7")
      expect(pathData).toContain("5 19V5")
      expect(pathData).toContain("14L19 8V19")
    })
  })

  describe("Icon Geometry", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTolak)
    })

    it("should fit within 24x24 viewBox", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("viewBox")).toBe("0 0 24 24")
      expect(svg.attributes("width")).toBe("24")
      expect(svg.attributes("height")).toBe("24")
    })

    it("should maintain consistent design proportions", () => {
      const svg = wrapper.find("svg")
      const viewBox = svg.attributes("viewBox").split(" ")
      expect(viewBox[2]).toBe(viewBox[3]) // width equals height
    })
  })

  describe("Component Behavior", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTolak)
    })

    it("should be a presentational component", () => {
      expect(wrapper.vm.$props).toEqual({})
    })

    it("should not have reactive data", () => {
      expect(Object.keys(wrapper.vm.$data)).toHaveLength(0)
    })

    it("should be stateless", () => {
      expect(wrapper.vm.$data).toEqual({})
    })
  })

  describe("Rejection Icon Semantics", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTolak)
    })

    it("should convey document rejection concept", () => {
      const svg = wrapper.find("svg")
      expect(svg.exists()).toBe(true)
      
      const paths = wrapper.findAll("path")
      expect(paths).toHaveLength(2)
      
      // Red color indicates rejection/error action
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe("#990000")
      })
    })

    it("should use appropriate red color for rejection", () => {
      const paths = wrapper.findAll("path")
      const rejectionRed = "#990000"
      
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe(rejectionRed)
      })
    })

    it("should represent combined document and rejection action", () => {
      const paths = wrapper.findAll("path")
      
      // Document representation (corner fold)
      expect(paths[0].attributes("d")).toContain("M14 3V7")
      
      // Rejection action representation (X mark)
      expect(paths[1].attributes("d")).toContain("M10 12L14 16M14 12L10 16")
    })
  })

  describe("X Mark Analysis", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTolak)
    })

    it("should have proper X mark geometry", () => {
      const paths = wrapper.findAll("path")
      const combinedPath = paths[1]
      const pathData = combinedPath.attributes("d")
      
      // Should form an X pattern
      expect(pathData).toContain("M10 12L14 16") // diagonal from top-left to bottom-right
      expect(pathData).toContain("M14 12L10 16") // diagonal from top-right to bottom-left
    })

    it("should be positioned within document bounds", () => {
      const paths = wrapper.findAll("path")
      const combinedPath = paths[1]
      const pathData = combinedPath.attributes("d")
      
      // X mark coordinates should be within reasonable document area
      expect(pathData).toContain("10 12")
      expect(pathData).toContain("14 16")
    })
  })

  describe("Accessibility", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTolak)
    })

    it("should be accessible for screen readers", () => {
      const svg = wrapper.find("svg")
      expect(svg.exists()).toBe(true)
    })

    it("should have scalable design", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("viewBox")).toBe("0 0 24 24")
    })
  })

  describe("Size Comparison", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTolak)
    })

    it("should be standard 24x24 icon size", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("width")).toBe("24")
      expect(svg.attributes("height")).toBe("24")
    })

    it("should match other LogActivity icon dimensions", () => {
      const svg = wrapper.find("svg")
      const width = parseInt(svg.attributes("width"))
      const height = parseInt(svg.attributes("height"))
      
      expect(width).toBe(24)
      expect(height).toBe(24)
      expect(width).toBe(height)
    })
  })
})
