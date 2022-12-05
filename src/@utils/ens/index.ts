import { fetchData } from '../fetch'

const apiUrl = 'https://ens-proxy.oceanprotocol.com/api'

export async function getEnsName(accountId: string): Promise<string> {
  if (!accountId || accountId === '') return

  const data = await fetchData(`${apiUrl}/name?accountId=${accountId}`)
  return data?.name
}

export async function getEnsAddress(accountId: string): Promise<string> {
  if (!accountId || accountId === '' || !accountId.includes('.')) return

  const data = await fetchData(`${apiUrl}/address?name=${accountId}`)
  return data?.address
}

export async function getEnsProfile(accountId: string): Promise<Profile> {
  if (!accountId || accountId === '') return

  const data = await fetchData(`${apiUrl}/profile?address=${accountId}`)
  return data?.profile
}
