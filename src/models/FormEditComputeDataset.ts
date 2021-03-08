import { ServiceComputePrivacy } from '@oceanprotocol/lib'
import { ComputePrivacy } from '../@types/ComputePrivacy'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  allowRawAlgorithm: Yup.boolean().nullable(),
  allowNetworkAccess: Yup.boolean().nullable(),
  publisherTrustedAlgorithms: Yup.array().required('Required')
})

export function getInitialValues(compute: ServiceComputePrivacy) {
  return {
    allowRawAlgorithm: compute.allowRawAlgorithm,
    allowNetworkAccess: compute.allowNetworkAccess,
    publisherTrustedAlgorithms: compute.publisherTrustedAlgorithms[0].did
  }
}
