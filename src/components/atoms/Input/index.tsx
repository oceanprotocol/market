import React, { FormEvent, ChangeEvent, ReactElement } from 'react'
import InputElement from './InputElement'
import Help from './Help'
import Label from './Label'
import styles from './index.module.css'
import { ErrorMessage } from 'formik'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export interface InputProps {
  name: string
  label?: string
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
  disabled?: boolean
  field?: any
  form?: any
}

export default function Input(props: Partial<InputProps>): ReactElement {
  const { required, name, label, help, additionalComponent, field } = props

  const hasError =
    props.form.touched[field.name] &&
    typeof props.form.errors[field.name] === 'string'

  const styleClasses = cx({
    field: true,
    hasError: hasError
  })

  return (
    <div
      className={styleClasses}
      data-is-submitting={props.form && props.form.isSubmitting ? true : null}
    >
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <InputElement {...field} {...props} />

      {field && (
        <div className={styles.error}>
          <ErrorMessage name={field.name} />
        </div>
      )}

      {help && <Help>{help}</Help>}
      {additionalComponent && additionalComponent}
    </div>
  )
}
