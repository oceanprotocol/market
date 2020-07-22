const { ConfigHelper } = require('@oceanprotocol/lib')

const oceanConfig = new ConfigHelper().getConfig(
  process.env.GATSBY_NETWORK || 'rinkeby'
)

module.exports = {
  oceanConfig: {
    ...oceanConfig,
    url: `https://rinkeby.infura.io/${process.env.GATSBY_INFURA_PROJECT_ID}`,
    verbose: 3
  },
  // Main, Rinkeby, Kovan
  // networks: [1, 4, 42],
  networks: [4],
  infuraProjectId: process.env.GATSBY_INFURA_PROJECT_ID || 'xxx'
}
