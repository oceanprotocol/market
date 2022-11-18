import { LoggerInstance } from '@oceanprotocol/lib'
import axios, { AxiosResponse } from 'axios'

export async function fetchData(url: string): Promise<AxiosResponse['data']> {
  try {
    const response = await axios(url)
    return response?.data
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      LoggerInstance.error(`Non-200 response from ${url}:`, error.response)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      LoggerInstance.error('No response with:', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      LoggerInstance.error('Error in setting up request:', error.message)
    }
    LoggerInstance.error(error.message)
  }
}
