import React, { ReactElement, useState } from 'react'
import PageSearch from '../components/templates/Search'
import { PageProps } from 'gatsby'
import Page from '../components/templates/Page'
import queryString from 'query-string'
import { accountTruncate } from '../utils/web3'
import ethereumAddress from 'ethereum-address'

export default function PageGatsbySearch(props: PageProps): ReactElement {
  const parsed = queryString.parse(props.location.search)
  const { text, owner, tags, categories } = parsed
  const [totalResults, setTotalResults] = useState<number>()

  const isETHAddress = ethereumAddress.isAddress(text as string)
  const searchValue =
    (isETHAddress ? accountTruncate(text as string) : text) ||
    tags ||
    categories
  const title = owner
    ? `Published by ${accountTruncate(owner as string)}`
    : `${
        totalResults !== undefined
          ? searchValue && searchValue !== ' '
            ? totalResults === 0
              ? 'No results'
              : totalResults +
                (totalResults > 1 ? ' results' : ' result') +
                ' for ' +
                searchValue
            : totalResults + ' results'
          : 'Searching...'
      }`

  return (
    <Page title={title} uri={props.uri}>
      <PageSearch
        location={props.location}
        setTotalResults={(totalResults) => setTotalResults(totalResults)}
      />
    </Page>
  )
}
