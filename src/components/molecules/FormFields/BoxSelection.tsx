import React, { ChangeEvent } from 'react'
import classNames from 'classnames/bind'
import styles from './BoxSelection.module.css'
import Loader from '../../atoms/Loader'

const cx = classNames.bind(styles)

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
  const styleClassesInput = cx({
    input: true,
    [styles.radio]: true
  })

  return (
    <div
      className={`${styles.boxSelectionsWrapper} ${
        disabled ? styles.disabled : ''
      }`}
    >
      {!options ? (
        <Loader />
      ) : (
        options.map((value: BoxSelectionOption) => (
          <>
            <input
              id={value.name}
              type="radio"
              className={styleClassesInput}
              defaultChecked={value.checked}
              onChange={(event) => handleChange(event)}
              {...props}
              disabled={disabled}
              value={value.name}
              name={name}
            />
            <label
              className={`${styles.boxSelection} ${styles.label}`}
              htmlFor={value.name}
              title={value.name}
            >
              {value.icon}
              <span className={styles.title}>{value.title}</span>
              {value.text}
            </label>
          </>
        ))
      )}
    </div>
  )
}
