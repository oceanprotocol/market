import React, { ReactElement, useState, useEffect } from 'react'
import {
  QueryResult,
  SearchQuery
} from '@oceanprotocol/squid/dist/node/aquarius/Aquarius'
import SearchBar from '../molecules/SearchBar'
import AssetList from '../organisms/AssetList'
import { SearchPriceFilter } from '../molecules/SearchPriceFilter'

import styles from './Search.module.css'
import { priceQueryParamToWei } from '../../utils'
import { Aquarius, Logger } from '@oceanprotocol/squid'
import { config } from '../../config/ocean'
import queryString from 'query-string'

export declare type SearchPageProps = {
  text: string | string[]
  tag: string | string[]
  queryResult: QueryResult
}

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

export default function SearchPage({
  location
}: {
  location: Location
}): ReactElement {
  const parsed = queryString.parse(location.search)
  const { text, tag } = parsed
  const [queryResult, setQueryResult] = useState<QueryResult>()

  useEffect(() => {
    async function initSearch() {
      const results = await getResults(parsed)
      setQueryResult(results)
    }
    initSearch()
  }, [])

  return (
    <section className={styles.grid}>
      <div className={styles.search}>
        {text && <SearchBar initialValue={text as string} />}
      </div>

      <aside className={styles.side}>
        <SearchPriceFilter />
      </aside>

      <div className={styles.results}>
        {queryResult && queryResult.results.length > 0 ? (
          <AssetList queryResult={queryResult} />
        ) : (
          <div className={styles.empty}>No results found.</div>
        )}
      </div>
    </section>
  )
}
