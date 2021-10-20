import { Logger } from '@oceanprotocol/lib'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata
} from '../../../utils/aquarius'
import queryString from 'query-string'
import { CancelToken } from 'axios'
import { BaseQueryParams } from '../../../models/aquarius/BaseQueryParams'
import { SearchQuery } from '../../../models/aquarius/SearchQuery'
import { FilterTerm } from '../../../models/aquarius/FilterTerm'
import {
  SortDirectionOptions,
  SortTermOptions
} from '../../../models/SortAndFilters'

export function escapeESReservedChars(text: string): string {
  return text?.replace(/([!*+\-=<>&|()\\[\]{}^~?:\\/"])/g, '\\$1')
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
  sortDirection?: string,
  serviceType?: string,
  accessType?: string
): SearchQuery {
  text = escapeESReservedChars(text)
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

  const nestedQuery = {
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
      }
    ]
  }

  const filters: FilterTerm[] = []
  accessType !== undefined &&
    filters.push(getFilterTerm('service.type', accessType))
  serviceType !== undefined &&
    filters.push(getFilterTerm('service.attributes.main.type', serviceType))

  const baseQueryParams = {
    chainIds,
    nestedQuery,
    esPaginationOptions: {
      from: (Number(page) - 1 || 0) * (Number(offset) || 21),
      size: Number(offset) || 21
    },
    sortOptions: { sortBy: sort, sortDirection: sortDirection },
    filters
  } as BaseQueryParams

  const query = generateBaseQuery(baseQueryParams)

  return query
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
    )}&sortOrder=${SortDirectionOptions.Descending}&`
  }
  urlLocation = urlLocation.slice(0, -1)
  return urlLocation
}
