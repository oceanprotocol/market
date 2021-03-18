import { ServiceComputePrivacy } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  allowNetworkAccess: Yup.boolean().nullable(),
  publisherTrustedAlgorithms: Yup.array().required('Required')
})

export function getInitialValues(compute: ServiceComputePrivacy) {
  return {
    allowRawAlgorithm: false,
    allowNetworkAccess: compute.allowNetworkAccess,
    publisherTrustedAlgorithms: compute.publisherTrustedAlgorithms
  }
}
