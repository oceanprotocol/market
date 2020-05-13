import React from 'react'
import Link from 'next/link'
import Menu from '../molecules/Menu'
import styles from './Header.module.css'
import { title } from '../../../site.config'
import Logo from '@oceanprotocol/art/logo/logo.svg'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/">
          <a className={styles.logoUnit}>
            <Logo />
            <h1 className={styles.title}>{title}</h1>
          </a>
        </Link>

        <Menu />
      </div>
    </header>
  )
}
