import React, { ReactElement } from 'react'
import MetaItem from './MetaItem'
import styles from './MetaFull.module.css'
import Publisher from '@shared/Publisher'
import { useAsset } from '@context/Asset'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { useContractRead } from 'wagmi'

import abiDatatoken from '@oceanprotocol/contracts/artifacts/contracts/interfaces/IERC20Template.sol/IERC20Template.json'

export default function MetaFull({ ddo }: { ddo: Asset }): ReactElement {
  const { isInPurgatory, assetState } = useAsset()
  const { data: paymentCollector, error }: { data: string; error: Error } =
    useContractRead({
      address: ddo?.datatokens[0].address,
      abi: abiDatatoken.abi,
      functionName: 'getPaymentCollector'
    })

  if (error) {
    LoggerInstance.error(
      '[MetaFull: getInitialPaymentCollector]',
      error.message
    )
  }

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
