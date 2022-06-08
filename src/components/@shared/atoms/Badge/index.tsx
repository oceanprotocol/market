import React, { ReactElement, ReactNode } from 'react'
import styles from './index.module.css'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export interface BadgeProps {
  label: string | ReactNode
  className?: string
}

export default function Badge({ label, className }: BadgeProps): ReactElement {
  const styleClasses = cx({
    badge: true,
    [className]: className
  })

  return <span className={styleClasses}>{label}</span>
}
