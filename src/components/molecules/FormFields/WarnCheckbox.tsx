import React, { ReactNode, FormEvent, ReactElement, ChangeEvent } from 'react'
import styles from './WarnCheckbox.module.css'

interface WarnCheckboxProps {
  name: string
  children: ReactNode
  checked?: boolean
  onClick?: (e: FormEvent) => void
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function WarnCheckbox({
  name,
  children,
  checked,
  ...props
}: WarnCheckboxProps): ReactElement {
  return (
    <>
      <input
        className={styles.checkbox}
        id={name}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={props.onChange}
      />
      <label className={styles.label} htmlFor={name}>
        {children}
      </label>
    </>
  )
}
