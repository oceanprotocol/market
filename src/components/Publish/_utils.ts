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

export function transformPublishFormToDdo(data: Partial<FormPublishData>): DDO {
  const currentTime = dateToStringNoMS(new Date())
  const { type, name, description, tags, author, termsAndConditions } =
    data.metadata
  const {
    access,
    files,
    links,
    image,
    containerTag,
    entrypoint,
    providerUrl,
    timeout
  } = data.services[0]

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
          entrypoint: entrypoint,
          image: image,
          tag: containerTag,
          checksum: ''
        }
      }
    })
  }

  const service: Service = {
    type: access,
    files: encryptMe(files),
    datatokenAddress: '', // how to get before publish?
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
    id: '', // how to get before publish? sha256(address of ERC721 contract + data.chainId)
    version: '4.0.0',
    chainId: data.chainId,
    metadata,
    services: [service]
  }

  return newDdo
}
