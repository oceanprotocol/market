module.exports = {
  oceanConfig: {
    nodeUri: process.env.NODE_URI || 'https://pacific.oceanprotocol.com',
    aquariusUri:
      process.env.AQUARIUS_URI ||
      'https://aquarius.marketplace.oceanprotocol.com',
    brizoUri:
      process.env.BRIZO_URI || 'https://brizo.marketplace.oceanprotocol.com',
    brizoAddress:
      process.env.BRIZO_ADDRESS || '0x00c6A0BC5cD0078d6Cd0b659E8061B404cfa5704',
    secretStoreUri:
      process.env.SECRET_STORE_URI || 'https://secret-store.oceanprotocol.com',
    faucetUri: process.env.FAUCET_URI || 'https://faucet.oceanprotocol.com',
    ratingUri:
      process.env.RATING_URI ||
      'https://rating.pacific.marketplace.dev-ocean.com',
    verbose: 3
  }
}
