import { render, screen } from '@testing-library/react'
import React from 'react'
import MostViews from '.'
import axios from 'axios'
import { queryMetadata } from '@utils/aquarius'
import { datasetAquarius } from '../../../../.jest/__fixtures__/datasetAquarius'

jest.mock('axios')
jest.mock('@utils/aquarius')

const axiosMock = axios as jest.Mocked<typeof axios>
const queryMetadataMock = queryMetadata as jest.Mock

const queryMetadataBaseReturn: PagedAssets = {
  results: [datasetAquarius],
  page: 1,
  totalPages: 1,
  totalResults: 1,
  aggregations: {}
}

describe('components/Home/MostViews', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('renders without crashing', async () => {
    axiosMock.get.mockImplementation(() =>
      Promise.resolve({
        data: [{ count: 666, did: datasetAquarius.id }]
      })
    )
    queryMetadataMock.mockResolvedValue(queryMetadataBaseReturn)
    render(<MostViews />)
    await screen.findByText('666')
  })

  it('catches errors', async () => {
    queryMetadataMock.mockImplementation(() => {
      throw new Error('Hello error')
    })

    // prevent console error from showing up in test log
    const originalError = console.error
    console.error = jest.fn()

    try {
      render(<MostViews />)
      await screen.findByText('No results found')
    } catch (error) {
      expect(error).toEqual({ message: 'Hello error' })
    }

    console.error = originalError
  })
})
