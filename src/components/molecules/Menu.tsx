import React, { ReactElement } from 'react'
import { Link } from 'gatsby'
import { useLocation } from '@reach/router'
import loadable from '@loadable/component'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import Container from '../atoms/Container'
import Badge from '../atoms/Badge'
import Logo from '../atoms/Logo'
import UserPreferences from './UserPreferences'
import {
  link as linkStyle,
  active,
  menu as menuStyle,
  logoUnit,
  title,
  navigation
} from './Menu.module.css'

const Wallet = loadable(() => import('./Wallet'))

declare type MenuItem = {
  name: string
  link: string
}

function MenuLink({ item }: { item: MenuItem }) {
  const location = useLocation()

  const classes =
    location?.pathname === item.link ? `${linkStyle} ${active}` : linkStyle

  return (
    <Link key={item.name} to={item.link} className={classes}>
      {item.name}
    </Link>
  )
}

export default function Menu(): ReactElement {
  const { menu, siteTitle } = useSiteMetadata()

  return (
    <nav className={menuStyle}>
      <Container>
        <Link to="/" className={logoUnit}>
          <Logo />
          <h1 className={title}>
            {siteTitle} <Badge label="beta" />
          </h1>
        </Link>

        <ul className={navigation}>
          {menu.map((item: MenuItem) => (
            <li key={item.name}>
              <MenuLink item={item} />
            </li>
          ))}
          <li>
            <Wallet />
          </li>
          <li>
            <UserPreferences />
          </li>
        </ul>
      </Container>
    </nav>
  )
}
