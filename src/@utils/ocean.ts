import { ConfigHelper, Config } from '@oceanprotocol/lib'

export function getDevelopmentConfig(): Config {
  // we need to hardcoded these values from Barge (see 'development' object in console)
  return {
    subgraphUri: process.env.NEXT_PUBLIC_SUBGRAPH_URI, // uncomment if on macOs
    metadataCacheUri: process.env.NEXT_PUBLIC_METADATACACHE_URI, // uncomment if on macOs
    providerUri: process.env.NEXT_PUBLIC_PROVIDER_URL, // uncomment if on macOs
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
    config = { ...config, ...getDevelopmentConfig() }
  }
  console.log('oceanConfig', config)
  return config as Config
}
