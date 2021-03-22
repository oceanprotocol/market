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
  ddo: DDO,
  ocean: Ocean
): Promise<ServiceComputePrivacy> {
  // pass through allowRawAlgorithm & allowNetworkAccess from DDO
  const { allowRawAlgorithm, allowNetworkAccess } = ddo.findServiceByType(
    'compute'
  ).attributes.main.privacy

  const publisherTrustedAlgorithms = await createTrustedAlgorithmList(
    values.publisherTrustedAlgorithms,
    ocean
  )

  const privacy: ServiceComputePrivacy = {
    allowNetworkAccess,
    allowRawAlgorithm,
    // TODO: ocean.js needs allowAllAlgoritms setting
    // allowAllAlgoritms: values.allowAllAlgoritms,
    publisherTrustedAlgorithms
  }

  return privacy
}
