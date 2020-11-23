import { Profile, ProfileLink, ResponseData3Box } from '../models/Profile'
import axios, { AxiosResponse, CancelToken } from 'axios'
import jwtDecode from 'jwt-decode'
import { Logger } from '@oceanprotocol/lib'

const ipfsUrl = 'https://ipfs.3box.io'

function decodeProof(proofJWT: string) {
  if (!proofJWT) return
  const proof = jwtDecode(proofJWT) as any
  return proof
}

function getLinks(
  website: string,
  twitterProof: string,
  githubProof: string
): ProfileLink[] {
  // Conditionally add links if they exist
  const links = [
    ...(website ? [{ name: 'Website', value: website }] : []),
    ...(twitterProof
      ? [
          {
            name: 'Twitter',
            value: decodeProof(twitterProof).claim.twitter_handle
          }
        ]
      : []),
    ...(githubProof
      ? [{ name: 'GitHub', value: githubProof.split('/')[3] }]
      : [])
  ]

  return links
}

export default async function get3BoxProfile(
  accountId: string,
  cancelToken: CancelToken
): Promise<Profile> {
  try {
    const response: AxiosResponse<ResponseData3Box> = await axios(
      `${ipfsUrl}/profile?address=${accountId}`,
      { cancelToken }
    )

    // TODO: prevent 404 from showing up in console somehow.

    if (!response || !response.data || response.data.status === 'error') return

    const {
      name,
      description,
      website,
      /* eslint-disable camelcase */
      proof_twitter,
      proof_github
      /* eslint-enable camelcase */
    } = response.data

    const links = getLinks(website, proof_twitter, proof_github)

    const profile: Profile = {
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
