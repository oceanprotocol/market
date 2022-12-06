import { getNetworkType, getNetworkDisplayName } from './utils'

describe('useNetworkMetadata/utils', () => {
  test('getNetworkType returns mainnet', () => {
    const type = getNetworkType({
      name: 'Eth',
      title: 'Eth'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    expect(type).toBe('mainnet')
  })

  test('getNetworkType returns testnet if "Test" is in name', () => {
    const type = getNetworkType({
      name: 'Testnet',
      title: 'Testnet'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    expect(type).toBe('testnet')
  })

  test('getNetworkDisplayName returns correct values', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const type1 = getNetworkDisplayName({
      chainId: 1,
      chain: 'ETH',
      name: 'Ethereum Mainnet'
    } as any)
    expect(type1).toBe('ETH')

    const type2 = getNetworkDisplayName({ chainId: 80001 } as any)
    expect(type2).toBe('Mumbai')

    const type3 = getNetworkDisplayName({ chainId: 8996 } as any)
    expect(type3).toBe('Development')

    const type4 = getNetworkDisplayName({ chainId: 2021000 } as any)
    expect(type4).toBe('GAIA-X')
    /* eslint-enable @typescript-eslint/no-explicit-any */
  })
})
