import React, { ChangeEvent } from 'react'
import classNames from 'classnames/bind'
import Loader from '@shared/atoms/Loader'
import styles from './index.module.css'

const cx = classNames.bind(styles)

export interface BoxSelectionOption {
  name: string
  value?: string
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
        options.map((option: BoxSelectionOption) => (
          <div key={option.name}>
            <input
              id={option.name}
              defaultChecked={option.checked}
              onChange={(event) => handleChange(event)}
              {...props}
              type="radio"
              className={styleClassesInput}
              disabled={disabled}
              value={option.value ? option.value : option.name}
              name={name}
            />
            <label
              className={`${styles.boxSelection} ${styles.label}`}
              htmlFor={option.name}
              title={option.name}
            >
              {option.icon}
              <span className={styles.title}>{option.title}</span>
              {option.text}
            </label>
          </div>
        ))
      )}
    </div>
  )
}
