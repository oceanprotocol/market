import React, { ReactElement } from 'react'
import PageSearch from '../components/templates/Search'
import { PageProps } from 'gatsby'
import Layout from '../components/Layout'
import queryString from 'query-string'

export default function PageGatsbySearch(props: PageProps): ReactElement {
  const parsed = queryString.parse(props.location.search)
  const { text, tags } = parsed

  return (
    <Layout title={`Search for '${text || tags}'`} uri={props.uri}>
      <PageSearch location={props.location} />
    </Layout>
  )
}
