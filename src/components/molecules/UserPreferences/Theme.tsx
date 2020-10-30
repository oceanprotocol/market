import React, { ReactElement } from 'react'
import { DarkMode } from 'use-dark-mode'
import Input from '../../atoms/Input'

const options = ['Light', 'Dark']

export default function Theme({
  darkMode
}: {
  darkMode: DarkMode
}): ReactElement {
  const value = darkMode.value === true ? 'Dark' : 'Light'

  return (
    <li>
      <Input
        name="theme"
        label="Theme"
        help="Defaults to your OS settings, select a theme to override."
        type="select"
        options={options}
        value={value}
        onChange={() => darkMode.toggle()}
        small
      />
    </li>
  )
}
