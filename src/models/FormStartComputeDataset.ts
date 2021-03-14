import { ServiceComputePrivacy } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  publisherTrustedAlgorithms: Yup.array().required('Required')
})

export function getInitialValues(compute: ServiceComputePrivacy) {
  return {
    publisherTrustedAlgorithms: compute.publisherTrustedAlgorithms
  }
}
