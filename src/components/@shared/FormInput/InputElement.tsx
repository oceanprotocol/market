import React, { ReactElement } from 'react'
import styles from './InputElement.module.css'
import { InputProps } from '.'
import FilesInput from '../FormFields/FilesInput'
import CustomProvider from '../FormFields/Provider'
import BoxSelection, { BoxSelectionOption } from '../FormFields/BoxSelection'
import Datatoken from '../FormFields/Datatoken'
import classNames from 'classnames/bind'
import AssetSelection, {
  AssetSelectionAsset
} from '../FormFields/AssetSelection'
import Nft from '../FormFields/Nft'
import InputRadio from './InputRadio'

const cx = classNames.bind(styles)

const DefaultInput = ({
  size,
  className,
  // We filter out all props which are not allowed
  // to be passed to HTML input so these stay unused.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  prefix,
  postfix,
  additionalComponent,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...props
}: InputProps) => (
  <input
    className={cx({ input: true, [size]: size, [className]: className })}
    id={props.name}
    {...props}
  />
)

export default function InputElement({
  options,
  sortOptions,
  prefix,
  postfix,
  size,
  field,
  multiple,
  // We filter out all props which are not allowed
  // to be passed to HTML input so these stay unused.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  label,
  help,
  prominentHelp,
  form,
  additionalComponent,
  disclaimer,
  disclaimerValues,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  ...props
}: InputProps): ReactElement {
  const styleClasses = cx({ select: true, [size]: size })
  switch (props.type) {
    case 'select': {
      const sortedOptions =
        !sortOptions && sortOptions === false
          ? options
          : (options as string[]).sort((a: string, b: string) =>
              a.localeCompare(b)
            )
      return (
        <select
          id={props.name}
          className={styleClasses}
          {...props}
          multiple={multiple}
        >
          {field !== undefined && field.value === '' && <option value="" />}
          {sortedOptions &&
            (sortedOptions as string[]).map((option: string, index: number) => (
              <option key={index} value={option}>
                {option} {postfix}
              </option>
            ))}
        </select>
      )
    }
    case 'textarea':
      return <textarea id={props.name} className={styles.textarea} {...props} />

    case 'radio':
    case 'checkbox':
      return <InputRadio options={options} inputSize={size} {...props} />

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
          {...field}
          {...props}
        />
      )
    case 'files':
      return <FilesInput {...field} {...props} />
    case 'providerUrl':
      return <CustomProvider {...field} {...props} />
    case 'nft':
      return <Nft {...field} {...props} />
    case 'datatoken':
      return <Datatoken {...field} {...props} />
    case 'boxSelection':
      return (
        <BoxSelection
          options={options as unknown as BoxSelectionOption[]}
          {...field}
          {...props}
        />
      )
    default:
      return prefix || postfix ? (
        <div className={`${prefix ? styles.prefixGroup : styles.postfixGroup}`}>
          {prefix && (
            <div className={cx({ prefix: true, [size]: size })}>{prefix}</div>
          )}
          <DefaultInput
            type={props.type || 'text'}
            size={size}
            {...field}
            {...props}
          />
          {postfix && (
            <div className={cx({ postfix: true, [size]: size })}>{postfix}</div>
          )}
        </div>
      ) : (
        <DefaultInput
          type={props.type || 'text'}
          size={size}
          {...field}
          {...props}
        />
      )
  }
}
