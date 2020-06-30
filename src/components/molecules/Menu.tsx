import React from 'react'
import { Link } from 'gatsby'
import { useLocation } from '@reach/router'
import styles from './Menu.module.css'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'

declare type MenuItem = {
  name: string
  link: string
}

function MenuLink({ item }: { item: MenuItem }) {
  const location = useLocation()

  const classes =
    location && location.pathname === item.link
      ? `${styles.link} ${styles.active}`
      : styles.link

  return (
    <Link key={item.name} to={item.link} className={classes}>
      {item.name}
    </Link>
  )
}

export default function Menu() {
  const { menu } = useSiteMetadata()

  return (
    <nav className={styles.menu}>
      {menu.map((item: MenuItem) => (
        <MenuLink key={item.name} item={item} />
      ))}
    </nav>
  )
}
