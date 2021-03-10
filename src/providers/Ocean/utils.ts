import axios from 'axios'
import { Account, Config, DDO, DID } from '@oceanprotocol/lib'
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

const purgatoryUrl = 'https://market-purgatory.oceanprotocol.com/api/'

export interface AccountPurgatoryData {
  address: string
  reason: string
}

export async function getAccountPurgatoryData(
  address: string
): Promise<AccountPurgatoryData> {
  const response = await axios(`${purgatoryUrl}account?address=${address}`)
  const responseJson = await response.data[0]
  return { address: responseJson?.address, reason: responseJson?.reason }
}

export async function getBalance(account: Account): Promise<Balance> {
  const eth = await account.getEtherBalance()
  const ocean = await account.getOceanBalance()
  return { eth, ocean }
}

export function isDDO(
  toBeDetermined: DID | string | DDO
): toBeDetermined is DDO {
  if ((toBeDetermined as DDO).id) {
    return true
  }
  return false
}
