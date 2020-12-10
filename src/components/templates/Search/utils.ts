import {
  SearchQuery,
  QueryResult
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { MetadataCache, Logger } from '@oceanprotocol/lib'

export function getSearchQuery(
  text?: string,
  owner?: string,
  tags?: string,
  categories?: string,
  page?: string,
  offset?: string,
  priceType?: string,
  items?: any,
  sort?: string,
  sortOrder?: string
): SearchQuery {
  
  const sortTerm = ( sort == "liquidity" ) ? "price.ocean" : (( sort == "price" ) ? "price.value" : "created")
  const sortValue = ( sortOrder == "asc" ) ? 1 : -1

  const searchTerm = owner
    ? `(publicKey.owner:${owner})`
    : tags
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.tags:\"${tags}\")`
    : categories
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.categories:\"${categories}\")`
    : text || '' + ` price.type:\"${priceType}\"`

  return {
    page: Number(page) || 1,
    offset: Number(offset) || 21,
    query: {
      nativeSearch: 1,
      query_string: {
        query: `${searchTerm} -isInPurgatory:true`
      }
      // ...(owner && { 'publicKey.owner': [owner] }),
      // ...(tags && { tags: [tags] }),
      // ...(categories && { categories: [categories] })
    },
    sort: {
      [sortTerm] : sortValue
      // "created" : - 1 by default, sort results by date created, newest first
      // "price.value" : - 1 sort results by price, from highest to lowest (ddo.price.value)
      // "price.ocean" : - 1 sort results by liquidity, from highest to lowest (ddo.price.ocean) 
    }
    // Andreea sort version
    // sort: items
    //   ? items.reduce((acc, e) => ({ ...acc, [e.id]: e.direction }), {})
    //   : {
    //       created: -1,
    //       'price.ocean': -1,
    //       'price.value': -1
    //     }

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
  params: {
    text?: string
    owner?: string
    tags?: string
    categories?: string
    page?: string
    offset?: string
    sort?: string,
    sortOrder?: string
  },
  metadataCacheUri: string,
  priceType?: string,
  items?: any
): Promise<QueryResult> {
  const { text, owner, tags, page, offset, categories, sort, sortOrder } = params

  const metadataCache = new MetadataCache(metadataCacheUri, Logger)
  const searchQuery = getSearchQuery(
    text,
    owner,
    tags,
    categories,
    page,
    offset,
    priceType,
    // items,
    sort,
    sortOrder
  )
  const queryResult = await metadataCache.queryMetadata(searchQuery)

  return queryResult
}
