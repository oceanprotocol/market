import { FileInfo, Metadata, ServiceComputeOptions } from '@oceanprotocol/lib'
import { secondsToString } from '@utils/ddo'
import * as Yup from 'yup'
import { MetadataEditForm } from './_types'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string().required('Required').min(10),
  price: Yup.number().required('Required'),
  links: Yup.array<any[]>().nullable(),
  files: Yup.array<FileInfo[]>().nullable(),
  timeout: Yup.string().required('Required'),
  author: Yup.string().nullable()
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
    files: '',
    timeout: secondsToString(timeout),
    author: metadata?.author
  }
}

export const computeSettingsValidationSchema = Yup.object().shape({
  allowAllPublishedAlgorithms: Yup.boolean().nullable(),
  publisherTrustedAlgorithms: Yup.array().nullable()
})

export function getComputeSettingsInitialValues(
  compute: ServiceComputeOptions
): ComputePrivacyForm {
  const { publisherTrustedAlgorithmPublishers, publisherTrustedAlgorithms } =
    compute
  const allowAllPublishedAlgorithms = !(
    publisherTrustedAlgorithms?.length > 0 ||
    publisherTrustedAlgorithmPublishers?.length > 0
  )

  const publisherTrustedAlgorithmsForForm = (
    publisherTrustedAlgorithms || []
  ).map((algo) => algo.did)

  // TODO: should we add publisherTrustedAlgorithmPublishers to the form?

  return {
    allowAllPublishedAlgorithms,
    publisherTrustedAlgorithms: publisherTrustedAlgorithmsForForm
  }
}
