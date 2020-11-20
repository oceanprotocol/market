import { Profile, Profile3Box } from '../models/Profile'
import axios, { AxiosResponse, CancelToken } from 'axios'
import jwt_decode from 'jwt-decode'

const ipfsUrl = 'https://ipfs.3box.io/profile?address='

export default async function get3BoxProfile(
  accountId: string,
  cancelToken: CancelToken
): Promise<Profile | undefined> {
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
}

function getTwitterUser(proofJWT: string) {
  if (!proofJWT) return
  const proof = jwt_decode(proofJWT) as any
  return proof.claim.twitter_handle
}
