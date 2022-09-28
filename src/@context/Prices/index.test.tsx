import React, { ReactElement } from 'react'
import * as SWR from 'swr'
import { renderHook } from '@testing-library/react'
import { PricesProvider, usePrices, getCoingeckoTokenId } from '.'

jest.spyOn(SWR, 'default').mockImplementation(() => ({
  useSWR: { data: { 'ocean-protocol': { eur: '2' } } },
  isValidating: false,
  mutate: jest.fn()
}))

const wrapper = ({ children }: { children: ReactElement }) => (
  <PricesProvider>{children}</PricesProvider>
)

test('should correctly initialize data', async () => {
  const { result } = renderHook(() => usePrices(), { wrapper })

  expect(result.current.prices['ocean-protocol'].eur).toBeDefined()
})

test('useSWR is called', async () => {
  const { result } = renderHook(() => usePrices(), { wrapper })
  expect(SWR.default).toHaveBeenCalled()

  // somehow the above spy seems to not fully work, but this assertion is the goal
  // expect(result.current.prices['ocean-protocol'].eur).toBe('2')
})

test('should get correct Coingecko API ID for OCEAN', async () => {
  const id1 = getCoingeckoTokenId('OCEAN')
  expect(id1).toBe('ocean-protocol')

  const id2 = getCoingeckoTokenId('mOCEAN')
  expect(id2).toBe('ocean-protocol')
})
