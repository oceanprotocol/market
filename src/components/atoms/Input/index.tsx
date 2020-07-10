import React, { FormEvent, ChangeEvent, ReactElement } from 'react'
import InputElement from './InputElement'
import Help from './Help'
import Label from './Label'
import styles from './index.module.css'

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

export default function Input(props: InputProps): ReactElement {
  const {
    required,
    name,
    label,
    help,
    additionalComponent,
    field
  } = props as Partial<InputProps>

  return (
    <div className={styles.field}>
      <Label htmlFor={name} required={required}>
        {label}
      </Label>
      <InputElement {...field} {...props} />

      {help && <Help>{help}</Help>}
      {additionalComponent && additionalComponent}

      {/* TODO: Make field errors show up here */}
      {/* {meta && meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null} */}
    </div>
  )
}
