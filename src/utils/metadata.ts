import { MetadataMarket, MetadataPublishForm } from '../@types/MetaData'
import { toStringNoMS } from '.'
import AssetModel from '../models/Asset'
import slugify from '@sindresorhus/slugify'
import { DDO } from '@oceanprotocol/lib'

export function transformTags(value: string): string[] {
  const originalTags = value?.split(',')
  const transformedTags = originalTags?.map((tag) => slugify(tag).toLowerCase())
  return transformedTags
}

export function transformPublishFormToMetadata(
  {
    name,
    author,
    description,
    tags,
    links,
    termsAndConditions,
    files
  }: Partial<MetadataPublishForm>,
  ddo?: DDO
): MetadataMarket {
  const currentTime = toStringNoMS(new Date())

  const metadata: MetadataMarket = {
    main: {
      ...AssetModel.main,
      name,
      author,
      dateCreated: ddo ? ddo.created : currentTime,
      files: typeof files !== 'string' && files,
      license: 'https://market.oceanprotocol.com/terms'
    },
    additionalInformation: {
      ...AssetModel.additionalInformation,
      description,
      tags: transformTags(tags),
      links: typeof links !== 'string' ? links : [],
      termsAndConditions
    }
  }

  return metadata
}
