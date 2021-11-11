import { sha256 } from 'js-sha256'
import {
  dateToStringNoMS,
  transformTags,
  getUrlFileExtension
} from '@utils/ddo'
import { FormPublishData } from './_types'

function encryptMe(files: string | FileMetadata[]): string {
  throw new Error('Function not implemented.')
}

export function getFieldContent(
  fieldName: string,
  fields: FormFieldContent[]
): FormFieldContent {
  return fields.filter((field: FormFieldContent) => field.name === fieldName)[0]
}

export function transformPublishFormToDdo(
  values: FormPublishData,
  datatokenAddress: string,
  nftAddress: string
): DDO {
  const did = sha256(`${nftAddress}${values.chainId}`)
  const currentTime = dateToStringNoMS(new Date())
  const { type, name, description, tags, author, termsAndConditions } =
    values.metadata
  const {
    access,
    files,
    links,
    image,
    containerTag,
    entrypoint,
    providerUrl,
    timeout
  } = values.services[0]

  const fileUrl = typeof files !== 'string' && files[0].url

  const metadata: Metadata = {
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
        language: getUrlFileExtension(fileUrl),
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

  const service: Service = {
    type: access,
    files: encryptMe(files),
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
    chainId: values.chainId,
    metadata,
    services: [service]
  }

  return newDdo
}
