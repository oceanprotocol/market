import { FileInfo } from '@oceanprotocol/lib'
import * as Yup from 'yup'
import web3 from 'web3'
import { testLinks } from '../../../@utils/yup'
import { AlgorithmConsumerParameter } from '@components/Publish/_types'
import { SchemaLike } from 'yup/lib/types'
import { paramTypes } from '@components/@shared/FormInput/InputElement/ConsumerParameters'

const validationConsumerParameters: {
  [key in keyof AlgorithmConsumerParameter]: SchemaLike
} = {
  name: Yup.string()
    .test('unique', 'Parameter names must be unique', (name, context) => {
      // TODO: revert any
      // from is not yet correctly typed: https://github.com/jquense/yup/issues/398#issuecomment-916693907
      const [parentFormObj, nextParentFormObj] = (context as any).from
      if (
        !nextParentFormObj?.value?.consumerParameters ||
        nextParentFormObj.value.consumerParameters.length === 1
      )
        return true

      const { consumerParameters } = nextParentFormObj.value
      const occasions = consumerParameters.filter(
        (params) => params.name === name
      )
      return occasions.length === 1
    })
    .required('Required'),
  type: Yup.string().oneOf(paramTypes).required('Required'),
  description: Yup.string().required('Required'),
  label: Yup.string().required('Required'),
  required: Yup.string().oneOf(['optional', 'required']).required('Required'),
  default: Yup.mixed().when('required', {
    is: 'optional',
    then: Yup.mixed()
      .nullable()
      .transform((value) => value || null),
    otherwise: Yup.mixed().required('Required')
  }),
  options: Yup.array().when('type', {
    is: 'select',
    then: Yup.array()
      .of(Yup.object())
      .min(1, 'At least one option needs to be defined')
      .required('Required'),
    otherwise: Yup.array()
  })
}

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
  consumerParameters: Yup.array().of(
    Yup.object().shape(validationConsumerParameters)
  ),
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
