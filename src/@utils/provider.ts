import axios, { CancelToken, AxiosResponse } from 'axios'
import { DID, Logger } from '@oceanprotocol/lib'

export interface FileMetadata {
  contentType: string
  contentLength: string
}

export async function getFileInfo(
  url: string | DID,
  providerUri: string,
  cancelToken: CancelToken
): Promise<FileMetadata[]> {
  let postBody
  try {
    if (url instanceof DID)
      postBody = {
        did: url.getDid()
      }
    else
      postBody = {
        url
      }
    const response: AxiosResponse<FileMetadata[]> = await axios.post(
      `${providerUri}/api/v1/services/fileinfo`,
      postBody,
      {
        cancelToken
      }
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
