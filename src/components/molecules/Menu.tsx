import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { menu } from '../../../site.config'
import styles from './Menu.module.css'

declare type MenuItem = {
  name: string
  link: string
}

function MenuLink({ item }: { item: MenuItem }) {
  const router = useRouter()
  const classes =
    router && router.pathname === item.link
      ? `${styles.link} ${styles.active}`
      : styles.link

  return (
    <Link key={item.name} href={item.link}>
      <a className={classes}>{item.name}</a>
    </Link>
  )
}

export default function Menu() {
  return (
    <nav className={styles.menu}>
      {menu.map((item: MenuItem) => (
        <MenuLink key={item.name} item={item} />
      ))}
    </nav>
  )
}
