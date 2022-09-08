import { FileInfo, Metadata, ServiceComputeOptions } from '@oceanprotocol/lib'
import { secondsToString } from '@utils/ddo'
import * as Yup from 'yup'
import { ComputeEditForm, MetadataEditForm } from './_types'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .max(512, (param) => `Title must be less than ${param.max} characters`)
    .required('Required'),
  description: Yup.string()
    .required('Required')
    .min(10, (param) => `Description must be at least ${param.min} characters`)
    .max(
      7000,
      (param) => `Description must be less than ${param.max} characters`
    ),
  price: Yup.number().required('Required'),
  links: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: Yup.string()
          .min(1, `At least one file is required.`)
          .max(512, (param) => `URL must be less than ${param.max} characters`)
          .url('Must be a valid URL.'),
        valid: Yup.boolean()
      })
    )
    .nullable(),
  files: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: Yup.string()
          .min(1, `At least one file is required.`)
          .max(512, (param) => `URL must be less than ${param.max} characters`)
          .url('Must be a valid URL.'),
        valid: Yup.boolean()
      })
    )
    .nullable(),
  timeout: Yup.string().required('Required'),
  author: Yup.string()
    .max(256, (param) => `Author must have maximum ${param.max} characters`)
    .required('Required')
})

export function getInitialValues(
  metadata: Metadata,
  timeout: number,
  price: string
): Partial<MetadataEditForm> {
  return {
    name: metadata?.name,
    description: metadata?.description,
    price,
    links: metadata?.links,
    files: [{ url: '', type: '' }],
    timeout: secondsToString(timeout),
    author: metadata?.author
  }
}

export const computeSettingsValidationSchema = Yup.object().shape({
  allowAllPublishedAlgorithms: Yup.boolean().nullable(),
  publisherTrustedAlgorithms: Yup.array().nullable(),
  publisherTrustedAlgorithmPublishers: Yup.array().nullable()
})

export function getComputeSettingsInitialValues({
  publisherTrustedAlgorithms,
  publisherTrustedAlgorithmPublishers
}: ServiceComputeOptions): ComputeEditForm {
  const allowAllPublishedAlgorithms = publisherTrustedAlgorithms === null
  const publisherTrustedAlgorithmsForForm = allowAllPublishedAlgorithms
    ? null
    : publisherTrustedAlgorithms.map((algo) => algo.did)

  return {
    allowAllPublishedAlgorithms,
    publisherTrustedAlgorithms: publisherTrustedAlgorithmsForForm,
    publisherTrustedAlgorithmPublishers
  }
}
