import {
  SearchQuery,
  QueryResult
} from '@oceanprotocol/lib/dist/node/metadatastore/MetadataStore'
import { MetadataStore, Logger } from '@oceanprotocol/lib'

export function getSearchQuery(
  page?: string | string[],
  offset?: string | string[],
  text?: string | string[],
  tag?: string | string[]
): SearchQuery {
  return {
    page: Number(page) || 1,
    offset: Number(offset) || 20,
    query: {
      text,
      tags: tag ? [tag] : undefined
    },
    sort: {
      created: -1
    }

    // Something in squid-js is weird when using 'tags: [tag]'
    // which is the only way the query actually returns desired results.
    // But it doesn't follow 'SearchQuery' interface so we have to assign
    // it here.
  } as SearchQuery
}

export async function getResults(
  params: { text?: string; tag?: string; page?: string; offset?: string },
  metadataStoreUri: string
): Promise<QueryResult> {
  const { text, tag, page, offset } = params

  const metadataStore = new MetadataStore(metadataStoreUri, Logger)
  const queryResult = await metadataStore.queryMetadata(
    getSearchQuery(page, offset, text, tag)
  )

  return queryResult
}
