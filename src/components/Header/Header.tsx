import React, { ReactElement } from 'react'
import Menu from './Menu'
import styles from './Header.module.css'

export default function Header(): ReactElement {
  return (
    <header className={styles.header}>
      <Menu />
    </header>
  )
}
