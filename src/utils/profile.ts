import { Profile, Profile3Box } from '../models/Profile'
import axios, { AxiosResponse, CancelToken } from 'axios'
import jwtDecode from 'jwt-decode'
import { Logger } from '@oceanprotocol/lib'

const ipfsUrl = 'https://ipfs.3box.io/profile?address='

function getTwitterUser(proofJWT: string) {
  if (!proofJWT) return
  const proof = jwtDecode(proofJWT) as any
  return proof.claim.twitter_handle
}

export default async function get3BoxProfile(
  accountId: string,
  cancelToken: CancelToken
): Promise<Profile | undefined> {
  try {
    const response: AxiosResponse<Profile3Box> = await axios.get(
      `${ipfsUrl}${accountId}`,
      { cancelToken }
    )
    if (!response || response.status !== 200 || !response.data) return

    return {
      github: response.data.proof_github?.split('/')[3],
      twitter: getTwitterUser(response.data.proof_twitter),
      description: response.data.description,
      name: response.data.name,
      website: response.data.website
    } as Profile
  } catch (error) {
    Logger.log(`No profile found for ${accountId}`)
  }
}
