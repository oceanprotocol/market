// chains.config.cjs
// Mapa por chainId (no array).
// Valores públicos de Sepolia usados por Ocean Market v4.

module.exports = {
  11155111: {
    chainId: 11155111,
    network: 'Ethereum Sepolia',
    isDefault: true,
    isCustom: true,

    // Token base
    oceanTokenSymbol: 'OCEAN',
    oceanTokenAddress: '0x1B083D8584dd3e6Ff37d04a6e7e82b5F622f3985',

    // Contratos públicos en Sepolia
    nftFactoryAddress: '0xEF62FB495266C72a5212A11Dce8baa79Ec0ABeB1',
    fixedRateExchangeAddress: '0x80E63f73cAc60c1662f27D2DFd2EA834acddBaa8',
    dispenserAddress: '0x2720d405ef7cDC8a2E2e5AeBC8883C99611d893C',
    opfCommunityFeeCollector: '0x69B6E54Ad2b3c2801d11d8Ad56ea1d892555b776',

    // RPC (pon tu INFURA real: usa el de tu .env)
    nodeUri:
      process.env.NEXT_PUBLIC_RPC_URI ||
      `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`,

    // Provider público v4 y su address para Sepolia
    providerUri:
      process.env.NEXT_PUBLIC_PROVIDER_URL ||
      'https://v4.provider.oceanprotocol.com',
    // Dirección del provider para 11155111 (vista en el / root del provider v4)
    providerAddress: '0x00c6A0BC5cD0078d6Cd0b659E8061B404cfa5704',

    // Aquarius & Subgraph públicos de Sepolia
    metadataCacheUri:
      process.env.NEXT_PUBLIC_METADATACACHE_URI ||
      'https://aquarius.sepolia.oceanprotocol.com',
    subgraphUri:
      process.env.NEXT_PUBLIC_SUBGRAPH_URI ||
      'https://subgraph.sepolia.oceanprotocol.com',

    explorerUri: 'https://sepolia.etherscan.io',

    // Opcionales (seguros):
    startBlock: 3722802,
    transactionBlockTimeout: 50,
    transactionConfirmationBlocks: 1,
    transactionPollingTimeout: 750,
    gasFeeMultiplier: 1.1
  }
}
