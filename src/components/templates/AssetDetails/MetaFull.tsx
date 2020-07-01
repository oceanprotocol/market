import React, { ReactElement } from 'react'
import Time from '../../atoms/Time'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import { MetaDataMarket } from '../../../@types/MetaData'

export default function MetaFull({
  did,
  metadata
}: {
  did: string
  metadata: MetaDataMarket
}): ReactElement {
  const { dateCreated, author, license } = metadata.main
  let dateRange
  if (metadata && metadata.additionalInformation) {
    ;({ dateRange } = metadata.additionalInformation)
  }

  // In practice dateRange will always be defined, but in the rare case it isn't
  // we put something to prevent errors
  if (!dateRange) {
    dateRange = [dateCreated, dateCreated]
  }

  return (
    <div className={styles.metaFull}>
      <MetaItem title="Author" content={author} />
      <MetaItem title="License" content={license} />
      <MetaItem
        title="Data Created"
        content={
          dateRange && dateRange[0] !== dateRange[1] ? (
            <>
              <Time date={dateRange[0]} />
              {' –⁠ '}
              <Time date={dateRange[1]} />
            </>
          ) : (
            <Time date={dateRange[0]} />
          )
        }
      />

      <MetaItem title="DID" content={<code>{did}</code>} />
    </div>
  )
}
