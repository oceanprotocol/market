import { PageProps } from 'gatsby'
import React, { ReactElement } from 'react'
import App from './App'

const wrapPageElement = ({
  element,
  props
}: {
  element: ReactElement
  props: PageProps
}): ReactElement => <App {...props}>{element}</App>

export default wrapPageElement
