import { create } from '@storybook/theming'

export default create({
  // Theme
  base: 'light',

  // Colors
  colorPrimary: '#141414',
  colorSecondary: '#ff4092',

  // UI
  appBg: '#F6F9FC',
  appContentBg: '#FFFFFF',
  appBorderColor: 'rgba(0,0,0,.1)',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#333333',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#666666',

  // Toolbar default and active colors
  barTextColor: '#999999',
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: 'rgba(0,0,0,.3)',
  inputTextColor: '#333333',
  inputBorderRadius: 4,

  // Branding
  brandTitle: 'Ocean Protocol',
  brandUrl: 'https://oceanprotocol.com/',
  brandImage:
    'https://oceanprotocol.com/static/1286d9bd28e341567b0fdeeb810b9f8e/logo.png',
  brandTarget: '_self'
})
