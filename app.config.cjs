module.exports = {
  // URI of single metadata cache instance for all networks.
  // While ocean.js includes this value for each network as part of its ConfigHelper,
  // it is assumed to be the same for all networks.
  // In components can be accessed with the useMarketMetadata hook:
  // const { appConfig } = useMarketMetadata()
  // return appConfig.metadataCacheUri
  metadataCacheUri:
    process.env.NEXT_PUBLIC_NODE_URL ||
    'https://2.c2d.nodes.oceanprotocol.com:8000',

  // This preselects the Chains user preferences.
  chainIds: [1, 10, 137, 11155111],

  chainIdsSupported: [1, 10, 137, 11155111],

  customProviderUrl: process.env.NEXT_PUBLIC_NODE_URL,
  allowDynamicPricing: process.env.NEXT_PUBLIC_ALLOW_DYNAMIC_PRICING || 'false',
  infuraProjectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || 'xxx',

  oceanTokenAddress: process.env.NEXT_PUBLIC_OCEAN_TOKEN_ADDRESS,
  oceanTokenSymbol: process.env.NEXT_PUBLIC_OCEAN_TOKEN_SYMBOL || 'WETH',
  defaultDatatokenCap:
    '115792089237316195423570985008687907853269984665640564039457',
  defaultDatatokenTemplateIndex: 2,
  // The ETH address the marketplace fee will be sent to.
  marketFeeAddress:
    process.env.NEXT_PUBLIC_MARKET_FEE_ADDRESS ||
    '0x9984b2453eC7D99a73A5B3a46Da81f197B753C8d',
  // publisher market fee that is taken upon ordering an asset, it is an absolute value, it is declared on erc20 creation
  publisherMarketOrderFee:
    process.env.NEXT_PUBLIC_PUBLISHER_MARKET_ORDER_FEE || '0',
  // fee recieved by the publisher market when a dt is bought from a fixed rate exchange, percent
  publisherMarketFixedSwapFee:
    process.env.NEXT_PUBLIC_PUBLISHER_MARKET_FIXED_SWAP_FEE || '0',

  // consume market fee that is taken upon ordering an asset, it is an absolute value, it is specified on order
  consumeMarketOrderFee:
    process.env.NEXT_PUBLIC_CONSUME_MARKET_ORDER_FEE || '0',
  // fee recieved by the consume market when a dt is bought from a fixed rate exchange, percent
  consumeMarketFixedSwapFee:
    process.env.NEXT_PUBLIC_CONSUME_MARKET_FIXED_SWAP_FEE || '0',

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

  // Tokens to fetch the spot prices from coingecko, against above currencies.
  // Refers to Coingecko API tokenIds.
  coingeckoTokenIds: ['ocean-protocol', 'ethereum', 'matic-network'],

  // Config for https://github.com/oceanprotocol/use-dark-mode
  darkModeConfig: {
    classNameDark: 'dark',
    classNameLight: 'light',
    storageKey: 'oceanDarkMode'
  },

  // Used to show or hide the fixed or free price options
  // tab to publishers during the price creation.
  allowFixedPricing: process.env.NEXT_PUBLIC_ALLOW_FIXED_PRICING || 'true',
  allowFreePricing: process.env.NEXT_PUBLIC_ALLOW_FREE_PRICING || 'true',

  // Set the default privacy policy to initially display
  // this should be the slug of your default policy markdown file
  defaultPrivacyPolicySlug: '/privacy/en',

  // This enables / disables the use of a GDPR compliant
  // privacy preference center to manage cookies on the market
  // If set to true a gdpr.json file inside the content directory
  // is used to create and show a privacy preference center / cookie banner
  // To learn more about how to configure and use this, please refer to the readme
  privacyPreferenceCenter:
    process.env.NEXT_PUBLIC_PRIVACY_PREFERENCE_CENTER || 'false',

  // Approved base tokens configuration
  approvedBaseTokens: {
    autoAddWETH: true,
    customTokens: {
      // 1: [{ address: '0x...', name: 'Custom Token', symbol: 'CT', decimals: 18 }],
      // 137: [{ address: '0x...', name: 'Custom Token', symbol: 'CT', decimals: 18 }]
    }
  }
}
