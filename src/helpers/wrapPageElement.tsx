import React, { ReactElement } from 'react'
import Styles from '../global/Styles'

const wrapPageElement = ({
  element
}: {
  element: ReactElement
}): ReactElement => <Styles>{element}</Styles>

export default wrapPageElement
