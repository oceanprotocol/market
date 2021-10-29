import { File as FileMetadata } from '@oceanprotocol/lib'
import * as Yup from 'yup'
import { allowDynamicPricing, allowFixedPricing } from '../../../app.config.js'
import { FormPublishData } from './_types'

export const initialValues: Partial<FormPublishData> = {
  step: 1,
  type: 'dataset',
  metadata: {
    name: '',
    author: '',
    description: '',
    tags: '',
    termsAndConditions: false
  },
  services: [
    {
      files: [],
      links: [],
      dataTokenOptions: { name: '', symbol: '' },
      timeout: 'Forever',
      access: '',
      providerUri: ''
    }
  ],
  pricing: {
    price: 1,
    type:
      allowDynamicPricing === 'true'
        ? 'dynamic'
        : allowFixedPricing === 'true'
        ? 'fixed'
        : 'free',
    amountDataToken: allowDynamicPricing === 'true' ? 50 : 1000,
    amountOcean: 50,
    weightOnOcean: '5', // 50% on OCEAN
    weightOnDataToken: '5', // 50% on datatoken
    swapFee: 0.1 // in %
  }
}

const validationMetadata = {
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string()
    .min(10, (param) => `Description must be at least ${param.min} characters`)
    .required('Required'),
  author: Yup.string().required('Required'),
  tags: Yup.string().nullable(),
  termsAndConditions: Yup.boolean().required('Required')
}

const validationService = {
  files: Yup.array<FileMetadata>()
    .required('Enter a valid URL and click "ADD FILE"')
    .nullable(),
  links: Yup.array<FileMetadata[]>().nullable(),
  dataTokenOptions: Yup.object()
    .shape({
      name: Yup.string(),
      symbol: Yup.string()
    })
    .required('Required'),
  timeout: Yup.string().required('Required'),
  type: Yup.string()
    .matches(/Dataset|Algorithm/g, { excludeEmptyString: true })
    .required('Required'),
  access: Yup.string()
    .matches(/Compute|Download/g, { excludeEmptyString: true })
    .required('Required'),
  providerUri: Yup.string().url().nullable()
}

const validationPricing = {
  price: Yup.number()
    .min(1, (param) => `Must be more or equal to ${param.min}`)
    .required('Required'),
  amountDataToken: Yup.number()
    .min(9, (param) => `Must be more or equal to ${param.min}`)
    .required('Required'),
  amountOcean: Yup.number()
    .min(21, (param) => `Must be more or equal to ${param.min}`)
    .required('Required'),
  type: Yup.string()
    .matches(/fixed|dynamic|free/g, { excludeEmptyString: true })
    .required('Required'),
  weightOnDataToken: Yup.string().required('Required'),
  weightOnOcean: Yup.string().required('Required'),
  swapFee: Yup.number()
    .min(0.1, (param) => `Must be more or equal to ${param.min}`)
    .max(10, 'Maximum is 10%')
    .required('Required')
    .nullable()
}

export const validationSchema: Yup.SchemaOf<FormPublishData> = Yup.object()
  .shape({
    metadata: Yup.object().shape(validationMetadata),
    services: Yup.array().of(Yup.object().shape(validationService)),
    pricing: Yup.object().shape(validationPricing)
  })
  .defined()

// export const validationSchemaAlgo: Yup.SchemaOf<MetadataPublishFormAlgorithm> =
//   Yup.object()
//     .shape({
//       // ---- required fields ----
//       name: Yup.string()
//         .min(4, (param) => `Title must be at least ${param.min} characters`)
//         .required('Required'),
//       description: Yup.string().min(10).required('Required'),
//       files: Yup.array<FileMetadata>().required('Required').nullable(),
//       timeout: Yup.string().required('Required'),
//       dataTokenOptions: Yup.object()
//         .shape({
//           name: Yup.string(),
//           symbol: Yup.string()
//         })
//         .required('Required'),
//       dockerImage: Yup.string()
//         .matches(/node:latest|python:latest|custom image/g, {
//           excludeEmptyString: true
//         })
//         .required('Required'),
//       image: Yup.string().required('Required'),
//       containerTag: Yup.string().required('Required'),
//       entrypoint: Yup.string().required('Required'),
//       author: Yup.string().required('Required'),
//       termsAndConditions: Yup.boolean().required('Required'),
//       // ---- optional fields ----
//       algorithmPrivacy: Yup.boolean().nullable(),
//       tags: Yup.string().nullable(),
//       links: Yup.array<FileMetadata[]>().nullable()
//     })
//     .defined()

// export const initialValuesAlgo: Partial<MetadataPublishFormAlgorithm> = {
//   name: '',
//   author: '',
//   dataTokenOptions: {
//     name: '',
//     symbol: ''
//   },
//   dockerImage: 'node:latest',
//   image: 'node',
//   containerTag: 'latest',
//   entrypoint: 'node $ALGO',
//   files: '',
//   description: '',
//   algorithmPrivacy: false,
//   termsAndConditions: false,
//   tags: '',
//   timeout: 'Forever',
//   providerUri: ''
// }
