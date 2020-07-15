module.exports = {
  oceanConfig: {
    nodeUri:
      process.env.GATSBY_NODE_URI ||
      `https://rinkeby.infura.io/${process.env.GATSBY_INFURA_PROJECT_ID}`,
    metadataStoreUri:
      process.env.GATSBY_METADATA_STORE_URI ||
      'https://aquarius.rinkeby.v3.dev-ocean.com',
    providerUri:
      process.env.GATSBY_PROVIDER_URI ||
      'https://provider.rinkeby.v3.dev-ocean.com',
    factoryAddress:
      process.env.GATSBY_FACTORY_ADDRESS ||
      '0xB9d406D24B310A7D821D0b782a36909e8c925471',
    oceanTokenAddress:
      process.env.GATSBY_OCEAN_TOKEN_ADDRESS ||
      '0x8967BCF84170c91B0d24D4302C2376283b0B3a07',
    verbose: 3
  },
  // Main, Rinkeby, Kovan
  // networks: [1, 4, 42],
  networks: [4],
  infuraProjectId: process.env.GATSBY_INFURA_PROJECT_ID || 'xxx'
}
