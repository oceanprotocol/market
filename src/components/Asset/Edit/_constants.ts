import { Metadata, ServiceComputeOptions } from '@oceanprotocol/lib'
import { secondsToString } from '@utils/ddo'
import { ComputeEditForm, MetadataEditForm } from './_types'

export function getInitialValues(
  metadata: Metadata,
  timeout: number,
  price: string
): Partial<MetadataEditForm> {
  return {
    name: metadata?.name,
    description: metadata?.description,
    price,
    storageType: 'url' || 'ipfs' || 'arweave',
    links: [{ url: '', type: 'url' }],
    files: [{ url: '', type: 'url' }],
    timeout: secondsToString(timeout),
    author: metadata?.author,
    tags: metadata?.tags
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
