import { MetadataMarket, MetadataPublishForm } from '../../../@types/Metadata'
import { toStringNoMS } from '../../../utils'
import AssetModel from '../../../models/Asset'
import web3Utils from 'web3-utils'

export function transformPublishFormToMetadata(
  data: MetadataPublishForm
): MetadataMarket {
  const currentTime = toStringNoMS(new Date())

  const {
    name,
    price,
    author,
    license,
    description,
    copyrightHolder,
    tags,
    links,
    termsAndConditions,
    files,
    access
  } = data

  const metadata: MetadataMarket = {
    main: {
      ...AssetModel.main,
      name,
      price: `${web3Utils.toWei(price.toString())}`,
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
      tags: tags?.split(','),
      // links: {
      //   url: links
      // },
      termsAndConditions,
      access: access || 'Download'
    },
    curation: AssetModel.curation
  }

  return metadata
}
