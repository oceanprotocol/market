import { useAsset } from '@context/Asset'
import React from 'react'
import { useWeb3 } from '@context/Web3'
import { calicaUri } from '../../../../app.config'
import Button from '@components/@shared/atoms/Button'
import styles from './index.module.css'

export default function OwnerActions() {
  const { asset, isOwner } = useAsset()
  const { accountId } = useWeb3()

  return isOwner ? (
    <div className={styles.ownerActions}>
      <Button style="text" size="small" to={`/asset/${asset?.id}/edit`}>
        Edit Asset
      </Button>{' '}
      |{' '}
      <Button
        style="text"
        size="small"
        href={`${calicaUri}/${accountId}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Use Calica for splitting revenue between multiple accounts."
      >
        Split Revenue
      </Button>
    </div>
  ) : null
}
