import React, { ReactElement, ReactNode } from 'react'
import * as styles from './Label.module.css'

const Label = ({
  required,
  children,
  ...props
}: {
  required?: boolean
  children: ReactNode
  htmlFor: string
}): ReactElement => (
  <label
    className={`${styles.label} ${required && styles.required}`}
    title={required ? 'Required' : ''}
    {...props}
  >
    {children}
  </label>
)

export default Label
