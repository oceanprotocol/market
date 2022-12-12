import { createTheme } from '@uiw/codemirror-themes'
import { javascript } from '@codemirror/lang-javascript'
import { tags as t } from '@lezer/highlight'

export const oceanTheme = (marketTheme: any) => {
  return createTheme({
    theme: marketTheme,
    settings: {
      background: 'var(--background-content)',
      foreground: 'var(--font-color-text)',
      selection: 'var(--background-highlight)',
      lineHighlight: 'transparent',
      gutterBackground: 'var(--background-body)',
      gutterForeground: 'var(--font-color-text)'
    },
    styles: []
  })
}
export const extensions = [javascript({ jsx: true })]
