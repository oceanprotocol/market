import { render, screen } from '@testing-library/react'
import React from 'react'
import Page from './index'

describe('@shared/Page', () => {
  it('renders without crashing', () => {
    render(
      <Page uri="/hello" title="Hello Title" description="Hello Description">
        Hello Children
      </Page>
    )
    expect(screen.getByText('Hello Children')).toBeInTheDocument()
    expect(screen.getByText('Hello Title')).toBeInTheDocument()
    expect(screen.getByText('Hello Description')).toBeInTheDocument()
  })

  it('renders without title', () => {
    render(<Page uri="/hello">Hello Children</Page>)
  })
})
