import React from 'react'
import testRender from '../testRender'
import Page from '../../../src/components/templates/Page'
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from '@reach/router'

describe('Page', () => {
  const history = createHistory(createMemorySource('/'))

  testRender(
    <LocationProvider history={history}>
      <Page title="Hello" uri={history.location.href}>
        Hello
      </Page>
    </LocationProvider>
  )
})
