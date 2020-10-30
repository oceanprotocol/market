import React, { ReactElement } from 'react'
import { useUserPreferences } from '../../../providers/UserPreferences'
import FormHelp from '../../atoms/Input/Help'
import InputElement from '../../atoms/Input/InputElement'

export default function Debug(): ReactElement {
  const { debug, setDebug } = useUserPreferences()

  return (
    <li>
      <InputElement
        name="debug"
        type="checkbox"
        options={['Debug Mode']}
        defaultChecked={debug === true}
        onChange={() => setDebug(!debug)}
      />
      <FormHelp>
        Show geeky information in some places, and in your console.
      </FormHelp>
    </li>
  )
}
