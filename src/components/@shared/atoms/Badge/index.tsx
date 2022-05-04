import React, { ReactElement } from 'react'
import styles from './Badge.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function Badge({
  label,
  className
}: {
  label: string
  className?: string
}): ReactElement {
  const styleClasses = cx({
    badge: true,
    [className]: className
  })

  return <span className={styleClasses}>{label}</span>
}
