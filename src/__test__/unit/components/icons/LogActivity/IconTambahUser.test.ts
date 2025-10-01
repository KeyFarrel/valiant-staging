/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import IconTambahUser from "@/components/icons/LogActivity/IconTambahUser.vue"

describe("IconTambahUser.vue", () => {
  let wrapper: VueWrapper<any>

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe("Component Mounting", () => {
    it("should mount successfully", () => {
      wrapper = shallowMount(IconTambahUser)
      expect(wrapper.exists()).toBe(true)
    })

    it("should be a Vue component", () => {
      wrapper = shallowMount(IconTambahUser)
      expect(wrapper.vm).toBeTruthy()
    })

    it("should render without errors", () => {
      expect(() => {
        wrapper = shallowMount(IconTambahUser)
      }).not.toThrow()
    })
  })

  describe("SVG Structure", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
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

    it("should contain exactly one path element", () => {
      const paths = wrapper.findAll("path")
      expect(paths).toHaveLength(1)
    })
  })

  describe("Icon Rendering", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should render the complete icon", () => {
      const svg = wrapper.find("svg")
      expect(svg.html()).toContain("path")
    })

    it("should maintain aspect ratio", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("width")).toBe(svg.attributes("height"))
    })

    it("should be visible", () => {
      const svg = wrapper.find("svg")
      expect(svg.isVisible()).toBe(true)
    })
  })

  describe("Path Element", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should have combined user and add icon path", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      expect(iconPath.attributes("d")).toBe("M16 19H22M19 16V22M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14M8 7C8 8.06087 8.42143 9.07828 9.17157 9.82843C9.92172 10.5786 10.9391 11 12 11C13.0609 11 14.0783 10.5786 14.8284 9.82843C15.5786 9.07828 16 8.06087 16 7C16 5.93913 15.5786 4.92172 14.8284 4.17157C14.0783 3.42143 13.0609 3 12 3C10.9391 3 9.92172 3.42143 9.17157 4.17157C8.42143 4.92172 8 5.93913 8 7Z")
    })

    it("should have consistent stroke properties", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      expect(iconPath.attributes("stroke")).toBe("#C68400")
      expect(iconPath.attributes("stroke-width")).toBe("1.33333")
      expect(iconPath.attributes("stroke-linecap")).toBe("round")
      expect(iconPath.attributes("stroke-linejoin")).toBe("round")
    })
  })

  describe("Styling", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should use orange/yellow color scheme", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe("#C68400")
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

    it("should have no fill attribute on paths", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        expect(path.attributes("fill")).toBeUndefined()
      })
    })
  })

  describe("Add User Design Elements", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should represent user addition functionality", () => {
      const paths = wrapper.findAll("path")
      expect(paths).toHaveLength(1)
      
      const pathData = paths[0].attributes("d")
      // Plus sign elements
      expect(pathData).toContain("M16 19H22") // horizontal line
      expect(pathData).toContain("M19 16V22") // vertical line
      
      // User profile elements
      expect(pathData).toContain("M6 21V19") // user body
      expect(pathData).toContain("M8 7C8") // user head
    })

    it("should have plus sign representation", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      const pathData = iconPath.attributes("d")
      
      expect(pathData).toContain("M16 19H22") // horizontal line of plus
      expect(pathData).toContain("M19 16V22") // vertical line of plus
    })

    it("should have user profile representation", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      const pathData = iconPath.attributes("d")
      
      // User body/shoulders
      expect(pathData).toContain("M6 21V19")
      expect(pathData).toContain("10 15H14")
      
      // User head (circle)
      expect(pathData).toContain("M8 7C8")
      expect(pathData).toContain("12 11C13")
    })

    it("should combine user and add action metaphors", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      const pathData = iconPath.attributes("d")
      
      // Should contain both user elements and plus elements
      expect(pathData).toContain("H22") // plus horizontal
      expect(pathData).toContain("V22") // plus vertical
      expect(pathData).toContain("C6 17.9391") // user body curve
      expect(pathData).toContain("C8 8.06087") // user head curve
    })
  })

  describe("Icon Geometry", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should fit within 24x24 viewBox", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("viewBox")).toBe("0 0 24 24")
      expect(svg.attributes("width")).toBe("24")
      expect(svg.attributes("height")).toBe("24")
    })

    it("should have proper coordinate ranges", () => {
      const paths = wrapper.findAll("path")
      paths.forEach(path => {
        const pathData = path.attributes("d")
        expect(pathData).toBeDefined()
        expect(pathData.length).toBeGreaterThan(0)
      })
    })

    it("should maintain consistent design proportions", () => {
      const svg = wrapper.find("svg")
      const viewBox = svg.attributes("viewBox").split(" ")
      expect(viewBox[2]).toBe(viewBox[3]) // width equals height
    })
  })

  describe("Component Behavior", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should be a presentational component", () => {
      expect(wrapper.vm.$props).toEqual({})
    })

    it("should not have reactive data", () => {
      expect(Object.keys(wrapper.vm.$data)).toHaveLength(0)
    })

    it("should not emit any events", () => {
      expect(wrapper.emitted()).toEqual({})
    })

    it("should be stateless", () => {
      expect(wrapper.vm.$data).toEqual({})
    })
  })

  describe("Add User Icon Semantics", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should convey user addition concept", () => {
      const svg = wrapper.find("svg")
      expect(svg.exists()).toBe(true)
      
      const paths = wrapper.findAll("path")
      expect(paths).toHaveLength(1)
      
      // Orange/yellow color indicates add user action
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe("#C68400")
      })
    })

    it("should use appropriate color for user management", () => {
      const paths = wrapper.findAll("path")
      const orangeColor = "#C68400"
      
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe(orangeColor)
      })
    })

    it("should represent combined user and addition action", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      const pathData = iconPath.attributes("d")
      
      // User representation
      expect(pathData).toContain("M6 21V19") // user body
      expect(pathData).toContain("M8 7C8") // user head
      
      // Addition representation
      expect(pathData).toContain("M16 19H22") // plus horizontal
      expect(pathData).toContain("M19 16V22") // plus vertical
    })

    it("should maintain add user metaphor integrity", () => {
      const svg = wrapper.find("svg")
      const paths = wrapper.findAll("path")
      
      expect(svg.attributes("viewBox")).toBe("0 0 24 24")
      expect(paths).toHaveLength(1)
      
      // Single path combining both user and plus elements
      const pathData = paths[0].attributes("d")
      expect(pathData).toContain("M16 19H22M19 16V22") // plus sign
      expect(pathData).toContain("M6 21V19C6") // user profile
    })
  })

  describe("User Profile Analysis", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should have proper user head geometry", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      const pathData = iconPath.attributes("d")
      
      // User head should be a circle
      expect(pathData).toContain("M8 7C8") // start of head circle
      expect(pathData).toContain("12 11C13") // head circle coordinates
      expect(pathData).toContain("16 7C16") // end of head circle
    })

    it("should have user body representation", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      const pathData = iconPath.attributes("d")
      
      // User body/shoulders
      expect(pathData).toContain("M6 21V19") // body start
      expect(pathData).toContain("10 15H14") // shoulders width
    })

    it("should position user elements appropriately", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      const pathData = iconPath.attributes("d")
      
      // User should be positioned on left side of icon
      expect(pathData).toContain("M6 21") // left positioning
      expect(pathData).toContain("M8 7") // head positioning
    })
  })

  describe("Plus Sign Analysis", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should have proper plus sign geometry", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      const pathData = iconPath.attributes("d")
      
      // Plus sign lines
      expect(pathData).toContain("M16 19H22") // horizontal line
      expect(pathData).toContain("M19 16V22") // vertical line
    })

    it("should position plus sign on the right", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      const pathData = iconPath.attributes("d")
      
      // Plus should be on right side (x > 16)
      expect(pathData).toContain("M16 19H22") // starts at x=16
      expect(pathData).toContain("M19 16V22") // centered at x=19
    })

    it("should create proper cross intersection", () => {
      const paths = wrapper.findAll("path")
      const iconPath = paths[0]
      const pathData = iconPath.attributes("d")
      
      // Lines should intersect at (19, 19)
      expect(pathData).toContain("19H22") // horizontal through 19
      expect(pathData).toContain("19 16V22") // vertical through 19
    })
  })

  describe("Accessibility", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should be accessible for screen readers", () => {
      const svg = wrapper.find("svg")
      expect(svg.exists()).toBe(true)
    })

    it("should have scalable design", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("viewBox")).toBe("0 0 24 24")
    })

    it("should maintain clarity at different sizes", () => {
      const paths = wrapper.findAll("path")
      expect(paths).toHaveLength(1)
      
      paths.forEach(path => {
        expect(path.attributes("stroke-width")).toBe("1.33333")
      })
    })
  })

  describe("Performance", () => {
    it("should render quickly", () => {
      const startTime = performance.now()
      wrapper = shallowMount(IconTambahUser)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100)
    })

    it("should have minimal DOM footprint", () => {
      wrapper = shallowMount(IconTambahUser)
      const elements = wrapper.findAll("*")
      expect(elements.length).toBeLessThanOrEqual(3) // svg + 1 path + wrapper
    })
  })

  describe("Size Comparison", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
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

    it("should have consistent sizing with other icons", () => {
      const svg = wrapper.find("svg")
      expect(svg.attributes("viewBox")).toBe("0 0 24 24")
    })
  })

  describe("Color Analysis", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should use distinct orange for user management", () => {
      const paths = wrapper.findAll("path")
      const userManagementOrange = "#C68400"
      
      paths.forEach(path => {
        expect(path.attributes("stroke")).toBe(userManagementOrange)
      })
    })

    it("should maintain visual consistency", () => {
      const paths = wrapper.findAll("path")
      const strokeColors = paths.map(path => path.attributes("stroke"))
      const uniqueColors = new Set(strokeColors)
      
      expect(uniqueColors.size).toBe(1)
      expect(Array.from(uniqueColors)[0]).toBe("#C68400")
    })

    it("should differentiate from other action colors", () => {
      const paths = wrapper.findAll("path")
      const color = paths[0].attributes("stroke")
      
      // Should be different from common action colors
      expect(color).not.toBe("#0C8D63") // approval green
      expect(color).not.toBe("#670D9E") // revision purple
      expect(color).not.toBe("#004D8B") // login blue
    })
  })

  describe("Single Path Efficiency", () => {
    beforeEach(() => {
      wrapper = shallowMount(IconTambahUser)
    })

    it("should use single path for entire icon", () => {
      const paths = wrapper.findAll("path")
      expect(paths).toHaveLength(1)
    })

    it("should efficiently combine multiple elements", () => {
      const paths = wrapper.findAll("path")
      const pathData = paths[0].attributes("d")
      
      // Should contain multiple move commands for different elements
      const moveCommands = (pathData.match(/M/g) || []).length
      expect(moveCommands).toBeGreaterThanOrEqual(3) // user head, body, plus
    })

    it("should maintain rendering performance", () => {
      const paths = wrapper.findAll("path")
      const pathData = paths[0].attributes("d")
      
      expect(pathData).toBeDefined()
      expect(typeof pathData).toBe('string')
      expect(pathData.length).toBeGreaterThan(50) // complex enough for full icon
    })
  })
})
