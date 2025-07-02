import React, { ReactElement, useState, useEffect } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'
import { LoggerInstance, Datatoken } from '@oceanprotocol/lib'
// import { Asset } from '@oceanprotocol/ddo-js'
import { getDummySigner } from '@utils/wallet'

export default function MetaFull({
  ddo
}: {
  ddo: AssetExtended
}): ReactElement {
  const { isInPurgatory, assetState } = useAsset()

  const [paymentCollector, setPaymentCollector] = useState<string>()

  useEffect(() => {
    if (!ddo.datatokens[0]?.address) {
      LoggerInstance.error('Datatoken address missing from DDO')
      return
    }

    async function getInitialPaymentCollector() {
      try {
        const signer = await getDummySigner(ddo.chainId)
        const datatoken = new Datatoken(signer, ddo.chainId)
        const { address } = ddo.datatokens[0]

        LoggerInstance.log('[MetaFull] Using datatoken address:', address)

        // const collector = await datatoken.getPaymentCollector(address)
        setPaymentCollector(
          await datatoken.getPaymentCollector(
            ddo.indexedMetadata.stats[0].datatokenAddress || ''
          )
        )
      } catch (error) {
        LoggerInstance.error(
          '[MetaFull: getInitialPaymentCollector]',
          error.message
        )
      }
    }

    getInitialPaymentCollector()
  }, [ddo])

  function DockerImage() {
    const containerInfo = ddo?.metadata?.algorithm?.container
    const { image, tag } = containerInfo
    return <span>{`${image}:${tag}`}</span>
  }

  return ddo ? (
    <div className={styles.metaFull}>
      {!isInPurgatory && (
        <MetaItem title="Data Author" content={ddo?.metadata?.author} />
      )}
      <MetaItem
        title="Owner"
        content={<Publisher account={ddo?.indexedMetadata?.nft?.owner} />}
      />
      {assetState !== 'Active' && (
        <MetaItem title="Asset State" content={assetState} />
      )}
      {paymentCollector &&
        paymentCollector !== ddo?.indexedMetadata.nft?.owner && (
          <MetaItem
            title="Revenue Sent To"
            content={<Publisher account={paymentCollector} />}
          />
        )}

      {ddo?.metadata?.type === 'algorithm' && ddo?.metadata?.algorithm && (
        <MetaItem title="Docker Image" content={<DockerImage />} />
      )}
      <MetaItem title="DID" content={<code>{ddo?.id}</code>} />
    </div>
  ) : null
}
