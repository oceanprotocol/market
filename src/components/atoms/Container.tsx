import React, { ReactElement, ReactNode } from 'react'
import { container, narrow as narrowStyle } from './Container.module.css'

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
    <div className={`${container} ${narrow && narrowStyle} ${className}`}>
      {children}
    </div>
  )
}
