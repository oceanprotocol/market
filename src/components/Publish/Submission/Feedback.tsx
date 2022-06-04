import { useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { FormPublishData } from '../_types'
import styles from './Feedback.module.css'
import TransactionCount from './TransactionCount'

export function Feedback(): ReactElement {
  const { values } = useFormikContext<FormPublishData>()

  const items = Object.entries(values.feedback).map(([key, value], index) => (
    <li key={index} className={styles[value.status]}>
      <h3 className={styles.title}>{value.name}</h3>
      <div className={styles.txs}>
        {value.txCount > 0 && (
          <TransactionCount
            txCount={value.txCount}
            chainId={values.user.chainId}
            txHash={value.txHash}
          />
        )}
      </div>
      <p className={styles.description}>{value.description}</p>
      {value.errorMessage && (
        <span title={value.errorMessage} className={styles.errorMessage}>
          {value.errorMessage}
        </span>
      )}
    </li>
  ))

  return <ol className={styles.feedback}>{items}</ol>
}
