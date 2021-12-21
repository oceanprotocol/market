import { LoggerInstance, ProviderInstance } from '@oceanprotocol/lib'

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
    const response = await ProviderInstance.encrypt(
      did,
      accountId,
      files,
      providerUrl,
      fetch
    )
    if (!response) return
    return response
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
  }
}

async function fetchMethod(provider: string, url: string): Promise<Response> {
  const requestOptions = {
    method: 'POST',
    body: url,
    headers: { 'Content-Type': 'application/json' }
  }
  const result = await fetch(provider, requestOptions)
  if (result.status !== 200) {
    LoggerInstance.error(`Response message: ${await result.text()}`)
    throw result
  }
  return result
}

export async function fileInfo(url: string, providerUri: string): Promise<any> {
  try {
    const response = await ProviderInstance.fileinfo(
      url,
      providerUri,
      fetchMethod
    )
    if (!response) return
    return response
  } catch (error) {
    LoggerInstance.log(error)
  }
}
