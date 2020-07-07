import React, { ReactElement } from 'react'
import { Link } from 'gatsby'
import Menu from '../molecules/Menu'
import styles from './Header.module.css'
import { ReactComponent as Logo } from '@oceanprotocol/art/logo/logo.svg'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'

export default function Header(): ReactElement {
  const { siteTitle } = useSiteMetadata()

  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link to="/" className={styles.logoUnit}>
          <Logo />
          <h1 className={styles.title}>{siteTitle}</h1>
        </Link>

        <Menu />
      </div>
    </header>
  )
}
