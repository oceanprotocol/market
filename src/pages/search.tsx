import React, { ReactElement } from 'react'
import PageSearch from '../components/templates/Search'
import { PageProps } from 'gatsby'
import Layout from '../components/Layout'
import queryString from 'query-string'

export default function PageGatsbySearch(props: PageProps): ReactElement {
  const parsed = queryString.parse(props.location.search)
  const { text, tags, categories } = parsed
  const searchValue = text || tags || categories

  return (
    <Layout
      title={`Search for ${searchValue || 'all data sets'}`}
      uri={props.uri}
    >
      <PageSearch location={props.location} />
    </Layout>
  )
}
