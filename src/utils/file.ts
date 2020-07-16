import axios, { AxiosResponse } from 'axios'
import { IncomingHttpHeaders } from 'http'
import { toast } from 'react-toastify'
import { File as FileMetadata } from '@oceanprotocol/lib/dist/node/ddo/interfaces/File'

interface ResponseResult {
  contentLength?: string
  contentType?: string
}

export interface FileResponse {
  status: string
  message?: string
  result?: ResponseResult
}

function successResult(headers: IncomingHttpHeaders): FileResponse {
  const contentType =
    headers['content-type'] && headers['content-type'].split(';')[0]
  let contentLength = headers['content-length'] && headers['content-length']

  // sometimes servers send content-range header,
  // try to use it if content-length is not present
  if (headers['content-range'] && !headers['content-length']) {
    const size = headers['content-range'].split('/')[1]
    contentLength = size
  }

  const result: ResponseResult = {
    contentLength,
    contentType
  }

  return { status: 'success', result }
}

async function checkUrl(url: string): Promise<FileResponse> {
  if (!url) {
    return { status: 'error', message: 'missing url' }
  }

  try {
    const response: AxiosResponse = await axios({
      method: 'HEAD',
      url,
      headers: { Range: 'bytes=0-' }
    })

    const { headers, status } = response
    const successResponses =
      status.toString().startsWith('2') || status.toString().startsWith('416')

    if (!response && !successResponses) {
      return { status: 'error', message: 'Unknown Error' }
    }

    const result = successResult(headers)
    return result
  } catch (error) {
    return { status: 'error', message: error.message }
  }
}

export default async function getFileInfo(url: string): Promise<FileMetadata> {
  const response = await checkUrl(url)

  if (response.status === 'error') {
    toast.error(response.message)
    return
  }

  const { contentLength, contentType } = response.result

  return {
    contentLength,
    contentType: contentType || '', // need to do that cause squid.js File interface requires contentType
    url
  }
}
