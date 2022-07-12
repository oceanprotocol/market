import React, { ReactElement } from 'react'
import Link from 'next/link'
import loadable from '@loadable/component'
import Badge from '@shared/atoms/Badge'
import Logo from '@shared/atoms/Logo'
import UserPreferences from './UserPreferences'
import Networks from './UserPreferences/Networks'
import SearchBar from './SearchBar'
import styles from './Menu.module.css'
import { useRouter } from 'next/router'
import { useMarketMetadata } from '@context/MarketMetadata'
import Tooltip from '@shared/atoms/Tooltip'
import Caret from '@images/caret.svg'
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
  const { appConfig, siteContent } = useMarketMetadata()

  return (
    <nav className={styles.menu}>
      <Link href="/">
        <a className={styles.logo}>
          <Logo noWordmark />
          <h1 className={styles.title}>{siteContent?.siteTitle}</h1>
        </a>
      </Link>

      <Tooltip
        className={styles.badgeWrap}
        content={
          <div className={styles.versions}>
            <a className={styles.link} href={appConfig.v3MarketUri}>
              v3
            </a>
            <a className={styles.link} href="" aria-current aria-disabled>
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
              v4 <Caret aria-hidden="true" className={styles.caret} />
            </>
          }
        />
      </Tooltip>

      <ul className={styles.navigation}>
        {siteContent?.menu.map((item: MenuItem) => (
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
