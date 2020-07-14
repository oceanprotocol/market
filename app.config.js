module.exports = {
  oceanConfig: {
    nodeUri: process.env.NODE_URI || 'https://pacific.oceanprotocol.com',
    metadataStoreUri:
      process.env.METADATA_STORE_URI ||
      'https://aquarius.marketplace.oceanprotocol.com',
    providerUri:
      process.env.PROVIDER_URI || 'https://brizo.marketplace.oceanprotocol.com',
    factoryAddress:
      process.env.FACTORY_ADDRESS ||
      '0x00c6A0BC5cD0078d6Cd0b659E8061B404cfa5704',
    verbose: 3
  },
  // Main, Rinkeby, Kovan
  networks: [1, 4, 42],
  infuraProjectId: process.env.GATSBY_INFURA_PROJECT_ID
}
