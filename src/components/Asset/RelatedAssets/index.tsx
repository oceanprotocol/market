import React, { ReactElement, useEffect, useState } from 'react'
import { generateBaseQuery, getFilterTerm } from '@utils/aquarius'
import { useUserPreferences } from '@context/UserPreferences'
import { SortTermOptions } from '../../../@types/aquarius/SearchQuery'
import SectionQueryResult from '../../Home/SectionQueryResult'

export default function RelatedAssets(): ReactElement {
  const { chainIds } = useUserPreferences()

  const [queryRelatedAssets, setQueryRelatedAssets] = useState<SearchQuery>()

  useEffect(() => {
    const baseParamsSales = {
      chainIds,
      esPaginationOptions: {
        size: 6
      },
      filters: [getFilterTerm('metadata.tags', 'dimitra')],
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
