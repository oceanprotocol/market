import axios from 'axios'
import { toast } from 'react-toastify'
import isUrl from 'is-url-superb'
import {
  MetadataMarket,
  MetadataPublishFormDataset,
  MetadataPublishFormAlgorithm
} from '../@types/MetaData'
import { toStringNoMS } from '.'
import AssetModel from '../models/Asset'
import slugify from '@sindresorhus/slugify'
import { DDO, MetadataAlgorithm, Logger } from '@oceanprotocol/lib'

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

export function mapTimeoutSecondsToString(timeout: number): string {
  switch (timeout) {
    case 0:
      return 'Forever'
    case 86400:
      return '1 day'
    case 604800:
      return '1 week'
    case 2630000:
      return '1 month'
    case 31556952:
      return '1 year'
    default:
      return 'Forever'
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
  containerTag: string,
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
      tag: containerTag
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
      datePublished: '',
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

async function isDockerHubImageValid(
  image: string,
  tag: string
): Promise<boolean> {
  try {
    const response = await axios.post(
      `https://dockerhub-proxy.oceanprotocol.com`,
      {
        image,
        tag
      }
    )
    if (
      !response ||
      response.status !== 200 ||
      response.data.status !== 'success'
    ) {
      toast.error(
        'Could not fetch docker hub image info. Please check image name and tag and try again'
      )
      return false
    }

    return true
  } catch (error) {
    Logger.error(error.message)
    toast.error(
      'Could not fetch docker hub image info. Please check image name and tag and try again'
    )
    return false
  }
}

async function is3rdPartyImageValid(imageURL: string): Promise<boolean> {
  try {
    const response = await axios.head(imageURL)
    if (!response || response.status !== 200) {
      toast.error(
        'Could not fetch docker image info. Please check URL and try again'
      )
      return false
    }
    return true
  } catch (error) {
    Logger.error(error.message)
    toast.error(
      'Could not fetch docker image info. Please check URL and try again'
    )
    return false
  }
}

export async function validateDockerImage(
  dockerImage: string,
  tag: string
): Promise<boolean> {
  const isValid = isUrl(dockerImage)
    ? await is3rdPartyImageValid(dockerImage)
    : await isDockerHubImageValid(dockerImage, tag)
  return isValid
}

export function transformPublishAlgorithmFormToMetadata(
  {
    name,
    author,
    description,
    tags,
    dockerImage,
    image,
    containerTag,
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
    containerTag,
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

function idToName(id: number): string {
  switch (id) {
    case 1:
      return 'eth'
    case 137:
      return 'polygon'
    case 3:
      return 'ropsten'
    case 4:
      return 'rinkeby'
    case 1287:
      return 'moonbase'
    default:
      return 'eth'
  }
}

export function mapChainIdsToNetworkNames(chainIds: number[]): string[] {
  const networkNames: string[] = []
  for (let i = 0; i < chainIds.length; i++) {
    const networkName = idToName(chainIds[i])
    networkNames.push(networkName)
  }
  return networkNames
}
