<template>
  <div class="index_page_container">
    <h4 class="title">Disabled input</h4>
    <DateInput v-model="dateDisabled" class="input" clearable disabled label="Date" />
    <div class="output_block">Output: {{ dateDisabled }}</div>

    <h4 class="title">Limiting dates from 1800-01-01 to 2200-01-01</h4>
    <DateInput v-model="date" class="input" clearable label="Date" minDate="1800-01-01" maxDate="2200-01-01" />
    <div class="output_block">Output: {{ date }}</div>

    <h4 class="title">Unlimited Date from 0200-01-01</h4>
    <DateInput v-model="dateUnlimited" class="input" clearable label="Date" />
    <div class="output_block">Output: {{ dateUnlimited }}</div>
  </div>
</template>

<script lang="ts">
import DateInput from '@/components/atoms/dateInput/DateInput.vue'
import Input from '@/components/atoms/input/Input.vue'
import type { InputValue } from '@/components/atoms/input/Input.types'
import { defineComponent } from 'vue'

interface DataInterface {
  dateDisabled: InputValue
  date: InputValue
  dateUnlimited: InputValue
}

export default defineComponent({
  name: 'index',
  components: { Input, DateInput },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
  },
  data(): DataInterface {
    return {
      dateDisabled: '2024-10-03',
      date: null,
      dateUnlimited: null,
    }
  },
})
</script>

<style lang="less" scoped>
.index_page_container {
  padding: 40px 40px;
  @media (max-width: 768px) {
    padding-right: 16px;
    padding-left: 16px;
  }
}
.title {
  margin-bottom: 16px;
}
.input {
  margin-bottom: 16px;
}
.output_block {
  margin-bottom: 48px;
  color: #949494;
}
</style>
