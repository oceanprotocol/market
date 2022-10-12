import { render, screen } from '@testing-library/react'
import React from 'react'
import Web3Feedback from './'

jest.mock('../../../@hooks/useGraphSyncStatus', () => ({
  useGraphSyncStatus: () => ({
    isGraphSynced: true,
    blockGraph: '333333',
    blockHead: '333333'
  })
}))

describe('@shared/Web3Feedback', () => {
  it('renders without crashing', () => {
    render(<Web3Feedback networkId={1} />)
  })

  it('renders isAssetNetwork === false', async () => {
    render(<Web3Feedback networkId={1} isAssetNetwork={false} />)
    expect(
      await screen.findByText('Not connected to asset network')
    ).toBeInTheDocument()
  })

  // it('renders isGraphSynced === false', async () => {
  //   jest.mock('../../../@hooks/useGraphSyncStatus', () => ({
  //     useGraphSyncStatus: () => ({
  //       isGraphSynced: false,
  //       blockGraph: '333333',
  //       blockHead: '333333'
  //     })
  //   }))
  //   render(<Web3Feedback networkId={1} isAssetNetwork={true} />)
  //   expect(await screen.findByText('Data out of sync')).toBeInTheDocument()
  // })
})
