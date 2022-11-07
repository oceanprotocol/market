import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import testRender from '../../../../.jest/testRender'
import AddToken from './index'

jest.mock('../../../@utils/web3', () => ({ addTokenToWallet: jest.fn() }))

describe('@shared/AddToken', () => {
  const propsBase = {
    address: '0xd8992Ed72C445c35Cb4A2be468568Ed1079357c8',
    symbol: 'OCEAN'
  }
  testRender(<AddToken {...propsBase} />)

  it('renders with custom text', () => {
    render(<AddToken {...propsBase} text="Hello Text" />)
    expect(screen.getByText('Hello Text')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))
  })

  it('renders minimal', () => {
    render(<AddToken {...propsBase} minimal />)
  })
})
