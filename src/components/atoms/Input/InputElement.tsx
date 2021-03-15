import React, { ReactElement } from 'react'
import slugify from '@sindresorhus/slugify'
import styles from './InputElement.module.css'
import { InputProps } from '.'
import FilesInput from '../../molecules/FormFields/FilesInput'
import Terms from '../../molecules/FormFields/Terms'
import Datatoken from '../../molecules/FormFields/Datatoken'
import classNames from 'classnames/bind'
import AssetSelection, {
  AssetSelectionAsset
} from '../../molecules/FormFields/AssetSelection'

const cx = classNames.bind(styles)

const DefaultInput = ({
  size,
  prefix,
  postfix,
  additionalComponent,
  ...props
}: InputProps) => (
  <input
    className={cx({ input: true, [size]: size })}
    id={props.name}
    {...props}
  />
)

export default function InputElement({
  type,
  options,
  sortOptions,
  name,
  prefix,
  postfix,
  size,
  field,
  label,
  help,
  form,
  additionalComponent,
  ...props
}: InputProps): ReactElement {
  const styleClasses = cx({ select: true, [size]: size })

  switch (type) {
    case 'select': {
      const sortedOptions =
        !sortOptions && sortOptions === false
          ? options
          : options.sort((a: string, b: string) => a.localeCompare(b))
      return (
        <select id={name} className={styleClasses} {...props}>
          {field !== undefined && field.value === '' && (
            <option value="">---</option>
          )}
          {sortedOptions &&
            sortedOptions.map((option: string, index: number) => (
              <option key={index} value={option}>
                {option} {postfix}
              </option>
            ))}
        </select>
      )
    }
    case 'textarea':
      return (
        <textarea
          name={name}
          id={name}
          className={styles.textarea}
          {...props}
        />
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
    case 'assetSelection':
      return (
        <AssetSelection
          assets={(options as unknown) as AssetSelectionAsset[]}
          {...field}
          {...props}
        />
      )
    case 'assetSelectionMultiple':
      return (
        <AssetSelection
          assets={(options as unknown) as AssetSelectionAsset[]}
          multiple
          {...field}
          {...props}
        />
      )
    case 'files':
      return <FilesInput name={name} {...field} {...props} />
    case 'datatoken':
      return <Datatoken name={name} {...field} {...props} />
    case 'terms':
      return <Terms name={name} options={options} {...field} {...props} />
    default:
      return prefix || postfix ? (
        <div className={`${prefix ? styles.prefixGroup : styles.postfixGroup}`}>
          {prefix && (
            <div className={cx({ prefix: true, [size]: size })}>{prefix}</div>
          )}
          <DefaultInput
            name={name}
            type={type || 'text'}
            size={size}
            {...props}
          />
          {postfix && (
            <div className={cx({ postfix: true, [size]: size })}>{postfix}</div>
          )}
        </div>
      ) : (
        <DefaultInput
          name={name}
          type={type || 'text'}
          size={size}
          {...props}
        />
      )
  }
}
