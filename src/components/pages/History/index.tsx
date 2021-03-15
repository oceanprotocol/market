import React, { ReactElement } from 'react'
import ComputeJobs from './ComputeJobs'
import styles from './index.module.css'
import PoolShares from './PoolShares'
import PoolTransactions from '../../molecules/PoolTransactions'
import PublishedList from './PublishedList'
import Downloads from './Downloads'
import Tabs from '../../atoms/Tabs'

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
    content: <ComputeJobs />
  }
]

export default function HistoryPage(): ReactElement {
  return (
    <article className={styles.content}>
      <Tabs items={tabs} className={styles.tabs} />
    </article>
  )
}
