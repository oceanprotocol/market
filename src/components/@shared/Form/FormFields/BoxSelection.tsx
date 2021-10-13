import React, { ChangeEvent } from 'react'
import classNames from 'classnames/bind'
import Loader from '@shared/atoms/Loader'
import styles from './BoxSelection.module.css'

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
  const styleClassesWrapper = cx({
    boxSelectionsWrapper: true,
    [styles.disabled]: disabled
  })

  const styleClassesInput = cx({
    input: true,
    radio: true
  })

  return (
    <div className={styleClassesWrapper}>
      {!options ? (
        <Loader />
      ) : (
        options.map((value: BoxSelectionOption) => (
          <div key={value.name}>
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
          </div>
        ))
      )}
    </div>
  )
}
