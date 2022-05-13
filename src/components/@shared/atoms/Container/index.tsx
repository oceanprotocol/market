import React, { ReactElement, ReactNode } from 'react'
import classNames from 'classnames/bind'
import styles from './index.module.css'

const cx = classNames.bind(styles)

export interface ContainerProps {
  children: ReactNode
  narrow?: boolean
  className?: string
}

export default function Container({
  children,
  narrow,
  className
}: ContainerProps): ReactElement {
  const styleClasses = cx({
    container: true,
    narrow,
    [className]: className
  })

  return <div className={styleClasses}>{children}</div>
}
