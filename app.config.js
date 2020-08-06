const { ConfigHelper } = require('@oceanprotocol/lib')

const network = process.env.GATSBY_NETWORK || 'rinkeby'

function getDefaultOceanConfig() {
  return new ConfigHelper().getConfig(
    network,
    process.env.GATSBY_INFURA_PROJECT_ID
  )
}

const appConfig = {
  oceanConfig: {
    ...getDefaultOceanConfig(),
    verbose: 3
  },
  network,
  infuraProjectId: process.env.GATSBY_INFURA_PROJECT_ID || 'xxx',
  marketFeeAddress:
    process.env.GATSBY_MARKET_FEE_ADDRESS ||
    '0x903322C7E45A60d7c8C3EA236c5beA9Af86310c7',
  marketFeeAmount: process.env.GATSBY_MARKET_FEE_AMOUNT || '0.1' // in %
}

module.exports = {
  getDefaultOceanConfig,
  appConfig
}
