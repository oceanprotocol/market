import React, { ReactElement } from 'react'
import Link from 'next/link'
import loadable from '@loadable/component'
import { useSiteMetadata } from '@hooks/useSiteMetadata'
import Badge from '@shared/atoms/Badge'
import Logo from '@shared/atoms/Logo'
import UserPreferences from './UserPreferences'
import Networks from './UserPreferences/Networks'
import SearchBar from './SearchBar'
import styles from './Menu.module.css'
import { useRouter } from 'next/router'

const Wallet = loadable(() => import('./Wallet'))

declare type MenuItem = {
  name: string
  link: string
}

function MenuLink({ item }: { item: MenuItem }) {
  const router = useRouter()

  const classes =
    router?.pathname === item.link
      ? `${styles.link} ${styles.active}`
      : styles.link

  return (
    <Link key={item.name} href={item.link}>
      <a className={classes}>{item.name}</a>
    </Link>
  )
}

export default function Menu(): ReactElement {
  const { menu, siteTitle } = useSiteMetadata()

  return (
    <nav className={styles.menu}>
      <Link href="/">
        <a className={styles.logo}>
          <Logo noWordmark />
          <h1 className={styles.title}>
            {siteTitle} <Badge label="v4" />
          </h1>
        </a>
      </Link>

      <ul className={styles.navigation}>
        {menu.map((item: MenuItem) => (
          <li key={item.name}>
            <MenuLink item={item} />
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <SearchBar />
        <Networks />
        <Wallet />
        <UserPreferences />
      </div>
    </nav>
  )
}
