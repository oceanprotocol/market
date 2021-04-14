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
  icon: string
}

export default function BoxSelection({
  values,
  multiple,
  disabled,
  ...props
}: {
  values: BoxSelectionValues[]
  multiple?: boolean
  disabled?: boolean
}): JSX.Element {
  const styleClassesInput = cx({
    input: true,
    [styles.checkbox]: multiple,
    [styles.radio]: !multiple
  })

  return (
    <div className={`${styles.selection} ${disabled ? styles.disabled : ''}`}>
      <div className={styles.scroll}>
        {!values ? (
          <Loader />
        ) : (
          values.map((value: BoxSelectionValues, key: number) => (
            <div className={styles.row} key={key}>
              <input
                id={value.name}
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
                title={value.name}
              >
                <h3 className={styles.title}>
                  <Dotdotdot clamp={1} tagName="span">
                    {value.name}
                  </Dotdotdot>
                  <a
                    className={styles.link}
                    href={`/asset/${value.name}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <External />
                  </a>
                </h3>
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
