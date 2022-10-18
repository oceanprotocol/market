import React, { ReactElement, useEffect, useState } from 'react'
import { generateBaseQuery, getFilterTerm } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { SortTermOptions } from '../../../@types/aquarius/SearchQuery'
import SectionQueryResult from '../../Home/SectionQueryResult'

export default function RelatedAssets({
  tags,
  id
}: {
  tags: string[]
  id: string
}): ReactElement {
  const { chainIds } = useUserPreferences()

  const [queryRelatedAssets, setQueryRelatedAssets] = useState<SearchQuery>()

  useEffect(() => {
    const baseParamsSales = {
      chainIds,
      esPaginationOptions: {
        size: 3
      },
      nestedQuery: {
        must_not: {
          match: {
            id
          }
        }
      },
      filters: [getFilterTerm('metadata.tags', tags)],
      sortOptions: {
        sortBy: SortTermOptions.Orders
      } as SortOptions
    } as BaseQueryParams
    setQueryRelatedAssets(generateBaseQuery(baseParamsSales))
  }, [chainIds])

  return (
    <SectionQueryResult title="Related Assets:" query={queryRelatedAssets} />
  )
}
