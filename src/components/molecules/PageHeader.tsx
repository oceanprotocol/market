import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import styles from './PageHeader.module.css'
import Badge from '../atoms/Badge'

const cx = classNames.bind(styles)

export default function PageHeader({
  title,
  description,
  center
}: {
  title: string
  description?: string
  center?: boolean
}): ReactElement {
  const styleClasses = cx({
    header: true,
    center: center
  })

  return (
    <header className={styleClasses}>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  )
}
