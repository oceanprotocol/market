import { Purgatory } from '@oceanprotocol/lib'
import { fetchData } from './fetch'

const purgatoryUrl = 'https://market-purgatory.oceanprotocol.com/api/'

export interface PurgatoryDataAccount {
  address: string
  reason: string
}

export default async function getAssetPurgatoryData(
  did: string
): Promise<Purgatory> {
  const data = (await fetchData(
    `${purgatoryUrl}asset?did=${did}`
  )) as Purgatory[]

  return { state: data[0]?.state, reason: data[0]?.reason }
}

export async function getAccountPurgatoryData(
  address: string
): Promise<PurgatoryDataAccount> {
  const data = (await fetchData(
    `${purgatoryUrl}account?address=${address}`
  )) as PurgatoryDataAccount[]
  return { address: data[0]?.address, reason: data[0]?.reason }
}
