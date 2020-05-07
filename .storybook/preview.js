import React from 'react'
import { addDecorator } from '@storybook/react'
import WebFont from 'webfontloader'

WebFont.load({
  google: {
    families: ['Montserrat:400,400i,600']
  }
})

// Import global css with custom properties once for all stories.
// Needed because in Next.js we impoprt that file only once too,
// in src/_app.tsx which does not get loaded by Storybook
import '../src/styles/global.css'

// Wrapper for all stories previews
addDecorator(storyFn => (
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
