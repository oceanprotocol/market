import {
  FileMetadata,
  LoggerInstance,
  ProviderInstance
} from '@oceanprotocol/lib'

// TODO: Why do we have these functions ?!?!?!
export async function getEncryptedFiles(
  files: FileMetadata[],
  providerUrl: string
): Promise<string> {
  try {
    // https://github.com/oceanprotocol/provider/blob/v4main/API.md#encrypt-endpoint
    const response = await ProviderInstance.encrypt(files, providerUrl)
    return response
  } catch (error) {
    console.error('Error parsing json: ' + error.message)
  }
}

export async function getFileDidInfo(
  did: string,
  serviceId: string,
  providerUrl: string
): Promise<FileMetadata[]> {
  try {
    const response = await ProviderInstance.checkDidFiles(
      did,
      serviceId as any, // TODO: why does ocean.js want a number here?
      providerUrl
    )
    return response
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}

export async function getFileUrlInfo(
  url: string,
  providerUrl: string
): Promise<FileMetadata[]> {
  try {
    const response = await ProviderInstance.checkFileUrl(url, providerUrl)
    return response
  } catch (error) {
    LoggerInstance.error(error.message)
  }
}
