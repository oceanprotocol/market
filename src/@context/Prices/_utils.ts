export function getCoingeckoTokenId(symbol: string) {
  const isOcean =
    symbol?.toLowerCase() === 'ocean' || symbol?.toLowerCase() === 'mocean'
  const isH2o =
    symbol?.toLowerCase() === 'h2o' ||
    symbol?.toLowerCase() === 'h20' ||
    symbol?.toLowerCase() === 'h2o_data'
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
