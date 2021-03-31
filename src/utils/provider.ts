import axios, { CancelToken, AxiosResponse } from 'axios'
import { toast } from 'react-toastify'
import { File as FileMetadata, Logger } from '@oceanprotocol/lib'

export async function fileinfo(
  url: string,
  providerUri: string,
  cancelToken: CancelToken
): Promise<FileMetadata> {
  try {
    const response: AxiosResponse = await axios.post(
      `${providerUri}/api/v1/services/fileinfo`,
      {
        url,
        cancelToken
      }
    )

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
