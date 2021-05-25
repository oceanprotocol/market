import React, { ChangeEvent } from 'react'
import Loader from '../../atoms/Loader'
import {
  radio,
  boxSelectionsWrapper,
  boxSelection,
  title,
  disabled as disabledStyle
} from './BoxSelection.module.css'

export interface BoxSelectionOption {
  name: string
  checked: boolean
  title: JSX.Element | string
  icon?: JSX.Element
  text?: JSX.Element | string
}

export default function BoxSelection({
  name,
  options,
  disabled,
  handleChange,
  ...props
}: {
  name: string
  options: BoxSelectionOption[]
  disabled?: boolean
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void
}): JSX.Element {
  return (
    <div className={`${boxSelectionsWrapper} ${disabled && disabledStyle}`}>
      {!options ? (
        <Loader />
      ) : (
        options.map((value: BoxSelectionOption) => (
          <div key={value.name}>
            <input
              id={value.name}
              type="radio"
              className={radio}
              defaultChecked={value.checked}
              onChange={(event) => handleChange(event)}
              {...props}
              disabled={disabled}
              value={value.name}
              name={name}
            />
            <label
              className={boxSelection}
              htmlFor={value.name}
              title={value.name}
            >
              {value.icon}
              <span className={title}>{value.title}</span>
              {value.text}
            </label>
          </div>
        ))
      )}
    </div>
  )
}
