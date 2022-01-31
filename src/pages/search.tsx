import React, { ReactElement, useState } from 'react'
import Search from '../components/Search'
import Page from '@shared/Page'
import { accountTruncate } from '@utils/web3'
import { MAXIMUM_NUMBER_OF_PAGES_WITH_RESULTS } from '@utils/aquarius'
import { useRouter } from 'next/router'
import web3 from 'web3'

export default function PageSearch(): ReactElement {
  const router = useRouter()
  const parsed = router.query
  const { text, owner, tags, categories } = parsed
  const [totalResults, setTotalResults] = useState<number>()
  const [totalPagesNumber, setTotalPagesNumber] = useState<number>()

  const isETHAddress = web3.utils.isAddress(text as string)
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
    <Page
      title={
        totalPagesNumber > MAXIMUM_NUMBER_OF_PAGES_WITH_RESULTS
          ? `>10000 results ${
              searchValue && searchValue !== ' ' ? `for ${searchValue}` : ''
            }`
          : title
      }
      description={
        totalPagesNumber &&
        totalPagesNumber > MAXIMUM_NUMBER_OF_PAGES_WITH_RESULTS
          ? '**Results displayed are limited to the first 10k, please refine your search.**'
          : undefined
      }
      uri={router.route}
    >
      <Search
        setTotalResults={setTotalResults}
        setTotalPagesNumber={setTotalPagesNumber}
      />
    </Page>
  )
}
