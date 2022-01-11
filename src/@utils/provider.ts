import axios, { CancelToken, AxiosResponse, Method } from 'axios'
import {
  FileMetadata,
  LoggerInstance,
  ProviderInstance
} from '@oceanprotocol/lib'

export interface FileInfo {
  index: number
  valid: boolean
  contentType: string
  contentLength: string
}

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
  providerUrl: string,
  cancelToken: CancelToken
): Promise<FileInfo[]> {
  try {
    // TODO: what was the point of this?
    // if (url instanceof DID) postBody = { did: url.getDid() }
    // else postBody = { url }
    const postBody = { url, type: 'url' }
    const response: AxiosResponse<FileInfo[]> = await axios.post(
      `${providerUrl}/api/services/fileinfo`,
      postBody,
      { cancelToken }
    )

    if (!response || response.status !== 200 || !response.data) return
    return response.data
  } catch (error) {
    if (axios.isCancel(error)) {
      LoggerInstance.log(error.message)
    } else {
      LoggerInstance.error(error.message)
    }
  }
}
