import React, { ReactElement } from 'react'
import { DarkMode } from 'use-dark-mode'
import Button from '../../atoms/Button'
import FormHelp from '../../atoms/Input/Help'
import Label from '../../atoms/Input/Label'
import styles from './Appearance.module.css'
import { ReactComponent as Moon } from '../../../images/moon.svg'
import { ReactComponent as Sun } from '../../../images/sun.svg'
import BoxSelection from '../FormFields/BoxSelection'

const buttons = ['Light', 'Dark']
const values = [
  { name: 'Light', checked: true, icon: <Sun /> },
  { name: 'Dark', checked: false, icon: <Moon /> }
]

export default function Appearance({
  darkMode
}: {
  darkMode: DarkMode
}): ReactElement {
  return (
    <li>
      <Label htmlFor="">Appearance</Label>
      <div className={styles.buttons}>
        {buttons.map((button) => {
          const isDark = button === 'Dark'
          const selected =
            (isDark && darkMode.value) || (!isDark && !darkMode.value)

          return (
            <Button
              key={button}
              className={`${styles.button} ${selected ? styles.selected : ''}`}
              size="small"
              style="text"
              onClick={() => (isDark ? darkMode.enable() : darkMode.disable())}
            >
              {isDark ? <Moon /> : <Sun />}
              {button}
            </Button>
          )
        })}
      </div>
      <BoxSelection values={values} fieldsName="appearanceMode" />
      <FormHelp>Defaults to your OS setting, select to override.</FormHelp>
    </li>
  )
}
