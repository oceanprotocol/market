import React from 'react'
import styles from './Label.module.css'

const Label = ({
  required,
  children,
  ...props
}: {
  required?: boolean
  children: string
  htmlFor: string
}) => (
  <label
    className={required ? styles.required : styles.label}
    title={required ? 'Required' : ''}
    {...props}
  >
    {children}
  </label>
)

export default Label
