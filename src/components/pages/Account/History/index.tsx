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

const tabs = [
  {
    title: 'Published',
    content: <PublishedList />
  },
  {
    title: 'Pool Shares',
    content: <PoolShares />
  },
  {
    title: 'Pool Transactions',
    content: <PoolTransactions />
  },
  {
    title: 'Downloads',
    content: <Downloads />
  },
  {
    title: 'Compute Jobs',
    content: (
      <OceanProvider>
        <ComputeJobs />
      </OceanProvider>
    )
  }
]

export default function HistoryPage(): ReactElement {
  const { chainIds } = useUserPreferences()
  const url = new URL(window.location.href)
  const defaultTab = url.searchParams.get('defaultTab')
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
