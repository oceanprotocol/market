import React, { ReactElement } from 'react'
import PageSearch from '../components/templates/Search'
import { PageProps } from 'gatsby'
import Layout from '../components/Layout'
import queryString from 'query-string'
import {
  Router,
  Link,
  createHistory,
  createMemorySource,
  LocationProvider
} from '@reach/router'

export default function PageGatsbySearch(props: PageProps): ReactElement {
  const parsed = queryString.parse(props.location.search)
  const { text, tag } = parsed

  return (
    <Layout title={`Search for ${text || tag}`} location={props.location}>
      <PageSearch location={location} />
    </Layout>
  )
}
