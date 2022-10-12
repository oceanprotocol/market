import testRender from '../../../../.jest/testRender'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ExplorerLink from './index'

describe('@shared/ExplorerLink', () => {
  testRender(
    <ExplorerLink networkId={1} path="/tx">
      Hello Link
    </ExplorerLink>
  )

  it('renders without networkId', () => {
    render(
      <ExplorerLink networkId={null} path="/tx">
        Hello Link
      </ExplorerLink>
    )
    expect(screen.getByRole('link')).toHaveTextContent('Hello Link')
  })
})
