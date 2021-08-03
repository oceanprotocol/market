import React, { ReactElement } from 'react'
import { useUserPreferences } from '../../../providers/UserPreferences'
import Input from '../../atoms/Input'

export default function Debug(): ReactElement {
  const { debug, setDebug } = useUserPreferences()

  return (
    <li>
      <Input
        label="Debug"
        help="Show geeky information in some places, and in your console."
        name="debug"
        type="checkbox"
        options={['Activate Debug Mode']}
        defaultChecked={debug === true}
        onChange={() => setDebug(!debug)}
      />
    </li>
  )
}
