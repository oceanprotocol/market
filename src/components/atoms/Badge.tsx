import React, { ReactElement } from 'react'
import { badge } from './Badge.module.css'

export default function Badge({
  label,
  className
}: {
  label: string
  className?: string
}): ReactElement {
  return <span className={`${badge} ${className}`}>{label}</span>
}
