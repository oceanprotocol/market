import {
  SearchQuery,
  QueryResult
} from '@oceanprotocol/lib/dist/node/metadatastore/MetadataStore'
import { priceQueryParamToWei } from '../../../utils'
import { MetadataStore, Logger } from '@oceanprotocol/lib'
import { oceanConfig } from '../../../../app.config'

export function getSearchQuery(
  page?: string | string[],
  offset?: string | string[],
  text?: string | string[],
  tag?: string | string[],
  priceQuery?: [string | undefined, string | undefined]
): SearchQuery {
  return {
    page: Number(page) || 1,
    offset: Number(offset) || 20,
    query: {
      text,
      tags: tag ? [tag] : undefined,
      price: priceQuery
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

export async function getResults(params: any): Promise<QueryResult> {
  const { text, tag, page, offset, minPrice, maxPrice } = params

  const minPriceParsed = priceQueryParamToWei(
    minPrice as string,
    'Error parsing context.query.minPrice'
  )
  const maxPriceParsed = priceQueryParamToWei(
    maxPrice as string,
    'Error parsing context.query.maxPrice'
  )
  const priceQuery =
    minPriceParsed || maxPriceParsed
      ? // sometimes TS gets a bit silly
        ([minPriceParsed, maxPriceParsed] as [
          string | undefined,
          string | undefined
        ])
      : undefined

  const metadataStore = new MetadataStore(oceanConfig.metadataStoreUri, Logger)
  const queryResult = await metadataStore.queryMetadata(
    getSearchQuery(page, offset, text, tag, priceQuery)
  )

  return queryResult
}
