import React from 'react'
import Layout from '../../Layout'
import PublishForm from '../molecules/PublishForm/PublishForm'
import styles from './Publish.module.css'
import Web3Feedback from '../molecules/Web3Feedback'

const title = 'Publish Data'
const description = `Highlight the important features of your data set to make \
it more discoverable and catch the interest of data consumers.`

const PublishPage: React.FC = () => {
  return (
    <Layout title={title} description={description}>
      <article className={styles.grid}>
        <PublishForm />
        <aside>
          <div className={styles.sticky}>
            <Web3Feedback />
          </div>
        </aside>
      </article>
    </Layout>
  )
}
export default PublishPage
