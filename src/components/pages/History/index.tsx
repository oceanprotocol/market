import React, { ReactElement, ReactNode } from 'react'
import ComputeJobs from './ComputeJobs'
import styles from './index.module.css'
import PoolShares from './PoolShares'
import PoolTransactions from '../../molecules/PoolTransactions'
import PublishedList from './PublishedList'
import Downloads from './Downloads'

const sections = [
  {
    title: 'Published',
    component: <PublishedList />
  },
  {
    title: 'Pool Shares',
    component: <PoolShares />
  },
  {
    title: 'Pool Transactions',
    component: <PoolTransactions />
  },
  {
    title: 'Downloads',
    component: <Downloads />
  },
  {
    title: 'Compute Jobs',
    component: <ComputeJobs />
  }
]

const Section = ({
  title,
  component
}: {
  title: string
  component: ReactNode
}) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {component}
    </div>
  )
}

export default function HistoryPage(): ReactElement {
  return (
    <article className={styles.content}>
      {sections.map((section) => {
        const { title, component } = section
        return <Section key={title} title={title} component={component} />
      })}
    </article>
  )
}
