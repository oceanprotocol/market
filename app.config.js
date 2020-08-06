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
  marketFeeAddress: process.env.GATSBY_MARKET_FEE_ADDRESS || '0xxxx',
  marketFeeAmount: process.env.GATSBY_MARKET_FEE_AMOUNT || '0.1' // in %
}

module.exports = {
  getDefaultOceanConfig,
  appConfig
}
