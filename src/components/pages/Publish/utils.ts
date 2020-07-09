import { PublishFormData } from '../../../models/PublishForm'
import { MetaDataMarket } from '../../../@types/MetaData'
import { toStringNoMS } from '../../../utils'
import AssetModel from '../../../models/Asset'
import web3Utils from 'web3-utils'

export function transformPublishFormToMetadata(
  data: PublishFormData
): MetaDataMarket {
  const currentTime = toStringNoMS(new Date())

  const {
    name,
    price,
    author,
    license,
    description,
    copyrightHolder,
    tags,
    termsAndConditions,
    files,
    dateRange,
    access
  } = data

  const metadata: MetaDataMarket = {
    main: {
      ...AssetModel.main,
      name,
      price: web3Utils.toWei(price.toString()),
      author,
      dateCreated: currentTime,
      datePublished: currentTime,
      files,
      license
    },
    // ------- additional information -------
    additionalInformation: {
      ...AssetModel.additionalInformation,
      description,
      copyrightHolder,
      tags: tags?.split(','),
      termsAndConditions,
      access: access || 'Download'
    },
    // ------- curation -------
    curation: AssetModel.curation
  }

  if (dateRange) {
    const newDateRange = JSON.parse(dateRange)
    if (newDateRange.length > 1) {
      metadata.additionalInformation.dateRange = JSON.parse(dateRange)
    } else if (newDateRange.length === 1) {
      // eslint-disable-next-line prefer-destructuring
      metadata.main.dateCreated = newDateRange[0]
    }
  }

  return metadata
}
