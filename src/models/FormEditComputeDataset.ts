import { ServiceComputePrivacy } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema: Yup.SchemaOf<ServiceComputePrivacy> = Yup.object().shape(
  {
    allowRawAlgorithm: Yup.boolean(),
    allowNetworkAccess: Yup.boolean().nullable(),
    publisherTrustedAlgorithms: Yup.array()
  }
)

export function getInitialValues(
  compute: ServiceComputePrivacy
): ServiceComputePrivacy {
  return {
    allowRawAlgorithm: compute.allowRawAlgorithm,
    allowNetworkAccess: compute.allowNetworkAccess,
    publisherTrustedAlgorithms: compute.publisherTrustedAlgorithms
  }
}
