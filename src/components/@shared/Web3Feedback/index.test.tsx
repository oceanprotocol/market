import { render, screen } from '@testing-library/react'
import React from 'react'
import Web3Feedback from './'

describe('@shared/Web3Feedback', () => {
  it('renders without crashing', () => {
    render(<Web3Feedback networkId={1} accountId="0xxxx" />)
  })

  it('renders isAssetNetwork === false', async () => {
    render(
      <Web3Feedback networkId={1} accountId="0xxxx" isAssetNetwork={false} />
    )
    expect(
      await screen.findByText('Not connected to asset network')
    ).toBeInTheDocument()
  })

  it('renders isGraphSynced === false', async () => {
    render(
      <Web3Feedback networkId={1} accountId="0xxxx" isAssetNetwork={true} />
    )
    expect(await screen.findByText('Data out of sync')).toBeInTheDocument()
  })

  it('renders no account', async () => {
    render(<Web3Feedback networkId={1} accountId={undefined} />)
    expect(await screen.findByText('No account connected')).toBeInTheDocument()
  })

  it('do nothing if nothing to show', async () => {
    render(
      <Web3Feedback networkId={1} accountId="0xxxx" isAssetNetwork={true} />
    )
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
