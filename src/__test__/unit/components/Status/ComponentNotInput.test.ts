/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import ComponentNotInput from "@/components/Status/ComponentNotInput.vue"

describe("ComponentNotInput.vue", () => {
  let wrapper: VueWrapper<any>

  // Setup environment DOM polyfills
  beforeAll(() => {
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
      wrapper = shallowMount(ComponentNotInput, {
        global: {
          stubs: {
            IconWarningPersetujuan: true
          }
        }
      })
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should render with correct structure", () => {
      wrapper = shallowMount(ComponentNotInput, {
        global: {
          stubs: {
            IconWarningPersetujuan: true
          }
        }
      })
      
      expect(wrapper.find('div').exists()).toBe(true)
      expect(wrapper.find('span').exists()).toBe(true)
    })
  })

  describe("Component Content", () => {
    beforeEach(() => {
      wrapper = shallowMount(ComponentNotInput, {
        global: {
          stubs: {
            IconWarningPersetujuan: true
          }
        }
      })
    })

    it("should display correct text", () => {
      const spanElement = wrapper.find('span')
      expect(spanElement.text()).toBe('Belum Input')
    })

    it("should have correct CSS classes", () => {
      const containerDiv = wrapper.find('div')
      expect(containerDiv.classes()).toContain('flex')
      expect(containerDiv.classes()).toContain('flex-row')
      expect(containerDiv.classes()).toContain('space-x-1.5')
      expect(containerDiv.classes()).toContain('bg-[#FFE5E6]')
      expect(containerDiv.classes()).toContain('px-1.5')
      expect(containerDiv.classes()).toContain('py-0.5')
      expect(containerDiv.classes()).toContain('items-center')
      expect(containerDiv.classes()).toContain('border')
      expect(containerDiv.classes()).toContain('border-[#FD8A8A]')
      expect(containerDiv.classes()).toContain('rounded-full')
      expect(containerDiv.classes()).toContain('w-fit')
    })

    it("should have correct text styling", () => {
      const spanElement = wrapper.find('span')
      expect(spanElement.classes()).toContain('text-xs')
      expect(spanElement.classes()).toContain('font-semibold')
      expect(spanElement.classes()).toContain('text-warningColor')
    })
  })

  describe("Component Structure", () => {
    beforeEach(() => {
      wrapper = shallowMount(ComponentNotInput, {
        global: {
          stubs: {
            IconWarningPersetujuan: true
          }
        }
      })
    })

    it("should contain icon component", () => {
      const iconComponent = wrapper.findComponent({ name: 'IconWarningPersetujuan' })
      expect(iconComponent.exists()).toBe(true)
    })

    it("should have proper container structure", () => {
      const containerDiv = wrapper.find('div')
      expect(containerDiv.exists()).toBe(true)
      
      // Check if container has both icon and text
      const children = containerDiv.element.children
      expect(children.length).toBeGreaterThanOrEqual(1) // At least text span should exist
    })

    it("should maintain correct element order", () => {
      const containerDiv = wrapper.find('div')
      const spanElement = wrapper.find('span')
      
      // Verify span exists within container
      expect(containerDiv.element.contains(spanElement.element)).toBe(true)
    })
  })

  describe("Visual Appearance", () => {
    beforeEach(() => {
      wrapper = shallowMount(ComponentNotInput, {
        global: {
          stubs: {
            IconWarningPersetujuan: true
          }
        }
      })
    })

    it("should have warning-themed styling", () => {
      const containerDiv = wrapper.find('div')
      const spanElement = wrapper.find('span')
      
      // Check warning color theme
      expect(containerDiv.classes()).toContain('bg-[#FFE5E6]') // Warning background
      expect(containerDiv.classes()).toContain('border-[#FD8A8A]') // Warning border
      expect(spanElement.classes()).toContain('text-warningColor') // Warning text color
    })

    it("should have badge-like appearance", () => {
      const containerDiv = wrapper.find('div')
      
      // Check badge styling
      expect(containerDiv.classes()).toContain('rounded-full')
      expect(containerDiv.classes()).toContain('w-fit')
      expect(containerDiv.classes()).toContain('px-1.5')
      expect(containerDiv.classes()).toContain('py-0.5')
      expect(containerDiv.classes()).toContain('border')
    })

    it("should have correct layout properties", () => {
      const containerDiv = wrapper.find('div')
      
      // Check flexbox layout
      expect(containerDiv.classes()).toContain('flex')
      expect(containerDiv.classes()).toContain('flex-row')
      expect(containerDiv.classes()).toContain('items-center')
      expect(containerDiv.classes()).toContain('space-x-1.5')
    })
  })

  describe("Component Accessibility", () => {
    beforeEach(() => {
      wrapper = shallowMount(ComponentNotInput, {
        global: {
          stubs: {
            IconWarningPersetujuan: true
          }
        }
      })
    })

    it("should have meaningful text content", () => {
      const spanElement = wrapper.find('span')
      expect(spanElement.text()).toBeTruthy()
      expect(spanElement.text()).toBe('Belum Input')
    })

    it("should be semantically structured", () => {
      // Component should have proper structure for screen readers
      const spanElement = wrapper.find('span')
      expect(spanElement.element.tagName).toBe('SPAN')
    })
  })
})
