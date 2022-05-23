import React, { ReactElement } from 'react'
import { Link } from 'gatsby'
import { useLocation } from '@reach/router'
import loadable from '@loadable/component'
import styles from './Menu.module.css'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import UserPreferences from './UserPreferences'
import Badge from '../atoms/Badge'
import Logo from '../atoms/Logo'
import Networks from './UserPreferences/Networks'
import SearchBar from './SearchBar'
import Tooltip from '../atoms/Tooltip'
import { ReactComponent as Caret } from '../../images/caret.svg'

const Wallet = loadable(() => import('./Wallet'))

declare type MenuItem = {
  name: string
  link: string
}

function MenuLink({ item }: { item: MenuItem }) {
  const location = useLocation()

  const classes =
    location?.pathname === item.link
      ? `${styles.link} ${styles.active}`
      : styles.link

  return (
    <Link key={item.name} to={item.link} className={classes}>
      {item.name}
    </Link>
  )
}

export default function Menu(): ReactElement {
  const { menu, siteTitle, appConfig } = useSiteMetadata()

  return (
    <nav className={styles.menu}>
      <Link to="/" className={styles.logo}>
        <Logo noWordmark />
        <h1 className={styles.title}>{siteTitle}</h1>
      </Link>
      <Tooltip
        className={styles.tooltip}
        content={
          <div className={styles.versions}>
            <a className={styles.link} href="" aria-disabled aria-current>
              v3
            </a>
            <a className={styles.link} href={appConfig.marketUrlV4}>
              v4
            </a>
          </div>
        }
        trigger="click focus"
        placement="bottom"
      >
        <Badge
          className={styles.badge}
          label={
            <>
              v3 <Caret aria-hidden="true" className={styles.caret} />
            </>
          }
        />
      </Tooltip>

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
