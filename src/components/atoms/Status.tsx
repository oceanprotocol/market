import React, { ReactElement } from 'react'
import { status, warning, error } from './Status.module.css'

export default function Status({
  state,
  className
}: {
  state?: string
  className?: string
}): ReactElement {
  const styleClasses = `${status} ${state === 'warning' && warning} ${
    state === 'error' && error
  } ${className}`

  return <i className={styleClasses} />
}
