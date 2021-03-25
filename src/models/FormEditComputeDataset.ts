import { ServiceComputePrivacy } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export interface ComputePrivacyForm {
  allowAllPublishedAlgorithms: boolean
  publisherTrustedAlgorithms: string[]
}

export const validationSchema: Yup.SchemaOf<ComputePrivacyForm> = Yup.object().shape(
  {
    allowAllPublishedAlgorithms: Yup.boolean().nullable(),
    publisherTrustedAlgorithms: Yup.array().nullable()
  }
)

export function getInitialValues(
  compute: ServiceComputePrivacy
): ComputePrivacyForm {
  // TODO: ocean.js needs allowAllAlgoritms setting
  const { allowAllPublishedAlgorithms, publisherTrustedAlgorithms } = compute

  const publisherTrustedAlgorithmsForForm = (
    publisherTrustedAlgorithms || []
  ).map((algo) => algo.did)

  return {
    allowAllPublishedAlgorithms,
    publisherTrustedAlgorithms: publisherTrustedAlgorithmsForForm
  }
}
