import React, { ReactElement } from 'react'
import slugify from '@sindresorhus/slugify'
import styles from './InputElement.module.css'
import { InputProps } from '.'
import FilesInput from '../../molecules/FormFields/FilesInput'
import Terms from '../../molecules/FormFields/Terms'
import Price from '../../molecules/FormFields/Price'

const DefaultInput = (props: InputProps) => (
  <input className={styles.input} id={props.name} {...props} />
)

export default function InputElement(props: InputProps): ReactElement {
  const { type, options, name, prefix, postfix, small, field } = props

  switch (type) {
    case 'select':
      return (
        <select
          id={name}
          className={`${styles.select} ${small && styles.selectSmall}`}
          {...props}
        >
          {field !== undefined && field.value === '' && (
            <option value="">---</option>
          )}
          {options &&
            options
              .sort((a: string, b: string) => a.localeCompare(b))
              .map((option: string, index: number) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
        </select>
      )
    case 'textarea':
      return <textarea id={name} className={styles.input} {...props} />
    case 'radio':
    case 'checkbox':
      return (
        <div className={styles.radioGroup}>
          {options &&
            options.map((option: string, index: number) => (
              <div className={styles.radioWrap} key={index}>
                <input
                  className={styles.radio}
                  id={slugify(option)}
                  type={type}
                  {...props}
                />
                <label className={styles.radioLabel} htmlFor={slugify(option)}>
                  {option}
                </label>
              </div>
            ))}
        </div>
      )
    case 'files':
      return <FilesInput {...props} />
    case 'price':
      return <Price {...props} />
    case 'terms':
      return <Terms {...props} />
    default:
      return prefix || postfix ? (
        <div className={`${prefix ? styles.prefixGroup : styles.postfixGroup}`}>
          {prefix && <div className={styles.prefix}>{prefix}</div>}
          <DefaultInput type={type || 'text'} {...props} />
          {postfix && <div className={styles.postfix}>{postfix}</div>}
        </div>
      ) : (
        <DefaultInput type={type || 'text'} {...props} />
      )
  }
}
