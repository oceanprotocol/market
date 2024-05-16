import React, { ReactElement } from 'react'
import Tabs from '@shared/atoms/Tabs'
import PublishedList from './PublishedList'
import Downloads from './Downloads'
import styles from './index.module.css'

interface HistoryTab {
  title: string
  content: JSX.Element
}

function getTabs(accountId: string): HistoryTab[] {
  const defaultTabs: HistoryTab[] = [
    {
      title: 'Published',
      content: <PublishedList accountId={accountId} />
    },
    {
      title: 'Downloads',
      content: <Downloads accountId={accountId} />
    }
  ]
  return defaultTabs
}

export default function HistoryPage({
  accountIdentifier
}: {
  accountIdentifier: string
}): ReactElement {
  const tabs = getTabs(accountIdentifier)

  const defaultTabIndex = 0

  return (
    <Tabs items={tabs} className={styles.tabs} defaultIndex={defaultTabIndex} />
  )
}
