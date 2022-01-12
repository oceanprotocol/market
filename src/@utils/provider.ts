import axios, { CancelToken, AxiosResponse, Method } from 'axios'
import {
  FileMetadata,
  LoggerInstance,
  ProviderInstance
} from '@oceanprotocol/lib'

export async function getEncryptedFiles(
  files: FileMetadata[],
  providerUrl: string
): Promise<string> {
  try {
    // https://github.com/oceanprotocol/provider/blob/v4main/API.md#encrypt-endpoint
    console.log('start encr')
    const response = await ProviderInstance.encrypt(
      files,
      providerUrl,
      (httpMethod: Method, url: string, body: string, headers: any) => {
        return axios(url, {
          method: httpMethod,
          data: body,
          headers: headers
        })
      }
    )
    console.log('encr eres', response)
    return response.data
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
  }
}

export async function getFileInfo(
  url: string,
  providerUrl: string
): Promise<FileMetadata[]> {
  try {
    const response = await ProviderInstance.checkFileUrl(
      url,
      providerUrl,
      (method: Method, path: string, body: string) => {
        return fetch(path, {
          method: method,
          body: body,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    )
    return response
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}
