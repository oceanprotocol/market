import { PurgatoryData as PurgatoryDataAsset } from '@oceanprotocol/lib'
import axios, { AxiosResponse } from 'axios'

const purgatoryUrl = 'https://market-purgatory.oceanprotocol.com/api/'

export interface PurgatoryDataAccount {
  address: string
  reason: string
}

async function fetchPurgatory(url: string) {
  const response: AxiosResponse = await axios(url)
  return response.data[0]
}

export default async function getAssetPurgatoryData(
  did: string
): Promise<PurgatoryDataAsset> {
  const data = await fetchPurgatory(`${purgatoryUrl}asset?did=${did}`)
  return { did: data?.did, reason: data?.reason }
}

export async function getAccountPurgatoryData(
  address: string
): Promise<PurgatoryDataAccount> {
  const data = await fetchPurgatory(`${purgatoryUrl}account?address=${address}`)
  return { address: data?.address, reason: data?.reason }
}
