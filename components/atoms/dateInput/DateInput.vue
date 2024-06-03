<template>
  <Input
    :clearable="clearable"
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
import { defineComponent } from 'vue'
import { toRefs } from 'vue'
import calendarIcon from '@/assets/icon/calendar.svg'
import { useDateInput } from './useDateInput'

interface DataInterface {
  calendarIcon: string
}

export default defineComponent({
  name: 'DateInput',
  components: { Input },
  setup(props, context) {
    const { modelValue, minDate, maxDate } = toRefs(props)
    const { emit } = context
    const { pattern, errorMessage, isFullDataValid, hydrationLoading, date, onInput, setPreviousState } = useDateInput({
      modelValue,
      minDate,
      maxDate,
      emit,
    })
    return { pattern, errorMessage, isFullDataValid, hydrationLoading, date, onInput, setPreviousState }
  },
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    minDate: {
      type: String,
      default: '0200-01-01',
    },
    maxDate: {
      type: String,
      default: '9999-12-31',
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
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  data(): DataInterface {
    return {
      calendarIcon,
    }
  },
})
</script>

<style lang="less" scoped>
.container {
}
</style>
