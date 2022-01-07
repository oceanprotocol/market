import { ProviderInstance } from '@oceanprotocol/lib'
import { mapTimeoutStringToSeconds } from '@utils/ddo'
import axios, { CancelToken, Method } from 'axios'
import { sha256 } from 'js-sha256'
import slugify from 'slugify'
import { algorithmContainerPresets } from './_constants'
import { FormPublishData } from './_types'

export function getFieldContent(
  fieldName: string,
  fields: FormFieldContent[]
): FormFieldContent {
  return fields.filter((field: FormFieldContent) => field.name === fieldName)[0]
}

function getUrlFileExtension(fileUrl: string): string {
  const splittedFileUrl = fileUrl.split('.')
  return splittedFileUrl[splittedFileUrl.length - 1]
}

function getAlgorithmContainerPreset(
  dockerImage: string
): MetadataAlgorithmContainer {
  if (dockerImage === '') return

  const preset = algorithmContainerPresets.find(
    (preset) => `${preset.image}:${preset.tag}` === dockerImage
  )
  return preset
}

function dateToStringNoMS(date: Date): string {
  return date.toISOString().replace(/\.[0-9]{3}Z/, 'Z')
}

function transformTags(value: string): string[] {
  const originalTags = value?.split(',')
  const transformedTags = originalTags?.map((tag) => slugify(tag).toLowerCase())
  return transformedTags
}

export async function transformPublishFormToDdo(
  values: FormPublishData,
  cancelToken: CancelToken,
  // Those 2 are only passed during actual publishing process
  // so we can always assume if they are not passed, we are on preview.
  datatokenAddress?: string,
  nftAddress?: string
): Promise<DDO> {
  const { metadata, services, user } = values
  const { chainId, accountId } = user
  const {
    type,
    name,
    description,
    tags,
    author,
    termsAndConditions,
    dockerImage,
    dockerImageCustom,
    dockerImageCustomTag,
    dockerImageCustomEntrypoint,
    dockerImageCustomChecksum
  } = metadata
  const { access, files, links, providerUrl, timeout } = services[0]

  const did = nftAddress ? `0x${sha256(`${nftAddress}${chainId}`)}` : '0x...'
  const currentTime = dateToStringNoMS(new Date())

  // Transform from files[0].url to string[] assuming only 1 file
  const filesTransformed = files?.length && files[0].valid && [files[0].url]
  const linksTransformed = links?.length && links[0].valid && [links[0].url]

  const newMetadata: Metadata = {
    created: currentTime,
    updated: currentTime,
    type,
    name,
    description,
    tags: transformTags(tags),
    author,
    license: 'https://market.oceanprotocol.com/terms',
    links: linksTransformed,
    additionalInformation: {
      termsAndConditions
    },
    ...(type === 'algorithm' &&
      dockerImage !== '' && {
        algorithm: {
          language: filesTransformed?.length
            ? getUrlFileExtension(filesTransformed[0])
            : '',
          version: '0.1',
          container: {
            entrypoint:
              dockerImage === 'custom'
                ? dockerImageCustomEntrypoint
                : getAlgorithmContainerPreset(dockerImage).entrypoint,
            image:
              dockerImage === 'custom'
                ? dockerImageCustom
                : getAlgorithmContainerPreset(dockerImage).image,
            tag:
              dockerImage === 'custom'
                ? dockerImageCustomTag
                : getAlgorithmContainerPreset(dockerImage).tag,
            checksum:
              dockerImage === 'custom'
                ? dockerImageCustomChecksum
                : getAlgorithmContainerPreset(dockerImage).checksum
          }
        }
      })
  }

  // Encrypt just created string[] of urls

  const filesEncrypted =
    files?.length &&
    files[0].valid &&
    (await ProviderInstance.encrypt(
      filesTransformed,
      providerUrl.url,
      (method: Method, path: string, body: string, headers: any) => {
        return axios(path, {
          method: method,
          data: body,
          headers: headers
        })
      }
    ))

  const newService: Service = {
    type: access,
    files: filesEncrypted || '',
    datatokenAddress,
    serviceEndpoint: providerUrl.url,
    timeout: mapTimeoutStringToSeconds(timeout),
    ...(access === 'compute' && {
      compute: values.services[0].computeOptions
    })
  }

  const newDdo: DDO = {
    '@context': ['https://w3id.org/did/v1'],
    id: did,
    version: '4.0.0',
    chainId,
    metadata: newMetadata,
    services: [newService],
    // Only added for DDO preview, reflecting Asset response,
    // again, we can assume if `datatokenAddress` is not passed,
    // we are on preview.
    ...(!datatokenAddress && {
      dataTokenInfo: {
        name: values.services[0].dataTokenOptions.name,
        symbol: values.services[0].dataTokenOptions.symbol
      },
      nft: {
        owner: accountId
      }
    })
  }

  return newDdo
}
