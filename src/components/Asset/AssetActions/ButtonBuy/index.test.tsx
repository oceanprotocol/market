import React from 'react'
import { render, screen } from '@testing-library/react'
import ButtonBuy from './'

//  TESTS FOR DOWNLOAD
test('Renders Buy button without crashing', async () => {
  render(
    <ButtonBuy
      action="download"
      disabled={false}
      hasPreviousOrder={false}
      hasDatatoken={false}
      btSymbol="btSymbol"
      dtSymbol="dtSymbol"
      dtBalance="100000000000"
      onClick={() => {
        console.log('TEST')
      }}
      assetTimeout="1 day"
      assetType="Dataset"
      stepText=" "
      isLoading={false}
      priceType="fixed"
      isConsumable={true}
      isBalanceSufficient={true}
      consumableFeedback="TEST: consumableFeedback"
      retry={false}
    />
  )

  const button = screen.getByText('Buy for 1 day')
  expect(button).toContainHTML('<button')
})

test('Renders Buy button without crashing when hasPreviousOrder=true', async () => {
  render(
    <ButtonBuy
      action="download"
      disabled={false}
      hasPreviousOrder={true}
      hasDatatoken={false}
      btSymbol="btSymbol"
      dtSymbol="dtSymbol"
      dtBalance="100000000000"
      onClick={() => {
        console.log('TEST')
      }}
      assetTimeout="1 day"
      assetType="Dataset"
      stepText=" "
      isLoading={false}
      priceType="fixed"
      isConsumable={true}
      isBalanceSufficient={true}
      consumableFeedback="TEST: consumableFeedback"
      retry={false}
    />
  )

  const button = screen.getByText('Download')
  expect(button).toContainHTML('<button')
})

test('Renders retry button for download without crashing', async () => {
  render(
    <ButtonBuy
      action="download"
      disabled={false}
      hasPreviousOrder={false}
      hasDatatoken={false}
      btSymbol="btSymbol"
      dtSymbol="dtSymbol"
      dtBalance="100000000000"
      onClick={() => {
        console.log('TEST')
      }}
      assetTimeout="1 day"
      assetType="Dataset"
      stepText=" "
      isLoading={false}
      priceType="fixed"
      isConsumable={true}
      isBalanceSufficient={true}
      consumableFeedback="TEST: consumableFeedback"
      retry={true}
    />
  )

  const button = screen.getByText('Retry')
  expect(button).toContainHTML('<button')
})

test('Renders download button for download without crashing', async () => {
  render(
    <ButtonBuy
      action="download"
      disabled={false}
      hasPreviousOrder={true}
      hasDatatoken={false}
      btSymbol="btSymbol"
      dtSymbol="dtSymbol"
      dtBalance="100000000000"
      onClick={() => {
        console.log('TEST')
      }}
      assetTimeout="1 day"
      assetType="Dataset"
      stepText=" "
      isLoading={false}
      priceType="fixed"
      isConsumable={false}
      isBalanceSufficient={true}
      consumableFeedback="TEST: consumableFeedback"
      retry={false}
    />
  )

  const button = screen.getByText('Download')
  expect(button).toContainHTML('<button')
})

test('Renders get button for free download without crashing', async () => {
  render(
    <ButtonBuy
      action="download"
      disabled={false}
      hasPreviousOrder={false}
      hasDatatoken={false}
      btSymbol="btSymbol"
      dtSymbol="dtSymbol"
      dtBalance="100000000000"
      onClick={() => {
        console.log('TEST')
      }}
      assetTimeout="1 day"
      assetType="Dataset"
      stepText=" "
      isLoading={false}
      priceType="free"
      isConsumable={false}
      isBalanceSufficient={true}
      consumableFeedback="TEST: consumableFeedback"
      retry={false}
    />
  )

  const button = screen.getByText('Get')
  expect(button).toContainHTML('<button')
})

// TESTS FOR COMPUTE

test('Renders "Buy Compute Job" button for compute without crashing', async () => {
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
      retry={false}
    />
  )

  const button = screen.getByText('Buy Compute Job')
  expect(button).toContainHTML('<button')
})

test('Renders "Start Compute Job" button', async () => {
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

test('Renders "Order Compute Job" button', async () => {
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

test('Renders "retry" button for compute without crashing', async () => {
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
