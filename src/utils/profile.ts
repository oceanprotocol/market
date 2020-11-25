import { Profile, ProfileLink, ResponseData3Box } from '../models/Profile'
import axios, { AxiosResponse, CancelToken } from 'axios'
import jwtDecode from 'jwt-decode'
import { Logger } from '@oceanprotocol/lib'

// https://docs.3box.io/api/rest-api
const apiUri = 'https://ipfs.3box.io'
const ipfsUrl = 'https://ipfs.oceanprotocol.com'

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

function transformResponse({
  name,
  description,
  website,
  emoji,
  image,
  /* eslint-disable camelcase */
  proof_twitter,
  proof_github,
  proof_did
}: ResponseData3Box) {
  /* eslint-enable camelcase */
  const links = getLinks(website, proof_twitter, proof_github)

  const profile: Profile = {
    did: decodeProof(proof_did).iss,
    // Conditionally add profile items if they exist
    ...(name && { name }),
    ...(description && { description }),
    ...(emoji && { emoji }),
    ...(image && {
      image: `${ipfsUrl}/ipfs/${
        image.map(
          (img: { contentUrl: { [key: string]: string } }) =>
            img.contentUrl['/']
        )[0]
      }`
    }),
    ...(links.length && { links })
  }

  return profile
}

export default async function get3BoxProfile(
  accountId: string,
  cancelToken: CancelToken
): Promise<Profile> {
  try {
    // const interceptor = axios.interceptors.response.use(
    //   (response) => {
    //     // Any status code that lie within the range of 2xx cause this function to trigger
    //     // Do something with response data
    //     return response
    //   },
    //   (error) => {
    //     // Any status codes that falls outside the range of 2xx cause this function to trigger
    //     // Do something with response error
    //     console.log('Intercepted error', error.message)
    //     return Promise.resolve({ status: 200 })
    //   }
    // )

    const response: AxiosResponse<ResponseData3Box> = await axios(
      `${apiUri}/profile?address=${accountId}`,
      {
        cancelToken
        // validateStatus: () => true
      }
    )
    // axios.interceptors.request.eject(interceptor)

    // TODO: prevent 404 from showing up in console somehow.

    if (
      !response ||
      !response.data ||
      response.status !== 200 ||
      response.data.status === 'error'
    )
      return

    Logger.log(`3Box profile found for ${accountId}`, response.data)
    const profile = transformResponse(response.data)
    return profile
  } catch (error) {
    // prevent 404 error from appearing in console
    // if (error.response && error.response.status === 404) {
    //   console.clear()
    // }
  }
}
