import React, { ReactElement, useState, useEffect } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { getPaymentCollector } from '@utils/ocean'
import { useProvider } from 'wagmi'

export default function MetaFull({ ddo }: { ddo: Asset }): ReactElement {
  const { isInPurgatory, assetState } = useAsset()
  const provider = useProvider()

  const [paymentCollector, setPaymentCollector] = useState<string>()

  useEffect(() => {
    if (!ddo || !provider) return

    async function getInitialPaymentCollector() {
      try {
        const paymentCollector = await getPaymentCollector(
          ddo.datatokens[0].address,
          provider
        )
        setPaymentCollector(paymentCollector)
      } catch (error) {
        LoggerInstance.error(
          '[MetaFull: getInitialPaymentCollector]',
          error.message
        )
      }
    }
    getInitialPaymentCollector()
  }, [ddo, provider])

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
        content={<Publisher account={ddo?.nft?.owner} />}
      />
      {assetState !== 'Active' && (
        <MetaItem title="Asset State" content={assetState} />
      )}
      {paymentCollector && paymentCollector !== ddo?.nft?.owner && (
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
