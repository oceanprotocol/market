import React from 'react'
import PublishForm from '../molecules/PublishForm/PublishForm'
import styles from './Publish.module.css'
import Web3Feedback from '../molecules/Web3Feedback'

const PublishPage: React.FC = () => {
  return (
    <article className={styles.grid}>
      <PublishForm />
      <aside>
        <div className={styles.sticky}>
          <Web3Feedback />
        </div>
      </aside>
    </article>
  )
}
export default PublishPage
