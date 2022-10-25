import { fetchData } from './fetch'

const purgatoryUrl = 'https://market-purgatory.oceanprotocol.com/api/'

export interface PurgatoryDataAccount {
  address: string
  reason: string
}

export async function getAccountPurgatoryData(
  address: string
): Promise<PurgatoryDataAccount> {
  const data = (await fetchData(
    `${purgatoryUrl}account?address=${address}`
  )) as PurgatoryDataAccount[]
  return { address: data[0]?.address, reason: data[0]?.reason }
}
