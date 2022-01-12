import ExplorerLink from '@shared/ExplorerLink'
import { useFormikContext } from 'formik'
import React, { ReactElement } from 'react'
import { FormPublishData } from '../_types'
import styles from './Feedback.module.css'

export function Feedback(): ReactElement {
  const { values } = useFormikContext<FormPublishData>()

  const items = Object.entries(values.feedback).map(([key, value], index) => (
    <li key={index} className={styles[value.status]}>
      <h3 className={styles.title}>
        {value.name}{' '}
        {value.txHash && (
          <ExplorerLink
            networkId={values.user.chainId}
            path={`/tx/${value.txHash}`}
            className={styles.txHash}
          >
            View Transaction
          </ExplorerLink>
        )}
      </h3>
      <p className={styles.description}>{value.description}</p>
    </li>
  ))

  return <ol className={styles.feedback}>{items}</ol>
}
