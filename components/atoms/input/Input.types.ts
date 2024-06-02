interface HTMLInputEvent extends Event {
  target: HTMLInputElement
}

export type InputEvent = HTMLInputEvent | null
export type InputValue = string | null
export type InputErrorMessage = string | null
