import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DateInput from '@/components/atoms/dateInput/DateInput.vue'

describe('DateInput en-US locale', () => {
  beforeAll(() => {
    Object.defineProperty(window.navigator, 'language', { value: 'en-US', configurable: true })
    Object.defineProperty(window.navigator, 'languages', { value: ['en-US'], configurable: true })
  })

  it('has the correct format', async () => {
    const wrapper = await mount(DateInput, {
      props: { modelValue: '2024-06-03' },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('06/03/2024')
  })

  it('date format not valid', async () => {
    const wrapper = await mount(DateInput, {
      props: { modelValue: '2024-14-03' },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('')
  })

  it('date out of the set max range', async () => {
    const wrapper = await mount(DateInput, {
      props: { modelValue: '2200-01-02', minDate: '1800-01-01', maxDate: '2200-01-01' },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('')
  })

  it('date out of the set min range', async () => {
    const wrapper = await mount(DateInput, {
      props: { modelValue: '1799-12-31', minDate: '1800-01-01', maxDate: '2200-01-01' },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('')
  })

  it('Correct validation of the leap year', async () => {
    let wrapper = await mount(DateInput, {
      props: { modelValue: '2000-02-29' },
    })
    let input = wrapper.find('input')
    expect(input.element.value).toBe('02/29/2000')
    await wrapper.unmount()
    wrapper = await mount(DateInput, { props: { modelValue: '2001-02-29' } })
    input = wrapper.find('input')
    expect(input.element.value).toBe('')
  })
})

describe('DateInput it-IT locale', () => {
  beforeAll(() => {
    Object.defineProperty(window.navigator, 'language', { value: 'it-IT', configurable: true })
    Object.defineProperty(window.navigator, 'languages', { value: ['it-IT'], configurable: true })
  })

  it('has the correct format', async () => {
    const wrapper = await mount(DateInput, {
      props: { modelValue: '2024-06-03' },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('03/06/2024')
  })
})
