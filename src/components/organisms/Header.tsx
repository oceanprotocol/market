import React, { ReactElement, useState } from 'react'
import Menu from '../molecules/Menu'
import styles from './Header.module.css'
import AnnouncementBanner, {
  AnnouncementAction
} from '../molecules/AnnouncementBanner'

export default function Header(): ReactElement {
  const [text, setText] = useState<string>(
    'Ocean Market is [available on Polygon](https://oceanprotocol.com/technology/marketplaces).'
  )
  const [action, setAction] = useState<AnnouncementAction>({
    name: 'Add custom network',
    handleAction: () => {
      console.log('handle')
    }
  })
  return (
    <header className={styles.header}>
      <AnnouncementBanner text={text} action={action} />
      <Menu />
    </header>
  )
}
