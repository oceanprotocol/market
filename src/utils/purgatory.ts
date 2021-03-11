import { PurgatoryData as PurgatoryDataAsset } from '@oceanprotocol/lib'
import { fetchData } from '.'

const purgatoryUrl = 'https://market-purgatory.oceanprotocol.com/api/'

export interface PurgatoryDataAccount {
  address: string
  reason: string
}

export default async function getAssetPurgatoryData(
  did: string
): Promise<PurgatoryDataAsset> {
  const data = await fetchData(`${purgatoryUrl}asset?did=${did}`)
  return { did: data[0]?.did, reason: data[0]?.reason }
}

export async function getAccountPurgatoryData(
  address: string
): Promise<PurgatoryDataAccount> {
  const data = await fetchData(`${purgatoryUrl}account?address=${address}`)
  return { address: data[0]?.address, reason: data[0]?.reason }
}
