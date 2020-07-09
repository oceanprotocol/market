import React, { ReactElement, ReactNode } from 'react'
import styles from './Container.module.css'

export default function Container({
  children,
  narrow,
  className
}: {
  children: ReactNode
  narrow?: boolean
  className?: string
}): ReactElement {
  return (
    <div
      className={`${styles.container} ${narrow && styles.narrow} ${
        className && className
      }`}
    >
      {children}
    </div>
  )
}
