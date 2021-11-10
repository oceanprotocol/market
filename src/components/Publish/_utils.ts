import {
  dateToStringNoMS,
  transformTags,
  getAlgorithmComponent,
  getAlgorithmFileExtension
} from '@utils/ddo'
import { FormPublishData } from './_types'

export function getFieldContent(
  fieldName: string,
  fields: FormFieldContent[]
): FormFieldContent {
  return fields.filter((field: FormFieldContent) => field.name === fieldName)[0]
}

export function transformPublishFormToDdo(
  data: Partial<FormPublishData>,
  ddo?: Asset
): DDO {
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

  const service: Service = {
    type: access,
    datatokenAddress: '',
    providerUrl,
    timeout
  }

  const newDdo: DDO = {
    '@context': [''],
    id: '',
    version: '4.0.0',
    created: ddo ? ddo.created : currentTime,
    updated: '',
    chainId: ddo ? ddo.chainId : 1,
    status: {
      state: 1
    },
    files: files as FileMetadata[],
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
