import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/ui/Button.vue'

describe('Button.vue', () => {
  const defaultProps = {
    text: 'Test Button',
    iconPosition: 'Left',
    bgColor: 'bg-blue-500',
    hoverBgColor: 'bg-blue-600',
    borderColor: 'border-blue-500',
    hoverBorderColor: 'border-blue-600',
    textColor: 'text-white',
    hoverTextColor: 'text-white'
  }

  it('renders button with correct text', () => {
    const wrapper = mount(Button, {
      props: defaultProps
    })

    expect(wrapper.text()).toContain('Test Button')
    expect(wrapper.find('span').text()).toBe('Test Button')
  })

  it('emits onClickSubmit event when clicked', async () => {
    const wrapper = mount(Button, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('click')
    
    expect(wrapper.emitted('onClickSubmit')).toBeTruthy()
    expect(wrapper.emitted('onClickSubmit')).toHaveLength(1)
  })

  it('applies correct CSS classes from props', () => {
    const wrapper = mount(Button, {
      props: defaultProps
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('flex')
    expect(button.classes()).toContain('items-center')
    expect(button.classes()).toContain('border')
  })

  it('emits onKeyDown event when keydown is triggered', async () => {
    const wrapper = mount(Button, {
      props: defaultProps
    })

    await wrapper.find('button').trigger('keydown')
    
    expect(wrapper.emitted('onKeyDown')).toBeTruthy()
    expect(wrapper.emitted('onKeyDown')).toHaveLength(1)
  })

  it('renders slot on the right when iconPosition is Right', () => {
    const wrapper = mount(Button, {
      props: {
        ...defaultProps,
        iconPosition: 'Right'
      },
      slots: {
        default: '<i class="test-icon">Icon</i>'
      }
    })

    const button = wrapper.find('button')
    const span = wrapper.find('span')
    const icon = wrapper.find('.test-icon')
    
    expect(icon.exists()).toBe(true)
    // Check if icon comes after the text span
    const buttonChildren = button.element.children
    const spanIndex = Array.from(buttonChildren).findIndex(child => child.tagName === 'SPAN')
    const iconIndex = Array.from(buttonChildren).findIndex(child => child.classList.contains('test-icon'))
    
    expect(iconIndex).toBeGreaterThan(spanIndex)
  })

  it('renders slot on the left when iconPosition is Left', () => {
    const wrapper = mount(Button, {
      props: {
        ...defaultProps,
        iconPosition: 'Left'
      },
      slots: {
        default: '<i class="test-icon">Icon</i>'
      }
    })

    const button = wrapper.find('button')
    const span = wrapper.find('span')
    const icon = wrapper.find('.test-icon')
    
    expect(icon.exists()).toBe(true)
    // Check if icon comes before the text span
    const buttonChildren = button.element.children
    const spanIndex = Array.from(buttonChildren).findIndex(child => child.tagName === 'SPAN')
    const iconIndex = Array.from(buttonChildren).findIndex(child => child.classList.contains('test-icon'))
    
    expect(iconIndex).toBeLessThan(spanIndex)
  })
})