import React, { ReactElement } from 'react'
import App from './App'

const wrapPageElement = ({
  element
}: {
  element: ReactElement
}): ReactElement => <App>{element}</App>

export default wrapPageElement
