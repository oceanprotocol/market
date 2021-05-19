import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import * as styles from './Status.module.css'

const cx = classNames.bind(styles)

export default function Status({
  state,
  className
}: {
  state?: string
  className?: string
}): ReactElement {
  const styleClasses = cx({
    status: true,
    warning: state === 'warning',
    error: state === 'error',
    [className]: className
  })

  return <i className={styleClasses} />
}
