import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BtnModal from '@/components/ui/BtnModal.vue'

describe('BtnModal', () => {
  const defaultProps = {
    header: 'Test Modal',
    btnClass: 'btn-primary',
    btnText: 'Open Modal',
    width: 'w-96'
  }

  it('should render the button with correct text and class', () => {
    const wrapper = mount(BtnModal, {
      props: defaultProps
    })

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Open Modal')
    expect(button.classes()).toContain('btn-primary')
  })

  it('should show modal when button is clicked', async () => {
    const wrapper = mount(BtnModal, {
      props: defaultProps
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    const modal = wrapper.find('#modal-tambah')
    expect(modal.exists()).toBe(true)
    expect(modal.isVisible()).toBe(true)
  })

  it('should display correct header text in modal', async () => {
    const wrapper = mount(BtnModal, {
      props: defaultProps
    })

    const button = wrapper.find('button')
    await button.trigger('click')

    const headerText = wrapper.find('h5')
    expect(headerText.text().trim()).toBe('Test Modal')
  })
})