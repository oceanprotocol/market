export function chainIdToNetworkName(chainId: number): string {
  switch (chainId) {
    case 1:
      return 'Ethereum'
    case 137:
      return 'Polygon'
    case 56:
      return 'Binance Smart Chain'
    case 1285:
      return 'Moonriver'
    case 246:
      return 'Energy Web Chain'
    case 80001:
      return 'Mumbai'
    case 8996:
      return 'Development'
    case 5:
      return 'Görli'
    case 2021000:
      return 'GAIA-X'
    default:
      return 'Unknown Network'
  }
}
