import React, { FormEvent, ChangeEvent, ReactElement, ReactNode } from 'react'
import InputElement from './InputElement'
import Help from './Help'
import Label from './Label'
import styles from './index.module.css'
import { ErrorMessage } from 'formik'
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
  field?: any
  form?: any
  prefix?: string | ReactElement
  postfix?: string | ReactElement
  step?: string
  defaultChecked?: boolean
  small?: boolean
}

export default function Input(props: Partial<InputProps>): ReactElement {
  const {
    required,
    name,
    label,
    help,
    additionalComponent,
    small,
    field
  } = props

  const hasError =
    props.form?.touched[field.name] && props.form?.errors[field.name]

  const styleClasses = cx({
    field: true,
    hasError: hasError
  })

  return (
    <div
      className={styleClasses}
      data-is-submitting={props.form?.isSubmitting ? true : null}
    >
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <InputElement small={small} {...field} {...props} />

      {field && field.name !== 'price' && (
        <div className={styles.error}>
          <ErrorMessage name={field.name} />
        </div>
      )}

      {help && <Help>{help}</Help>}
      {additionalComponent && additionalComponent}
    </div>
  )
}
