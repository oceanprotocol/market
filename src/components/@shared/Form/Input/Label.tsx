import React, { ReactElement, ReactNode } from 'react'
import styles from './Label.module.css'

const Label = ({
  children,
  ...props
}: {
  children: ReactNode
  htmlFor: string
}): ReactElement => (
  <label className={styles.label} {...props}>
    {children}
  </label>
)

export default Label
