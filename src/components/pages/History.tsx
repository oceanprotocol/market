import React, { ReactElement, ReactNode } from 'react'
import styles from './History.module.css'
import ConsumedList from '../organisms/ConsumedList'
import PublishedList from '../organisms/PublishedList'
import JobsList from '../organisms/JobsList'

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
    component: 'Coming Soon...'
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
