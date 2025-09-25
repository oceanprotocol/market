module.exports = {
  // Usa SIEMPRE el Aquarius del .env primero
  metadataCacheUri:
    process.env.NEXT_PUBLIC_METADATACACHE_URI ||
    'https://aquarius.sepolia.oceanprotocol.com',

  // Redes
  chainIds: [11155111],
  chainIdsSupported: [11155111],

  // Provider: usa la var de provider del .env, NO NODE_URL
  customProviderUrl:
    process.env.NEXT_PUBLIC_PROVIDER_URL ||
    process.env.NEXT_PUBLIC_PROVIDER_URL_11155111 ||
    'https://v4.provider.oceanprotocol.com',

  allowDynamicPricing: process.env.NEXT_PUBLIC_ALLOW_DYNAMIC_PRICING || 'false',
  infuraProjectId: process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || 'xxx',

  oceanTokenAddress: process.env.NEXT_PUBLIC_OCEAN_TOKEN_ADDRESS,
  oceanTokenSymbol: process.env.NEXT_PUBLIC_OCEAN_TOKEN_SYMBOL || 'OCEAN',
  defaultDatatokenCap:
    '115792089237316195423570985008687907853269984665640564039457',
  defaultDatatokenTemplateIndex: 2,

  marketFeeAddress:
    process.env.NEXT_PUBLIC_MARKET_FEE_ADDRESS ||
    '0x9984b2453eC7D99a73A5B3a46Da81f197B753C8d',
  publisherMarketOrderFee:
    process.env.NEXT_PUBLIC_PUBLISHER_MARKET_ORDER_FEE || '0',
  publisherMarketFixedSwapFee:
    process.env.NEXT_PUBLIC_PUBLISHER_MARKET_FIXED_SWAP_FEE || '0',
  consumeMarketOrderFee:
    process.env.NEXT_PUBLIC_CONSUME_MARKET_ORDER_FEE || '0',
  consumeMarketFixedSwapFee:
    process.env.NEXT_PUBLIC_CONSUME_MARKET_FIXED_SWAP_FEE || '0',

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
  coingeckoTokenIds: ['ocean-protocol', 'ethereum', 'matic-network'],

  darkModeConfig: {
    classNameDark: 'dark',
    classNameLight: 'light',
    storageKey: 'oceanDarkMode'
  },

  allowFixedPricing: process.env.NEXT_PUBLIC_ALLOW_FIXED_PRICING || 'true',
  allowFreePricing: process.env.NEXT_PUBLIC_ALLOW_FREE_PRICING || 'true',

  defaultPrivacyPolicySlug: '/privacy/en',
  privacyPreferenceCenter:
    process.env.NEXT_PUBLIC_PRIVACY_PREFERENCE_CENTER || 'false'
}
