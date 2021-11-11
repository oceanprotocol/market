import React from 'react'
import * as Yup from 'yup'
import { allowDynamicPricing, allowFixedPricing } from '../../../app.config.js'
import { FormPublishData, StepContent } from './_types'
import content from '../../../content/publish/form.json'
import PricingFields from './Pricing'
import MetadataFields from './Metadata'
import ServicesFields from './Services'
import Preview from './Preview'

export const wizardSteps: StepContent[] = [
  {
    step: 1,
    title: content.metadata.title,
    component: <MetadataFields />
  },
  {
    step: 2,
    title: content.services.title,
    component: <ServicesFields />
  },
  {
    step: 3,
    title: content.pricing.title,
    component: <PricingFields />
  },
  {
    step: 4,
    title: content.preview.title,
    component: <Preview />
  }
]

export const initialValues: FormPublishData = {
  stepCurrent: 1,
  chainId: 1,
  accountId: '',
  metadata: {
    type: 'dataset',
    name: '',
    author: '',
    description: '',
    tags: '',
    links: [],
    termsAndConditions: false
  },
  services: [
    {
      files: [],
      dataTokenOptions: { name: '', symbol: '' },
      timeout: '',
      access: '',
      providerUrl: 'https://provider.oceanprotocol.com'
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
  type: Yup.string()
    .matches(/dataset|algorithm/g, { excludeEmptyString: true })
    .required('Required'),
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
  files: Yup.array<string[]>()
    .required('Enter a valid URL and click "ADD FILE"')
    .nullable(),
  links: Yup.array<string[]>().nullable(),
  dataTokenOptions: Yup.object().shape({
    name: Yup.string(),
    symbol: Yup.string()
  }),
  timeout: Yup.string().required('Required'),
  access: Yup.string()
    .matches(/compute|download/g, { excludeEmptyString: true })
    .required('Required'),
  providerUrl: Yup.string().url().nullable()
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

// export const validationSchema: Yup.SchemaOf<FormPublishData> =
export const validationSchema: Yup.SchemaOf<any> = Yup.object().shape({
  stepCurrent: Yup.number(),
  chainId: Yup.number(),
  accountId: Yup.string(),
  metadata: Yup.object().shape(validationMetadata),
  services: Yup.array().of(Yup.object().shape(validationService)),
  pricing: Yup.object().shape(validationPricing)
})

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
