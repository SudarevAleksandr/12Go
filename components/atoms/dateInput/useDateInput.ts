import type { InputEvent } from '@/components/atoms/input/Input.types'
import { numericMask, getBrowserLocale } from '@/helpers/methods'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import type { UseDateInput } from '@/components/atoms/dateInput/DateInput.types'

export function useDateInput({ modelValue, minDate, maxDate, emit }: UseDateInput) {
  const previousSelectionStart = ref<number>(0)
  const previousSelectionEnd = ref<number>(0)
  const previousString = ref<string>('')
  const pattern = ref<string>('')
  const date = ref<string | null>(null)
  const errorMessage = ref<string | null>(null)
  const isFullDataValid = ref(false)
  const browserLocale = ref('')
  const hydrationLoading = ref(pattern.value ? false : true)

  function fillDay(string: string | undefined = '') {
    if (string === '00') return string
    string = string.replace(/\s/g, '0')
    string = string.padEnd(2, string.slice(-1) === '0' ? '1' : '0')
    if (Number(string) < 1) string = '01'
    return string
  }

  function fillYear(string: string | undefined = '', pattern: string, char: '0' | '9') {
    const isShort = pattern.length === 2
    const initial = isShort ? '00' : '0200'
    const minimum = isShort ? 0 : 200
    string = string.replace(/\s/g, char).padEnd(pattern.length, char)
    if (Number(string) < minimum) string = initial
    return string
  }

  function validateDate(string: string) {
    if (!string?.length) return true
    const separator = '/'
    const dates = string.split(separator)
    const patterns = pattern.value.split(separator)

    const monthIndex = patterns.findIndex((item) => item.includes('M'))
    const monthPattern = patterns[monthIndex]
    const month = fillDay(dates[monthIndex])

    const dayIndex = patterns.findIndex((item) => item.includes('D'))
    const dayPattern = patterns[dayIndex]
    const day = fillDay(dates[dayIndex])

    const dayAndMonth = [day, month].join(separator)
    const dayAndMonthPattern = [dayPattern, monthPattern].join(separator)
    const valid = dayjs(dayAndMonth, dayAndMonthPattern, true).isValid()

    if (!valid) {
      errorMessage.value = 'Incorrect date ' + string
      return false
    }

    const yearIndex = patterns.findIndex((item) => item.includes('Y'))
    if (dates[yearIndex]) {
      const yearPattern = patterns[yearIndex]
      const year = fillYear(dates[yearIndex], yearPattern, '0')
      const maxYear = fillYear(dates[yearIndex], yearPattern, '9')
      const fullDate = [day, month, year].join('-')
      const fullPattern = [dayPattern, monthPattern, yearPattern].join(separator)
      const dateObj = dayjs(fullDate, fullPattern).toDate()
      const fullMaxDate = [day, month, maxYear].join('-')
      const dateMaxObj = dayjs(fullMaxDate, fullPattern).toDate()
      if (dateMaxObj < dayjs(minDate.value).toDate()) {
        errorMessage.value = string + ' the date should be later than ' + dayjs(minDate.value).format(pattern.value)
        return false
      }
      if (dateObj > dayjs(maxDate.value).toDate()) {
        errorMessage.value = string + ' date must be before ' + dayjs(maxDate.value).format(pattern.value)
        return false
      }
    }

    if (string.length === pattern.value.length && !string.includes(' ')) {
      const valid = dayjs(string, pattern.value, true).isValid()
      isFullDataValid.value = valid
      if (!valid) {
        errorMessage.value = 'Не корректная дата ' + string
        return false
      }
    }

    return true
  }

  function updateModelValue() {
    const value = isFullDataValid.value ? dayjs(date.value, pattern.value).format('YYYY-MM-DD') : null
    emit('update:modelValue', value)
  }

  function setPreviousState(e: InputEvent) {
    previousSelectionStart.value = e?.target.selectionStart || 0
    previousSelectionEnd.value = e?.target.selectionEnd || 0
    previousString.value = e?.target.value || ''
  }

  function onInput(e: InputEvent) {
    errorMessage.value = null
    isFullDataValid.value = false

    if (!e) {
      date.value = null
      updateModelValue()
      return
    }
    let selectionEnd = e?.target.selectionEnd || 0

    const isDeletion = e?.target.value.length < (date.value?.length || 0)
    const isKeyPressed = previousSelectionStart.value === previousSelectionEnd.value
    const deletionByKey = isDeletion && isKeyPressed

    let { maskString, updatedSelectionEnd } = numericMask({
      string: e?.target.value,
      pattern: pattern.value,
      selectionEnd,
      previousSelectionStart: previousSelectionStart.value,
      previousSelectionEnd: previousSelectionEnd.value,
      previousString: previousString.value,
      isDeletion,
      numericalSigns: ['D', 'M', 'Y'],
    })

    let isValid = true
    if (!deletionByKey) isValid = validateDate(maskString)
    if (!isValid) {
      maskString = date.value as string
      updatedSelectionEnd = previousSelectionEnd.value
    }

    date.value = maskString ? '' : 'null'
    nextTick(() => {
      date.value = maskString
      updateModelValue()
      nextTick(() => {
        e.target.setSelectionRange(updatedSelectionEnd, updatedSelectionEnd)
      })
    })
  }

  onMounted(() => {
    dayjs.extend(customParseFormat)
    browserLocale.value = getBrowserLocale()
    pattern.value = browserLocale.value === 'en-US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'
    hydrationLoading.value = false
    const dayjsDate = dayjs(modelValue.value, 'YYYY-MM-DD', true)

    if (dayjsDate.isValid()) {
      const formattedDate = dayjsDate.format(pattern.value)
      date.value = validateDate(formattedDate) ? formattedDate : null
    } else {
      date.value = null
    }
  })

  return { pattern, errorMessage, isFullDataValid, hydrationLoading, date, onInput, setPreviousState }
}
