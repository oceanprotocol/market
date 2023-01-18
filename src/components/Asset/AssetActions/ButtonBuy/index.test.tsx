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
  consumableFeedback: 'TEST: consumableFeedback'
}

const computeProps: ButtonBuyProps = {
  action: 'compute',
  disabled: false,
  hasPreviousOrder: false,
  hasDatatoken: false,
  btSymbol: 'btSymbol',
  dtSymbol: 'dtSymbol',
  dtBalance: '100000000000',
  assetTimeout: '1 day',
  assetType: 'algorithm',
  hasPreviousOrderSelectedComputeAsset: false,
  hasDatatokenSelectedComputeAsset: false,
  dtSymbolSelectedComputeAsset: 'dtSymbol',
  dtBalanceSelectedComputeAsset: 'dtBalance',
  selectedComputeAssetType: 'selectedComputeAssetType',
  stepText: ' ',
  isLoading: false,
  type: 'submit',
  priceType: 'fixed',
  algorithmPriceType: 'free',
  isBalanceSufficient: true,
  isConsumable: true,
  consumableFeedback: 'consumableFeedback',
  isAlgorithmConsumable: true,
  hasProviderFee: false,
  retry: false
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

  // TESTS FOR COMPUTE
  it('Renders "Buy Compute Job" button for compute without crashing', () => {
    render(<ButtonBuy {...computeProps} />)
    const button = screen.getByText('Buy Compute Job')
    expect(button).toContainHTML('<button')
  })

  it('Renders correct message for fixed-priced compute asset with free algorithm', () => {
    render(<ButtonBuy {...computeProps} />)
    expect(
      screen.getByText(
        'To use this algorithm, you will buy 1 dtSymbol and immediately send it back to the publisher. Connect to the correct network to interact with this asset. The C2D resources required to start the job are available, no payment is required for them. Please note that network gas fees still apply, even when using free assets.'
      )
    ).toBeInTheDocument()
  })

  it('Renders correct message for free compute asset with free algorithm', () => {
    render(<ButtonBuy {...computeProps} priceType="free" />)
    expect(
      screen.getByText(
        'This algorithm is free to use. Connect to the correct network to interact with this asset. The C2D resources required to start the job are available, no payment is required for them. Please note that network gas fees still apply, even when using free assets.'
      )
    ).toBeInTheDocument()
  })

  it('Renders correct message for free compute asset with free algorithm', () => {
    render(<ButtonBuy {...computeProps} algorithmPriceType="fixed" />)
    expect(
      screen.getByText(
        'To use this algorithm, you will buy 1 dtSymbol and immediately send it back to the publisher. Connect to the correct network to interact with this asset. The C2D resources required to start the job are available, no payment is required for them.'
      )
    ).toBeInTheDocument()
  })

  it('Renders "Buy Compute Job" button for compute without crashing', () => {
    render(<ButtonBuy {...computeProps} hasDatatokenSelectedComputeAsset />)
    const button = screen.getByText('Buy Compute Job')
    expect(button).toContainHTML('<button')
  })

  it('Renders "Start Compute Job" button', () => {
    render(
      <ButtonBuy
        {...computeProps}
        hasPreviousOrder
        hasPreviousOrderSelectedComputeAsset
      />
    )
    const button = screen.getByText('Start Compute Job')
    expect(button).toContainHTML('<button')
  })

  it('Renders "Order Compute Job" button', () => {
    render(<ButtonBuy {...computeProps} priceType="free" hasProviderFee />)
    const button = screen.getByText('Order Compute Job')
    expect(button).toContainHTML('<button')
  })

  it('Renders "Order Compute Job" button', () => {
    render(<ButtonBuy {...computeProps} priceType="free" hasProviderFee />)
    const button = screen.getByText('Order Compute Job')
    expect(button).toContainHTML('<button')
  })

  it('Renders "retry" button for compute without crashing', () => {
    render(<ButtonBuy {...computeProps} retry />)
    const button = screen.getByText('Retry')
    expect(button).toContainHTML('<button')
  })
})
