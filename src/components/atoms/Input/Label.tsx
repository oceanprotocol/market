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
    className={`${styles.label} ${required && styles.required}`}
    title={required ? 'Required' : ''}
    {...props}
  >
    {children}
  </label>
)

export default Label
