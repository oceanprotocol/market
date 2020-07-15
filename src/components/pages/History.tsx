import React from 'react'
import styles from './History.module.css'
import Web3Feedback from '../molecules/Wallet/Feedback'
import ConsumedList from '../organisms/ConsumedList'
import PublishedList from '../organisms/PublishedList'
import JobsList from '../organisms/JobsList'

const sections = [
  {
    title: 'Published',
    component: 'Coming Soon...'
  },
  {
    title: 'Downloaded',
    component: 'Coming Soon...'
  },
  {
    title: 'Compute Jobs',
    component: 'Coming Soon...'
  }
]

const Section = ({ title, component }: { title: string; component: any }) => {
  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {component}
    </div>
  )
}

const HistoryPage: React.FC = () => {
  return (
    <article className={styles.grid}>
      <div className={styles.content}>
        {sections.map((section) => {
          const { title, component } = section
          return <Section key={title} title={title} component={component} />
        })}
      </div>

      <aside>
        <div className={styles.sticky}>
          <Web3Feedback />
        </div>
      </aside>
    </article>
  )
}

export default HistoryPage
