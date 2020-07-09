import axios, { AxiosResponse } from 'axios'
import { oceanConfig } from '../../app.config'

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
      url: `${oceanConfig.faucetUri}/faucet`,
      data: {
        address: account,
        agent: 'market'
      }
    })

    return response.data
  } catch (error) {
    return { success: false, message: error.message }
  }
}
