import React, { ReactElement } from 'react'
import Menu from '../molecules/Menu'
import styles from './Header.module.css'
import { useEwaiInstance } from '../../ewai/client/ewai-js'

export default function Header(): ReactElement {
  const ewaiInstance = useEwaiInstance()
  return (
    <header className={styles.header}>
      <Menu
        enforceMarketplacePublishRole={
          ewaiInstance.enforceMarketplacePublishRole
        }
      />
    </header>
  )
}
