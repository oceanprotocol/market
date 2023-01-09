import { useAsset } from '@context/Asset'
import React, { useEffect, useState } from 'react'
import { useWeb3 } from '@context/Web3'
import { calicaBaseUri } from '../../../../app.config'
import Button from '@components/@shared/atoms/Button'
import styles from './index.module.css'
import { checkCalicaContractAddress } from './calicaUtils'
import { useCancelToken } from '@hooks/useCancelToken'

export default function OwnerActions() {
  const { asset, isOwner } = useAsset()
  const { accountId } = useWeb3()
  const [calicaUri, setCalicaUri] = useState()
  const newCancelToken = useCancelToken()
  useEffect(() => {
    checkCalicaContractAddress(
      asset.paymentCollector,
      asset.chainId,
      newCancelToken()
    )
    console.log(
      'calicaBaseUri',
      calicaBaseUri,
      calicaUri,
      asset?.paymentCollector
    )
  }, [asset?.paymentCollector, calicaUri])
  // {ddo?.paymentCollector && ddo?.paymentCollector !== ddo?.nft?.owner && (
  return isOwner ? (
    <div className={styles.ownerActions}>
      <Button style="text" size="small" to={`/asset/${asset?.id}/edit`}>
        Edit Asset
      </Button>{' '}
      {calicaUri && (
        <>
          |{' '}
          <Button
            style="text"
            size="small"
            href={calicaUri}
            target="_blank"
            rel="noopener noreferrer"
            title="Use Calica for splitting revenue between multiple accounts."
          >
            Split Revenue
          </Button>
        </>
      )}
    </div>
  ) : null
}
