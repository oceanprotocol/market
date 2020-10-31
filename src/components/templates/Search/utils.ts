import {
  SearchQuery,
  QueryResult
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { MetadataCache, Logger } from '@oceanprotocol/lib'

export function getSearchQuery(
  page?: string,
  offset?: string,
  text?: string,
  owner?: string,
  tags?: string,
  categories?: string
): SearchQuery {
  return {
    page: Number(page) || 1,
    offset: Number(offset) || 21,
    query: owner
      ? { 'publicKey.owner': [owner] }
      : {
          text,
          tags: tags ? [tags] : undefined,
          categories: categories ? [categories] : undefined
        },
    sort: {
      created: -1
    }

    // Something in ocean.js is weird when using 'tags: [tag]'
    // which is the only way the query actually returns desired results.
    // But it doesn't follow 'SearchQuery' interface so we have to assign
    // it here.
  } as SearchQuery
}

export async function getResults(
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
  const queryResult = await metadataCache.queryMetadata(
    getSearchQuery(page, offset, text, owner, tags, categories)
  )

  return queryResult
}
