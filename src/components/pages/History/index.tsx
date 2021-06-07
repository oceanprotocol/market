import React, { ReactElement } from 'react'
import Tabs from '../../atoms/Tabs'
import PoolShares from './PoolShares'
import PoolTransactions from '../../molecules/PoolTransactions'
import PublishedList from './PublishedList'
import Downloads from './Downloads'
import ComputeJobs from './ComputeJobs'
import styles from './index.module.css'

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
export default function HistoryPage({
  selected
}: {
  selected?: number
}): ReactElement {
  return (
    <article className={styles.content}>
      <Tabs items={tabs} className={styles.tabs} selected={selected} />
    </article>
  )
}
