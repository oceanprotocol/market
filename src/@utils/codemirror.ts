import { createTheme } from '@uiw/codemirror-themes'
import { json } from '@codemirror/lang-json'

export function checkJson(text: string) {
  try {
    JSON.parse(text)
    return true
  } catch (error) {
    return false
  }
}
declare type Theme = 'light' | 'dark'
export const oceanTheme = (marketTheme: Theme, field) => {
  let textColor = 'var(--font-color-text)'
  if (
    (field.name === 'files[0].abi' ||
      field.name === 'services[0].files[0].abi') &&
    !checkJson(field.value)
  ) {
    textColor = 'var(--brand-alert-red)'
  }

  return createTheme({
    theme: marketTheme,
    settings: {
      background: 'var(--background-content)',
      foreground: textColor,
      selection: 'var(--background-highlight)',
      lineHighlight: 'transparent',
      gutterBackground: 'var(--background-body)',
      gutterForeground: 'var(--font-color-text)'
    },
    styles: []
  })
}
export const extensions = [json()]
