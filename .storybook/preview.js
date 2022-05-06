import '@oceanprotocol/typographies/css/ocean-typo.css'
import '../src/stylesGlobal/styles.css'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}
