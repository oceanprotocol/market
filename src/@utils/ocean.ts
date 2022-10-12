import { ConfigHelper, Config } from '@oceanprotocol/lib'

export function getDevelopmentConfig(): Config {
  // we need to hardcoded these values from Barge (see 'development' object in console)
  return {
    nodeUri: process.env.NEXT_PUBLIC_RBAC_URL,
    subgraphUri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
    providerUri: 'http://localhost:8030',
    metadataCacheUri: process.env.NEXT_PUBLIC_METADATACACHE_URI,
    chainId: 8996,
    fixedRateExchangeAddress:
      process.env.NEXT_PUBLIC_FIXED_RATE_EXCHANGE_ADDRESS,
    dispenserAddress: process.env.NEXT_PUBLIC_DISPENSER_ADDRESS,
    oceanTokenAddress: process.env.NEXT_PUBLIC_OCEAN_TOKEN_ADDRESS,
    nftFactoryAddress: process.env.NEXT_PUBLIC_NFT_FACTORY_ADDRESS
  } as Config
}

export function getOceanConfig(network: string | number): Config {
  console.log('network', network)
  let config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' ||
      network === 'moonbeamalpha' ||
      network === 1287 ||
      network === 'bsc' ||
      network === 56 ||
      network === 'gaiaxtestnet' ||
      network === 2021000 ||
      network === 8996 // barge
      ? undefined
      : process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  ) as Config
  // console.log('config 1 ', config)
  // TODO: remove after fixing in ocean.js
  if (network === 8996) {
    config = { ...config, ...getDevelopmentConfig() }
    // console.log('dev config', config)
  }
  return config as Config
}
