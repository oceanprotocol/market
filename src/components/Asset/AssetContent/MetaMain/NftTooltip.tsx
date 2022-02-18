import Copy from '@shared/atoms/Copy'
import External from '@images/external.svg'
import ExplorerLink from '@shared/ExplorerLink'
import { NftMetadata } from '@utils/nft'
import React, { ReactElement } from 'react'
import styles from './NftTooltip.module.css'
import explorerLinkStyles from '@shared/ExplorerLink/index.module.css'

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
  // Currently Ocean NFTs are not displayed correctly on OpenSea
  // Code prepared to easily integrate this feature once this is fixed
  //
  // Supported OpeanSea networks:
  // https://support.opensea.io/hc/en-us/articles/4404027708051-Which-blockchains-does-OpenSea-support-
  const openseaNetworks = [1, 137, 8217]
  const openseaTestNetworks = [4, 1001, 80001, 97, 420]
  const openSeaSupported = openseaNetworks
    .concat(openseaTestNetworks)
    .includes(chainId)

  const openSeaBaseUri = openSeaSupported
    ? openseaTestNetworks.includes(chainId)
      ? 'https://testnets.opensea.io'
      : 'https://opensea.io'
    : undefined

  return (
    <div className={styles.wrapper}>
      {nft && <img src={nft.image_data} alt={nft?.name} />}
      <div className={styles.info}>
        {nft && <h5>{nft.name}</h5>}
        {address && (
          <span title={address} className={styles.address}>
            {address} <Copy text={address} />
          </span>
        )}
        <div className={styles.links}>
          {address && (
            <ExplorerLink
              className={styles.datatoken}
              networkId={chainId}
              path={
                isBlockscoutExplorer ? `tokens/${address}` : `token/${address}`
              }
            >
              View on explorer
            </ExplorerLink>
          )}

          {openSeaSupported && nft && address && (
            <a
              href={`${openSeaBaseUri}/assets/${address}/1`}
              target="_blank"
              rel="noreferrer"
              className={explorerLinkStyles.link}
            >
              View on OpeanSea <External />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
