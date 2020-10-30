import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { DarkMode } from 'use-dark-mode'
import Input from '../../atoms/Input'

const options = ['Light', 'Dark']

export default function Theme({
  darkMode
}: {
  darkMode: DarkMode
}): ReactElement {
  const initialValue = darkMode.value ? options[2] : options[1]
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    switch (value) {
      case 'Light':
        darkMode.disable()
        return
      case 'Dark':
        darkMode.enable()
    }
  }, [value, darkMode])

  return (
    <li>
      <Input
        name="theme"
        label="Theme"
        help="Select your preferred theme."
        type="select"
        options={options}
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
          setValue(e.target.value)
        }
        small
      />
    </li>
  )
}
