import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import styles from './PageHeader.module.css'
import Markdown from '@shared/Markdown'

const cx = classNames.bind(styles)

export default function PageHeader({
  title,
  description,
  center
}: {
  title: ReactElement
  description?: string
  center?: boolean
}): ReactElement {
  const styleClasses = cx({
    header: true,
    center
  })

  return (
    <header className={styleClasses}>
      <h1 className={styles.title}>{title}</h1>
      {description && (
        <Markdown text={description} className={styles.description} />
      )}
    </header>
  )
}
