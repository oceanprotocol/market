import React from 'react'
import { addDecorator } from '@storybook/react'

// Import global css with custom properties once for all stories.
import '../src/global/styles.css'

// Wrapper for all stories previews
addDecorator((storyFn) => (
  <div
    style={{
      minHeight: '100vh',
      width: '100%',
      padding: '2rem'
    }}
  >
    {storyFn()}
  </div>
))

// Gatsby's Link overrides:
// Gatsby defines a global called ___loader to prevent its method calls from creating console errors you override it here
global.___loader = {
  enqueue: () => {},
  hovering: () => {}
}

// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = ''
global.__BASE_PATH__ = ''

// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = (pathname) => {
  action('NavigateTo:')(pathname)
}
