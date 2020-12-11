import {
  SearchQuery,
  QueryResult
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { MetadataCache, Logger } from '@oceanprotocol/lib'

const SortTermOptions = {
  Liquidity: 'liquidity',
  Price: 'price',
  Created: 'created',
} as const
type SortTermOptions = typeof SortTermOptions[keyof typeof SortTermOptions]

const SortValueOptions = {
  Ascending: 'asc',
  Descending: 'desc',
} as const
type SortValueOptions = typeof SortValueOptions[keyof typeof SortValueOptions]

export function getSearchQuery(
  text?: string,
  owner?: string,
  tags?: string,
  categories?: string,
  page?: string,
  offset?: string,
  sort?: string,
  sortOrder?: string,
  priceType?: string
): SearchQuery {
  
  const sortTerm = ( sort == SortTermOptions.Liquidity ) ? "price.ocean" : (( sort == SortTermOptions.Price ) ? "price.value" : SortTermOptions.Created)
  const sortValue = ( sortOrder == SortValueOptions.Ascending ) ? 1 : -1

  let searchTerm = owner
    ? `(publicKey.owner:${owner})`
    : tags
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.tags:\"${tags}\")`
    : categories
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.categories:\"${categories}\")`
    : text || '';

  searchTerm = (priceType) ? searchTerm+' AND price.type:'+priceType : searchTerm

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
    sort?: string
    sortOrder?: string
    priceType?: string
  },
  metadataCacheUri: string,
): Promise<QueryResult> {
  const { text, owner, tags, page, offset, categories, sort, sortOrder, priceType } = params
  console.log('params', params)
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
    priceType
  )
  console.log('searchQuery ',searchQuery)
  const queryResult = await metadataCache.queryMetadata(searchQuery)
  console.log('queryResult ',queryResult)
  return queryResult
}
