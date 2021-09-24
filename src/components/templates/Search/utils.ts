import { Logger } from '@oceanprotocol/lib'
import {
  queryMetadata,
  transformChainIdsListToQuery
} from '../../../utils/aquarius'
import queryString from 'query-string'
import { CancelToken } from 'axios'

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

export const FilterByAccessOptions = {
  Download: 'access',
  Compute: 'compute'
}
type FilterByAccessOptions =
  typeof FilterByAccessOptions[keyof typeof FilterByAccessOptions]

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
  serviceType?: string,
  accessType?: string
): any {
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
  return {
    from: (Number(page) || 0) * (Number(offset) || 21),
    size: Number(offset) || 21,
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
            match: {
              'service.type':
                accessType === undefined ? 'access OR compute' : `${accessType}`
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
      [sort]: sortOrder
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
    accessType?: string
  },
  chainIds: number[],
  cancelToken?: CancelToken
): Promise<any> {
  const {
    text,
    owner,
    tags,
    categories,
    page,
    offset,
    sort,
    sortOrder,
    serviceType,
    accessType
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
    serviceType,
    accessType
  )
  const queryResult = await queryMetadata(searchQuery, cancelToken)
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
      SortTermOptions.Relevance
    )}&sortOrder=${SortValueOptions.Descending}&`
  }
  urlLocation = urlLocation.slice(0, -1)
  return urlLocation
}
