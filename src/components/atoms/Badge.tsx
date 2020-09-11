import React, { ReactElement } from 'react'
import styles from './Badge.module.css'

export default function Badge({
  label,
  className
}: {
  label: string
  className?: string
}): ReactElement {
  return <span className={`${styles.badge} ${className}`}>{label}</span>
}
