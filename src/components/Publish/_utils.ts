import axios, { AxiosResponse } from 'axios'
import { sha256 } from 'js-sha256'
import slugify from 'slugify'
import { FormPublishData } from './_types'

export function getFieldContent(
  fieldName: string,
  fields: FormFieldContent[]
): FormFieldContent {
  return fields.filter((field: FormFieldContent) => field.name === fieldName)[0]
}

async function getEncryptedFileUrls(
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

function getUrlFileExtension(fileUrl: string): string {
  const splittedFileUrl = fileUrl.split('.')
  return splittedFileUrl[splittedFileUrl.length - 1]
}

function dateToStringNoMS(date: Date): string {
  return date.toISOString().replace(/\.[0-9]{3}Z/, 'Z')
}

function transformTags(value: string): string[] {
  const originalTags = value?.split(',')
  const transformedTags = originalTags?.map((tag) => slugify(tag).toLowerCase())
  return transformedTags
}

export async function transformPublishFormToDdo(
  values: FormPublishData,
  datatokenAddress: string,
  nftAddress: string
): Promise<DDO> {
  const { chainId, accountId, metadata, services } = values
  const did = sha256(`${nftAddress}${chainId}`)
  const currentTime = dateToStringNoMS(new Date())
  const { type, name, description, tags, links, author, termsAndConditions } =
    metadata
  const {
    access,
    files,
    image,
    containerTag,
    entrypoint,
    providerUrl,
    timeout
  } = services[0]

  const filesEncrypted = await getEncryptedFileUrls(
    files as string[],
    providerUrl,
    did,
    accountId
  )

  const newMetadata: Metadata = {
    created: currentTime,
    updated: currentTime,
    type,
    name,
    description,
    tags: transformTags(tags),
    author,
    license: 'https://market.oceanprotocol.com/terms',
    links,
    additionalInformation: {
      termsAndConditions
    },
    ...(type === 'algorithm' && {
      algorithm: {
        language: getUrlFileExtension(files[0]),
        version: '0.1',
        container: {
          entrypoint,
          image,
          tag: containerTag,
          checksum: '' // how to get? Is it user input?
        }
      }
    })
  }

  const newService: Service = {
    type: access,
    files: filesEncrypted,
    datatokenAddress,
    serviceEndpoint: providerUrl,
    timeout,
    ...(access === 'compute' && {
      compute: {
        namespace: '',
        cpu: 1,
        gpu: 1,
        gpuType: '',
        memory: '',
        volumeSize: '',
        allowRawAlgorithm: false,
        allowNetworkAccess: false,
        publisherTrustedAlgorithmPublishers: null,
        publisherTrustedAlgorithms: null
      }
    })
  }

  const newDdo: DDO = {
    '@context': ['https://w3id.org/did/v1'],
    id: did,
    version: '4.0.0',
    chainId,
    metadata: newMetadata,
    services: [newService]
  }

  return newDdo
}
