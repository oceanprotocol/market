import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Search from '../../../src/pages/search'
import ddo from '../__fixtures__/ddo'
import { DDO } from '@oceanprotocol/squid'
import { QueryResult } from '@oceanprotocol/squid/dist/node/aquarius/Aquarius'

describe('Search', () => {
  it('renders without crashing', async () => {
    const queryResult = {
      results: [new DDO(ddo), new DDO(ddo)],
      page: 1,
      totalPages: 10,
      totalResults: 200
    }
    const { container } = render(
      <Search text="Hello" tag="Hello" queryResult={queryResult} />
    )
    expect(container.firstChild).toBeInTheDocument()

    // interact with search bar
    const form = container.querySelector('form')
    const input = container.querySelector('form input')
    const button = container.querySelector('form button')

    input &&
      fireEvent.change(input, {
        target: {
          value: 'Changed Hello'
        }
      })

    button && fireEvent.click(button)
    form && fireEvent.submit(form)

    // interact with pagination
    const pageItem = container.querySelector(
      '.pagination li:nth-child(3) .number'
    )

    pageItem && fireEvent.click(pageItem)
  })

  it('renders empty state', async () => {
    const queryResult: QueryResult = {
      results: [],
      page: 1,
      totalPages: 1,
      totalResults: 0
    }
    const { container } = render(
      <Search text="Hello" tag="Hello" queryResult={queryResult} />
    )
    expect(container.querySelector('.empty')).toBeInTheDocument()
  })
})
