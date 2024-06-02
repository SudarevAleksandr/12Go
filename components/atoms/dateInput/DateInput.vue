<template>
  <Input
    clearable
    :leftIcon="calendarIcon"
    :value="date"
    :placeholder="pattern"
    :confirmed="isFullDataValid"
    :errorMessage="errorMessage"
    :loading="hydrationLoading || loading"
    :disabled="hydrationLoading || disabled"
    :label="label"
    @beforeinput="setPreviousState"
    @input="onInput"
  />
</template>

<script lang="ts">
import Input from '@/components/atoms/input/Input.vue'
import type { InputEvent, InputValue, InputErrorMessage } from '@/components/atoms/input/Input.types'
import { defineComponent, type PropType } from 'vue'
import { numericMask } from '@/helpers/methods'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { ref, toRefs, onMounted } from 'vue'
import dayjs from 'dayjs'
import calendarIcon from '@/assets/icon/calendar.svg'

//const { $browserLocale } = useNuxtApp();

//function removeCharAt(str: string, index: number): string {
//  if (index < 0 || index >= str.length) {
//    return str // Если индекс выходит за пределы строки, возвращаем исходную строку
//  }
//  return str.substring(0, index) + str.substring(index + 1)
//}

interface DataInterface {
  //date: InputValue
  //pattern: string
  //errorMessage: InputErrorMessage
  calendarIcon: string
  previousSelectionStart: number
  previousSelectionEnd: number
  previousString: string
  //dayjsSeparators: string[]
  //isFullDataValid: boolean
}

export default defineComponent({
  name: 'DateInput',
  components: { Input },
  setup(props) {
    const pattern = ref<string>('')
    //const calendarIcon = ref(calendarIcon)
    const date = ref<string | null>(null)
    const errorMessage = ref<string | null>(null)
    const isFullDataValid = ref(false)
    const browserLocale = ref('')
    const hydrationLoading = ref(pattern.value ? false : true)
    const { modelValue, minDate, maxDate } = toRefs(props)

    //const { $browserLocale } = useNuxtApp()
    ////let pattern = 'DD/MM/YYYY'
    //if ($browserLocale === 'en-US') pattern.value = 'MM/DD/YYYY'
    //console.log('pattern >>>', pattern)
    //console.log('$browserLocale >>>', $browserLocale)
    //console.log('$browserLocale === en-US >>>', $browserLocale === 'en-US')
    //const { $browserLocale } = useNuxtApp()
    //onMounted(() => {
    //let pattern = 'DD/MM/YYYY'
    const getBrowserLocale = () => {
      if (navigator.languages && navigator.languages.length) {
        return navigator.languages[0]
      } else if (navigator.language) {
        return navigator.language
      } else {
        return 'en'
      }
    }

    function fillDay(string: string | undefined = '') {
      if (string === '00') return string
      string = string.replace(/\s/g, '0')
      string = string.padEnd(2, string.slice(-1) === '0' ? '1' : '0')
      if (Number(string) < 1) string = '01'
      return string
    }
    function fillYear(string: string | undefined = '', pattern: string) {
      const isShort = pattern.length === 2
      const initial = isShort ? '00' : '0200'
      const minimum = isShort ? 0 : 200
      string = string.replace(/\s/g, '0')
      string = string.padEnd(pattern.length, '0')
      if (Number(string) < minimum) string = initial
      return string
    }
    function fillMaximumYear(string: string | undefined = '', pattern: string) {
      const isShort = pattern.length === 2
      const initial = isShort ? '00' : '0200'
      const minimum = isShort ? 0 : 200
      string = string.replace(/\s/g, '9').padEnd(pattern.length, '9')
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
        errorMessage.value = 'Не корректная дата ' + string
        return false
      }
      const yearIndex = patterns.findIndex((item) => item.includes('Y'))

      if (dates[yearIndex]) {
        const yearPattern = patterns[yearIndex]
        const year = fillYear(dates[yearIndex], yearPattern)
        const maxYear = fillMaximumYear(dates[yearIndex], yearPattern)

        const fullDate = [day, month, year].join('-')
        const fullPattern = [dayPattern, monthPattern, yearPattern].join(separator)
        const dateObj = dayjs(fullDate, fullPattern).toDate()
        const fullMaxDate = [day, month, maxYear].join('-')
        const dateMaxObj = dayjs(fullMaxDate, fullPattern).toDate()

        if (dateMaxObj < new Date(minDate.value)) {
          errorMessage.value = string + ' дата должна быть позже ' + dayjs(minDate.value).format(pattern.value)
          return false
        }

        if (dateObj > new Date(maxDate.value)) {
          errorMessage.value = string + ' дата должна предшествовать ' + dayjs(maxDate.value).format(pattern.value)
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

    //console.log('pattern >>>', pattern.value)
    //console.log('$browserLocale >>>', $browserLocale)
    //console.log('$browserLocale === en-US >>>', $browserLocale === 'en-US')
    //})
    onMounted(() => {
      dayjs.extend(customParseFormat)
      browserLocale.value = getBrowserLocale()
      pattern.value = browserLocale.value === 'en-US' ? 'MM/DD/YYYY' : 'DD/MM/YYYY'
      hydrationLoading.value = false
      const dayjsDate = dayjs(modelValue.value, 'YYYY-MM-DD', true)
      //date.value = dayjsDate.isValid() ? dayjsDate.format(pattern.value) : null
      if (dayjsDate.isValid()) {
        const formattedDate = dayjsDate.format(pattern.value)
        date.value = validateDate(formattedDate) ? formattedDate : null
      } else {
        date.value = null
      }
      //console.log('pattern.value >>>', pattern.value)
      //console.log('browserLocale >>>', browserLocale.value)
      //console.log('onMounted >>>', browserLocale.value)
      //if ($browserLocale === 'en-US') pattern.value = 'MM/DD/YYYY'
    })

    return { pattern, errorMessage, isFullDataValid, hydrationLoading, validateDate, date }
  },
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    minDate: {
      type: String,
      default: '1900-01-01',
    },
    maxDate: {
      type: String,
      default: '2100-01-01',
    },
    label: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data(): DataInterface {
    return {
      calendarIcon,
      //date: null,
      //errorMessage: null,
      previousSelectionStart: 0,
      previousSelectionEnd: 0,
      previousString: '',
      //dayjsSeparators: ['-', '_', ':', '.', ',', '(', ')', '/'],
      //isFullDataValid: false,
    }
  },
  computed: {},
  mounted() {
    //this.$dayjs.extend(customParseFormat)
  },
  unmounted() {},
  watch: {},
  methods: {
    updateModelValue() {
      const value = this.isFullDataValid ? this.$dayjs(this.date, this.pattern).format('YYYY-MM-DD') : null
      this.$emit('update:modelValue', value)
    },

    setPreviousState(e: InputEvent) {
      this.previousSelectionStart = e?.target.selectionStart || 0
      this.previousSelectionEnd = e?.target.selectionEnd || 0
      this.previousString = e?.target.value || ''
    },

    onInput(e: InputEvent) {
      this.errorMessage = null
      this.isFullDataValid = false

      if (!e) {
        this.date = null
        this.updateModelValue()
        return
      }
      let selectionEnd = e?.target.selectionEnd || 0

      const isDeletion = e?.target.value.length < (this.date?.length || 0)
      const isKeyPressed = this.previousSelectionStart === this.previousSelectionEnd
      const deletionByKey = isDeletion && isKeyPressed

      let { maskString, updatedSelectionEnd } = numericMask({
        string: e?.target.value,
        pattern: this.pattern,
        selectionEnd,
        previousSelectionStart: this.previousSelectionStart,
        previousSelectionEnd: this.previousSelectionEnd,
        previousString: this.previousString,
        isDeletion,
        numericalSigns: ['D', 'M', 'Y'],
      })

      let isValid = true
      if (!deletionByKey) isValid = this.validateDate(maskString)
      if (!isValid) {
        maskString = this.date as string
        updatedSelectionEnd = this.previousSelectionEnd
      }

      this.date = maskString ? '' : 'null'
      this.$nextTick(() => {
        this.date = maskString
        this.updateModelValue()
        this.$nextTick(() => {
          e.target.setSelectionRange(updatedSelectionEnd, updatedSelectionEnd)
        })
      })
    },
  },
})
</script>

<style lang="less" scoped>
.container {
  padding: 30px;
}
</style>
