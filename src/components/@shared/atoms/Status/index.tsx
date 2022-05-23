import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import styles from './index.module.css'

export interface StatusProps {
  state?: string
  className?: string
}

const cx = classNames.bind(styles)

export default function Status({
  state,
  className
}: StatusProps): ReactElement {
  const styleClasses = cx({
    status: true,
    warning: state === 'warning',
    error: state === 'error',
    [className]: className
  })

  return <i className={styleClasses} />
}
