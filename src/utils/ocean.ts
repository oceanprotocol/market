import { Account, Config, Logger, Ocean } from '@oceanprotocol/lib'
import contractAddresses from '@oceanprotocol/contracts/artifacts/address.json'
import {
  ConfigHelper,
  ConfigHelperConfig,
  ConfigHelperNetworkId,
  ConfigHelperNetworkName
} from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'

export interface Balance {
  eth: string
  ocean: string
}

export function getOceanConfig(
  network: ConfigHelperNetworkName | ConfigHelperNetworkId
): Config {
  return new ConfigHelper().getConfig(
    network,
    process.env.GATSBY_INFURA_PROJECT_ID
  )
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
): Promise<{ account: Account; balance: Balance }> {
  const account = (await ocean.accounts.list())[0]
  Logger.log('Account ', account)

  const balance = {
    eth: await account.getEtherBalance(),
    ocean: await account.getOceanBalance()
  }
  Logger.log('balance', JSON.stringify(balance))

  return { account, balance }
}
