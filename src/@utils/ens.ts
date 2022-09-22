import { fetchData } from './fetch'

const apiUrl = 'https://ens-proxy.oceanprotocol.com/api'

export async function getEnsName(accountId: string): Promise<string> {
  if (!accountId || accountId === '') return

  const data = await fetchData(`${apiUrl}/name?address=${accountId}`)
  return data?.name
}

export async function getEnsAddress(accountId: string): Promise<string> {
  if (!accountId || accountId === '' || !accountId.includes('.')) return

  const data = await fetchData(`${apiUrl}/address?name=${accountId}`)
  return data?.address
}

export async function getEnsAvatar(accountId: string): Promise<string> {
  if (!accountId || accountId === '') return

  // TODO: use dedicated /avatar endpoint to prevent unneccessary contract calls
  // because of text records fetching.
  // See https://github.com/oceanprotocol/ens-proxy/issues/12
  const data = await fetchData(`${apiUrl}/profile?address=${accountId}`)
  return data?.profile.avatar
}

export async function getEnsProfile(accountId: string): Promise<Profile> {
  if (!accountId || accountId === '') return

  const data = await fetchData(`${apiUrl}/profile?address=${accountId}`)
  return data?.profile
}
