import { Profile, ResponseData3Box } from '../models/Profile'
import axios, { AxiosResponse, CancelToken } from 'axios'
import jwtDecode from 'jwt-decode'
import { Logger } from '@oceanprotocol/lib'

const ipfsUrl = 'https://ipfs.3box.io'

function decodeProof(proofJWT: string) {
  if (!proofJWT) return
  const proof = jwtDecode(proofJWT) as any
  return proof
}

export default async function get3BoxProfile(
  accountId: string,
  cancelToken: CancelToken
): Promise<Profile> {
  try {
    const response: AxiosResponse<ResponseData3Box> = await axios.get(
      `${ipfsUrl}/profile?address=${accountId}`,
      { cancelToken }
    )

    if (
      !response ||
      response.status !== 200 ||
      !response.data ||
      response.data.status === 'error'
    )
      return

    const {
      name,
      description,
      website,
      /* eslint-disable camelcase */
      proof_twitter,
      proof_github
    } = response.data

    // Conditionally add links if they exist
    const links = [
      ...(website ? [{ name: 'Website', value: website }] : []),
      ...(proof_twitter
        ? [
            {
              name: 'Twitter',
              value: decodeProof(proof_twitter).claim.twitter_handle
            }
          ]
        : []),
      ...(proof_github
        ? [{ name: 'GitHub', value: proof_github.split('/')[3] }]
        : [])
    ]
    /* eslint-enable camelcase */

    const profile = {
      did: decodeProof(response.data.proof_did).iss,
      // Conditionally add profile items if they exist
      ...(name && { name }),
      ...(description && { description }),
      ...(links.length && { links })
    }

    return profile
  } catch (error) {
    Logger.log(`No profile found for ${accountId}`)
  }
}
