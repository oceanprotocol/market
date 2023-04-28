import { Metadata, ServiceComputeOptions } from '@oceanprotocol/lib'
import { secondsToString } from '@utils/ddo'
import { ComputeEditForm, MetadataEditForm } from './_types'
import {
  AlgorithmConsumerParameter,
  MetadataAlgorithmExtended
} from '@components/Publish/_types'

function parseConsumerParameters(
  consumerParameters: AlgorithmConsumerParameter[]
): AlgorithmConsumerParameter[] {
  if (!consumerParameters?.length) return []

  return consumerParameters.map((param) =>
    param.type === 'select'
      ? {
          ...param,
          options: JSON.parse(param.options as string)
        }
      : param.type === 'number'
      ? { ...param, default: Number(param.default) }
      : param.type === 'boolean'
      ? { ...param, default: param.default === 'true' }
      : param
  )
}

export function getInitialValues(
  metadata: Metadata & { algorithm?: MetadataAlgorithmExtended },
  timeout: number,
  price: string,
  paymentCollector: string,
  assetState: string
): Partial<MetadataEditForm> {
  return {
    name: metadata?.name,
    description: metadata?.description,
    price,
    links: [{ url: '', type: 'url' }],
    files: [{ url: '', type: 'ipfs' }],
    timeout: secondsToString(timeout),
    author: metadata?.author,
    tags: metadata?.tags,
    usesConsumerParameters: metadata?.algorithm?.consumerParameters?.length > 0,
    consumerParameters: parseConsumerParameters(
      metadata?.algorithm?.consumerParameters
    ),
    paymentCollector,
    assetState
  }
}

export function getComputeSettingsInitialValues({
  publisherTrustedAlgorithms,
  publisherTrustedAlgorithmPublishers
}: ServiceComputeOptions): ComputeEditForm {
  const allowAllPublishedAlgorithms = publisherTrustedAlgorithms === null
  const publisherTrustedAlgorithmsForForm = allowAllPublishedAlgorithms
    ? null
    : publisherTrustedAlgorithms.map((algo) => algo.did)

  return {
    allowAllPublishedAlgorithms,
    publisherTrustedAlgorithms: publisherTrustedAlgorithmsForForm,
    publisherTrustedAlgorithmPublishers
  }
}
