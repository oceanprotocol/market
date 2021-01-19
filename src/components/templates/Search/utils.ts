import {
  SearchQuery,
  QueryResult
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { MetadataCache, Logger } from '@oceanprotocol/lib'

export function getSearchQuery(
  ewaiMarketName: string,
  text?: string,
  owner?: string,
  tags?: string,
  categories?: string,
  page?: string,
  offset?: string
): SearchQuery {
  const searchTerm = owner
    ? `(publicKey.owner:${owner})`
    : tags
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.tags:\"${tags}\")`
    : categories
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.categories:\"${categories}\")`
    : text || ''

  return {
    page: Number(page) || 1,
    offset: Number(offset) || 21,
    query: {
      nativeSearch: 1,
      query_string: {
        query: `${searchTerm} ${
          searchTerm ? ' && ' : ''
        } (service.attributes.additionalInformation.energyweb.ewai.instance:"${ewaiMarketName}") -isInPurgatory:true`
      }
      // ...(owner && { 'publicKey.owner': [owner] }),
      // ...(tags && { tags: [tags] }),
      // ...(categories && { categories: [categories] })
    },
    sort: {
      created: -1
    }

    // Something in ocean.js is weird when using 'tags: [tag]'
    // which is the only way the query actually returns desired results.
    // But it doesn't follow 'SearchQuery' interface so we have to assign
    // it here.
    // } as SearchQuery

    // And the next hack,
    // nativeSearch is not implmeneted on ocean.js typings
  } as any
}

export async function getResults(
  ewaiMarketName: string,
  params: {
    text?: string
    owner?: string
    tags?: string
    categories?: string
    page?: string
    offset?: string
  },
  metadataCacheUri: string
): Promise<QueryResult> {
  const { text, owner, tags, page, offset, categories } = params

  const metadataCache = new MetadataCache(metadataCacheUri, Logger)
  const searchQuery = getSearchQuery(
    ewaiMarketName,
    text,
    owner,
    tags,
    categories,
    page,
    offset
  )
  const queryResult = await metadataCache.queryMetadata(searchQuery)

  return queryResult
}
