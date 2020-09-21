import React, { ReactElement } from 'react'
import slugify from '@sindresorhus/slugify'
import styles from './InputElement.module.css'
import { InputProps } from '.'
import FilesInput from '../../molecules/FormFields/FilesInput'
import Terms from '../../molecules/FormFields/Terms'
import Price from '../../molecules/FormFields/Price'

const DefaultInput = ({ small, ...props }: InputProps) => (
  <input
    className={`${styles.input} ${small ? styles.small : null}`}
    id={props.name}
    {...props}
  />
)

export default function InputElement({
  type,
  options,
  name,
  prefix,
  postfix,
  small,
  field,
  label,
  help,
  form,
  additionalComponent,
  ...props
}: InputProps): ReactElement {
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
      return (
        <textarea name={name} id={name} className={styles.input} {...props} />
      )
    case 'radio':
    case 'checkbox':
      return (
        <div className={styles.radioGroup}>
          {options &&
            options.map((option: string, index: number) => (
              <div className={styles.radioWrap} key={index}>
                <input
                  className={styles[type]}
                  id={slugify(option)}
                  type={type}
                  name={name}
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
      return <FilesInput name={name} {...field} {...props} />
    case 'price':
      return <Price name={name} {...field} {...props} />
    case 'terms':
      return <Terms name={name} options={options} {...field} {...props} />
    default:
      return prefix || postfix ? (
        <div className={`${prefix ? styles.prefixGroup : styles.postfixGroup}`}>
          {prefix && (
            <div className={`${styles.prefix} ${small ? styles.small : ''}`}>
              {prefix}
            </div>
          )}
          <DefaultInput
            name={name}
            type={type || 'text'}
            small={small}
            {...props}
          />
          {postfix && (
            <div className={`${styles.postfix} ${small ? styles.small : ''}`}>
              {postfix}
            </div>
          )}
        </div>
      ) : (
        <DefaultInput
          name={name}
          type={type || 'text'}
          small={small}
          {...props}
        />
      )
  }
}
