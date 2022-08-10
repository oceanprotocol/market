import React, { ReactElement } from 'react'
import { renderHook } from '@testing-library/react'
import { PricesProvider, usePrices, getCoingeckoTokenId } from '.'

test('should correctly initialize data', async () => {
  const wrapper = ({ children }: { children: ReactElement }) => (
    <PricesProvider>{children}</PricesProvider>
  )
  const { result } = renderHook(() => usePrices(), { wrapper })

  expect(result.current.prices['ocean-protocol'].eur).toBeDefined()
})

test('should get correct Coingecko API ID for OCEAN', async () => {
  const id1 = getCoingeckoTokenId('OCEAN')
  expect(id1).toBe('ocean-protocol')

  const id2 = getCoingeckoTokenId('mOCEAN')
  expect(id2).toBe('ocean-protocol')
})
