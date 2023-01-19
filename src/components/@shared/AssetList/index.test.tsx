import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import AssetList from './index'
import { datasetAquarius } from '../../../../.jest/__fixtures__/datasetAquarius'

describe('@shared/AssetList', () => {
  it('renders without crashing', async () => {
    const onPageChange = jest.fn()

    render(
      <AssetList
        assets={[datasetAquarius]}
        showPagination
        page={1}
        totalPages={10}
        onPageChange={onPageChange}
      />
    )
    await screen.findAllByText('OCEAN')
    fireEvent.click(screen.getByLabelText('Page 2'))
    expect(onPageChange).toBeCalled()
  })

  it('renders empty', async () => {
    render(<AssetList assets={[]} showPagination={false} isLoading={false} />)
    await screen.findByText('No results found')
  })

  it('renders loading', async () => {
    render(<AssetList assets={[]} showPagination={false} isLoading />)
  })
})
