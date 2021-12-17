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

export async function fileInfo(url: string, providerUri: string): Promise<any> {
  try {
    const response = await ProviderInstance.fileinfo(url, providerUri, fetch)
    if (!response) return
    return response
  } catch (error) {
    console.log(error)
  }
}
