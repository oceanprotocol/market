import { secondsToString } from '@utils/ddo'
import { EditableMetadataLinks } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string().required('Required').min(10),
  price: Yup.number().required('Required'),
  links: Yup.array<EditableMetadataLinks[]>().nullable(),
  timeout: Yup.string().required('Required'),
  author: Yup.string().nullable()
})

export function getInitialValues(
  metadata: MetadataMarket,
  timeout: number,
  price: number
): Partial<MetadataEditForm> {
  return {
    name: metadata.main.name,
    description: metadata.additionalInformation.description,
    price,
    timeout: secondsToString(timeout),
    author: metadata.main.author
  }
}

// export const validationSchema: Yup.SchemaOf<ComputePrivacyForm> =
//   Yup.object().shape({
//     allowAllPublishedAlgorithms: Yup.boolean().nullable(),
//     publisherTrustedAlgorithms: Yup.array().nullable()
//   })

// export function getInitialValues(
//   compute: ServiceComputePrivacy
// ): ComputePrivacyForm {
//   // TODO: ocean.js needs allowAllAlgoritms setting
//   const { allowAllPublishedAlgorithms, publisherTrustedAlgorithms } = compute

//   const publisherTrustedAlgorithmsForForm = (
//     publisherTrustedAlgorithms || []
//   ).map((algo) => algo.did)

//   return {
//     allowAllPublishedAlgorithms,
//     publisherTrustedAlgorithms: publisherTrustedAlgorithmsForForm
//   }
// }
