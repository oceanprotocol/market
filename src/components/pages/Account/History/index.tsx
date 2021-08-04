import React, { ReactElement } from 'react'
import Tabs from '../../../atoms/Tabs'
import PoolShares from './PoolShares'
import PoolTransactions from '../../../molecules/PoolTransactions'
import PublishedList from './PublishedList'
import Downloads from './Downloads'
import ComputeJobs from './ComputeJobs'
import styles from './index.module.css'
import { useUserPreferences } from '../../../../providers/UserPreferences'
import OceanProvider from '../../../../providers/Ocean'
import { useWeb3 } from '../../../../providers/Web3'

interface HistoryTab {
  title: string
  content: JSX.Element
}

function getTabs(accountIdentifier: string): HistoryTab[] {
  const { accountId } = useWeb3()
  const defaultTabs: HistoryTab[] = [
    {
      title: 'Published',
      content: <PublishedList accountId={accountIdentifier} />
    },
    {
      title: 'Pool Shares',
      content: <PoolShares accountId={accountIdentifier} />
    },
    {
      title: 'Pool Transactions',
      content: <PoolTransactions accountId={accountIdentifier} />
    },
    {
      title: 'Downloads',
      content: <Downloads accountId={accountIdentifier} />
    }
  ]
  const computeTab: HistoryTab = {
    title: 'Compute Jobs',
    content: (
      <OceanProvider>
        <ComputeJobs />
      </OceanProvider>
    )
  }
  if (accountIdentifier === accountId) {
    defaultTabs.push(computeTab)
  }
  return defaultTabs
}

export default function HistoryPage({
  accountId
}: {
  accountId: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const url = new URL(window.location.href)
  const defaultTab = url.searchParams.get('defaultTab')
  const tabs = getTabs(accountId)
  let defaultTabIndex = 0
  defaultTab === 'ComputeJobs' ? (defaultTabIndex = 4) : (defaultTabIndex = 0)
  return (
    <article className={styles.content}>
      <Tabs
        items={tabs}
        className={styles.tabs}
        defaultIndex={defaultTabIndex}
      />
    </article>
  )
}
