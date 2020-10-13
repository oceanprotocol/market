module.exports = {
  network: process.env.GATSBY_NETWORK || 'rinkeby',
  infuraProjectId: process.env.GATSBY_INFURA_PROJECT_ID || 'xxx',
  metadataCacheUri: process.env.GATSBY_METADATA_CACHE_URI,
  // The ETH address the marketplace fee will be sent to.
  marketFeeAddress:
    process.env.GATSBY_MARKET_FEE_ADDRESS ||
    '0x903322C7E45A60d7c8C3EA236c5beA9Af86310c7',
  // Used for conversion display, can be whatever coingecko API supports
  // see: https://api.coingecko.com/api/v3/simple/supported_vs_currencies
  currencies: ['EUR', 'USD', 'ETH', 'BTC']
}
