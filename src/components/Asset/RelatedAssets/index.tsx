import React, { ReactElement, useEffect, useState } from 'react'
import { Asset, LoggerInstance } from '@oceanprotocol/lib'
import { generateBaseQuery, queryMetadata } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { useAsset } from '@context/Asset'
import styles from './index.module.css'
import { useCancelToken } from '@hooks/useCancelToken'
import AssetList from '@shared/AssetList'
import { generateQuery } from './_utils'

export default function RelatedAssets(): ReactElement {
  const { asset } = useAsset()
  const { chainIds } = useUserPreferences()
  const newCancelToken = useCancelToken()

  const [relatedAssets, setRelatedAssets] = useState<Asset[]>()
  const [isLoading, setIsLoading] = useState<boolean>()

  useEffect(() => {
    if (
      !chainIds?.length ||
      !asset?.nftAddress ||
      !asset?.nft ||
      !asset?.metadata
    ) {
      return
    }

    async function getAssets() {
      setIsLoading(true)

      try {
        let tagResults: Asset[] = []

        // safeguard against faults in the metadata
        if (asset.metadata.tags instanceof Array) {
          const tagQuery = generateBaseQuery(
            generateQuery(chainIds, asset.nftAddress, 4, asset.metadata.tags)
          )

          tagResults = (await queryMetadata(tagQuery, newCancelToken()))
            ?.results
        }

        if (tagResults.length === 4) {
          setRelatedAssets(tagResults)
        } else {
          const ownerQuery = generateBaseQuery(
            generateQuery(
              chainIds,
              asset.nftAddress,
              4 - tagResults.length,
              null,
              asset.nft.owner
            )
          )

          const ownerResults = (
            await queryMetadata(ownerQuery, newCancelToken())
          )?.results

          // combine both results, and filter out duplicates
          // stolen from: https://stackoverflow.com/a/70326769/733677
          const bothResults = tagResults.concat(
            ownerResults.filter(
              (asset2) => !tagResults.find((asset1) => asset1.id === asset2.id)
            )
          )
          setRelatedAssets(bothResults)
        }
      } catch (error) {
        LoggerInstance.error(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getAssets()
  }, [chainIds, asset, newCancelToken])

  return (
    <section className={styles.section}>
      <h3>Related Assets</h3>
      <AssetList
        assets={relatedAssets}
        showPagination={false}
        isLoading={isLoading}
        noDescription
        noPublisher
        noPrice
      />
    </section>
  )
}
