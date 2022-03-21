import React, { ReactElement } from 'react'
import styles from './index.module.css'
import { Asset } from '@oceanprotocol/lib'
import { decodeTokenURI } from '@utils/nft'
import MetaAsset from './MetaAsset'
import MetaInfo from './MetaInfo'
import Tooltip from '@shared/atoms/Tooltip'
import NftTooltip from './NftTooltip'
import Logo from '@shared/atoms/Logo'
import { FormPublishData } from '../../../Publish/_types'
import { useFormikContext } from 'formik'

export default function MetaMain({
  asset,
  nftPublisher
}: {
  asset: Asset
  nftPublisher: string
}): ReactElement {
  const { values } = useFormikContext<FormPublishData>()
  const nftMetadata = decodeTokenURI(asset?.nft?.tokenURI)

  const blockscoutNetworks = [1287, 2021000, 2021001, 44787, 246, 1285]
  const isBlockscoutExplorer = blockscoutNetworks.includes(asset?.chainId)

  const nftImage = nftMetadata?.image_data
    ? nftMetadata.image_data
    : values?.metadata?.nft?.image_data
    ? values.metadata.nft.image_data
    : null

  return (
    <aside className={styles.meta}>
      <header className={styles.asset}>
        <div className={styles.nftImage}>
          {nftImage ? (
            <img src={nftImage} alt={asset?.nft?.name} />
          ) : (
            <Logo noWordmark />
          )}

          {(nftMetadata || asset?.nftAddress) && (
            <Tooltip
              className={styles.tooltip}
              content={
                <NftTooltip
                  nft={nftMetadata}
                  address={asset?.nftAddress}
                  chainId={asset?.chainId}
                  isBlockscoutExplorer={isBlockscoutExplorer}
                />
              }
            />
          )}
        </div>
        <MetaAsset asset={asset} isBlockscoutExplorer={isBlockscoutExplorer} />
      </header>

      <MetaInfo asset={asset} nftPublisher={nftPublisher} />
    </aside>
  )
}
