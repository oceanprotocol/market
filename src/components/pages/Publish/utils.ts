import { MetadataMarket, MetadataPublishForm } from '../../../@types/MetaData'
import { toStringNoMS } from '../../../utils'
import AssetModel from '../../../models/Asset'
import slugify from '@sindresorhus/slugify'

export function transformTags(value: string): string[] {
  const originalTags = value?.split(',')
  const transformedTags = originalTags?.map((tag) => slugify(tag).toLowerCase())
  return transformedTags
}

export function transformPublishFormToMetadata(
  data: Partial<MetadataPublishForm>
): MetadataMarket {
  const currentTime = toStringNoMS(new Date())

  const {
    name,
    author,
    license,
    description,
    copyrightHolder,
    tags,
    links,
    termsAndConditions,
    files
  } = data

  const metadata: MetadataMarket = {
    main: {
      ...AssetModel.main,
      name,
      author,
      dateCreated: currentTime,
      datePublished: currentTime,
      files: typeof files !== 'string' && files,
      license
    },
    additionalInformation: {
      ...AssetModel.additionalInformation,
      description,
      copyrightHolder,
      tags: transformTags(tags),
      links: typeof links !== 'string' && links,
      termsAndConditions
    }
  }

  return metadata
}
