const { ConfigHelper } = require('@oceanprotocol/lib')

function getDefaultOceanConfig() {
  return new ConfigHelper().getConfig(
    process.env.GATSBY_NETWORK || 'rinkeby',
    process.env.GATSBY_INFURA_PROJECT_ID
  )
}

const appConfig = {
  oceanConfig: {
    ...getDefaultOceanConfig(),
    verbose: 3
  },
  // Main, Rinkeby, Kovan
  // networks: [1, 4, 42],
  networks: [4],
  infuraProjectId: process.env.GATSBY_INFURA_PROJECT_ID || 'xxx'
}

module.exports = {
  getDefaultOceanConfig,
  appConfig
}
