import {
  SearchQuery,
  QueryResult
} from '@oceanprotocol/lib/dist/node/metadatacache/MetadataCache'
import { MetadataCache, Logger } from '@oceanprotocol/lib'
import { add } from 'date-fns'

export const SortTermOptions = {
  Liquidity: 'liquidity',
  Price: 'price',
  Published: 'published'
} as const
const SortTermElasticOptions = {
  [SortTermOptions.Liquidity]: 'price.ocean',
  [SortTermOptions.Price]: 'price.value',
  [SortTermOptions.Published]: 'created'
}
export type SortTermOptions = typeof SortTermOptions[keyof typeof SortTermOptions]
export const SortValueOptions = {
  Ascending: 'asc',
  Descending: 'desc'
} as const
export type SortValueOptions = typeof SortValueOptions[keyof typeof SortValueOptions]
export interface SortItem {
  by: SortTermOptions
  direction: SortValueOptions
}
function getSortObj(sort: SortItem[]) {
  return sort
    ? sort.reduce(
        (acc, elem) => ({
          ...acc,
          [SortTermElasticOptions[elem.by]]:
            elem.direction === SortValueOptions.Ascending ? 1 : -1
        }),
        {}
      )
    : { created: -1 }
}

interface SearchParams {
  text?: string
  owner?: string
  tags?: string
  categories?: string
  page?: string
  offset?: string
  sort?: SortItem[]
  priceType?: string
}

const PriceTypeOptions = {
  Fixed: 'fixed',
  Dynamic: 'dynamic'
}
const PriceTypeElasticOptions = {
  [PriceTypeOptions.Fixed]: 'exchange',
  [PriceTypeOptions.Dynamic]: 'pool'
}
const convertPriceType = (priceType: string) =>
  priceType ? PriceTypeElasticOptions[priceType] : null

const getOwnerTerm = (owner: string) =>
  owner ? `(publicKey.owner:${owner})` : null
const getTagsTerm = (tags: string) =>
  tags
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.tags:\"${tags}\")`
    : null
const getCategoriesTerm = (categories: string) =>
  categories
    ? // eslint-disable-next-line no-useless-escape
      `(service.attributes.additionalInformation.categories:\"${categories}\")`
    : null
const getTextTerm = (text: string) => text || ''
function getSearchTerm(
  owner: string,
  tags: string,
  categories: string,
  text: string
) {
  return (
    getOwnerTerm(owner) ||
    getTagsTerm(tags) ||
    getCategoriesTerm(categories) ||
    getTextTerm(text)
  )
}

function applyFilterOnSearchQuery(searchField: string, priceFilter: string) {
  const searchQuerry = priceFilter
    ? searchField === ''
      ? `price.type:${convertPriceType(priceFilter)}`
      : `${searchField} AND price.type:${convertPriceType(priceFilter)}`
    : searchField
  return searchQuerry
}

function getSearchQuery(params: SearchParams): SearchQuery {
  const {
    text,
    owner,
    tags,
    categories,
    page,
    offset,
    sort,
    priceType
  } = params
  const sortObj = getSortObj(sort)
  let searchTerm = getSearchTerm(owner, tags, categories, text)
  searchTerm = applyFilterOnSearchQuery(searchTerm, priceType)

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
    sort: sortObj
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
  params: SearchParams,
  metadataCacheUri: string
): Promise<QueryResult> {
  const metadataCache = new MetadataCache(metadataCacheUri, Logger)
  const searchQuery = getSearchQuery(params)
  const queryResult = await metadataCache.queryMetadata(searchQuery)
  return queryResult
}
function addParam(name: string, value: any, ret: string[]) {
  if (value) {
    ret.push(`${name}=${value}`)
  }
}
export const makeQueryString = (params: {
  text: string | string[]
  owner: string | string[]
  tags: string | string[]
  page: string | string[]
  priceType: string
  items: SortItem[]
}) => {
  const { text, owner, tags, page, priceType, items } = params
  const ret: string[] = []
  addParam('text', text, ret)
  addParam('tags', tags, ret)
  addParam('owner', owner, ret)
  addParam('page', page, ret)
  addParam('price', priceType, ret)
  if (items) {
    items.map((item: SortItem) => ret.push(`sort=${item.by}:${item.direction}`))
  }
  return ret.join('&')
}
