import { createTheme } from '@uiw/codemirror-themes'
import { json } from '@codemirror/lang-json'

export const oceanTheme = (marketTheme: any, field) => {
  function checkJson(text: string) {
    text = typeof text !== 'string' ? JSON.stringify(text) : text
    try {
      JSON.parse(text)
      return true
    } catch (error) {
      return false
    }
  }

  let textColor = 'var(--font-color-text)'
  if (field.name === 'services[0].files[0].abi' && !checkJson(field.value)) {
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
