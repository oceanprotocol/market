import {
  Account,
  Logger,
  Ocean,
  ConfigHelper,
  ConfigHelperConfig,
  ConfigHelperNetworkId,
  ConfigHelperNetworkName
} from '@oceanprotocol/lib'
import contractAddresses from '@oceanprotocol/contracts/artifacts/address.json'

import { UserBalance } from '../@types/TokenBalance'

export function getOceanConfig(
  network: ConfigHelperNetworkName | ConfigHelperNetworkId
): ConfigHelperConfig {
  const config = new ConfigHelper().getConfig(
    network,
    network === 'polygon' || network === 137
      ? undefined
      : process.env.GATSBY_INFURA_PROJECT_ID
  ) as ConfigHelperConfig

  switch (network) {
    case 'polygon':
    case 137: {
      config.metadataCacheUri = 'https://aquarius.polygon.oceanprotocol.io'
      config.providerAddress = 'https://provider.polygon.oceanprotocol.io'
      config.subgraphUri = 'https://subgraph.polygon.oceanprotocol.io'
      break
    }
    case 'mainnet':
    case 1: {
      config.metadataCacheUri = 'https://aquarius.mainnet.oceanprotocol.io'
      config.providerAddress = 'https://provider.mainnet.oceanprotocol.io'
      config.subgraphUri = 'https://subgraph.mainnet.oceanprotocol.io'
      break
    }
    case 'rinkeby':
    case 4: {
      config.metadataCacheUri = 'https://aquarius.rinkeby.oceanprotocol.io'
      config.providerAddress = 'https://provider.rinkeby.oceanprotocol.io'
      config.subgraphUri = 'https://subgraph.rinkeby.oceanprotocol.io'
      break
    }
    case 'ropsten':
    case 3: {
      config.metadataCacheUri = 'https://aquarius.ropsten.oceanprotocol.io'
      config.providerAddress = 'https://provider.ropsten.oceanprotocol.io'
      config.subgraphUri = 'https://subgraph.ropsten.oceanprotocol.io'
      break
    }
  }
  return config
}

export function getDevelopmentConfig(): Partial<ConfigHelperConfig> {
  return {
    factoryAddress: contractAddresses.development?.DTFactory,
    poolFactoryAddress: contractAddresses.development?.BFactory,
    fixedRateExchangeAddress: contractAddresses.development?.FixedRateExchange,
    metadataContractAddress: contractAddresses.development?.Metadata,
    oceanTokenAddress: contractAddresses.development?.Ocean,
    // There is no subgraph in barge so we hardcode the Rinkeby one for now
    subgraphUri: 'https://subgraph.rinkeby.oceanprotocol.com'
  }
}

export async function getUserInfo(
  ocean: Ocean
): Promise<{ account: Account; balance: UserBalance }> {
  if (!ocean) return { account: null, balance: { eth: '0', ocean: '0' } }

  const account = (await ocean.accounts.list())[0]
  Logger.log('[ocean] Account: ', account)

  const balance = {
    eth: await account.getEtherBalance(),
    ocean: await account.getOceanBalance()
  }
  Logger.log('[ocean] Balance: ', JSON.stringify(balance))

  return { account, balance }
}
