import { ComputePrivacy } from '../@types/ComputePrivacy'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  allowRawAlgorithm: Yup.boolean().required('Required'),
  allowNetworkAccess: Yup.boolean().required('Required'),
  trustedAlgorithms: Yup.array().required('Required')
})

export function getInitialValues(compute: ComputePrivacy): ComputePrivacy {
  return {
    allowRawAlgorithm: compute.allowRawAlgorithm,
    allowNetworkAccess: compute.allowNetworkAccess,
    trustedAlgorithms: compute.trustedAlgorithms
  }
}
