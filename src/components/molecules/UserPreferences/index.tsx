import React, { ReactElement } from 'react'
import Tooltip from '../../atoms/Tooltip'
import Preferences from './Preferences'

export default function UserPreferences(): ReactElement {
  return (
    <Tooltip content={<Preferences />} trigger="click focus">
      Settings
    </Tooltip>
  )
}
