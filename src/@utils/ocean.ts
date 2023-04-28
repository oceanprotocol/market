import { ConfigHelper, Config } from '@oceanprotocol/lib'

/**
  This function takes a Config object as an input and returns a new sanitized Config object
  The new Config object has the same properties as the input object, but with some values replaced by environment variables if they exist
  Also adds missing contract addresses deployed when running barge locally
  @param {Config} config - The input Config object
  @returns {Config} A new Config object
*/
export function sanitizeDevelopmentConfig(config: Config): Config {
  return {
    subgraphUri: process.env.NEXT_PUBLIC_SUBGRAPH_URI || config.subgraphUri,
    metadataCacheUri:
      process.env.NEXT_PUBLIC_METADATACACHE_URI || config.metadataCacheUri,
    providerUri: process.env.NEXT_PUBLIC_PROVIDER_URL || config.providerUri,
    nodeUri: process.env.NEXT_PUBLIC_RPC_URL || config.nodeUri,
    fixedRateExchangeAddress:
      process.env.NEXT_PUBLIC_FIXED_RATE_EXCHANGE_ADDRESS,
    dispenserAddress: process.env.NEXT_PUBLIC_DISPENSER_ADDRESS,
    oceanTokenAddress: process.env.NEXT_PUBLIC_OCEAN_TOKEN_ADDRESS,
    nftFactoryAddress: process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS
  } as Config
}

export function getOceanConfig(network: string | number): Config {
  let config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      network === 'moonbeamalpha' ||
      network === 1287 ||
      network === 'bsc' ||
      network === 56 ||
      network === 'gaiaxtestnet' ||
      network === 2021000 ||
      network === 8996
      ? undefined
      : process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  ) as Config
  if (network === 8996) {
    config = { ...config, ...sanitizeDevelopmentConfig(config) }
  }
  console.log('oceanConfig', config)
  return config as Config
}
