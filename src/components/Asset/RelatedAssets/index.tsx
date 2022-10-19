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
  console.log({ modifiedSearchTerm })
  useEffect(() => {
    const baseParamsSales = {
      chainIds,
      esPaginationOptions: {
        size: 3
      },
      nestedQuery: {
        must_not: [
          {
            query_string: {
              query: `${dtAddress.toLowerCase()}`,
              fields: ['datatokens.address']
            }
          }
        ],
        must: [
          {
            query_string: {
              query: modifiedSearchTerm,
              fields: ['metadata.tags', 'nft.owner']
            }
          }
        ]
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
