import React, { ChangeEvent, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import classNames from 'classnames/bind'
import { ReactComponent as External } from '../../../images/external.svg'
import styles from './BoxSelection.module.css'
import Loader from '../../atoms/Loader'

const cx = classNames.bind(styles)

export interface BoxSelectionOption {
  name: string
  checked: boolean
  icon?: JSX.Element
}

export default function BoxSelection({
  name,
  options,
  multiple,
  fieldsName,
  disabled,
  ...props
}: {
  name: string
  options: BoxSelectionOption[]
  multiple?: boolean
  fieldsName?: string
  disabled?: boolean
}): JSX.Element {
  const styleClassesInput = cx({
    input: true,
    [styles.checkbox]: multiple,
    [styles.radio]: !multiple
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
        options.map((value: BoxSelectionOption, key: number) => (
          <>
            <input
              id={value.name}
              type={multiple ? 'checkbox' : 'radio'}
              className={styleClassesInput}
              defaultChecked={value.checked}
              {...props}
              disabled={disabled}
              value={value.name}
              name="test"
            />
            <label
              className={`${styles.boxSelection} ${styles.label}`}
              htmlFor={value.name}
              title={multiple ? value.name : fieldsName}
            >
              {value.icon}
              <span className={styles.title}>
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
