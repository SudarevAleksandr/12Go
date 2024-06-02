<template>
  <div class="container">
    <!--Hello-->
    <!--<Input :value="dateValue" clearable @input="onInput" placeholder="value" />
    <Input v-model="date" clearable placeholder="v-model" />-->
    <DateInput v-model="date2" clearable disabled label="Date2" minDate="1800-01-01" maxDate="2500-01-01" />
    Output: {{ date }}
    <br />
    <br />
    <DateInput v-model="date" clearable label="Date" minDate="1800-01-01" maxDate="2500-01-01" />
    Output: {{ date }}
    <br />
    <br />
    <Input v-model="test" clearable />
  </div>
</template>

<script lang="ts">
import DateInput from '@/components/atoms/dateInput/DateInput.vue'
import Input from '@/components/atoms/input/Input.vue'
import type { InputEvent, InputValue } from '@/components/atoms/input/Input.types'
import { defineComponent } from 'vue'

interface DataInterface {
  date: InputValue
  date2: InputValue
  test: InputValue
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
      test: '12',
      date2: '2024-14-03',
      date: null,
    }
  },
  computed: {},
  mounted() {},
  unmounted() {},
  watch: {
    date(val) {
      console.log('watch date>>>', val)
    },
  },
  methods: {
    //onInput(e: InputEvent) {
    //  this.dateValue = e?.target.value || null
    //},
  },
})
</script>

<style lang="less" scoped>
.container {
  padding: 30px;
}
</style>
