module.exports = {
  metadataCacheUri:
    process.env.METADATACACHE_URI ||
    'https://aquarius.mainnet.oceanprotocol.com',

  // List of chainIds which metadata cache queries will return by default.
  // This preselects the Chains user preferences.
  chainIds: [1, 137],

  // List of all supported chainIds. Used to populate the Chains user preferences list.
  chainIdsSupported: [1, 3, 4, 137, 1287],

  rbacUrl: process.env.GATSBY_RBAC_URL,

  infuraProjectId: process.env.GATSBY_INFURA_PROJECT_ID || 'xxx',

  // The ETH address the marketplace fee will be sent to.
  marketFeeAddress:
    process.env.GATSBY_MARKET_FEE_ADDRESS ||
    '0x903322C7E45A60d7c8C3EA236c5beA9Af86310c7',

  // Used for conversion display, can be whatever coingecko API supports
  // see: https://api.coingecko.com/api/v3/simple/supported_vs_currencies
  currencies: [
    'EUR',
    'USD',
    'CAD',
    'GBP',
    'SGD',
    'HKD',
    'CNY',
    'JPY',
    'INR',
    'RUB',
    'ETH',
    'BTC',
    'LINK'
  ],

  // Config for https://github.com/donavon/use-dark-mode
  darkModeConfig: {
    classNameDark: 'dark',
    classNameLight: 'light',
    storageKey: 'oceanDarkMode'
  },

  // Wallets
  portisId: process.env.GATSBY_PORTIS_ID || 'xxx',

  // Used to show or hide the fixed and dynamic price options
  // tab to publishers during the price creation.
  allowFixedPricing: process.env.GATSBY_ALLOW_FIXED_PRICING || 'true',
  allowDynamicPricing: process.env.GATSBY_ALLOW_DYNAMIC_PRICING || 'true'
}
