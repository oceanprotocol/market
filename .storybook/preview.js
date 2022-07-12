import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../src/stylesGlobal/styles.css'

export const parameters = {
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
