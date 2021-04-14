import React, { ChangeEvent, useState } from 'react'
import Dotdotdot from 'react-dotdotdot'
import classNames from 'classnames/bind'
import { ReactComponent as External } from '../../../images/external.svg'
import styles from './BoxSelection.module.css'
import Loader from '../../atoms/Loader'

const cx = classNames.bind(styles)

export interface BoxSelectionValues {
  name: string
  checked: boolean
  icon: JSX.Element
}

export default function BoxSelection({
  values,
  multiple,
  fieldsName,
  disabled,
  ...props
}: {
  values: BoxSelectionValues[]
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
      {!values ? (
        <Loader />
      ) : (
        values.map((value: BoxSelectionValues, key: number) => (
          <div
            className={`${styles.boxSelection} ${
              value.checked ? styles.selected : ''
            }`}
            key={key}
          >
            <input
              id={value.name}
              name={multiple ? value.name : fieldsName}
              type={multiple ? 'checkbox' : 'radio'}
              className={styleClassesInput}
              defaultChecked={value.checked}
              {...props}
              disabled={disabled}
              value={value.name}
            />
            <label
              className={styles.label}
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
          </div>
        ))
      )}
    </div>
  )
}
