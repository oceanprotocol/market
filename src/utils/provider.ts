import axios, { CancelToken, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { File as FileMetadata, Logger, DID } from '@oceanprotocol/lib'

export async function getFileInfo(
  url: string | DID,
  providerUri: string,
  cancelToken: CancelToken
): Promise<AxiosResponse> {
  let postBody
  try {
    if (url instanceof DID)
      postBody = {
        did: url.getDid(),
        cancelToken
      }
    else
      postBody = {
        url,
        cancelToken
      }
    return await axios.post(`${providerUri}/api/v1/services/fileinfo`, postBody)
  } catch (error) {
    Logger.error(error.message)
  }
}

export async function fileinfo(
  url: string,
  providerUri: string,
  cancelToken: CancelToken
): Promise<FileMetadata> {
  try {
    const response = await getFileInfo(url, providerUri, cancelToken)

    if (!response || response.status !== 200 || !response.data) {
      toast.error('Could not connect to File API')
      return
    }
    if (!response.data[0] || !response.data[0].valid) {
      toast.error('Could not fetch file info. Please check URL and try again')
      return
    }

    const { contentLength, contentType } = response.data[0]

    return {
      contentLength: contentLength || '',
      contentType: contentType || '', // need to do that cause lib-js File interface requires contentType
      url
    }
  } catch (error) {
    Logger.error(error.message)
  }
}

export async function isFileValid(
  url: string | DID,
  providerUri: string,
  cancelToken: CancelToken
): Promise<boolean> {
  const response = await getFileInfo(url, providerUri, cancelToken)

  if (!response || response.status !== 200 || !response.data) return false

  if (!response.data[0] || !response.data[0].valid) return false

  return response.data[0].valid
}
