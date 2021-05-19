import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import * as styles from './Badge.module.css'

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
