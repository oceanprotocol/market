import React from 'react'
import { DDO } from '@oceanprotocol/squid'
import { MetaDataDexFreight } from '../../../@types/MetaData'
import Time from '../../atoms/Time'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'

export default function MetaFull({
  ddo,
  attributes
}: {
  ddo: DDO | undefined
  attributes: MetaDataDexFreight
}) {
  const { dateCreated, author, license } = attributes.main
  let dateRange, granularity
  if (attributes && attributes.additionalInformation) {
    ;({ dateRange, granularity } = attributes.additionalInformation)
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

      {granularity && (
        <MetaItem title="Data Granularity" content={granularity} />
      )}

      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
    </div>
  )
}
