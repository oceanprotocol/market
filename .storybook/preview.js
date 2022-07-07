import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../src/stylesGlobal/styles.css'
import { ThemeProvider } from 'styled-components'

export const globalTypes = {
  theme: {
    name: 'Ocean Market',
    description: 'Global theme for Ocean Market',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: ['light', 'dark']
    }
  },
  backgrounds: {
    default: 'light',
    values: [
      { name: 'dark', value: 'rgb(10, 10, 10)' },
      { name: 'light', value: '#fcfcfc' }
    ]
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /date$/
    }
  }
}

const withThemeProvider = (Story, context) => {
  const theme = context.globals.theme

  var storyBody = document.getElementById('story-body')
  theme === 'dark'
    ? storyBody.classList.add('dark')
    : storyBody.classList.remove('dark')

  return (
    <ThemeProvider theme={globalTypes}>
      <Story {...context} />
    </ThemeProvider>
  )
}
export const decorators = [withThemeProvider]
