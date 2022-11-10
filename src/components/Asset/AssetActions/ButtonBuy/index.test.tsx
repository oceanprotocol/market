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
  hasDatatoken: true,
  btSymbol: 'btSymbol',
  dtSymbol: 'dtSymbol',
  dtBalance: '100000000000',
  assetTimeout: '1 day',
  assetType: 'algorithm',
  hasPreviousOrderSelectedComputeAsset: false,
  hasDatatokenSelectedComputeAsset: true,
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
  it('Renders Buy button without crashing', async () => {
    render(<ButtonBuy {...downloadProps} isLoading />)

    const button = screen.getByText('TEST')
    expect(button).toContainHTML('<Loader')
  })

  //  TESTS FOR DOWNLOAD
  it('Renders Buy button without crashing', async () => {
    render(<ButtonBuy {...downloadProps} />)

    const button = screen.getByText('Buy for 1 day')
    expect(button).toContainHTML('<button')
  })

  it('Renders Buy button without crashing when hasPreviousOrder=true', async () => {
    downloadProps.hasPreviousOrder = true
    render(<ButtonBuy {...downloadProps} />)

    const button = screen.getByText('Download')
    expect(button).toContainHTML('<button')
  })

  it('Renders retry button for download without crashing', async () => {
    render(<ButtonBuy {...downloadProps} retry />)

    const button = screen.getByText('Retry')
    expect(button).toContainHTML('<button')
  })

  it('Renders get button for free download without crashing', async () => {
    downloadProps.priceType = 'free'
    downloadProps.hasPreviousOrder = true
    render(<ButtonBuy {...downloadProps} />)

    const button = screen.getByText('Download')
    expect(button).toContainHTML('<button')
  })

  it('Renders "Get" button for free assets without crashing', async () => {
    downloadProps.priceType = 'free'
    downloadProps.hasPreviousOrder = false
    render(<ButtonBuy {...downloadProps} />)

    const button = screen.getByText('Get')
    expect(button).toContainHTML('<button')
  })

  it('Renders Buy button without crashing', async () => {
    downloadProps.assetTimeout = 'Forever'
    downloadProps.priceType = 'fixed'
    downloadProps.isConsumable = false

    render(<ButtonBuy {...downloadProps} />)
    const button = screen.getByText('Buy')
    expect(button).toContainHTML('<button')
  })

  // TESTS FOR COMPUTE

  it('Renders "Buy Compute Job" button for compute without crashing', async () => {
    render(<ButtonBuy {...computeProps} />)

    const button = screen.getByText('Buy Compute Job')
    expect(button).toContainHTML('<button')
  })

  it('Renders "Buy Compute Job" button for compute without crashing', async () => {
    render(
      <ButtonBuy
        action="compute"
        disabled={false}
        hasPreviousOrder={false}
        hasDatatoken={true}
        btSymbol="btSymbol"
        dtSymbol="dtSymbol"
        dtBalance="100000000000"
        assetTimeout="1 day"
        assetType="algorithm"
        hasPreviousOrderSelectedComputeAsset={false}
        hasDatatokenSelectedComputeAsset={false}
        dtSymbolSelectedComputeAsset="dtSymbol"
        dtBalanceSelectedComputeAsset="dtBalance"
        selectedComputeAssetType="selectedComputeAssetType"
        stepText=" "
        isLoading={false}
        type="submit"
        priceType="fixed"
        algorithmPriceType="free"
        isBalanceSufficient={true}
        isConsumable={true}
        consumableFeedback="consumableFeedback"
        isAlgorithmConsumable={true}
        hasProviderFee={false}
        retry={false}
      />
    )

    const button = screen.getByText('Buy Compute Job')
    expect(button).toContainHTML('<button')
  })

  it('Renders "Start Compute Job" button', async () => {
    render(
      <ButtonBuy
        action="compute"
        disabled={false}
        hasPreviousOrder={true}
        hasDatatoken={true}
        btSymbol="btSymbol"
        dtSymbol="dtSymbol"
        dtBalance="100000000000"
        assetTimeout="1 day"
        assetType="algorithm"
        hasPreviousOrderSelectedComputeAsset={true}
        hasDatatokenSelectedComputeAsset={false}
        dtSymbolSelectedComputeAsset="dtSymbol"
        dtBalanceSelectedComputeAsset="dtBalance"
        selectedComputeAssetType="selectedComputeAssetType"
        stepText=" "
        isLoading={false}
        type="submit"
        priceType="fixed"
        algorithmPriceType="free"
        isBalanceSufficient={true}
        isConsumable={true}
        consumableFeedback="consumableFeedback"
        isAlgorithmConsumable={true}
        hasProviderFee={false}
        retry={false}
      />
    )

    const button = screen.getByText('Start Compute Job')
    expect(button).toContainHTML('<button')
  })

  it('Renders "Order Compute Job" button', async () => {
    render(
      <ButtonBuy
        action="compute"
        disabled={false}
        hasPreviousOrder={true}
        hasDatatoken={true}
        btSymbol="btSymbol"
        dtSymbol="dtSymbol"
        dtBalance="100000000000"
        assetTimeout="1 day"
        assetType="algorithm"
        hasPreviousOrderSelectedComputeAsset={true}
        hasDatatokenSelectedComputeAsset={false}
        dtSymbolSelectedComputeAsset="dtSymbol"
        dtBalanceSelectedComputeAsset="dtBalance"
        selectedComputeAssetType="selectedComputeAssetType"
        stepText=" "
        isLoading={false}
        type="submit"
        priceType="free"
        algorithmPriceType="free"
        isBalanceSufficient={true}
        isConsumable={true}
        consumableFeedback="consumableFeedback"
        isAlgorithmConsumable={true}
        hasProviderFee={true}
        retry={false}
      />
    )

    const button = screen.getByText('Order Compute Job')
    expect(button).toContainHTML('<button')
  })

  it('Renders "Order Compute Job" button', async () => {
    render(
      <ButtonBuy
        action="compute"
        disabled={false}
        hasPreviousOrder={true}
        hasDatatoken={true}
        btSymbol="btSymbol"
        dtSymbol="dtSymbol"
        dtBalance="100000000000"
        assetTimeout="1 day"
        assetType="algorithm"
        hasPreviousOrderSelectedComputeAsset={true}
        hasDatatokenSelectedComputeAsset={true}
        dtSymbolSelectedComputeAsset="dtSymbol"
        dtBalanceSelectedComputeAsset="dtBalance"
        selectedComputeAssetType="selectedComputeAssetType"
        stepText=" "
        isLoading={false}
        type="submit"
        priceType="free"
        algorithmPriceType="free"
        isBalanceSufficient={false}
        isConsumable={true}
        consumableFeedback="consumableFeedback"
        isAlgorithmConsumable={true}
        hasProviderFee={true}
        retry={false}
      />
    )

    const button = screen.getByText('Order Compute Job')
    expect(button).toContainHTML('<button')
  })

  it('Renders "retry" button for compute without crashing', async () => {
    render(
      <ButtonBuy
        action="compute"
        disabled={false}
        hasPreviousOrder={false}
        hasDatatoken={true}
        btSymbol="btSymbol"
        dtSymbol="dtSymbol"
        dtBalance="100000000000"
        assetTimeout="1 day"
        assetType="algorithm"
        hasPreviousOrderSelectedComputeAsset={false}
        hasDatatokenSelectedComputeAsset={true}
        dtSymbolSelectedComputeAsset="dtSymbol"
        dtBalanceSelectedComputeAsset="dtBalance"
        selectedComputeAssetType="selectedComputeAssetType"
        stepText=" "
        isLoading={false}
        type="submit"
        priceType="fixed"
        algorithmPriceType="free"
        isBalanceSufficient={true}
        isConsumable={true}
        consumableFeedback="consumableFeedback"
        isAlgorithmConsumable={true}
        hasProviderFee={false}
        retry={true}
      />
    )

    const button = screen.getByText('Retry')
    expect(button).toContainHTML('<button')
  })
})
