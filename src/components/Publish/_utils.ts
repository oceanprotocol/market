import {
  dateToStringNoMS,
  transformTags,
  getAlgorithmComponent,
  getAlgorithmFileExtension
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
  const { type } = data.metadata
  const { name, description, tags, author, termsAndConditions } = data.metadata
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
  const filesEncrypted = encryptMe(files)

  const service: Service = {
    type: access,
    files: filesEncrypted,
    datatokenAddress: '',
    serviceEndpoint: providerUrl,
    timeout
  }

  const newDdo: DDO = {
    '@context': [''],
    id: '',
    version: '4.0.0',
    created: currentTime,
    updated: currentTime,
    chainId: data.chainId,
    metadata: {
      type,
      name,
      description,
      tags: transformTags(tags),
      author,
      license: 'https://market.oceanprotocol.com/terms',
      links,
      ...(type === 'algorithm' && {
        ...getAlgorithmComponent(
          image,
          containerTag,
          entrypoint,
          getAlgorithmFileExtension(fileUrl)
        )
      })
    },
    services: [service]
  }

  return newDdo
}
