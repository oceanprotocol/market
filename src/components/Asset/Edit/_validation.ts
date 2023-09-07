import { FileInfo } from '@oceanprotocol/lib'
import * as Yup from 'yup'
import { isAddress } from 'ethers/lib/utils'
import { testLinks } from '@utils/yup'
import { validationConsumerParameters } from '@shared/FormInput/InputElement/ConsumerParameters/_validation'

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
  usesConsumerParameters: Yup.boolean(),
  consumerParameters: Yup.array().when('usesConsumerParameters', {
    is: true,
    then: Yup.array()
      .of(Yup.object().shape(validationConsumerParameters))
      .required('Required'),
    otherwise: Yup.array()
      .nullable()
      .transform((value) => value || null)
  }),
  paymentCollector: Yup.string().test(
    'ValidAddress',
    'Must be a valid Ethereum Address.',
    (value) => {
      return isAddress(value)
    }
  ),
  retireAsset: Yup.string(),
  service: Yup.object().shape({
    usesConsumerParameters: Yup.boolean(),
    consumerParameters: Yup.array().when('usesConsumerParameters', {
      is: true,
      then: Yup.array()
        .of(Yup.object().shape(validationConsumerParameters))
        .required('Required'),
      otherwise: Yup.array()
        .nullable()
        .transform((value) => value || null)
    })
  })
})

export const computeSettingsValidationSchema = Yup.object().shape({
  allowAllPublishedAlgorithms: Yup.boolean().nullable(),
  publisherTrustedAlgorithms: Yup.array().nullable(),
  publisherTrustedAlgorithmPublishers: Yup.array().nullable()
})
