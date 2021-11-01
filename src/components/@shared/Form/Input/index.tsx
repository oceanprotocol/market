import React, {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useState
} from 'react'
import InputElement from './InputElement'
import Label from './Label'
import styles from './index.module.css'
import { ErrorMessage, FieldInputProps, FieldMetaProps, useField } from 'formik'
import classNames from 'classnames/bind'
import Disclaimer from './Disclaimer'
import Tooltip from '@shared/atoms/Tooltip'
import Markdown from '@shared/Markdown'
import MetadataFields from 'src/components/Publish/Metadata'
import toPath from 'lodash/toPath'

const cx = classNames.bind(styles)

export interface InputProps {
  name: string
  label?: string | ReactNode
  placeholder?: string
  required?: boolean
  help?: string
  tag?: string
  type?: string
  options?: string[]
  sortOptions?: boolean
  additionalComponent?: ReactElement
  value?: string
  onChange?(
    e:
      | FormEvent<HTMLInputElement>
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLTextAreaElement>
  ): void
  onKeyPress?(
    e:
      | KeyboardEvent<HTMLInputElement>
      | KeyboardEvent<HTMLInputElement>
      | KeyboardEvent<HTMLSelectElement>
      | KeyboardEvent<HTMLTextAreaElement>
  ): void
  rows?: number
  multiple?: boolean
  pattern?: string
  min?: string
  max?: string
  disabled?: boolean
  readOnly?: boolean
  field?: FieldInputProps<any>
  form?: any
  prefix?: string | ReactElement
  postfix?: string | ReactElement
  step?: string
  defaultChecked?: boolean
  size?: 'mini' | 'small' | 'large' | 'default'
  className?: string
  checked?: boolean
  disclaimer?: string
  disclaimerValues?: string[]
}

export default function Input(props: Partial<InputProps>): ReactElement {
  const {
    label,
    help,
    additionalComponent,
    size,
    form,
    field,
    disclaimer,
    disclaimerValues
  } = props

  const isFormikField = typeof field !== 'undefined'
  const isNestedField = field?.name?.includes('.')

  // TODO: this feels hacky as it assumes nested `values` store. But we can't use the
  // `useField()` hook in here to get `meta.error` so we have to match against form?.errors?
  // handling flat and nested data at same time.
  const parsedFieldName =
    isFormikField && (isNestedField ? field?.name.split('.') : [field?.name])
  // const hasFormikError = !!meta?.touched && !!meta?.error
  const hasFormikError =
    form?.errors !== {} &&
    form?.touched?.[parsedFieldName[0]]?.[parsedFieldName[1]] &&
    form?.errors?.[parsedFieldName[0]]?.[parsedFieldName[1]]

  const styleClasses = cx({
    field: true,
    hasError: hasFormikError
  })

  const [disclaimerVisible, setDisclaimerVisible] = useState(true)

  useEffect(() => {
    if (!isFormikField) return

    if (disclaimer && disclaimerValues) {
      setDisclaimerVisible(
        disclaimerValues.includes(
          props.form?.values[parsedFieldName[0]]?.[parsedFieldName[1]]
        )
      )
    }
  }, [isFormikField, props.form?.values])

  return (
    <div className={styleClasses}>
      <Label htmlFor={props.name} required={props.required}>
        {label} {help && <Tooltip content={<Markdown text={help} />} />}
      </Label>
      <InputElement size={size} {...field} {...props} />

      {isFormikField && hasFormikError && (
        <div className={styles.error}>
          <ErrorMessage name={field.name} />
        </div>
      )}

      {/* {help && <Help>{help}</Help>} */}

      {disclaimer && (
        <Disclaimer visible={disclaimerVisible}>{disclaimer}</Disclaimer>
      )}
      {additionalComponent && additionalComponent}
    </div>
  )
}
