import React, { ReactElement, useEffect, useState } from 'react'
import { generateBaseQuery } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { SortTermOptions } from '../../../@types/aquarius/SearchQuery'
import SectionQueryResult from '../../Home/SectionQueryResult'

export default function RelatedAssets({
  tags,
  dtAddress,
  owner
}: {
  tags: string[]
  dtAddress: string
  owner: string
}): ReactElement {
  const { chainIds } = useUserPreferences()
  const [queryRelatedAssets, setQueryRelatedAssets] = useState<SearchQuery>()
  const modifiedSearchTerm =
    tags.toString().split(',').join(' OR ') + ' OR ' + owner.toLowerCase()

  useEffect(() => {
    const baseParamsSales = {
      chainIds,
      esPaginationOptions: {
        size: 3
      },
      nestedQuery: {
        must_not: {
          term: {
            'nftAddress.keyword': '0x08d2eF7c255834dBB7513e8b3E744D05748a7079'
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
            'metadata.tags.keyword': ['data-farming', 'ocean-market']
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
  }, [chainIds, dtAddress, modifiedSearchTerm])

  return (
    <SectionQueryResult title="Related Assets:" query={queryRelatedAssets} />
  )
}
