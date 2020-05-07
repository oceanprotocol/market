import axios from 'axios'
import { DID } from '@oceanprotocol/squid'
import { config } from '../config/ocean'

export declare type GetRatingResponse = {
  comment: string
  datePublished: string
  vote: number
}

const url = config.ratingUri + '/api/v1/rating'

export default async function getAssetRating(
  did: DID | string,
  account: string
): Promise<GetRatingResponse | undefined> {
  try {
    if (!account) return

    const response = await axios.get(url, {
      params: {
        did: did,
        address: account
      }
    })
    const votesLength = response.data.length

    if (votesLength > 0) {
      return response.data[votesLength - 1]
    }
  } catch (error) {
    console.error(error.message)
  }
}
