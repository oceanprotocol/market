import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { MetadataCache, Logger } from '@oceanprotocol/lib'
import queryString from 'query-string'

export const SortTermOptions = {
  Created: 'created',
  Relevance: '_score'
} as const
type SortTermOptions = typeof SortTermOptions[keyof typeof SortTermOptions]

export const SortElasticTerm = {
  Liquidity: 'price.ocean',
  Price: 'price.value',
  Created: 'created'
} as const
type SortElasticTerm = typeof SortElasticTerm[keyof typeof SortElasticTerm]

export const SortValueOptions = {
  Ascending: 'asc',
  Descending: 'desc'
} as const
type SortValueOptions = typeof SortValueOptions[keyof typeof SortValueOptions]

export const FilterByTypeOptions = {
  Data: 'dataset',
  Algorithm: 'algorithm'
} as const
type FilterByTypeOptions =
  typeof FilterByTypeOptions[keyof typeof FilterByTypeOptions]

function addTypeFilterToQuery(sortTerm: string, typeFilter: string): string {
  sortTerm = typeFilter
    ? sortTerm === ''
      ? `service.attributes.main.type:${typeFilter}`
      : `${sortTerm} AND service.attributes.main.type:${typeFilter}`
    : sortTerm
  console.log('console.log(sortTerm)', sortTerm)
  return sortTerm
}

function getSortType(sortParam: string): string {
  const sortTerm =
    sortParam === SortTermOptions.Created
      ? SortTermOptions.Created
      : SortTermOptions.Relevance
  return sortTerm
}

export function getSearchQuery(
  text?: string,
  owner?: string,
  tags?: string,
  categories?: string,
  page?: string,
  offset?: string,
  sort?: string,
  sortOrder?: string,
  serviceType?: string
): any {
  const sortTerm = getSortType(sort)
  const sortValue = sortOrder === SortValueOptions.Ascending ? 1 : -1
  const emptySearchTerm = text === undefined || text === ''

  let searchTerm = owner
    ? `(publicKey.owner:${owner})`
    : tags
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.tags:\"${tags}\")`
    : categories
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.categories:\"${categories}\")`
    : text || ''

  searchTerm = searchTerm.trim()
  let modifiedSearchTerm = searchTerm.split(' ').join(' OR ').trim()
  let noSpaceSearchTerm = searchTerm.split(' ').join('').trim()
  noSpaceSearchTerm = addTypeFilterToQuery(noSpaceSearchTerm, serviceType)
  modifiedSearchTerm = addTypeFilterToQuery(modifiedSearchTerm, serviceType)

  searchTerm = addTypeFilterToQuery(searchTerm, serviceType)
  const prefixedSearchTerm =
    emptySearchTerm && searchTerm
      ? searchTerm
      : !emptySearchTerm && searchTerm
      ? '*' + searchTerm + '*'
      : '**'
  const searchFields = [
    'id',
    'publicKey.owner',
    'dataToken',
    'dataTokenInfo.name',
    'dataTokenInfo.symbol',
    'service.attributes.main.name^10',
    'service.attributes.main.author',
    'service.attributes.additionalInformation.description',
    'service.attributes.additionalInformation.tags'
  ]

  return {
    page: Number(page) || 1,
    offset: Number(offset) || 21,
    query: {
      bool: {
        must: [
          {
            bool: {
              should: [
                {
                  query_string: {
                    query: `${modifiedSearchTerm}`,
                    fields: searchFields,
                    minimum_should_match: '2<75%',
                    phrase_slop: 2,
                    boost: 5
                  }
                },
                {
                  query_string: {
                    query: `${noSpaceSearchTerm}*`,
                    fields: searchFields,
                    boost: 5,
                    lenient: true
                  }
                },
                {
                  match_phrase: {
                    content: {
                      query: `${searchTerm}`,
                      boost: 10
                    }
                  }
                },
                {
                  query_string: {
                    query: `${prefixedSearchTerm}`,
                    fields: searchFields,
                    default_operator: 'AND'
                  }
                }
              ]
            }
          },
          {
            term: {
              isInPurgatory: false
            }
          }
        ]
      }
    },
    sort: {
      [sortTerm]: sortValue
    }
  }
}

export async function getResults(
  params: {
    text?: string
    owner?: string
    tags?: string
    categories?: string
    page?: string
    offset?: string
    sort?: string
    sortOrder?: string
    serviceType?: string
  },
  metadataCacheUri: string
): Promise<QueryResult> {
  const {
    text,
    owner,
    tags,
    categories,
    page,
    offset,
    sort,
    sortOrder,
    serviceType
  } = params
  const metadataCache = new MetadataCache(metadataCacheUri, Logger)

  const searchQuery = getSearchQuery(
    text,
    owner,
    tags,
    categories,
    page,
    offset,
    sort,
    sortOrder,
    serviceType
  )
  const queryResult = await metadataCache.queryMetadata(searchQuery)
  return queryResult
}

export async function addExistingParamsToUrl(
  location: Location,
  excludedParams: string[]
): Promise<string> {
  const parsed = queryString.parse(location.search)
  let urlLocation = '/search?'
  if (Object.keys(parsed).length > 0) {
    for (const querryParam in parsed) {
      if (!excludedParams.includes(querryParam)) {
        if (querryParam === 'page' && excludedParams.includes('text')) {
          Logger.log('remove page when starting a new search')
        } else {
          const value = parsed[querryParam]
          urlLocation = `${urlLocation}${querryParam}=${value}&`
        }
      }
    }
  } else {
    // sort should be relevance when fixed in aqua
    urlLocation = `${urlLocation}sort=${encodeURIComponent(
      SortTermOptions.Created
    )}&sortOrder=${SortValueOptions.Descending}&`
  }
  urlLocation = urlLocation.slice(0, -1)
  return urlLocation
}
