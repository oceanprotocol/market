import { PageProps } from 'gatsby'
import React, { ReactElement } from 'react'
import App from '.'

// Gatsby-specific, referenced in gatsby-browser.js & gatsby-ssr.js
const wrapPageElement = ({
  element,
  props
}: {
  element: ReactElement
  props: PageProps
}): ReactElement => <App {...props}>{element}</App>

export default wrapPageElement
