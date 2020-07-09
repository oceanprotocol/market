import axios, { AxiosResponse } from 'axios'
import Web3 from 'web3'
import { DID } from '@oceanprotocol/squid'
import { oceanConfig } from '../../app.config'

export declare type RatingResponse = [string, number]

const url = oceanConfig.ratingUri + '/api/v1/rating'

export function gethash(message: string) {
  let hex = ''
  for (let i = 0; i < message.length; i++) {
    hex += '' + message.charCodeAt(i).toString(16)
  }
  const hexMessage = '0x' + hex
  return hexMessage
}

export default async function rateAsset(
  did: DID | string,
  web3: Web3,
  value: number
): Promise<RatingResponse | string> {
  try {
    const timestamp = Math.floor(+new Date() / 1000)
    const accounts = await web3.eth.getAccounts()
    const signature = await web3.eth.personal.sign(
      gethash(`${timestamp}`),
      accounts ? accounts[0] : '',
      ''
    )

    const ratingBody = {
      did,
      vote: value,
      comment: '',
      address: accounts[0],
      timestamp: timestamp,
      signature: signature
    }

    const response: AxiosResponse = await axios.post(url, ratingBody)
    if (!response) return 'No Response'
    return response.data
  } catch (error) {
    console.error(error.message)
    return `Error: ${error.message}`
  }
}
