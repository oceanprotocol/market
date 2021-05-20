import React, { ReactElement, ChangeEvent } from 'react'
import { DarkMode } from 'use-dark-mode'
import FormHelp from '../../atoms/Input/Help'
import Label from '../../atoms/Input/Label'
import { ReactComponent as Moon } from '../../../images/moon.svg'
import { ReactComponent as Sun } from '../../../images/sun.svg'
import BoxSelection, { BoxSelectionOption } from '../FormFields/BoxSelection'
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
