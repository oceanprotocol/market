import React, { ChangeEvent } from 'react'
import Dotdotdot from 'react-dotdotdot'
import classNames from 'classnames/bind'
import styles from './BoxSelection.module.css'
import Loader from '../../atoms/Loader'

const cx = classNames.bind(styles)

export interface BoxSelectionOption {
  name: string
  checked: boolean
  tag?: JSX.Element | string
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
              {typeof value.tag === 'string' ? (
                <Dotdotdot clamp={1} tagName="span">
                  {value.tag}
                </Dotdotdot>
              ) : (
                value.tag
              )}
              <span className={typeof value.tag === 'string' && styles.title}>
                <Dotdotdot clamp={1} tagName="span">
                  {value.name}
                </Dotdotdot>
              </span>
            </label>
          </>
        ))
      )}
    </div>
  )
}
