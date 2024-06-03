export interface UseDateInput {
  modelValue: Ref<string>
  minDate: Ref<string>
  maxDate: Ref<string>
  emit: (event: string, ...args: any[]) => void
}
