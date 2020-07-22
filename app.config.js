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
  infuraProjectId: process.env.GATSBY_INFURA_PROJECT_ID || 'xxx'
}

module.exports = {
  getDefaultOceanConfig,
  appConfig
}
