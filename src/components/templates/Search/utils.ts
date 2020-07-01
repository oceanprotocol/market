import {
  SearchQuery,
  QueryResult
} from '@oceanprotocol/squid/dist/node/aquarius/Aquarius'
import { priceQueryParamToWei } from '../../../utils'
import { Aquarius, Logger } from '@oceanprotocol/squid'
import { config } from '../../../config/ocean'

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

    // Something in squid-js is weird when using 'categories: [type]'
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

  const aquarius = new Aquarius(config.aquariusUri, Logger)
  const queryResult = await aquarius.queryMetadata(
    getSearchQuery(page, offset, text, tag, priceQuery)
  )

  return queryResult
}
