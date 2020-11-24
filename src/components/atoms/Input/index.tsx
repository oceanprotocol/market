import React, { FormEvent, ChangeEvent, ReactElement, ReactNode } from 'react'
import InputElement from './InputElement'
import Help from './Help'
import Label from './Label'
import styles from './index.module.css'
import { ErrorMessage, FieldInputProps } from 'formik'
import classNames from 'classnames/bind'
import { MetadataPublishForm } from '../../../@types/MetaData'

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
  values?: Partial<MetadataPublishForm>
}
export function mustBeHidden(
  values: Partial<MetadataPublishForm>,
  options: string[]
) {
  return (
    options &&
    options.length &&
    options[0] === 'neverused-code-67df661ee1bc9df3c2756f3172846914' &&
    values[options[1]] !== options[2]
  )
}

export default function Input(props: Partial<InputProps>): ReactElement {
  const {
    required,
    name,
    label,
    help,
    additionalComponent,
    size,
    field,
    values,
    options
  } = props

  const hasError =
    props.form?.touched[field.name] && props.form?.errors[field.name]

  const styleClasses = cx({
    field: true,
    hasError: hasError
  })

  if (mustBeHidden(values, options)) {
    return null
  }
  return (
    <div
      className={styleClasses}
      data-is-submitting={props.form?.isSubmitting ? true : null}
    >
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <InputElement size={size} {...field} {...props} />

      {field &&
        hasError &&
        (field.value !== Object(field.value) ? (
          <div className={styles.error}>
            <ErrorMessage name={field.name} />
          </div>
        ) : (
          <div className={styles.error}>
            {Object.keys(field.value).map((key) => (
              <div key={field.name + key}>
                {props.form?.errors[field.name][key]}
              </div>
            ))}
          </div>
        ))}

      {help && <Help>{help}</Help>}
      {additionalComponent && additionalComponent}
    </div>
  )
}
