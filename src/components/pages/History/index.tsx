import React, { ReactElement } from 'react'
import Tabs from '../../atoms/Tabs'
import PoolTransactions from '../../molecules/PoolTransactions'
import PublishedList from './PublishedList'
import Downloads from './Downloads'
import ComputeJobs from './ComputeJobs'
import PoolShares from './PoolShares'
import { content } from './index.module.css'

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
    <article className={content}>
      <Tabs items={tabs} />
    </article>
  )
}
