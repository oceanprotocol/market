import React, { ReactElement } from 'react'
import slugify from '@sindresorhus/slugify'
import { InputProps } from './index'
import FilesInput from '../../molecules/FormFields/FilesInput'
import Terms from '../../molecules/FormFields/Terms'
import BoxSelection, {
  BoxSelectionOption
} from '../../molecules/FormFields/BoxSelection'
import Datatoken from '../../molecules/FormFields/Datatoken'
import AssetSelection, {
  AssetSelectionAsset
} from '../../molecules/FormFields/AssetSelection'
import {
  input,
  select,
  textarea,
  radioGroup,
  radioWrap,
  radioLabel,
  prefixGroup,
  postfixGroup,
  prefix as prefixStyle,
  postfix as postfixStyle
} from './InputElement.module.css'

const DefaultInput = ({
  size,
  className,
  prefix,
  postfix,
  additionalComponent,
  ...props
}: InputProps) => (
  <input
    className={`${input} ${size} ${className}`}
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
  multiple,
  disabled,
  help,
  form,
  additionalComponent,
  ...props
}: InputProps): ReactElement {
  switch (type) {
    case 'select': {
      const sortedOptions =
        !sortOptions && sortOptions === false
          ? options
          : options.sort((a: string, b: string) => a.localeCompare(b))

      return (
        <select
          id={name}
          className={`${select} ${size}`}
          {...props}
          multiple={multiple}
        >
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
      return <textarea name={name} id={name} className={textarea} {...props} />
    case 'radio':
    case 'checkbox':
      return (
        <div className={radioGroup}>
          {options &&
            options.map((option: string, index: number) => (
              <div className={radioWrap} key={index}>
                <input
                  className={`${type}`}
                  id={slugify(option)}
                  type={type}
                  name={name}
                  defaultChecked={props.defaultChecked}
                  {...props}
                />
                <label className={radioLabel} htmlFor={slugify(option)}>
                  {option}
                </label>
              </div>
            ))}
        </div>
      )
    case 'assetSelection':
      return (
        <AssetSelection
          assets={options as unknown as AssetSelectionAsset[]}
          {...field}
          {...props}
        />
      )
    case 'assetSelectionMultiple':
      return (
        <AssetSelection
          assets={options as unknown as AssetSelectionAsset[]}
          multiple
          disabled={disabled}
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
    case 'boxSelection':
      return (
        <BoxSelection
          name={name}
          options={options as unknown as BoxSelectionOption[]}
          {...field}
          {...props}
        />
      )
    default:
      return prefix || postfix ? (
        <div className={`${prefix ? prefixGroup : postfixGroup}`}>
          {prefix && <div className={`${prefixStyle} ${size}`}>{prefix}</div>}
          <DefaultInput
            name={name}
            type={type || 'text'}
            size={size}
            disabled={disabled}
            {...props}
          />
          {postfix && (
            <div className={`${postfixStyle} ${size}`}>{postfix}</div>
          )}
        </div>
      ) : (
        <DefaultInput
          name={name}
          type={type || 'text'}
          size={size}
          disabled={disabled}
          {...props}
        />
      )
  }
}
