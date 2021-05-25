import React, { ReactElement, ReactNode } from 'react'
import { label, required as requiredStyle } from './Label.module.css'

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
    className={`${label} ${required && requiredStyle}`}
    title={required ? 'Required' : ''}
    {...props}
  >
    {children}
  </label>
)

export default Label
