import axios, { CancelToken, AxiosResponse } from 'axios'
import { DID, Logger } from '@oceanprotocol/lib'

export interface FileMetadata {
  index: number
  valid: boolean
  contentType: string
  contentLength: string
}

export async function getEncryptedFileUrls(
  files: string[],
  providerUrl: string,
  did: string,
  accountId: string
): Promise<string> {
  try {
    // https://github.com/oceanprotocol/provider/blob/v4main/API.md#encrypt-endpoint
    const url = `${providerUrl}/api/v1/services/encrypt`
    const response: AxiosResponse<{ encryptedDocument: string }> =
      await axios.post(url, {
        documentId: did,
        signature: '', // TODO: add signature
        publisherAddress: accountId,
        document: files
      })
    return response?.data?.encryptedDocument
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
  }
}

export async function getFileInfo(
  url: string | DID,
  providerUrl: string,
  cancelToken: CancelToken
): Promise<FileMetadata[]> {
  let postBody
  try {
    if (url instanceof DID) postBody = { did: url.getDid() }
    else postBody = { url }

    const response: AxiosResponse<FileMetadata[]> = await axios.post(
      `${providerUrl}/api/v1/services/fileinfo`,
      postBody,
      { cancelToken }
    )

    if (!response || response.status !== 200 || !response.data) return
    return response.data
  } catch (error) {
    if (axios.isCancel(error)) {
      Logger.log(error.message)
    } else {
      Logger.error(error.message)
    }
  }
}

export async function isValidProvider(url: string): Promise<boolean> {
  try {
    const response = await axios.get(url)
    if (response) {
      const params = await response.data
      if (params && params.providerAddress) return true
    }
    return false
  } catch (error) {
    console.error(`Error validating provider: ${error.message}`)
    return false
  }
}
