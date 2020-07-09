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
      <Layout location={{ href: 'https://demo.com' } as Location}>Hello</Layout>
    </LocationProvider>
  )
})
