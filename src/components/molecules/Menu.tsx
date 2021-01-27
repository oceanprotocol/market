import React, { ReactElement, useEffect, useState } from 'react'
import { Link } from 'gatsby'
import { useLocation } from '@reach/router'
import loadable from '@loadable/component'
import styles from './Menu.module.css'
import { useSiteMetadata } from '../../hooks/useSiteMetadata'
import Container from '../atoms/Container'
import UserPreferences from './UserPreferences'
import Badge from '../atoms/Badge'
import Logo from '../atoms/Logo'
import { useOcean } from '@oceanprotocol/react'
import { EwaiClient } from '../../ewai/client/ewai-js'
import { bool } from 'yup'

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

interface MenuProps {
  enforceMarketplacePublishRole: boolean
}

// ewai removed beta below:
export default function Menu({
  enforceMarketplacePublishRole,
  ...props
}: MenuProps): ReactElement {
  const { menu, siteTitle } = useSiteMetadata()
  const { isInPurgatory, purgatoryData, account } = useOcean()
  const [showPublish, setShowPublish] = useState<boolean>(false)
  const [showEnrol, setShowEnrol] = useState<boolean>(false)
  const [showHistory, setShowHistory] = useState<boolean>(false)

  // Set menu options based on account and enforceRoles and user role found state:
  useEffect(() => {
    if (enforceMarketplacePublishRole && account) {
      const checkRoles = async () => {
        const ewaiClient = new EwaiClient({
          username: process.env.EWAI_API_USERNAME,
          password: process.env.EWAI_API_PASSWORD,
          graphQlUrl: process.env.EWAI_API_GRAPHQL_URL
        })
        const canPubResult = await ewaiClient.ewaiCanPublishAssetsOnMarketplaceAsync(
          account.getId()
        )
        const hasEwaiPublishRole = canPubResult.canPublish
        // Menu options change depending on EWAI user roles
        setShowPublish(hasEwaiPublishRole)
        setShowHistory(hasEwaiPublishRole)
      }
      checkRoles()
    } else {
      setShowPublish(account ? true : false)
      setShowHistory(account ? true : false)
    }
    setShowEnrol(account ? true : false)
  }, [account])

  return (
    <nav className={styles.menu}>
      <Container>
        <Link to="/" className={styles.logoUnit}>
          <Logo />
        </Link>

        <ul className={styles.navigation}>
          {
            // EWAI update, just adding links this way, so I can use conditional logic:
          }
          {showEnrol && (
            <li key="Enrol">
              <MenuLink item={{ name: 'Enrol', link: '/enrol' }} />
            </li>
          )}
          {showPublish && (
            <li key="Publish">
              <MenuLink item={{ name: 'Publish', link: '/publish' }} />
            </li>
          )}
          {showHistory && (
            <li key="History">
              <MenuLink item={{ name: 'History', link: '/history' }} />
            </li>
          )}
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
