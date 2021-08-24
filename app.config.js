module.exports = {
  // URI of single metadata cache instance for all networks.
  // While ocean.js includes this value for each network as part of its ConfigHelper,
  // it is assumed to be the same for all networks.
  // In components can be accessed with the useSiteMetadata hook:
  // const { appConfig } = useSiteMetadata()
  // return appConfig.metadataCacheUri
  metadataCacheUri:
    process.env.METADATACACHE_URI || 'https://aquarius.oceanprotocol.com',

  // List of chainIds which metadata cache queries will return by default.
  // This preselects the Chains user preferences.
  chainIds: [1, 137, 56],

  // List of all supported chainIds. Used to populate the Chains user preferences list.
  chainIdsSupported: [1, 3, 4, 137, 80001, 1287, 56],

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

  // Used to show or hide the fixed, dynamic or free price options
  // tab to publishers during the price creation.
  allowFixedPricing: process.env.GATSBY_ALLOW_FIXED_PRICING || 'true',
  allowDynamicPricing: process.env.GATSBY_ALLOW_DYNAMIC_PRICING || 'true',
  allowFreePricing: process.env.GATSBY_ALLOW_FREE_PRICING || 'false',

  // Used to show or hide advanced settings button in asset details page
  allowAdvancedSettings: process.env.GATSBY_ALLOW_ADVANCED_SETTINGS || 'false',
  allowAdvancedPublishSettings:
    process.env.GATSBY_ALLOW_ADVANCED_PUBLISH_SETTINGS || 'false',
  credentialType: process.env.GATSBY_CREDENTIAL_TYPE || 'address',

  // Set the default privacy policy to initially display
  // this should be the slug of your default policy markdown file
  defaultPrivacyPolicySlug: '/privacy/en',

  // This enables / disables the use of a GDPR compliant
  // privacy preference center to manage cookies on the market
  // If set to true a gdpr.json file inside the content directory
  // is used to create and show a privacy preference center / cookie banner
  // To learn more about how to configure and use this, please refer to the readme
  // https://github.com/deltaDAO/Ocean-Market/tree/main#-gdpr-compliance
  privacyPreferenceCenter:  process.env.GATSBY_PRIVACY_PREFERENCE_CENTER || 'false'
}
