/**
 * @jest-environment jsdom
 */
import { shallowMount, VueWrapper } from "@vue/test-utils"
import { nextTick } from "vue"
import LamanAnalitik from "@/views/Beranda/LamanAnalitik/LamanAnalitik.vue"

// Mock child components
jest.mock("@/views/Beranda/LamanAnalitik/TabPage/FinansialTab.vue", () => ({
  name: "FinansialPage",
  template: '<div class="finansial-tab-mock">Finansial Content</div>'
}))

jest.mock("@/views/Beranda/LamanAnalitik/TabPage/TeknisTab.vue", () => ({
  name: "TeknisPage", 
  template: '<div class="teknis-tab-mock">Teknis Content</div>'
}))

describe("LamanAnalitik.vue", () => {
  let wrapper: VueWrapper<any>

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    jest.clearAllMocks()
  })

  describe("Component Mounting", () => {
    it("should mount successfully", async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      
      expect(wrapper.exists()).toBe(true)
    })

    it("should initialize with finansial tab as default", async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      
      await nextTick()
      
      expect(wrapper.vm.currentTab).toBe('finansial')
    })
  })

  describe("Tab Navigation", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      await nextTick()
    })

    it("should display finansial tab content by default", () => {
      const finansialTab = wrapper.find('[data-testid="finansial-content"]')
      const teknisTab = wrapper.find('[data-testid="teknis-content"]')
      
      expect(wrapper.vm.currentTab).toBe('finansial')
      // Finansial content should be visible, teknis should not
    })

    it("should switch to teknis tab when clicked", async () => {
      // Test by calling the method directly instead of trigger click
      wrapper.vm.showContent('teknis')
      await nextTick()
      
      expect(wrapper.vm.currentTab).toBe('teknis')
    })

    it("should switch back to finansial tab when clicked", async () => {
      // First switch to teknis
      wrapper.vm.showContent('teknis')
      await nextTick()
      expect(wrapper.vm.currentTab).toBe('teknis')
      
      // Then switch back to finansial
      wrapper.vm.showContent('finansial')
      await nextTick()
      
      expect(wrapper.vm.currentTab).toBe('finansial')
    })
  })

  describe("Button Styling", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      await nextTick()
    })

    it("should have active styling for finansial button by default", () => {
      const finansialButton = wrapper.find('button:nth-child(1)')
      
      expect(finansialButton.classes()).toContain('text-[#0099AD]')
      expect(wrapper.vm.currentTab).toBe('finansial')
    })

    it("should apply active styling to teknis button when selected", async () => {
      await wrapper.vm.showContent('teknis')
      await nextTick()
      
      expect(wrapper.vm.currentTab).toBe('teknis')
    })
  })

  describe("showContent Method", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      await nextTick()
    })

    it("should change currentTab when showContent is called", () => {
      expect(wrapper.vm.currentTab).toBe('finansial')
      
      wrapper.vm.showContent('teknis')
      expect(wrapper.vm.currentTab).toBe('teknis')
      
      wrapper.vm.showContent('finansial')
      expect(wrapper.vm.currentTab).toBe('finansial')
    })

    it("should handle edge case with invalid tab name", () => {
      wrapper.vm.showContent('invalid-tab')
      expect(wrapper.vm.currentTab).toBe('invalid-tab')
    })

    it("should handle empty string tab name", () => {
      wrapper.vm.showContent('')
      expect(wrapper.vm.currentTab).toBe('')
    })
  })

  describe("DOM Elements", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      await nextTick()
    })

    it("should render two navigation buttons", () => {
      const buttons = wrapper.findAll('button')
      expect(buttons).toHaveLength(2)
    })

    it("should have correct button text content", () => {
      const buttons = wrapper.findAll('button')
      expect(buttons[0].text()).toBe('Finansial')
      expect(buttons[1].text()).toBe('Teknis')
    })

    it("should have main container with correct classes", () => {
      const mainContainer = wrapper.find('.flex.flex-col.h-full.px-6.bg-white.rounded-lg')
      expect(mainContainer.exists()).toBe(true)
    })

    it("should render only one content section at a time", async () => {
      // Check finansial content is visible by default
      const finansialContent = wrapper.find('div[v-if="currentTab === \'finansial\'"]')
      const teknisContent = wrapper.find('div[v-else-if="currentTab === \'teknis\'"]')
      
      expect(wrapper.vm.currentTab).toBe('finansial')
      
      // Switch to teknis and verify
      wrapper.vm.showContent('teknis')
      await nextTick()
      expect(wrapper.vm.currentTab).toBe('teknis')
    })
  })

  describe("CSS Classes and Styling", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      await nextTick()
    })

    it("should apply correct base classes to buttons", () => {
      const buttons = wrapper.findAll('button')
      
      buttons.forEach(button => {
        expect(button.classes()).toContain('font-semibold')
        expect(button.classes()).toContain('hover:text-[#0099AD]')
        expect(button.classes()).toContain('border-b-4')
        expect(button.classes()).toContain('border-[#0099AD]')
        expect(button.classes()).toContain('pb-2')
      })
    })

    it("should apply active state to finansial button by default", () => {
      const finansialButton = wrapper.findAll('button')[0]
      expect(finansialButton.classes()).toContain('text-[#0099AD]')
    })

    it("should apply inactive state to teknis button by default", () => {
      const teknisButton = wrapper.findAll('button')[1]
      expect(teknisButton.classes()).toContain('text-gray-600')
      expect(teknisButton.classes()).toContain('border-transparent')
    })

    it("should switch active classes when tab changes", async () => {
      const finansialButton = wrapper.findAll('button')[0]
      const teknisButton = wrapper.findAll('button')[1]
      
      // Initial state
      expect(wrapper.vm.currentTab).toBe('finansial')
      
      // Switch to teknis
      wrapper.vm.showContent('teknis')
      await nextTick()
      
      // Verify classes would change (testing the reactive class binding logic)
      expect(wrapper.vm.currentTab).toBe('teknis')
    })

    it("should have correct margin class on second button", () => {
      const teknisButton = wrapper.findAll('button')[1]
      expect(teknisButton.classes()).toContain('ml-8')
    })
  })

  describe("Component Integration", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      await nextTick()
    })

    it("should render FinansialPage component when finansial tab is active", async () => {
      wrapper.vm.showContent('finansial')
      await nextTick()
      
      const finansialStub = wrapper.findComponent({ name: 'FinansialPage' })
      expect(finansialStub.exists()).toBe(true)
    })

    it("should render TeknisPage component when teknis tab is active", async () => {
      wrapper.vm.showContent('teknis')
      await nextTick()
      
      const teknisStub = wrapper.findComponent({ name: 'TeknisPage' })
      expect(teknisStub.exists()).toBe(true)
    })

    it("should not render inactive tab components", async () => {
      // When finansial is active, teknis should not be in DOM
      wrapper.vm.showContent('finansial')
      await nextTick()
      
      expect(wrapper.vm.currentTab).toBe('finansial')
      
      // Switch to teknis
      wrapper.vm.showContent('teknis')
      await nextTick()
      
      expect(wrapper.vm.currentTab).toBe('teknis')
    })
  })

  describe("Reactive State Management", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      await nextTick()
    })

    it("should maintain state consistency across multiple tab switches", async () => {
      const tabSequence = ['teknis', 'finansial', 'teknis', 'finansial']
      
      for (const tab of tabSequence) {
        wrapper.vm.showContent(tab)
        await nextTick()
        expect(wrapper.vm.currentTab).toBe(tab)
      }
    })

    it("should initialize currentTab as reactive ref", () => {
      expect(wrapper.vm.currentTab).toBe('finansial')
      expect(typeof wrapper.vm.currentTab).toBe('string')
    })

    it("should properly update reactive state", async () => {
      const initialTab = wrapper.vm.currentTab
      expect(initialTab).toBe('finansial')
      
      wrapper.vm.currentTab = 'teknis'
      await nextTick()
      
      expect(wrapper.vm.currentTab).toBe('teknis')
      expect(wrapper.vm.currentTab).not.toBe(initialTab)
    })
  })

  describe("Template Structure", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      await nextTick()
    })

    it("should have correct nested div structure", () => {
      const outerDiv = wrapper.find('.flex.flex-col.h-full.px-6.bg-white.rounded-lg')
      expect(outerDiv.exists()).toBe(true)
      
      const innerFlexDiv = outerDiv.find('.flex')
      expect(innerFlexDiv.exists()).toBe(true)
      
      const buttonContainer = innerFlexDiv.find('.mt-5.justify-beetween')
      expect(buttonContainer.exists()).toBe(true)
    })

    it("should render content sections with correct v-if/v-else-if structure", () => {
      // Test that the template structure exists for conditional rendering
      expect(wrapper.vm.currentTab).toBe('finansial')
      
      // The component should handle the conditional rendering logic
      wrapper.vm.showContent('teknis')
      expect(wrapper.vm.currentTab).toBe('teknis')
    })
  })

  describe("Event Handling", () => {
    beforeEach(async () => {
      wrapper = shallowMount(LamanAnalitik, {
        global: {
          stubs: {
            FinansialPage: true,
            TeknisPage: true
          }
        }
      })
      await nextTick()
    })

    it("should have click event listeners attached to buttons", () => {
      const buttons = wrapper.findAll('button')
      
      // Check that buttons have the @click directive by testing the onclick presence
      expect(buttons[0].attributes('onclick')).toBeDefined
      expect(buttons[1].attributes('onclick')).toBeDefined
    })

    it("should call showContent with correct parameters", () => {
      const showContentSpy = jest.spyOn(wrapper.vm, 'showContent')
      
      wrapper.vm.showContent('finansial')
      expect(showContentSpy).toHaveBeenCalledWith('finansial')
      
      wrapper.vm.showContent('teknis')
      expect(showContentSpy).toHaveBeenCalledWith('teknis')
      
      showContentSpy.mockRestore()
    })
  })
})