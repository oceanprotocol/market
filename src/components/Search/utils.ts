import { LoggerInstance } from '@oceanprotocol/lib'
import {
  generateBaseQuery,
  getFilterTerm,
  queryMetadata
} from '@utils/aquarius'
import queryString from 'query-string'
import { CancelToken } from 'axios'
import {
  SortDirectionOptions,
  SortTermOptions
} from '../../@types/aquarius/SearchQuery'

export function updateQueryStringParameter(
  uri: string,
  key: string,
  newValue: string
): string {
  const regex = new RegExp('([?&])' + key + '=.*?(&|$)', 'i')
  const separator = uri.indexOf('?') !== -1 ? '&' : '?'

  if (uri.match(regex)) {
    return uri.replace(regex, '$1' + key + '=' + newValue + '$2')
  } else {
    return uri + separator + key + '=' + newValue
  }
}

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
    ? `(nft.owner:${owner})`
    : tags
    ? // eslint-disable-next-line no-useless-escape
      `(metadata.tags:\"${tags}\")`
    : // : categories
      // ? // eslint-disable-next-line no-useless-escape
      //   `(service.attributes.additionalInformation.categories:\"${categories}\")`
      text || ''

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
    'nft.owner',
    'datatokens.address',
    'datatokens.name',
    'datatokens.symbol',
    'metadata.name^10',
    'metadata.author',
    'metadata.description',
    'metadata.tags'
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
    filters.push(getFilterTerm('services.type', accessType))
  serviceType !== undefined &&
    filters.push(getFilterTerm('metadata.type', serviceType))

  const baseQueryParams = {
    chainIds,
    nestedQuery,
    esPaginationOptions: {
      from: (Number(page) - 1 || 0) * (Number(offset) || 21),
      size: Number(offset) || 21
    },
    sortOptions: { sortBy: sort, sortDirection },
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
    for (const queryParam in parsed) {
      if (!excludedParams.includes(queryParam)) {
        if (queryParam === 'page' && excludedParams.includes('text')) {
          LoggerInstance.log('remove page when starting a new search')
        } else {
          const value = parsed[queryParam]
          urlLocation = `${urlLocation}${queryParam}=${value}&`
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
