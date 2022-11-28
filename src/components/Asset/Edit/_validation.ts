import { FileInfo } from '@oceanprotocol/lib'
import * as Yup from 'yup'
import web3 from 'web3'
import { testLinks } from '../../../@utils/yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string().required('Required').min(10),
  price: Yup.number().required('Required'),
  files: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: testLinks(true),
        valid: Yup.boolean().test((value, context) => {
          const { type } = context.parent
          // allow user to submit if the value type is hidden
          if (type === 'hidden') return true
          return value || false
        })
      })
    )
    .nullable(),
  links: Yup.array<FileInfo[]>().of(
    Yup.object().shape({
      url: testLinks(true),
      valid: Yup.boolean().test((value, context) => {
        // allow user to submit if the value is null
        const { valid, url } = context.parent
        // allow user to continue if the url is empty
        if (!url) return true
        return valid
      })
    })
  ),
  timeout: Yup.string().required('Required'),
  author: Yup.string().nullable(),
  tags: Yup.array<string[]>().nullable(),
  paymentCollector: Yup.string().test(
    'ValidAddress',
    'Must be a valid Ethereum Address.',
    (value) => {
      return web3.utils.isAddress(value)
    }
  ),
  retireAsset: Yup.string()
})

export const computeSettingsValidationSchema = Yup.object().shape({
  allowAllPublishedAlgorithms: Yup.boolean().nullable(),
  publisherTrustedAlgorithms: Yup.array().nullable(),
  publisherTrustedAlgorithmPublishers: Yup.array().nullable()
})
