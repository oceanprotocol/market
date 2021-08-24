import React, { ReactElement } from 'react'
import classNames from 'classnames/bind'
import styles from './PageHeader.module.css'
import Logo from '../atoms/Logo'
import { Link } from 'gatsby'

const cx = classNames.bind(styles)

export default function PageHeader({
  title,
  description,
  center,
  powered
}: {
  title: string
  description?: string
  center?: boolean
  powered?: boolean
}): ReactElement {
  const styleClasses = cx({
    header: true,
    center: center
  })

  return (
    <header className={styleClasses}>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
      {powered && (
        <>
          <p className={styles.powered}>Powered by</p>
          <a href="https://oceanprotocol.com" target="_blank" rel="noreferrer">
            <Logo />
          </a>
        </>
      )}
    </header>
  )
}
