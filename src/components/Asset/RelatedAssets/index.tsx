import React, { ReactElement, useEffect, useState } from 'react'
import { generateBaseQuery } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { SortTermOptions } from '../../../@types/aquarius/SearchQuery'
import SectionQueryResult from '../../Home/SectionQueryResult'

export default function RelatedAssets({
  tags,
  nftAddress,
  owner
}: {
  tags: string[]
  nftAddress: string
  owner: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const [queryRelatedAssets, setQueryRelatedAssets] = useState<SearchQuery>()
  console.log('nftAddress', nftAddress)
  useEffect(() => {
    const baseParamsSales = {
      chainIds,
      esPaginationOptions: {
        size: 3
      },
      nestedQuery: {
        must_not: {
          term: {
            'nftAddress.keyword': nftAddress
          }
        }
      },
      filters: [
        {
          terms: {
            chainId: [1, 137, 56, 246, 1285]
          }
        },
        {
          terms: {
            'metadata.tags.keyword': tags
          }
        },
        {
          term: {
            _index: 'aquarius'
          }
        },
        {
          term: {
            'purgatory.state': false
          }
        }
      ],
      sort: {
        'stats.orders': 'desc'
      },
      sortOptions: {
        sortBy: SortTermOptions.Orders
      } as SortOptions
    } as BaseQueryParams
    setQueryRelatedAssets(generateBaseQuery(baseParamsSales))
  }, [chainIds, nftAddress])

  return (
    <SectionQueryResult title="Related Assets" query={queryRelatedAssets} />
  )
}
