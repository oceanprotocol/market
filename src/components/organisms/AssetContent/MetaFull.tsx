import React, { ReactElement, useEffect, useState } from 'react'
import Time from '../../atoms/Time'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import { MetadataMarket } from '../../../@types/Metadata'
import { DDO } from '@oceanprotocol/lib'
import EtherscanLink from '../../atoms/EtherscanLink'

import { useOcean } from '@oceanprotocol/react'

export default function MetaFull({
  ddo,
  metadata
}: {
  ddo: DDO
  metadata: MetadataMarket
}): ReactElement {
  const { ocean, accountId } = useOcean()
  const { id, dataToken } = ddo
  const { dateCreated, datePublished, author, license } = metadata.main

  const [dtName, setDtName] = useState<string>()
  const [dtSymbol, setDtSymbol] = useState<string>()

  useEffect(() => {
    if (!ocean) return

    async function getDataTokenInfo() {
      const name = await ocean.datatokens.getName(dataToken, accountId)
      setDtName(name)
      const symbol = await ocean.datatokens.getSymbol(dataToken, accountId)
      setDtSymbol(symbol)
    }
    getDataTokenInfo()
  }, [ocean, accountId, dataToken])

  return (
    <div className={styles.metaFull}>
      <MetaItem title="Author" content={author} />
      <MetaItem
        title="Copyright Holder"
        content={metadata?.additionalInformation?.copyrightHolder}
      />
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
          <EtherscanLink network="rinkeby" path={`token/${dataToken}`}>
            {dtName ? `${dtName} - ${dtSymbol}` : <code>{dataToken}</code>}
          </EtherscanLink>
        }
      />

      <MetaItem title="DID" content={<code>{id}</code>} />
    </div>
  )
}
