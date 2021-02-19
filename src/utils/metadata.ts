import {
  MetadataMarket,
  MetadataPublishFormDataset,
  MetadataPublishFormAlgorithm
} from '../@types/MetaData'
import { toStringNoMS } from '.'
import AssetModel from '../models/Asset'
import slugify from '@sindresorhus/slugify'
import { DDO, MetadataAlgorithm } from '@oceanprotocol/lib'

export function transformTags(value: string): string[] {
  const originalTags = value?.split(',')
  const transformedTags = originalTags?.map((tag) => slugify(tag).toLowerCase())
  return transformedTags
}

export function mapTimeoutStringToSeconds(timeout: string): number {
  switch (timeout) {
    case 'Forever':
      return 0
    case '1 day':
      return 86400
    case '1 week':
      return 604800
    case '1 month':
      return 2630000
    case '1 year':
      return 31556952
    default:
      return 0
  }
}

function numberEnding(number: number): string {
  return number > 1 ? 's' : ''
}

export function secondsToString(numberOfSeconds: number): string {
  if (numberOfSeconds === 0) return 'Forever'

  const years = Math.floor(numberOfSeconds / 31536000)
  const weeks = Math.floor((numberOfSeconds %= 31536000) / 604800)
  const days = Math.floor((numberOfSeconds %= 604800) / 86400)
  const hours = Math.floor((numberOfSeconds %= 86400) / 3600)
  const minutes = Math.floor((numberOfSeconds %= 3600) / 60)
  const seconds = numberOfSeconds % 60

  return years
    ? `${years} year${numberEnding(years)}`
    : weeks
    ? `${weeks} week${numberEnding(weeks)}`
    : days
    ? `${days} day${numberEnding(days)}`
    : hours
    ? `${hours} hour${numberEnding(hours)}`
    : minutes
    ? `${minutes} minute${numberEnding(minutes)}`
    : seconds
    ? `${seconds} second${numberEnding(seconds)}`
    : 'less than a second'
}

export function checkIfTimeoutInPredefinedValues(
  timeout: string,
  timeoutOptions: string[]
): boolean {
  if (timeoutOptions.indexOf(timeout) > -1) {
    return true
  }
  return false
}

function getAlgoithComponent(
  image: string,
  version: string,
  entrypoint: string,
  algorithmLanguace: string
): MetadataAlgorithm {
  return {
    language: algorithmLanguace,
    format: 'docker-image',
    version: '0.1',
    container: {
      entrypoint: entrypoint,
      image: image,
      tag: version
    }
  }
}

function getAlgoithFileExtension(fileUrl: string): string {
  const splitedFileUrl = fileUrl.split('.')
  return splitedFileUrl[splitedFileUrl.length - 1]
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
  }: Partial<MetadataPublishFormDataset>,
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

export function transformPublishAlgorithmFormToMetadata(
  {
    name,
    author,
    description,
    tags,
    dockerImage,
    image,
    version,
    entrypoint,
    termsAndConditions,
    files
  }: Partial<MetadataPublishFormAlgorithm>,
  ddo?: DDO
): MetadataMarket {
  const currentTime = toStringNoMS(new Date())
  const fileUrl = typeof files !== 'string' && files[0].url
  const algorithmLanguace = getAlgoithFileExtension(fileUrl)
  const algorithm = getAlgoithComponent(
    image,
    version,
    entrypoint,
    algorithmLanguace
  )
  const metadata: MetadataMarket = {
    main: {
      ...AssetModel.main,
      name,
      type: 'algorithm',
      author,
      dateCreated: ddo ? ddo.created : currentTime,
      files: typeof files !== 'string' && files,
      license: 'https://market.oceanprotocol.com/terms',
      algorithm: algorithm
    },
    additionalInformation: {
      ...AssetModel.additionalInformation,
      description,
      tags: transformTags(tags),
      termsAndConditions
    }
  }

  return metadata
}
