import React, { ReactElement } from 'react'
import Time from '../../atoms/Time'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import { MetadataMarket } from '../../../@types/MetaData'
import { DDO } from '@oceanprotocol/lib'
import EtherscanLink from '../../atoms/EtherscanLink'
import { useOcean, usePricing } from '@oceanprotocol/react'

export default function MetaFull({
  ddo,
  metadata
}: {
  ddo: DDO
  metadata: MetadataMarket
}): ReactElement {
  const { networkId } = useOcean()
  const { id, dataToken } = ddo
  const { dateCreated, datePublished, author, license } = metadata.main
  const { dtSymbol, dtName } = usePricing(ddo)

  return (
    <div className={styles.metaFull}>
      <MetaItem title="Author" content={author} />

      {metadata?.additionalInformation?.copyrightHolder && (
        <MetaItem
          title="Copyright Holder"
          content={metadata?.additionalInformation?.copyrightHolder}
        />
      )}

      <MetaItem title="License" content={license} />

      {metadata?.additionalInformation?.categories && (
        <MetaItem
          title="Category"
          content={metadata?.additionalInformation?.categories[0]}
        />
      )}

      <MetaItem title="Data Created" content={<Time date={dateCreated} />} />

      <MetaItem
        title="Data Published"
        content={<Time date={datePublished} />}
      />

      <MetaItem
        title="Datatoken"
        content={
          <EtherscanLink networkId={networkId} path={`token/${dataToken}`}>
            {dtName ? `${dtName} - ${dtSymbol}` : <code>{dataToken}</code>}
          </EtherscanLink>
        }
      />

      <MetaItem title="DID" content={<code>{id}</code>} />
    </div>
  )
}
