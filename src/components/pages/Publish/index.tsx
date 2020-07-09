import React, { ReactElement } from 'react'
import PublishForm from './PublishForm'
import styles from './index.module.css'
import Web3Feedback from '../../molecules/Wallet/Feedback'

export default function PublishPage({
  content
}: {
  content: any
}): ReactElement {
  return (
    <article className={styles.grid}>
      <PublishForm content={content.form} />
      <aside>
        <div className={styles.sticky}>
          <Web3Feedback />
        </div>
      </aside>
    </article>
  )
}
