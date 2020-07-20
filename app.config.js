const { ConfigHelper } = require('@oceanprotocol/lib')

const networkConfig = new ConfigHelper().getConfig(
  process.env.GATSBY_NETWORK || 'rinkeby'
)

module.exports = {
  oceanConfig: {
    ...networkConfig,
    url: `https://rinkeby.infura.io/${process.env.GATSBY_INFURA_PROJECT_ID}`,
    verbose: 3
  },
  // Main, Rinkeby, Kovan
  // networks: [1, 4, 42],
  networks: [4],
  infuraProjectId: process.env.GATSBY_INFURA_PROJECT_ID || 'xxx',
  marketAddress:
    process.env.GATSBY_MARKET_ADDRESS ||
    '0x36A7f3383A63279cDaF4DfC0F3ABc07d90252C6b'
}
