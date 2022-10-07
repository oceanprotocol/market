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
      <div className="text-yellow-600 text-3xl font-bold underline pt-8 bg-orange-700">
        {title}
      </div>
      {description && (
        <Markdown text={description} className={styles.description} />
      )}
    </header>
  )
}
