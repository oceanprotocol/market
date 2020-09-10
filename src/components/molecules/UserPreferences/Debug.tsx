import React, { ReactElement } from 'react'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Input from '../../atoms/Input'

export default function Debug(): ReactElement {
  const { debug, setDebug } = useUserPreferences()

  return (
    <li>
      <Input
        name="debug"
        label="Debug Mode"
        help="Show geeky debug information in some places."
        type="checkbox"
        options={['Activate Debug Mode']}
        defaultChecked={debug === true}
        onChange={() => setDebug(!debug)}
      />
    </li>
  )
}
