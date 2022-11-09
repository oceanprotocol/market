import React from 'react'
import { render, screen } from '@testing-library/react'
import ButtonBuy from './'

test('Renders download button without crashing', async () => {
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
      assetType="Download"
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

test('Renders compute button without crashing', async () => {
  render(
    <ButtonBuy
      action="compute"
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
      assetType="Download"
      stepText=" "
      isLoading={false}
      priceType="fixed"
      isConsumable={true}
      isBalanceSufficient={true}
      consumableFeedback="TEST: consumableFeedback"
      retry={false}
    />
  )

  const button = screen.getByText('Buy Compute Job')
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
      assetType="Download"
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
