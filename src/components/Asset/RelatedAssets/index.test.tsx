import { render, screen } from '@testing-library/react'
import React from 'react'
import RelatedAssets from '.'
import { assets } from '../../../../.jest/__fixtures__/datasetsWithAccessDetails'
import { queryMetadata } from '../../../@utils/aquarius'
// import * as userPreferencesMock from '../../../@context/UserPreferences'

jest.mock('../../../@utils/aquarius')
// jest.mock('../../src/@context/UserPreferences', () => ({
//   useUserPreferences: () => ({ chainIds: [1, 2, 3] })
// }))

const queryMetadataBaseReturn: PagedAssets = {
  results: assets,
  page: 1,
  totalPages: 1,
  totalResults: 10,
  aggregations: {}
}

describe('Asset/RelatedAssets', () => {
  beforeAll(() => jest.resetAllMocks())

  it('renders with more than 4 queryMetadata() results', async () => {
    ;(queryMetadata as jest.Mock).mockReturnValue(queryMetadataBaseReturn)
    render(<RelatedAssets />)
    await screen.findByText(assets[0].metadata.name)
  })

  it('renders with 4 queryMetadata() results', async () => {
    ;(queryMetadata as jest.Mock).mockReturnValue({
      ...queryMetadataBaseReturn,
      results: assets.slice(0, 4),
      totalResults: 4
    })
    render(<RelatedAssets />)
    await screen.findByText(assets[0].metadata.name)
  })

  // TODO: figure out how to overwrite already mocked module
  // it('does nothing when no chainIds selected', async () => {
  //   jest
  //     .spyOn(userPreferencesMock, 'useUserPreferences')
  //     .mockReturnValue({ chainIds: [] } as any)

  //   render(<RelatedAssets />)
  //   await screen.findByText('No results found')
  // })

  it('catches queryMetadata errors', async () => {
    ;(queryMetadata as jest.Mock).mockImplementation(() => {
      throw new Error('Hello error')
    })

    // prevent console error from showing up in test log
    const originalError = console.error
    console.error = jest.fn()

    try {
      render(<RelatedAssets />)
    } catch (error) {
      expect(error).toEqual({ message: 'Hello error' })
    }

    console.error = originalError
  })
})
