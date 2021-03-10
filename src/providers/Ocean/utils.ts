import { Account, Config, Logger, Ocean } from '@oceanprotocol/lib'
import { Balance } from '.'
import contractAddresses from '@oceanprotocol/contracts/artifacts/address.json'
import {
  ConfigHelper,
  ConfigHelperConfig,
  ConfigHelperNetworkId,
  ConfigHelperNetworkName
} from '@oceanprotocol/lib/dist/node/utils/ConfigHelper'

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

export async function getBalance(account: Account): Promise<Balance> {
  const eth = await account.getEtherBalance()
  const ocean = await account.getOceanBalance()
  return { eth, ocean }
}

export async function getUserInfo(
  ocean: Ocean
): Promise<{ account: Account; balance: Balance }> {
  // OCEAN ACCOUNT
  const account = (await ocean.accounts.list())[0]
  Logger.log('Account ', account)

  // BALANCE
  const balance = account && (await getBalance(account))
  Logger.log('balance', JSON.stringify(balance))

  return { account, balance }
}
