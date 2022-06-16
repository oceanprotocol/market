import { useAsset } from '@context/Asset'
import Tooltip from '@shared/atoms/Tooltip'
import { decodeTokenURI } from '@utils/nft'
import { useFormikContext } from 'formik'
import React from 'react'
import { FormPublishData } from 'src/components/Publish/_types'
import Logo from '@shared/atoms/Logo'
import NftTooltip from './NftTooltip'
import styles from './index.module.css'

export default function Nft({
  isBlockscoutExplorer
}: {
  isBlockscoutExplorer: boolean
}) {
  const { asset } = useAsset()
  const nftMetadata = decodeTokenURI(asset?.nft?.tokenURI)

  // TODO: using this for the publish preview works fine, but produces a console warning
  // on asset details page as there is no formik context there:
  // Warning: Formik context is undefined, please verify you are calling useFormikContext()
  // as child of a <Formik> component.
  const formikState = useFormikContext<FormPublishData>()

  // checking if the NFT has an image associated (tokenURI)
  // if tokenURI is undefined, then we are in Preview
  // for Preview we need to show accessDetails.dataImage
  // as this is where the NFT's SVG (during publish) is stored
  const nftImage = nftMetadata?.image_data
    ? nftMetadata.image_data
    : nftMetadata?.image
    ? nftMetadata.image
    : formikState?.values?.metadata?.nft?.image_data
    ? formikState.values.metadata.nft.image_data
    : null

  return (
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
  )
}
