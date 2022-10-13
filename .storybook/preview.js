import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../src/stylesGlobal/styles.css'
import { ThemeProvider } from 'styled-components'
import { useDarkMode } from 'storybook-dark-mode'
import addons from '@storybook/addons'

export const globalSetup = {
  theme: {
    name: 'Ocean Market',
    description: 'Global theme for Ocean Market',
    defaultValue: 'light'
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /date$/
    }
  }
}

const channel = addons.getChannel()

channel.on('DARK_MODE', (isDark) => {
  if (isDark) {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
})

const themeSelection = (mode) => {
  return {
    mode: mode,
    ...globalSetup
  }
}

const withThemeProvider = (Story, context) => {
  const mode = useDarkMode() ? 'dark' : 'light'
  const currentTheme = themeSelection(mode)

  return (
    <ThemeProvider theme={currentTheme}>
      <Story {...context} />
    </ThemeProvider>
  )
}
export const decorators = [withThemeProvider]
