import axios, { CancelToken, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { DID, File as FileMetadata, Logger } from '@oceanprotocol/lib'

export async function fileinfo(
  url: string,
  providerUri: string,
  cancelToken: CancelToken
): Promise<FileMetadata> {
  try {
    const response = (await axios.post(
      `${providerUri}/api/v1/services/fileinfo`,
      {
        url,
        cancelToken
      }
    )) as AxiosResponse<
      { valid: boolean; contentLength: string; contentType: string }[]
    >

    if (!response || response.status !== 200 || !response.data) {
      toast.error('Could not connect to File API')
      return
    }
    if (!response.data[0] || !response.data[0].valid) {
      toast.error(
        'The data file URL you entered apears to be invalid. Please check URL and try again',
        {
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      )
      return
    } else {
      toast.dismiss() // Remove any existing error message
      toast.success('Great! That file looks good. 🐳', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      })
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

export async function getFileInfo(
  url: string | DID,
  providerUri: string,
  cancelToken: CancelToken
): Promise<any> {
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
    const response = await axios.post(
      `${providerUri}/api/v1/services/fileinfo`,
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
