import axios, { AxiosResponse } from 'axios'
import { config } from '../config/ocean'

export interface FaucetResponse {
  success: boolean
  message: string
  trxHash?: string
}

export default async function getFromFaucet(
  account: string
): Promise<FaucetResponse> {
  try {
    const response: AxiosResponse = await axios({
      method: 'POST',
      url: `${config.faucetUri}/faucet`,
      data: {
        address: account,
        agent: 'dexFreight'
      }
    })

    return response.data
  } catch (error) {
    return { success: false, message: error.message }
  }
}
