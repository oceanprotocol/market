import { ServiceComputePrivacy } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export interface ComputePrivacyForm {
  allowAllAlgorithms: boolean
  publisherTrustedAlgorithms: string[]
}

export const validationSchema: Yup.SchemaOf<ComputePrivacyForm> = Yup.object().shape(
  {
    allowAllAlgorithms: Yup.boolean().nullable(),
    publisherTrustedAlgorithms: Yup.array().nullable()
  }
)

export function getInitialValues(
  compute: ServiceComputePrivacy
): ComputePrivacyForm {
  const { allowAllAlgorithms, publisherTrustedAlgorithms } = compute

  const publisherTrustedAlgorithmsForForm = (
    publisherTrustedAlgorithms || []
  ).map((algo) => algo.did)

  return {
    allowAllAlgorithms,
    publisherTrustedAlgorithms: publisherTrustedAlgorithmsForForm
  }
}
