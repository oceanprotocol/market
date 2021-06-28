import React, { FormEvent, ChangeEvent, ReactElement, ReactNode } from 'react'
import InputElement from './InputElement'
import Help from './Help'
import Label from './Label'
import styles from './index.module.css'
import { ErrorMessage, FieldInputProps } from 'formik'
import classNames from 'classnames/bind'

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
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLSelectElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
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
  divClassName?: string
}

export default function Input(props: Partial<InputProps>): ReactElement {
  const { label, help, additionalComponent, size, field } = props

  const hasError =
    props.form?.touched[field.name] && props.form?.errors[field.name]

  const styleClasses = cx(
    {
      field: true,
      hasError: hasError
    },
    props.divClassName
  )

  return (
    <div
      className={styleClasses}
      data-is-submitting={props.form?.isSubmitting ? true : null}
    >
      <Label htmlFor={props.name} required={props.required}>
        {label}
      </Label>
      <InputElement size={size} {...field} {...props} />

      {field && hasError && (
        <div className={styles.error}>
          <ErrorMessage name={field.name} />
        </div>
      )}

      {help && <Help>{help}</Help>}
      {additionalComponent && additionalComponent}
    </div>
  )
}
