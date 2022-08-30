//
// Deal with differences between token symbol & Coingecko API IDs
//
export function getCoingeckoTokenId(symbol: string) {
  // can be OCEAN or mOCEAN
  const isOcean = symbol?.toLowerCase().includes('ocean')
  // can be H2O or H20
  const isH2o = symbol?.toLowerCase().includes('h2')
  const isEth = symbol?.toLowerCase() === 'eth'
  const isMatic = symbol?.toLowerCase() === 'matic'

  const priceTokenId = isOcean
    ? 'ocean-protocol'
    : isH2o
    ? 'h2o'
    : isEth
    ? 'ethereum'
    : isMatic
    ? 'matic-network'
    : symbol?.toLowerCase()

  return priceTokenId
}
