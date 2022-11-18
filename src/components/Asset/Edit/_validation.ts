import { FileInfo } from '@oceanprotocol/lib'
import * as Yup from 'yup'
import web3 from 'web3'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string().required('Required').min(10),
  price: Yup.number().required('Required'),
  files: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: Yup.string()
          .url('Must be a valid URL.')
          .test(
            'GoogleNotSupported',
            'Google Drive is not a supported hosting service. Please use an alternative.',
            (value) => {
              return !value?.toString().includes('drive.google')
            }
          ),
        valid: Yup.boolean().isTrue()
      })
    )
    .nullable(),
  links: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: Yup.string()
          .url('Must be a valid URL.')
          .test(
            'GoogleNotSupported',
            'Google Drive is not a supported hosting service. Please use an alternative.',
            (value) => {
              return !value?.toString().includes('drive.google')
            }
          ),
        valid: Yup.boolean().isTrue()
      })
    )
    .nullable(),
  timeout: Yup.string().required('Required'),
  author: Yup.string().nullable(),
  tags: Yup.array<string[]>().nullable(),
  paymentCollector: Yup.string().test(
    'ValidAddress',
    'Must be a valid Ethereum Address.',
    (value) => {
      return web3.utils.isAddress(value)
    }
  )
})

export const computeSettingsValidationSchema = Yup.object().shape({
  allowAllPublishedAlgorithms: Yup.boolean().nullable(),
  publisherTrustedAlgorithms: Yup.array().nullable(),
  publisherTrustedAlgorithmPublishers: Yup.array().nullable()
})
