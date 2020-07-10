import React from 'react'
import testRender from '../testRender'
import Layout from '../../../src/components/Layout'
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from '@reach/router'

describe('Layout', () => {
  const history = createHistory(createMemorySource('/'))

  testRender(
    <LocationProvider history={history}>
      <Layout title="Hello" uri={history.location.href}>
        Hello
      </Layout>
    </LocationProvider>
  )
})
