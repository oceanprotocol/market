import React, { FormEvent, ChangeEvent, ReactElement } from 'react'
import InputElement from './InputElement'
import Help from './Help'
import Label from './Label'
import styles from './index.module.css'
import { ErrorMessage } from 'formik'

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
  field?: {
    name: string
    value: string
    onChange: () => void
    onBlur: () => void
  }
}

export default function Input(props: Partial<InputProps>): ReactElement {
  const { required, name, label, help, additionalComponent, field } = props

  return (
    <div className={styles.field}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <InputElement {...field} {...props} />

      <div className={styles.error}>
        <ErrorMessage name={field.name} />
      </div>

      {help && <Help>{help}</Help>}
      {additionalComponent && additionalComponent}
    </div>
  )
}
