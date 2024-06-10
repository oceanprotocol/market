import React from 'react'
import { render, screen } from '@testing-library/react'
import ButtonBuy, { ButtonBuyProps } from './'

const downloadProps: ButtonBuyProps = {
  action: 'download',
  disabled: false,
  hasPreviousOrder: false,
  hasDatatoken: false,
  btSymbol: 'btSymbol',
  dtSymbol: 'dtSymbol',
  dtBalance: '100000000000',
  assetTimeout: '1 day',
  assetType: 'Dataset',
  stepText: 'TEST',
  priceType: 'fixed',
  isConsumable: true,
  isBalanceSufficient: true,
  consumableFeedback: 'TEST: consumableFeedback',
  isAccountConnected: true
}

describe('Asset/AssetActions/ButtonBuy', () => {
  //  TESTS FOR LOADING
  it('Renders Buy button without crashing', () => {
    render(<ButtonBuy {...downloadProps} isLoading />)
    const button = screen.getByText('TEST')
    expect(button).toContainHTML('<Loader')
  })

  //  TESTS FOR DOWNLOAD
  it('Renders Buy button without crashing', () => {
    render(<ButtonBuy {...downloadProps} />)
    const button = screen.getByText('Buy for 1 day')
    expect(button).toContainHTML('<button')
  })

  it('Renders Buy button without crashing when hasPreviousOrder=true', () => {
    render(<ButtonBuy {...downloadProps} hasPreviousOrder />)
    const button = screen.getByText('Download')
    expect(button).toContainHTML('<button')
  })

  it('Renders retry button for download without crashing', () => {
    render(<ButtonBuy {...downloadProps} retry />)
    const button = screen.getByText('Retry')
    expect(button).toContainHTML('<button')
  })

  it('Renders get button for free download without crashing', () => {
    render(<ButtonBuy {...downloadProps} priceType="free" hasPreviousOrder />)
    const button = screen.getByText('Download')
    expect(button).toContainHTML('<button')
    expect(
      screen.getByText(
        'This Dataset is free to use. Please note that network gas fees still apply, even when using free assets.'
      )
    ).toBeInTheDocument()
  })

  it('Renders "Get" button for free assets without crashing', () => {
    render(<ButtonBuy {...downloadProps} priceType="free" />)
    const button = screen.getByText('Get')
    expect(button).toContainHTML('<button')
  })

  it('Renders Buy button without crashing', () => {
    render(
      <ButtonBuy
        {...downloadProps}
        assetTimeout="Forever"
        isConsumable={false}
      />
    )
    const button = screen.getByText('Buy')
    expect(button).toContainHTML('<button')
  })
})
