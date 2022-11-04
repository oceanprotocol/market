import React, { ReactElement, useEffect, useState } from 'react'
import { Asset } from '@oceanprotocol/lib'
import { generateBaseQuery, queryMetadata } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { useAsset } from '@context/Asset'
import { SortTermOptions } from '../../../@types/aquarius/SearchQuery'
import styles from './index.module.css'
import { useCancelToken } from '@hooks/useCancelToken'
import AssetList from '@shared/AssetList'

export default function RelatedAssets(): ReactElement {
  const { asset } = useAsset()
  const { chainIds } = useUserPreferences()
  const newCancelToken = useCancelToken()
  const [relatedAssets, setRelatedAssets] = useState<Asset[]>()
  const [isLoading, setIsLoading] = useState<boolean>()

  function generateQuery(
    size: number,
    tagFilter: boolean,
    ownerFilter: boolean
  ) {
    return {
      chainIds,
      esPaginationOptions: {
        size
      },
      nestedQuery: {
        must_not: {
          term: { 'nftAddress.keyword': asset.nftAddress }
        }
      },
      filters: [
        tagFilter && {
          terms: { 'metadata.tags.keyword': asset.metadata.tags }
        },
        ownerFilter && { term: { 'nft.owner.keyword': asset.nftAddress } }
      ],
      sort: {
        'stats.orders': 'desc'
      },
      sortOptions: {
        sortBy: SortTermOptions.Orders
      } as SortOptions
    } as BaseQueryParams
  }

  useEffect(() => {
    setIsLoading(true)
    async function getAssets() {
      const tagQuery = generateBaseQuery(generateQuery(3, true, false))
      const tagResults = (await queryMetadata(tagQuery, newCancelToken()))
        .results
      if (tagResults.length === 3) {
        setRelatedAssets(tagResults)
        setIsLoading(false)
      } else {
        const ownerQuery = generateBaseQuery(
          generateQuery(3 - tagResults.length, false, true)
        )
        const ownerResults = (await queryMetadata(ownerQuery, newCancelToken()))
          .results
        const bothResults = tagResults.concat(ownerResults)
        setRelatedAssets(bothResults)
        setIsLoading(false)
      }
    }
    getAssets()
  }, [chainIds, tags, nftAddress])

  return (
    <section className={styles.section}>
      <h3>Related Assets</h3>
      {relatedAssets && (
        <AssetList
          assets={relatedAssets}
          showPagination={false}
          isLoading={isLoading}
          noDescription={true}
          noPublisher={true}
        />
      )}
    </section>
  )
}
