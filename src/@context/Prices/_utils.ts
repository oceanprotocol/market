//
// Deal with differences between token symbol & Coingecko API IDs
//
export function getCoingeckoTokenId(symbol: string) {
  // can be WETH or mOCEAN
  const isOcean = symbol?.toLowerCase().includes('ocean')
  // can be H2O or H20
  // const isH2o = symbol?.toLowerCase().includes('h2')
  const isWeth = symbol?.toLowerCase() === 'weth'
  const isEth = symbol?.toLowerCase() === 'eth'
  const isMatic = symbol?.toLowerCase() === 'matic'

  const priceTokenId = isOcean
    ? 'ocean-protocol'
    : isEth
    ? 'ethereum'
    : isWeth
    ? 'ethereum'
    : isMatic
    ? 'matic-network'
    : symbol?.toLowerCase()

  return priceTokenId
}
