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
  if (!result.status) {
    LoggerInstance.error(`Response message: error`)
    throw result
  }
  return result
}

export async function fileInfo(url: string, providerUri: string): Promise<any> {
  try {
    const response = await ProviderInstance.fileinfo(
      url,
      'https://providerv4.rinkeby.oceanprotocol.com',
      fetchMethod
      // fetch(providerUri, {
      //   method: 'POST',
      //   body: url,
      //   headers: {
      //     'Content-type': 'application/json'
      //   }
      // })
    )
    console.log('RESPONSE: ', response)
    if (!response) return
    return response
  } catch (error) {
    console.log(error)
  }
}
