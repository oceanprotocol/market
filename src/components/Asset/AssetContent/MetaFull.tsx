import React, { ReactElement, useState, useEffect } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'
import { useWeb3 } from '@context/Web3'
import { Asset, Datatoken, LoggerInstance } from '@oceanprotocol/lib'

export default function MetaFull({ ddo }: { ddo: Asset }): ReactElement {
  const [paymentCollector, setPaymentCollector] = useState<string>()
  const { isInPurgatory } = useAsset()
  const { web3 } = useWeb3()

  useEffect(() => {
    async function getInitialPaymentCollector() {
      try {
        const datatoken = new Datatoken(web3)
        setPaymentCollector(
          await datatoken.getPaymentCollector(ddo.datatokens[0].address)
        )
      } catch (error) {
        LoggerInstance.error('[MetaFull: getInitialPaymentCollector]', error)
      }
    }
    getInitialPaymentCollector()
  }, [ddo, web3])

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
