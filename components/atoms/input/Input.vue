<template>
  <div :class="{ disabled }" class="input_container">
    <div v-if="label" class="label">
      {{ label }}
    </div>
    <div class="input_section" :class="{ confirmed }">
      <div v-if="leftIcon" class="icon_container">
        <img :src="leftIcon" />
      </div>
      <input v-if="value === undefined" v-model="localModelValue" ref="input" class="html_input" v-bind="inputAttrs" />
      <input v-else :value="value" :disabled="disabled" ref="input" class="html_input" v-bind="inputAttrs" />
      <div v-if="isClearIconShow" class="icon_container clear_icon" @click="onClear" data-is-clear-btn="true">
        <img src="@/assets/icon/cross.svg" data-is-clear-btn="true" />
      </div>
      <div v-if="rightIcon" class="icon_container">
        <img :src="rightIcon" />
      </div>
      <LineLoader class="loader" :show="loading" />
    </div>
    <div :class="{ isErrorMessageOpen }" class="error_container">
      <div class="error_container_wrap">
        <div class="error_message">
          {{ localErrorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { pick } from '@/helpers/methods'
import { defineComponent, type InputHTMLAttributes } from 'vue'
import LineLoader from '@/components/atoms/lineLoader/LineLoader.vue'
import type { InputValue, InputErrorMessage } from '@/components/atoms/input/Input.types'

export default defineComponent({
  name: 'Input',
  components: { LineLoader },
  props: {
    modelValue: {
      type: String as PropType<InputValue>,
      required: false,
    },
    value: {
      type: String as PropType<InputValue>,
      required: false,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    rightIcon: {
      type: String,
      default: null,
    },
    leftIcon: {
      type: String,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String as PropType<InputErrorMessage>,
      default: null,
    },
  },
  data() {
    return {
      isErrorMessageOpen: false,
      localErrorMessage: null,
    }
  },
  computed: {
    localModelValue: {
      get() {
        return this.modelValue
      },
      set(value: string) {
        this.$emit('update:modelValue', value)
      },
    },
    inputAttrs() {
      return pick(this.$attrs, [
        'type',
        'name',
        'onUpdate:modelValue',
        'placeholder',
        'disabled',
        'readonly',
        'required',
        'autofocus',
        'autocomplete',
        'form',
        'formaction',
        'inputmode',
        'list',
        'maxlength',
        'multiple',
        'accept',
      ]) as InputHTMLAttributes
    },
    isClearIconShow() {
      return this.clearable && (this.modelValue || this.value) && !this.disabled
    },
  },
  mounted() {},
  unmounted() {},
  watch: {
    errorMessage(val) {
      if (val) this.localErrorMessage = val
      this.isErrorMessageOpen = !!val
    },
  },
  methods: {
    onClear() {
      if (this.$attrs.onInput) this.$emit('input', null)
      if (this.$attrs.onChange) this.$emit('change', null)
      if (this.modelValue) this.$emit('update:modelValue', null)
    },
  },
})
</script>

<style lang="less" scoped>
.input_container {
  position: relative;
  font-size: 16px;
  &.disabled {
    user-select: none;
    .input_section {
      box-shadow: inset 0 0 0 1px #cbcbcb;
      &.confirmed {
        box-shadow: inset 0 0 0 2px #cfffcf;
      }
    }
    .html_input {
      color: #a1a1a1;
      opacity: 0.4;
      user-select: none;
    }
    .icon_container {
      opacity: 0.4;
    }
    .label {
      color: #a1a1a1;
    }
  }
}
.input_section {
  position: relative;
  height: 50px;
  box-shadow: inset 0 0 0 1px #a1a1a1;
  border-radius: 4px;
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 0 8px;
  background: white;
  overflow: hidden;
  &.confirmed {
    box-shadow: inset 0 0 0 2px #4db84d;
  }
}
.html_input {
  flex: 1;
  height: 100%;
  min-width: 50px;
  background: none;
  border: none;
  box-shadow: none;
  outline: none;
  font-size: 18px;
}
.icon_container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 24px;
  min-width: 24px;
  overflow: hidden;
}
.clear_icon {
  cursor: pointer;
}
.error_container {
  overflow: hidden;
  display: grid;
  grid-template-rows: 0fr;
  transition:
    grid-template-rows 200ms ease-in-out,
    opacity 300ms ease-in-out;
  opacity: 0;
  &.isErrorMessageOpen {
    grid-template-rows: 1fr;
    opacity: 1;
  }
}
.error_container_wrap {
  min-height: 0;
}
.error_message {
  font-size: 12px;
  padding: 2px 10px;
  color: red;
  background: white;
  border-radius: 4px;
  margin-top: 2px;
}
.loader {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.label {
  position: absolute;
  padding: 2px 4px;
  border-radius: 4px;
  background: #ffffff;
  font-size: 12px;
  font-weight: 600;
  left: 5px;
  top: -8px;
  z-index: 5;
  white-space: nowrap;
  overflow: hidden;
  max-width: calc(100% - 12px);
  text-overflow: ellipsis;
}
</style>
