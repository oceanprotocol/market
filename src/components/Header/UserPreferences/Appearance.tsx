import React, { ReactElement, ChangeEvent } from 'react'
import { DarkMode } from '@oceanprotocol/use-dark-mode'
import FormHelp from '@shared/FormInput/Help'
import Label from '@shared/FormInput/Label'
import Moon from '@images/moon.svg'
import Sun from '@images/sun.svg'
import BoxSelection, {
  BoxSelectionOption
} from '@shared/FormInput/InputElement/BoxSelection'
import styles from './Appearance.module.css'

export default function Appearance({
  darkMode
}: {
  darkMode: DarkMode
}): ReactElement {
  const options: BoxSelectionOption[] = [
    {
      name: 'Light',
      checked: !darkMode.value,
      title: 'Light',
      icon: <Sun />
    },
    {
      name: 'Dark',
      checked: darkMode.value,
      title: 'Dark',
      icon: <Moon />
    }
  ]

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.target.value === 'Dark' ? darkMode.enable() : darkMode.disable()
  }

  return (
    <li className={styles.appearances}>
      <Label htmlFor="">Appearance</Label>
      <BoxSelection
        options={options}
        name="appearanceMode"
        handleChange={handleChange}
      />
      <FormHelp>Defaults to your OS setting, select to override.</FormHelp>
    </li>
  )
}
