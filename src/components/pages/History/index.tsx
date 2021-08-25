import React, { ReactElement } from 'react'
import Tabs from '../../atoms/Tabs'
import PoolShares from './PoolShares'
import PoolTransactions from '../../molecules/PoolTransactions'
import PublishedList from './PublishedList'
import Downloads from './Downloads'
import ComputeJobs from './ComputeJobs'
import styles from './index.module.css'
import { useUserPreferences } from '../../../providers/UserPreferences'
import OceanProvider from '../../../providers/Ocean'
import { useSiteMetadata } from '../../../hooks/useSiteMetadata'

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
  const { appConfig } = useSiteMetadata()
  const { allowDynamicPricing } = appConfig
  const url = new URL(window.location.href)
  const defaultTab = url.searchParams.get('defaultTab')

  const visualizedTabs =
    allowDynamicPricing === 'true'
      ? tabs
      : tabs.filter((e) => !e.title.toLowerCase().includes('pool'))

  let defaultTabIndex = 0
  defaultTab === 'ComputeJobs'
    ? (defaultTabIndex = visualizedTabs.findIndex(
        (e) => e.title === 'Compute Jobs'
      ))
    : (defaultTabIndex = 0)
  return (
    <article className={styles.content}>
      <Tabs
        items={visualizedTabs}
        className={styles.tabs}
        defaultIndex={defaultTabIndex}
      />
    </article>
  )
}
