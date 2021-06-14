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
  return sortTerm
}

// function getSortType(sort: string): string {
//   const sortTerm = SortTermOptions.f
//   return sortTerm
// }

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
  const sortTerm = sort
  const sortValue = sortOrder === SortValueOptions.Ascending ? 1 : -1

  // not sure if we need this anymore
  let searchTerm = owner
    ? `(publicKey.owner:${owner})`
    : tags
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.tags:\"${tags}\")`
    : categories
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.categories:\"${categories}\")`
    : text || ''

  const modifiedSearchTerm = searchTerm.split(' ').join(' OR ')

  searchTerm = addTypeFilterToQuery(searchTerm, serviceType)
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
                    fields: [
                      'id',
                      'publicKey.owner',
                      'dataToken',
                      'dataTokenInfo.name',
                      'dataTokenInfo.symbol',
                      'service.attributes.main.name^10',
                      'service.attributes.main.author',
                      'service.attributes.additionalInformation.description',
                      'service.attributes.additionalInformation.tags'
                    ],
                    minimum_should_match: '2<75%',
                    phrase_slop: 2,
                    boost: 5
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
                    query: `*${searchTerm}*`,
                    fields: [
                      'id',
                      'publicKey.owner',
                      'dataToken',
                      'dataTokenInfo.name',
                      'dataTokenInfo.symbol',
                      'service.attributes.main.name',
                      'service.attributes.main.author',
                      'service.attributes.additionalInformation.description',
                      'service.attributes.additionalInformation.tags'
                    ],
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
    page,
    offset,
    categories,
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
  excludedParam: string,
  secondExcludedParam?: string
): Promise<string> {
  const parsed = queryString.parse(location.search)
  let urlLocation = '/search?'
  if (Object.keys(parsed).length > 0) {
    for (const querryParam in parsed) {
      if (
        querryParam !== excludedParam &&
        querryParam !== secondExcludedParam
      ) {
        if (querryParam === 'page' && excludedParam === 'text') {
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
