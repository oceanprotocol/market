import axios from 'axios'
import Web3 from 'web3'
import { Account, DDO, DID } from '@oceanprotocol/lib'
import { Balance } from '.'

const purgatoryUrl = 'https://market-purgatory.oceanprotocol.com/api/'

export interface AccountPurgatoryData {
  address: string
  reason: string
}

export enum ProviderStatus {
  NOT_AVAILABLE = -1,
  NOT_CONNECTED = 0,
  CONNECTED = 1
}

export async function getAccountPurgatoryData(
  address: string
): Promise<AccountPurgatoryData> {
  const response = await axios(`${purgatoryUrl}account?address=${address}`)
  const responseJson = await response.data[0]
  return { address: responseJson?.address, reason: responseJson?.reason }
}

export async function getAccountId(web3: Web3): Promise<string> {
  const accounts = await web3.eth.getAccounts()
  return accounts[0]
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
