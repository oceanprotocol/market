import React from 'react'
import { NextPage } from 'next'
import { Aquarius, Logger } from '@oceanprotocol/squid'
import { SearchQuery } from '@oceanprotocol/squid/dist/node/aquarius/Aquarius'
import SearchPage, { SearchPageProps } from '../components/templates/Search'
import { config } from '../config/ocean'
import { JSONparse, priceQueryParamToWei } from '../utils'

const Search: NextPage<SearchPageProps> = ({ text, tag, queryResult }) => {
  return <SearchPage text={text} tag={tag} queryResult={queryResult} />
}

export function getSearchQuery(
  page?: string | string[],
  offset?: string | string[],
  text?: string | string[],
  tag?: string | string[],
  priceQuery?: [string | undefined, string | undefined]
) {
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

Search.getInitialProps = async (context) => {
  const { text, tag, page, offset, minPrice, maxPrice } = context.query

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

  const aquarius = new Aquarius(config.aquariusUri as string, Logger)
  const queryResult = await aquarius.queryMetadata(
    getSearchQuery(page, offset, text, tag, priceQuery)
  )

  return {
    text: text,
    tag: tag,
    queryResult
  }
}

export default Search
