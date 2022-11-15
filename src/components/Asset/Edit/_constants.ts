import {
  Metadata,
  ServiceComputeOptions,
  getPaymentCollector
} from '@oceanprotocol/lib'
import { secondsToString } from '@utils/ddo'
import { ComputeEditForm, MetadataEditForm } from './_types'

export async function getInitialValues(
  owner: string,
  metadata: Metadata,
  timeout: number,
  price: string
): Promise<Partial<MetadataEditForm>> {
  const paymentCollector = await getPaymentCollector(owner)
  return {
    name: metadata?.name,
    description: metadata?.description,
    price,
    links: [{ url: '', type: '' }],
    files: [{ url: '', type: '' }],
    timeout: secondsToString(timeout),
    author: metadata?.author,
    tags: metadata?.tags,
    paymentCollector
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
