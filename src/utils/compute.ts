import {
  DDO,
  Ocean,
  ServiceComputePrivacy,
  publisherTrustedAlgorithm as PublisherTrustedAlgorithm
} from '@oceanprotocol/lib'
import { ComputePrivacyForm } from '../models/FormEditComputeDataset'

export async function createTrustedAlgorithmList(
  selectedAlgorithms: string[], // list of DIDs
  ocean: Ocean
): Promise<PublisherTrustedAlgorithm[]> {
  const trustedAlgorithms = []

  for (const selectedAlgorithm of selectedAlgorithms) {
    const trustedAlgorithm = await ocean.compute.createPublisherTrustedAlgorithmfromDID(
      selectedAlgorithm
    )
    trustedAlgorithms.push(trustedAlgorithm)
  }
  return trustedAlgorithms
}

export async function transformComputeFormToServiceComputePrivacy(
  values: ComputePrivacyForm,
  ocean: Ocean
): Promise<ServiceComputePrivacy> {
  const { allowAllPublishedAlgorithms } = values
  const publisherTrustedAlgorithms = values.allowAllPublishedAlgorithms
    ? []
    : await createTrustedAlgorithmList(values.publisherTrustedAlgorithms, ocean)

  const privacy: ServiceComputePrivacy = {
    allowNetworkAccess: false,
    allowRawAlgorithm: false,
    allowAllPublishedAlgorithms,
    publisherTrustedAlgorithms
  }

  return privacy
}
