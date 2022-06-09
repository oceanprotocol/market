import Copy from '@shared/atoms/Copy'
import External from '@images/external.svg'
import ExplorerLink from '@shared/ExplorerLink'
import { NftMetadata } from '@utils/nft'
import React, { ReactElement } from 'react'
import styles from './NftTooltip.module.css'
import explorerLinkStyles from '@shared/ExplorerLink/index.module.css'
import { accountTruncate } from '@utils/web3'

// Supported OpenSea networks:
// https://support.opensea.io/hc/en-us/articles/4404027708051-Which-blockchains-does-OpenSea-support-
const openSeaNetworks = [1, 137]
const openSeaTestNetworks = [4]

export default function NftTooltip({
  nft,
  address,
  chainId,
  isBlockscoutExplorer
}: {
  nft: NftMetadata
  address: string
  chainId: number
  isBlockscoutExplorer: boolean
}): ReactElement {
  const openSeaSupported = openSeaNetworks
    .concat(openSeaTestNetworks)
    .includes(chainId)

  const openSeaBaseUri = openSeaSupported
    ? openSeaTestNetworks.includes(chainId)
      ? 'https://testnets.opensea.io'
      : 'https://opensea.io'
    : undefined

  const openSeaUrl = `${openSeaBaseUri}/assets/${
    chainId === 137 ? 'matic' : ''
  }/${address}/1`

  return (
    <div className={styles.wrapper}>
      {nft && <img src={nft.image_data || nft.image} alt={nft?.name} />}
      <div className={styles.info}>
        {nft && <h5>{nft.name}</h5>}
        {address && (
          <span title={address} className={styles.address}>
            {accountTruncate(address)} <Copy text={address} />
          </span>
        )}
        <div className={styles.links}>
          {address && (
            <ExplorerLink
              networkId={chainId}
              path={
                isBlockscoutExplorer ? `tokens/${address}` : `token/${address}`
              }
            >
              View on Explorer
            </ExplorerLink>
          )}

          {openSeaSupported && address && (
            <a
              href={openSeaUrl}
              target="_blank"
              rel="noreferrer"
              className={explorerLinkStyles.link}
            >
              View on OpenSea <External />
            </a>
          )}
        </div>
        {!nft?.image_data && !nft?.image && (
          <p className={styles.fallback}>This Data NFT has no image set.</p>
        )}
      </div>
    </div>
  )
}
