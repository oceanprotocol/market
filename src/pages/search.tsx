import React, { ReactElement } from 'react'
import PageSearch from '../components/templates/Search'
import { navigate, PageProps } from 'gatsby'
import Layout from '../components/Layout'
import queryString from 'query-string'
import ethereumAddress from 'ethereum-address'

export default function PageGatsbySearch(props: PageProps): ReactElement {
  const parsed = queryString.parse(props.location.search)
  const { text, owner, tags, categories } = parsed
  const searchValue = text || tags || categories
  const title = owner
    ? `Published by ${owner}`
    : `Search for ${searchValue || 'all data sets'}`

  // Switch to owner search when ETH address in `text` is detected,
  // effectively modifying props.location.
  const isETHAddress = text && ethereumAddress.isAddress(text as string)
  if (isETHAddress) {
    navigate(`/search/?owner=${text}`)
    return null
  }

  return (
    <Layout title={title} uri={props.uri}>
      <PageSearch location={props.location} />
    </Layout>
  )
}
