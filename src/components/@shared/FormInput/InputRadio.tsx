import React, { InputHTMLAttributes, ReactElement } from 'react'
import slugify from 'slugify'
import classNames from 'classnames/bind'
import styles from './InputRadio.module.css'

const cx = classNames.bind(styles)

interface InputRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  options: string[]
  inputSize?: string
}

export default function InputRadio({
  options,
  inputSize,
  ...props
}: InputRadioProps): ReactElement {
  return (
    <div className={styles.radioGroup}>
      {options &&
        (options as string[]).map((option: string, index: number) => (
          <div className={styles.radioWrap} key={index}>
            <input
              {...props}
              className={styles[props.type]}
              id={slugify(option)}
            />
            <label
              className={cx({
                [styles.radioLabel]: true,
                [inputSize]: inputSize
              })}
              htmlFor={slugify(option)}
            >
              {option}
            </label>
          </div>
        ))}
    </div>
  )
}
