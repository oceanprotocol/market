import React from 'react'
import Layout from '../../Layout'
import styles from './Transactions.module.css'
import Web3Feedback from '../molecules/Web3Feedback'
import ConsumedList from '../organisms/ConsumedList'
import PublishedList from '../organisms/PublishedList'
import JobsList from '../organisms/JobsList'

const title = 'Transactions'
const description = 'Find the data sets and jobs that you previously accessed'

const sections = [
  {
    title: 'Published',
    component: <PublishedList />
  },
  {
    title: 'Downloaded',
    component: <ConsumedList />
  },
  {
    title: 'Compute Jobs',
    component: <JobsList />
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

const TransactionsPage: React.FC = () => {
  return (
    <Layout title={title} description={description}>
      <article className={styles.grid}>
        <div>
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
    </Layout>
  )
}

export default TransactionsPage
