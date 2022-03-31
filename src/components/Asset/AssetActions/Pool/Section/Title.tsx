import Tooltip from '@shared/atoms/Tooltip'
import React from 'react'
import styles from './Title.module.css'

export default function Title({
  title,
  tooltip,
  titlePostfix,
  titlePostfixTitle
}: {
  title: string
  tooltip?: string
  titlePostfix?: string
  titlePostfixTitle?: string
}) {
  return (
    <h3 className={styles.title}>
      {title} {tooltip && <Tooltip content={tooltip} />}{' '}
      {titlePostfix && (
        <span className={styles.titlePostfix} title={titlePostfixTitle}>
          {titlePostfix}
        </span>
      )}
    </h3>
  )
}
