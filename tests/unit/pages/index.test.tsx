import React from 'react'
import { render } from '@testing-library/react'
import Home from '../../../src/components/pages/Home'
import {
  createHistory,
  createMemorySource,
  LocationProvider
} from '@reach/router'

describe('Home', () => {
  it('renders without crashing', () => {
    const history = createHistory(createMemorySource('/search?text=water'))

    const { container } = render(
      <LocationProvider history={history}>
        <Home />
      </LocationProvider>
    )
    expect(container.firstChild).toBeInTheDocument()
  })
})
