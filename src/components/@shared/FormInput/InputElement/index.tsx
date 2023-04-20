import React, { ReactElement } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import styles from './index.module.css'
import { InputProps } from '..'
import FilesInput from './FilesInput'
import CustomProvider from './Provider'
import BoxSelection, { BoxSelectionOption } from './BoxSelection'
import Datatoken from './Datatoken'
import classNames from 'classnames/bind'
import AssetSelection, { AssetSelectionAsset } from './AssetSelection'
import Nft from './Nft'
import InputRadio from './Radio'
import ContainerInput from '@shared/FormInput/InputElement/ContainerInput'
import TagsAutoComplete from './TagsAutoComplete'
import TabsFile from '@shared/atoms/TabsFile'
import useDarkMode from '@oceanprotocol/use-dark-mode'
import appConfig from '../../../../../app.config'
import { extensions, oceanTheme } from '@utils/codemirror'

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
  const darkMode = useDarkMode(false, appConfig?.darkModeConfig)

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
    case 'tabs': {
      const tabs: any = []
      props.fields.map((field: any, i) => {
        return tabs.push({
          title: field.title,
          field,
          props,
          content: (
            <FilesInput
              key={`fileInput_${i}`}
              {...field}
              form={form}
              {...props}
            />
          )
        })
      })

      return (
        <TabsFile
          items={tabs}
          key={`tabFile_${props.name}`}
          className={styles.pricing}
        />
      )
    }

    case 'codeeditor':
      return (
        <CodeMirror
          id={props.name}
          className={styles.codemirror}
          value={`${props.value ? props.value : ''}`}
          height="200px"
          placeholder={props.placeholder}
          theme={oceanTheme(darkMode ? 'dark' : 'light', props)}
          extensions={[extensions]}
          onChange={(value) => {
            form.setFieldValue(`${props.name}`, value)
          }}
        />
      )

    case 'textarea':
      return <textarea id={props.name} className={styles.textarea} {...props} />

    case 'radio':
    case 'checkbox':
      return (
        <InputRadio options={options as string[]} inputSize={size} {...props} />
      )

    case 'assetSelection':
      return (
        <AssetSelection
          assets={options as AssetSelectionAsset[]}
          {...field}
          {...props}
        />
      )

    case 'assetSelectionMultiple':
      return (
        <AssetSelection
          assets={options as AssetSelectionAsset[]}
          multiple
          {...field}
          {...props}
        />
      )
    case 'files':
      return <FilesInput {...field} form={form} {...props} />
    case 'container':
      return <ContainerInput {...field} {...props} />
    case 'providerUrl':
      return <CustomProvider {...field} {...props} />
    case 'nft':
      return <Nft {...field} {...props} />
    case 'datatoken':
      return <Datatoken {...field} {...props} />
    case 'boxSelection':
      return (
        <BoxSelection
          options={options as BoxSelectionOption[]}
          {...field}
          {...props}
        />
      )
    case 'tags':
      return <TagsAutoComplete {...field} {...props} />
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
