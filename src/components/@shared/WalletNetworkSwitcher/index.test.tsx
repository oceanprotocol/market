import { render, fireEvent, screen } from '@testing-library/react'
import React from 'react'
import WalletNetworkSwitcher from './'

jest.mock('../../../@utils/web3', () => ({
  addCustomNetwork: () => jest.fn()
}))

describe('@shared/WalletNetworkSwitcher', () => {
  it('renders without crashing', () => {
    render(<WalletNetworkSwitcher />)
  })

  it('switching networks can be invoked', () => {
    render(<WalletNetworkSwitcher />)
    fireEvent.click(screen.getByRole('button'))
  })
})
