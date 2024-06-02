export function pick<T extends object, K extends keyof T>(obj: T, props: K[]): Pick<T, K> {
  return props.reduce(
    (result, prop) => {
      if (prop in obj) result[prop] = obj[prop]
      return result
    },
    {} as Pick<T, K>,
  )
}

export function removeCharAfterPosition(string: string, position: number, regexp: RegExp): string {
  for (let i = position; i < string.length; i++) {
    if (regexp.test(string[i])) return string.slice(0, i) + string.slice(i + 1)
  }
  return string
}

export function replaceFirstDigitAfterPosition(string: string, position: number, char: string): string {
  for (let i = position; i < string.length; i++) {
    if (/\d/.test(string[i])) return string.slice(0, i) + char + string.slice(i + 1)
  }
  return string
}

export function insertCharAfterPosition(string: string, position: number, char: string) {
  if (string.length <= position) return string
  return string.slice(0, position) + char + string.slice(position)
}

interface NumericMaskInterface {
  string: string
  pattern: string
  selectionEnd?: number | null
  previousSelectionStart?: number
  previousSelectionEnd?: number
  previousString?: string
  isDeletion?: boolean
  numericalSigns?: string[]
}

export const numericMask = ({
  string,
  pattern,
  selectionEnd = 0,
  previousSelectionStart = 0,
  previousSelectionEnd = 0,
  previousString = '',
  isDeletion = false,
  numericalSigns = ['*'],
}: NumericMaskInterface): {
  maskString: string
  updatedSelectionEnd: number
} => {
  selectionEnd = selectionEnd || 0
  let i = 0
  let maskString = ''

  //const regex = selectionEnd < string.length ? /[0-9\s]/ : /\d/
  const regex = /[0-9\s]/
  const isInsert = previousSelectionStart !== previousSelectionEnd
  const isEdit = selectionEnd < string.length
  const isDigitKeyPressed = regex.test(string[selectionEnd - 1])
  const isDigitInPattern = numericalSigns.includes(pattern[selectionEnd])
  const deletedCharCount = previousString.length - string.length

  if (isEdit && !isDeletion && isDigitKeyPressed && !isInsert)
    string = removeCharAfterPosition(string, selectionEnd, regex)

  if (isEdit && isDeletion && isInsert) {
    //console.log('string >>>', string)
    //console.log('selectionEnd >>>', selectionEnd)
    //console.log('deletedCharCount >>>', deletedCharCount)
    for (let i = selectionEnd; i < selectionEnd + deletedCharCount; i++) {
      const char = numericalSigns.includes(pattern[i]) ? ' ' : pattern[i]
      string = insertCharAfterPosition(string, i, char)
    }
    //string = insertCharAfterPosition(string, selectionEnd, ' '.repeat(deletedCharCount))
    //console.log('string >>>', string)
  }

  if (isEdit && isDeletion && !isInsert && isDigitInPattern)
    string = replaceFirstDigitAfterPosition(previousString, selectionEnd, ' ')
  //console.log('string2 >>>', string)
  //console.log('numericalSigns >>>', numericalSigns)
  while (string.length > 0) {
    if (!pattern[i]) break

    if (numericalSigns.includes(pattern[i])) {
      if (regex.test(string[0])) {
        maskString += string[0]
        i++
      } else if (i < selectionEnd) selectionEnd--
      string = string.slice(1)
      continue
    }

    if (pattern[i] === string[0]) {
      string = string.slice(1)
    } else {
      if (i < selectionEnd) selectionEnd++
    }

    maskString += pattern[i]
    i++
  }
  return { maskString, updatedSelectionEnd: selectionEnd }
}
