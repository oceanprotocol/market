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
  ddo?: DdoMarket
): DdoMarket {
  const currentTime = dateToStringNoMS(new Date())
  const { type } = data
  const { name, description, tags, author, termsAndConditions } = data.metadata
  const { files, links, image, containerTag, entrypoint, providerUri } =
    data.services[0]

  const fileUrl = typeof files !== 'string' && files[0].url
  const algorithmLanguage = getAlgorithmFileExtension(fileUrl)
  const algorithm = getAlgorithmComponent(
    image,
    containerTag,
    entrypoint,
    algorithmLanguage
  )

  const service = {
    files: typeof files !== 'string' && files,
    links: typeof links !== 'string' ? links : [],
    ...(type === 'algorithm' && { ...algorithm })
  }

  const newDdo: DdoMarket = {
    metadata: {
      name,
      description,
      tags: transformTags(tags),
      author,
      dateCreated: ddo ? ddo.metadata.dateCreated : currentTime,
      datePublished: '',
      termsAndConditions,
      license: 'https://market.oceanprotocol.com/terms'
    },
    services: [service]
  }

  return newDdo
}
