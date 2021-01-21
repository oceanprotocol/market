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

export function millisecondsToStr(milliseconds: number): string {
  if (milliseconds === 0) return 'Forever'

  let temp = Math.floor(milliseconds / 1000)
  const years = Math.floor(temp / 31536000)
  const weeks = Math.floor((temp %= 31536000) / 604800)
  const days = Math.floor((temp %= 604800) / 86400)
  const hours = Math.floor((temp %= 86400) / 3600)
  const minutes = Math.floor((temp %= 3600) / 60)
  const seconds = temp % 60

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

export function checkIfTimeoutInPredefinedValues(timeout: string): boolean {
  const predefinedValues = ['Forever', '1 day', '1 week', '1 month', '1 year']
  if (predefinedValues.indexOf(timeout) > -1) {
    return true
  }
  return false
}

export function mapSecondsToTimeoutString(seconds: number): string {
  const milliseconds = seconds * 1000
  return millisecondsToStr(milliseconds)
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
