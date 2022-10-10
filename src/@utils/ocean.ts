import { ConfigHelper, Config } from '@oceanprotocol/lib'

export function getDevelopmentConfig(): Config {
  // we need to hardcoded these values from Barge (see 'development' object in console)
  return {
    nodeUri: '',
    subgraphUri: '',
    chainId: 8996,
    network: '',
    metadataCacheUri: '',
    fixedRateExchangeAddress: '',
    dispenserAddress: '',
    oceanTokenAddress: '',
    nftFactoryAddress: '',
    providerUri: ''
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
      network === 8996 // barge
      ? undefined
      : process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
  ) as Config

  // TODO: remove after fixing in ocean.js
  if (network === 8996) {
    config = { ...config, ...getDevelopmentConfig() }
  }

  return config as Config
}
