import { QueryResult } from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { MetadataCache, Logger } from '@oceanprotocol/lib'
import {
  getWhitelistedSearchQuery,
  queryMetadata,
  transformChainIdsListToQuery
} from '../../../utils/aquarius'
import queryString from 'query-string'
import axios from 'axios'

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

function getSortType(sortParam: string): string {
  const sortTerm =
    sortParam === SortTermOptions.Created
      ? SortTermOptions.Created
      : SortTermOptions.Relevance
  return sortTerm
}

export function getSearchQuery(
  chainIds: number[],
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
  const modifiedSearchTerm = searchTerm.split(' ').join(' OR ').trim()
  const noSpaceSearchTerm = searchTerm.split(' ').join('').trim()

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
  return getWhitelistedSearchQuery({
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
            match: {
              'service.attributes.main.type':
                serviceType === undefined
                  ? 'dataset OR algorithm'
                  : `${serviceType}`
            }
          },
          {
            query_string: {
              query: `${transformChainIdsListToQuery(chainIds)}`
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
  })
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
  metadataCacheUri: string,
  chainIds: number[]
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

  const searchQuery = getSearchQuery(
    chainIds,
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
  const source = axios.CancelToken.source()
  // const queryResult = await metadataCache.queryMetadata(searchQuery)
  const queryResult = await queryMetadata(searchQuery, source.token)
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
