import React, { ReactElement, ReactNode } from 'react'
import styles from './index.module.css'
import Title from './Title'

export default function PoolSection({
  title,
  tooltip,
  titlePostfix,
  titlePostfixTitle,
  children,
  highlight,
  className
}: {
  title?: string
  children: ReactNode
  tooltip?: string
  titlePostfix?: string
  titlePostfixTitle?: string
  highlight?: boolean
  className?: string
}): ReactElement {
  return (
    <div
      className={`${styles.section} ${highlight ? styles.highlight : ''} ${
        className || ''
      }`}
    >
      {title && (
        <Title
          title={title}
          tooltip={tooltip}
          titlePostfix={titlePostfix}
          titlePostfixTitle={titlePostfixTitle}
        />
      )}
      <div className={styles.grid}>{children}</div>
    </div>
  )
}
